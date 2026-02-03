"use client"

import { useMutation } from "@tanstack/react-query"
import { useCallback, useState } from "react"
import { searchGenres } from "../api/client"
import type { GenreSearchResponse } from "../types"

interface UseGenreSearchFormReturn {
  query: string
  setQuery: (query: string) => void
  result: GenreSearchResponse | null
  isLoading: boolean
  error: string | null
  handleSearch: (searchQuery?: string) => void
  handleKeyDown: (e: React.KeyboardEvent) => void
}

export function useGenreSearchForm(): UseGenreSearchFormReturn {
  const [query, setQuery] = useState("")
  const [result, setResult] = useState<GenreSearchResponse | null>(null)

  const mutation = useMutation<GenreSearchResponse, Error, string>({
    mutationFn: searchGenres,
    onSuccess: (data: GenreSearchResponse) => {
      setResult(data)
    },
  })

  const handleSearch = useCallback(
    (searchQuery: string = query) => {
      if (!searchQuery.trim()) return
      mutation.mutate(searchQuery)
    },
    [query, mutation]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSearch()
      }
    },
    [handleSearch]
  )

  return {
    query,
    setQuery,
    result,
    isLoading: mutation.isPending,
    error: mutation.error?.message || null,
    handleSearch,
    handleKeyDown,
  }
}
