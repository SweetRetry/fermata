"use client";

import { motion } from "framer-motion";

interface ErrorStateProps {
  message: string;
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mt-8 text-sm text-destructive"
    >
      {message}
    </motion.div>
  );
}

export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-20 text-sm md:text-base text-muted-foreground/20 font-light tracking-widest text-center"
    >
      在静谧中，开启你的音乐语境探索
    </motion.div>
  );
}
