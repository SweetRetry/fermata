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
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { generateMusic, MiniMaxMusicV2InputSchema } from "@/lib/fal-intergration"

// Form schema extends MiniMax API schema with UI-specific fields
const CreateMusicFormSchema = MiniMaxMusicV2InputSchema.extend({
  title: z.string().optional(),
})

type CreateMusicFormData = z.infer<typeof CreateMusicFormSchema>

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

export default function CreatePage() {
  const [instrumental, setInstrumental] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<CreateMusicFormData>({
    resolver: zodResolver(CreateMusicFormSchema),
    defaultValues: {
      prompt: "",
      lyrics_prompt: "",
      title: "",
    },
  })

  const currentPrompt = form.watch("prompt")

  const onSubmit = async (data: CreateMusicFormData) => {
    const submitData = {
      prompt: data.prompt,
      lyrics_prompt: instrumental ? "[Instrumental]" : data.lyrics_prompt,
    }

    setIsSubmitting(true)
    try {
      const result = await generateMusic(submitData)
      console.log("Generated:", result)
    } catch (error) {
      console.error("Generation failed:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

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

          {/* Style Input - Maps to MiniMax 'prompt' parameter */}
          <motion.div custom={2} variants={slideInVariants} initial="hidden" animate="visible">
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Style of Music
                  </FormLabel>
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

          {/* Lyrics Input - Hidden when instrumental */}
          {!instrumental && (
            <motion.div custom={3} variants={slideInVariants} initial="hidden" animate="visible">
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
                          form.formState.errors.lyrics_prompt ? "border-destructive" : "border-border"
                        )}
                        whileHover={{ borderColor: form.formState.errors.lyrics_prompt ? undefined : "var(--border)" }}
                        transition={{ duration: 0.2 }}
                      >
                        <textarea
                          {...field}
                          placeholder="Enter your lyrics here...

[Verse 1]
Your lyrics"
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

          {/* Instrumental Toggle */}
          <motion.div
            className="flex items-center justify-between"
            custom={4}
            variants={slideInVariants}
            initial="hidden"
            animate="visible"
          >
            <span className="text-sm text-secondary-foreground">Instrumental</span>
            <motion.button
              type="button"
              onClick={() => setInstrumental(!instrumental)}
              className={cn(
                "relative h-6 w-11 rounded-full transition-colors",
                instrumental ? "bg-primary" : "bg-muted"
              )}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                className="absolute top-0.5 h-5 w-5 rounded-full bg-primary-foreground"
                animate={{ left: instrumental ? 22 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </motion.button>
          </motion.div>

          {/* Create Button */}
          <motion.div custom={5} variants={slideInVariants} initial="hidden" animate="visible">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-[52px] w-full rounded-[26px] text-base font-semibold"
              >
                {isSubmitting ? "Generating..." : "Create Music"}
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
            <Button type="button" variant="ghost" className="text-sm text-muted-foreground">
              View all
            </Button>
          </div>

          <motion.div
            className="flex flex-1 flex-col items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <motion.div
              className="h-16 w-16 rounded-2xl border border-border bg-muted"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="text-sm text-muted-foreground">Your recent creations will appear here</span>
          </motion.div>
        </motion.div>
      </form>
    </Form>
  )
}
