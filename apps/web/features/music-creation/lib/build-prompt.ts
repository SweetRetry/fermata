/**
 * Build prompt and title from genre parameters
 */

export function buildPromptFromGenre(
  style: string | null,
  description: string | null,
  context: string | null
): string {
  if (!style) return ""
  const parts = [style]
  if (description) parts.push(description)
  if (context) parts.push(`for ${context}`)
  return parts.join(", ")
}

export function buildTitleFromGenre(style: string | null, context: string | null): string {
  if (!style) return ""
  return context ? `${context} (${style})` : style
}
