/**
 * Genre Discovery Server API
 *
 * Business logic for genre search - called by API routes
 */

import { performAISearch, performKeywordSearch } from "../lib/search-agent"
import type { GenreSearchInput, GenreSearchResponse } from "../types"

// Simple query detection
const SIMPLE_QUERY_REGEX = /^[a-zA-Z0-9\s]+$/

// Cache configuration
const cache = new Map<string, { data: GenreSearchResponse; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes
const MAX_CACHE_SIZE = 100

function setCache(key: string, data: GenreSearchResponse): void {
  if (cache.size >= MAX_CACHE_SIZE) {
    const firstKey = cache.keys().next().value
    if (firstKey) {
      cache.delete(firstKey)
    }
  }
  cache.set(key, { data, timestamp: Date.now() })
}

function getCache(key: string): GenreSearchResponse | null {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }
  return null
}

/**
 * Search genres by query
 */
export async function searchGenres(input: GenreSearchInput): Promise<GenreSearchResponse> {
  const { query, limit = 3 } = input

  if (!query || typeof query !== "string") {
    throw new Error("Query is required")
  }

  // Check cache
  const cacheKey = `${query}:${limit}`
  const cached = getCache(cacheKey)
  if (cached) {
    return cached
  }

  // Determine search strategy based on query complexity
  const isSimpleQuery = SIMPLE_QUERY_REGEX.test(query) && query.length < 30

  const result = isSimpleQuery
    ? await performKeywordSearch(query, limit)
    : await performAISearch(query, limit)

  setCache(cacheKey, result)

  return result
}
