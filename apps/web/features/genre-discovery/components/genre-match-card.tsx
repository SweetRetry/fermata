"use client"

import { cn } from "@workspace/ui/lib/utils"
import { motion } from "framer-motion"
import { Wand2 } from "lucide-react"
import Link from "next/link"
import type { GenreMatch } from "../types"

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

interface GenreMatchCardProps {
  match: GenreMatch
  query: string
}

export function GenreMatchCard({ match, query }: GenreMatchCardProps) {
  return (
    <motion.div variants={itemVariants} className="group max-w-2xl">
      <div className="flex items-baseline gap-4">
        <h3 className="text-xl font-medium">{match.name}</h3>
        {match.parent && <span className="text-sm text-muted-foreground/50">{match.parent}</span>}
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

      <p className="mt-2 text-sm leading-relaxed text-muted-foreground/70">{match.description}</p>

      <p className="mt-3 text-sm text-foreground/60">{match.reason}</p>

      <div className="mt-4 flex items-center gap-4">
        <a
          href={match.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground/40 hover:text-primary transition-colors"
        >
          了解更多 →
        </a>
        <Link
          href={`/create?style=${encodeURIComponent(match.name)}&description=${encodeURIComponent(match.description)}&context=${encodeURIComponent(query)}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
        >
          <Wand2 className="h-3 w-3" />
          使用此风格创作
        </Link>
      </div>
    </motion.div>
  )
}
