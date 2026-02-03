# Fal AI Integration - MiniMax Music v2

## 概述

本模块集成了 Fal AI 的 MiniMax Music v2 模型，用于从文本提示生成音乐。

## 模型信息

- **模型 ID**: `fal-ai/minimax-music/v2`
- **Playground**: https://fal.ai/models/fal-ai/minimax-music/v2
- **API Endpoint**: `https://fal.run/fal-ai/minimax-music/v2`
- **类别**: Text-to-Audio

## 环境变量

```bash
FAL_API_KEY=your_fal_api_key
```

## 使用示例

### 基础用法

```typescript
import { generateMusic } from "@/lib/fal-intergration";

const result = await generateMusic({
  prompt: "Indie folk, melancholic, introspective, longing, solitary walk, coffee shop",
  lyrics_prompt: "[Verse]\nStreetlights flicker in the rain\nMemories of you remain",
});

console.log(result.audio.url); // 生成的音频文件 URL
```

### 使用自定义客户端

```typescript
import { createFalClient, generateMusic } from "@/lib/fal-intergration";

const client = createFalClient({ apiKey: "your-api-key" });

// 或使用默认客户端（从环境变量读取）
import { getFalClient } from "@/lib/fal-intergration";
const defaultClient = getFalClient();
```

## API 参数

### 输入参数 (MiniMaxMusicV2Input)

| 参数 | 类型 | 必需 | 描述 |
|------|------|------|------|
| `prompt` | string | 是 | 音乐描述，指定风格、情绪和场景（10-300字符） |
| `lyrics_prompt` | string | 是 | 歌词，使用 `\n` 分隔行，支持 `[Intro]`, `[Verse]`, `[Chorus]`, `[Bridge]`, `[Outro]` 标签 |
| `audio_setting` | AudioSetting | 否 | 音频配置（比特率、采样率） |

### 输出结果 (MiniMaxMusicV2Output)

```typescript
{
  audio: {
    url: string;        // 音频文件 URL
    content_type?: string;
    file_name?: string;
    file_size?: number;
  }
}
```

## 歌词标签示例

```
[Intro]
Instrumental intro music

[Verse]
First line of lyrics
Second line of lyrics

[Chorus]
Catchy chorus line
Another chorus line

[Bridge]
Bridge section lyrics

[Outro]
Fade out music
```

## 错误处理

```typescript
import { generateMusic } from "@/lib/fal-intergration";

try {
  const result = await generateMusic({
    prompt: "Upbeat pop music",
    lyrics_prompt: "[Verse]\nHappy days are here",
  });
} catch (error) {
  console.error("Music generation failed:", error.message);
}
```
