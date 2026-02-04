import type { GenerationStatus } from "@/lib/fal-integration/types"

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function getStatusText(status: GenerationStatus): string | null {
  switch (status) {
    case "pending":
      return null
    case "generating":
      return null
    case "completed":
      return null
    case "failed":
      return "生成失败"
    default:
      return null
  }
}

export function getStatusColor(status: GenerationStatus): string | null {
  switch (status) {
    case "pending":
      return null
    case "generating":
      return null
    case "completed":
      return null
    case "failed":
      return "text-muted-foreground"
    default:
      return null
  }
}
