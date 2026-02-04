"use client"

import { Button } from "@workspace/ui/components/button"
import { motion } from "framer-motion"
import { Heart, MessageCircle, RotateCcw } from "lucide-react"
import Link from "next/link"
import type { Generation } from "../types"

// Kinetic Physics
const SPRING_TACTILE = { stiffness: 380, damping: 30, mass: 0.8 }
const EASE_REVEAL = [0.16, 1, 0.3, 1] as const

// Staggered fade-in animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: EASE_REVEAL,
    },
  },
}

interface DetailsSectionProps {
  generation: Generation
  onRetry: () => void
}

export function DetailsSection({ generation, onRetry }: DetailsSectionProps) {
  const tags = generation.prompt.split(",").map(tag => tag.trim()).filter(Boolean)

  return (
    <motion.div
      className="flex flex-1 flex-col gap-10 p-16"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: EASE_REVEAL, delay: 0.1 }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-10"
      >
        {/* Back Button */}
        <motion.div variants={itemVariants}>
          <Link 
            href="/library" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 group"
          >
            <span className="transition-transform duration-200 group-hover:-translate-x-1">←</span>
            <span className="font-mono uppercase tracking-wider text-xs">Back to Library</span>
          </Link>
        </motion.div>

        {/* Stats - Clean, no borders */}
        <motion.div variants={itemVariants} className="flex gap-8">
          <motion.div
            className="flex items-center gap-2.5"
            whileHover={{ scale: 1.02 }}
            transition={SPRING_TACTILE}
          >
            <Heart className="h-4 w-4 text-muted-foreground/60" />
            <span className="text-sm text-muted-foreground font-mono uppercase tracking-wider text-xs">
              0 likes
            </span>
          </motion.div>
          <motion.div
            className="flex items-center gap-2.5"
            whileHover={{ scale: 1.02 }}
            transition={SPRING_TACTILE}
          >
            <MessageCircle className="h-4 w-4 text-muted-foreground/60" />
            <span className="text-sm text-muted-foreground font-mono uppercase tracking-wider text-xs">
              0 comments
            </span>
          </motion.div>
        </motion.div>

        {/* Style / Prompt Tags - Pill style, no borders */}
        <motion.div variants={itemVariants} className="flex flex-col gap-4">
          <span className="font-mono uppercase tracking-wider text-xs text-muted-foreground">
            Style / Prompt
          </span>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <motion.span
                key={index}
                className="inline-flex items-center h-8 px-3.5 text-sm text-muted-foreground rounded-full cursor-default"
                style={{
                  background: "oklch(0.22 0 0)",
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  delay: 0.5 + index * 0.05, 
                  duration: 0.4,
                  ease: EASE_REVEAL 
                }}
                whileHover={{ 
                  scale: 1.04,
                  backgroundColor: "oklch(0.28 0 0)",
                  transition: SPRING_TACTILE
                }}
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Lyrics Section - Clean with subtle shadow */}
        <motion.div variants={itemVariants} className="flex flex-1 flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="font-mono uppercase tracking-wider text-xs text-muted-foreground">
              {generation.isInstrumental ? "Instrumental" : "Lyrics"}
            </span>
            {!generation.isInstrumental && generation.lyricsPrompt && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-foreground font-mono uppercase tracking-wider"
                onClick={() => {
                  if (generation.lyricsPrompt) {
                    navigator.clipboard.writeText(generation.lyricsPrompt)
                  }
                }}
              >
                Copy
              </Button>
            )}
          </div>
          <motion.div
            className="relative rounded-xl p-6 overflow-auto max-h-[400px]"
            style={{
              background: "oklch(0.18 0 0)",
              boxShadow: "inset 0 2px 8px oklch(0 0 0 / 0.3)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <pre 
              className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground"
              style={{ fontFamily: "inherit" }}
            >
              {generation.isInstrumental
                ? "[Instrumental - No lyrics]"
                : generation.lyricsPrompt || "[No lyrics provided]"}
            </pre>
          </motion.div>
        </motion.div>

        {/* Error Message - Clean style */}
        {generation.status === "failed" && generation.errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE_REVEAL }}
            className="rounded-xl p-5"
            style={{
              background: "oklch(0.25 0.08 25 / 0.15)",
            }}
          >
            <p className="text-sm text-destructive-foreground/90 mb-4">
              {generation.errorMessage}
            </p>
            <Button 
              onClick={onRetry} 
              variant="outline" 
              size="sm"
              className="font-mono uppercase tracking-wider text-xs"
            >
              <RotateCcw className="mr-2 h-3 w-3" />
              Refresh Status
            </Button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}
