"use client";

import { Button } from "@workspace/ui/components/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import { motion } from "framer-motion";
import {
  ListMusic,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePlayerStore } from "../stores/player-store";
import type { Track } from "../types";

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

interface PlaylistItemProps {
  track: Track;
  index: number;
  isActive: boolean;
  onClick: () => void;
}

function PlaylistItem({ track, index, isActive, onClick }: PlaylistItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      onClick={onClick}
      className={`group flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-accent ${
        isActive ? "bg-accent" : ""
      }`}
    >
      <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md border border-border bg-muted">
        {track.coverUrl ? (
          <img
            src={track.coverUrl}
            alt={track.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ListMusic className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
        {isActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <div className="flex gap-0.5">
              <motion.div
                animate={{ height: [4, 12, 4] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
                className="w-1 rounded-full bg-white"
              />
              <motion.div
                animate={{ height: [8, 4, 8] }}
                transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }}
                className="w-1 rounded-full bg-white"
              />
              <motion.div
                animate={{ height: [6, 14, 6] }}
                transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }}
                className="w-1 rounded-full bg-white"
              />
            </div>
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <span
          className={`truncate text-sm font-medium ${isActive ? "text-primary" : "text-foreground"}`}
        >
          {track.title}
        </span>
        <span className="truncate text-xs text-muted-foreground">
          {track.artist}
        </span>
      </div>
      {track.duration !== undefined && (
        <span className="ml-2 text-xs text-muted-foreground">
          {formatTime(track.duration)}
        </span>
      )}
    </motion.div>
  );
}

export function PlayerBar() {
  const {
    currentTrack,
    isPlaying,
    toggle,
    currentTime,
    duration,
    volume,
    setVolume,
    setCurrentTime,
    initAudio,
    next,
    previous,
    playlist,
    currentIndex,
  } = usePlayerStore();

  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);

  useEffect(() => {
    initAudio();
  }, [initAudio]);

  const handleToggle = () => {
    toggle();
  };

  const handlePlayFromPlaylist = (index: number) => {
    const { playlist, setPlaylist } = usePlayerStore.getState();
    setPlaylist(playlist, index);
  };

  const [seekingTime, setSeekingTime] = useState<number | null>(null);

  const handleSeekStart = (value: number) => {
    setSeekingTime(value);
  };

  const handleSeekChange = (value: number) => {
    setSeekingTime(value);
  };

  const handleSeekEnd = () => {
    if (seekingTime !== null) {
      setCurrentTime(seekingTime);
      setSeekingTime(null);
    }
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
              onClick={previous}
              disabled={!currentTrack}
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
              onClick={next}
              disabled={!currentTrack}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-3">
          <span className="w-10 text-right text-xs text-muted-foreground">
            {formatTime(seekingTime ?? currentTime)}
          </span>
          <div className="group relative flex h-4 w-64 items-center">
            <div className="h-1 w-full cursor-pointer overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full rounded-full bg-primary"
                animate={{
                  width: duration > 0 ? `${((seekingTime ?? currentTime) / duration) * 100}%` : "0%",
                }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={seekingTime ?? currentTime}
              onMouseDown={(e) => handleSeekStart(parseFloat(e.currentTarget.value))}
              onTouchStart={(e) => handleSeekStart(parseFloat(e.currentTarget.value))}
              onChange={(e) => handleSeekChange(parseFloat(e.target.value))}
              onMouseUp={handleSeekEnd}
              onTouchEnd={handleSeekEnd}
              onBlur={handleSeekEnd}
              disabled={!currentTrack || duration <= 0}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
              aria-label="Progress"
            />
          </div>
          <span className="w-10 text-xs text-muted-foreground">
            {formatTime(Math.max(0, duration - (seekingTime ?? currentTime)))}
          </span>
        </div>
      </div>

      {/* Right - Volume Control + Playlist */}
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

        {/* Playlist Button */}
        <Sheet open={isPlaylistOpen} onOpenChange={setIsPlaylistOpen}>
          <SheetTrigger asChild>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="relative h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <ListMusic className="h-4 w-4" />
                {playlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
                    {playlist.length}
                  </span>
                )}
              </Button>
            </motion.div>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 sm:max-w-sm">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <ListMusic className="h-5 w-5" />
                播放列表
              </SheetTitle>
              <p className="text-sm text-muted-foreground">
                共 {playlist.length} 首歌曲
              </p>
            </SheetHeader>
            <div className="mt-4 flex flex-col gap-1 overflow-y-auto pb-4">
              {playlist.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <ListMusic className="mb-2 h-12 w-12 opacity-50" />
                  <p className="text-sm">暂无歌曲</p>
                </div>
              ) : (
                playlist.map((track, index) => (
                  <PlaylistItem
                    key={track.id}
                    track={track}
                    index={index}
                    isActive={index === currentIndex}
                    onClick={() => handlePlayFromPlaylist(index)}
                  />
                ))
              )}
            </div>
          </SheetContent>
        </Sheet>
      </motion.div>
    </motion.div>
  );
}
