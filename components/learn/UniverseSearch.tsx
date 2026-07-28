"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import type { PositionedGraph } from "@/lib/universe-layout";
import { track } from "@/lib/analytics";

interface Props {
  graph: PositionedGraph;
  onSelect: (id: string) => void;
}

const KIND_LABEL: Record<string, string> = {
  field: "field",
  concept: "concept",
  tool: "tool",
};

/**
 * Find-a-node box. 141 items, so a plain substring match is more than enough —
 * no fuzzy-search dependency for a list this size.
 */
export default function UniverseSearch({ graph, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const boxRef = useRef<HTMLDivElement | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return graph.nodes
      .filter((n) => n.title.toLowerCase().includes(q))
      // Prefix matches first, then alphabetical — "age" should surface "Agents"
      // above "Percentage" rather than in source order.
      .sort((a, b) => {
        const ap = a.title.toLowerCase().startsWith(q) ? 0 : 1;
        const bp = b.title.toLowerCase().startsWith(q) ? 0 : 1;
        return ap - bp || a.title.localeCompare(b.title);
      })
      .slice(0, 8);
  }, [query, graph.nodes]);

  useEffect(() => setActive(0), [query]);

  // Close on outside click.
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  function choose(i: number) {
    const node = results[i];
    if (!node) return;
    track("universe_searched", { query: query.trim(), results: results.length });
    onSelect(node.id);
    setQuery("");
    setOpen(false);
  }

  return (
    <div ref={boxRef} style={{ position: "relative" }}>
      <input
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive((a) => Math.min(a + 1, results.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((a) => Math.max(a - 1, 0));
          } else if (e.key === "Enter") {
            e.preventDefault();
            choose(active);
          } else if (e.key === "Escape") {
            setOpen(false);
          }
        }}
        placeholder="Find a node…"
        aria-label="Search the universe for a field, concept or tool"
        aria-expanded={open && results.length > 0}
        aria-controls="universe-search-results"
        role="combobox"
        aria-autocomplete="list"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.04em",
          padding: "7px 12px",
          borderRadius: 999,
          background: "rgba(255,250,240,0.04)",
          border: "1px solid rgba(245,239,224,0.10)",
          color: "var(--text-primary)",
          outline: "none",
          width: 170,
        }}
      />

      {open && results.length > 0 && (
        <ul
          id="universe-search-results"
          role="listbox"
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            zIndex: 20,
            minWidth: 260,
            margin: 0,
            padding: 6,
            listStyle: "none",
            borderRadius: "var(--radius-md)",
            background: "rgba(22,18,16,0.97)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(245,239,224,0.12)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          {results.map((n, i) => (
            <li key={n.id} role="option" aria-selected={i === active}>
              <button
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(i)}
                style={{
                  display: "flex",
                  width: "100%",
                  gap: 10,
                  alignItems: "baseline",
                  padding: "7px 10px",
                  borderRadius: 6,
                  border: "none",
                  textAlign: "left",
                  cursor: "pointer",
                  background: i === active ? "rgba(170,255,77,0.10)" : "transparent",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-ui)",
                  fontSize: 13,
                }}
              >
                <span style={{ flex: 1 }}>{n.title}</span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    letterSpacing: "0.08em",
                    color: "var(--text-muted)",
                  }}
                >
                  {KIND_LABEL[n.kind]}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
