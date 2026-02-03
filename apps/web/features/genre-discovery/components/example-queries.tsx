"use client"

import { Button } from "@workspace/ui/components/button"
import { motion } from "framer-motion"

const EXAMPLE_QUERIES = [
  "深夜加班写代码",
  "雨天咖啡馆看书",
  "冥想放松",
  "健身房跑步",
  "开车兜风",
] as const

interface ExampleQueriesProps {
  onSelect: (query: string) => void
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
  )
}
