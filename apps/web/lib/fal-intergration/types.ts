import { z } from "zod"

// MiniMax Music v2 Zod Schemas
export const AudioSettingSchema = z.object({
  /** Audio bitrate in kbps (e.g., 128, 192, 320) */
  bitrate: z.number().optional(),
  /** Sample rate in Hz (e.g., 44100, 48000) */
  sample_rate: z.number().optional(),
})

export const MiniMaxMusicV2InputSchema = z.object({
  /**
   * A description of the music, specifying style, mood, and scenario.
   * Length: 10-300 characters
   */
  prompt: z
    .string()
    .min(10, "Prompt must be at least 10 characters")
    .max(300, "Prompt must be at most 300 characters"),

  /**
   * Lyrics of the song. Use \n to separate lines.
   * Supports tags: [Intro], [Verse], [Chorus], [Bridge], [Outro]
   */
  lyrics_prompt: z.string().min(1, "Lyrics are required"),

  /**
   * Optional audio configuration settings
   */
  audio_setting: AudioSettingSchema.optional(),
})

// Inferred TypeScript types from Zod schemas
export type AudioSetting = z.infer<typeof AudioSettingSchema>
export type MiniMaxMusicV2Input = z.infer<typeof MiniMaxMusicV2InputSchema>

// MiniMax Music v2 Output Schemas
export const GeneratedAudioSchema = z.object({
  /** URL to the generated audio file */
  url: z.string().url(),
  /** Content type of the audio file */
  content_type: z.string().optional(),
  /** File name */
  file_name: z.string().optional(),
  /** File size in bytes */
  file_size: z.number().optional(),
})

export const MiniMaxMusicV2OutputSchema = z.object({
  /** The generated audio file */
  audio: GeneratedAudioSchema,
})

// Inferred TypeScript types from Zod schemas
export type GeneratedAudio = z.infer<typeof GeneratedAudioSchema>
export type MiniMaxMusicV2Output = z.infer<typeof MiniMaxMusicV2OutputSchema>

// Error types
export interface FalError {
  message: string
  code?: string
  status?: number
}

// Request status for async operations
export type RequestStatus = "pending" | "in_progress" | "completed" | "failed"

export interface AsyncRequest<T> {
  id: string
  status: RequestStatus
  result?: T
  error?: FalError
}
