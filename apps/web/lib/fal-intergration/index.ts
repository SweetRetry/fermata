// Fal AI Integration - MiniMax Music v2
// https://fal.ai/models/fal-ai/minimax-music/v2

export {
  createFalClient,
  FalClient,
  type FalClientOptions,
  generateMusic,
  getFalClient,
} from "./client"

export {
  type AsyncRequest,
  type AudioSetting,
  AudioSettingSchema,
  type FalError,
  type GeneratedAudio,
  GeneratedAudioSchema,
  // Types
  type MiniMaxMusicV2Input,
  // Schemas
  MiniMaxMusicV2InputSchema,
  type MiniMaxMusicV2Output,
  MiniMaxMusicV2OutputSchema,
  type RequestStatus,
} from "./types"
