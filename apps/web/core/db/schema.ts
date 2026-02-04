import { sql } from "drizzle-orm"
import { index, integer, real, sqliteTable, text, primaryKey } from "drizzle-orm/sqlite-core"
import { relations } from "drizzle-orm"

// ==================== generations: 核心生成记录（只保留状态）====================
export const generations = sqliteTable(
  "generations",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),

    status: text("status", {
      enum: ["pending", "generating", "completed", "failed"],
    })
      .notNull()
      .default("pending"),

    errorMessage: text("error_message"),
    falRequestId: text("fal_request_id"),

    createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
  },
  (table) => [
    index("idx_generations_status").on(table.status),
    index("idx_generations_created_at").on(table.createdAt),
  ]
)

export type Generation = typeof generations.$inferSelect
export type NewGeneration = typeof generations.$inferInsert

// ==================== generation_params: 生成参数留痕（多模型兼容）====================
export const generationParams = sqliteTable(
  "generation_params",
  {
    generationId: text("generation_id")
      .notNull()
      .references(() => generations.id, { onDelete: "cascade" }),

    // 通用核心参数（各模型都可能有，用于查询）
    prompt: text("prompt").notNull(),
    lyricsPrompt: text("lyrics_prompt"),
    isInstrumental: integer("is_instrumental", { mode: "boolean" }).default(true),

    // 音频输出规格（通用查询字段）
    duration: integer("duration"), // 预期时长（秒）
    bitrate: integer("bitrate"), // 比特率（bps）
    sampleRate: integer("sample_rate"), // 采样率（Hz）
    channels: integer("channels"), // 声道数

    // 原始参数 JSON（完整留痕，模型特有参数存这里）
    rawParameters: text("raw_parameters"), // JSON 字符串

    createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
  },
  (table) => [
    primaryKey({ columns: [table.generationId] }),
    index("idx_params_generation_id").on(table.generationId),
  ]
)

export type GenerationParam = typeof generationParams.$inferSelect
export type NewGenerationParam = typeof generationParams.$inferInsert

// ==================== audio_files: 音频文件元数据 ====================
export const audioFiles = sqliteTable(
  "audio_files",
  {
    id: text("id").primaryKey(),
    generationId: text("generation_id")
      .notNull()
      .references(() => generations.id, { onDelete: "cascade" }),

    // 存储信息
    storageType: text("storage_type", { enum: ["local", "s3", "r2", "gcs"] })
      .notNull()
      .default("local"),
    filePath: text("file_path").notNull(), // 本地路径或对象存储 key
    publicUrl: text("public_url"), // 可访问的 URL

    // 文件元数据
    fileName: text("file_name"),
    fileSize: integer("file_size"), // 字节数
    contentType: text("content_type"), // audio/mpeg, audio/flac 等
    checksum: text("checksum"), // 文件校验和（如 SHA256）

    // 音频属性
    duration: real("duration"), // 秒数
    bitrate: integer("bitrate"), // bps
    sampleRate: integer("sample_rate"), // Hz
    channels: integer("channels"), // 1 or 2

    // 来源信息
    sourceUrl: text("source_url"), // Fal 返回的原始 URL
    downloadedAt: integer("downloaded_at", { mode: "timestamp" }),

    // 封面图片（可选）
    coverUrl: text("cover_url"),

    createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
  },
  (table) => [
    index("idx_audio_files_generation_id").on(table.generationId),
    index("idx_audio_files_storage_type").on(table.storageType),
  ]
)

export type AudioFile = typeof audioFiles.$inferSelect
export type NewAudioFile = typeof audioFiles.$inferInsert

// ==================== Relations ====================

export const generationsRelations = relations(generations, ({ one, many }) => ({
  params: one(generationParams, {
    fields: [generations.id],
    references: [generationParams.generationId],
  }),
  audioFiles: many(audioFiles),
}))

export const generationParamsRelations = relations(generationParams, ({ one }) => ({
  generation: one(generations, {
    fields: [generationParams.generationId],
    references: [generations.id],
  }),
}))

export const audioFilesRelations = relations(audioFiles, ({ one }) => ({
  generation: one(generations, {
    fields: [audioFiles.generationId],
    references: [generations.id],
  }),
}))
