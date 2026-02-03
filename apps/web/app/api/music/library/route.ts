import { type NextRequest, NextResponse } from "next/server"
import { getLibrary } from "@/features/music-library/api/server"

// Get all generations (library)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "50", 10)
    const offset = Number.parseInt(searchParams.get("offset") || "0", 10)

    const result = await getLibrary({ limit, offset })
    return NextResponse.json(result)
  } catch (error) {
    console.error("Library fetch error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch library",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
