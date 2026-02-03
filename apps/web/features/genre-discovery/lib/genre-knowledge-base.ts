/**
 * Genre Knowledge Base - Pre-loads all genre data for AI context
 *
 * This module loads all genre data into memory at startup, providing
 * the complete genre database as context for AI semantic search.
 */

import { promises as fs } from "node:fs"
import path from "node:path"
import type { GenreEntry, RawDetailedGenre, RawMainGenre } from "../types"

const REFERENCES_DIR = path.join(process.cwd(), "features", "genre-discovery", "data")

/** In-memory knowledge base */
let knowledgeBase: Map<string, GenreEntry> | null = null
let allGenresList: GenreEntry[] | null = null
let cachedDatabaseForAI: string | null = null

/** Cache for main genres list */
let mainGenresList: GenreEntry[] | null = null

/** Cache for main genre sub-genres data */
let mainGenreSubGenresCache: Map<string, GenreEntry[]> | null = null

/**
 * Initialize the knowledge base by loading all genre data
 */
async function initializeKnowledgeBase(): Promise<Map<string, GenreEntry>> {
  const kb = new Map<string, GenreEntry>()
  const genresList: GenreEntry[] = []

  // Load each main genre and its sub-genres
  const mainFiles = await fs.readdir(path.join(REFERENCES_DIR, "main"))

  for (const file of mainFiles) {
    if (!file.endsWith(".json")) continue

    const mainPath = path.join(REFERENCES_DIR, "main", file)
    const mainContent = await fs.readFile(mainPath, "utf-8")
    const mainData = JSON.parse(mainContent) as RawMainGenre

    const mainEntry: GenreEntry = {
      name: mainData.name,
      description: mainData.description,
      url: mainData.url,
      level: "main",
      subGenres: mainData.sub_genres || [],
    }

    kb.set(mainData.name.toLowerCase(), mainEntry)
    genresList.push(mainEntry)

    // Add sub-genres
    if (mainData.sub_genres) {
      for (const sub of mainData.sub_genres) {
        const subEntry: GenreEntry = {
          name: sub.name,
          description: sub.description,
          url: sub.url,
          level: "sub",
          parent: mainData.name,
        }

        if (!kb.has(sub.name.toLowerCase())) {
          kb.set(sub.name.toLowerCase(), subEntry)
          genresList.push(subEntry)
        }
      }
    }
  }

  // Load detailed genre files
  const detailedFiles = await fs.readdir(path.join(REFERENCES_DIR, "detailed"))

  for (const file of detailedFiles) {
    if (!file.endsWith(".json")) continue

    const detailedPath = path.join(REFERENCES_DIR, "detailed", file)
    const detailedContent = await fs.readFile(detailedPath, "utf-8")
    const detailedData = JSON.parse(detailedContent) as RawDetailedGenre

    const existing = kb.get(detailedData.name.toLowerCase())

    if (existing) {
      // Enhance existing entry with detailed info
      existing.level = detailedData.level as "main" | "sub" | "detailed"
      existing.parent = detailedData.parent
      existing.children = detailedData.children
    } else {
      const detailedEntry: GenreEntry = {
        name: detailedData.name,
        description: detailedData.description,
        url: detailedData.url,
        level: detailedData.level as "main" | "sub" | "detailed",
        parent: detailedData.parent,
        children: detailedData.children,
      }

      kb.set(detailedData.name.toLowerCase(), detailedEntry)
      genresList.push(detailedEntry)
    }
  }

  knowledgeBase = kb
  allGenresList = genresList

  return kb
}

/**
 * Get the knowledge base (initialize if needed)
 */
async function getKnowledgeBase(): Promise<Map<string, GenreEntry>> {
  if (!knowledgeBase) {
    return initializeKnowledgeBase()
  }
  return knowledgeBase
}

/**
 * Get all genres as a list
 */
export async function getAllGenres(): Promise<GenreEntry[]> {
  if (!allGenresList) {
    await getKnowledgeBase()
  }
  return allGenresList || []
}

/**
 * Get a genre by name (case-insensitive)
 */
export async function getGenreByName(name: string): Promise<GenreEntry | null> {
  const kb = await getKnowledgeBase()
  return kb.get(name.toLowerCase()) || null
}

/**
 * Search genres by name (partial match)
 */
export async function searchGenresByName(query: string, limit = 5): Promise<GenreEntry[]> {
  const genres = await getAllGenres()
  const lowerQuery = query.toLowerCase()

  const matches = genres.filter(
    (g) =>
      g.name.toLowerCase().includes(lowerQuery) || g.description.toLowerCase().includes(lowerQuery)
  )

  // Sort: exact match first, then starts with, then includes
  matches.sort((a, b) => {
    const aName = a.name.toLowerCase()
    const bName = b.name.toLowerCase()

    if (aName === lowerQuery) return -1
    if (bName === lowerQuery) return 1
    if (aName.startsWith(lowerQuery)) return -1
    if (bName.startsWith(lowerQuery)) return 1
    return 0
  })

  return matches.slice(0, limit)
}

/**
 * Get formatted database for AI context
 */
export async function getDatabaseForAI(): Promise<string> {
  if (cachedDatabaseForAI) {
    return cachedDatabaseForAI
  }

  const genres = await getAllGenres()

  const lines: string[] = []
  for (const genre of genres) {
    lines.push(`${genre.name}: ${genre.description}`)
    if (genre.subGenres && genre.subGenres.length > 0) {
      for (const sub of genre.subGenres) {
        lines.push(`  - ${sub.name}: ${sub.description}`)
      }
    }
  }

  cachedDatabaseForAI = lines.join("\n")
  return cachedDatabaseForAI
}

/**
 * Get main genres formatted for AI (49 categories)
 */
export async function getMainGenresForAI(): Promise<string> {
  if (!mainGenresList) {
    const genres = await getAllGenres()
    mainGenresList = genres.filter((g) => g.level === "main")
  }

  return mainGenresList.map((g) => `- ${g.name}: ${g.description}`).join("\n")
}

/**
 * Get sub-genres for selected main categories
 */
export async function getSubGenresForAI(mainGenreNames: string[]): Promise<string> {
  if (!mainGenreSubGenresCache) {
    mainGenreSubGenresCache = new Map()
  }

  const lines: string[] = []

  for (const mainName of mainGenreNames) {
    // Check cache
    let subGenres = mainGenreSubGenresCache.get(mainName)

    if (!subGenres) {
      const mainGenre = await getGenreByName(mainName)
      subGenres = mainGenre?.subGenres
        ? mainGenre.subGenres.map((sub) => ({
            name: sub.name,
            description: sub.description,
            url: sub.url,
            level: "sub" as const,
            parent: mainName,
          }))
        : []
      mainGenreSubGenresCache.set(mainName, subGenres)
    }

    lines.push(`\n## ${mainName}`)
    for (const sub of subGenres) {
      lines.push(`- ${sub.name}: ${sub.description}`)
    }
  }

  return lines.join("\n")
}
