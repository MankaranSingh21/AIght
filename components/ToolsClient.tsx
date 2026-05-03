"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import ToolCard from "./ToolCard";
import type { ToolCardProps } from "./ToolCard";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ToolsPCBCanvas = dynamic(() => import("./ToolsPCBCanvas"), { ssr: false });

const CATEGORIES = [
  { id: "all",          label: "All tools",    href: null                          },
  { id: "AI CHAT",      label: "AI Chat",      href: "/tools/category/ai-chat"     },
  { id: "DEV TOOLS",    label: "Dev Tools",    href: "/tools/category/dev-tools"   },
  { id: "IMAGE GEN",    label: "Image Gen",    href: "/tools/category/image-gen"   },
  { id: "VIDEO GEN",    label: "Video Gen",    href: "/tools/category/video-gen"   },
  { id: "RESEARCH",     label: "Research",     href: "/tools/category/research"    },
  { id: "PRODUCTIVITY", label: "Productivity", href: "/tools/category/productivity" },
  { id: "AUTOMATION",   label: "Automation",   href: "/tools/category/automation"  },
  { id: "AUDIO",        label: "Audio",        href: "/tools/category/audio"       },
];

type SortOrder = "recent" | "az";
type StatusFilter = "all" | "rising" | "beta";

const WIDE_INDICES = new Set([0, 3, 7, 11, 15, 19, 23, 27, 31]);
function bentoSpan(i: number): number {
  return WIDE_INDICES.has(i) ? 2 : 1;
}

const STATUS_FILTERS: { id: StatusFilter; label: string }[] = [
  { id: "all",    label: "All statuses" },
  { id: "rising", label: "Rising ↑"     },
  { id: "beta",   label: "Beta"         },
];

type Props = {
  tools: ToolCardProps[];
  initialCategory?: string;
};

export default function ToolsClient({ tools, initialCategory = "all" }: Props) {
  const searchParams    = useSearchParams();
  const initialQ        = searchParams.get("q") ?? "";
  const searchRef       = useRef<HTMLInputElement>(null);

  const [inputQuery, setInputQuery]         = useState(initialQ);
  const [query, setQuery]                   = useState(initialQ);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [sort, setSort]                     = useState<SortOrder>("recent");
  const [statusFilter, setStatusFilter]     = useState<StatusFilter>("all");

  useEffect(() => {
    if (initialQ && searchRef.current) searchRef.current.focus();
  }, [initialQ]);

  useEffect(() => {
    const t = setTimeout(() => setQuery(inputQuery), 200);
    return () => clearTimeout(t);
  }, [inputQuery]);

  const filteredAndSortedTools = useMemo(() => {
    const q = query.toLowerCase().trim();
    
    // 1. Filter
    let result = tools.filter((t) => {
      if (activeCategory !== "all" && t.category !== activeCategory) return false;
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.tagline.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    });

    // 2. Sort
    if (sort === "az") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [tools, query, activeCategory, statusFilter, sort]);

  const isEmpty = filteredAndSortedTools.length === 0;

  return (
    <div className="w-full">
      {/* Search — max-width 560px, centered */}
      <div className="relative max-w-[560px] mx-auto mb-7">
        <svg
          width="14" height="14" viewBox="0 0 16 16" fill="none"
          className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none shrink-0"
        >
          <circle cx="7" cy="7" r="5.5" stroke="rgba(245,239,224,0.30)" strokeWidth="1.5" />
          <path d="M11.5 11.5L14 14" stroke="rgba(245,239,224,0.30)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          ref={searchRef}
          type="search"
          placeholder="Search tools, tags, or categories…"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          className="w-full pl-9 pr-12 py-3.5 rounded-md font-sans text-sm text-primary bg-elevated border border-subtle outline-none transition-all focus:border-emphasis focus:ring-4 focus:ring-accent-glow box-border"
        />
        {inputQuery ? (
          <button
            onClick={() => setInputQuery("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-muted font-mono text-sm p-0 hover:text-primary transition-colors"
          >
            ×
          </button>
        ) : (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[11px] text-primary/20 px-1.5 py-0.5 rounded border border-primary/10 leading-relaxed pointer-events-none">
            /
          </span>
        )}
      </div>

      {/* Category filter tabs */}
      <div className="flex flex-wrap gap-2 mb-7">
        {CATEGORIES.map((cat) => {
          const active = activeCategory === cat.id;
          if (!cat.href) {
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "cursor-pointer border-none transition-all",
                  active ? "tag tag-accent" : "tag"
                )}
              >
                {cat.label}
              </button>
            );
          }
          return (
            <a
              key={cat.id}
              href={cat.href}
              className="tag no-underline hover:text-primary transition-colors"
            >
              {cat.label} →
            </a>
          );
        })}
      </div>

      {/* Status filter chips */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <span className="font-mono text-[9px] tracking-widest uppercase text-muted mr-1">
          Status
        </span>
        {STATUS_FILTERS.map((sf) => {
          const active = statusFilter === sf.id;
          return (
            <button
              key={sf.id}
              onClick={() => setStatusFilter(sf.id)}
              className={cn(
                "cursor-pointer border-none transition-all",
                active && sf.id === "rising" && "bg-accent-glow text-accent border-emphasis",
                active && sf.id === "beta" && "bg-warm/10 text-warm border-warm/25",
                active && sf.id === "all" && "tag tag-accent",
                !active && "tag"
              )}
            >
              {sf.label}
            </button>
          );
        })}
      </div>

      {/* Tool count (left) + Sort chips (right) */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <p className="font-mono text-sm text-muted m-0">
          Showing {filteredAndSortedTools.length} tool{filteredAndSortedTools.length !== 1 ? "s" : ""}
        </p>

        <div className="flex gap-2">
          {(["recent", "az"] as SortOrder[]).map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={cn(
                "cursor-pointer border-none transition-all",
                sort === s ? "tag tag-accent" : "tag"
              )}
            >
              {s === "recent" ? "Recently added" : "A–Z"}
            </button>
          ))}
        </div>
      </div>

      {/* Grid or empty state — PCB canvas sits behind the grid */}
      <div className="relative">
        <ToolsPCBCanvas />
        {isEmpty ? (
          <div className="text-center py-24 flex flex-col items-center gap-3">
            <p className="font-serif italic text-lg text-muted max-w-[40ch] leading-relaxed m-0">
              Nothing matching that yet.
              <br />
              The archive grows slowly, on purpose.
            </p>
            {(inputQuery || activeCategory !== "all" || statusFilter !== "all") && (
              <button
                onClick={() => { setInputQuery(""); setActiveCategory("all"); setStatusFilter("all"); }}
                className="font-mono text-sm text-accent bg-transparent border-none cursor-pointer mt-2 hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="tool-bento-grid">
            {filteredAndSortedTools.map((tool, i) => (
              <ToolCard key={tool.slug} {...tool} spanCols={bentoSpan(i)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
