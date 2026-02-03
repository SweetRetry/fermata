// Fal AI Integration - MiniMax Music v2
// https://fal.ai/models/fal-ai/minimax-music/v2

export {
  FalClient,
  createFalClient,
  getFalClient,
  generateMusic,
  type FalClientOptions,
} from "./client";

export {
  // Schemas
  MiniMaxMusicV2InputSchema,
  MiniMaxMusicV2OutputSchema,
  AudioSettingSchema,
  GeneratedAudioSchema,
  // Types
  type MiniMaxMusicV2Input,
  type MiniMaxMusicV2Output,
  type GeneratedAudio,
  type AudioSetting,
  type FalError,
  type RequestStatus,
  type AsyncRequest,
} from "./types";
