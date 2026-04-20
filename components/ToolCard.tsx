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
  url?: string | null;
};

function getMicrolinkUrl(url: string): string {
  return `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&embed=screenshot.url`;
}

export default function ToolCard({
  slug: _slug,
  name,
  tagline,
  category,
  tags,
  url,
}: ToolCardProps) {
  const [screenshotError, setScreenshotError] = useState(false);
  const hasUrl = !!url;

  return (
    <motion.div
      className="group relative flex flex-col overflow-hidden rounded-lg border border-subtle bg-panel cursor-pointer transition-[border-color] duration-200 hover:[border-color:var(--border-emphasis)]"
      whileHover={{ y: -2, transition: { duration: 0.2, ease: "easeOut" } }}
      whileTap={{ scale: 0.99 }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Media — screenshot with category placeholder fallback */}
      <div
        className="relative shrink-0 overflow-hidden group-hover:brightness-105 transition-[filter] duration-200"
        style={{
          height: 140,
          borderRadius: "var(--radius-lg) var(--radius-lg) 0 0",
          background: "var(--bg-elevated)",
        }}
      >
        {hasUrl && !screenshotError ? (
          <Image
            src={getMicrolinkUrl(url!)}
            alt={`${name} screenshot`}
            fill
            className="object-cover"
            onError={() => setScreenshotError(true)}
            unoptimized
          />
        ) : (
          <span
            className="absolute inset-0 flex items-center justify-center font-mono font-medium select-none"
            style={{ fontSize: "10rem", color: "var(--accent-primary)", opacity: 0.06, lineHeight: 1 }}
            aria-hidden="true"
          >
            {category}
          </span>
        )}
        <span
          className="absolute bottom-3 left-4 font-mono text-xs uppercase tracking-[0.1em]"
          style={{ color: "var(--text-muted)", position: "absolute", zIndex: 1 }}
        >
          {category}
        </span>
      </div>

      {/* Body — flex-1 keeps all cards equal height within the grid row */}
      <div className="flex flex-col flex-1 p-6 gap-3">
        <h3
          className="font-sans font-medium leading-snug line-clamp-2"
          style={{ fontSize: "var(--text-xl)", color: "var(--text-primary)" }}
        >
          {name}
        </h3>
        <p
          className="font-sans leading-relaxed line-clamp-2 flex-1"
          style={{ fontSize: "var(--text-base)", color: "var(--text-secondary)" }}
        >
          {tagline}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {tags.slice(0, 4).map((tag) => (
            <span key={tag} className="tag">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Live badge */}
      <div className="px-6 pb-5 flex items-center gap-2">
        <span
          className="shrink-0 w-2 h-2 rounded-full"
          style={{ background: "var(--accent-primary)" }}
        />
        <span
          className="font-mono uppercase tracking-widest"
          style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}
        >
          Live
        </span>
      </div>
    </motion.div>
  );
}
