import type { GenerationStatus } from "@/lib/fal-intergration/types"

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

export function getStatusText(status: GenerationStatus): string {
  switch (status) {
    case "pending":
      return "等待中"
    case "generating":
      return "生成中"
    case "completed":
      return "已完成"
    case "failed":
      return "生成失败"
    default:
      return "未知"
  }
}

export function getStatusColor(status: GenerationStatus): string {
  switch (status) {
    case "pending":
      return "text-muted-foreground"
    case "generating":
      return "text-primary"
    case "completed":
      return "text-emerald-500"
    case "failed":
      return "text-destructive"
    default:
      return "text-muted-foreground"
  }
}
