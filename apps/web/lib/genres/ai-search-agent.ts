/**
 * AI Search Agent - Core semantic search logic
 *
 * Uses a two-tier hierarchical approach:
 * 1. First, select relevant main genres from 49 categories
 * 2. Then, match sub-genres from selected main categories
 * This reduces AI processing time from 15-40s to ~5s
 */

import { createDeepSeek } from "@ai-sdk/deepseek";
import { generateText, Output } from "ai";
import { z } from "zod";
import {
  getGenreByName,
  getMainGenresForAI,
  getSubGenresForAI,
  searchGenresByName,
} from "./genre-knowledge-base";
import type { GenreMatch, SearchResponse } from "./types";

const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY,
});

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
};

/**
 * Extract scene context from Chinese queries
 * Optimized: pre-computed keyword list + early termination
 */
const SCENE_KEYWORD_LIST = Object.keys(SCENE_KEYWORDS);

function extractSceneContext(query: string): string[] {
  return SCENE_KEYWORD_LIST.filter((keyword) => query.includes(keyword));
}

/**
 * Schema for main genre selection (Step 1)
 */
const MainGenreSelectionSchema = z.object({
  selectedMainGenres: z
    .array(z.string())
    .min(1)
    .max(3)
    .describe("选择1-3个最相关的主类别名称，必须是数据库中存在的名称"),
  reasoning: z
    .string()
    .describe("简要解释为什么选择这些主类别（中文）"),
});

/**
 * Schema for final sub-genre matching (Step 2)
 */
const SubGenreMatchingSchema = z.object({
  matches: z
    .array(
      z.object({
        name: z.string().describe("流派名称"),
        reason: z.string().describe("为什么这个流派符合用户查询（用中文解释）"),
        confidence: z.number().min(0).max(1).describe("置信度 0-1"),
      }),
    )
    .max(5)
    .describe("最匹配的流派列表，最多5个"),
  relatedTerms: z
    .array(z.string())
    .describe("相关的搜索建议词（中文），帮助用户进一步探索"),
  summary: z.string().describe("对用户查询的整体理解和推荐总结（用中文）"),
});

/**
 * Step 1: Select relevant main genres from 49 categories
 * This is fast (~2s) because we're only processing 49 items
 */
async function selectMainGenres(
  query: string,
  sceneContext: string[],
): Promise<string[]> {
  const mainGenresData = await getMainGenresForAI();

  const sceneHint =
    sceneContext.length > 0
      ? `\n检测到的场景关键词: ${sceneContext.join(", ")}`
      : "";

  const { output } = await generateText({
    model: deepseek("deepseek-chat"),
    output: Output.object({ schema: MainGenreSelectionSchema }),
    prompt: `你是一个音乐分类专家。以下是所有主类别（共49个）：

${mainGenresData}

用户查询："${query}"${sceneHint}

任务：从49个主类别中选择1-3个最相关的类别。

选择规则：
1. 理解用户场景（时间、活动、情绪、环境）
2. 选择最匹配的主类别，不要选太多
3. 只返回数据库中存在的名称
4. 如果查询很具体，选1个；如果模糊，最多选3个

示例：
- "深夜加班" → ["Ambient", "Electronic"]
- "健身房跑步" → ["Electronic", "Dance"]
- "下雨天看书" → ["Ambient", "Easy Listening"]`,
  });

  return output.selectedMainGenres;
}

/**
 * Step 2: Match sub-genres from selected main categories
 * This is also fast (~3s) because we're only processing 30-90 sub-genres
 */
async function matchSubGenres(
  query: string,
  mainGenreNames: string[],
  sceneContext: string[],
  limit: number,
): Promise<SearchResponse> {
  const subGenresData = await getSubGenresForAI(mainGenreNames);

  const sceneHint =
    sceneContext.length > 0
      ? `\n检测到的场景关键词: ${sceneContext.join(", ")}`
      : "";

  const { output } = await generateText({
    model: deepseek("deepseek-chat"),
    output: Output.object({ schema: SubGenreMatchingSchema }),
    prompt: `你是一个音乐流派专家。用户之前选择了以下主类别：${mainGenreNames.join(", ")}

这些主类别下的所有子流派：

${subGenresData}

用户查询："${query}"${sceneHint}

任务：从上述子流派中选择最匹配的流派。

匹配规则：
1. 理解中文自然语言（场景、情绪、用途）
2. 可以匹配多个相关流派，最多5个
3. 给出匹配理由和置信度
4. 如果用户查询是英文流派名称，直接匹配该流派
5. 理解模糊描述（如"像电影配乐那样的感觉"）

重要：只返回上述列表中存在的流派名称，确保名称完全匹配。`,
  });

  // Enrich matches with full genre info
  const matches: GenreMatch[] = [];
  for (const match of output.matches.slice(0, limit)) {
    const genre = await getGenreByName(match.name);
    if (genre) {
      matches.push({
        name: genre.name,
        description: genre.description,
        url: genre.url,
        level: genre.level,
        parent: genre.parent,
        reason: match.reason,
        confidence: match.confidence,
      });
    }
  }

  return {
    query,
    matches,
    relatedTerms: output.relatedTerms,
    summary: output.summary,
  };
}

/**
 * Perform AI-powered semantic search using hierarchical approach
 *
 * Two-step process:
 * 1. Select relevant main genres (49 → 1-3)
 * 2. Match sub-genres from selected categories
 *
 * Total time: ~5s vs original ~20s
 */
export async function performAISearch(
  query: string,
  limit = 5,
): Promise<SearchResponse> {
  // Extract scene context for both steps
  const sceneContext = extractSceneContext(query);

  // Step 1: Select main genres (~2s)
  const selectedMains = await selectMainGenres(query, sceneContext);

  // Step 2: Match sub-genres from selected categories (~3s)
  return matchSubGenres(query, selectedMains, sceneContext, limit);
}

/**
 * Quick keyword search for simple queries (fallback)
 */
export async function performKeywordSearch(
  query: string,
  limit = 5,
): Promise<SearchResponse> {
  const results = await searchGenresByName(query, limit);

  const matches: GenreMatch[] = results.map(
    (genre: {
      name: string;
      description: string;
      url: string;
      level: string;
      parent?: string;
    }) => ({
      name: genre.name,
      description: genre.description,
      url: genre.url,
      level: genre.level,
      parent: genre.parent,
      reason: `名称匹配: "${query}"`,
      confidence: genre.name.toLowerCase() === query.toLowerCase() ? 1.0 : 0.7,
    }),
  );

  return {
    query,
    matches,
    relatedTerms: [],
    summary:
      matches.length > 0
        ? `找到 ${matches.length} 个匹配的流派`
        : "未找到匹配的流派",
  };
}

/**
 * Hybrid search: use keyword for simple queries, AI for complex ones
 */
export async function searchGenres(
  query: string,
  limit = 5,
): Promise<SearchResponse> {
  // For simple single-word queries, use keyword search
  if (/^[a-zA-Z0-9\s]+$/.test(query) && query.length < 30) {
    return performKeywordSearch(query, limit);
  }

  // For complex queries, use AI search
  return performAISearch(query, limit);
}
