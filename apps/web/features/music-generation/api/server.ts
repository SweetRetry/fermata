/**
 * Music Generation Server API
 *
 * Business logic for music generation - called by API routes
 */

import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "@/core/db";
import { audioFiles, generationParams, generations } from "@/core/db/schema";
import { saveAudioFile } from "@/core/storage";
import { generateMusic } from "@/lib/fal-integration/client";
import type {
  CreateGenerationInput,
  CreateGenerationResponse,
  Generation,
} from "../types";

/**
 * Create a new music generation
 */
export async function createGeneration(
  input: CreateGenerationInput,
): Promise<CreateGenerationResponse> {
  const {
    title,
    prompt,
    lyrics_prompt,
    is_instrumental = true,
    audio_setting,
  } = input;

  if (!prompt || typeof prompt !== "string") {
    throw new Error("Prompt is required");
  }

  const id = randomUUID();

  // Create generation record (status only)
  await db.insert(generations).values({
    id,
    title: title || "Untitled",
    status: "pending",
  });

  // Create generation params record for traceability
  // Extract numeric values from string settings (e.g., "128000" -> 128000)
  const bitrateNum = audio_setting?.bitrate
    ? Number.parseInt(audio_setting.bitrate, 10)
    : null;
  const sampleRateNum = audio_setting?.sample_rate
    ? Number.parseInt(audio_setting.sample_rate, 10)
    : null;
  const channelsNum = audio_setting?.channel
    ? Number.parseInt(audio_setting.channel, 10)
    : null;

  // Build raw parameters JSON for complete traceability
  const rawParams = JSON.stringify({
    bitrate: audio_setting?.bitrate,
    sample_rate: audio_setting?.sample_rate,
    format: audio_setting?.format,
    channel: audio_setting?.channel,
  });

  await db.insert(generationParams).values({
    generationId: id,
    prompt,
    lyricsPrompt: lyrics_prompt,
    isInstrumental: is_instrumental,
    bitrate: Number.isNaN(bitrateNum) ? null : bitrateNum,
    sampleRate: Number.isNaN(sampleRateNum) ? null : sampleRateNum,
    channels: Number.isNaN(channelsNum) ? null : channelsNum,
    rawParameters: rawParams,
  });

  // Start generation in background
  generateMusicAsync(
    id,
    prompt,
    lyrics_prompt || "",
  );

  return {
    id,
    status: "pending",
    message: "Generation started",
  };
}

/**
 * Get a generation by ID
 * Joins with audio_files to get the public URL
 */
export async function getGeneration(id: string): Promise<Generation | null> {
  const result = await db.query.generations.findFirst({
    where: eq(generations.id, id),
    with: {
      params: true,
      audioFiles: true,
    },
  });

  if (!result) return null;

  // Get first audio file (1:1 relationship currently)
  const audioFile = result.audioFiles?.[0];
  const params = result.params;

  return {
    id: result.id,
    title: result.title,
    prompt: params?.prompt ?? "",
    lyricsPrompt: params?.lyricsPrompt ?? undefined,
    isInstrumental: params?.isInstrumental ?? true,
    status: result.status,
    audioUrl: audioFile?.publicUrl ?? undefined,
    duration: audioFile?.duration ?? undefined,
    errorMessage: result.errorMessage ?? undefined,
    createdAt: result.createdAt.toISOString(),
    updatedAt: result.updatedAt.toISOString(),
  };
}

/**
 * Async generation handler - runs in background
 */
async function generateMusicAsync(
  id: string,
  prompt: string,
  lyrics: string,
): Promise<void> {
  try {
    // Update status to generating
    await db
      .update(generations)
      .set({ status: "generating", updatedAt: new Date() })
      .where(eq(generations.id, id));

    // Call Fal API
    const result = await generateMusic({
      prompt,
      lyrics_prompt: lyrics,
    });

    // Download and save audio file
    const { filePath, publicUrl, fileSize } = await saveAudioFile(
      id,
      result.audio.url,
    );

    // Create audio file record
    const audioFileId = randomUUID();
    await db.insert(audioFiles).values({
      id: audioFileId,
      generationId: id,
      storageType: "local",
      filePath,
      publicUrl,
      fileName: result.audio.file_name ?? `${id}.mp3`,
      fileSize,
      contentType: result.audio.content_type ?? "audio/mpeg",
      sourceUrl: result.audio.url,
      downloadedAt: new Date(),
    });

    // Update generation status
    await db
      .update(generations)
      .set({
        status: "completed",
        falRequestId: result.request_id,
        updatedAt: new Date(),
      })
      .where(eq(generations.id, id));
  } catch (error) {
    console.error(`Generation ${id} failed:`, error);

    // Update generation with error
    await db
      .update(generations)
      .set({
        status: "failed",
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        updatedAt: new Date(),
      })
      .where(eq(generations.id, id));
  }
}
