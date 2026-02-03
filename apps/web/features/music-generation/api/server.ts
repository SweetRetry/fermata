/**
 * Music Generation Server API
 *
 * Business logic for music generation - called by API routes
 */

import { randomUUID } from "node:crypto"
import { eq } from "drizzle-orm"
import { db } from "@/core/db"
import { generations } from "@/core/db/schema"
import { saveAudioFile } from "@/core/storage"
import { generateMusic } from "@/lib/fal-integration/client"
import type { CreateGenerationInput, CreateGenerationResponse, Generation } from "../types"

/**
 * Create a new music generation
 */
export async function createGeneration(
  input: CreateGenerationInput
): Promise<CreateGenerationResponse> {
  const { title, prompt, lyrics_prompt, is_instrumental = true } = input

  if (!prompt || typeof prompt !== "string") {
    throw new Error("Prompt is required")
  }

  const id = randomUUID()

  // Create generation record
  await db.insert(generations).values({
    id,
    title: title || "Untitled",
    prompt,
    lyricsPrompt: lyrics_prompt,
    isInstrumental: is_instrumental,
    status: "pending",
  })

  // Start generation in background
  generateMusicAsync(id, prompt, lyrics_prompt || (is_instrumental ? "[Instrumental]" : ""))

  return {
    id,
    status: "pending",
    message: "Generation started",
  }
}

/**
 * Get a generation by ID
 */
export async function getGeneration(id: string): Promise<Generation | null> {
  const generation = await db.query.generations.findFirst({
    where: eq(generations.id, id),
  })

  if (!generation) return null

  return {
    id: generation.id,
    title: generation.title,
    prompt: generation.prompt,
    lyricsPrompt: generation.lyricsPrompt ?? undefined,
    isInstrumental: generation.isInstrumental,
    status: generation.status,
    audioUrl: generation.audioUrl ?? undefined,
    duration: generation.duration ?? undefined,
    errorMessage: generation.errorMessage ?? undefined,
    createdAt: generation.createdAt.toISOString(),
    updatedAt: generation.updatedAt.toISOString(),
  }
}

/**
 * Async generation handler - runs in background
 */
async function generateMusicAsync(id: string, prompt: string, lyrics: string): Promise<void> {
  try {
    // Update status to generating
    await db
      .update(generations)
      .set({ status: "generating", updatedAt: new Date() })
      .where(eq(generations.id, id))

    // Call Fal API
    const result = await generateMusic({
      prompt,
      lyrics_prompt: lyrics,
    })

    // Download and save audio file
    const { publicUrl } = await saveAudioFile(id, result.audio.url)

    // Update generation with success
    await db
      .update(generations)
      .set({
        status: "completed",
        audioUrl: publicUrl,
        falRequestId: result.request_id,
        updatedAt: new Date(),
      })
      .where(eq(generations.id, id))
  } catch (error) {
    console.error(`Generation ${id} failed:`, error)

    // Update generation with error
    await db
      .update(generations)
      .set({
        status: "failed",
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        updatedAt: new Date(),
      })
      .where(eq(generations.id, id))
  }
}
