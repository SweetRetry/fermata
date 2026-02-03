import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generations } from "@/lib/db/schema";
import { generateMusic } from "@/lib/fal-intergration/client";
import { saveAudioFile } from "@/lib/storage";

// Create a new generation
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      title?: string;
      prompt: string;
      lyrics_prompt?: string;
      is_instrumental?: boolean;
    };

    const { title, prompt, lyrics_prompt, is_instrumental = true } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 },
      );
    }

    const id = randomUUID();

    // Create generation record
    await db.insert(generations).values({
      id,
      title: title || "Untitled",
      prompt,
      lyricsPrompt: lyrics_prompt,
      isInstrumental: is_instrumental,
      status: "pending",
    });

    // Start generation in background
    generateMusicAsync(
      id,
      prompt,
      lyrics_prompt || (is_instrumental ? "[Instrumental]" : ""),
    );

    return NextResponse.json({
      id,
      status: "pending",
      message: "Generation started",
    });
  } catch (error) {
    console.error("Generation creation error:", error);
    return NextResponse.json(
      {
        error: "Failed to create generation",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// Get generation status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Generation ID is required" },
        { status: 400 },
      );
    }

    const generation = await db.query.generations.findFirst({
      where: eq(generations.id, id),
    });

    if (!generation) {
      return NextResponse.json(
        { error: "Generation not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      id: generation.id,
      title: generation.title,
      status: generation.status,
      audioUrl: generation.audioUrl,
      duration: generation.duration,
      errorMessage: generation.errorMessage,
      createdAt: generation.createdAt,
      updatedAt: generation.updatedAt,
    });
  } catch (error) {
    console.error("Generation fetch error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch generation",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// Async generation handler
async function generateMusicAsync(id: string, prompt: string, lyrics: string) {
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
    const { publicUrl } = await saveAudioFile(id, result.audio.url);

    // Update generation with success
    await db
      .update(generations)
      .set({
        status: "completed",
        audioUrl: publicUrl,
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
