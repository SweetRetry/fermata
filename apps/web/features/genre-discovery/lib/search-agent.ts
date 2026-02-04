/**
 * AI Search Agent - Core semantic search logic
 *
 * Uses a two-tier hierarchical approach:
 * 1. First, select relevant main genres from 49 categories
 * 2. Then, match sub-genres from selected main categories
 * This reduces AI processing time from 15-40s to ~5s
 */

import { createDeepSeek } from "@ai-sdk/deepseek"
import { generateText, Output } from "ai"
import { z } from "zod"
import type { GenreMatch, GenreSearchResponse } from "../types"
import {
  getGenreByName,
  getMainGenresForAI,
  getSubGenresForAI,
  searchGenresByName,
} from "./genre-knowledge-base"

const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY,
})

/**
 * Scene keywords mapping for enhanced understanding
 */
const SCENE_KEYWORDS: Record<string, string[]> = {
  // 时间场景
  深夜: ["ambient", "dark", "night", "slow", "calm", "quiet"],
  晚上: ["ambient", "dark", "night", "slow", "calm"],
  夜晚: ["ambient", "dark", "night", "slow", "calm"],
  凌晨: ["ambient", "dark", "quiet", "meditation"],
  // 活动场景
  工作: ["ambient", "focus", "concentration", "background", "downtempo"],
  学习: ["ambient", "focus", "concentration", "background", "classical"],
  运动: ["electronic", "dance", "upbeat", "fast", "energetic", "workout"],
  跑步: ["electronic", "dance", "upbeat", "fast", "energetic"],
  健身: ["electronic", "dance", "upbeat", "fast", "energetic", "workout"],
  瑜伽: ["ambient", "meditation", "calm", "spiritual", "new age"],
  冥想: ["ambient", "meditation", "calm", "spiritual", "new age"],
  阅读: ["ambient", "classical", "calm", "background", "instrumental"],
  开车: ["electronic", "rock", "upbeat", "driving", "road"],
  通勤: ["pop", "upbeat", "electronic", "indie"],
  // 情绪场景
  放松: ["ambient", "chill", "calm", "lounge", "downtempo"],
  专注: ["ambient", "focus", "minimal", "background", "instrumental"],
  兴奋: ["electronic", "dance", "rock", "upbeat", "energetic"],
  悲伤: ["blues", "sad", "melancholic", "ambient", "folk"],
  开心: ["pop", "upbeat", "happy", "dance", "funk"],
  平静: ["ambient", "calm", "peaceful", "new age", "meditation"],
  // 环境描述
  雨: ["ambient", "rain", "nature", "atmospheric"],
  雨天: ["ambient", "rain", "nature", "atmospheric", "melancholic"],
  咖啡: ["jazz", "lounge", "chill", "ambient", "bossa nova"],
  咖啡馆: ["jazz", "lounge", "chill", "ambient", "bossa nova"],
}

/**
 * Extract scene context from Chinese queries
 * Optimized: pre-computed keyword list + early termination
 */
const SCENE_KEYWORD_LIST = Object.keys(SCENE_KEYWORDS)

function extractSceneContext(query: string): string[] {
  return SCENE_KEYWORD_LIST.filter((keyword) => query.includes(keyword))
}

// ============================================================================
// PROMPT SYSTEM - 系统化 Prompt 设计
// ============================================================================

/**
 * 系统角色定义
 */
const SYSTEM_ROLE = `你是一位专业的音乐策展人，擅长将场景需求转化为精准的音乐推荐。
你的语言风格：诗意、专业、沉浸感强，绝对不使用任何元话语。`

/**
 * 输出约束 - 必须遵守的格式规则
 */
const OUTPUT_CONSTRAINTS = `
【绝对禁止的词汇】
以下词汇严禁出现在任何输出字段中：
- 用户、查询、描述、输入、指定、要求、直接、选择
- 这是、那是、它是、这是、此为
- 推荐、建议、匹配、符合、适合

【正确的表达方式】
❌ 错误："用户查询了K-Pop"
✅ 正确："K-Pop 的现代制作..."

❌ 错误："这种音乐适合编程时听"
✅ 正确："电子节拍与清晰音色交织，营造专注氛围"

❌ 错误："我推荐这个流派因为..."
✅ 正确："合成器旋律与节奏律动，完美契合这场景"
`

/**
 * Schema for main genre selection (Step 1)
 */
const MainGenreSelectionSchema = z.object({
  selectedMainGenres: z
    .array(z.string())
    .min(1)
    .max(3)
    .describe("选择1-3个最相关的主类别名称，必须是数据库中存在的名称"),
  reasoning: z.string().describe("简要解释为什么选择这些主类别（中文）"),
})

/**
 * Schema for final sub-genre matching (Step 2)
 */
const SubGenreMatchingSchema = z.object({
  matches: z
    .array(
      z.object({
        name: z.string().describe("流派名称"),
        reason: z.string().describe(
          `【音乐契合说明】
描述这种音乐如何与场景氛围共鸣。
要求：
1. 只描述音乐特征与场景氛围的契合，不要提及"用户"或"需求"
2. 使用第三人称客观描述
3. 15-30字

正确示例：
- "合成器律动与电子节拍交织，为专注时刻注入能量"
- "钢琴旋律如雨滴般清澈，营造静谧沉思空间"
- "吉他 riff 与强劲鼓点，释放原始躁动能量"

错误示例：
- "用户查询了K-Pop，这是最精确的匹配" ❌
- "这种音乐适合编程时听" ❌
- "我推荐这个流派因为..." ❌`
        ),
        confidence: z.number().min(0).max(1).describe("置信度 0-1"),
        sceneVibe: z.string().describe(
          `【音乐氛围描述】
只描述音乐本身的听觉特征。
要求：
1. 只包含乐器、音色、节奏、情绪
2. 不涉及任何使用场景或用户行为
3. 15-25字，诗意凝练

正确示例：
- "空灵钢琴与电子合成器交织，营造静谧梦幻氛围"
- "失真吉他 riff 与强劲鼓点，释放原始能量"
- "温暖弦乐与柔和节拍，包裹听觉于舒适之中"

错误示例：
- "键盘敲击与韩语旋律同步，营造专注又轻快的编码氛围" ❌（包含场景）
- "适合在雨天听的小提琴曲" ❌（包含场景）`
        ),
      })
    )
    .describe("最匹配的流派列表"),
  relatedTerms: z.array(z.string()).describe("相关的搜索建议词（中文），帮助用户进一步探索"),
  summary: z.string().describe(
    `【场景音乐契合总结】
用一句话总结场景与音乐的契合。
要求：
1. 50字以内
2. 使用"这场景"、"此刻"、"这种氛围"等代词
3. 绝对禁止：用户、查询、描述、输入、指定、要求、直接

正确示例：
- "雨声淅沥，钢琴低语，这场景与 Ambient 的静谧完美共鸣"
- "此刻，电子节拍的律动为专注注入能量"
- "黄昏余晖中，吉他弦音与孤独行者同频"

错误示例：
- "用户查询了雨天的音乐，我推荐Ambient" ❌
- "用户直接指定了K-Pop，这是最精确的匹配" ❌`
  ),
})

/**
 * Step 1: Select relevant main genres from 49 categories
 */
async function selectMainGenres(query: string, sceneContext: string[]): Promise<string[]> {
  const mainGenresData = await getMainGenresForAI()

  const sceneHint =
    sceneContext.length > 0 ? `\n检测到的场景关键词: ${sceneContext.join(", ")}` : ""

  const { output } = await generateText({
    model: deepseek("deepseek-chat"),
    output: Output.object({ schema: MainGenreSelectionSchema }),
    prompt: `${SYSTEM_ROLE}

以下是所有主类别（共49个）：

${mainGenresData}

场景需求："${query}"${sceneHint}

${OUTPUT_CONSTRAINTS}

任务：从49个主类别中选择1-3个最相关的类别。

选择规则：
1. 理解场景需求（时间、活动、情绪、环境）
2. 选择最匹配的主类别，不要选太多
3. 只返回数据库中存在的名称
4. 如果需求很具体，选1个；如果模糊，最多选3个

示例：
- "深夜加班" → ["Ambient", "Electronic"]
- "健身房跑步" → ["Electronic", "Dance"]
- "下雨天看书" → ["Ambient", "Easy Listening"]`,
  })

  return output.selectedMainGenres
}

/**
 * Step 2: Match sub-genres from selected main categories
 */
async function matchSubGenres(
  query: string,
  mainGenreNames: string[],
  sceneContext: string[],
  limit: number
): Promise<GenreSearchResponse> {
  const subGenresData = await getSubGenresForAI(mainGenreNames)

  const sceneHint =
    sceneContext.length > 0 ? `\n检测到的场景关键词: ${sceneContext.join(", ")}` : ""

  const { output } = await generateText({
    model: deepseek("deepseek-chat"),
    output: Output.object({ schema: SubGenreMatchingSchema }),
    prompt: `${SYSTEM_ROLE}

${OUTPUT_CONSTRAINTS}

当前筛选的主类别：${mainGenreNames.join(", ")}

这些主类别下的所有子流派：

${subGenresData}

场景需求："${query}"${sceneHint}

任务：从上述子流派中选择最匹配的流派，最多选择 ${limit} 个。

匹配规则：
1. 理解场景需求的本质（情绪、氛围、节奏）
2. 将场景需求翻译为音乐特征（乐器、音色、BPM、情绪）
3. 严格限制最多选择 ${limit} 个流派，不要超出
4. 如果需求是英文流派名称，直接匹配该流派
5. 理解模糊描述（如"像电影配乐那样的感觉"）

重要：
- 只返回上述列表中存在的流派名称，确保名称完全匹配
- 严格限制返回数量为 ${limit} 个，不要多选
- 所有文本输出必须遵守【绝对禁止的词汇】列表`,
  })

  // Enrich matches with full genre info
  const limitedMatches = output.matches.slice(0, limit)
  const matches: GenreMatch[] = []
  for (const match of limitedMatches) {
    const genre = await getGenreByName(match.name)
    if (genre) {
      matches.push({
        name: genre.name,
        description: genre.description,
        url: genre.url,
        level: genre.level,
        parent: genre.parent,
        reason: match.reason,
        confidence: match.confidence,
        sceneVibe: match.sceneVibe,
      })
    }
  }

  return {
    query,
    matches,
    relatedTerms: output.relatedTerms,
    summary: output.summary,
  }
}

/**
 * Perform AI-powered semantic search using hierarchical approach
 */
export async function performAISearch(query: string, limit = 5): Promise<GenreSearchResponse> {
  const sceneContext = extractSceneContext(query)

  const selectedMains = await selectMainGenres(query, sceneContext)

  return matchSubGenres(query, selectedMains, sceneContext, limit)
}

/**
 * Quick keyword search for simple queries (fallback)
 */
export async function performKeywordSearch(query: string, limit = 5): Promise<GenreSearchResponse> {
  const results = await searchGenresByName(query, limit)

  const matches: GenreMatch[] = results.map(
    (genre: {
      name: string
      description: string
      url: string
      level: string
      parent?: string
    }) => ({
      name: genre.name,
      description: genre.description,
      url: genre.url,
      level: genre.level,
      parent: genre.parent,
      reason: `名称匹配: "${query}"`,
      confidence: genre.name.toLowerCase() === query.toLowerCase() ? 1.0 : 0.7,
      sceneVibe: undefined,
    })
  )

  return {
    query,
    matches,
    relatedTerms: [],
    summary: matches.length > 0 ? `找到 ${matches.length} 个匹配的流派` : "未找到匹配的流派",
  }
}

/**
 * Hybrid search: use keyword for simple queries, AI for complex ones
 */
export async function searchGenres(query: string, limit = 5): Promise<GenreSearchResponse> {
  if (/^[a-zA-Z0-9\s]+$/.test(query) && query.length < 30) {
    return performKeywordSearch(query, limit)
  }

  return performAISearch(query, limit)
}
