"use client"

import { motion } from "framer-motion"

export function LoadingState() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <motion.div
        className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  )
}
