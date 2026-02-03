import { z } from "zod"

// MiniMax Music v2 Zod Schemas - 与 Fal SDK 类型兼容
export const AudioSettingSchema = z.object({
  /** Audio bitrate - 使用 Fal SDK 支持的字符串值 */
  bitrate: z.enum(["32000", "64000", "128000", "256000"]).optional(),
  /** Sample rate - 使用 Fal SDK 支持的字符串值 */
  sample_rate: z.enum(["8000", "16000", "22050", "24000", "32000", "44100"]).optional(),
  /** Audio format */
  format: z.enum(["mp3", "pcm", "flac"]).optional(),
  /** Number of channels (1=mono, 2=stereo) */
  channel: z.enum(["1", "2"]).optional(),
})

export const MiniMaxMusicV2InputSchema = z.object({
  /**
   * A description of the music, specifying style, mood, and scenario.
   * Length: 10-300 characters
   */
  prompt: z
    .string()
    .min(10, { message: "Prompt must be at least 10 characters" })
    .max(300, { message: "Prompt must be at most 300 characters" }),

  /**
   * Lyrics of the song. Use \\n to separate lines.
   * Supports tags: [Intro], [Verse], [Chorus], [Bridge], [Outro]
   */
  lyrics_prompt: z.string().min(1, { message: "Lyrics are required" }),

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
  /** Request ID for tracking */
  request_id: z.string().optional(),
})

// Inferred TypeScript types from Zod schemas
export type GeneratedAudio = z.infer<typeof GeneratedAudioSchema>
export type MiniMaxMusicV2Output = z.infer<typeof MiniMaxMusicV2OutputSchema>

// Generation status for polling
export type GenerationStatus = "pending" | "generating" | "completed" | "failed"
