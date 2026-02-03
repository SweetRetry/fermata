import { sql } from "drizzle-orm"
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const generations = sqliteTable("generations", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  prompt: text("prompt").notNull(),
  lyricsPrompt: text("lyrics_prompt"),
  isInstrumental: integer("is_instrumental", { mode: "boolean" }).notNull().default(true),
  status: text("status", {
    enum: ["pending", "generating", "completed", "failed"],
  })
    .notNull()
    .default("pending"),
  audioUrl: text("audio_url"),
  duration: real("duration"),
  errorMessage: text("error_message"),
  falRequestId: text("fal_request_id"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
})

export type Generation = typeof generations.$inferSelect
export type NewGeneration = typeof generations.$inferInsert
