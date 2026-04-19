"use client";

import { motion } from "framer-motion";

export type ToolCardProps = {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  tags: string[];
  url?: string | null;
};

export default function ToolCard({
  slug: _slug,
  name,
  tagline,
  category,
  tags,
}: ToolCardProps) {
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
      {/* Category header — watermark pattern */}
      <div
        className="relative overflow-hidden h-[140px] flex items-center justify-center"
        style={{ background: "var(--bg-elevated)" }}
      >
        <span
          aria-hidden="true"
          className="absolute font-mono font-medium select-none pointer-events-none whitespace-nowrap"
          style={{
            fontSize: "10rem",
            color: "var(--accent-primary)",
            opacity: 0.06,
            lineHeight: 1,
          }}
        >
          {category}
        </span>
        <span className="relative z-10 font-mono text-xs uppercase tracking-[0.1em] text-muted">
          {category}
        </span>
      </div>

      {/* Body */}
      <div className="p-6 space-y-3 flex-1">
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
        <span className="inline-block w-2 h-2 rounded-full bg-accent" />
        <span className="font-mono text-xs text-muted uppercase tracking-widest">
          Live
        </span>
      </div>
    </motion.div>
  );
}
