/**
 * Music Creation Form Hook
 *
 * 封装 react-hook-form 逻辑，处理从流派页面带入的参数
 */

import { zodResolver } from "@hookform/resolvers/zod"
import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { MiniMaxMusicV2InputSchema } from "@/lib/fal-integration/types"
import { buildPromptFromGenre, buildTitleFromGenre } from "../lib/build-prompt"

const CreateMusicFormSchema = MiniMaxMusicV2InputSchema.extend({
  title: z.string().optional(),
})

export type CreateMusicFormData = z.infer<typeof CreateMusicFormSchema>

interface UseMusicCreationFormOptions {
  defaultTitle?: string
  defaultPrompt?: string
}

export function useMusicCreationForm(options: UseMusicCreationFormOptions = {}) {
  const searchParams = useSearchParams()

  const styleFromGenre = searchParams.get("style")
  const descriptionFromGenre = searchParams.get("description")
  const contextFromGenre = searchParams.get("context")
  const vibeFromGenre = searchParams.get("vibe")

  const hasGenreContext = Boolean(styleFromGenre)

  const defaultPrompt =
    options.defaultPrompt ??
    buildPromptFromGenre(styleFromGenre, descriptionFromGenre, contextFromGenre, vibeFromGenre)

  const defaultTitle = options.defaultTitle ?? buildTitleFromGenre(styleFromGenre, contextFromGenre)

  const form = useForm<CreateMusicFormData>({
    resolver: zodResolver(CreateMusicFormSchema),
    defaultValues: {
      prompt: defaultPrompt,
      lyrics_prompt: "[Instrumental]",
      title: defaultTitle,
    },
  })

  return {
    form,
    hasGenreContext,
    currentPrompt: form.getValues("prompt"),
    // 原始参数（用于调试或扩展）
    genreParams: {
      style: styleFromGenre,
      description: descriptionFromGenre,
      context: contextFromGenre,
      vibe: vibeFromGenre,
    },
  }
}
