"use client";

import { useEffect, useState } from "react";
import { motion, type Variants, AnimatePresence } from "framer-motion";
import Link from "next/link";
import ToolCard, { type ToolCardProps } from "./ToolCard";
import { createClient } from "@/utils/supabase/client";

const carouselVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const cardSlide: Variants = {
  hidden: { x: 28, opacity: 0 },
  show: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 210, damping: 28 },
  },
};

export default function TeaserCarousel({ tools }: { tools: ToolCardProps[] }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [pendingTool, setPendingTool] = useState<ToolCardProps | null>(null);

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data: { user } }) => setIsLoggedIn(!!user));
  }, []);

  if (tools.length === 0) return null;

  return (
    <>
      <motion.div
        className="flex gap-5 overflow-x-auto pt-4 pb-8 px-6 md:px-12 lg:px-20 snap-x snap-mandatory scrollbar-hide"
        variants={carouselVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {tools.map((tool) => (
          <motion.div
            key={tool.slug}
            variants={cardSlide}
            className="flex-shrink-0 w-[272px] snap-start"
          >
            {isLoggedIn ? (
              <Link href={`/tool/${tool.slug}`} className="block">
                <ToolCard {...tool} />
              </Link>
            ) : (
              <button
                className="block w-full text-left"
                onClick={() => setPendingTool(tool)}
              >
                <ToolCard {...tool} />
              </button>
            )}
          </motion.div>
        ))}
        <div className="flex-shrink-0 w-6 md:w-12 lg:w-20" aria-hidden />
      </motion.div>

      {/* Auth-gate modal */}
      <AnimatePresence>
        {pendingTool && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPendingTool(null)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-espresso/30 backdrop-blur-sm" />

            {/* Modal card */}
            <motion.div
              className="relative z-10 max-w-sm w-full bg-parchment rounded-3xl border border-moss-200 shadow-card-hover p-8 text-center space-y-5"
              initial={{ scale: 0.88, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 16 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-14 h-14 rounded-2xl bg-moss-100 dark:bg-moss-900/30 flex items-center justify-center mx-auto">
                <span className="font-display text-xl font-bold text-moss-700 dark:text-moss-300">
                  {pendingTool.name.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-xl font-bold text-espresso">
                  Add {pendingTool.name} to your canvas
                </h3>
                <p className="font-body text-sm text-forest/70 leading-relaxed">
                  Log in to add{" "}
                  <span className="font-semibold text-forest/90">{pendingTool.name}</span>{" "}
                  to your visual roadmap. Your first canvas is completely free.
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-1">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 font-body font-semibold tracking-wide text-base px-7 py-3 rounded-2xl bg-terracotta text-parchment border border-terracotta/80 hover:bg-[#d4694f] transition-colors duration-150"
                >
                  Log in — it&rsquo;s free
                </Link>
                <button
                  className="font-body text-sm text-forest/50 hover:text-forest/70 transition-colors duration-150"
                  onClick={() => setPendingTool(null)}
                >
                  Keep browsing
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
