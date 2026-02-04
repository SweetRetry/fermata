"use client"

import { Button } from "@workspace/ui/components/button"
import { motion } from "framer-motion"
import { Heart, MessageCircle, RotateCcw } from "lucide-react"
import Link from "next/link"
import type { Generation } from "../types"

const slideInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.2 + i * 0.1,
      duration: 0.4,
      ease: "easeOut" as const,
    },
  }),
}

interface DetailsSectionProps {
  generation: Generation
  onRetry: () => void
}

export function DetailsSection({ generation, onRetry }: DetailsSectionProps) {
  return (
    <motion.div
      className="flex flex-1 flex-col gap-8 p-12"
      variants={slideInRight}
      initial="hidden"
      animate="visible"
    >
      {/* Back Button */}
      <motion.div
        className="flex items-center justify-between"
        custom={0}
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        <Link href="/library" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to Library
        </Link>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="flex gap-6"
        custom={1}
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex h-5 w-5 items-center justify-center rounded bg-muted">
            <Heart className="h-3 w-3 text-muted-foreground" />
          </div>
          <span className="text-sm text-muted-foreground">0 likes</span>
        </motion.div>
        <motion.div
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex h-5 w-5 items-center justify-center rounded bg-muted">
            <MessageCircle className="h-3 w-3 text-muted-foreground" />
          </div>
          <span className="text-sm text-muted-foreground">0 comments</span>
        </motion.div>
      </motion.div>

      {/* Prompt / Style */}
      <motion.div
        className="flex flex-col gap-3"
        custom={2}
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Style / Prompt
        </span>
        <div className="flex flex-wrap gap-2">
          {generation.prompt.split(",").map((tag, index) => (
            <motion.span
              key={index}
              className="flex h-8 items-center rounded-md border border-border bg-muted px-3 text-sm text-muted-foreground"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.05, duration: 0.3 }}
              whileHover={{ scale: 1.05, backgroundColor: "var(--accent)" }}
            >
              {tag.trim()}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* Lyrics */}
      <motion.div
        className="flex flex-1 flex-col gap-3"
        custom={3}
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {generation.isInstrumental ? "Instrumental" : "Lyrics"}
          </span>
          {!generation.isInstrumental && generation.lyricsPrompt && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground"
                onClick={() => {
                  if (generation.lyricsPrompt) {
                    navigator.clipboard.writeText(generation.lyricsPrompt)
                  }
                }}
              >
                Copy
              </Button>
            </motion.div>
          )}
        </div>
        <motion.pre
          className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          {generation.isInstrumental
            ? "[Instrumental - No lyrics]"
            : generation.lyricsPrompt || "[No lyrics provided]"}
        </motion.pre>
      </motion.div>

      {/* Error Message */}
      {generation.status === "failed" && generation.errorMessage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-lg border border-destructive/20 bg-destructive/10 p-4"
        >
          <p className="text-sm text-destructive">{generation.errorMessage}</p>
          <Button onClick={onRetry} variant="outline" size="sm" className="mt-2">
            <RotateCcw className="mr-2 h-3 w-3" />
            Refresh Status
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}
