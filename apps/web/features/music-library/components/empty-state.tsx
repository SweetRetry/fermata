"use client"

import { Button } from "@workspace/ui/components/button"
import { motion } from "framer-motion"
import Link from "next/link"

export function EmptyState() {
  return (
    <motion.div
      className="flex flex-1 flex-col items-center justify-center gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="h-20 w-20 rounded-2xl border border-border bg-muted" />
      <p className="text-muted-foreground">还没有创作，去创建一首吧</p>
      <Link href="/create">
        <Button>开始创作</Button>
      </Link>
    </motion.div>
  )
}
