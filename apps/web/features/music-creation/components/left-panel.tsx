"use client"

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
import { AnimatePresence, motion } from "framer-motion"
import { AlertCircle, ChevronDown, Sparkles } from "lucide-react"
import { memo, useState } from "react"
import { slideInVariants } from "../animations/variants"
import { AUDIO_PRESETS, type AudioPresetKey } from "../config/audio-presets"
import { useMusicCreationForm } from "../hooks/use-music-creation-form"

interface LeftPanelProps {
  isSubmitting: boolean
  error: string | null
  onSubmit: (data: {
    title?: string
    prompt: string
    lyrics_prompt?: string
    is_instrumental: boolean
    audio_setting: {
      bitrate: string
      sample_rate: string
    }
  }) => void
}

export const LeftPanel = memo(function LeftPanel({
  isSubmitting,
  error,
  onSubmit,
}: LeftPanelProps) {
  const { form, hasGenreContext, currentPrompt } = useMusicCreationForm()
  const [instrumental, setInstrumental] = useState(true)
  const [audioPreset, setAudioPreset] = useState<AudioPresetKey>("standard")
  const [showAudioSettings, setShowAudioSettings] = useState(false)

  const handleSubmit = form.handleSubmit((data) => {
    const preset = AUDIO_PRESETS[audioPreset]
    onSubmit({
      title: data.title,
      prompt: data.prompt,
      lyrics_prompt: instrumental ? "[Instrumental]" : data.lyrics_prompt,
      is_instrumental: instrumental,
      audio_setting: {
        bitrate: preset.bitrate,
        sample_rate: preset.sample_rate,
      },
    })
  })

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        className="flex w-[480px] flex-col gap-8 border-r border-border p-10"
      >
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
                  <p>
                    比特率: {Number(AUDIO_PRESETS[audioPreset].bitrate) / 1000}
                    kbps
                  </p>
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
      </form>
    </Form>
  )
})
