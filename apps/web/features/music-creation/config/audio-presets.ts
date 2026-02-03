/**
 * Audio Preset Configurations
 */

export const AUDIO_PRESETS = {
  standard: { label: "标准", bitrate: "128000", sample_rate: "32000" },
  high: { label: "高质", bitrate: "256000", sample_rate: "44100" },
} as const

export type AudioPresetKey = keyof typeof AUDIO_PRESETS
