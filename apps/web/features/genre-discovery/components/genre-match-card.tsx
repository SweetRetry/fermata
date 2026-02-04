"use client";

import { motion } from "framer-motion";
import { Wand2 } from "lucide-react";
import Link from "next/link";
import type { GenreMatch } from "../types";

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

interface GenreMatchCardProps {
  match: GenreMatch;
  query: string;
}

export function GenreMatchCard({ match, query }: GenreMatchCardProps) {
  return (
    <motion.div variants={itemVariants} className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/10 to-transparent rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition duration-500" />
      <div className="relative p-4 md:p-5 rounded-xl bg-muted/20 border border-border/50 hover:border-primary/20 backdrop-blur-sm transition-all duration-300">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-baseline gap-2">
            <h3 className="text-lg font-semibold tracking-tight group-hover:text-primary transition-colors">
              {match.name}
            </h3>
            {match.parent && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-muted/40 text-muted-foreground/60">
                {match.parent}
              </span>
            )}
          </div>
        </div>

        <p className="mt-2 text-xs leading-relaxed text-muted-foreground/80 line-clamp-2 italic">
          "{match.description}"
        </p>

        <div className="mt-3 pt-3 border-t border-border/20">
          <p className="text-[13px] text-foreground/70 leading-relaxed">
            <span className="text-primary/60 font-medium mr-1 text-xs">
              推荐理由：
            </span>
            {match.reason}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <a
            href={match.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-medium text-muted-foreground/40 hover:text-primary transition-colors flex items-center gap-1"
          >
            Wiki / More
            <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
              →
            </span>
          </a>

          <Link
            href={`/create?style=${encodeURIComponent(match.name)}&description=${encodeURIComponent(match.description)}&context=${encodeURIComponent(query)}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all text-[11px] font-semibold"
          >
            <Wand2 className="h-3 w-3" />
            以此风格创作
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
