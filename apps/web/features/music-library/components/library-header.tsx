"use client"

import { motion } from "framer-motion"

interface LibraryHeaderProps {
  count: number
  isLoading: boolean
}

export function LibraryHeader({ count, isLoading }: LibraryHeaderProps) {
  return (
    <>
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-4xl font-semibold text-foreground">Your Library</h1>
      </motion.div>

      <motion.p
        className="text-base text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        {isLoading ? "Loading..." : `${count} creations`}
      </motion.p>
    </>
  )
}
