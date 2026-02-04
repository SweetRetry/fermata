"use client"

import { motion } from "framer-motion"

const EASE_REVEAL = [0.16, 1, 0.3, 1] as const

export function LoadingState() {
  return (
    <div className="flex h-full items-center justify-center">
      <motion.div
        className="flex flex-col items-center gap-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: EASE_REVEAL }}
      >
        {/* Cinematic Spinner */}
        <div className="relative">
          <motion.div
            className="h-10 w-10 rounded-full"
            style={{
              border: "2px solid oklch(1 0 0 / 0.15)",
              borderTopColor: "oklch(1 0 0 / 0.9)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          />
          {/* Subtle glow */}
          <div
            className="absolute inset-0 rounded-full blur-xl -z-10"
            style={{ background: "oklch(1 0 0 / 0.08)" }}
          />
        </div>

        {/* Loading text */}
        <motion.span
          className="font-mono uppercase tracking-widest text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Loading
        </motion.span>
      </motion.div>
    </div>
  )
}
