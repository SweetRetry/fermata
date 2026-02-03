"use client";

import { useCallback, useRef, useState } from "react";

interface UseAudioPlayerOptions {
  onEnded?: () => void;
}

interface UseAudioPlayerReturn {
  isPlaying: boolean;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  togglePlay: (audioUrl?: string) => void;
  play: (audioUrl: string) => void;
  pause: () => void;
  stop: () => void;
}

export function useAudioPlayer(
  options: UseAudioPlayerOptions = {},
): UseAudioPlayerReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
  }, []);

  const play = useCallback(
    (audioUrl: string) => {
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      const audio = new Audio(audioUrl);
      audio.onended = () => {
        setIsPlaying(false);
        options.onEnded?.();
      };
      audio.onerror = () => {
        setIsPlaying(false);
      };

      audio.play().catch(() => {
        setIsPlaying(false);
      });

      audioRef.current = audio;
      setIsPlaying(true);
    },
    [options],
  );

  const togglePlay = useCallback(
    (audioUrl?: string) => {
      if (!audioUrl) {
        // Toggle current audio
        if (audioRef.current) {
          if (isPlaying) {
            pause();
          } else {
            audioRef.current.play().catch(() => {
              setIsPlaying(false);
            });
            setIsPlaying(true);
          }
        }
        return;
      }

      // New audio URL
      if (isPlaying && audioRef.current?.src === audioUrl) {
        pause();
      } else {
        play(audioUrl);
      }
    },
    [isPlaying, pause, play],
  );

  return {
    isPlaying,
    audioRef,
    togglePlay,
    play,
    pause,
    stop,
  };
}
