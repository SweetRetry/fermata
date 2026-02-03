/**
 * Get status display text and color
 */

import type { GenerationStatus } from "@/lib/fal-integration/types"

export function getStatusDisplay(status: GenerationStatus) {
  switch (status) {
    case "pending":
      return { text: "等待中...", color: "text-muted-foreground" }
    case "generating":
      return { text: "生成中...", color: "text-primary" }
    case "completed":
      return { text: "已完成", color: "text-emerald-500" }
    case "failed":
      return { text: "生成失败", color: "text-destructive" }
    default:
      return { text: "未知状态", color: "text-muted-foreground" }
  }
}
