import { type NextRequest, NextResponse } from "next/server"
import { generateMusic } from "@/lib/fal-intergration"
import { MiniMaxMusicV2InputSchema } from "@/lib/fal-intergration/types"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const parseResult = MiniMaxMusicV2InputSchema.safeParse(body)
    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Invalid request body",
          details: parseResult.error.errors,
        },
        { status: 400 }
      )
    }

    const result = await generateMusic(parseResult.data)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Music generation error:", error)

    if (error instanceof Error && error.message.includes("FAL_API_KEY")) {
      return NextResponse.json(
        { error: "Server configuration error: FAL_API_KEY not set" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        error: "Failed to generate music",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
