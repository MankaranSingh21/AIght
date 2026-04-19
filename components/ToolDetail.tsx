"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import ToolLogo from "./ToolLogo";

// ── Types ──────────────────────────────────────────────────────────────────

export type UseCase = {
  audience: string;
  emoji: string;
  headline: string;
  description: string;
  accent: "moss" | "amber" | "lavender";
};

export type ToolDetailData = {
  name: string;
  slug: string;
  emoji: string;
  tagline: string;
  category: string;
  pricing: "Free" | "Open Source" | "Paid" | "Freemium";
  accent: "moss" | "amber" | "lavender";
  url?: string | null;
  tags: string[];
  useCases: [UseCase, UseCase];
  video_url?: string | null;
  learning_guide?: string | null;
  related_concepts?: string[];
};

// ── Animation Variants ─────────────────────────────────────────────────────

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 200, damping: 26 },
  },
};

const fadeIn: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 180, damping: 28, delay: 0.3 },
  },
};

// ── Helpers ────────────────────────────────────────────────────────────────

function getYouTubeEmbedUrl(url: string): string {
  if (url.includes("youtube.com/embed/")) return url;

  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;

  const longMatch = url.match(
    /youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/)([a-zA-Z0-9_-]{11})/
  );
  if (longMatch) return `https://www.youtube.com/embed/${longMatch[1]}`;

  return url;
}

// ── Accent Maps ────────────────────────────────────────────────────────────

const useCaseAccent = {
  moss: {
    header: "bg-raised",
    border: "border-subtle",
    label: "bg-accent text-inverse",
  },
  amber: {
    header: "bg-raised",
    border: "border-subtle",
    label: "bg-warm text-inverse",
  },
  lavender: {
    header: "bg-raised",
    border: "border-subtle",
    label: "bg-accent text-inverse",
  },
};

const pricingStyle: Record<ToolDetailData["pricing"], string> = {
  Free:          "bg-[var(--accent-primary-glow)] text-accent border border-emphasis",
  "Open Source": "bg-[var(--accent-primary-glow)] text-accent border border-emphasis",
  Freemium:      "bg-raised text-warm border border-subtle",
  Paid:          "bg-raised text-muted border border-subtle",
};

// ── Internal sub-component ─────────────────────────────────────────────────

function UseCaseCard({ useCase }: { useCase: UseCase }) {
  const a = useCaseAccent[useCase.accent];
  return (
    <motion.div
      className={`rounded-xl border ${a.border} bg-panel overflow-hidden cursor-default transition-colors duration-200 hover:border-emphasis`}
      whileHover={{
        y: -2,
        transition: { duration: 0.2, ease: "easeOut" },
      }}
    >
      <div className={`${a.header} px-7 pt-7 pb-5`}>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{useCase.emoji}</span>
          <span className={`font-mono text-xs uppercase tracking-[0.1em] px-3 py-1 rounded-sm ${a.label}`}>
            {useCase.audience}
          </span>
        </div>
        <h3 className="font-sans text-xl font-medium text-primary leading-snug">
          {useCase.headline}
        </h3>
      </div>
      <div className="px-7 py-5">
        <p className="font-sans text-sm text-secondary leading-relaxed">
          {useCase.description}
        </p>
      </div>
    </motion.div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

export default function ToolDetail({ tool }: { tool: ToolDetailData }) {
  return (
    <main className="min-h-screen bg-page">
      <div className="max-w-4xl mx-auto px-6 md:px-10 py-10 space-y-16">

        {/* Back navigation */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-sans text-sm text-secondary hover:text-primary transition-colors duration-150"
          >
            <span>←</span>
            <span>Back to all tools</span>
          </Link>
        </motion.div>

        {/* ── Header ── */}
        <motion.section
          variants={stagger}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          <motion.div variants={fadeUp}>
            <ToolLogo url={tool.url} emoji={tool.emoji} size={96} className="rounded-xl" />
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-sans text-5xl md:text-6xl font-semibold text-primary leading-none tracking-tight">
                {tool.name}
              </h1>
              <span className={`font-mono text-xs px-3 py-1.5 rounded-sm ${pricingStyle[tool.pricing]}`}>
                {tool.pricing}
              </span>
            </div>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="font-sans text-lg md:text-xl text-secondary max-w-2xl leading-relaxed"
          >
            {tool.tagline}
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-[0.1em] bg-accent text-inverse px-3 py-1.5 rounded-sm">
              {tool.category}
            </span>
            {tool.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </motion.div>
        </motion.section>

        {/* ── Video ── */}
        <motion.section variants={fadeIn} initial="hidden" animate="show">
          {tool.video_url ? (
            <div className="relative overflow-hidden rounded-xl border border-subtle bg-raised aspect-video">
              <iframe
                src={getYouTubeEmbedUrl(tool.video_url)}
                title={`${tool.name} demo`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-xl border border-subtle bg-raised h-[320px] md:h-[400px] flex flex-col items-center justify-center gap-5">
              <div className="absolute top-6 left-8 w-40 h-40 bg-[var(--accent-primary-glow)] rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-8 right-10 w-52 h-52 bg-[rgba(201,169,110,0.07)] rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10 w-20 h-20 rounded-full bg-panel border border-subtle flex items-center justify-center">
                <svg className="w-8 h-8 text-primary ml-1" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <div className="relative z-10 text-center space-y-1.5">
                <p className="font-sans text-lg font-medium text-primary">Video walkthrough</p>
                <p className="font-mono text-sm text-muted uppercase tracking-widest">coming soon</p>
              </div>
            </div>
          )}
        </motion.section>

        {/* ── Use Cases ── */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ type: "spring", stiffness: 180, damping: 26 }}
            className="mb-8"
          >
            <p className="font-mono text-xs uppercase tracking-[0.1em] text-accent mb-2">
              Real workflows, real people
            </p>
            <h2 className="font-sans text-3xl md:text-4xl font-semibold text-primary">
              How people are using it
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
          >
            {tool.useCases.map((uc) => (
              <motion.div key={uc.audience} variants={fadeUp}>
                <UseCaseCard useCase={uc} />
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ── Learning Guide ── */}
        {tool.learning_guide && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ type: "spring", stiffness: 180, damping: 26 }}
            className="space-y-6"
          >
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.1em] text-accent mb-2">
                your starter pack
              </p>
              <h2 className="font-sans text-3xl md:text-4xl font-semibold text-primary">
                Learning Guide
              </h2>
            </div>
            <div className="rounded-xl border border-subtle bg-raised p-8 md:p-10 space-y-4">
              {tool.learning_guide.split(/\n\n+/).map((para, i) => (
                <p key={i} className="font-sans text-base text-secondary leading-relaxed">
                  {para.trim()}
                </p>
              ))}
            </div>
          </motion.section>
        )}

        {/* ── How this works ── */}
        {tool.related_concepts && tool.related_concepts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-5"
          >
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-2">
                under the hood
              </p>
              <h2 className="font-sans text-3xl font-semibold text-primary">
                How this works
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {tool.related_concepts.map((concept) => (
                <Link
                  key={concept}
                  href={`/learn/${concept.toLowerCase().replace(/\s+/g, "-")}`}
                  className="tag tag-accent hover:opacity-80 transition-opacity duration-150"
                >
                  {concept} →
                </Link>
              ))}
            </div>
          </motion.section>
        )}

        {/* ── CTA ── */}
        {tool.url && (
          <motion.section
            className="pb-8 flex items-center border-t border-subtle pt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ type: "spring", stiffness: 180, damping: 26 }}
          >
            <motion.a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans font-medium tracking-wide text-sm px-6 py-3 rounded-md bg-transparent text-primary border border-subtle hover:border-emphasis hover:text-accent transition-colors duration-150 inline-flex items-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
            >
              Visit Tool ↗
            </motion.a>
          </motion.section>
        )}

      </div>
    </main>
  );
}
