/**
 * Genre types for AI-First semantic search
 *
 * @module
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
export interface SearchResponse {
  query: string
  matches: GenreMatch[]
  relatedTerms: string[]
  summary: string
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

/** AI search result structure */
export interface AISearchResult {
  matches: Array<{
    name: string
    reason: string
    confidence: number
  }>
  relatedTerms: string[]
  summary: string
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
