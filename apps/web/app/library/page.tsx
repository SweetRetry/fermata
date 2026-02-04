"use client";

import { motion } from "framer-motion";
import {
  EmptyState,
  LibraryHeader,
  LoadingState,
  type Song,
  SongCard,
  useLibrary,
} from "@/features/music-library";
import { usePlayerStore } from "@/features/player";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export default function LibraryPage() {
  const { data: libraryData, isLoading } = useLibrary(50);
  const songs = libraryData?.items ?? [];
  const { currentTrack, setPlaylist, toggle } = usePlayerStore();

  const handleTogglePlay = (song: Song) => {
    if (!song.audioUrl) return;

    const isCurrentTrack = currentTrack?.id === song.id;
    if (isCurrentTrack) {
      toggle();
    } else {
      // Convert songs to tracks and set as playlist
      const tracks = songs
        .filter((s) => s.audioUrl)
        .map((s) => ({
          id: s.id,
          title: s.title,
          artist: "AI Generated",
          audioUrl: s.audioUrl!,
          model: "MiniMax Music v2",
        }));
      const startIndex = tracks.findIndex((t) => t.id === song.id);
      setPlaylist(tracks, Math.max(0, startIndex));
    }
  };

  return (
    <div className="flex h-full flex-col gap-8 p-12">
      <LibraryHeader count={songs.length} isLoading={isLoading} />

      {isLoading ? (
        <LoadingState />
      ) : songs.length === 0 ? (
        <EmptyState />
      ) : (
        <motion.div
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {songs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              isCurrentSong={currentTrack?.id === song.id}
              onTogglePlay={handleTogglePlay}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
