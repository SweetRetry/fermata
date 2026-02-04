"use client"

import { Button } from "@workspace/ui/components/button"
import { motion } from "framer-motion"
import { Eye, Pause, Play, RotateCcw } from "lucide-react"
import Link from "next/link"
import { usePlayerStore } from "@/features/player"
import type { Generation } from "@/features/music-generation"
import { StatusIndicator } from "@/components/status-indicator"
import { getStatusDisplay } from "../lib/get-status-display"

interface GenerationStatusProps {
  generation: {
    id: string
    title: string
    status: "pending" | "generating" | "completed" | "failed"
  }
  currentGenData?: Generation | null
  onRetry: () => void
}

export function GenerationStatusCard({
  generation,
  currentGenData,
  onRetry,
}: GenerationStatusProps) {
  const { currentTrack, isPlaying, setTrack, toggle } = usePlayerStore()

  const isCurrentTrack = currentTrack?.id === generation.id
  const showPlaying = isCurrentTrack && isPlaying

  const handlePlay = () => {
    if (!currentGenData?.audioUrl) return

    if (isCurrentTrack) {
      toggle()
    } else {
      setTrack({
        id: generation.id,
        title: generation.title,
        artist: "AI Generated",
        audioUrl: currentGenData.audioUrl,
        model: "MiniMax Music v2",
      })
    }
  }

  return (
    <motion.div
      key="current"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="rounded-2xl border border-border bg-muted/30 p-6"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-foreground">{generation.title}</h3>
          <div className="mt-1">
            <StatusIndicator status={generation.status} size="md" />
          </div>
          {generation.status === "failed" && (
            <p className="text-sm text-muted-foreground">{getStatusDisplay(generation.status).text}</p>
          )}
        </div>
        {generation.status === "failed" && (
          <Button type="button" variant="ghost" size="sm" onClick={onRetry} className="h-8 gap-1">
            <RotateCcw className="h-4 w-4" />
            重试
          </Button>
        )}
      </div>

      {/* Play & View Buttons */}
      {generation.status === "completed" && currentGenData?.audioUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 flex items-center gap-3"
        >
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handlePlay}
            className="h-12 w-12 rounded-full"
          >
            {showPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 ml-0.5" />
            )}
          </Button>
          <Link href={`/details/${generation.id}`}>
            <Button type="button" variant="ghost" size="sm" className="gap-2">
              <Eye className="h-4 w-4" />
              查看详情
            </Button>
          </Link>
        </motion.div>
      )}

      {/* Error Message */}
      {generation.status === "failed" && currentGenData?.errorMessage && (
        <p className="mt-3 text-sm text-destructive">{currentGenData.errorMessage}</p>
      )}
    </motion.div>
  )
}
