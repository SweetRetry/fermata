import { type NextRequest, NextResponse } from "next/server"
import { performAISearch, performKeywordSearch } from "@/lib/genres/ai-search-agent"
import type { SearchResponse } from "@/lib/genres/types"

// ============================================================================
// Cache
// ============================================================================

const cache = new Map<string, { data: SearchResponse; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

// ============================================================================
// API Handlers
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { query?: string; limit?: number }
    const { query, limit = 5 } = body

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    const cacheKey = `${query}:${limit}`
    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json(cached.data)
    }

    // Determine search strategy based on query complexity
    const isSimpleQuery = /^[a-zA-Z0-9\s]+$/.test(query) && query.length < 30

    const result = isSimpleQuery
      ? await performKeywordSearch(query, limit)
      : await performAISearch(query, limit)

    cache.set(cacheKey, { data: result, timestamp: Date.now() })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Genre search error:", error)
    return NextResponse.json(
      {
        error: "Search failed",
        message: error instanceof Error ? error.message : "Unknown error",
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
