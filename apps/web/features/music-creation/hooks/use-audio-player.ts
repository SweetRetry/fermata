/**
 * Audio Player Hook
 *
 * 封装音频播放逻辑
 */

import { useCallback, useRef, useState } from "react"

interface UseAudioPlayerOptions {
  onEnded?: () => void
}

export function useAudioPlayer(options: UseAudioPlayerOptions = {}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const togglePlay = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }, [isPlaying])

  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }, [])

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }, [])

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(false)
    }
  }, [])

  const handleEnded = useCallback(() => {
    setIsPlaying(false)
    options.onEnded?.()
  }, [options])

  return {
    isPlaying,
    audioRef,
    togglePlay,
    play,
    pause,
    stop,
    handleEnded,
  }
}
