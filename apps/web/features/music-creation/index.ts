/**
 * Music Creation Feature
 *
 * 音乐创作页面功能模块 - 包含表单、音频设置、动画等
 *
 * @example
 * ```tsx
 * import { useMusicCreationForm, AUDIO_PRESETS } from "@/features/music-creation";
 *
 * function CreatePage() {
 *   const form = useMusicCreationForm({ style, description, context });
 *   // ...
 * }
 * ```
 */

// Animations
export { fadeInVariants, slideInVariants } from "./animations/variants"
export { GenerationStatusCard } from "./components/generation-status"
// Components
export { LeftPanel } from "./components/left-panel"
export { RecentGenerationsList } from "./components/recent-generations-list"
export { RightPanel } from "./components/right-panel"
// Config
export { AUDIO_PRESETS, type AudioPresetKey } from "./config/audio-presets"
// Hooks
export { useMusicCreationForm } from "./hooks/use-music-creation-form"
// Utils
export { buildPromptFromGenre, buildTitleFromGenre } from "./lib/build-prompt"
export { getStatusDisplay } from "./lib/get-status-display"
