"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  loadProgress,
  completeTrack,
  XP,
  PROGRESS_CHANGED_EVENT,
  type ProgressState,
} from "@/lib/progress";

interface TrackCompletionProps {
  trackSlug: string;
  trackTitle: string;
  /** Live (non-soon) concept slugs in this track. */
  conceptSlugs: string[];
  nextTrack: { slug: string; title: string } | null;
}

/**
 * Progress + completion payoff for a curriculum track (Wave 5). Shows a slim
 * progress bar once started, and a celebration once every live concept is read
 * or its lesson finished — awarding the one-time track bonus. Renders nothing
 * for a visitor who hasn't started the track, keeping the page clean.
 */
export default function TrackCompletion({
  trackSlug,
  trackTitle,
  conceptSlugs,
  nextTrack,
}: TrackCompletionProps) {
  const [progress, setProgress] = useState<ProgressState | null>(null);
  const awarded = useRef(false);

  useEffect(() => {
    const sync = () => setProgress(loadProgress());
    sync();
    window.addEventListener(PROGRESS_CHANGED_EVENT, sync);
    return () => window.removeEventListener(PROGRESS_CHANGED_EVENT, sync);
  }, []);

  const total = conceptSlugs.length;
  const done = progress
    ? conceptSlugs.filter(
        (s) => progress.conceptsRead[s] || progress.lessons[s]?.completedAt
      ).length
    : 0;
  const complete = total > 0 && done === total;

  // Record + reward completion once. completeTrack is idempotent, so a refresh
  // after finishing earns nothing.
  useEffect(() => {
    if (complete && !awarded.current) {
      awarded.current = true;
      completeTrack(trackSlug);
    }
  }, [complete, trackSlug]);

  if (!progress || done === 0) return null;

  if (!complete) {
    return (
      <div style={{ marginBottom: 40 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
            }}
          >
            your progress
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--accent-primary)",
            }}
          >
            {done} / {total}
          </span>
        </div>
        <div
          style={{
            height: 4,
            borderRadius: "var(--radius-full)",
            background: "var(--bg-elevated)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${(done / total) * 100}%`,
              background: "var(--accent-primary)",
              borderRadius: "var(--radius-full)",
              transition: "width 350ms ease",
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        marginBottom: 48,
        padding: "clamp(24px, 4vw, 36px)",
        borderRadius: "var(--radius-xl)",
        background:
          "linear-gradient(135deg, var(--accent-primary-glow) 0%, rgba(0,255,209,0.04) 70%, transparent 100%)",
        border: "1px solid var(--border-emphasis)",
        boxShadow: "var(--shadow-glow-lime)",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--accent-primary)",
          margin: "0 0 10px",
        }}
      >
        ◆ Track complete
      </p>
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(24px, 4vw, 34px)",
          fontWeight: 900,
          color: "var(--text-primary)",
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
          margin: "0 0 10px",
        }}
      >
        You finished {trackTitle}.
      </h2>
      <p
        style={{
          fontFamily: "var(--font-editorial)",
          fontSize: 15,
          fontStyle: "italic",
          color: "var(--text-secondary)",
          lineHeight: 1.7,
          margin: "0 0 20px",
          maxWidth: "52ch",
        }}
      >
        All {total} concepts, read. +{XP.trackComplete} xp and the Through-Line badge.
        Now keep them from fading — a quick review locks it in.
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link href="/review" className="btn-primary" style={{ textDecoration: "none" }}>
          Review what you learned →
        </Link>
        {nextTrack && (
          <Link
            href={`/learn/tracks/${nextTrack.slug}`}
            className="btn-ghost"
            style={{ textDecoration: "none" }}
          >
            Next: {nextTrack.title}
          </Link>
        )}
      </div>
    </div>
  );
}
