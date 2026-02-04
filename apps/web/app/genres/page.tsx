"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  EmptyState,
  ErrorState,
  ExampleQueries,
  SearchHeader,
  SearchResults,
  useGenreSearchForm,
} from "@/features/genre-discovery";

export default function GenresPage() {
  const {
    query,
    setQuery,
    result,
    isLoading,
    error,
    handleSearch,
    handleKeyDown,
  } = useGenreSearchForm();

  const [isCompact, setIsCompact] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const scrollTop = scrollContainerRef.current.scrollTop;
        setIsCompact((prevCompact) => {
          // Hysteresis: prevent rapid switching at the threshold
          if (!prevCompact && scrollTop > 100) return true;
          if (prevCompact && scrollTop < 40) return false;
          return prevCompact;
        });
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const handleSelectExample = (example: string) => {
    setQuery(example);
    handleSearch(example);
  };

  return (
    <div className="flex h-full flex-col bg-background selection:bg-primary/20 overflow-hidden">
      {/* Sticky Header Wrapper */}
      <div className="flex-none z-50">
        <SearchHeader
          query={query}
          setQuery={setQuery}
          isLoading={isLoading}
          onSearch={() => handleSearch()}
          onKeyDown={handleKeyDown}
          isCompact={isCompact}
        />
      </div>

      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-auto scroll-smooth"
      >
        <div className="px-6 md:px-12 lg:px-16">
          <div
            className={`pb-8 transition-opacity duration-300 ${isCompact ? "opacity-0 pointer-events-none" : "opacity-100"}`}
          >
            <ExampleQueries onSelect={handleSelectExample} />
          </div>
        </div>

        <div className="px-6 md:px-12 lg:px-16 pb-20">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <ErrorState message={error} />
              </motion.div>
            )}

            {result && (
              <SearchResults
                result={result}
                onSelectTerm={handleSelectExample}
              />
            )}

            {!result && !error && !isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <EmptyState />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
