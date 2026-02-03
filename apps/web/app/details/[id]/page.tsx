"use client"

import { Button } from "@workspace/ui/components/button"
import { motion } from "framer-motion"
import {
  AlertCircle,
  Clock,
  Heart,
  MessageCircle,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useGeneration, useAudioPlayer } from "@/hooks"
import { formatDate, getStatusText, getStatusColor } from "./utils"

const slideInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
}

const slideInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.2 + i * 0.1,
      duration: 0.4,
      ease: "easeOut" as const,
    },
  }),
}

export default function DetailsPage() {
  const params = useParams()
  const id = params.id as string

  const { data: generation, isLoading, error, refetch } = useGeneration(id)
  const { isPlaying, togglePlay } = useAudioPlayer({
    onEnded: () => {},
  })

  const handleRetry = async () => {
    await refetch()
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <motion.div
          className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    )
  }

  if (error || !generation) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p className="text-muted-foreground">{error?.message || "未找到该作品"}</p>
        <div className="flex gap-2">
          <Button onClick={handleRetry} variant="outline">
            <RotateCcw className="mr-2 h-4 w-4" />
            重试
          </Button>
          <Link href="/library">
            <Button>返回库</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full">
      {/* Artwork Section */}
      <motion.div
        className="flex w-[620px] flex-col items-center justify-center gap-8 border-r border-border bg-background p-16"
        variants={slideInLeft}
        initial="hidden"
        animate="visible"
      >
        {/* Audio Visualizer or Placeholder */}
        <motion.div
          className="relative h-[400px] w-[400px] rounded-2xl border border-border bg-muted"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          {generation.status === "completed" ? (
            <div className="absolute inset-0 flex items-center justify-center">
              {isPlaying ? (
                <motion.div className="flex items-end gap-1 h-32">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-4 rounded-full bg-primary"
                      animate={{
                        height: [40, 100, 60, 120, 50],
                      }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: i * 0.1,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </motion.div>
              ) : (
                <div className="flex h-24 items-end gap-1">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="w-4 rounded-full bg-muted-foreground/30"
                      style={{ height: `${40 + Math.random() * 40}px` }}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : generation.status === "failed" ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <AlertCircle className="h-16 w-16 text-destructive" />
              <span className="text-sm text-destructive">生成失败</span>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="h-16 w-16 rounded-full border-4 border-primary border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
          )}

          {/* Play Button */}
          {generation.status === "completed" && generation.audioUrl && (
            <button
              type="button"
              onClick={() => togglePlay(generation.audioUrl)}
              className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors hover:bg-black/10"
            >
              <motion.div
                className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {isPlaying ? (
                  <Pause className="h-8 w-8" />
                ) : (
                  <Play className="h-8 w-8 ml-1" />
                )}
              </motion.div>
            </button>
          )}
        </motion.div>

        {/* Title Info */}
        <motion.div
          className="flex flex-col items-center gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <h1 className="text-[28px] font-semibold text-foreground">
            {generation.title}
          </h1>
          <div className="flex items-center gap-2 text-base text-muted-foreground">
            <span className={getStatusColor(generation.status)}>
              {getStatusText(generation.status)}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {formatDate(generation.createdAt)}
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Details Section */}
      <motion.div
        className="flex flex-1 flex-col gap-8 p-12"
        variants={slideInRight}
        initial="hidden"
        animate="visible"
      >
        {/* Back Button */}
        <motion.div
          className="flex items-center justify-between"
          custom={0}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <Link
            href="/library"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to Library
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="flex gap-6"
          custom={1}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex h-5 w-5 items-center justify-center rounded bg-muted">
              <Heart className="h-3 w-3 text-muted-foreground" />
            </div>
            <span className="text-sm text-muted-foreground">0 likes</span>
          </motion.div>
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex h-5 w-5 items-center justify-center rounded bg-muted">
              <MessageCircle className="h-3 w-3 text-muted-foreground" />
            </div>
            <span className="text-sm text-muted-foreground">0 comments</span>
          </motion.div>
        </motion.div>

        {/* Prompt / Style */}
        <motion.div
          className="flex flex-col gap-3"
          custom={2}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Style / Prompt
          </span>
          <div className="flex flex-wrap gap-2">
            {generation.prompt.split(",").map((tag, index) => (
              <motion.span
                key={index}
                className="flex h-8 items-center rounded-md border border-border bg-muted px-3 text-[13px] text-muted-foreground"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.05, duration: 0.3 }}
                whileHover={{ scale: 1.05, backgroundColor: "var(--accent)" }}
              >
                {tag.trim()}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Lyrics */}
        <motion.div
          className="flex flex-1 flex-col gap-3"
          custom={3}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {generation.isInstrumental ? "Instrumental" : "Lyrics"}
            </span>
            {!generation.isInstrumental && generation.lyricsPrompt && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground"
                  onClick={() => {
                    if (generation.lyricsPrompt) {
                      navigator.clipboard.writeText(generation.lyricsPrompt)
                    }
                  }}
                >
                  Copy
                </Button>
              </motion.div>
            )}
          </div>
          <motion.pre
            className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            {generation.isInstrumental
              ? "[Instrumental - No lyrics]"
              : generation.lyricsPrompt || "[No lyrics provided]"}
          </motion.pre>
        </motion.div>

        {/* Error Message */}
        {generation.status === "failed" && generation.errorMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-lg border border-destructive/20 bg-destructive/10 p-4"
          >
            <p className="text-sm text-destructive">
              {generation.errorMessage}
            </p>
            <Button
              onClick={handleRetry}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              <RotateCcw className="mr-2 h-3 w-3" />
              刷新状态
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
