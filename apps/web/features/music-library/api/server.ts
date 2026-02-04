/**
 * Music Library Server API
 *
 * Business logic for music library - called by API routes
 */

import { desc, sql } from "drizzle-orm"
import { db } from "@/core/db"
import { generations, audioFiles } from "@/core/db/schema"
import type { LibraryQueryParams, LibraryResponse } from "../types"

/**
 * Get music library items
 * Joins with audio_files to get file metadata
 */
export async function getLibrary(params: LibraryQueryParams = {}): Promise<LibraryResponse> {
  const { limit = 50, offset = 0 } = params

  const items = await db.query.generations.findMany({
    orderBy: desc(generations.createdAt),
    limit,
    offset,
    with: {
      audioFiles: true,
    },
  })

  // Get total count
  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(generations)

  const total = countResult[0]?.count ?? 0

  return {
    items: items.map((item) => {
      // Get the first audio file (currently 1:1 relationship)
      const audioFile = item.audioFiles?.[0]

      return {
        id: item.id,
        title: item.title,
        status: item.status,
        audioUrl: audioFile?.publicUrl ?? undefined,
        duration: audioFile?.duration ?? undefined,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      }
    }),
    total,
  }
}
