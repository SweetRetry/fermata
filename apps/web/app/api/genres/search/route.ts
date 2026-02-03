import { type NextRequest, NextResponse } from "next/server"
import { searchGenres } from "@/features/genre-discovery/api/server"

// GET handler (redirects to POST for consistency)
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

// POST handler
export async function POST(request: NextRequest) {
  let queryForError: string | undefined
  try {
    const body = await request.json()
    const { query, limit = 5 } = body
    queryForError = query

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    const result = await searchGenres({ query, limit })
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
