/**
 * AI Search Agent - Core semantic search logic
 *
 * Uses AI to directly understand user queries and match them to genres
 * without multiple tool calls. The complete genre database is provided
 * as context in the prompt.
 */

import { createVolcengine } from "@sweetretry/ai-sdk-volcengine-adapter";
import { generateText, Output } from "ai";
import { z } from "zod";
import {
  getGenreByName,
  getGenreDatabaseForAI,
  searchGenresByName,
} from "./genre-knowledge-base";
import type { GenreMatch, SearchResponse } from "./types";

const volcengine = createVolcengine({
  apiKey: process.env.VOLCENGINE_API_KEY,
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
 */
function extractSceneContext(query: string): string[] {
  const contexts: string[] = [];
  for (const [keyword, _] of Object.entries(SCENE_KEYWORDS)) {
    if (query.includes(keyword)) {
      contexts.push(keyword);
    }
  }
  return contexts;
}

/**
 * Search result schema for AI output
 */
const SearchResultSchema = z.object({
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
 * Perform AI-powered semantic search
 *
 * This is the core function that:
 * 1. Loads the complete genre database as context
 * 2. Sends it to the AI with the user query
 * 3. Returns structured search results
 */
export async function performAISearch(
  query: string,
  limit = 5,
): Promise<SearchResponse> {
  // Load genre database for AI context
  const genreDatabase = await getGenreDatabaseForAI();

  // Extract scene context for additional hints
  const sceneContext = extractSceneContext(query);
  const sceneHint =
    sceneContext.length > 0
      ? `\n检测到的场景关键词: ${sceneContext.join(", ")}`
      : "";

  // Generate AI response using AI SDK v6 output API
  const { output } = await generateText({
    model: volcengine("doubao-seed-1-8-251228"),
    output: Output.object({ schema: SearchResultSchema }),
    prompt: `你是一个音乐流派专家。以下是完整的流派数据库：

${genreDatabase}

用户查询："${query}"${sceneHint}

请直接分析用户意图，从数据库中选择最匹配的流派。

匹配规则：
1. 理解中文自然语言（场景、情绪、用途）
2. 可以匹配多个相关流派
3. 给出匹配理由和置信度
4. 如果用户查询是英文流派名称，直接匹配该流派
5. 理解模糊描述（如"像电影配乐那样的感觉"）

重要：只返回数据库中存在的流派名称，确保名称完全匹配。`,
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
