"use client"

import { AnimatePresence } from "framer-motion"
import {
  EmptyState,
  ErrorState,
  ExampleQueries,
  SearchHeader,
  SearchResults,
  useGenreSearchForm,
} from "@/features/genre-discovery"

export default function GenresPage() {
  const { query, setQuery, result, isLoading, error, handleSearch, handleKeyDown } =
    useGenreSearchForm()

  const handleSelectExample = (example: string) => {
    setQuery(example)
    handleSearch(example)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="px-16 pt-20 pb-12">
        <SearchHeader
          query={query}
          setQuery={setQuery}
          isLoading={isLoading}
          onSearch={() => handleSearch()}
          onKeyDown={handleKeyDown}
        />
        <ExampleQueries onSelect={handleSelectExample} />
      </div>

      <div className="flex-1 overflow-auto px-16 pb-20">
        <AnimatePresence mode="wait">
          {error && <ErrorState message={error} />}

          {result && <SearchResults result={result} onSelectTerm={handleSelectExample} />}

          {!result && !error && !isLoading && <EmptyState />}
        </AnimatePresence>
      </div>
    </div>
  )
}
