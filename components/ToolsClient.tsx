"use client";

import { useState, useMemo, useEffect } from "react";
import ToolCard from "./ToolCard";
import type { ToolCardProps } from "./ToolCard";

const CATEGORIES = [
  { id: "all",          label: "All tools"    },
  { id: "Research",     label: "Research"     },
  { id: "AI Chat",      label: "AI Chat"      },
  { id: "Dev Tools",    label: "Dev Tools"    },
  { id: "Productivity", label: "Productivity" },
  { id: "Image Gen",    label: "Image Gen"    },
  { id: "Video Gen",    label: "Video Gen"    },
];

type SortOrder = "recent" | "az";

type Props = {
  tools: ToolCardProps[];
  initialCategory?: string;
};

export default function ToolsClient({ tools, initialCategory = "all" }: Props) {
  const [inputQuery, setInputQuery]         = useState("");
  const [query, setQuery]                   = useState("");
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [sort, setSort]                     = useState<SortOrder>("recent");

  // Debounce search 200ms
  useEffect(() => {
    const t = setTimeout(() => setQuery(inputQuery), 200);
    return () => clearTimeout(t);
  }, [inputQuery]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return tools.filter((t) => {
      if (activeCategory !== "all" && t.category !== activeCategory) return false;
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.tagline.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    });
  }, [tools, query, activeCategory]);

  const sorted = useMemo(() => {
    if (sort === "az") return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    return filtered;
  }, [filtered, sort]);

  const isEmpty = sorted.length === 0;

  return (
    <div>

      {/* Search — max-width 560px, centered */}
      <div style={{ maxWidth: 560, margin: "0 auto 28px", position: "relative" }}>
        <input
          type="search"
          placeholder="Search tools, tags, or categories…"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          style={{
            width: "100%",
            paddingLeft: 16,
            paddingRight: inputQuery ? 40 : 16,
            paddingTop: 12,
            paddingBottom: 12,
            borderRadius: "var(--radius-md)",
            fontFamily: "var(--font-ui)",
            fontSize: "var(--text-sm)",
            color: "var(--text-primary)",
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-default)",
            outline: "none",
            transition: "border-color 150ms ease",
            boxSizing: "border-box",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--border-emphasis)")}
          onBlur={(e)  => (e.currentTarget.style.borderColor = "var(--border-default)")}
        />
        {inputQuery && (
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

      {/* Grid or empty state */}
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
          {(inputQuery || activeCategory !== "all") && (
            <button
              onClick={() => { setInputQuery(""); setActiveCategory("all"); }}
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
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "var(--space-6)",
          }}
        >
          {sorted.map((tool) => (
            <ToolCard key={tool.slug} {...tool} />
          ))}
        </div>
      )}

    </div>
  );
}
