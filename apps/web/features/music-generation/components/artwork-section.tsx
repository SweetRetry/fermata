"use client"

import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion"
import { AlertCircle, Pause, Play } from "lucide-react"
import { StatusIndicator } from "@/components/status-indicator"
import { formatDate, getStatusText } from "../lib/utils"
import type { Generation } from "../types"

// Kinetic Physics - Spring Configs
const SPRING_CINEMATIC = { stiffness: 280, damping: 28, mass: 1 }
const SPRING_TACTILE = { stiffness: 380, damping: 30, mass: 0.8 }
const EASE_REVEAL = [0.16, 1, 0.3, 1] as const

// Spotlight radius in pixels
const SPOTLIGHT_RADIUS = 400

interface ArtworkSectionProps {
  generation: Generation
  isPlaying: boolean
  onTogglePlay: () => void
}

export function ArtworkSection({ generation, isPlaying, onTogglePlay }: ArtworkSectionProps) {
  // layoutId for shared element transition
  const layoutId = `artwork-${generation.id}`
  const titleLayoutId = `title-${generation.id}`

  // Mouse tracking for spotlight effect
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth spring-based mouse movement
  const spotlightX = useSpring(mouseX, SPRING_CINEMATIC)
  const spotlightY = useSpring(mouseY, SPRING_CINEMATIC)

  // Create radial gradient spotlight
  const spotlightBackground = useMotionTemplate`
    radial-gradient(
      ${SPOTLIGHT_RADIUS}px circle at ${spotlightX}px ${spotlightY}px,
      oklch(1 0 0 / 0.1),
      transparent 100%
    )
  `

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  return (
    <motion.div
      className="relative flex w-[620px] flex-col items-center justify-center gap-10 border-r border-border bg-background p-16 overflow-hidden"
      initial={{ opacity: 0, x: -60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: EASE_REVEAL }}
    >
      {/* Artwork Card - Clean with shadow instead of border */}
      <motion.div
        layoutId={layoutId}
        className="relative h-[420px] w-[420px] rounded-2xl overflow-hidden cursor-pointer group"
        style={{
          // No border, use shadow for depth
          background: "oklch(0.22 0 0)",
          boxShadow: `
            0 0 0 1px oklch(1 0 0 / 0.06),
            0 20px 60px oklch(0 0 0 / 0.5),
            inset 0 1px 0 oklch(1 0 0 / 0.08)
          `,
        }}
        onMouseMove={handleMouseMove}
        whileHover={{ scale: 1.02 }}
        transition={SPRING_CINEMATIC}
      >
        {/* Spotlight overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: spotlightBackground }}
        />

        {/* Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          {generation.status === "completed" ? (
            <AudioVisualizer isPlaying={isPlaying} />
          ) : generation.status === "failed" ? (
            <div className="flex flex-col items-center justify-center gap-3">
              <AlertCircle className="h-16 w-16 text-muted-foreground/50" />
              <span className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
                Generation Failed
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4">
              <motion.div
                className="h-12 w-12 rounded-full border-2 border-primary/40 border-t-primary"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
              />
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Processing
              </span>
            </div>
          )}
        </div>

        {/* Play Button Overlay */}
        {generation.status === "completed" && generation.audioUrl && (
          <motion.button
            type="button"
            onClick={onTogglePlay}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
            style={{
              background: "oklch(0.02 0 0 / 0.35)",
            }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="flex h-24 w-24 items-center justify-center rounded-full"
              style={{
                background: "oklch(0.985 0 0)",
                boxShadow: "0 8px 40px oklch(0 0 0 / 0.4)",
              }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              transition={SPRING_TACTILE}
            >
              {isPlaying ? (
                <Pause className="h-10 w-10 text-background" />
              ) : (
                <Play className="h-10 w-10 ml-1 text-background" />
              )}
            </motion.div>
          </motion.button>
        )}
      </motion.div>

      {/* Title Info */}
      <motion.div
        className="flex flex-col items-center gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6, ease: EASE_REVEAL }}
      >
        <motion.h1
          layoutId={titleLayoutId}
          className="text-4xl font-semibold tracking-tight text-foreground"
        >
          {generation.title}
        </motion.h1>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <StatusIndicator status={generation.status} size="sm" />
          {generation.status === "failed" && (
            <span className="font-mono uppercase tracking-wider text-xs">
              {getStatusText(generation.status)}
            </span>
          )}
          <span>·</span>
          <span className="flex items-center gap-2 font-mono uppercase tracking-wider text-xs">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-label="Created at"
            >
              <title>Clock icon</title>
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {formatDate(generation.createdAt)}
          </span>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Audio Visualizer Component
function AudioVisualizer({ isPlaying }: { isPlaying: boolean }) {
  const barCount = 8

  if (!isPlaying) {
    return (
      <div className="flex items-end gap-1.5 h-28 opacity-40">
        {[...Array(barCount)].map((_, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: static visualizer bars
            key={`static-bar-${i}`}
            className="w-3 rounded-full bg-muted-foreground"
            style={{
              height: `${32 + Math.sin(i * 0.8) * 24}px`,
              opacity: 0.6 + Math.sin(i * 0.5) * 0.4,
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="flex items-end gap-1.5 h-36">
      {[...Array(barCount)].map((_, i) => (
        <motion.div
          // biome-ignore lint/suspicious/noArrayIndexKey: static visualizer bars
          key={`animated-bar-${i}`}
          className="w-3 rounded-full bg-primary"
          animate={{
            height: [40, 100 + Math.random() * 40, 60, 120 + Math.random() * 30, 50],
          }}
          transition={{
            duration: 0.8 + Math.random() * 0.4,
            repeat: Infinity,
            delay: i * 0.08,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}
