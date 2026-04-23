"use client";

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import dynamic from "next/dynamic";
import type { ToolCardProps } from "./ToolCard";

const ToolGrid3D = dynamic(() => import("./ToolGrid3D"), { ssr: false });

const CATEGORIES = [
  { id: "all",          label: "All tools"    },
  { id: "Research",     label: "Research"     },
  { id: "AI Chat",      label: "AI Chat"      },
  { id: "Dev Tools",    label: "Dev Tools"    },
  { id: "Productivity", label: "Productivity" },
  { id: "Image Gen",    label: "Image Gen"    },
  { id: "Video Gen",    label: "Video Gen"    },
];

type Props = {
  tools: ToolCardProps[];
  initialCategory?: string;
};

export default function ToolsClient({ tools, initialCategory = "all" }: Props) {
  const [query, setQuery]               = useState("");
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  const allTags = useMemo(() => {
    const freq = new Map<string, number>();
    tools.forEach((t) => t.tags.forEach((tag) => freq.set(tag, (freq.get(tag) ?? 0) + 1)));
    return [...freq.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 24)
      .map(([tag]) => tag);
  }, [tools]);

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
      {/* Search bar */}
      <div style={{ position: 'relative', marginBottom: 20 }}>
        <Search style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: 'rgba(245,239,224,0.30)', pointerEvents: 'none' }} />
        <input
          type="search"
          placeholder="Search tools, tags, or categories…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: '100%',
            paddingLeft: 40,
            paddingRight: 40,
            paddingTop: 12,
            paddingBottom: 12,
            borderRadius: 10,
            fontFamily: 'var(--font-ui)',
            fontSize: 14,
            color: '#F5EFE0',
            background: 'rgba(255,250,240,0.04)',
            border: '1px solid rgba(245,239,224,0.09)',
            outline: 'none',
            transition: 'border-color 150ms ease',
            boxSizing: 'border-box',
          }}
          onFocus={e => (e.currentTarget.style.borderColor = 'rgba(170,255,77,0.30)')}
          onBlur={e => (e.currentTarget.style.borderColor = 'rgba(245,239,224,0.09)')}
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(245,239,224,0.30)', display: 'flex', alignItems: 'center' }}
          >
            <X style={{ width: 14, height: 14 }} />
          </button>
        )}
      </div>

      {/* Category pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        {CATEGORIES.map((cat) => {
          const active = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '6px 14px',
                borderRadius: 9999,
                border: `1px solid ${active ? 'rgba(170,255,77,0.35)' : 'rgba(245,239,224,0.09)'}`,
                background: active ? 'rgba(170,255,77,0.10)' : 'transparent',
                color: active ? '#AAFF4D' : 'rgba(245,239,224,0.45)',
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Tag pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 28 }}>
        {allTags.map((tag) => {
          const active = selectedTags.has(tag);
          return (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                letterSpacing: '0.04em',
                padding: '3px 10px',
                borderRadius: 4,
                border: `1px solid ${active ? 'rgba(170,255,77,0.30)' : 'rgba(245,239,224,0.07)'}`,
                background: active ? 'rgba(170,255,77,0.08)' : 'rgba(245,239,224,0.03)',
                color: active ? '#AAFF4D' : 'rgba(245,239,224,0.35)',
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
            >
              #{tag}
            </button>
          );
        })}
      </div>

      {/* Results count + clear */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'rgba(245,239,224,0.35)' }}>
          <span style={{ color: '#F5EFE0', fontWeight: 600 }}>{filtered.length}</span>
          {" "}of {tools.length} tools
        </p>
        {hasFilters && (
          <button
            onClick={clearAll}
            style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'rgba(245,239,224,0.35)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, transition: 'color 150ms ease' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#F5EFE0')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,239,224,0.35)')}
          >
            <X style={{ width: 12, height: 12 }} /> Clear all filters
          </button>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '96px 0', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'rgba(245,239,224,0.30)' }}>
            Nothing here yet.
          </p>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'rgba(245,239,224,0.25)' }}>
            Try a different search or filter.
          </p>
          <button onClick={clearAll} style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: '#AAFF4D', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3 }}>
            Clear all filters
          </button>
        </div>
      ) : (
        <ToolGrid3D
          key={`${activeCategory}-${[...selectedTags].sort().join(",")}-${query}`}
          tools={filtered}
        />
      )}
    </div>
  );
}
