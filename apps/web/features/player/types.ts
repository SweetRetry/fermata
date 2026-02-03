/**
 * Player Feature Types
 */

export interface PlayerState {
  isPlaying: boolean
  currentTrack: Track | null
  currentTime: number
  duration: number
  volume: number
}

export interface Track {
  id: string
  title: string
  artist: string
  audioUrl: string
  duration?: number
  coverUrl?: string
}

export interface UseAudioPlayerOptions {
  onEnded?: () => void
}

export interface UseAudioPlayerReturn {
  isPlaying: boolean
  audioRef: React.RefObject<HTMLAudioElement | null>
  togglePlay: (audioUrl?: string) => void
  play: (audioUrl: string) => void
  pause: () => void
  stop: () => void
}
