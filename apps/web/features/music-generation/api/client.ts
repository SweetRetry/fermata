/**
 * Music Generation Client API
 *
 * TanStack Query hooks for music generation
 */

import {
  type UseMutationResult,
  type UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import type { CreateGenerationInput, CreateGenerationResponse, Generation } from "../types"

// ============================================================================
// Query Keys
// ============================================================================

export const generationKeys = {
  all: ["generations"] as const,
  lists: () => [...generationKeys.all, "list"] as const,
  list: (limit: number) => [...generationKeys.lists(), limit] as const,
  details: () => [...generationKeys.all, "detail"] as const,
  detail: (id: string) => [...generationKeys.details(), id] as const,
} as const

// ============================================================================
// API Functions
// ============================================================================

const API_BASE = "/api/music/generation"

async function fetchGeneration(id: string): Promise<Generation> {
  const url = `${API_BASE}?id=${encodeURIComponent(id)}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error("Failed to fetch generation")
  }

  return response.json()
}

async function createGeneration(input: CreateGenerationInput): Promise<CreateGenerationResponse> {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to create generation")
  }

  return response.json()
}

// ============================================================================
// Hooks
// ============================================================================

export function useGeneration(
  id: string | undefined,
  options?: Omit<UseQueryOptions<Generation, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: generationKeys.detail(id || ""),
    queryFn: () => fetchGeneration(id || ""),
    enabled: !!id,
    refetchInterval: (query) => {
      const data = query.state.data
      if (data?.status === "pending" || data?.status === "generating") {
        return 5000
      }
      return false
    },
    ...options,
  })
}

export function useCreateGeneration(): UseMutationResult<
  CreateGenerationResponse,
  Error,
  CreateGenerationInput
> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createGeneration,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: generationKeys.lists(),
      })
    },
  })
}
