"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";

export type ToolCardProps = {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  tags: string[];
  emoji: string;
  url?: string | null;
  accentColor?: string;
};

const accentMap: Record<string, {
  bg: string;
  badge: string;
  tag: string;
  glow: string;
  dot: string;
}> = {
  moss: {
    bg: "bg-moss-100",
    badge: "bg-moss-500 text-parchment",
    tag: "bg-moss-200 text-moss-800",
    glow: "hover:shadow-moss",
    dot: "bg-moss-400",
  },
  amber: {
    bg: "bg-amber-100",
    badge: "bg-amber-400 text-espresso",
    tag: "bg-amber-200 text-amber-800",
    glow: "hover:shadow-amber",
    dot: "bg-amber-400",
  },
  lavender: {
    bg: "bg-lavender-100",
    badge: "bg-lavender-400 text-parchment",
    tag: "bg-lavender-200 text-lavender-800",
    glow: "hover:shadow-card-hover",
    dot: "bg-lavender-400",
  },
  sand: {
    bg: "bg-amber-50",
    badge: "bg-amber-200 text-espresso",
    tag: "bg-amber-100 text-amber-800",
    glow: "hover:shadow-amber",
    dot: "bg-amber-300",
  },
};

/** Returns the Microlink API URL that embeds a live screenshot directly. */
function getMicrolinkUrl(toolUrl: string): string {
  return `https://api.microlink.io/?url=${encodeURIComponent(toolUrl)}&screenshot=true&meta=false&embed=screenshot.url`;
}

export default function ToolCard({
  slug: _slug,
  name,
  tagline,
  category,
  tags,
  emoji,
  url,
  accentColor = "moss",
}: ToolCardProps) {
  const [imgError,  setImgError]  = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const accent = accentMap[accentColor ?? "moss"] ?? accentMap["moss"];

  // Show the screenshot only when we have a URL and it hasn't errored out.
  const showScreenshot = !!url && !imgError;

  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-3xl border border-moss-100
        bg-parchment shadow-card cursor-pointer
        transition-shadow duration-300 ${accent.glow}
      `}
      whileHover={{
        y: -6,
        scale: 1.015,
        transition: { type: "spring", stiffness: 260, damping: 20 },
      }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Screenshot / emoji hero */}
      <div
        className={`
          relative overflow-hidden h-36
          ${accent.bg} flex items-center justify-center
        `}
      >
        {showScreenshot ? (
          <>
            {/* Shimmer skeleton while image loads */}
            {!imgLoaded && (
              <div className="absolute inset-0 animate-pulse">
                <div className={`w-full h-full ${accent.bg}`} />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-parchment/30 to-transparent animate-[shimmer_1.5s_infinite]" />
              </div>
            )}
            <Image
              src={getMicrolinkUrl(url!)}
              alt={`${name} website screenshot`}
              fill
              unoptimized
              className={`
                object-cover object-top
                transition-opacity duration-500
                ${imgLoaded ? "opacity-90" : "opacity-0"}
              `}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
            />
          </>
        ) : (
          <motion.span
            className="text-5xl leading-none select-none"
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            aria-label={emoji}
          >
            {emoji}
          </motion.span>
        )}
      </div>

      {/* Body */}
      <div className="p-5 space-y-3">
        {/* Category badge */}
        <span className={`inline-block text-2xs font-body font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full ${accent.badge}`}>
          {category}
        </span>

        {/* Name */}
        <h3 className="font-serif text-xl font-bold text-espresso leading-snug">
          {name}
        </h3>

        {/* Tagline */}
        <p className="font-body text-sm text-forest/80 leading-relaxed">
          {tagline}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className={`text-2xs font-body px-2.5 py-1 rounded-full ${accent.tag}`}
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom bar — breathing dot */}
      <div className="px-5 pb-4 flex items-center gap-2">
        <motion.span
          className={`inline-block w-2 h-2 rounded-full ${accent.dot}`}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <span className="font-body text-2xs text-forest/60 uppercase tracking-widest">
          Live
        </span>
      </div>
    </motion.div>
  );
}
