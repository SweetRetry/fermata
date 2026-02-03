"use client"

import { Button } from "@workspace/ui/components/button"
import { motion } from "framer-motion"
import { Play, SkipBack, SkipForward } from "lucide-react"

export function PlayerBar() {
  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const }}
      className="fixed bottom-0 left-20 right-0 flex h-20 items-center justify-between gap-8 border-t border-border bg-background/95 px-8 backdrop-blur-sm"
    >
      {/* Mini Player - Left */}
      <motion.div
        className="flex items-center gap-4"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <div className="h-14 w-14 rounded-lg border border-border bg-muted" />
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-foreground">Untitled (v2)</span>
          <span className="text-xs text-muted-foreground">fspecil</span>
        </div>
      </motion.div>

      {/* Center Controls */}
      <div className="flex items-center gap-5">
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button type="button" variant="secondary" size="icon" className="h-8 w-8 rounded-full">
            <SkipBack className="h-4 w-4" />
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button type="button" size="icon" className="h-10 w-10 rounded-full">
            <Play className="h-5 w-5" fill="currentColor" />
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button type="button" variant="secondary" size="icon" className="h-8 w-8 rounded-full">
            <SkipForward className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>

      {/* Right - Progress */}
      <motion.div
        className="flex items-center gap-4"
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <div className="h-1 w-28 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: 32 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          />
        </div>
        <span className="text-xs text-muted-foreground">0:16 / 2:00</span>
      </motion.div>
    </motion.div>
  )
}
