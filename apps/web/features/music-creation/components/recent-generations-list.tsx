"use client"

import { Button } from "@workspace/ui/components/button"
import { motion } from "framer-motion"
import { AlertCircle, Pause, Play } from "lucide-react"
import Link from "next/link"
import { StatusIndicator } from "@/components/status-indicator"
import type { Song } from "@/features/music-library"
import { usePlayerStore } from "@/features/player"
import { getStatusDisplay } from "../lib/get-status-display"

interface RecentGenerationsListProps {
  generations: Song[]
  isLoading: boolean
  currentGenerationId?: string | null
}

export function RecentGenerationsList({
  generations,
  isLoading,
  currentGenerationId,
}: RecentGenerationsListProps) {
  const { currentTrack, isPlaying, setTrack, toggle } = usePlayerStore()
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <motion.div
          className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    )
  }

  if (generations.length === 0 && !currentGenerationId) {
    return (
      <motion.div
        className="flex flex-1 flex-col items-center justify-center gap-4 py-20"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="h-16 w-16 rounded-2xl border border-border bg-muted" />
        <span className="text-sm text-muted-foreground">
          Your recent creations will appear here
        </span>
      </motion.div>
    )
  }

  const handlePlay = (gen: Song) => {
    if (!gen.audioUrl) return

    const isCurrentTrack = currentTrack?.id === gen.id
    if (isCurrentTrack) {
      toggle()
    } else {
      setTrack({
        id: gen.id,
        title: gen.title,
        artist: "AI Generated",
        audioUrl: gen.audioUrl,
        model: "MiniMax Music v2",
      })
    }
  }

  return (
    <div className="flex-1 space-y-3 overflow-auto">
      {generations.map((gen: Song, index: number) => {
        const isCurrentTrack = currentTrack?.id === gen.id
        const showPlaying = isCurrentTrack && isPlaying

        return (
          <motion.div
            key={gen.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between rounded-xl border border-border p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => gen.status === "completed" && handlePlay(gen)}
                disabled={gen.status !== "completed"}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted disabled:cursor-not-allowed"
              >
                {gen.status === "completed" ? (
                  showPlaying ? (
                    <Pause className="h-4 w-4 text-primary" />
                  ) : (
                    <Play className="h-4 w-4 text-primary" />
                  )
                ) : gen.status === "failed" ? (
                  <AlertCircle className="h-4 w-4 text-destructive" />
                ) : (
                  <motion.div
                    className="h-4 w-4 rounded-full bg-primary"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </button>
              <div>
                <p className="font-medium text-sm text-foreground">{gen.title}</p>
                <div className="mt-1">
                  <StatusIndicator status={gen.status} size="sm" />
                </div>
                {gen.status === "failed" && (
                  <p className="text-xs text-muted-foreground">
                    {getStatusDisplay(gen.status).text}
                  </p>
                )}
              </div>
            </div>
            <Link href={`/details/${gen.id}`}>
              <Button type="button" variant="ghost" size="sm">
                View
              </Button>
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
}
