import { fal } from "@fal-ai/client"
import type { MiniMaxMusicV2Input, MiniMaxMusicV2Output } from "./types"

fal.config({
  credentials: process.env.FAL_API_KEY,
})

/**
 * Generate music using MiniMax Music v2 model
 * @param input - Music generation parameters
 * @returns Generated audio file metadata
 */
export async function generateMusic(input: MiniMaxMusicV2Input): Promise<MiniMaxMusicV2Output> {
  const result = await fal.run("fal-ai/minimax-music/v2", {
    input,
  })

  return result.data as MiniMaxMusicV2Output
}
