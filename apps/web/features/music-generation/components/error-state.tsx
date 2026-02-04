"use client"

import { Button } from "@workspace/ui/components/button"
import { motion } from "framer-motion"
import { AlertCircle, RotateCcw } from "lucide-react"
import Link from "next/link"

const SPRING_TACTILE = { stiffness: 380, damping: 30, mass: 0.8 }
const EASE_REVEAL = [0.16, 1, 0.3, 1] as const

interface ErrorStateProps {
  message?: string
  onRetry: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <motion.div 
      className="flex h-full flex-col items-center justify-center gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE_REVEAL }}
    >
      {/* Error Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5, ease: EASE_REVEAL }}
        className="relative"
      >
        <AlertCircle className="h-14 w-14 text-destructive/90" strokeWidth={1.5} />
        <div 
          className="absolute inset-0 rounded-full blur-2xl -z-10"
          style={{ background: "oklch(0.55 0.18 25 / 0.2)" }}
        />
      </motion.div>
      
      {/* Error Message */}
      <motion.p 
        className="text-muted-foreground text-center max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {message || "Work not found"}
      </motion.p>
      
      {/* Actions */}
      <motion.div 
        className="flex gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5, ease: EASE_REVEAL }}
      >
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={SPRING_TACTILE}>
          <Button 
            onClick={onRetry} 
            variant="outline"
            className="font-mono uppercase tracking-wider text-xs"
          >
            <RotateCcw className="mr-2 h-3.5 w-3.5" />
            Retry
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={SPRING_TACTILE}>
          <Link href="/library">
            <Button className="font-mono uppercase tracking-wider text-xs">
              Back to Library
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
