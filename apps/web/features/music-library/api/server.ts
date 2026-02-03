/**
 * Music Library Server API
 *
 * Business logic for music library - called by API routes
 */

import { desc } from "drizzle-orm"
import { db } from "@/core/db"
import { generations } from "@/core/db/schema"
import type { LibraryQueryParams, LibraryResponse } from "../types"

/**
 * Get music library items
 */
export async function getLibrary(params: LibraryQueryParams = {}): Promise<LibraryResponse> {
  const { limit = 50, offset = 0 } = params

  const items = await db.query.generations.findMany({
    orderBy: desc(generations.createdAt),
    limit,
    offset,
  })

  return {
    items: items.map((item) => ({
      id: item.id,
      title: item.title,
      status: item.status,
      audioUrl: item.audioUrl ?? undefined,
      duration: item.duration ?? undefined,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    })),
    total: items.length,
  }
}
