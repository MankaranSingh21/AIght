"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { createClient } from "@/utils/supabase/client";

// ── Animation variants ─────────────────────────────────────────────────────

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 200, damping: 26 },
  },
};

// ── Canvas mockup ──────────────────────────────────────────────────────────
//
// Each MOCK_NODE mirrors the structure of our real <ToolNode> component:
//   • accent-coloured header strip (clipped by card shape)
//   • espresso step-number badge (top-left overlap)
//   • accent colour pill + category label
//   • serif tool name
//   • status dot + "To do" label
//
// SVG viewBox: 600 × 268.  Node cards: 148 × 66, centred on (cx, cy).
// clipPath IDs are scoped per-node so the rounded header strips work correctly.

type MockNode = {
  cx: number;
  cy: number;
  name: string;
  cat: string;
  step: number;
  headerFill: string;
  cardStroke: string;
  accentDot: string;
};

const MOCK_NODES: MockNode[] = [
  { cx: 118, cy: 100, name: "Bolt.new",    cat: "Code Gen",  step: 1, headerFill: "#FEF3C7", cardStroke: "#FDE68A", accentDot: "#F59E0B" },
  { cx: 295, cy: 58,  name: "Claude",      cat: "AI Model",  step: 2, headerFill: "#E8F4E1", cardStroke: "#C5DFB5", accentDot: "#3D8A2B" },
  { cx: 474, cy: 100, name: "Cursor",      cat: "Dev Tool",  step: 3, headerFill: "#EDE9F8", cardStroke: "#D4CAF5", accentDot: "#9B8FD9" },
  { cx: 205, cy: 208, name: "NotebookLM",  cat: "Research",  step: 4, headerFill: "#E8F4E1", cardStroke: "#C5DFB5", accentDot: "#3D8A2B" },
  { cx: 385, cy: 208, name: "Perplexity",  cat: "Search",    step: 5, headerFill: "#FEF3C7", cardStroke: "#FDE68A", accentDot: "#F59E0B" },
];

// Smooth cubic bezier edges (centre → centre, React-Flow smoothstep style)
const MOCK_EDGES = [
  "M118,100 C206,100 206,58  295,58",   // N1 → N2
  "M295,58  C384,58  384,100 474,100",  // N2 → N3
  "M118,100 C118,154 205,154 205,208",  // N1 → N4
  "M295,58  C295,133 385,133 385,208",  // N2 → N5
  "M474,100 C474,154 385,154 385,208",  // N3 → N5
  "M205,208 C265,208 325,208 385,208",  // N4 → N5
];

// Card geometry constants (all relative to node centre)
const CW = 148; // card width
const CH = 66;  // card height
const RX = 12;  // border radius
const HH = 26;  // header strip height
const L  = -CW / 2;  // left edge  = -74
const T  = -CH / 2;  // top edge   = -33

function CanvasMockup() {
  return (
    <motion.div
      className="relative rounded-3xl border border-moss-200 overflow-hidden shadow-card-hover"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 160, damping: 26 }}
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-2.5 px-4 py-2.5 bg-espresso/[0.04] border-b border-moss-200">
        <div className="flex gap-1.5 flex-shrink-0">
          <div className="w-3 h-3 rounded-full bg-red-300/70" />
          <div className="w-3 h-3 rounded-full bg-amber-300/70" />
          <div className="w-3 h-3 rounded-full bg-moss-300/70" />
        </div>
        <div className="flex-1 mx-3 bg-parchment rounded-full border border-moss-100 px-4 py-1">
          <span className="font-body text-xs text-forest/35 select-none">
            aight.app/roadmaps/my-ai-stack
          </span>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative bg-parchment h-48 sm:h-64 md:h-[20rem] lg:h-[22rem]">
        <svg
          viewBox="0 0 600 268"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 w-full h-full"
          aria-hidden="true"
        >
          {/* ── Defs: dot grid + per-node header clip paths ─────────────── */}
          <defs>
            <pattern
              id="hero-dots"
              x="0" y="0" width="22" height="22"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1.4" cy="1.4" r="1.4" fill="#8ABF76" opacity="0.45" />
            </pattern>

            {/*
              One clip path per node.
              Coordinates are in absolute SVG space (cx ± CW/2, cy ± CH/2)
              so they align with the elements drawn at the same absolute positions.
            */}
            {MOCK_NODES.map((n, i) => (
              <clipPath key={`cp-${i}`} id={`hero-node-clip-${i}`}>
                <rect
                  x={n.cx + L}  y={n.cy + T}
                  width={CW}    height={CH}
                  rx={RX}
                />
              </clipPath>
            ))}
          </defs>

          {/* Dot grid background */}
          <rect width="600" height="268" fill="url(#hero-dots)" />

          {/* ── Edges ────────────────────────────────────────────────────── */}
          {MOCK_EDGES.map((d, i) => (
            <motion.path
              key={i}
              d={d}
              stroke="#3D8A2B"
              strokeWidth={1.8}
              strokeLinecap="round"
              fill="none"
              opacity={0.35}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                delay: 0.9 + i * 0.08,
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          ))}

          {/* ── Nodes ────────────────────────────────────────────────────── */}
          {MOCK_NODES.map((n, i) => (
            <motion.g
              key={i}
              initial={{ opacity: 0, scale: 0.65 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ transformOrigin: `${n.cx}px ${n.cy}px` }}
              transition={{
                delay: 0.62 + i * 0.09,
                type: "spring",
                stiffness: 220,
                damping: 20,
              }}
            >
              {/* Shadow */}
              <rect
                x={n.cx + L + 2} y={n.cy + T + 3}
                width={CW} height={CH} rx={RX}
                fill="rgba(44,26,14,0.07)"
              />

              {/* Card body (parchment) — rendered before header so header clips over it */}
              <rect
                x={n.cx + L} y={n.cy + T}
                width={CW} height={CH} rx={RX}
                fill="#F5EFE0"
                stroke={n.cardStroke}
                strokeWidth="1.5"
              />

              {/* Accent header strip — clipped to card shape */}
              <rect
                x={n.cx + L} y={n.cy + T}
                width={CW} height={HH}
                fill={n.headerFill}
                clipPath={`url(#hero-node-clip-${i})`}
              />

              {/* Card border on top (drawn last so it's crisp) */}
              <rect
                x={n.cx + L} y={n.cy + T}
                width={CW} height={CH} rx={RX}
                fill="none"
                stroke={n.cardStroke}
                strokeWidth="1.5"
              />

              {/* Step badge — overlaps top-left corner */}
              <circle
                cx={n.cx + L + 2} cy={n.cy + T}
                r="10"
                fill="#2C1A0E"
              />
              <text
                x={n.cx + L + 2} y={n.cy + T}
                textAnchor="middle" dominantBaseline="central"
                fill="#F5EFE0" fontSize="8" fontWeight="bold"
                fontFamily="Georgia, 'Times New Roman', serif"
              >
                {n.step}
              </text>

              {/* Accent dot */}
              <circle
                cx={n.cx + L + 22} cy={n.cy + T + 13}
                r="4"
                fill={n.accentDot}
              />

              {/* Category label */}
              <text
                x={n.cx + L + 30} y={n.cy + T + 13}
                dominantBaseline="central"
                fill="#2C1A0E" fontSize="7.5"
                fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
                fontWeight="600"
                opacity="0.65"
              >
                {n.cat}
              </text>

              {/* Tool name */}
              <text
                x={n.cx} y={n.cy + 7}
                textAnchor="middle" dominantBaseline="central"
                fill="#2C1A0E" fontSize="12.5" fontWeight="700"
                fontFamily="Georgia, 'Times New Roman', serif"
              >
                {n.name}
              </text>

              {/* Status indicator */}
              <circle
                cx={n.cx - 36} cy={n.cy + 23}
                r="3"
                fill="#8ABF76"
                opacity="0.75"
              />
              <text
                x={n.cx - 30} y={n.cy + 23}
                dominantBaseline="central"
                fill="#1C3A2E" fontSize="7"
                fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
                opacity="0.45"
              >
                To do
              </text>
            </motion.g>
          ))}
        </svg>
      </div>
    </motion.div>
  );
}

// ── Hero ───────────────────────────────────────────────────────────────────

export default function Hero() {
  // null = still checking, false = guest, true = authenticated
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data: { user } }) => setIsLoggedIn(!!user));
  }, []);

  const ctaHref  = isLoggedIn === true  ? "/roadmaps" : "/login";
  const ctaLabel = isLoggedIn === true  ? "Go to your Canvas →"
                 : "Generate your first Roadmap";

  return (
    <section className="relative overflow-hidden px-6 md:px-12 lg:px-20 pt-20 pb-16">
      {/* Ambient blobs */}
      <div className="absolute top-0 left-1/4 w-[480px] h-[480px] bg-moss-200/25 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-24 right-1/4 w-[320px] h-[320px] bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 w-[360px] h-[360px] bg-lavender-200/15 rounded-full blur-3xl translate-y-1/3 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Text block */}
        <motion.div
          className="text-center"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.p
            variants={item}
            className="font-body text-xs uppercase tracking-[0.2em] text-moss-500 mb-5"
          >
            your cozy corner of the internet ✦
          </motion.p>

          <motion.h1
            variants={item}
            className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-espresso leading-[1.08] mb-6 text-balance"
          >
            Stop drowning in AI spam.{" "}
            <br className="hidden md:block" />
            Build{" "}
            <span className="relative inline-block italic text-moss-600">
              visual roadmaps
              <motion.span
                className="absolute -bottom-1 left-0 h-[3px] w-full bg-amber-400 rounded-full"
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              />
            </span>{" "}
            for your next project.
          </motion.h1>

          <motion.p
            variants={item}
            className="font-body text-lg md:text-xl text-forest/70 max-w-2xl mx-auto mb-10 leading-relaxed text-balance"
          >
            A ruthlessly curated AI tool directory that generates personalised,
            step-by-step canvases to help you{" "}
            <span className="text-forest/90 font-medium">actually get work done</span>.
          </motion.p>

          {/* Single CTA — updates after auth check without layout shift */}
          <motion.div variants={item}>
            <Link href={ctaHref}>
              <motion.span
                className="
                  inline-flex items-center gap-2.5
                  font-body font-semibold tracking-wide text-lg
                  px-9 py-4 rounded-3xl
                  bg-moss-500 text-parchment border border-moss-600
                  hover:bg-moss-600 shadow-moss
                  transition-colors duration-200 cursor-pointer
                "
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
              >
                <motion.span
                  key={ctaLabel}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {ctaLabel}
                </motion.span>
                {isLoggedIn !== true && (
                  <span className="font-body text-sm font-normal text-parchment/70 bg-moss-600/50 px-2.5 py-0.5 rounded-full">
                    Free
                  </span>
                )}
              </motion.span>
            </Link>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-12 mb-10 flex items-center justify-center gap-3 text-forest/25"
          >
            <div className="h-px w-12 bg-current" />
            <span className="font-body text-xs tracking-widest uppercase select-none">
              see it in action
            </span>
            <div className="h-px w-12 bg-current" />
          </motion.div>
        </motion.div>

        {/* Product mockup */}
        <CanvasMockup />
      </div>
    </section>
  );
}
