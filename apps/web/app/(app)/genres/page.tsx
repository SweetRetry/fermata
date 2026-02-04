"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import {
  EmptyState,
  ErrorState,
  ExampleQueries,
  SearchHeader,
  SearchResults,
  useGenreSearchForm,
} from "@/features/genre-discovery"

const pageVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number], // TargetLintErrorId: f0bf3aee-03ba-4044-9d85-8350dadb7726
    },
  },
} as const

const stateTransitionVariants = {
  initial: { opacity: 0, scale: 0.98, y: 10 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: -10,
    transition: {
      duration: 0.2,
    },
  },
} as const

export default function GenresPage() {
  const { query, setQuery, result, isLoading, error, handleSearch, handleKeyDown } =
    useGenreSearchForm()

  const [isCompact, setIsCompact] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const scrollTop = scrollContainerRef.current.scrollTop
        setIsCompact((prevCompact) => {
          if (!prevCompact && scrollTop > 80) return true
          if (prevCompact && scrollTop < 20) return false
          return prevCompact
        })
      }
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true })
      return () => container.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleSelectExample = (example: string) => {
    setQuery(example)
    handleSearch(example)
  }

  return (
    <motion.div
      className="flex h-full flex-col bg-background selection:bg-primary/20 overflow-hidden"
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
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

      <div ref={scrollContainerRef} className="flex-1 overflow-auto scroll-smooth perspective-1000">
        <div className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto w-full">
          <div
            className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isCompact
                ? "opacity-0 -translate-y-4 pointer-events-none h-0 mb-0"
                : "opacity-100 translate-y-0 h-auto mb-8"
            }`}
          >
            <ExampleQueries onSelect={handleSelectExample} />
          </div>

          <div className="pb-32">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  key="error"
                  variants={stateTransitionVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <ErrorState message={error} />
                </motion.div>
              )}

              {result && (
                <motion.div
                  key="results"
                  variants={stateTransitionVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <SearchResults result={result} onSelectTerm={handleSelectExample} />
                </motion.div>
              )}

              {!result && !error && !isLoading && (
                <motion.div
                  key="empty"
                  variants={stateTransitionVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <EmptyState />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
