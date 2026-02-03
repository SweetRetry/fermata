/**
 * Genre Discovery Client API
 *
 * TanStack Query hooks for genre search
 */

import { type UseQueryOptions, useQuery } from "@tanstack/react-query"
import type { GenreSearchResponse } from "../types"

// ============================================================================
// Query Keys
// ============================================================================

export const genreKeys = {
  all: ["genres"] as const,
  search: (query: string) => [...genreKeys.all, "search", query] as const,
} as const

// ============================================================================
// API Functions
// ============================================================================

export async function searchGenres(query: string): Promise<GenreSearchResponse> {
  const response = await fetch("/api/genres/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, limit: 5 }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Search failed")
  }

  return response.json()
}

// ============================================================================
// Hooks
// ============================================================================

export function useGenreSearch(
  query: string,
  options?: Omit<UseQueryOptions<GenreSearchResponse, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: genreKeys.search(query),
    queryFn: () => searchGenres(query),
    enabled: !!query,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  })
}
