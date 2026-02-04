"use client";

import { motion } from "framer-motion";

interface ErrorStateProps {
  message: string;
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="mt-12 flex items-center gap-3">
      <span className="font-mono text-[10px] uppercase tracking-widest text-destructive px-1.5 py-0.5 border border-destructive/20 rounded">
        Error
      </span>
      <p className="text-sm text-destructive/80 font-light tracking-tight">
        {message}
      </p>
    </div>
  );
}

export function EmptyState() {
  return (
    <div className="mt-32 flex flex-col items-center justify-center space-y-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0, 1, 0.5], scale: [0.8, 1, 0.95] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="w-1.5 h-1.5 rounded-full bg-primary/20"
      />
      <p className="text-sm md:text-base text-muted-foreground/40 font-light tracking-[0.2em] uppercase text-center">
        Begin your musical context exploration in tranquility
      </p>
    </div>
  );
}
