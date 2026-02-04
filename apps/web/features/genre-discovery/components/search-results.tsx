"use client";

import { Button } from "@workspace/ui/components/button";
import { motion } from "framer-motion";
import type { GenreSearchResponse } from "../types";
import { GenreMatchCard } from "./genre-match-card";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

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
};

interface SearchResultsProps {
  result: GenreSearchResponse;
  onSelectTerm: (term: string) => void;
}

export function SearchResults({ result, onSelectTerm }: SearchResultsProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mt-4 grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-12 items-start"
    >
      {/* Left Column: Context & Summary */}
      <div className="lg:sticky lg:top-12 space-y-10">
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-b from-muted/50 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <p className="relative text-base leading-relaxed text-foreground/90 font-light italic">
              {result.summary}
            </p>
          </div>
        </motion.div>

        {/* Related Terms */}
        {result.relatedTerms.length > 0 && (
          <motion.div variants={itemVariants} className="space-y-4">
            <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Related Exploration
            </h2>
            <div className="flex flex-wrap gap-2">
              {result.relatedTerms.map((term) => (
                <Button
                  key={term}
                  variant="outline"
                  size="sm"
                  onClick={() => onSelectTerm(term)}
                  className="rounded-full border-border/50 bg-muted/20 hover:bg-muted/40 hover:border-border transition-all text-xs text-muted-foreground"
                >
                  {term}
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Right Column: Recommended Genres */}
      <div className="space-y-8">
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-between"
        >
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Recommended
          </h2>
          <div className="h-px flex-1 ml-4 bg-gradient-to-r from-border/50 to-transparent" />
        </motion.div>

        <div className="grid grid-cols-1 gap-6">
          {result.matches.map((match) => (
            <GenreMatchCard
              key={match.name}
              match={match}
              query={result.query}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
