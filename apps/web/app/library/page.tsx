"use client";

import { Button } from "@workspace/ui/components/button";
import { motion } from "framer-motion";
import { Clock, Pause, Play } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAudioPlayer, useMusicLibrary, type Song } from "@/hooks";
import { formatDate, getStatusColor, getStatusText } from "./utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut" as const,
    },
  },
};

export default function LibraryPage() {
  const { data: songs = [], isLoading } = useMusicLibrary(50);
  const { isPlaying, audioRef, togglePlay } = useAudioPlayer();
  const [playingId, setPlayingId] = useState<string | null>(null);

  const handleTogglePlay = (song: Song) => {
    if (playingId === song.id) {
      togglePlay();
      setPlayingId(null);
    } else {
      if (song.audioUrl) {
        togglePlay(song.audioUrl);
        setPlayingId(song.id);
      }
    }
  };

  return (
    <div className="flex h-full flex-col gap-8 p-12">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-[32px] font-semibold text-foreground">
          Your Library
        </h1>
        <motion.div
          className="h-10 w-10 rounded-full bg-muted"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>

      {/* Subheader */}
      <motion.p
        className="text-base text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        {isLoading ? "加载中..." : `共 ${songs.length} 首创作`}
      </motion.p>

      {/* Song Grid */}
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <motion.div
            className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      ) : songs.length === 0 ? (
        <motion.div
          className="flex flex-1 flex-col items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="h-20 w-20 rounded-2xl border border-border bg-muted" />
          <p className="text-muted-foreground">还没有创作，去创建一首吧</p>
          <Link href="/create">
            <Button>开始创作</Button>
          </Link>
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {songs.map((song) => (
            <motion.div
              key={song.id}
              variants={itemVariants}
              className="group relative rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-muted/50"
            >
              <Link href={`/details/${song.id}`} className="block">
                {/* Artwork Placeholder */}
                <div className="relative mb-4 aspect-square rounded-xl bg-muted">
                  {song.status === "completed" ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        {playingId === song.id ? (
                          <motion.div
                            className="flex gap-0.5"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            {[1, 2, 3].map((i) => (
                              <motion.div
                                key={i}
                                className="h-6 w-1 rounded-full bg-primary"
                                animate={{ height: [12, 24, 12] }}
                                transition={{
                                  duration: 0.5,
                                  repeat: Infinity,
                                  delay: i * 0.1,
                                }}
                              />
                            ))}
                          </motion.div>
                        ) : (
                          <Play className="h-6 w-6 text-primary" />
                        )}
                      </div>
                    </div>
                  ) : song.status === "failed" ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm text-destructive">生成失败</span>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    </div>
                  )}

                  {/* Play Button Overlay */}
                  {song.status === "completed" && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleTogglePlay(song);
                      }}
                      className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                        {playingId === song.id ? (
                          <Pause className="h-6 w-6" />
                        ) : (
                          <Play className="h-6 w-6 ml-1" />
                        )}
                      </div>
                    </button>
                  )}
                </div>

                {/* Info */}
                <div className="space-y-1">
                  <h3 className="font-medium text-foreground truncate">
                    {song.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className={getStatusColor(song.status)}>
                      {getStatusText(song.status)}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatDate(song.createdAt)}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
