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

const accentMap: Record<string, { badge: string; dot: string }> = {
  moss:     { badge: "bg-accent text-inverse",   dot: "bg-accent" },
  amber:    { badge: "bg-warm text-inverse",      dot: "bg-warm" },
  lavender: { badge: "bg-accent text-inverse",    dot: "bg-accent" },
  sand:     { badge: "bg-warm text-inverse",      dot: "bg-warm" },
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
      className="relative flex flex-col overflow-hidden rounded-lg border border-subtle bg-panel cursor-pointer"
      whileHover={{
        y: -2,
        transition: { duration: 0.2, ease: "easeOut" },
      }}
      whileTap={{ scale: 0.99 }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Screenshot / initials hero */}
      <div className="relative overflow-hidden h-36 bg-raised flex items-center justify-center">
        {showScreenshot ? (
          <Image
            src={getMicrolinkUrl(url!)}
            alt={`${name} website screenshot`}
            fill
            unoptimized
            className={`object-cover object-top transition-opacity duration-500 ${imgLoaded ? "opacity-90" : "opacity-0"}`}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={`w-14 h-14 rounded-lg ${accent.badge} flex items-center justify-center select-none`}>
            <span className="font-mono text-xl font-medium leading-none">
              {toolInitials(name)}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-6 space-y-3 flex-1">
        <span className={`inline-block font-mono text-xs uppercase tracking-[0.1em] px-2.5 py-1 rounded-sm ${accent.badge}`}>
          {category}
        </span>

        <h3 className="font-sans text-xl font-medium text-primary leading-snug line-clamp-2">
          {name}
        </h3>

        <p className="font-sans text-base text-secondary leading-relaxed line-clamp-2">
          {tagline}
        </p>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-6 pb-4 flex items-center gap-2">
        <span className={`inline-block w-2 h-2 rounded-full ${accent.dot}`} />
        <span className="font-mono text-xs text-muted uppercase tracking-widest">
          Live
        </span>
      </div>
    </motion.div>
  );
}
