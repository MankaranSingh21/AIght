"use client";

import { useState, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Search, X, Sprout } from "lucide-react";
import ToolCard, { type ToolCardProps } from "./ToolCard";
import { createClient } from "@/utils/supabase/client";
import { createRoadmap, addToolToRoadmap } from "@/app/actions/roadmap";

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

// ── Card with roadmap action overlay ───────────────────────────────────────

function ToolCardWithAction({ tool }: { tool: ToolCardProps }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleBuildRoadmap(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    startTransition(async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push(`/login?next=/tools`);
        return;
      }

      const toastId = toast.loading(`Building roadmap for ${tool.name}…`);
      const roadmapResult = await createRoadmap(`My ${tool.name} Stack`);
      if (roadmapResult.error) {
        toast.error("Couldn't create roadmap", { id: toastId, description: roadmapResult.error });
        return;
      }

      const addResult = await addToolToRoadmap(
        {
          slug:     tool.slug,
          name:     tool.name,
          emoji:    tool.emoji,
          url:      tool.url,
          category: tool.category,
          accent:   (tool.accentColor as "moss" | "amber" | "lavender") ?? "moss",
        },
        roadmapResult.id!
      );

      if (addResult?.error) {
        toast.error("Couldn't add tool", { id: toastId, description: addResult.error });
        return;
      }

      toast.success(`${tool.name} roadmap ready ✦`, { id: toastId });
      router.push(`/roadmaps/${roadmapResult.id}`);
    });
  }

  return (
    <div className="relative group/card">
      <Link href={`/tool/${tool.slug}`} className="block">
        <ToolCard {...tool} />
      </Link>

      {/* Build Roadmap quick-action */}
      <div className="absolute bottom-[4.5rem] right-3 opacity-0 group-hover/card:opacity-100 transition-all duration-200 translate-y-1 group-hover/card:translate-y-0">
        <button
          onClick={handleBuildRoadmap}
          disabled={isPending}
          className="
            flex items-center gap-1.5 font-body text-xs font-semibold
            px-3 py-1.5 rounded-xl shadow-card-hover
            bg-espresso text-parchment
            hover:bg-moss-600 disabled:opacity-50
            transition-colors duration-150 whitespace-nowrap
          "
        >
          <Sprout className="w-3.5 h-3.5 flex-shrink-0" />
          {isPending ? "Building…" : "Build Roadmap"}
        </button>
      </div>
    </div>
  );
}

// ── Main client component ───────────────────────────────────────────────────

type Props = {
  tools: ToolCardProps[];
  initialCategory?: string;
};

export default function ToolsClient({ tools, initialCategory = "all" }: Props) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  // Collect unique tags from all tools, sorted by frequency
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
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-forest/40 pointer-events-none" />
        <input
          type="search"
          placeholder="Search tools, tags, or categories…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="
            w-full pl-11 pr-4 py-3.5 rounded-2xl
            font-body text-base text-espresso placeholder:text-forest/35
            bg-parchment border border-moss-200
            focus:outline-none focus:border-moss-400 focus:ring-2 focus:ring-moss-200/50
            transition-all duration-150
          "
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-forest/40 hover:text-forest transition-colors"
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
              font-body text-xs font-semibold uppercase tracking-widest
              px-4 py-2 rounded-full border transition-all duration-150
              ${activeCategory === cat.id
                ? "bg-moss-500 text-parchment border-moss-600 shadow-moss"
                : "bg-parchment text-forest/70 border-moss-200 hover:border-moss-400 hover:text-forest"
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
                font-body text-2xs px-3 py-1.5 rounded-full border transition-all duration-150
                ${active
                  ? "bg-amber-400 text-espresso border-amber-500"
                  : "bg-parchment text-forest/60 border-moss-100 hover:border-moss-300 hover:text-forest"
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
        <p className="font-body text-sm text-forest/50">
          <span className="text-espresso font-semibold">{filtered.length}</span>
          {" "}of {tools.length} tools
        </p>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 font-body text-xs text-forest/50 hover:text-forest transition-colors duration-150"
          >
            <X className="w-3.5 h-3.5" /> Clear all filters
          </button>
        )}
      </div>

      {/* ── Grid ── */}
      {filtered.length === 0 ? (
        <div className="text-center py-24 space-y-3">
          <p className="font-serif text-2xl font-semibold text-espresso/40">
            Nothing here yet.
          </p>
          <p className="font-body text-sm text-forest/40">
            Try a different search or filter. ✦
          </p>
          <button
            onClick={clearAll}
            className="font-body text-sm text-moss-500 hover:text-moss-700 underline underline-offset-4 transition-colors"
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
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 240, damping: 26 }}
              >
                <ToolCardWithAction tool={tool} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
