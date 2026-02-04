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

const containerVariants = {
  hidden: { opacity: 0, height: 0, marginBottom: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    marginBottom: 32,
    transition: {
      type: "spring",
      stiffness: 280,
      damping: 28,
      mass: 1,
      duration: 0.4,
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    marginBottom: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
} as const;

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
      className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] px-6 md:px-12 lg:px-16 ${
        isCompact
          ? "py-4 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm"
          : "pt-16 pb-12"
      }`}
    >
      <AnimatePresence mode="wait">
        {!isCompact && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                {
                  type: "spring",
                  stiffness: 200,
                  damping: 25,
                  delay: 0.1,
                } as const
              }
            >
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tighter text-foreground">
                Genre Discovery
              </h1>
            </motion.div>

            <motion.p
              className="mt-4 text-sm md:text-base text-muted-foreground/80 font-normal tracking-tight max-w-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Touch the rhythm with words. Enter your current vibe and embark on
              a journey to discover unknown beats.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={`flex items-center gap-6 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isCompact ? "max-w-5xl mx-auto" : "max-w-3xl"
        }`}
      >
        {isCompact && (
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-lg font-semibold pr-6 border-r border-border/50 whitespace-nowrap hidden sm:block tracking-tighter"
          >
            Genre Discovery
          </motion.div>
        )}

        {/* Search Input Container */}
        <div className="flex-1 flex gap-4">
          <div className="relative flex-1 group">
            {/* Reflective Border Glow - Use Primary for both themes */}
            <div className="absolute -inset-[1px] bg-gradient-to-b from-primary/20 to-transparent rounded-xl opacity-0 group-focus-within:opacity-100 transition duration-500" />

            <div
              className={`relative flex items-center rounded-xl bg-muted/40 border border-border/50 backdrop-blur-sm group-focus-within:bg-muted/60 group-focus-within:border-primary/30 transition-all duration-500 ${
                isCompact ? "h-11" : "h-14"
              }`}
            >
              <Search
                className={`ml-4 text-muted-foreground/40 transition-all ${
                  isCompact ? "h-4 w-4" : "h-5 w-5"
                }`}
              />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Describe the sound in your mind..."
                className="flex-1 border-0 bg-transparent px-4 text-sm md:text-base placeholder:text-muted-foreground/40 focus-visible:ring-0 focus-visible:ring-offset-0 font-normal"
              />
            </div>
          </div>
          <Button
            onClick={onSearch}
            disabled={isLoading || !query.trim()}
            className={`rounded-xl bg-foreground text-background hover:bg-foreground/90 transition-all font-semibold tracking-tight shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] ${
              isCompact ? "h-11 px-8 text-xs" : "h-14 px-10"
            }`}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Discover"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
