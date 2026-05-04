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
  { id: "all",          label: "All tools"    },
  { id: "AI CHAT",      label: "AI Chat"      },
  { id: "DEV TOOLS",    label: "Dev Tools"    },
  { id: "IMAGE GEN",    label: "Image Gen"    },
  { id: "VIDEO GEN",    label: "Video Gen"    },
  { id: "RESEARCH",     label: "Research"     },
  { id: "PRODUCTIVITY", label: "Productivity" },
  { id: "AUTOMATION",   label: "Automation"   },
  { id: "AUDIO",        label: "Audio"        },
];

const DIFFICULTY_FILTERS = ["all", "Beginner", "Intermediate", "Advanced"];
const PRICING_FILTERS = ["all", "Free", "Freemium", "Paid"];
const RISK_FILTERS = ["all", "Low", "Medium", "High"];

type SortOrder = "recent" | "az" | "score";

const WIDE_INDICES = new Set([0, 3, 7, 11, 15, 19, 23, 27, 31]);
function bentoSpan(i: number): number {
  return WIDE_INDICES.has(i) ? 2 : 1;
}

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
  const [difficulty, setDifficulty]         = useState("all");
  const [pricing, setPricing]               = useState("all");
  const [risk, setRisk]                     = useState("all");
  const [isOpenSource, setIsOpenSource]     = useState(false);
  const [sort, setSort]                     = useState<SortOrder>("recent");

  useEffect(() => {
    if (initialQ && searchRef.current) searchRef.current.focus();
  }, [initialQ]);

  useEffect(() => {
    const t = setTimeout(() => setQuery(inputQuery), 200);
    return () => clearTimeout(t);
  }, [inputQuery]);

  const filteredAndSortedTools = useMemo(() => {
    const q = query.toLowerCase().trim();
    
    let result = tools.filter((t) => {
      if (activeCategory !== "all" && t.category !== activeCategory) return false;
      if (difficulty !== "all" && t.difficulty !== difficulty) return false;
      if (pricing !== "all" && t.pricing !== pricing) return false;
      if (risk !== "all" && t.risk_level !== risk) return false;
      if (isOpenSource && !t.is_open_source) return false;
      
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.tagline.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    });

    if (sort === "az") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "score") {
      result = [...result].sort((a, b) => {
        const scoreA = (a.utility_score || 0) + (a.privacy_score || 0) + (a.speed_score || 0) + (a.cost_score || 0) + (a.transparency_score || 0);
        const scoreB = (b.utility_score || 0) + (b.privacy_score || 0) + (b.speed_score || 0) + (b.cost_score || 0) + (b.transparency_score || 0);
        return scoreB - scoreA;
      });
    }

    return result;
  }, [tools, query, activeCategory, difficulty, pricing, risk, isOpenSource, sort]);

  const isEmpty = filteredAndSortedTools.length === 0;

  return (
    <div className="w-full">
      <div className="relative max-w-[560px] mx-auto mb-8">
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
        {inputQuery && (
          <button
            onClick={() => setInputQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-muted font-mono text-sm p-0 hover:text-primary"
          >
            ×
          </button>
        )}
      </div>

      <div className="flex flex-col gap-6 mb-10 bg-surface/30 p-6 rounded-xl border border-primary/5">
        <div className="flex flex-col gap-3">
          <span className="font-mono text-[10px] tracking-widest uppercase text-muted">Category</span>
          <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "cursor-pointer border-none transition-all whitespace-nowrap",
                  activeCategory === cat.id ? "tag tag-accent" : "tag"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] tracking-widest uppercase text-muted">Difficulty</span>
            <select 
              value={difficulty} 
              onChange={e => setDifficulty(e.target.value)}
              className="bg-elevated border border-subtle rounded-md px-3 py-2 font-sans text-xs text-primary outline-none focus:border-emphasis"
            >
              {DIFFICULTY_FILTERS.map(d => <option key={d} value={d}>{d === 'all' ? 'All' : d}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] tracking-widest uppercase text-muted">Pricing</span>
            <select 
              value={pricing} 
              onChange={e => setPricing(e.target.value)}
              className="bg-elevated border border-subtle rounded-md px-3 py-2 font-sans text-xs text-primary outline-none focus:border-emphasis"
            >
              {PRICING_FILTERS.map(p => <option key={p} value={p}>{p === 'all' ? 'All' : p}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] tracking-widest uppercase text-muted">Risk Level</span>
            <select 
              value={risk} 
              onChange={e => setRisk(e.target.value)}
              className="bg-elevated border border-subtle rounded-md px-3 py-2 font-sans text-xs text-primary outline-none focus:border-emphasis"
            >
              {RISK_FILTERS.map(r => <option key={r} value={r}>{r === 'all' ? 'All' : r}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] tracking-widest uppercase text-muted">Licensing</span>
            <button
              onClick={() => setIsOpenSource(!isOpenSource)}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-md border transition-all text-xs font-sans",
                isOpenSource ? "bg-accent-glow text-accent border-emphasis" : "bg-elevated text-secondary border-subtle"
              )}
            >
              Open Source Only
              <div className={cn("w-3 h-3 rounded-full border", isOpenSource ? "bg-accent border-accent" : "border-muted")} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <p className="font-mono text-sm text-muted m-0">
          Showing {filteredAndSortedTools.length} tool{filteredAndSortedTools.length !== 1 ? "s" : ""}
        </p>

        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted">Sort by</span>
          <div className="flex gap-1.5">
            {[
              { id: 'recent', label: 'Recent' },
              { id: 'score', label: 'AIght Score' },
              { id: 'az', label: 'A-Z' }
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setSort(s.id as SortOrder)}
                className={cn(
                  "cursor-pointer border-none transition-all px-3 py-1 rounded-md text-[11px] font-sans font-medium",
                  sort === s.id ? "bg-accent text-page" : "bg-primary/5 text-secondary hover:bg-primary/10"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative min-h-[400px]">
        <ToolsPCBCanvas />
        {isEmpty ? (
          <div className="text-center py-32 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center text-muted mb-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <p className="font-serif italic text-xl text-muted max-w-[40ch] leading-relaxed m-0">
              No signal found for those parameters.
              <br />
              Try broadening your search.
            </p>
            <button
              onClick={() => { 
                setInputQuery(""); 
                setActiveCategory("all"); 
                setDifficulty("all"); 
                setPricing("all"); 
                setRisk("all"); 
                setIsOpenSource(false);
              }}
              className="font-mono text-xs text-accent uppercase tracking-widest hover:underline"
            >
              Reset all filters
            </button>
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
