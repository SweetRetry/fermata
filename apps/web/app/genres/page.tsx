"use client"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { cn } from "@workspace/ui/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Loader2 } from "lucide-react"
import { useState } from "react"

interface GenreMatch {
  name: string
  description: string
  url: string
  level: string
  parent?: string
  reason: string
  confidence: number
}

interface SearchResponse {
  query: string
  matches: GenreMatch[]
  relatedTerms: string[]
  summary: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
}

const exampleQueries = [
  "深夜加班写代码",
  "雨天咖啡馆看书",
  "冥想放松",
  "健身房跑步",
  "开车兜风",
]

export default function GenresPage() {
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<SearchResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (searchQuery: string = query) => {
    if (!searchQuery.trim()) return

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/genres/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery, limit: 5 }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Search failed")
      }

      const data: SearchResponse = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header Section - Minimal */}
      <div className="px-16 pt-20 pb-12">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-3xl font-light tracking-tight text-foreground">
            Genre Discovery
          </h1>
        </motion.div>

        <motion.p
          className="mt-4 text-base text-muted-foreground/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          描述你的场景、心情或活动
        </motion.p>

        {/* Search Input - Clean */}
        <motion.div
          className="mt-10 flex max-w-xl gap-3"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="例如：深夜写代码时的背景音乐..."
              className="h-12 border-0 bg-muted/30 pl-11 text-base placeholder:text-muted-foreground/40 focus-visible:bg-muted/50 focus-visible:ring-1"
            />
          </div>
          <Button
            onClick={() => handleSearch()}
            disabled={isLoading || !query.trim()}
            className="h-12 px-6"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isLoading ? "搜索中" : "发现"}
          </Button>
        </motion.div>

        {/* Example Queries - Minimal */}
        <motion.div
          className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.4 }}
        >
          <span className="text-sm text-muted-foreground/50">试试：</span>
          {exampleQueries.map((example) => (
            <Button
              key={example}
              variant="ghost"
              size="sm"
              onClick={() => {
                setQuery(example)
                handleSearch(example)
              }}
              className="h-auto px-0 text-sm font-normal text-muted-foreground/60 hover:text-foreground"
            >
              {example}
            </Button>
          ))}
        </motion.div>
      </div>

      {/* Results Section - Spacious */}
      <div className="flex-1 overflow-auto px-16 pb-20">
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-8 text-sm text-destructive"
            >
              {error}
            </motion.div>
          )}

          {result && (
            <motion.div
              key="results"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="mt-8 space-y-16"
            >
              {/* Summary - Minimal */}
              <motion.div variants={itemVariants} className="max-w-2xl">
                <p className="text-lg leading-relaxed text-foreground/80">
                  {result.summary}
                </p>
              </motion.div>

              {/* Genre Matches - Spacious Cards */}
              <div>
                <motion.h2
                  variants={itemVariants}
                  className="mb-8 text-sm font-medium uppercase tracking-wider text-muted-foreground/50"
                >
                  推荐流派
                </motion.h2>
                <div className="space-y-6">
                  {result.matches.map((match) => (
                    <motion.div
                      key={match.name}
                      variants={itemVariants}
                      className="group max-w-2xl"
                    >
                      <div className="flex items-baseline gap-4">
                        <h3 className="text-xl font-medium">
                          {match.name}
                        </h3>
                        {match.parent && (
                          <span className="text-sm text-muted-foreground/50">
                            {match.parent}
                          </span>
                        )}
                        <div className="flex items-center gap-1.5">
                          <div
                            className={cn(
                              "h-1.5 w-1.5 rounded-full",
                              match.confidence >= 0.9
                                ? "bg-emerald-500"
                                : match.confidence >= 0.7
                                  ? "bg-amber-500"
                                  : "bg-primary"
                            )}
                          />
                          <span className="text-xs text-muted-foreground/40">
                            {Math.round(match.confidence * 100)}%
                          </span>
                        </div>
                      </div>

                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground/70">
                        {match.description}
                      </p>

                      <p className="mt-3 text-sm text-foreground/60">
                        {match.reason}
                      </p>

                      <a
                        href={match.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-block text-xs text-muted-foreground/40 hover:text-primary transition-colors"
                      >
                        了解更多 →
                      </a>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Related Terms - Minimal */}
              {result.relatedTerms.length > 0 && (
                <motion.div variants={itemVariants}>
                  <h2 className="mb-6 text-sm font-medium uppercase tracking-wider text-muted-foreground/50">
                    相关搜索
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {result.relatedTerms.map((term) => (
                      <Button
                        key={term}
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setQuery(term)
                          handleSearch(term)
                        }}
                        className="h-auto px-0 text-sm font-normal text-muted-foreground/60 hover:text-foreground"
                      >
                        {term}
                      </Button>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {!result && !error && !isLoading && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-20 text-sm text-muted-foreground/30"
            >
              等待输入...
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
