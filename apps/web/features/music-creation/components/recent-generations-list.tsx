"use client"

import { Button } from "@workspace/ui/components/button"
import { motion } from "framer-motion"
import { AlertCircle, Play } from "lucide-react"
import Link from "next/link"
import type { Song } from "@/features/music-library"
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="h-16 w-16 rounded-2xl border border-border bg-muted"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <span className="text-sm text-muted-foreground">
          Your recent creations will appear here
        </span>
      </motion.div>
    )
  }

  return (
    <div className="flex-1 space-y-3 overflow-auto">
      {generations.map((gen: Song, index: number) => (
        <motion.div
          key={gen.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex items-center justify-between rounded-xl border border-border p-4 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              {gen.status === "completed" ? (
                <Play className="h-4 w-4 text-primary" />
              ) : gen.status === "failed" ? (
                <AlertCircle className="h-4 w-4 text-destructive" />
              ) : (
                <motion.div
                  className="h-4 w-4 rounded-full bg-primary"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </div>
            <div>
              <p className="font-medium text-sm text-foreground">{gen.title}</p>
              <p className={`text-xs ${getStatusDisplay(gen.status).color}`}>
                {getStatusDisplay(gen.status).text}
              </p>
            </div>
          </div>
          <Link href={`/details/${gen.id}`}>
            <Button type="button" variant="ghost" size="sm">
              查看
            </Button>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
