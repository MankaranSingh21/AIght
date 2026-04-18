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
  emoji?: string;
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
    bg: "bg-moss-100 dark:bg-moss-900/30",
    badge: "bg-moss-500 text-parchment",
    tag: "bg-moss-200 dark:bg-moss-900/50 text-moss-800 dark:text-moss-300",
    glow: "hover:shadow-moss",
    dot: "bg-moss-400",
  },
  amber: {
    bg: "bg-amber-100 dark:bg-amber-900/30",
    badge: "bg-amber-400 text-espresso",
    tag: "bg-amber-200 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300",
    glow: "hover:shadow-amber",
    dot: "bg-amber-400",
  },
  lavender: {
    bg: "bg-lavender-100 dark:bg-lavender-900/30",
    badge: "bg-lavender-400 text-parchment",
    tag: "bg-lavender-200 dark:bg-lavender-900/50 text-lavender-800 dark:text-lavender-300",
    glow: "hover:shadow-card-hover dark:hover:shadow-card-dark-hover",
    dot: "bg-lavender-400",
  },
  sand: {
    bg: "bg-amber-50 dark:bg-amber-900/20",
    badge: "bg-amber-200 text-espresso",
    tag: "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300",
    glow: "hover:shadow-amber",
    dot: "bg-amber-300",
  },
};

function getMicrolinkUrl(toolUrl: string): string {
  return `https://api.microlink.io/?url=${encodeURIComponent(toolUrl)}&screenshot=true&meta=false&embed=screenshot.url`;
}

function toolInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export default function ToolCard({
  slug: _slug,
  name,
  tagline,
  category,
  tags,
  url,
  accentColor = "moss",
}: ToolCardProps) {
  const [imgError, setImgError]   = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const accent = accentMap[accentColor ?? "moss"] ?? accentMap["moss"];

  const showScreenshot = !!url && !imgError;

  return (
    <motion.div
      className={`
        relative flex flex-col overflow-hidden rounded-3xl border border-moss-200/60 dark:border-charcoal-700
        bg-parchment dark:bg-charcoal-800 shadow-card dark:shadow-card-dark cursor-pointer
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
      <div className={`relative overflow-hidden h-36 ${accent.bg} flex items-center justify-center`}>
        {showScreenshot ? (
          <>
            {!imgLoaded && (
              <div className="absolute inset-0 animate-pulse">
                <div className={`w-full h-full ${accent.bg}`} />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-parchment/30 dark:via-charcoal-700/30 to-transparent animate-[shimmer_1.5s_infinite]" />
              </div>
            )}
            <Image
              src={getMicrolinkUrl(url!)}
              alt={`${name} website screenshot`}
              fill
              unoptimized
              className={`object-cover object-top transition-opacity duration-500 ${imgLoaded ? "opacity-90" : "opacity-0"}`}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
            />
          </>
        ) : (
          <div className={`w-14 h-14 rounded-2xl ${accent.badge} flex items-center justify-center select-none`}>
            <span className="font-display text-xl font-bold leading-none">
              {toolInitials(name)}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 space-y-3 flex-1">
        <span className={`inline-block text-2xs font-body font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full ${accent.badge}`}>
          {category}
        </span>

        <h3 className="font-serif text-xl font-bold text-espresso dark:text-parchment leading-snug line-clamp-2">
          {name}
        </h3>

        <p className="font-body text-sm text-forest/80 dark:text-parchment/60 leading-relaxed line-clamp-2">
          {tagline}
        </p>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {tags.map((tag) => (
            <span key={tag} className="text-2xs font-body px-2.5 py-1 rounded-full bg-sage/15 text-sage dark:bg-sage/10 dark:text-sage">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-5 pb-4 flex items-center gap-2">
        <motion.span
          className={`inline-block w-2 h-2 rounded-full ${accent.dot}`}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <span className="font-body text-2xs text-forest/60 dark:text-parchment/40 uppercase tracking-widest">
          Live
        </span>
      </div>
    </motion.div>
  );
}
