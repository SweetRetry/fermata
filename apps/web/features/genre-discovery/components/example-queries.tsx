"use client";

import { Button } from "@workspace/ui/components/button";
import { motion } from "framer-motion";

const EXAMPLE_QUERIES = [
  "A solitary walk under the sunset glow",
  "A vintage vinyl record shop from the 70s",
  "A minimalist morning workspace",
  "An electronic soul traversing the galaxy",
] as const;

interface ExampleQueriesProps {
  onSelect: (query: string) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.4,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
} as const;

export function ExampleQueries({ onSelect }: ExampleQueriesProps) {
  return (
    <motion.div
      className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        Suggestions:
      </span>
      {EXAMPLE_QUERIES.map((example) => (
        <motion.div key={example} variants={itemVariants}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSelect(example)}
            className="h-auto px-0 text-sm font-normal text-muted-foreground hover:text-primary transition-colors hover:bg-transparent relative group"
          >
            {example}
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary/40 group-hover:w-full transition-all duration-500" />
          </Button>
        </motion.div>
      ))}
    </motion.div>
  );
}
