"use client";

import { Button } from "@workspace/ui/components/button";
import { motion } from "framer-motion";
import { Pause, Play, SkipBack, SkipForward, Volume2, Volume1, VolumeX } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { usePlayerStore } from "../stores/player-store";

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function PlayerBar() {
  const { currentTrack, isPlaying, toggle, currentTime, duration, volume, setVolume, initAudio } =
    usePlayerStore();

  useEffect(() => {
    initAudio();
  }, [initAudio]);

  const handleToggle = () => {
    toggle();
  };

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const }}
      className="fixed bottom-0 left-20 right-0 grid h-20 grid-cols-[1fr_auto_1fr] items-center gap-8 border-t border-border bg-background/95 px-8 backdrop-blur-sm"
    >
      {/* Mini Player - Left */}
      <motion.div
        className="flex items-center gap-4 justify-self-start"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <Link href={currentTrack ? `/details/${currentTrack.id}` : "#"}>
          <motion.div
            className="h-14 w-14 rounded-lg border border-border bg-muted"
            whileHover={{ scale: 1.05, borderColor: "var(--primary)" }}
            transition={{ duration: 0.2 }}
          />
        </Link>
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-foreground">
            {currentTrack?.title || "Untitled"}
          </span>
          <span className="text-xs text-muted-foreground">
            {currentTrack?.model || currentTrack?.artist || "Unknown"}
          </span>
        </div>
      </motion.div>

      {/* Center Controls */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-5">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="h-8 w-8 rounded-full"
            >
              <SkipBack className="h-4 w-4" />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              type="button"
              size="icon"
              className="h-10 w-10 rounded-full"
              onClick={handleToggle}
              disabled={!currentTrack}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" fill="currentColor" />
              ) : (
                <Play className="h-5 w-5" fill="currentColor" />
              )}
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="h-8 w-8 rounded-full"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-3">
          <span className="w-10 text-right text-xs text-muted-foreground">
            {formatTime(currentTime)}
          </span>
          <div className="h-1 w-64 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-primary"
              animate={{
                width: duration > 0 ? `${(currentTime / duration) * 100}%` : 0,
              }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <span className="w-10 text-xs text-muted-foreground">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Right - Volume Control */}
      <motion.div
        className="flex items-center gap-2 justify-self-end"
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => setVolume(volume === 0 ? 1 : 0)}
          >
            {volume === 0 ? (
              <VolumeX className="h-4 w-4" />
            ) : volume < 0.5 ? (
              <Volume1 className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
        </motion.div>
        <div className="relative flex h-4 w-20 items-center">
          <div className="h-1 w-full cursor-pointer overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-primary"
              style={{ width: `${volume * 100}%` }}
            />
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            aria-label="Volume"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
