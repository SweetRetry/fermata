"use client"

import {
  EmptyState,
  LibraryHeader,
  LoadingState,
  type Song,
  SongGrid,
  useLibrary,
} from "@/features/music-library"
import { usePlayerStore } from "@/features/player"

export default function LibraryPage() {
  const { data: libraryData, isLoading } = useLibrary(50)
  const songs = libraryData?.items ?? []
  const { currentTrack, isPlaying, setTrack, toggle } = usePlayerStore()

  const handleTogglePlay = (song: Song) => {
    if (!song.audioUrl) return

    const isCurrentTrack = currentTrack?.id === song.id
    if (isCurrentTrack) {
      toggle()
    } else {
      setTrack({
        id: song.id,
        title: song.title,
        artist: "AI Generated",
        audioUrl: song.audioUrl,
        model: "MiniMax Music v2",
      })
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
          currentTrackId={currentTrack?.id}
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
        />
      )}
    </div>
  )
}
