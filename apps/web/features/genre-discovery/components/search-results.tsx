"use client"

import { Button } from "@workspace/ui/components/button"
import { motion } from "framer-motion"
import type { GenreSearchResponse } from "../types"
import { GenreMatchCard } from "./genre-match-card"

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

interface SearchResultsProps {
  result: GenreSearchResponse
  onSelectTerm: (term: string) => void
}

export function SearchResults({ result, onSelectTerm }: SearchResultsProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mt-8 space-y-16"
    >
      {/* Summary */}
      <motion.div variants={itemVariants} className="max-w-2xl">
        <p className="text-lg leading-relaxed text-foreground/80">{result.summary}</p>
      </motion.div>

      {/* Genre Matches */}
      <div>
        <motion.h2
          variants={itemVariants}
          className="mb-8 text-sm font-medium uppercase tracking-wider text-muted-foreground/50"
        >
          推荐流派
        </motion.h2>
        <div className="space-y-6">
          {result.matches.map((match) => (
            <GenreMatchCard key={match.name} match={match} query={result.query} />
          ))}
        </div>
      </div>

      {/* Related Terms */}
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
                onClick={() => onSelectTerm(term)}
                className="h-auto px-0 text-sm font-normal text-muted-foreground/60 hover:text-foreground"
              >
                {term}
              </Button>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
