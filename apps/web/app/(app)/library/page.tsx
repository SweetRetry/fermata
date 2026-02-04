"use client";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@workspace/ui/components/context-menu";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
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
        .filter((s): s is Song & { audioUrl: string } => Boolean(s.audioUrl))
        .map((s) => ({
          id: s.id,
          title: s.title,
          artist: "MiniMax Music v2",
          audioUrl: s.audioUrl,
          duration: s.duration,
          model: "MiniMax Music v2",
        }));
      const startIndex = tracks.findIndex((t) => t.id === song.id);
      setPlaylist(tracks, Math.max(0, startIndex));
    }
  };

  const handleDownload = (song: Song) => {
    if (!song.audioUrl) return;
    const link = document.createElement("a");
    link.href = song.audioUrl;
    link.download = `${song.title}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            <ContextMenu key={song.id}>
              <ContextMenuTrigger asChild>
                <div>
                  <SongCard
                    song={song}
                    isCurrentSong={currentTrack?.id === song.id}
                    onTogglePlay={handleTogglePlay}
                  />
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem
                  onClick={() => handleDownload(song)}
                  disabled={!song.audioUrl}
                >
                  <Download className="mr-2 h-4 w-4" />
                  下载
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </motion.div>
      )}
    </div>
  );
}
