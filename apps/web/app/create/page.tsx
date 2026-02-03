"use client"

import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

const genres = ["Pop", "Rock", "Electronic", "Hip Hop", "Jazz"]

const slideInVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.4,
      ease: "easeOut" as const,
    },
  }),
}

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.3,
      duration: 0.4,
    },
  },
}

export default function CreatePage() {
  const [mode, setMode] = useState<"simple" | "custom">("custom")
  const [instrumental, setInstrumental] = useState(true)

  return (
    <div className="flex h-full">
      {/* Left Panel */}
      <div className="flex w-[480px] flex-col gap-8 border-r border-border p-10">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between"
          custom={0}
          variants={slideInVariants}
          initial="hidden"
          animate="visible"
        >
          <h1 className="text-[28px] font-semibold text-foreground">Create Music</h1>
          <motion.div
            className="flex h-9 items-center gap-2 rounded-lg border border-border bg-muted px-3"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-[13px] text-muted-foreground">ACE-Step v1.5</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </motion.div>
        </motion.div>

        {/* Toggle */}
        <motion.div
          className="flex gap-2"
          custom={1}
          variants={slideInVariants}
          initial="hidden"
          animate="visible"
        >
          <Button
            type="button"
            variant={mode === "simple" ? "default" : "secondary"}
            onClick={() => setMode("simple")}
            className="h-9 px-5"
          >
            Simple
          </Button>
          <Button
            type="button"
            variant={mode === "custom" ? "default" : "secondary"}
            onClick={() => setMode("custom")}
            className="h-9 px-5"
          >
            Custom
          </Button>
        </motion.div>

        {/* Lyrics Input */}
        <motion.div
          className="flex flex-col gap-3"
          custom={2}
          variants={slideInVariants}
          initial="hidden"
          animate="visible"
        >
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Lyrics
          </span>
          <motion.div
            className="flex h-40 flex-col rounded-xl border border-border bg-secondary p-4"
            whileHover={{ borderColor: "var(--border)" }}
            transition={{ duration: 0.2 }}
          >
            <textarea
              placeholder="Enter your lyrics here...

[Verse 1]
Your lyrics"
              className="h-full w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </motion.div>
        </motion.div>

        {/* Style Input */}
        <motion.div
          className="flex flex-col gap-3"
          custom={3}
          variants={slideInVariants}
          initial="hidden"
          animate="visible"
        >
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Style of Music
          </span>
          <div className="flex h-20 flex-col rounded-xl border border-border bg-secondary p-4">
            <textarea
              placeholder="Describe your music style (e.g., Industrial Metal, Dark, Heavy)"
              className="h-full w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
        </motion.div>

        {/* Genre Tags */}
        <motion.div
          className="flex flex-col gap-3"
          custom={4}
          variants={slideInVariants}
          initial="hidden"
          animate="visible"
        >
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Genre
          </span>
          <div className="flex flex-wrap gap-2">
            {genres.map((genre, index) => (
              <motion.div
                key={genre}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.05, duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  type="button"
                  variant="outline"
                  className="h-8 rounded-full px-4 text-[13px]"
                >
                  {genre}
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Title Input */}
        <motion.div
          className="flex flex-col gap-3"
          custom={5}
          variants={slideInVariants}
          initial="hidden"
          animate="visible"
        >
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Title
          </span>
          <div className="flex h-12 items-center rounded-xl border border-border bg-secondary px-4">
            <input
              type="text"
              placeholder="Untitled (v1)"
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
        </motion.div>

        {/* Instrumental Toggle */}
        <motion.div
          className="flex items-center justify-between"
          custom={6}
          variants={slideInVariants}
          initial="hidden"
          animate="visible"
        >
          <span className="text-sm text-secondary-foreground">Instrumental</span>
          <motion.button
            type="button"
            onClick={() => setInstrumental(!instrumental)}
            className={cn(
              "relative h-6 w-11 rounded-full transition-colors",
              instrumental ? "bg-primary" : "bg-muted"
            )}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              className="absolute top-0.5 h-5 w-5 rounded-full bg-primary-foreground"
              animate={{
                left: instrumental ? 22 : 2,
              }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </motion.button>
        </motion.div>

        {/* Create Button */}
        <motion.div custom={7} variants={slideInVariants} initial="hidden" animate="visible">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button className="h-[52px] w-full rounded-[26px] text-base font-semibold">
              Create 2 Songs
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Panel */}
      <motion.div
        className="flex flex-1 flex-col gap-6 p-10"
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium text-foreground">Recent Creations</h2>
          <Button type="button" variant="ghost" className="text-sm text-muted-foreground">
            View all
          </Button>
        </div>

        {/* Empty State */}
        <motion.div
          className="flex flex-1 flex-col items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <motion.div
            className="h-16 w-16 rounded-2xl border border-border bg-muted"
            animate={{
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <span className="text-sm text-muted-foreground">
            Your recent creations will appear here
          </span>
        </motion.div>
      </motion.div>
    </div>
  )
}
