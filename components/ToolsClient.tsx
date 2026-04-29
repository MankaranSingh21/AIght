"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import ToolCard from "./ToolCard";
import type { ToolCardProps } from "./ToolCard";

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

type SortOrder = "recent" | "az";
type StatusFilter = "all" | "rising" | "beta";

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

  // Auto-focus search input when arriving from navbar search
  useEffect(() => {
    if (initialQ && searchRef.current) searchRef.current.focus();
  }, [initialQ]);

  // Debounce search 200ms
  useEffect(() => {
    const t = setTimeout(() => setQuery(inputQuery), 200);
    return () => clearTimeout(t);
  }, [inputQuery]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return tools.filter((t) => {
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
  }, [tools, query, activeCategory, statusFilter]);

  const sorted = useMemo(() => {
    if (sort === "az") return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    return filtered;
  }, [filtered, sort]);

  const isEmpty = sorted.length === 0;

  return (
    <div>

      {/* Search — max-width 560px, centered */}
      <div style={{ maxWidth: 560, margin: "0 auto 28px", position: "relative" }}>
        <svg
          width="14" height="14" viewBox="0 0 16 16" fill="none"
          style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", flexShrink: 0 }}
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
          style={{
            width: "100%",
            paddingLeft: 36,
            paddingRight: inputQuery ? 40 : 52,
            paddingTop: 13,
            paddingBottom: 13,
            borderRadius: "var(--radius-md)",
            fontFamily: "var(--font-ui)",
            fontSize: "var(--text-sm)",
            color: "var(--text-primary)",
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-default)",
            outline: "none",
            transition: "border-color 150ms ease, box-shadow 150ms ease",
            boxSizing: "border-box",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--border-emphasis)";
            e.currentTarget.style.boxShadow = "0 0 0 3px var(--accent-primary-glow)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--border-default)";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
        {inputQuery ? (
          <button
            onClick={() => setInputQuery("")}
            aria-label="Clear search"
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
              fontFamily: "var(--font-mono)",
              fontSize: 14,
              lineHeight: 1,
              padding: 0,
            }}
          >
            ×
          </button>
        ) : (
          <span style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "rgba(245,239,224,0.18)",
            padding: "2px 6px",
            borderRadius: 4,
            border: "1px solid rgba(245,239,224,0.10)",
            lineHeight: 1.4,
            pointerEvents: "none",
          }}>
            /
          </span>
        )}
      </div>

      {/* Category filter tabs */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
        {CATEGORIES.map((cat) => {
          const active = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={active ? "tag tag-accent" : "tag"}
              style={{ cursor: "pointer", border: "none" }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Status filter chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20, alignItems: "center" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--text-muted)", marginRight: 4 }}>
          Status
        </span>
        {STATUS_FILTERS.map((sf) => {
          const active = statusFilter === sf.id;
          let activeStyle = {};
          if (active && sf.id === "rising") activeStyle = { background: "var(--accent-primary-glow)", color: "var(--accent-primary)", borderColor: "var(--border-emphasis)" };
          else if (active && sf.id === "beta") activeStyle = { background: "rgba(244,171,31,0.10)", color: "var(--accent-warm)", borderColor: "rgba(244,171,31,0.25)" };
          else if (active) activeStyle = { background: "var(--accent-primary-glow)", color: "var(--accent-primary)", borderColor: "var(--border-emphasis)" };
          return (
            <button
              key={sf.id}
              onClick={() => setStatusFilter(sf.id)}
              className={active ? "tag tag-accent" : "tag"}
              style={{ cursor: "pointer", border: "none", ...(active ? activeStyle : {}) }}
            >
              {sf.label}
            </button>
          );
        })}
      </div>

      {/* Tool count (left) + Sort chips (right) */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-sm)",
            color: "var(--text-muted)",
            margin: 0,
          }}
        >
          Showing {sorted.length} tool{sorted.length !== 1 ? "s" : ""}
        </p>

        <div style={{ display: "flex", gap: 8 }}>
          {(["recent", "az"] as SortOrder[]).map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={sort === s ? "tag tag-accent" : "tag"}
              style={{ cursor: "pointer", border: "none" }}
            >
              {s === "recent" ? "Recently added" : "A–Z"}
            </button>
          ))}
        </div>
      </div>

      {/* Grid or empty state — PCB canvas sits behind the grid */}
      <div style={{ position: "relative" }}>
        <ToolsPCBCanvas />
      {isEmpty ? (
        <div
          style={{
            textAlign: "center",
            padding: "96px 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-editorial)",
              fontStyle: "italic",
              fontSize: "var(--text-lg)",
              color: "var(--text-muted)",
              maxWidth: "40ch",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            Nothing matching that yet.
            <br />
            The archive grows slowly, on purpose.
          </p>
          {(inputQuery || activeCategory !== "all" || statusFilter !== "all") && (
            <button
              onClick={() => { setInputQuery(""); setActiveCategory("all"); setStatusFilter("all"); }}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-sm)",
                color: "var(--accent-primary)",
                background: "none",
                border: "none",
                cursor: "pointer",
                marginTop: 8,
              }}
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "var(--space-3)",
          }}
        >
          {sorted.map((tool) => (
            <ToolCard key={tool.slug} {...tool} />
          ))}
        </div>
      )}
      </div>{/* end PCB wrapper */}

    </div>
  );
}
