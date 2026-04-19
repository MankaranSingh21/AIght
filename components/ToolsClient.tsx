"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import ToolCard, { type ToolCardProps } from "./ToolCard";

// ── Category pill config ────────────────────────────────────────────────────

const CATEGORIES = [
  { id: "all", label: "All tools" },
  { id: "Research", label: "Research" },
  { id: "AI Chat", label: "AI Chat" },
  { id: "Dev Tools", label: "Dev Tools" },
  { id: "Productivity", label: "Productivity" },
  { id: "Image Gen", label: "Image Gen" },
  { id: "Video Gen", label: "Video Gen" },
];

// ── Main client component ───────────────────────────────────────────────────

type Props = {
  tools: ToolCardProps[];
  initialCategory?: string;
};

export default function ToolsClient({ tools, initialCategory = "all" }: Props) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  const allTags = useMemo(() => {
    const freq = new Map<string, number>();
    tools.forEach((t) => t.tags.forEach((tag) => freq.set(tag, (freq.get(tag) ?? 0) + 1)));
    return [...freq.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 24)
      .map(([tag]) => tag);
  }, [tools]);

  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  function toggleTag(tag: string) {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      next.has(tag) ? next.delete(tag) : next.add(tag);
      return next;
    });
  }

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return tools.filter((t) => {
      if (activeCategory !== "all" && t.category !== activeCategory) return false;
      if (selectedTags.size > 0 && !t.tags.some((tag) => selectedTags.has(tag))) return false;
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.tagline.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    });
  }, [tools, query, activeCategory, selectedTags]);

  const hasFilters = query || activeCategory !== "all" || selectedTags.size > 0;

  function clearAll() {
    setQuery("");
    setActiveCategory("all");
    setSelectedTags(new Set());
  }

  return (
    <div>
      {/* ── Search bar ── */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
        <input
          type="search"
          placeholder="Search tools, tags, or categories…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="
            w-full pl-11 pr-4 py-3.5 rounded-md
            font-sans text-base text-primary placeholder:text-muted
            bg-raised border border-subtle
            focus:outline-none focus:border-emphasis
            transition-colors duration-150
          "
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Category pills ── */}
      <div className="flex flex-wrap gap-2 mb-5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`
              font-mono text-xs uppercase tracking-[0.1em]
              px-4 py-2 rounded-sm border transition-colors duration-150
              ${activeCategory === cat.id
                ? "bg-accent text-inverse border-accent-dim"
                : "bg-panel text-secondary border-subtle hover:border-emphasis hover:text-primary"
              }
            `}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* ── Tag pills ── */}
      <div className="flex flex-wrap gap-2 mb-8">
        {allTags.map((tag) => {
          const active = selectedTags.has(tag);
          return (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`
                font-mono text-xs px-3 py-1.5 rounded-sm border transition-colors duration-150
                ${active
                  ? "bg-accent text-inverse border-accent-dim"
                  : "bg-raised text-muted border-subtle hover:border-emphasis hover:text-secondary"
                }
              `}
            >
              #{tag}
            </button>
          );
        })}
      </div>

      {/* ── Results count + clear ── */}
      <div className="flex items-center justify-between mb-6">
        <p className="font-sans text-sm text-muted">
          <span className="text-primary font-medium">{filtered.length}</span>
          {" "}of {tools.length} tools
        </p>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 font-sans text-xs text-muted hover:text-primary transition-colors duration-150"
          >
            <X className="w-3.5 h-3.5" /> Clear all filters
          </button>
        )}
      </div>

      {/* ── Grid ── */}
      {filtered.length === 0 ? (
        <div className="text-center py-24 space-y-3">
          <p className="font-sans text-2xl font-medium text-muted">
            Nothing here yet.
          </p>
          <p className="font-sans text-sm text-muted">
            Try a different search or filter.
          </p>
          <button
            onClick={clearAll}
            className="font-sans text-sm text-accent hover:text-accent-dim underline underline-offset-4 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((tool) => (
              <motion.div
                key={tool.slug}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <Link href={`/tool/${tool.slug}`} className="block">
                  <ToolCard {...tool} />
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
