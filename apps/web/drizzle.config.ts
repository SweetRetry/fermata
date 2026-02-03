import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./core/db/schema.ts",
  out: "./core/db/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: "./data/generations.db",
  },
})
