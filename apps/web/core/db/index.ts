import { mkdirSync } from "node:fs"
import { dirname } from "node:path"
import Database from "better-sqlite3"
import { drizzle } from "drizzle-orm/better-sqlite3"
import * as schema from "./schema"

const DB_PATH = "./data/generations.db"

// Ensure directory exists
try {
  mkdirSync(dirname(DB_PATH), { recursive: true })
} catch {
  // Directory may already exist
}

const sqlite = new Database(DB_PATH)
export const db = drizzle(sqlite, { schema })

// Initialize tables
export function initDb() {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS generations (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      prompt TEXT NOT NULL,
      lyrics_prompt TEXT,
      is_instrumental INTEGER NOT NULL DEFAULT 1,
      status TEXT NOT NULL DEFAULT 'pending',
      audio_url TEXT,
      duration REAL,
      error_message TEXT,
      fal_request_id TEXT,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_at INTEGER NOT NULL DEFAULT (unixepoch())
    );

    CREATE INDEX IF NOT EXISTS idx_generations_status ON generations(status);
    CREATE INDEX IF NOT EXISTS idx_generations_created_at ON generations(created_at DESC);
  `)
}

// Initialize on module load
initDb()
