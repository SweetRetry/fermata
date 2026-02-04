/**
 * Get status display text and color
 */

import type { GenerationStatus } from "@/lib/fal-integration/types"

export function getStatusDisplay(status: GenerationStatus) {
  switch (status) {
    case "pending":
      return { text: null, color: "text-muted-foreground" }
    case "generating":
      return { text: null, color: "text-primary" }
    case "completed":
      return { text: null, color: null }
    case "failed":
      return { text: "生成失败", color: "text-muted-foreground" }
    default:
      return { text: null, color: null }
  }
}
