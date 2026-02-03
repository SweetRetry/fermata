/**
 * Music Library Feature
 *
 * @example
 * ```tsx
 * import { useLibrary, type Song } from "@/features/music-library";
 *
 * function MyComponent() {
 *   const { data } = useLibrary();
 *   return data?.items.map((song: Song) => <div key={song.id}>{song.title}</div>);
 * }
 * ```
 */

// API
export { libraryKeys, useLibrary } from "./api/client"

// Components
export {
  EmptyState,
  LibraryHeader,
  LoadingState,
  SongCard,
  SongGrid,
} from "./components"

// Utils
export { formatDate, getStatusColor, getStatusText } from "./lib/utils"

// Types
export type { LibraryQueryParams, LibraryResponse, Song } from "./types"
