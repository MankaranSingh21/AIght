"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { createClient } from "@/utils/supabase/client";

// Lazy-load the canvas so React Flow only ships on client
const HeroDemoCanvas = dynamic(() => import("./HeroDemoCanvas"), {
  ssr: false,
  loading: () => (
    <div className="rounded-3xl border border-moss-200 dark:border-charcoal-700 overflow-hidden shadow-card-hover dark:shadow-card-dark-hover">
      {/* Browser chrome skeleton */}
      <div className="flex items-center gap-2.5 px-4 py-2.5 bg-espresso/[0.04] dark:bg-charcoal-800 border-b border-moss-200 dark:border-charcoal-700">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-300/50" />
          <div className="w-3 h-3 rounded-full bg-amber-300/50" />
          <div className="w-3 h-3 rounded-full bg-moss-300/50" />
        </div>
        <div className="flex-1 mx-3 h-5 bg-moss-100 dark:bg-charcoal-700 rounded-full animate-pulse" />
      </div>
      <div className="h-56 sm:h-72 md:h-80 lg:h-96 bg-parchment dark:bg-charcoal-900 animate-pulse" />
    </div>
  ),
});

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

// ── Hero ───────────────────────────────────────────────────────────────────

export default function Hero() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data: { user } }) => setIsLoggedIn(!!user));
  }, []);

  const ctaHref  = isLoggedIn === true ? "/roadmaps" : "/login";
  const ctaLabel = isLoggedIn === true ? "Go to your Canvas →" : "Generate your first Roadmap";

  return (
    <section className="relative overflow-hidden px-6 md:px-12 lg:px-20 pt-20 pb-16">
      {/* Ambient blobs */}
      <div className="absolute top-0 left-1/4 w-[480px] h-[480px] bg-moss-200/25 dark:bg-moss-900/15 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-24 right-1/4 w-[320px] h-[320px] bg-amber-200/20 dark:bg-amber-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 w-[360px] h-[360px] bg-lavender-200/15 dark:bg-lavender-900/10 rounded-full blur-3xl translate-y-1/3 pointer-events-none" />

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
            your cozy corner of the internet
          </motion.p>

          <motion.h1
            variants={item}
            className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-espresso dark:text-parchment leading-[1.08] mb-6 text-balance"
          >
            Stop drowning in AI spam.{" "}
            <br className="hidden md:block" />
            Build{" "}
            <span className="relative inline-block italic text-moss-600 dark:text-moss-400">
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
            className="font-body text-lg md:text-xl text-forest/70 dark:text-parchment/60 max-w-2xl mx-auto mb-10 leading-relaxed text-balance"
          >
            A ruthlessly curated AI tool directory that generates personalised,
            step-by-step canvases to help you{" "}
            <span className="text-forest/90 dark:text-parchment/90 font-medium">actually get work done</span>.
          </motion.p>

          {/* CTA */}
          <motion.div variants={item} className="flex flex-col items-center gap-3">
            <Link href={ctaHref}>
              <motion.span
                className="
                  inline-flex items-center gap-2.5
                  font-body font-semibold tracking-wide text-lg
                  px-9 py-4 rounded-3xl
                  bg-terracotta text-parchment border border-terracotta/80
                  hover:bg-[#d4694f] shadow-terracotta
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
                  <span className="font-body text-sm font-normal text-parchment/70 bg-[#d4694f]/60 px-2.5 py-0.5 rounded-full">
                    Free
                  </span>
                )}
              </motion.span>
            </Link>
            {isLoggedIn !== true && (
              <motion.p
                key="cta-subtext"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="font-body text-sm text-forest/50 dark:text-parchment/40 leading-relaxed"
              >
                Your first canvas is completely free — no credit card, no catch.
              </motion.p>
            )}
          </motion.div>

          <motion.div
            variants={item}
            className="mt-12 mb-8 flex items-center justify-center gap-3 text-forest/25 dark:text-parchment/20"
          >
            <div className="h-px w-12 bg-current" />
            <span className="font-body text-xs tracking-widest uppercase select-none">
              interactive demo — drag the nodes
            </span>
            <div className="h-px w-12 bg-current" />
          </motion.div>
        </motion.div>

        {/* Interactive React Flow canvas */}
        <HeroDemoCanvas />
      </div>
    </section>
  );
}
