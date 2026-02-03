"use client"

import { Button } from "@workspace/ui/components/button"
import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import { memo, useCallback } from "react"
import { useGeneration } from "@/features/music-generation/api/client"
import { useLibrary } from "@/features/music-library/api/client"
import { fadeInVariants } from "../animations/variants"
import { useAudioPlayer } from "../hooks/use-audio-player"
import { GenerationStatusCard } from "./generation-status"
import { RecentGenerationsList } from "./recent-generations-list"

interface CurrentGeneration {
  id: string
  title: string
  status: "pending" | "generating" | "completed" | "failed"
}

interface RightPanelProps {
  currentGeneration: CurrentGeneration | null
  onRetry: () => void
}

export const RightPanel = memo(function RightPanel({
  currentGeneration,
  onRetry,
}: RightPanelProps) {
  const { data: libraryData, isLoading: isLoadingRecent } = useLibrary(10)
  const recentGenerations = libraryData?.items ?? []

  const { data: currentGenData } = useGeneration(currentGeneration?.id || "")

  const { isPlaying, audioRef, togglePlay, handleEnded } = useAudioPlayer()

  const displayGeneration = currentGenData || currentGeneration

  return (
    <motion.div
      className="flex flex-1 flex-col gap-6 p-10"
      variants={fadeInVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium text-foreground">Recent Creations</h2>
        <Link href="/library">
          <Button type="button" variant="ghost" className="text-sm text-muted-foreground">
            View all
          </Button>
        </Link>
      </div>

      {/* Current Generation Status */}
      <AnimatePresence mode="wait">
        {displayGeneration && (
          <GenerationStatusCard
            generation={displayGeneration}
            currentGenData={currentGenData}
            isPlaying={isPlaying}
            onTogglePlay={togglePlay}
            onRetry={onRetry}
            audioRef={audioRef}
            onEnded={handleEnded}
          />
        )}
      </AnimatePresence>

      {/* Recent Generations List */}
      <RecentGenerationsList
        generations={recentGenerations}
        isLoading={isLoadingRecent}
        currentGenerationId={currentGeneration?.id}
      />
    </motion.div>
  )
})
