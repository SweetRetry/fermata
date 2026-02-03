/**
 * API Client
 *
 * 集中管理所有 API 调用，使用 TanStack Query 进行数据获取
 */

import {
  type UseMutationResult,
  type UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { buildUrl, endpoints } from "./endpoints";

// ============================================================================
// Types
// ============================================================================

export interface Generation {
  id: string;
  title: string;
  prompt: string;
  lyricsPrompt?: string;
  isInstrumental: boolean;
  status: "pending" | "generating" | "completed" | "failed";
  audioUrl?: string;
  duration?: number;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Song {
  id: string;
  title: string;
  status: "pending" | "generating" | "completed" | "failed";
  audioUrl?: string;
  duration?: number;
  createdAt: string;
}

export interface CreateGenerationInput {
  title?: string;
  prompt: string;
  lyrics_prompt?: string;
  is_instrumental?: boolean;
  audio_setting?: {
    bitrate: string;
    sample_rate: string;
  };
}

export interface CreateGenerationResponse {
  id: string;
  status: string;
  message: string;
}

export interface GenreMatch {
  name: string;
  description: string;
  url: string;
  level: string;
  parent?: string;
  reason: string;
  confidence: number;
}

export interface GenreSearchResponse {
  query: string;
  matches: GenreMatch[];
  relatedTerms: string[];
  summary: string;
}

// ============================================================================
// Query Keys
// ============================================================================

export const queryKeys = {
  generations: {
    all: ["generations"] as const,
    lists: () => [...queryKeys.generations.all, "list"] as const,
    list: (limit: number) => [...queryKeys.generations.lists(), limit] as const,
    details: () => [...queryKeys.generations.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.generations.details(), id] as const,
  },
  genres: {
    search: (query: string) => ["genres", "search", query] as const,
  },
} as const;

// ============================================================================
// API Functions - Music
// ============================================================================

async function fetchGenerations(limit = 50): Promise<Song[]> {
  const url = buildUrl(endpoints.music.library, { limit });
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch generations");
  }

  const data = await response.json();
  return data.items;
}

async function fetchGeneration(id: string): Promise<Generation> {
  const url = buildUrl(endpoints.music.generation, { id });
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch generation");
  }

  return response.json();
}

async function createGeneration(
  input: CreateGenerationInput,
): Promise<CreateGenerationResponse> {
  const response = await fetch(endpoints.music.generation, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create generation");
  }

  return response.json();
}

// ============================================================================
// API Functions - Genres
// ============================================================================

export async function searchGenres(
  query: string,
): Promise<GenreSearchResponse> {
  const response = await fetch(endpoints.genres.search, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, limit: 5 }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Search failed");
  }

  return response.json();
}

// ============================================================================
// Hooks - Music
// ============================================================================

export function useGenerations(
  limit = 50,
  options?: Omit<UseQueryOptions<Song[], Error>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: queryKeys.generations.list(limit),
    queryFn: () => fetchGenerations(limit),
    ...options,
  });
}

export function useGeneration(
  id: string | undefined,
  options?: Omit<UseQueryOptions<Generation, Error>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: queryKeys.generations.detail(id || ""),
    queryFn: () => fetchGeneration(id!),
    enabled: !!id,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data?.status === "pending" || data?.status === "generating") {
        return 2000;
      }
      return false;
    },
    ...options,
  });
}

export function useCreateGeneration(): UseMutationResult<
  CreateGenerationResponse,
  Error,
  CreateGenerationInput
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGeneration,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.generations.lists(),
      });
    },
  });
}

// ============================================================================
// Hooks - Genres
// ============================================================================

export function useGenreSearch(
  query: string,
  options?: Omit<
    UseQueryOptions<GenreSearchResponse, Error>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: queryKeys.genres.search(query),
    queryFn: () => searchGenres(query),
    enabled: !!query,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

// Re-export endpoints for direct access
export { endpoints, buildUrl };
