/**
 * Build prompt and title from genre parameters
 */

export function buildPromptFromGenre(
  style: string | null,
  description: string | null,
  _context: string | null,
  vibe: string | null
): string {
  if (!style) return ""

  // 构建层次化的 prompt：
  // 1. 流派名称（核心身份）
  // 2. 专业描述（技术特征）
  // 3. 氛围描述（情感加持）
  // 注意：context 包含用户场景需求，不应该出现在音乐生成 prompt 中
  const parts: string[] = [style]

  if (description) {
    parts.push(description)
  }

  if (vibe) {
    parts.push(vibe)
  }

  return parts.join(". ")
}

export function buildTitleFromGenre(style: string | null, context: string | null): string {
  if (!style) return ""
  return context ? `${context} (${style})` : style
}
