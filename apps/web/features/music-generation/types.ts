/**
 * Music Generation Feature Types
 */

export interface Generation {
  id: string
  title: string
  prompt: string
  lyricsPrompt?: string
  isInstrumental: boolean
  status: "pending" | "generating" | "completed" | "failed"
  audioUrl?: string
  duration?: number
  errorMessage?: string
  createdAt: string
  updatedAt: string
}

export interface CreateGenerationInput {
  title?: string
  prompt: string
  lyrics_prompt?: string
  is_instrumental?: boolean
  audio_setting?: {
    bitrate: string
    sample_rate: string
  }
}

export interface CreateGenerationResponse {
  id: string
  status: string
  message: string
}

export interface GenerationStatusUpdate {
  id: string
  status: Generation["status"]
  audioUrl?: string
  duration?: number
  errorMessage?: string
}
