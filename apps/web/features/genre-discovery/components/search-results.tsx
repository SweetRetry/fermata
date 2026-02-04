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
} as const;

const itemVariants = {
  hidden: { opacity: 0, scale: 0.98, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 28,
      mass: 1,
    },
  },
} as const;

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
      className="mt-8 grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-16 items-start"
    >
      {/* Left Column: Context & Summary */}
      <div className="lg:sticky lg:top-24 space-y-12">
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="relative group">
            <div className="absolute -inset-6 bg-gradient-to-b from-primary/5 to-transparent rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl" />
            <p className="relative text-lg leading-relaxed text-foreground/90 font-light tracking-tight italic">
              {result.summary}
            </p>
          </div>
        </motion.div>

        {/* Related Terms */}
        {result.relatedTerms.length > 0 && (
          <motion.div variants={itemVariants} className="space-y-6">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground border-b border-border/50 pb-2">
              Related Exploration
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {result.relatedTerms.map((term) => (
                <Button
                  key={term}
                  variant="outline"
                  size="sm"
                  onClick={() => onSelectTerm(term)}
                  className="rounded-lg border-border/50 bg-muted/40 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all text-[11px] font-semibold tracking-tight px-4 shadow-sm"
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
