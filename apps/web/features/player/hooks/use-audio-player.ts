"use client"

import { useCallback, useEffect } from "react"
import { usePlayerStore } from "../stores/player-store"
import type { Track, UseAudioPlayerOptions, UseAudioPlayerReturn } from "../types"

export function useAudioPlayer(options: UseAudioPlayerOptions = {}): UseAudioPlayerReturn {
  const {
    isPlaying,
    currentTrack,
    setTrack,
    toggle,
    stop: storeStop,
    pause: storePause,
    initAudio,
  } = usePlayerStore()

  // Initialize audio on mount
  useEffect(() => {
    initAudio()
  }, [initAudio])

  const play = useCallback(
    (audioUrl: string) => {
      // Create a minimal track from URL
      const track: Track = {
        id: audioUrl,
        title: "Unknown",
        artist: "Unknown",
        audioUrl,
      }
      setTrack(track)
    },
    [setTrack]
  )

  const togglePlay = useCallback(
    (audioUrl?: string) => {
      if (!audioUrl) {
        toggle()
        return
      }

      // New audio URL
      if (isPlaying && currentTrack?.audioUrl === audioUrl) {
        toggle()
      } else {
        play(audioUrl)
      }
    },
    [isPlaying, currentTrack, play, toggle]
  )

  const stop = useCallback(() => {
    storeStop()
  }, [storeStop])

  const pause = useCallback(() => {
    storePause()
  }, [storePause])

  return {
    isPlaying,
    audioRef: { current: null },
    togglePlay,
    play,
    pause,
    stop,
  }
}
