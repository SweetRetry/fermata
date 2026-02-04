"use client"

import { motion } from "framer-motion"
import type { Song } from "../types"
import { SongCard } from "./song-card"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

interface SongGridProps {
  songs: Song[]
  currentTrackId?: string
  isPlaying: boolean
  onTogglePlay: (song: Song) => void
}

export function SongGrid({ songs, currentTrackId, isPlaying, onTogglePlay }: SongGridProps) {
  return (
    <motion.div
      className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {songs.map((song) => (
        <SongCard
          key={song.id}
          song={song}
          isPlaying={isPlaying}
          isCurrentSong={currentTrackId === song.id}
          onTogglePlay={onTogglePlay}
        />
      ))}
    </motion.div>
  )
}
