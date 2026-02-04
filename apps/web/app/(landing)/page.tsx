"use client";

import { Button } from "@workspace/ui/components/button";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  AudioLines,
  Cpu,
  Layers,
  Music,
  Play,
  Settings,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useRef } from "react";

// --- Constants from Cinematic UI Guide ---
const LAYOUT_TRANSITION = {
  type: "spring" as const,
  stiffness: 280,
  damping: 28,
  mass: 1,
};

const TACTILE_TRANSITION = {
  type: "spring" as const,
  stiffness: 380,
  damping: 30,
  mass: 0.8,
};

const REVEAL_TRANSITION = {
  duration: 1,
  ease: [0.16, 1, 0.3, 1] as const,
};

// --- Sub-components ---

function SpotlightCard({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Use springs for smooth spotlight movement if desired,
  // but the guide mentions mouse tracking.

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...REVEAL_TRANSITION, delay }}
      onMouseMove={handleMouseMove}
      className={`group relative overflow-hidden rounded-[24px] border border-white/10 bg-[#0A0A0A] transition-colors hover:border-white/20 ${className}`}
    >
      {/* Edge Sheen (Top Highlight) */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-500 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              rgba(255, 255, 255, 0.08),
              transparent 80%
            )
          `,
        }}
      />

      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}

function LandingHeader() {
  const { scrollY } = useScroll();
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.8)"],
  );
  const borderBottom = useTransform(
    scrollY,
    [0, 100],
    ["1px solid rgba(255, 255, 255, 0)", "1px solid rgba(255, 255, 255, 0.1)"],
  );

  return (
    <motion.header
      style={{ backgroundColor, borderBottom }}
      className="fixed top-0 left-0 right-0 z-[100] h-20 px-6 backdrop-blur-sm transition-colors"
    >
      <div className="max-w-[1400px] mx-auto h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <AudioLines className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
          <span className="font-bold tracking-tighter text-xl">FERMATA</span>
        </Link>
        <nav className="flex items-center gap-8">
          <Link
            href="/library"
            className="text-[11px] font-mono uppercase tracking-widest text-white/40 hover:text-white transition-colors"
          >
            Library
          </Link>
          <Link
            href="/create"
            className="text-[11px] font-mono uppercase tracking-widest text-white/40 hover:text-white transition-colors"
          >
            Create
          </Link>
          <Link
            href="/genres"
            className="text-[11px] font-mono uppercase tracking-widest text-white/40 hover:text-white transition-colors"
          >
            Genres
          </Link>
        </nav>
      </div>
    </motion.header>
  );
}

function HeroSection() {
  return (
    <section className="relative flex min-h-[70vh] flex-col items-center justify-center py-24 px-6 text-center overflow-hidden">
      {/* Background Cinematic Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/5 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={REVEAL_TRANSITION}
        className="mb-8 flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-4 py-1.5 text-[11px] font-mono uppercase tracking-[0.2em] text-white/40"
      >
        <Sparkles className="h-3 w-3 text-primary" />
        <span>Fermata Engine v2.4</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...REVEAL_TRANSITION, delay: 0.1 }}
        className="mb-8 text-[clamp(3rem,15vw,10rem)] font-bold tracking-[-0.06em] leading-[0.9] text-white"
        style={{ fontFeatureSettings: "'ss01', 'ss02'" }}
      >
        FERMATA
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...REVEAL_TRANSITION, delay: 0.2 }}
        className="mb-12 max-w-xl text-lg text-white/40 md:text-xl font-light tracking-tight"
      >
        A cinematic sanctuary for your ears. Immerse yourself in high-fidelity
        soundscapes and AI-generated original compositions.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ ...TACTILE_TRANSITION, delay: 0.3 }}
        className="flex flex-wrap items-center justify-center gap-6"
      >
        <Button
          size="lg"
          className="rounded-full px-10 h-14 bg-white text-black hover:bg-white/90 font-medium tracking-tight transition-all active:scale-95"
          asChild
        >
          <Link href="/library">
            Launch Library <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Link
          href="/create"
          className="text-white/60 hover:text-white transition-colors text-sm font-medium tracking-tight flex items-center gap-2"
        >
          Explore Creation <PlusIcon className="h-4 w-4" />
        </Link>
      </motion.div>
    </section>
  );
}

function PlusIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <title>PlusIcon</title>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function ShowcaseSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollXProgress } = useScroll({ container: scrollRef });
  const opacity = useTransform(
    scrollXProgress,
    [0, 0.1, 0.9, 1],
    [0.4, 1, 1, 0.4],
  );

  const showcaseItems = [
    {
      title: "Ethereal Echoes",
      artist: "Aurora-7",
      tags: ["Ambient", "Post-Rock"],
    },
    {
      title: "Neural Drift",
      artist: "Cortex.v2",
      tags: ["Industrial", "Techno"],
    },
    {
      title: "Midnight Solitude",
      artist: "Fermata-Zero",
      tags: ["Lo-Fi", "Jazz"],
    },
    {
      title: "Hyper-Space",
      artist: "Quantum Beats",
      tags: ["Synthwave", "Cyber"],
    },
    {
      title: "Organic Drift",
      artist: "Bio-Logic",
      tags: ["Neo-Classical", "Folk"],
    },
  ];

  return (
    <section className="py-32 overflow-hidden border-y border-white/5 bg-[#050505]">
      <div className="max-w-[1400px] mx-auto px-6 mb-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={REVEAL_TRANSITION}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary mb-4 block">
            The Gallery
          </span>
          <h2 className="text-5xl font-bold text-white tracking-tighter">
            Mastered by Machine
          </h2>
        </motion.div>
      </div>

      <motion.div
        ref={scrollRef}
        className="flex gap-8 overflow-x-auto px-6 pb-8 no-scrollbar cursor-grab active:cursor-grabbing"
        style={{ opacity }}
      >
        {showcaseItems.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ ...TACTILE_TRANSITION, delay: i * 0.1 }}
            className="flex-shrink-0 w-[380px]"
          >
            <SpotlightCard className="p-8 aspect-[4/3] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <Play className="h-4 w-4 text-white fill-current translate-x-0.5" />
                </div>
                <div className="flex gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[9px] font-mono text-white/40 uppercase tracking-wider"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-2xl font-bold text-white mb-1">
                  {item.title}
                </h4>
                <p className="text-white/40 text-sm">{item.artist}</p>
              </div>
            </SpotlightCard>
          </motion.div>
        ))}
        {/* Spacer for proper end alignment */}
        <div className="w-6 flex-shrink-0" />
      </motion.div>
    </section>
  );
}

function WorkflowSection() {
  const steps = [
    {
      icon: <Cpu className="h-6 w-6 text-primary" />,
      title: "Synthesize Intent",
      desc: "Define the sonic character using natural language or high-level parameters.",
    },
    {
      icon: <Layers className="h-6 w-6 text-primary" />,
      title: "Neural Composition",
      desc: "Our engine weaves intricate textures and melodic paths in real-time.",
    },
    {
      icon: <Zap className="h-6 w-6 text-primary" />,
      title: "Aerodynamic Mastering",
      desc: "Automated spatial processing ensures every frequency finds its place.",
    },
  ];

  return (
    <section className="py-48 px-6 max-w-[1200px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-24 relative">
        {/* Connecting line */}
        <div className="hidden md:block absolute top-[2.25rem] left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ ...REVEAL_TRANSITION, delay: i * 0.2 }}
            className="flex flex-col items-center text-center group"
          >
            <div className="relative z-10 h-14 w-14 rounded-full bg-[#0A0A0A] border border-white/10 flex items-center justify-center mb-10 transition-colors group-hover:border-primary/50 group-hover:bg-primary/5 shadow-2xl">
              {step.icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-4 tracking-tight group-hover:text-primary transition-colors">
              {step.title}
            </h3>
            <p className="text-white/40 text-base font-light leading-relaxed max-w-[280px]">
              {step.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function GenreSpotlight() {
  const genres = [
    "Cyberpunk Synth",
    "Ethereal Ambient",
    "Industrial Noise",
    "Lo-fi Jazz",
    "Minimal Techno",
    "Organic Folk",
  ];

  return (
    <section className="py-32 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-20">
          <div className="max-w-xl">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary mb-4 block">
              The Spectrum
            </span>
            <h2 className="text-5xl font-bold text-white tracking-tighter leading-none">
              Infinite <br /> Possibilities.
            </h2>
          </div>
          <p className="text-white/30 text-lg font-light max-w-sm">
            From the depths of experimental noise to the peaks of classical
            elegance. Fermata masters them all.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          {genres.map((genre, i) => (
            <motion.div
              key={genre}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ ...TACTILE_TRANSITION, delay: i * 0.05 }}
              className="px-8 py-6 rounded-2xl border border-white/5 bg-[#080808] hover:border-primary/30 transition-colors cursor-default group"
            >
              <span className="text-xl font-medium tracking-tight text-white/60 group-hover:text-white transition-colors">
                {genre}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const stats = [
    { label: "Generation Speed", value: "240 TPS" },
    { label: "Sample Accuracy", value: "32-bit / 48kHz" },
    { label: "Neural Layers", value: "2,048" },
    { label: "Model Latency", value: "12ms" },
  ];

  return (
    <section className="py-32 px-6 bg-[#050505] border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
        <Settings className="h-64 w-64 text-white animate-[spin_20s_linear_infinite]" />
      </div>

      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-16">
        <div className="max-w-md">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary mb-4 block">
            The Engine
          </span>
          <h2 className="text-4xl font-bold text-white tracking-tighter mb-8 leading-tight">
            Raw Power. <br /> Controlled Finesse.
          </h2>
          <p className="text-white/30 text-sm font-light leading-relaxed mb-10">
            Fermata doesn't just loop sounds. It understands the physics of air
            and the psychology of rhythm, delivering output that feels alive.
          </p>
          <div className="flex gap-4">
            <div className="h-px flex-1 bg-white/10 self-center" />
            <span className="font-mono text-[9px] text-white/20">
              SPECS_v2.4.0
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1 gap-y-12 md:gap-12 flex-1 max-w-xl self-end">
          {stats.map((stat) => (
            <div key={stat.label} className="border-l border-white/10 pl-8">
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/30 mb-2">
                {stat.label}
              </p>
              <p className="text-4xl font-bold text-white tracking-tighter">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureGrid() {
  return (
    <section className="py-32 px-6 max-w-[1400px] mx-auto w-full">
      <motion.div
        layout
        transition={LAYOUT_TRANSITION}
        className="grid grid-cols-1 md:grid-cols-12 gap-5 auto-rows-[320px]"
      >
        {/* Hero Feature */}
        <SpotlightCard
          className="md:col-span-8 md:row-span-2 p-12 flex flex-col justify-end overflow-hidden group/hero"
          delay={0.4}
        >
          <div className="absolute top-12 right-12 opacity-20 group-hover/hero:opacity-100 transition-opacity duration-700">
            <AudioLines className="h-32 w-32 text-primary" strokeWidth={0.5} />
          </div>
          <div className="relative z-10 max-w-md">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary mb-4 block">
              AI Core
            </span>
            <h3 className="text-4xl font-bold text-white mb-6 tracking-tighter">
              Intelligent Curation
            </h3>
            <p className="text-white/40 text-lg font-light leading-relaxed">
              Our neural engine analyzes your circadian rhythm and environment
              to generate the perfect sonic backdrop for your deep work or
              relaxation.
            </p>
          </div>
        </SpotlightCard>

        {/* Feature 2: Playback */}
        <SpotlightCard
          className="md:col-span-4 p-10 flex flex-col justify-between"
          delay={0.5}
        >
          <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Play className="h-5 w-5 text-white fill-current" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">
              Cinematic Audio
            </h3>
            <p className="text-white/40 text-sm font-light">
              Studio-grade reproduction with zero compression artifacts.
            </p>
          </div>
        </SpotlightCard>

        {/* Feature 3: Genres */}
        <SpotlightCard
          className="md:col-span-4 p-10 flex flex-col justify-between"
          delay={0.6}
        >
          <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Music className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">
              Genre Discovery
            </h3>
            <p className="text-white/40 text-sm font-light">
              Explore 200+ micro-genres from ethereal ambient to harsh
              industrial.
            </p>
          </div>
        </SpotlightCard>
      </motion.div>
    </section>
  );
}

function ArtistSpotlights() {
  const artists = [
    {
      name: "Lucid",
      role: "Sound Architect",
      quote: "The harmonic density Fermata achieves is unprecedented.",
    },
    {
      name: "Vektor",
      role: "Electronic Pioneer",
      quote:
        "It’s like having an entire studio's worth of modular gear in a single prompt.",
    },
  ];

  return (
    <section className="py-32 px-6 border-t border-white/5 bg-black">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {artists.map((artist, i) => (
            <motion.div
              key={artist.name}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ ...REVEAL_TRANSITION, delay: i * 0.2 }}
              className="p-12 rounded-3xl bg-[#080808] border border-white/5 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity">
                <Music className="h-32 w-32 text-white" />
              </div>
              <p className="text-2xl font-light text-white/60 mb-8 italic leading-relaxed">
                "{artist.quote}"
              </p>
              <div>
                <p className="text-white font-bold tracking-tight">
                  {artist.name}
                </p>
                <p className="text-primary text-xs font-mono uppercase tracking-widest">
                  {artist.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-48 px-6 text-center bg-black relative overflow-hidden">
      {/* Intense Cinematic Flare */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[1200px] h-[400px] bg-primary/20 blur-[180px] pointer-events-none rounded-full" />

      <div className="relative z-10 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={TACTILE_TRANSITION}
        >
          <h2 className="text-6xl md:text-8xl font-bold text-white tracking-tighter mb-12 leading-[0.9]">
            Begin the <br /> <span className="text-primary">Generation.</span>
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button
              size="lg"
              className="w-full sm:w-auto rounded-full px-12 h-16 bg-white text-black hover:bg-white/90 font-bold text-lg transition-all active:scale-95 shadow-2xl"
              asChild
            >
              <Link href="/library">Get Started Now</Link>
            </Button>
            <Link
              href="/create"
              className="text-white/40 hover:text-white transition-colors text-sm font-medium tracking-widest uppercase py-4"
            >
              Explore the Sandbox
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-full bg-black text-white selection:bg-white/20 selection:text-black">
      {/* Noise Texture Overlay for Cinematic Grain */}
      <div className="fixed inset-0 z-[50] pointer-events-none opacity-[0.03] contrast-150 brightness-150 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <main className="relative z-10 flex flex-col pt-20">
        <LandingHeader />
        <HeroSection />
        <FeatureGrid />
        <ShowcaseSection />
        <WorkflowSection />
        <GenreSpotlight />
        <ArtistSpotlights />
        <StatsSection />
        <CTASection />

        {/* Footer info/Meta */}
        <footer className="py-24 px-6 border-t border-white/5">
          <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/20">
              © 2024 FERMATA {"//"} AERODYNAMICS OF SOUND
            </p>
            <div className="flex gap-8 text-[9px] font-mono uppercase tracking-[0.2em] text-white/40">
              <Link href="/" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/" className="hover:text-white transition-colors">
                Terms
              </Link>
              <Link
                href="https://github.com"
                className="hover:text-white transition-colors"
              >
                Github
              </Link>
            </div>
          </div>
        </footer>
      </main>

      {/* Global Cinematic Glows */}
      <div
        className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 blur-[150px] -z-10 animate-pulse"
        style={{ animationDuration: "8s" }}
      />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/5 blur-[180px] -z-10" />
    </div>
  );
}
