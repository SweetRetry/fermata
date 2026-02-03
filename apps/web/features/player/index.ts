/**
 * Player Feature
 *
 * @example
 * ```tsx
 * import { PlayerBar, useAudioPlayer } from "@/features/player";
 *
 * function Layout() {
 *   return <PlayerBar currentTrack={track} />;
 * }
 * ```
 */

export { PlayerBar } from "./components/player-bar"
export { useAudioPlayer } from "./hooks/use-audio-player"

export type {
  PlayerState,
  Track,
  UseAudioPlayerOptions,
  UseAudioPlayerReturn,
} from "./types"
