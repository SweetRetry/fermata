"use client"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { motion } from "framer-motion"
import { Loader2, Search } from "lucide-react"

interface SearchHeaderProps {
  query: string
  setQuery: (query: string) => void
  isLoading: boolean
  onSearch: () => void
  onKeyDown: (e: React.KeyboardEvent) => void
}

export function SearchHeader({
  query,
  setQuery,
  isLoading,
  onSearch,
  onKeyDown,
}: SearchHeaderProps) {
  return (
    <div className="px-16 pt-20 pb-12">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h1 className="text-3xl font-light tracking-tight text-foreground">Genre Discovery</h1>
      </motion.div>

      <motion.p
        className="mt-4 text-base text-muted-foreground/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.5 }}
      >
        描述你的场景、心情或活动
      </motion.p>

      {/* Search Input */}
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
            onKeyDown={onKeyDown}
            placeholder="例如：深夜写代码时的背景音乐..."
            className="h-12 border-0 bg-muted/30 pl-11 text-base placeholder:text-muted-foreground/40 focus-visible:bg-muted/50 focus-visible:ring-1"
          />
        </div>
        <Button onClick={onSearch} disabled={isLoading || !query.trim()} className="h-12 px-6">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "搜索中" : "发现"}
        </Button>
      </motion.div>
    </div>
  )
}
