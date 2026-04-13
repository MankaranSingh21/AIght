"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";

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

// ── Canvas mockup data ─────────────────────────────────────────────────────

const MOCK_NODES = [
  { cx: 120, cy: 95,  label: "⚡ Bolt.new",     step: 1, fill: "#FEF3C7", stroke: "#FDE68A" },
  { cx: 295, cy: 58,  label: "🤖 Claude",        step: 2, fill: "#E8F4E1", stroke: "#C5DFB5" },
  { cx: 468, cy: 95,  label: "🖱️ Cursor",       step: 3, fill: "#EDE9F8", stroke: "#D4CAF5" },
  { cx: 205, cy: 200, label: "📓 NotebookLM",    step: 4, fill: "#E8F4E1", stroke: "#C5DFB5" },
  { cx: 382, cy: 200, label: "🔭 Perplexity",    step: 5, fill: "#FEF3C7", stroke: "#FDE68A" },
];

// Smooth cubic bezier edges (center → center)
const MOCK_EDGES = [
  "M120,95  C207,95  207,58  295,58",   // N1 → N2
  "M295,58  C381,58  381,95  468,95",   // N2 → N3
  "M120,95  C120,147 205,147 205,200",  // N1 → N4
  "M295,58  C295,129 382,129 382,200",  // N2 → N5
  "M468,95  C468,147 382,147 382,200",  // N3 → N5
  "M205,200 C270,200 317,200 382,200",  // N4 → N5
];

// ── Canvas mockup component ────────────────────────────────────────────────

function CanvasMockup() {
  return (
    <motion.div
      className="relative rounded-3xl border border-moss-200 overflow-hidden shadow-card-hover"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55, type: "spring", stiffness: 160, damping: 26 }}
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-2.5 px-4 py-3 bg-espresso/[0.04] border-b border-moss-200">
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

      {/* Canvas area */}
      <div className="relative bg-parchment h-48 sm:h-64 md:h-72 lg:h-80">
          <svg
            viewBox="0 0 600 260"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full"
            aria-hidden="true"
          >
            {/* Dot grid */}
            <defs>
              <pattern
                id="hero-dots"
                x="0"
                y="0"
                width="22"
                height="22"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="1.4" cy="1.4" r="1.4" fill="#8ABF76" opacity="0.45" />
              </pattern>
            </defs>
            <rect width="600" height="260" fill="url(#hero-dots)" />

            {/* Edges */}
            {MOCK_EDGES.map((d, i) => (
              <motion.path
                key={i}
                d={d}
                stroke="#3D8A2B"
                strokeWidth={1.8}
                strokeLinecap="round"
                fill="none"
                opacity={0.4}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  delay: 0.9 + i * 0.08,
                  duration: 0.55,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            ))}

            {/* Nodes */}
            {MOCK_NODES.map((n, i) => (
              <motion.g
                key={i}
                transform={`translate(${n.cx}, ${n.cy})`}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.65 + i * 0.09,
                  type: "spring",
                  stiffness: 220,
                  damping: 20,
                }}
              >
                {/* Drop shadow */}
                <rect
                  x="-68"
                  y="-21"
                  width="136"
                  height="42"
                  rx="11"
                  fill="rgba(44,26,14,0.07)"
                  transform="translate(2,3)"
                />
                {/* Card */}
                <rect
                  x="-68"
                  y="-21"
                  width="136"
                  height="42"
                  rx="11"
                  fill={n.fill}
                  stroke={n.stroke}
                  strokeWidth="1.5"
                />
                {/* Step badge */}
                <circle cx="-53" cy="-8" r="9" fill="#3D8A2B" />
                <text
                  x="-53"
                  y="-8"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#F5EFE0"
                  fontSize="8"
                  fontWeight="bold"
                  fontFamily="serif"
                >
                  {n.step}
                </text>
                {/* Label */}
                <text
                  x="10"
                  y="-4"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#2C1A0E"
                  fontSize="11"
                  fontWeight="600"
                  fontFamily="serif"
                >
                  {n.label}
                </text>
                {/* Status pill */}
                <rect
                  x="-22"
                  y="7"
                  width="64"
                  height="10"
                  rx="5"
                  fill={n.stroke}
                  opacity={0.6}
                />
                <text
                  x="10"
                  y="12"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#2C1A0E"
                  fontSize="6.5"
                  fontFamily="sans-serif"
                  opacity={0.7}
                >
                  to do
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
  return (
    <section className="relative overflow-hidden px-6 md:px-12 lg:px-20 pt-20 pb-16">
      {/* Ambient blobs */}
      <div className="absolute top-0 left-1/4 w-[480px] h-[480px] bg-moss-200/25 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-24 right-1/4 w-[320px] h-[320px] bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 w-[360px] h-[360px] bg-lavender-200/15 rounded-full blur-3xl translate-y-1/3 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Text block — centered */}
        <motion.div
          className="text-center"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* Eyebrow */}
          <motion.p
            variants={item}
            className="font-body text-xs uppercase tracking-[0.2em] text-moss-500 mb-5"
          >
            your cozy corner of the internet ✦
          </motion.p>

          {/* H1 */}
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

          {/* Subheadline */}
          <motion.p
            variants={item}
            className="font-body text-lg md:text-xl text-forest/70 max-w-2xl mx-auto mb-10 leading-relaxed text-balance"
          >
            A ruthlessly curated AI tool directory that generates personalized,
            step-by-step canvases to help you{" "}
            <span className="text-forest/90 font-medium">actually get work done</span>.
          </motion.p>

          {/* Single CTA */}
          <motion.div variants={item}>
            <Link href="/login">
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
                Generate your first Roadmap
                <span className="font-body text-sm font-normal text-parchment/70 bg-moss-600/50 px-2.5 py-0.5 rounded-full">
                  Free
                </span>
              </motion.span>
            </Link>
          </motion.div>

          {/* Divider hint */}
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

        {/* Product mockup — full width of max-w-4xl container */}
        <CanvasMockup />
      </div>
    </section>
  );
}
