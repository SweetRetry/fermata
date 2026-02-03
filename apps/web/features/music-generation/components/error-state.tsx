"use client"

import { Button } from "@workspace/ui/components/button"
import { AlertCircle, RotateCcw } from "lucide-react"
import Link from "next/link"

interface ErrorStateProps {
  message?: string
  onRetry: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <AlertCircle className="h-12 w-12 text-destructive" />
      <p className="text-muted-foreground">{message || "未找到该作品"}</p>
      <div className="flex gap-2">
        <Button onClick={onRetry} variant="outline">
          <RotateCcw className="mr-2 h-4 w-4" />
          重试
        </Button>
        <Link href="/library">
          <Button>返回库</Button>
        </Link>
      </div>
    </div>
  )
}
