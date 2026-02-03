/**
 * Music Library Feature Types
 */

export interface Song {
  id: string
  title: string
  status: "pending" | "generating" | "completed" | "failed"
  audioUrl?: string
  duration?: number
  createdAt: string
  updatedAt: string
}

export interface LibraryResponse {
  items: Song[]
  total: number
}

export interface LibraryQueryParams {
  limit?: number
  offset?: number
}
