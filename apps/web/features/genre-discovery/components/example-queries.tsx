"use client";

import { Button } from "@workspace/ui/components/button";
import { motion } from "framer-motion";

const EXAMPLE_QUERIES = [
  "落日余晖下的独自行走",
  "70年代的老旧黑胶唱片店",
  "极简主义风格的清晨工作空间",
  "穿梭在银河边界的电子灵魂",
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
      <span className="text-sm text-muted-foreground/50">试试：</span>
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
