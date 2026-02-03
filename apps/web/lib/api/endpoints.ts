/**
 * API Endpoints Configuration
 *
 * 集中管理所有 API 端点路径，便于维护和修改
 */

export const API_BASE = "/api"

export const endpoints = {
  // Music generation
  music: {
    /** GET /api/music/library - 获取音乐库列表 */
    library: `${API_BASE}/music/library`,
    /** GET/POST /api/music/generation - 获取/创建生成任务 */
    generation: `${API_BASE}/music/generation`,
  },

  // Genre search
  genres: {
    /** POST /api/genres/search - 搜索流派 */
    search: `${API_BASE}/genres/search`,
  },
} as const

// URL 构建辅助函数
export function buildUrl(
  baseUrl: string,
  params?: Record<string, string | number | undefined>
): string {
  if (!params) return baseUrl

  const searchParams = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value))
    }
  }

  const queryString = searchParams.toString()
  return queryString ? `${baseUrl}?${queryString}` : baseUrl
}
