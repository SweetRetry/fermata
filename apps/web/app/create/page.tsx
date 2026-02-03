"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@workspace/ui/components/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form"
import { cn } from "@workspace/ui/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Sparkles, Play, Pause, RotateCcw, AlertCircle, CheckCircle2 } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import { MiniMaxMusicV2InputSchema, type GenerationStatus } from "@/lib/fal-intergration/types"
import { useGenerations, useCreateGeneration, useGeneration } from "@/lib/api"

const CreateMusicFormSchema = MiniMaxMusicV2InputSchema.extend({
  title: z.string().optional(),
})

const AUDIO_PRESETS = {
  standard: { label: "标准", bitrate: "128000", sample_rate: "32000" },
  high: { label: "高质", bitrate: "256000", sample_rate: "44100" },
} as const

type AudioPresetKey = keyof typeof AUDIO_PRESETS
type CreateMusicFormData = z.infer<typeof CreateMusicFormSchema>

interface CurrentGeneration {
  id: string
  title: string
  status: GenerationStatus
}

const slideInVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.4,
      ease: "easeOut" as const,
    },
  }),
}

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.3,
      duration: 0.4,
    },
  },
}

function buildPromptFromGenre(
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

function buildTitleFromGenre(style: string | null, context: string | null): string {
  if (!style) return ""
  return context ? `${context} (${style})` : style
}

export default function CreatePage() {
  const [instrumental, setInstrumental] = useState(true)
  const [audioPreset, setAudioPreset] = useState<AudioPresetKey>("standard")
  const [showAudioSettings, setShowAudioSettings] = useState(false)
  const [currentGeneration, setCurrentGeneration] = useState<CurrentGeneration | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const searchParams = useSearchParams()

  const styleFromGenre = searchParams.get("style")
  const descriptionFromGenre = searchParams.get("description")
  const contextFromGenre = searchParams.get("context")

  const form = useForm<CreateMusicFormData>({
    resolver: zodResolver(CreateMusicFormSchema),
    defaultValues: {
      prompt: buildPromptFromGenre(styleFromGenre, descriptionFromGenre, contextFromGenre),
      lyrics_prompt: "",
      title: buildTitleFromGenre(styleFromGenre, contextFromGenre),
    },
  })

  const hasGenreContext = Boolean(styleFromGenre)
  const currentPrompt = form.getValues("prompt")

  // TanStack Query hooks - 替代 useEffect + useState 的数据获取
  const { data: recentGenerations = [], isLoading: isLoadingRecent } = useGenerations(10)
  const { data: currentGenData } = useGeneration(currentGeneration?.id || "")
  const createMutation = useCreateGeneration()

  const onSubmit = async (data: CreateMusicFormData) => {
    const preset = AUDIO_PRESETS[audioPreset]

    try {
      const result = await createMutation.mutateAsync({
        title: data.title,
        prompt: data.prompt,
        lyrics_prompt: instrumental ? "[Instrumental]" : data.lyrics_prompt,
        is_instrumental: instrumental,
        audio_setting: {
          bitrate: preset.bitrate,
          sample_rate: preset.sample_rate,
        },
      })

      setCurrentGeneration({
        id: result.id,
        title: data.title || "Untitled",
        status: "pending",
      })
    } catch (err) {
      console.error("Failed to create generation:", err)
    }
  }

  const handleRetry = () => {
    if (currentGeneration && currentGenData) {
      setCurrentGeneration({
        ...currentGeneration,
        status: currentGenData.status,
      })
    }
  }

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const getStatusDisplay = (status: GenerationStatus) => {
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

  const displayGeneration = currentGenData || currentGeneration
  const isSubmitting = createMutation.isPending
  const error = createMutation.error?.message || null

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex h-full">
        {/* Left Panel */}
        <div className="flex w-[480px] flex-col gap-8 border-r border-border p-10">
          {/* Header */}
          <motion.div
            className="flex items-center justify-between"
            custom={0}
            variants={slideInVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-[28px] font-semibold text-foreground">Create Music</h1>
            <motion.div
              className="flex h-9 items-center gap-2 rounded-lg border border-border bg-muted px-3"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-[13px] text-muted-foreground">MiniMax Music v2</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </motion.div>
          </motion.div>

          {/* Title Input */}
          <motion.div custom={1} variants={slideInVariants} initial="hidden" animate="visible">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Title
                  </FormLabel>
                  <FormControl>
                    <div className="flex h-12 items-center rounded-xl border border-border bg-secondary px-4">
                      <input
                        {...field}
                        type="text"
                        placeholder="Untitled (v1)"
                        className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </motion.div>

          {/* Style Input */}
          <motion.div custom={2} variants={slideInVariants} initial="hidden" animate="visible">
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Style of Music
                    </FormLabel>
                    {hasGenreContext && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-primary">
                        <Sparkles className="h-3 w-3" />
                        从流派发现带入
                      </span>
                    )}
                  </div>
                  <FormControl>
                    <div
                      className={cn(
                        "flex h-20 flex-col rounded-xl border bg-secondary p-4",
                        form.formState.errors.prompt ? "border-destructive" : "border-border"
                      )}
                    >
                      <textarea
                        {...field}
                        placeholder="Describe your music style (e.g., Industrial Metal, Dark, Heavy)"
                        className="h-full w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                      />
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs">
                    {currentPrompt?.length || 0}/300 characters
                  </FormDescription>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Lyrics Input */}
          <AnimatePresence>
            {!instrumental && (
              <motion.div
                custom={3}
                variants={slideInVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, height: 0 }}
              >
                <FormField
                  control={form.control}
                  name="lyrics_prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Lyrics
                      </FormLabel>
                      <FormControl>
                        <motion.div
                          className={cn(
                            "flex h-40 flex-col rounded-xl border bg-secondary p-4",
                            form.formState.errors.lyrics_prompt
                              ? "border-destructive"
                              : "border-border"
                          )}
                        >
                          <textarea
                            {...field}
                            placeholder="Enter your lyrics here...&#10;&#10;[Verse 1]&#10;Your lyrics"
                            className="h-full w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                          />
                        </motion.div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Settings Row */}
          <motion.div
            className="flex items-center justify-between"
            custom={4}
            variants={slideInVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-secondary-foreground">纯音乐</span>
                <motion.button
                  type="button"
                  onClick={() => setInstrumental(!instrumental)}
                  className={cn(
                    "relative h-5 w-9 rounded-full transition-colors",
                    instrumental ? "bg-primary" : "bg-muted"
                  )}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.span
                    className="absolute top-0.5 h-4 w-4 rounded-full bg-primary-foreground"
                    animate={{ left: instrumental ? 18 : 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </motion.button>
              </div>

              <button
                type="button"
                onClick={() => setAudioPreset(audioPreset === "standard" ? "high" : "standard")}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {AUDIO_PRESETS[audioPreset].label}
                <span className="ml-1 text-[10px] opacity-50">
                  {audioPreset === "high" ? "256k" : "128k"}
                </span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowAudioSettings(!showAudioSettings)}
              className={cn(
                "text-xs transition-colors",
                showAudioSettings ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              高级
            </button>
          </motion.div>

          {/* Advanced Audio Settings */}
          <AnimatePresence>
            {showAudioSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="rounded-lg bg-muted/30 p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">音质预设</span>
                    <div className="flex gap-1">
                      {(Object.keys(AUDIO_PRESETS) as AudioPresetKey[]).map((key) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setAudioPreset(key)}
                          className={cn(
                            "px-2 py-1 rounded text-[11px] transition-colors",
                            audioPreset === key
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted hover:bg-muted/80"
                          )}
                        >
                          {AUDIO_PRESETS[key].label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="text-[10px] text-muted-foreground/60 space-y-0.5">
                    <p>采样率: {AUDIO_PRESETS[audioPreset].sample_rate}Hz</p>
                    <p>比特率: {Number(AUDIO_PRESETS[audioPreset].bitrate) / 1000}kbps</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive"
              >
                <AlertCircle className="h-4 w-4" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Create Button */}
          <motion.div custom={5} variants={slideInVariants} initial="hidden" animate="visible">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-[52px] w-full rounded-[26px] text-base font-semibold"
              >
                {isSubmitting ? "生成中..." : "Create Music"}
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Panel */}
        <motion.div
          className="flex flex-1 flex-col gap-6 p-10"
          variants={fadeInVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium text-foreground">Recent Creations</h2>
            <Link href="/library">
              <Button type="button" variant="ghost" className="text-sm text-muted-foreground">
                View all
              </Button>
            </Link>
          </div>

          {/* Current Generation Status */}
          <AnimatePresence mode="wait">
            {displayGeneration && (
              <motion.div
                key="current"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="rounded-2xl border border-border bg-muted/30 p-6"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">{displayGeneration.title}</h3>
                    <p className={`text-sm ${getStatusDisplay(displayGeneration.status).color}`}>
                      {getStatusDisplay(displayGeneration.status).text}
                    </p>
                  </div>
                  {displayGeneration.status === "completed" && (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  )}
                  {displayGeneration.status === "failed" && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRetry}
                      className="h-8 gap-1"
                    >
                      <RotateCcw className="h-4 w-4" />
                      重试
                    </Button>
                  )}
                </div>

                {/* Audio Player */}
                {displayGeneration.status === "completed" && currentGenData?.audioUrl && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mt-4 flex items-center gap-4"
                  >
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={togglePlay}
                      className="h-12 w-12 rounded-full"
                    >
                      {isPlaying ? (
                        <Pause className="h-5 w-5" />
                      ) : (
                        <Play className="h-5 w-5 ml-0.5" />
                      )}
                    </Button>
                    <audio
                      ref={audioRef}
                      src={currentGenData.audioUrl}
                      onEnded={() => setIsPlaying(false)}
                      className="hidden"
                    />
                    <div className="flex-1">
                      <div className="h-1 rounded-full bg-muted">
                        <motion.div
                          className="h-full rounded-full bg-primary"
                          initial={{ width: "0%" }}
                          animate={{
                            width: isPlaying ? "100%" : "0%",
                          }}
                          transition={{
                            duration: currentGenData.duration || 120,
                            ease: "linear",
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Error Message */}
                {displayGeneration.status === "failed" && currentGenData?.errorMessage && (
                  <p className="mt-3 text-sm text-destructive">
                    {currentGenData.errorMessage}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Recent Generations List */}
          <div className="flex-1 space-y-3 overflow-auto">
            {isLoadingRecent ? (
              <div className="flex items-center justify-center py-12">
                <motion.div
                  className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </div>
            ) : (
              recentGenerations.map((gen, index) => (
                <motion.div
                  key={gen.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between rounded-xl border border-border p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      {gen.status === "completed" ? (
                        <Play className="h-4 w-4 text-primary" />
                      ) : gen.status === "failed" ? (
                        <AlertCircle className="h-4 w-4 text-destructive" />
                      ) : (
                        <motion.div
                          className="h-4 w-4 rounded-full bg-primary"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-foreground">{gen.title}</p>
                      <p className={`text-xs ${getStatusDisplay(gen.status).color}`}>
                        {getStatusDisplay(gen.status).text}
                      </p>
                    </div>
                  </div>
                  <Link href={`/details/${gen.id}`}>
                    <Button type="button" variant="ghost" size="sm">
                      查看
                    </Button>
                  </Link>
                </motion.div>
              ))
            )}

            {!isLoadingRecent && recentGenerations.length === 0 && !currentGeneration && (
              <motion.div
                className="flex flex-1 flex-col items-center justify-center gap-4 py-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="h-16 w-16 rounded-2xl border border-border bg-muted"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <span className="text-sm text-muted-foreground">
                  Your recent creations will appear here
                </span>
              </motion.div>
            )}
          </div>
        </motion.div>
      </form>
    </Form>
  )
}
