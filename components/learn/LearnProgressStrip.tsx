"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  loadProgress,
  dueForReview,
  PROGRESS_CHANGED_EVENT,
  type ProgressState,
} from "@/lib/progress";

/**
 * Quiet progress + review strip at the top of /learn for returning readers.
 * Shows how far they are through the catalogue and — the important part —
 * how many learned concepts are due in the /review queue, which otherwise
 * has no entry point from the learning hub. Renders nothing for first-time
 * visitors and on SSR (same null-on-SSR pattern as RecommendedNext).
 */
export default function LearnProgressStrip({
  checkSlugs,
  totalConcepts,
}: {
  checkSlugs: string[];
  totalConcepts: number;
}) {
  const [state, setState] = useState<ProgressState | null>(null);

  useEffect(() => {
    const sync = () => setState(loadProgress());
    sync();
    window.addEventListener(PROGRESS_CHANGED_EVENT, sync);
    return () => window.removeEventListener(PROGRESS_CHANGED_EVENT, sync);
  }, []);

  if (!state) return null;
  const read = Object.keys(state.conceptsRead).length;
  if (read === 0 && state.xp === 0) return null;

  const due = dueForReview(state, checkSlugs).length;
  const streak = state.streak.current;

  return (
    <section
      aria-label="Your progress"
      style={{
        maxWidth: "var(--max-width-content)",
        margin: "0 auto",
        padding: "24px clamp(24px, 5vw, 48px) 0",
      }}
    >
      <div
        className="glass-card"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
          padding: "16px 22px",
          borderRadius: "var(--radius-lg)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.08em",
            color: "var(--text-secondary)",
            margin: 0,
          }}
        >
          <span style={{ color: "var(--accent-primary)" }}>{read}</span> of {totalConcepts}{" "}
          concepts read
          {streak > 1 && (
            <span style={{ color: "var(--text-muted)" }}> · {streak}-day streak</span>
          )}
        </p>

        {due > 0 ? (
          <Link
            href="/review"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.08em",
              color: "var(--accent-primary)",
              textDecoration: "none",
            }}
          >
            {due} concept{due !== 1 ? "s" : ""} due for review →
          </Link>
        ) : (
          <Link
            href="/you"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.08em",
              color: "var(--text-muted)",
              textDecoration: "none",
            }}
          >
            your progress →
          </Link>
        )}
      </div>
    </section>
  );
}
