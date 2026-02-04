"use client"

import { motion } from "framer-motion"

interface StatusIndicatorProps {
  status: "pending" | "generating" | "completed" | "failed"
  size?: "sm" | "md"
}

export function StatusIndicator({ status, size = "md" }: StatusIndicatorProps) {
  if (status !== "pending" && status !== "generating") {
    return null
  }

  const dotSize = size === "sm" ? "h-1 w-1" : "h-1.5 w-1.5"
  const gap = size === "sm" ? "gap-1" : "gap-1.5"

  return (
    <motion.div
      className={`flex items-center ${gap}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className={`${dotSize} rounded-full bg-primary`}
        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <motion.div
        className={`${dotSize} rounded-full bg-primary`}
        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
      />
      <motion.div
        className={`${dotSize} rounded-full bg-primary`}
        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
      />
    </motion.div>
  )
}
