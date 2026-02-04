"use client";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Search } from "lucide-react";

interface SearchHeaderProps {
  query: string;
  setQuery: (query: string) => void;
  isLoading: boolean;
  onSearch: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  isCompact?: boolean;
}

export function SearchHeader({
  query,
  setQuery,
  isLoading,
  onSearch,
  onKeyDown,
  isCompact = false,
}: SearchHeaderProps) {
  return (
    <div
      className={`transition-all duration-500 ease-in-out px-6 md:px-12 lg:px-16 ${
        isCompact
          ? "py-4 bg-background/80 backdrop-blur-xl border-b border-border/40"
          : "pt-12 pb-8"
      }`}
    >
      <AnimatePresence mode="wait">
        {!isCompact && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 32 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h1 className="text-3xl font-light tracking-tight text-foreground">
                Genre Discovery
              </h1>
            </motion.div>

            <motion.p
              className="mt-2 text-sm text-muted-foreground/50 font-light tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
            >
              用文字触碰节奏。输入你此刻的氛围感，开启一场通往未知律动的发现之旅。
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={`flex items-center gap-4 transition-all duration-500 ${isCompact ? "max-w-4xl mx-auto" : "max-w-2xl"}`}
      >
        {isCompact && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-lg font-medium pr-4 border-r border-border/40 whitespace-nowrap hidden sm:block"
          >
            Genre Discovery
          </motion.div>
        )}

        {/* Search Input */}
        <div className="flex-1 flex gap-3">
          <div className="relative flex-1 group">
            <div
              className={`absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-500`}
            />
            <div
              className={`relative flex items-center rounded-xl bg-muted/30 border border-border/50 backdrop-blur-sm group-focus-within:bg-muted/50 group-focus-within:border-primary/30 transition-all ${isCompact ? "h-10" : "h-12"}`}
            >
              <Search
                className={`ml-4 text-muted-foreground/50 transition-all ${isCompact ? "h-3.5 w-3.5" : "h-4 w-4"}`}
              />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="在此刻的静谧中，你在寻找什么样的共鸣？"
                className="flex-1 border-0 bg-transparent px-3 text-sm md:text-base placeholder:text-muted-foreground/20 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>
          <Button
            onClick={onSearch}
            disabled={isLoading || !query.trim()}
            className={`rounded-xl bg-foreground text-background hover:bg-foreground/90 transition-all font-medium ${isCompact ? "h-10 px-6 text-xs" : "h-12 px-8"}`}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "发现"}
          </Button>
        </div>
      </div>
    </div>
  );
}
