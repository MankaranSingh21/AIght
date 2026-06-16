"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadProgress, PROGRESS_CHANGED_EVENT } from "@/lib/progress";
import { conceptOfDay } from "@/lib/daily";
import type { GraphConcept } from "@/lib/recommend";

/**
 * "Concept of the day" band — a deterministic daily pick (Wave 6). A small
 * reason to come back each day; ties into progress so a returning reader sees
 * whether they've already read today's. Null-on-SSR (computes the local day
 * client-side, like the other progress-aware components) — no hydration risk.
 */
export default function ConceptOfTheDay({ concepts }: { concepts: GraphConcept[] }) {
  const [mounted, setMounted] = useState(false);
  const [readSlugs, setReadSlugs] = useState<Set<string>>(new Set());

  useEffect(() => {
    setMounted(true);
    const sync = () => setReadSlugs(new Set(Object.keys(loadProgress().conceptsRead)));
    sync();
    window.addEventListener(PROGRESS_CHANGED_EVENT, sync);
    return () => window.removeEventListener(PROGRESS_CHANGED_EVENT, sync);
  }, []);

  if (!mounted) return null;
  const c = conceptOfDay(concepts);
  if (!c) return null;
  const read = readSlugs.has(c.slug);

  return (
    <section
      aria-label="Concept of the day"
      style={{
        maxWidth: "var(--max-width-content)",
        margin: "0 auto",
        padding: "32px clamp(24px, 5vw, 48px) 0",
      }}
    >
      <Link
        href={`/learn/${c.slug}`}
        className="group"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "clamp(16px, 3vw, 28px)",
          flexWrap: "wrap",
          padding: "20px 24px",
          borderRadius: "var(--radius-lg)",
          background: "var(--bg-surface)",
          border: "1px solid var(--border-subtle)",
          borderLeft: "3px solid var(--accent-primary)",
          textDecoration: "none",
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--accent-primary)",
              margin: "0 0 6px",
            }}
          >
            ◈ Concept of the day · {c.group}
          </p>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(20px, 3vw, 28px)",
              fontWeight: 700,
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              margin: "0 0 4px",
              transition: "color 150ms ease",
            }}
            className="group-hover:text-accent"
          >
            {c.title}
          </h3>
          <p
            style={{
              fontFamily: "var(--font-editorial)",
              fontStyle: "italic",
              fontSize: 14,
              color: "var(--text-secondary)",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {c.tagline}
          </p>
        </div>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            color: read ? "var(--accent-primary)" : "var(--text-secondary)",
            background: read ? "var(--accent-primary-glow)" : "var(--bg-elevated)",
            border: `1px solid ${read ? "var(--border-emphasis)" : "var(--border-default)"}`,
            borderRadius: "var(--radius-full)",
            padding: "8px 16px",
          }}
        >
          {read ? "✓ Read today's" : `Read it · ${c.readTime}`}
        </span>
      </Link>
    </section>
  );
}
