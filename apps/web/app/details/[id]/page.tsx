"use client"

import { Button } from "@workspace/ui/components/button"
import { motion } from "framer-motion"
import { Heart, MessageCircle } from "lucide-react"
import Link from "next/link"

const tags = ["Industrial Metal", "Heavy", "Dark"]

const lyrics = `[Intro]
Eins, zwei, Polizei
Drei, vier, Grenadier
Fünf, sechs, alte Hex'
Sieben, acht, gute Nacht

[Verse 1]
Die Maschine raucht und bebt
Ein Herz aus Stahl, das niemals lebt
In den Tiefen, dunkel und kalt
Eine Geschichte, die man erzählt`

interface DetailsPageProps {
  params: {
    id: string
  }
}

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

export default function DetailsPage({ params }: DetailsPageProps) {
  const { id } = params

  return (
    <div className="flex h-full">
      {/* Artwork Section */}
      <motion.div
        className="flex w-[620px] flex-col items-center justify-center gap-8 border-r border-border bg-background p-16"
        variants={slideInLeft}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="h-[400px] w-[400px] rounded-2xl border border-border bg-muted"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          className="flex flex-col items-center gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <h1 className="text-[28px] font-semibold text-foreground">Untitled (v2)</h1>
          <span className="text-base text-muted-foreground">fspecil · v{id} · 2:00</span>
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
          <Link href="/library" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to Library
          </Link>
          <motion.div
            className="h-8 w-8 rounded-md bg-muted"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          />
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

        {/* Tags */}
        <motion.div
          className="flex flex-col gap-3"
          custom={2}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Style
          </span>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <motion.span
                key={tag}
                className="flex h-8 items-center rounded-md border border-border bg-muted px-3 text-[13px] text-muted-foreground"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.05, duration: 0.3 }}
                whileHover={{ scale: 1.05, backgroundColor: "var(--accent)" }}
              >
                {tag}
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
              Lyrics
            </span>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground"
              >
                Copy
              </Button>
            </motion.div>
          </div>
          <motion.pre
            className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            {lyrics}
          </motion.pre>
        </motion.div>
      </motion.div>
    </div>
  )
}
