"use client"

import { motion } from "framer-motion"
import { AlertCircle, Pause, Play } from "lucide-react"
import { StatusIndicator } from "@/components/status-indicator"
import { formatDate, getStatusText } from "../lib/utils"
import type { Generation } from "../types"

const slideInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
}

interface ArtworkSectionProps {
  generation: Generation
  isPlaying: boolean
  onTogglePlay: () => void
}

export function ArtworkSection({ generation, isPlaying, onTogglePlay }: ArtworkSectionProps) {
  return (
    <motion.div
      className="flex w-[620px] flex-col items-center justify-center gap-8 border-r border-border bg-background p-16"
      variants={slideInLeft}
      initial="hidden"
      animate="visible"
    >
      {/* Audio Visualizer or Placeholder */}
      <motion.div
        className="relative h-[400px] w-[400px] rounded-2xl border border-border bg-muted"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        {generation.status === "completed" ? (
          <div className="absolute inset-0 flex items-center justify-center">
            {isPlaying ? (
              <motion.div className="flex items-end gap-1 h-32">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-4 rounded-full bg-primary"
                    animate={{
                      height: [40, 100, 60, 120, 50],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.1,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </motion.div>
            ) : (
              <div className="flex h-24 items-end gap-1">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="w-4 rounded-full bg-muted-foreground/30"
                    style={{ height: `${40 + Math.random() * 40}px` }}
                  />
                ))}
              </div>
            )}
          </div>
        ) : generation.status === "failed" ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <AlertCircle className="h-16 w-16 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Generation Failed</span>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="h-16 w-16 rounded-full border-4 border-primary border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        )}

        {/* Play Button */}
        {generation.status === "completed" && generation.audioUrl && (
          <button
            type="button"
            onClick={onTogglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors hover:bg-black/10"
          >
            <motion.div
              className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
            </motion.div>
          </button>
        )}
      </motion.div>

      {/* Title Info */}
      <motion.div
        className="flex flex-col items-center gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <h1 className="text-3xl font-semibold text-foreground">{generation.title}</h1>
        <div className="flex items-center gap-2 text-base text-muted-foreground">
          <StatusIndicator status={generation.status} size="sm" />
          {generation.status === "failed" && (
            <span className="text-muted-foreground">{getStatusText(generation.status)}</span>
          )}
          {(generation.status === "pending" || generation.status === "generating") && <span />}
          {generation.status === "completed" && <span />}
          <span>·</span>
          <span className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {formatDate(generation.createdAt)}
          </span>
        </div>
      </motion.div>
    </motion.div>
  )
}
