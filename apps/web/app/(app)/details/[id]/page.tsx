"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useParams } from "next/navigation"
import {
  ArtworkSection,
  DetailsSection,
  ErrorState,
  LoadingState,
  useGeneration,
} from "@/features/music-generation"
import { usePlayerStore } from "@/features/player"

const EASE_REVEAL = [0.16, 1, 0.3, 1] as const

export default function DetailsPage() {
  const params = useParams()
  const id = params.id as string

  const { data: generation, isLoading, error, refetch } = useGeneration(id)
  const { currentTrack, isPlaying, setTrack, toggle } = usePlayerStore()

  const isCurrentTrack = currentTrack?.id === id

  const handleTogglePlay = () => {
    if (!generation?.audioUrl) return

    if (isCurrentTrack) {
      toggle()
    } else {
      setTrack({
        id: generation.id,
        title: generation.title,
        artist: "AI Generated",
        audioUrl: generation.audioUrl,
        model: "MiniMax Music v2",
      })
    }
  }

  const handleRetry = async () => {
    await refetch()
  }

  return (
    <motion.div
      className="flex h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: EASE_REVEAL }}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            className="flex h-full w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LoadingState />
          </motion.div>
        ) : error || !generation ? (
          <motion.div
            key="error"
            className="flex h-full w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ErrorState message={error?.message} onRetry={handleRetry} />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            className="flex h-full w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE_REVEAL }}
          >
            <ArtworkSection
              generation={generation}
              isPlaying={isPlaying && isCurrentTrack}
              onTogglePlay={handleTogglePlay}
            />
            <DetailsSection generation={generation} onRetry={handleRetry} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
