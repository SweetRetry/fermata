import { type NextRequest, NextResponse } from "next/server"
import { performAISearch, performKeywordSearch } from "@/lib/genres/ai-search-agent"
import type { SearchResponse } from "@/lib/genres/types"

// Pre-compiled regex for query complexity check
const SIMPLE_QUERY_REGEX = /^[a-zA-Z0-9\s]+$/

// ============================================================================
// Cache
// ============================================================================

const cache = new Map<string, { data: SearchResponse; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes
const MAX_CACHE_SIZE = 100

function setCache(key: string, data: SearchResponse): void {
  if (cache.size >= MAX_CACHE_SIZE) {
    const firstKey = cache.keys().next().value
    if (firstKey) {
      cache.delete(firstKey)
    }
  }
  cache.set(key, { data, timestamp: Date.now() })
}

// ============================================================================
// API Handlers
// ============================================================================

export async function POST(request: NextRequest) {
  let queryForError: string | undefined
  try {
    const body = (await request.json()) as { query?: string; limit?: number }
    const { query, limit = 5 } = body
    queryForError = query

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    const cacheKey = `${query}:${limit}`
    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json(cached.data)
    }

    // Determine search strategy based on query complexity
    const isSimpleQuery = SIMPLE_QUERY_REGEX.test(query) && query.length < 30

    const result = isSimpleQuery
      ? await performKeywordSearch(query, limit)
      : await performAISearch(query, limit)

    setCache(cacheKey, result)

    return NextResponse.json(result)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("GENRE_SEARCH_001: Search failed - query:", queryForError, "error:", errorMessage)
    return NextResponse.json(
      {
        error: "GENRE_SEARCH_001: Search failed",
        message: errorMessage,
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 })
  }

  return POST(
    new Request(request.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    }) as NextRequest
  )
}
