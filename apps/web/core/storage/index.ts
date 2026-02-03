import { createWriteStream, existsSync, mkdirSync } from "node:fs"
import { Readable } from "node:stream"
import { pipeline } from "node:stream/promises"

const STORAGE_DIR = "./public/generations"

// Ensure storage directory exists
export function ensureStorageDir() {
  try {
    mkdirSync(STORAGE_DIR, { recursive: true })
  } catch {
    // Directory may already exist
  }
}

// Initialize on module load
ensureStorageDir()

/**
 * Download audio from URL and save to local storage
 */
export async function saveAudioFile(
  generationId: string,
  audioUrl: string
): Promise<{ filePath: string; publicUrl: string }> {
  ensureStorageDir()

  const fileName = `${generationId}.mp3`
  const filePath = `${STORAGE_DIR}/${fileName}`

  // Download and save
  const response = await fetch(audioUrl)
  if (!response.ok) {
    throw new Error(`Failed to download audio: ${response.status}`)
  }

  const fileStream = createWriteStream(filePath)
  // @ts-expect-error - Readable.fromWeb exists in Node 18+
  const bodyStream = Readable.fromWeb(response.body as ReadableStream)

  await pipeline(bodyStream, fileStream)

  return {
    filePath,
    publicUrl: `/generations/${fileName}`,
  }
}

/**
 * Get the local file path for a generation
 */
export function getAudioFilePath(generationId: string): string {
  return `${STORAGE_DIR}/${generationId}.mp3`
}

/**
 * Check if audio file exists locally
 */
export function audioFileExists(generationId: string): boolean {
  return existsSync(getAudioFilePath(generationId))
}

/**
 * Get public URL for a generation's audio
 */
export function getAudioPublicUrl(generationId: string): string {
  return `/generations/${generationId}.mp3`
}
