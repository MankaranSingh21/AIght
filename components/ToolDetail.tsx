"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { addToolToRoadmap } from "@/app/actions/roadmap";
import Button from "./Button";
import RoadmapPicker from "./RoadmapPicker";
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
  // Already an embed URL — return as-is
  if (url.includes("youtube.com/embed/")) return url;

  // youtu.be/ID or youtu.be/ID?t=...
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;

  // youtube.com/watch?v=ID or youtube.com/shorts/ID
  const longMatch = url.match(
    /youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/)([a-zA-Z0-9_-]{11})/
  );
  if (longMatch) return `https://www.youtube.com/embed/${longMatch[1]}`;

  // Unrecognised — pass through and let the browser handle it
  return url;
}

// ── Accent Maps ────────────────────────────────────────────────────────────

const useCaseAccent = {
  moss: {
    header: "bg-moss-100",
    border: "border-moss-200",
    label: "bg-moss-500 text-parchment",
    shadow: "hover:shadow-moss",
  },
  amber: {
    header: "bg-amber-100",
    border: "border-amber-200",
    label: "bg-amber-400 text-espresso",
    shadow: "hover:shadow-amber",
  },
  lavender: {
    header: "bg-lavender-100",
    border: "border-lavender-200",
    label: "bg-lavender-400 text-parchment",
    shadow: "hover:shadow-card-hover",
  },
};

const pricingStyle: Record<ToolDetailData["pricing"], string> = {
  Free:         "bg-neon-lime/20 text-forest border border-neon-lime/50",
  "Open Source":"bg-lavender-100 text-lavender-700 border border-lavender-300",
  Freemium:     "bg-amber-100 text-amber-700 border border-amber-300",
  Paid:         "bg-moss-100 text-moss-700 border border-moss-300",
};

// ── Internal sub-component ─────────────────────────────────────────────────

function UseCaseCard({ useCase }: { useCase: UseCase }) {
  const a = useCaseAccent[useCase.accent];
  return (
    <motion.div
      className={`
        rounded-3xl border ${a.border} bg-parchment shadow-card
        overflow-hidden cursor-default transition-shadow duration-300 ${a.shadow}
      `}
      whileHover={{
        y: -5,
        scale: 1.012,
        transition: { type: "spring", stiffness: 260, damping: 22 },
      }}
    >
      {/* Coloured header strip */}
      <div className={`${a.header} px-7 pt-7 pb-5`}>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{useCase.emoji}</span>
          <span className={`text-2xs font-body font-semibold uppercase tracking-widest px-3 py-1 rounded-full ${a.label}`}>
            {useCase.audience}
          </span>
        </div>
        <h3 className="font-serif text-xl font-bold text-espresso leading-snug">
          {useCase.headline}
        </h3>
      </div>

      {/* Body */}
      <div className="px-7 py-5">
        <p className="font-body text-sm text-forest/80 leading-relaxed">
          {useCase.description}
        </p>
      </div>
    </motion.div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

export default function ToolDetail({ tool }: { tool: ToolDetailData }) {
  const [isPending, startTransition] = useTransition();
  const [pickerOpen, setPickerOpen]  = useState(false);
  const router   = useRouter();
  const pathname = usePathname();
  return (
    <main className="min-h-screen bg-parchment">
      <div className="max-w-4xl mx-auto px-6 md:px-10 py-10 space-y-16">

        {/* Back navigation */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-body text-sm text-forest/60 hover:text-forest transition-colors duration-150"
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
          {/* Logo */}
          <motion.div variants={fadeUp}>
            <motion.div
              className="inline-flex"
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <ToolLogo url={tool.url} emoji={tool.emoji} size={96} className="rounded-2xl" />
            </motion.div>
          </motion.div>

          {/* Name + pricing */}
          <motion.div variants={fadeUp} className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-serif text-5xl md:text-6xl font-bold text-espresso leading-none">
                {tool.name}
              </h1>
              <span className={`text-xs font-body font-semibold px-3 py-1.5 rounded-full ${pricingStyle[tool.pricing]}`}>
                {tool.pricing}
              </span>
            </div>
          </motion.div>

          {/* Tagline */}
          <motion.p
            variants={fadeUp}
            className="font-body text-lg md:text-xl text-forest/80 max-w-2xl leading-relaxed"
          >
            {tool.tagline}
          </motion.p>

          {/* Category + tags */}
          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2">
            <span className="text-2xs font-body font-semibold uppercase tracking-widest bg-moss-500 text-parchment px-3 py-1.5 rounded-full">
              {tool.category}
            </span>
            {tool.tags.map((tag) => (
              <span
                key={tag}
                className="text-2xs font-body px-3 py-1.5 rounded-full bg-moss-100 text-moss-800"
              >
                #{tag}
              </span>
            ))}
          </motion.div>
        </motion.section>

        {/* ── Video ── */}
        <motion.section variants={fadeIn} initial="hidden" animate="show">
          {tool.video_url ? (
            <div className="relative overflow-hidden rounded-4xl border border-moss-200 bg-espresso aspect-video">
              <iframe
                src={getYouTubeEmbedUrl(tool.video_url)}
                title={`${tool.name} demo`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-4xl border border-moss-200 bg-gradient-to-br from-moss-100 via-parchment to-amber-100 h-[320px] md:h-[400px] flex flex-col items-center justify-center gap-5">
              {/* Ambient blobs */}
              <div className="absolute top-6 left-8 w-40 h-40 bg-moss-300/20 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-8 right-10 w-52 h-52 bg-amber-300/20 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-lavender-200/15 rounded-full blur-2xl pointer-events-none" />

              {/* Pulsing play icon */}
              <motion.div
                className="relative z-10 w-20 h-20 rounded-full bg-espresso/90 flex items-center justify-center shadow-card-hover"
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg className="w-8 h-8 text-parchment ml-1" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </motion.div>

              <div className="relative z-10 text-center space-y-1.5">
                <p className="font-serif text-lg font-semibold text-espresso">
                  Video walkthrough
                </p>
                <p className="font-body text-sm text-forest/50 uppercase tracking-widest">
                  coming soon ✦
                </p>
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
            <p className="font-body text-xs uppercase tracking-[0.2em] text-moss-500 font-semibold mb-2">
              Real workflows, real people
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-espresso">
              How people are using it
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.12 } },
            }}
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
              <p className="font-body text-xs uppercase tracking-[0.2em] text-moss-500 font-semibold mb-2">
                your starter pack
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-espresso">
                Learning Guide
              </h2>
            </div>

            <div className="rounded-4xl border border-moss-200 bg-gradient-to-b from-moss-50/60 to-parchment p-8 md:p-10 space-y-4">
              {tool.learning_guide.split(/\n\n+/).map((para, i) => (
                <p key={i} className="font-body text-base text-forest/85 leading-relaxed">
                  {para.trim()}
                </p>
              ))}
            </div>
          </motion.section>
        )}

        {/* ── CTA ── */}
        <motion.section
          className="pb-8 flex flex-col sm:flex-row items-center gap-4 border-t border-moss-200 pt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ type: "spring", stiffness: 180, damping: 26 }}
        >
          <div className="flex-1 space-y-1">
            <p className="font-serif text-xl font-semibold text-espresso">
              Ready to actually use this?
            </p>
            <p className="font-body text-sm text-forest/60">
              Add it to your roadmap and we&rsquo;ll help you get started.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 flex-shrink-0">
            <Button
              variant="primary"
              size="lg"
              disabled={isPending}
              onClick={async () => {
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                  router.push(`/login?next=${encodeURIComponent(pathname)}`);
                  return;
                }
                setPickerOpen(true);
              }}
            >
              {isPending ? "Adding…" : "+ Add to Roadmap"}
            </Button>

            <RoadmapPicker
              open={pickerOpen}
              isPending={isPending}
              onClose={() => setPickerOpen(false)}
              onSelect={(roadmapId) => {
                startTransition(async () => {
                  const result = await addToolToRoadmap(
                    {
                      slug:           tool.slug,
                      name:           tool.name,
                      emoji:          tool.emoji,
                      url:            tool.url,
                      category:       tool.category,
                      accent:         tool.accent,
                      learning_guide: tool.learning_guide,
                      video_url:      tool.video_url,
                    },
                    roadmapId
                  );
                  if (result?.error) {
                    toast.error("Couldn't add tool", { description: result.error });
                  } else {
                    setPickerOpen(false);
                    toast.success(`${tool.name} added to your roadmap ✦`);
                    router.push(`/roadmaps/${roadmapId}`);
                  }
                });
              }}
            />
            {tool.url && (
              <motion.a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body font-semibold tracking-wide text-base px-6 py-3 rounded-2xl bg-transparent text-forest border border-forest/30 hover:bg-forest/[0.08] transition-colors duration-200 inline-flex items-center"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
              >
                Visit Tool ↗
              </motion.a>
            )}
          </div>
        </motion.section>

      </div>
    </main>
  );
}
