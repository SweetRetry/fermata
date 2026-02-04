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
export const db = drizzle(sqlite, { schema, logger: process.env.NODE_ENV === "development" })

// Initialize tables
function initDb() {
  // Core generations table (status only)
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS generations (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      error_message TEXT,
      fal_request_id TEXT,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_at INTEGER NOT NULL DEFAULT (unixepoch())
    );

    CREATE INDEX IF NOT EXISTS idx_generations_status ON generations(status);
    CREATE INDEX IF NOT EXISTS idx_generations_created_at ON generations(created_at DESC);
  `)

  // Generation params table (1:1 with generations, multi-model compatible)
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS generation_params (
      generation_id TEXT PRIMARY KEY,
      prompt TEXT NOT NULL,
      lyrics_prompt TEXT,
      is_instrumental INTEGER DEFAULT 1,
      duration INTEGER,
      bitrate INTEGER,
      sample_rate INTEGER,
      channels INTEGER,
      raw_parameters TEXT,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      FOREIGN KEY (generation_id) REFERENCES generations(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_params_generation_id ON generation_params(generation_id);
  `)

  // Audio files table (1:N with generations, though currently 1:1)
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS audio_files (
      id TEXT PRIMARY KEY,
      generation_id TEXT NOT NULL,
      storage_type TEXT NOT NULL DEFAULT 'local',
      file_path TEXT NOT NULL,
      public_url TEXT,
      file_name TEXT,
      file_size INTEGER,
      content_type TEXT,
      checksum TEXT,
      duration REAL,
      bitrate INTEGER,
      sample_rate INTEGER,
      channels INTEGER,
      source_url TEXT,
      downloaded_at INTEGER,
      cover_url TEXT,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
      FOREIGN KEY (generation_id) REFERENCES generations(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_audio_files_generation_id ON audio_files(generation_id);
    CREATE INDEX IF NOT EXISTS idx_audio_files_storage_type ON audio_files(storage_type);
  `)
}

// Initialize on module load
initDb()

export type { schema }
