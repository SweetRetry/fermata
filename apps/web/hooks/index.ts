// Re-export all API hooks from lib/api
export {
  buildUrl,
  type CreateGenerationInput,
  type CreateGenerationResponse,
  // Utils
  endpoints,
  // Types
  type Generation,
  type GenreMatch,
  type GenreSearchResponse,
  queryKeys,
  type Song,
  useCreateGeneration,
  useGeneration,
  // Hooks
  useGenerations,
  useGenerations as useMusicLibrary,
  useGenreSearch,
} from "@/lib/api";

// Custom hooks
export { useAudioPlayer } from "./use-audio-player";
export { useGenreSearchForm } from "./use-genre-search-form";
