"use client"

import { motion } from "framer-motion"
import { SongCard } from "../../components/song-card"

const songs = [
  { id: "1", title: "Untitled (v1)", duration: "2:00", artist: "fspecil" },
  { id: "2", title: "Untitled (v2)", duration: "2:00", artist: "fspecil" },
  { id: "3", title: "Midnight Dreams", duration: "3:24", artist: "fspecil" },
]

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

export default function LibraryPage() {
  return (
    <div className="flex h-full flex-col gap-8 p-12">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-[32px] font-semibold text-foreground">Your Library</h1>
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
        Recently created tracks
      </motion.p>

      {/* Song Grid */}
      <motion.div
        className="flex flex-wrap gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {songs.map((song) => (
          <motion.div key={song.id} variants={itemVariants}>
            <SongCard
              id={song.id}
              title={song.title}
              duration={song.duration}
              artist={song.artist}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
