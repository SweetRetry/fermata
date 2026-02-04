"use client";

import { motion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import Link from "next/link";
import { StatusIndicator } from "@/components/status-indicator";
import { formatDate, getStatusText } from "../lib/utils";
import type { Song } from "../types";

const itemVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut" as const,
    },
  },
};

interface SongCardProps {
  song: Song;
  isCurrentSong: boolean;
  onTogglePlay: (song: Song) => void;
}

export function SongCard({ song, isCurrentSong, onTogglePlay }: SongCardProps) {
  return (
    <motion.div
      variants={itemVariants}
      className="group relative rounded-xl bg-gradient-to-b from-muted/40 to-muted/10 p-3 transition-all duration-300 hover:from-muted/60 hover:to-muted/20 hover:shadow-lg hover:shadow-primary/5"
    >
      <Link href={`/details/${song.id}`} className="block">
        {/* Artwork Placeholder */}
        <div className="relative mb-3 aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-muted to-muted/50">
          {song.status === "completed" ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                {isCurrentSong ? (
                  <motion.div
                    className="flex gap-0.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {[1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        className="h-5 w-1 rounded-full bg-white"
                        animate={{ height: [10, 20, 10] }}
                        transition={{
                          duration: 0.5,
                          repeat: Infinity,
                          delay: i * 0.1,
                        }}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <Play className="h-6 w-6 fill-white text-white" />
                )}
              </div>
            </div>
          ) : song.status === "failed" ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm text-muted-foreground">生成失败</span>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="h-8 w-8 rounded-full border-2 border-primary/60 border-t-transparent"
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
                onTogglePlay(song);
              }}
              className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-xl transition-transform duration-300 hover:scale-105 active:scale-95">
                {isCurrentSong ? (
                  <Pause className="h-6 w-6 fill-current" />
                ) : (
                  <Play className="h-6 w-6 ml-0.5 fill-current" />
                )}
              </div>
            </button>
          )}
        </div>

        {/* Info */}
        <div className="space-y-1">
          <h3 className="line-clamp-1 font-medium text-foreground/90 transition-colors group-hover:text-foreground">
            {song.title}
          </h3>
          <div className="flex items-center gap-2 text-xs">
            <StatusIndicator status={song.status} size="sm" />
            {song.status === "failed" ? (
              <span className="text-muted-foreground">
                {getStatusText(song.status)}
              </span>
            ) : (
              <span className="text-muted-foreground/60">
                {formatDate(song.createdAt)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
