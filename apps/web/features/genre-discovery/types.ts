/**
 * Genre Discovery Feature Types
 */

/** Represents a genre match result */
export interface GenreMatch {
  name: string
  description: string
  url: string
  level: string
  parent?: string
  reason: string
  confidence: number
}

/** Search response structure */
export interface GenreSearchResponse {
  query: string
  matches: GenreMatch[]
  relatedTerms: string[]
  summary: string
}

/** Search request input */
export interface GenreSearchInput {
  query: string
  limit?: number
}

/** Raw genre data from JSON files */
export interface RawGenre {
  name: string
  description: string
  url: string
}

export interface RawMainGenre extends RawGenre {
  sub_genres?: RawGenre[]
}

export interface RawDetailedGenre extends RawGenre {
  level: string
  parent?: string
  children?: Array<{
    name: string
    description: string
    level: string
  }>
}

/** Complete genre entry in knowledge base */
export interface GenreEntry {
  name: string
  description: string
  url: string
  level: "main" | "sub" | "detailed"
  parent?: string
  subGenres?: RawGenre[]
  children?: Array<{
    name: string
    description: string
    level: string
  }>
}
