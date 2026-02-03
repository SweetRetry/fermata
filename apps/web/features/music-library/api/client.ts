/**
 * Music Library Client API
 *
 * TanStack Query hooks for music library
 */

import { type UseQueryOptions, useQuery } from "@tanstack/react-query"
import type { LibraryResponse } from "../types"

// ============================================================================
// Query Keys
// ============================================================================

export const libraryKeys = {
  all: ["library"] as const,
  lists: () => [...libraryKeys.all, "list"] as const,
  list: (limit: number) => [...libraryKeys.lists(), limit] as const,
} as const

// ============================================================================
// API Functions
// ============================================================================

async function fetchLibrary(limit = 50): Promise<LibraryResponse> {
  const url = `/api/music/library?limit=${limit}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error("Failed to fetch library")
  }

  return response.json()
}

// ============================================================================
// Hooks
// ============================================================================

export function useLibrary(
  limit = 50,
  options?: Omit<UseQueryOptions<LibraryResponse, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: libraryKeys.list(limit),
    queryFn: () => fetchLibrary(limit),
    ...options,
  })
}
