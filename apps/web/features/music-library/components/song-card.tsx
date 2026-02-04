"use client";

import { motion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import Link from "next/link";
import { StatusIndicator } from "@/components/status-indicator";
import { formatDate, getStatusText } from "../lib/utils";
import type { Song } from "../types";

const SPRING_TACTILE = { stiffness: 380, damping: 30, mass: 0.8 };
const EASE_REVEAL = [0.16, 1, 0.3, 1] as const;

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: EASE_REVEAL,
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
      layoutId={`card-${song.id}`}
      className="group relative rounded-xl overflow-hidden cursor-pointer bg-card shadow-sm"
      whileHover={{
        scale: 1.02,
        transition: SPRING_TACTILE,
      }}
      whileTap={{ scale: 0.98 }}
    >
      <Link href={`/details/${song.id}`} className="block p-3">
        {/* Artwork Container - No border */}
        <motion.div
          className="relative mb-3 aspect-square overflow-hidden rounded-lg bg-muted"
          layoutId={`artwork-${song.id}`}
        >
          {song.status === "completed" ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110 bg-primary/10 backdrop-blur-sm">
                {isCurrentSong ? (
                  <motion.div
                    className="flex gap-0.5 items-end h-5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {[1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1 rounded-full bg-primary"
                        animate={{ height: [8, 20, 8] }}
                        transition={{
                          duration: 0.5,
                          repeat: Infinity,
                          delay: i * 0.1,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <Play className="h-6 w-6 fill-primary text-primary ml-0.5" />
                )}
              </div>
            </div>
          ) : song.status === "failed" ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Failed
              </span>
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <motion.div
                className="h-8 w-8 rounded-full border-2 border-primary/40 border-t-primary"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Processing
              </span>
            </div>
          )}

          {/* Play Button Overlay */}
          {song.status === "completed" && (
            <motion.button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onTogglePlay(song);
              }}
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: "rgba(0,0,0,0.5)",
              }}
              whileHover={{ scale: 1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-foreground text-primary shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                transition={SPRING_TACTILE}
              >
                {isCurrentSong ? (
                  <Pause className="h-6 w-6 fill-current" />
                ) : (
                  <Play className="h-6 w-6 ml-0.5 fill-current" />
                )}
              </motion.div>
            </motion.button>
          )}
        </motion.div>

        {/* Info */}
        <div className="space-y-2">
          <motion.h3
            className="line-clamp-1 font-medium text-foreground/90 transition-colors group-hover:text-foreground tracking-tight"
            layoutId={`title-${song.id}`}
          >
            {song.title}
          </motion.h3>
          <div className="flex items-center gap-2 text-xs">
            <StatusIndicator status={song.status} size="sm" />
            {song.status === "failed" ? (
              <span className="font-mono uppercase tracking-wider text-muted-foreground">
                {getStatusText(song.status)}
              </span>
            ) : (
              <span className="font-mono uppercase tracking-wider text-muted-foreground/70">
                {formatDate(song.createdAt)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
