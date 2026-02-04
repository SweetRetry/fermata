/**
 * Genre Discovery Feature
 *
 * @example
 * ```tsx
 * import { useGenreSearch, useGenreSearchForm } from "@/features/genre-discovery";
 *
 * function MyComponent() {
 *   const { data } = useGenreSearch(query);
 *   const { handleSearch } = useGenreSearchForm();
 * }
 * ```
 */

// API
export { useGenreSearch } from "./api/client"
// Components
export {
  EmptyState,
  ErrorState,
  ExampleQueries,
  GenreMatchCard,
  SearchHeader,
  SearchResults,
} from "./components"
// Hooks
export { useGenreSearchForm } from "./hooks/use-genre-search-form"

// Types
export type {
  GenreEntry,
  GenreMatch,
  GenreSearchInput,
  GenreSearchResponse,
} from "./types"
