"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { Wand2 } from "lucide-react";
import Link from "next/link";
import type { GenreMatch } from "../types";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 280,
      damping: 28,
      mass: 1,
    },
  },
} as const;

interface GenreMatchCardProps {
  match: GenreMatch;
  query: string;
}

export function GenreMatchCard({ match, query }: GenreMatchCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      variants={itemVariants}
      onMouseMove={handleMouseMove}
      className="group relative"
    >
      {/* Spotlight / Radial Gradient Background */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              350px circle at ${mouseX}px ${mouseY}px,
              hsl(var(--primary) / 0.08),
              transparent 80%
            )
          `,
        }}
      />

      <div className="relative h-full overflow-hidden rounded-xl border border-border/50 bg-card/40 backdrop-blur-md transition-all duration-300 group-hover:bg-card/60 group-hover:border-primary/20 group-hover:shadow-lg">
        {/* Reflective Sheen (Top Edge Highlight) - Use primary for subtle glow */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="p-5 md:p-6 flex flex-col h-full">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-baseline gap-2.5">
              <h3 className="text-xl font-semibold tracking-tighter text-foreground group-hover:text-primary transition-colors">
                {match.name}
              </h3>
              {match.parent && (
                <span className="font-mono text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                  {match.parent}
                </span>
              )}
            </div>
          </div>

          {/* 流派专业描述（主） */}
          <p className="mt-3 text-sm leading-relaxed text-foreground/70 font-normal">
            {match.description}
          </p>

          {/* AI 氛围解读（辅） */}
          {(match.sceneVibe || match.reason) && (
            <div className="mt-4 pt-4 border-t border-border/50 flex-1 space-y-3">
              {match.sceneVibe && (
                <p className="text-sm text-primary/80 leading-relaxed font-semibold">
                  {match.sceneVibe}
                </p>
              )}
              {match.reason && (
                <p className="text-sm text-muted-foreground/80 leading-relaxed font-normal">
                  {match.reason}
                </p>
              )}
            </div>
          )}

          <div className="mt-6 flex items-center justify-between">
            <a
              href={match.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              METADATA / WIKI
              <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                →
              </span>
            </a>

            <Link
              href={`/create?style=${encodeURIComponent(match.name)}&description=${encodeURIComponent(match.description)}&context=${encodeURIComponent(query)}&vibe=${encodeURIComponent(match.sceneVibe || "")}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background hover:scale-[1.02] active:scale-[0.98] transition-all text-xs font-semibold tracking-tight shadow-sm"
            >
              <Wand2 className="h-3.5 w-3.5" />
              Manifest Style
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
