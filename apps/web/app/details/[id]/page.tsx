"use client"

import { useParams } from "next/navigation"
import {
  ArtworkSection,
  DetailsSection,
  ErrorState,
  LoadingState,
  useGeneration,
} from "@/features/music-generation"
import { usePlayerStore } from "@/features/player"

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
        isPlaying={isPlaying && isCurrentTrack}
        onTogglePlay={handleTogglePlay}
      />
      <DetailsSection generation={generation} onRetry={handleRetry} />
    </div>
  )
}
