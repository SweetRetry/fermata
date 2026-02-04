import { type NextRequest, NextResponse } from "next/server"
import { getLibrary, deleteGeneration } from "@/features/music-library/api/server"

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

// Delete a generation
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "Missing id parameter" },
        { status: 400 }
      )
    }

    await deleteGeneration(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Library delete error:", error)
    return NextResponse.json(
      {
        error: "Failed to delete song",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
