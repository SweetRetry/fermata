/**
 * Genre Knowledge Base - Pre-loads all genre data for AI context
 *
 * This module loads all genre data into memory at startup, providing
 * the complete genre database as context for AI semantic search.
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import type { GenreEntry, RawDetailedGenre, RawMainGenre } from "./types";

const REFERENCES_DIR = path.join(process.cwd(), "lib", "skill", "references");

/** In-memory knowledge base */
let knowledgeBase: Map<string, GenreEntry> | null = null;
let allGenresList: GenreEntry[] | null = null;
let cachedDatabaseForAI: string | null = null;

/** Cache for main genres list */
let mainGenresList: GenreEntry[] | null = null;

/** Cache for main genre sub-genres data */
let mainGenreSubGenresCache: Map<string, GenreEntry[]> | null = null;

/**
 * Initialize the knowledge base by loading all genre data
 */
async function initializeKnowledgeBase(): Promise<Map<string, GenreEntry>> {
  const kb = new Map<string, GenreEntry>();
  const genresList: GenreEntry[] = [];

  // Load index file to get main genres
  const indexPath = path.join(REFERENCES_DIR, "_index.json");
  const indexContent = await fs.readFile(indexPath, "utf-8");
  // Parse to validate structure, data loaded from main files
  void JSON.parse(indexContent);

  // Load each main genre and its sub-genres
  const mainFiles = await fs.readdir(path.join(REFERENCES_DIR, "main"));

  for (const file of mainFiles) {
    if (!file.endsWith(".json")) continue;

    const mainPath = path.join(REFERENCES_DIR, "main", file);
    const mainContent = await fs.readFile(mainPath, "utf-8");
    const mainData = JSON.parse(mainContent) as RawMainGenre;

    const mainEntry: GenreEntry = {
      name: mainData.name,
      description: mainData.description,
      url: mainData.url,
      level: "main",
      subGenres: mainData.sub_genres || [],
    };

    kb.set(mainData.name.toLowerCase(), mainEntry);
    genresList.push(mainEntry);

    // Add sub-genres
    if (mainData.sub_genres) {
      for (const sub of mainData.sub_genres) {
        const subEntry: GenreEntry = {
          name: sub.name,
          description: sub.description,
          url: sub.url,
          level: "sub",
          parent: mainData.name,
        };

        if (!kb.has(sub.name.toLowerCase())) {
          kb.set(sub.name.toLowerCase(), subEntry);
          genresList.push(subEntry);
        }
      }
    }
  }

  // Load detailed genre files
  const detailedFiles = await fs.readdir(path.join(REFERENCES_DIR, "detailed"));

  for (const file of detailedFiles) {
    if (!file.endsWith(".json")) continue;

    const detailedPath = path.join(REFERENCES_DIR, "detailed", file);
    const detailedContent = await fs.readFile(detailedPath, "utf-8");
    const detailedData = JSON.parse(detailedContent) as RawDetailedGenre;

    const existing = kb.get(detailedData.name.toLowerCase());

    if (existing) {
      // Enhance existing entry with detailed info
      existing.level = detailedData.level as "main" | "sub" | "detailed";
      existing.parent = detailedData.parent;
      existing.children = detailedData.children;
    } else {
      const detailedEntry: GenreEntry = {
        name: detailedData.name,
        description: detailedData.description,
        url: detailedData.url,
        level: detailedData.level as "main" | "sub" | "detailed",
        parent: detailedData.parent,
        children: detailedData.children,
      };

      kb.set(detailedData.name.toLowerCase(), detailedEntry);
      genresList.push(detailedEntry);
    }
  }

  allGenresList = genresList;
  return kb;
}

/**
 * Get the knowledge base (initialize if needed)
 */
export async function getKnowledgeBase(): Promise<Map<string, GenreEntry>> {
  if (!knowledgeBase) {
    knowledgeBase = await initializeKnowledgeBase();
  }
  return knowledgeBase;
}

/**
 * Get all genres as a list
 */
export async function getAllGenres(): Promise<GenreEntry[]> {
  if (!allGenresList) {
    await getKnowledgeBase();
  }
  return allGenresList || [];
}

/**
 * Get a specific genre by name (case-insensitive)
 */
export async function getGenreByName(
  name: string,
): Promise<GenreEntry | undefined> {
  const kb = await getKnowledgeBase();
  return kb.get(name.toLowerCase());
}

/**
 * Get the complete genre database as a JSON string for AI context
 * This is the core function that provides all genre data to the AI
 */
export async function getGenreDatabaseForAI(): Promise<string> {
  if (cachedDatabaseForAI) {
    return cachedDatabaseForAI;
  }

  const genres = await getAllGenres();

  // Create a compact representation for AI context
  const compactGenres = genres.map((g) => ({
    name: g.name,
    description: g.description.slice(0, 200),
    level: g.level,
    parent: g.parent,
    subGenres: g.subGenres?.map((s: { name: string }) => s.name),
  }));

  cachedDatabaseForAI = JSON.stringify(
    {
      totalGenres: compactGenres.length,
      genres: compactGenres,
    },
    null,
    2,
  );

  return cachedDatabaseForAI;
}

/**
 * Get main genres only (top-level categories)
 * Uses cached list if available
 */
export async function getMainGenres(): Promise<GenreEntry[]> {
  if (mainGenresList) {
    return mainGenresList;
  }
  const genres = await getAllGenres();
  mainGenresList = genres.filter((g) => g.level === "main");
  return mainGenresList;
}

/**
 * Get main genres formatted for AI context (compact)
 * Returns only name and description for the 49 main genres
 */
export async function getMainGenresForAI(): Promise<string> {
  const mainGenres = await getMainGenres();
  const compact = mainGenres.map((g) => ({
    name: g.name,
    description: g.description.slice(0, 150),
  }));
  return JSON.stringify(
    { totalMainGenres: compact.length, mainGenres: compact },
    null,
    2,
  );
}

/**
 * Load sub-genres for specific main genres from their JSON files
 * This is done on-demand for selected main genres only
 */
export async function loadSubGenresForMains(
  mainGenreNames: string[],
): Promise<GenreEntry[]> {
  if (!mainGenreSubGenresCache) {
    mainGenreSubGenresCache = new Map<string, GenreEntry[]>();
  }

  const result: GenreEntry[] = [];

  for (const mainName of mainGenreNames) {
    // Check cache first
    const cached = mainGenreSubGenresCache.get(mainName.toLowerCase());
    if (cached) {
      result.push(...cached);
      continue;
    }

    // Find the main genre file
    const mainGenres = await getMainGenres();
    const mainGenre = mainGenres.find(
      (g) => g.name.toLowerCase() === mainName.toLowerCase(),
    );

    if (!mainGenre || !mainGenre.subGenres) {
      continue;
    }

    // Convert sub-genres to GenreEntry format
    const subEntries: GenreEntry[] = mainGenre.subGenres.map((sub) => ({
      name: sub.name,
      description: sub.description,
      url: sub.url,
      level: "sub",
      parent: mainGenre.name,
    }));

    // Cache and add to result
    mainGenreSubGenresCache.set(mainName.toLowerCase(), subEntries);
    result.push(...subEntries);
  }

  return result;
}

/**
 * Get sub-genres for selected main genres formatted for AI
 */
export async function getSubGenresForAI(
  mainGenreNames: string[],
): Promise<string> {
  const subGenres = await loadSubGenresForMains(mainGenreNames);
  const compact = subGenres.map((g) => ({
    name: g.name,
    description: g.description.slice(0, 150),
    parent: g.parent,
  }));
  return JSON.stringify(
    { totalSubGenres: compact.length, subGenres: compact },
    null,
    2,
  );
}

/**
 * Search genres by exact/partial name match (fallback for simple queries)
 */
export async function searchGenresByName(
  query: string,
  limit = 10,
): Promise<GenreEntry[]> {
  const genres = await getAllGenres();
  const lowerQuery = query.toLowerCase();

  const matches = genres
    .filter((g) => {
      const nameMatch = g.name.toLowerCase().includes(lowerQuery);
      const descMatch = g.description.toLowerCase().includes(lowerQuery);
      return nameMatch || descMatch;
    })
    .sort((a, b) => {
      // Prioritize exact matches
      const aExact = a.name.toLowerCase() === lowerQuery ? 1 : 0;
      const bExact = b.name.toLowerCase() === lowerQuery ? 1 : 0;
      return bExact - aExact;
    });

  return matches.slice(0, limit);
}

// ============================================================================
// Preload on module initialization
// ============================================================================

// Start preloading knowledge base immediately on module load
// This eliminates cold start latency for the first request
void getKnowledgeBase().catch(() => {
  // Silent fail - will retry on first actual request
});
