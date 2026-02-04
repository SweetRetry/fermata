/**
 * Player Store
 *
 * 全局音频播放状态管理
 */

import { create } from "zustand"
import type { Track } from "../types"

// Global audio element (singleton)
let audioElement: HTMLAudioElement | null = null
let isInitialized = false

function getAudio(): HTMLAudioElement {
  if (!audioElement) {
    audioElement = new Audio()
  }
  return audioElement
}

interface PlayerState {
  currentTrack: Track | null
  playlist: Track[]
  currentIndex: number
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
}

interface PlayerActions {
  setTrack: (track: Track) => void
  setPlaylist: (tracks: Track[], startIndex?: number) => void
  play: () => void
  pause: () => void
  toggle: () => void
  stop: () => void
  next: () => void
  previous: () => void
  setCurrentTime: (time: number) => void
  setDuration: (duration: number) => void
  setVolume: (volume: number) => void
  initAudio: () => void
}

export const usePlayerStore = create<PlayerState & PlayerActions>((set, get) => ({
  // State
  currentTrack: null,
  playlist: [],
  currentIndex: -1,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,

  // Initialize audio event listeners
  initAudio: () => {
    if (isInitialized) return
    isInitialized = true

    const audio = getAudio()

    audio.addEventListener("ended", () => {
      const { playlist, currentIndex } = get()

      if (playlist.length > 0) {
        // Loop to first track when reaching the end
        const nextIndex = (currentIndex + 1) % playlist.length
        const nextTrack = playlist[nextIndex]
        if (!nextTrack) return
        audio.src = nextTrack.audioUrl
        audio.play().catch(() => {
          set({ isPlaying: false })
        })
        set({
          currentTrack: nextTrack,
          currentIndex: nextIndex,
          isPlaying: true,
          currentTime: 0,
        })
      } else {
        set({ isPlaying: false, currentTime: 0 })
      }
    })

    audio.addEventListener("error", () => {
      set({ isPlaying: false })
    })

    audio.addEventListener("timeupdate", () => {
      set({ currentTime: audio.currentTime })
    })

    audio.addEventListener("loadedmetadata", () => {
      set({ duration: audio.duration })
    })
  },

  // Actions
  setTrack: (track) => {
    const audio = getAudio()
    if (audio.src !== track.audioUrl) {
      audio.src = track.audioUrl
    }
    audio.play().catch(() => {
      set({ isPlaying: false })
    })
    set({ currentTrack: track, isPlaying: true, currentTime: 0 })
  },

  setPlaylist: (tracks, startIndex = 0) => {
    const audio = getAudio()
    const startTrack = tracks[startIndex]
    if (!startTrack) return

    if (audio.src !== startTrack.audioUrl) {
      audio.src = startTrack.audioUrl
    }
    audio.play().catch(() => {
      set({ isPlaying: false })
    })
    set({
      playlist: tracks,
      currentIndex: startIndex,
      currentTrack: startTrack,
      isPlaying: true,
      currentTime: 0,
    })
  },

  play: () => {
    const audio = getAudio()
    audio.play().catch(() => {
      set({ isPlaying: false })
    })
    set({ isPlaying: true })
  },

  pause: () => {
    const audio = getAudio()
    audio.pause()
    set({ isPlaying: false })
  },

  toggle: () => {
    const { isPlaying, currentTrack } = get()
    const audio = getAudio()

    if (!currentTrack) return

    if (isPlaying) {
      audio.pause()
      set({ isPlaying: false })
    } else {
      audio.play().catch(() => {
        set({ isPlaying: false })
      })
      set({ isPlaying: true })
    }
  },

  stop: () => {
    const audio = getAudio()
    audio.pause()
    audio.currentTime = 0
    set({ isPlaying: false, currentTime: 0 })
  },

  next: () => {
    const { playlist, currentIndex } = get()
    if (playlist.length === 0) return

    // Loop to first track when reaching the end
    const nextIndex = (currentIndex + 1) % playlist.length
    const nextTrack = playlist[nextIndex]
    if (!nextTrack) return
    const audio = getAudio()
    audio.src = nextTrack.audioUrl
    audio.play().catch(() => {
      set({ isPlaying: false })
    })
    set({
      currentTrack: nextTrack,
      currentIndex: nextIndex,
      isPlaying: true,
      currentTime: 0,
    })
  },

  previous: () => {
    const { playlist, currentIndex } = get()
    if (playlist.length === 0) return

    // Loop to last track when at the beginning
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length
    const prevTrack = playlist[prevIndex]
    if (!prevTrack) return
    const audio = getAudio()
    audio.src = prevTrack.audioUrl
    audio.play().catch(() => {
      set({ isPlaying: false })
    })
    set({
      currentTrack: prevTrack,
      currentIndex: prevIndex,
      isPlaying: true,
      currentTime: 0,
    })
  },

  setCurrentTime: (time) => {
    const audio = getAudio()
    audio.currentTime = time
    set({ currentTime: time })
  },

  setDuration: (duration) => set({ duration }),

  setVolume: (volume) => {
    const audio = getAudio()
    const clampedVolume = Math.max(0, Math.min(1, volume))
    audio.volume = clampedVolume
    set({ volume: clampedVolume })
  },
}))
