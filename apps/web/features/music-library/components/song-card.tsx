"use client"

import { motion } from "framer-motion"
import { Clock, Pause, Play } from "lucide-react"
import Link from "next/link"
import { formatDate, getStatusColor, getStatusText } from "../lib/utils"
import type { Song } from "../types"

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
}

interface SongCardProps {
  song: Song
  isPlaying: boolean
  isCurrentSong: boolean
  onTogglePlay: (song: Song) => void
}

export function SongCard({ song, isPlaying, isCurrentSong, onTogglePlay }: SongCardProps) {
  return (
    <motion.div
      variants={itemVariants}
      className="group relative rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-muted/50"
    >
      <Link href={`/details/${song.id}`} className="block">
        {/* Artwork Placeholder */}
        <div className="relative mb-4 aspect-square rounded-xl bg-muted">
          {song.status === "completed" ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                {isCurrentSong ? (
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
                e.preventDefault()
                e.stopPropagation()
                onTogglePlay(song)
              }}
              className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                {isCurrentSong ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
              </div>
            </button>
          )}
        </div>

        {/* Info */}
        <div className="space-y-1">
          <h3 className="font-medium text-foreground truncate">{song.title}</h3>
          <div className="flex items-center justify-between text-sm">
            <span className={getStatusColor(song.status)}>{getStatusText(song.status)}</span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3" />
              {formatDate(song.createdAt)}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
