"use client"

import { Button } from "@workspace/ui/components/button"
import { motion } from "framer-motion"
import { CheckCircle2, Pause, Play, RotateCcw } from "lucide-react"
import type { Generation } from "@/features/music-generation"
import { getStatusDisplay } from "../lib/get-status-display"

interface GenerationStatusProps {
  generation: {
    id: string
    title: string
    status: "pending" | "generating" | "completed" | "failed"
  }
  currentGenData?: Generation | null
  isPlaying: boolean
  onTogglePlay: () => void
  onRetry: () => void
  audioRef: React.RefObject<HTMLAudioElement | null>
  onEnded: () => void
}

export function GenerationStatusCard({
  generation,
  currentGenData,
  isPlaying,
  onTogglePlay,
  onRetry,
  audioRef,
  onEnded,
}: GenerationStatusProps) {
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
          <p className={`text-sm ${getStatusDisplay(generation.status).color}`}>
            {getStatusDisplay(generation.status).text}
          </p>
        </div>
        {generation.status === "completed" && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
        {generation.status === "failed" && (
          <Button type="button" variant="ghost" size="sm" onClick={onRetry} className="h-8 gap-1">
            <RotateCcw className="h-4 w-4" />
            重试
          </Button>
        )}
      </div>

      {/* Audio Player */}
      {generation.status === "completed" && currentGenData?.audioUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 flex items-center gap-4"
        >
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onTogglePlay}
            className="h-12 w-12 rounded-full"
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
          </Button>
          <audio
            ref={audioRef}
            src={currentGenData.audioUrl}
            onEnded={onEnded}
            className="hidden"
          />
          <div className="flex-1">
            <div className="h-1 rounded-full bg-muted">
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={{ width: "0%" }}
                animate={{
                  width: isPlaying ? "100%" : "0%",
                }}
                transition={{
                  duration: currentGenData.duration || 120,
                  ease: "linear",
                }}
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Error Message */}
      {generation.status === "failed" && currentGenData?.errorMessage && (
        <p className="mt-3 text-sm text-destructive">{currentGenData.errorMessage}</p>
      )}
    </motion.div>
  )
}
