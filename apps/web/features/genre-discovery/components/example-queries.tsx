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

export function ExampleQueries({ onSelect }: ExampleQueriesProps) {
  return (
    <motion.div
      className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.35, duration: 0.4 }}
    >
      <span className="text-sm text-muted-foreground">Try:</span>
      {EXAMPLE_QUERIES.map((example) => (
        <Button
          key={example}
          variant="ghost"
          size="sm"
          onClick={() => onSelect(example)}
          className="h-auto px-0 text-sm font-normal text-muted-foreground/60 hover:text-foreground"
        >
          {example}
        </Button>
      ))}
    </motion.div>
  );
}
