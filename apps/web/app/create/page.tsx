"use client"

import { Suspense, useCallback, useState } from "react"
import { LeftPanel } from "@/features/music-creation/components/left-panel"
import { RightPanel } from "@/features/music-creation/components/right-panel"
import { useCreateGeneration } from "@/features/music-generation/api/client"

interface CurrentGeneration {
  id: string
  title: string
  status: "pending" | "generating" | "completed" | "failed"
}

function CreatePageContent() {
  const [currentGeneration, setCurrentGeneration] = useState<CurrentGeneration | null>(null)

  const createMutation = useCreateGeneration()

  const handleSubmit = useCallback(
    async (data: {
      title?: string
      prompt: string
      lyrics_prompt?: string
      is_instrumental: boolean
      audio_setting: {
        bitrate: string
        sample_rate: string
      }
    }) => {
      try {
        const result = await createMutation.mutateAsync({
          title: data.title,
          prompt: data.prompt,
          lyrics_prompt: data.lyrics_prompt,
          is_instrumental: data.is_instrumental,
          audio_setting: data.audio_setting,
        })

        setCurrentGeneration({
          id: result.id,
          title: data.title || "Untitled",
          status: "pending",
        })
      } catch (err) {
        console.error("Failed to create generation:", err)
      }
    },
    [createMutation]
  )

  const handleRetry = useCallback(() => {
    setCurrentGeneration((prev) => {
      if (prev) {
        return { ...prev }
      }
      return prev
    })
  }, [])

  return (
    <div className="flex h-full">
      <LeftPanel
        isSubmitting={createMutation.isPending}
        error={createMutation.error?.message || null}
        onSubmit={handleSubmit}
      />
      <RightPanel currentGeneration={currentGeneration} onRetry={handleRetry} />
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  )
}

export default function CreatePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CreatePageContent />
    </Suspense>
  )
}
