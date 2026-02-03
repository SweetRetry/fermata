"use client"

import { motion } from "framer-motion"
import Link from "next/link"

interface SongCardProps {
  id: string
  title: string
  duration: string
  artist: string
}

export function SongCard({ id, title, duration, artist }: SongCardProps) {
  return (
    <Link href={`/details/${id}`} className="flex w-[200px] flex-col gap-3">
      {/* Song Thumbnail */}
      <motion.div
        className="h-[200px] w-[200px] rounded-xl border border-border bg-muted"
        whileHover={{ scale: 1.03, borderColor: "var(--primary)" }}
        transition={{ duration: 0.2 }}
      />

      {/* Song Info */}
      <motion.div
        className="flex w-full flex-col gap-1"
        initial={{ opacity: 0.8 }}
        whileHover={{ opacity: 1 }}
      >
        <span className="text-base font-medium text-foreground">{title}</span>
        <span className="text-[13px] text-muted-foreground">
          {duration} · {artist}
        </span>
      </motion.div>
    </Link>
  )
}
