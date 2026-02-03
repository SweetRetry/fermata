import { type NextRequest, NextResponse } from "next/server"
import { createGeneration, getGeneration } from "@/features/music-generation/api/server"

// Create a new generation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = await createGeneration(body)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Generation creation error:", error)
    return NextResponse.json(
      {
        error: "Failed to create generation",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

// Get generation status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Generation ID is required" }, { status: 400 })
    }

    const generation = await getGeneration(id)

    if (!generation) {
      return NextResponse.json({ error: "Generation not found" }, { status: 404 })
    }

    return NextResponse.json(generation)
  } catch (error) {
    console.error("Generation fetch error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch generation",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
