/**
 * Genres Module - AI-First Semantic Search
 *
 * Public API for genre search functionality.
 *
 * @example
 * ```typescript
 * import { searchGenres, getGenreByName, getAllGenres } from "@/lib/genres";
 *
 * // AI-powered semantic search
 * const results = await searchGenres("适合深夜工作的音乐");
 *
 * // Get specific genre
 * const genre = await getGenreByName("Ambient");
 *
 * // Get all genres
 * const allGenres = await getAllGenres();
 * ```
 */

// Core search functions
export {
  performAISearch,
  performKeywordSearch,
  searchGenres,
} from "./ai-search-agent";

// Knowledge base functions
export {
  getAllGenres,
  getGenreByName,
  getGenreDatabaseForAI,
  getKnowledgeBase,
  getMainGenres,
  searchGenresByName,
} from "./genre-knowledge-base";

// Types
export type {
  AISearchResult,
  GenreEntry,
  GenreMatch,
  RawDetailedGenre,
  RawGenre,
  RawMainGenre,
  SearchResponse,
} from "./types";
