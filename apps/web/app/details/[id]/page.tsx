"use client"

import { useParams } from "next/navigation"
import {
  ArtworkSection,
  DetailsSection,
  ErrorState,
  LoadingState,
  useGeneration,
} from "@/features/music-generation"
import { useAudioPlayer } from "@/features/player"

export default function DetailsPage() {
  const params = useParams()
  const id = params.id as string

  const { data: generation, isLoading, error, refetch } = useGeneration(id)
  const { isPlaying, togglePlay } = useAudioPlayer({
    onEnded: () => {},
  })

  const handleRetry = async () => {
    await refetch()
  }

  if (isLoading) {
    return <LoadingState />
  }

  if (error || !generation) {
    return <ErrorState message={error?.message} onRetry={handleRetry} />
  }

  return (
    <div className="flex h-full">
      <ArtworkSection
        generation={generation}
        isPlaying={isPlaying}
        onTogglePlay={() => {
          if (generation.audioUrl) {
            togglePlay(generation.audioUrl)
          }
        }}
      />
      <DetailsSection generation={generation} onRetry={handleRetry} />
    </div>
  )
}
