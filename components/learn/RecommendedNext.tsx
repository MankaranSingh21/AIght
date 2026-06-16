"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadProgress, PROGRESS_CHANGED_EVENT } from "@/lib/progress";
import { recommendNext, type GraphConcept } from "@/lib/recommend";

/**
 * "Where to go next" — personalised concept recommendations for returning
 * readers (Wave 4). Renders nothing until the visitor has read at least one
 * concept, so the curated first-visit layout of /learn and the homepage is
 * untouched. Same null-on-SSR pattern as StreakChip — no hydration mismatch.
 */
export default function RecommendedNext({ concepts }: { concepts: GraphConcept[] }) {
  const [readSlugs, setReadSlugs] = useState<Set<string> | null>(null);

  useEffect(() => {
    const sync = () => setReadSlugs(new Set(Object.keys(loadProgress().conceptsRead)));
    sync();
    window.addEventListener(PROGRESS_CHANGED_EVENT, sync);
    return () => window.removeEventListener(PROGRESS_CHANGED_EVENT, sync);
  }, []);

  if (!readSlugs || readSlugs.size === 0) return null;
  const recs = recommendNext(concepts, readSlugs, 3);
  if (recs.length === 0) return null;

  return (
    <section
      aria-label="Recommended next"
      style={{
        maxWidth: "var(--max-width-content)",
        margin: "0 auto",
        padding: "48px clamp(24px, 5vw, 48px)",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--accent-primary)",
          margin: "0 0 8px",
        }}
      >
        for you
      </p>
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(24px, 3vw, 32px)",
          fontWeight: 700,
          color: "var(--text-primary)",
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
          margin: "0 0 6px",
        }}
      >
        Where to go next
      </h2>
      <p
        style={{
          fontFamily: "var(--font-editorial)",
          fontStyle: "italic",
          fontSize: 14,
          color: "var(--text-muted)",
          margin: "0 0 28px",
          maxWidth: "48ch",
        }}
      >
        Picked from what you&apos;ve read — the next ideas you&apos;re ready for.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 16,
        }}
      >
        {recs.map((c) => (
          <Link
            key={c.slug}
            href={`/learn/${c.slug}`}
            className="group"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              padding: "20px 22px",
              borderRadius: "var(--radius-lg)",
              background: "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
              borderLeft: "3px solid var(--accent-primary)",
              textDecoration: "none",
              height: "100%",
              transition: "border-color 200ms ease, transform 200ms ease",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
              }}
            >
              {c.group}
            </span>
            <h3
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: 17,
                fontWeight: 600,
                color: "var(--text-primary)",
                letterSpacing: "-0.01em",
                margin: 0,
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
                fontSize: 13,
                color: "var(--text-secondary)",
                lineHeight: 1.6,
                margin: 0,
                flex: 1,
              }}
            >
              {c.tagline}
            </p>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.06em",
                color: "var(--text-muted)",
              }}
            >
              {c.hasLesson && <span style={{ color: "var(--accent-primary)" }}>◈ interactive · </span>}
              {c.readTime}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
