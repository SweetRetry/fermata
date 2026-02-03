"use client"

import { useState } from "react"
import {
  EmptyState,
  LibraryHeader,
  LoadingState,
  type Song,
  SongGrid,
  useLibrary,
} from "@/features/music-library"
import { useAudioPlayer } from "@/features/player"

export default function LibraryPage() {
  const { data: libraryData, isLoading } = useLibrary(50)
  const songs = libraryData?.items ?? []
  const { isPlaying, togglePlay } = useAudioPlayer()
  const [playingId, setPlayingId] = useState<string | null>(null)

  const handleTogglePlay = (song: Song) => {
    if (playingId === song.id) {
      togglePlay()
      setPlayingId(null)
    } else if (song.audioUrl) {
      togglePlay(song.audioUrl)
      setPlayingId(song.id)
    }
  }

  return (
    <div className="flex h-full flex-col gap-8 p-12">
      <LibraryHeader count={songs.length} isLoading={isLoading} />

      {isLoading ? (
        <LoadingState />
      ) : songs.length === 0 ? (
        <EmptyState />
      ) : (
        <SongGrid
          songs={songs}
          playingId={playingId}
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
        />
      )}
    </div>
  )
}
