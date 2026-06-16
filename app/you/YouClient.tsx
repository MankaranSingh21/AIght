"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import {
  loadProgress,
  levelFor,
  dueForReview,
  BADGES,
  PROGRESS_CHANGED_EVENT,
  type ProgressState,
} from "@/lib/progress";
import ProgressRing from "@/components/progress/ProgressRing";

type TrackSummary = {
  slug: string;
  title: string;
  eyebrow: string;
  conceptSlugs: string[];
};

interface YouClientProps {
  conceptTitles: Record<string, string>;
  totalConcepts: number;
  lessonSlugs: string[];
  totalChecks: number;
  checkSlugs: string[];
  tracks: TrackSummary[];
}

const MONO_EYEBROW: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 10,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--text-muted)",
};

export default function YouClient({
  conceptTitles,
  totalConcepts,
  lessonSlugs,
  totalChecks,
  checkSlugs,
  tracks,
}: YouClientProps) {
  // null = before first client read (avoids hydration mismatch — same pattern
  // as StreakChip). Everything dynamic renders only once state is loaded.
  const [state, setState] = useState<ProgressState | null>(null);

  useEffect(() => {
    const sync = () => setState(loadProgress());
    sync();
    window.addEventListener(PROGRESS_CHANGED_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(PROGRESS_CHANGED_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const container: CSSProperties = {
    maxWidth: 1280,
    margin: "0 auto",
    padding: "clamp(24px, 4vw, 48px) clamp(20px, 5vw, 48px) 96px",
  };

  // Header is always present (server + client identical) — no hydration risk.
  const header = (
    <div style={{ marginBottom: 48 }}>
      <p style={{ ...MONO_EYEBROW, color: "var(--accent-primary)", marginBottom: 14 }}>
        your progress
      </p>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(32px, 5vw, 52px)",
          fontWeight: 900,
          color: "var(--text-primary)",
          letterSpacing: "-0.03em",
          lineHeight: 1.05,
          margin: 0,
        }}
      >
        Where you are
      </h1>
    </div>
  );

  if (state === null) {
    return (
      <div style={container}>
        {header}
        <p style={{ ...MONO_EYEBROW, fontSize: 11, letterSpacing: "0.08em" }}>Loading…</p>
      </div>
    );
  }

  const readSlugs = Object.keys(state.conceptsRead);
  const readCount = readSlugs.length;
  const lessonEntries = Object.entries(state.lessons);
  const lessonsDone = lessonEntries.filter(([, l]) => l.completedAt).length;
  const checksDone = Object.keys(state.conceptChecks ?? {}).length;

  const hasActivity = state.xp > 0 || readCount > 0 || lessonsDone > 0;

  // ---- Empty state: a real first-visit invitation, not a dead dashboard ----
  if (!hasActivity) {
    return (
      <div style={container}>
        {header}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            padding: "80px 0",
            textAlign: "center",
          }}
        >
          <ProgressRing progress={0} size={40} strokeWidth={3} />
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
            Nothing here yet — and that&apos;s the point.
            <br />
            Read a concept or finish a lesson and this page fills in: your level,
            streak, and what you&apos;ve learned.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 8, flexWrap: "wrap", justifyContent: "center" }}>
            <Link href="/learn" className="btn-primary" style={{ textDecoration: "none" }}>
              Start with the basics →
            </Link>
            <Link href="/learn/tracks/ai-from-zero" className="btn-ghost" style={{ textDecoration: "none" }}>
              Follow a track
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ---- Active dashboard ----
  const { level, next, progress } = levelFor(state.xp);
  const xpToNext = next ? next.xp - state.xp : 0;
  const dueCount = dueForReview(state, checkSlugs).length;

  // Continue target: an unfinished lesson first, else the most recent read.
  const inProgressLesson = lessonEntries.find(([, l]) => !l.completedAt && l.step > 0);
  const recentRead = readSlugs
    .map((slug) => ({ slug, at: state.conceptsRead[slug] }))
    .sort((a, b) => (a.at < b.at ? 1 : -1));

  const cont = inProgressLesson
    ? {
        href: `/learn/${inProgressLesson[0]}/lesson`,
        title: conceptTitles[inProgressLesson[0]] ?? inProgressLesson[0],
        kind: "Resume the lesson",
      }
    : recentRead[0]
      ? {
          href: `/learn/${recentRead[0].slug}`,
          title: conceptTitles[recentRead[0].slug] ?? recentRead[0].slug,
          kind: "Pick up where you left off",
        }
      : null;

  // Track progress, most-complete first; hide tracks not yet started.
  const trackProgress = tracks
    .map((t) => {
      const done = t.conceptSlugs.filter((s) => state.conceptsRead[s]).length;
      return { ...t, done, total: t.conceptSlugs.length };
    })
    .filter((t) => t.done > 0 && t.total > 0)
    .sort((a, b) => b.done / b.total - a.done / a.total);

  const stats: { label: string; value: string }[] = [
    { label: "Concepts read", value: `${readCount} / ${totalConcepts}` },
    { label: "Lessons finished", value: `${lessonsDone} / ${lessonSlugs.length}` },
    { label: "Checks passed", value: `${checksDone} / ${totalChecks}` },
    { label: "Day streak", value: `${state.streak.current}` },
  ];

  const earned = new Set(state.badges);

  return (
    <div style={container}>
      {header}

      {/* Level + XP hero */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "clamp(16px, 4vw, 32px)",
          flexWrap: "wrap",
          padding: "clamp(20px, 3vw, 32px)",
          background: "var(--bg-surface)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-xl)",
          marginBottom: 32,
        }}
      >
        <ProgressRing progress={progress} size={72} strokeWidth={5} />
        <div style={{ flex: 1, minWidth: 200 }}>
          <p style={{ ...MONO_EYEBROW, color: "var(--accent-primary)", marginBottom: 6 }}>
            Level
          </p>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "clamp(22px, 4vw, 30px)",
              fontWeight: 500,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "var(--text-primary)",
              margin: "0 0 6px",
            }}
          >
            {level}
          </p>
          <p
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: "var(--text-sm)",
              color: "var(--text-secondary)",
              margin: 0,
            }}
          >
            {state.xp} xp
            {next ? (
              <span style={{ color: "var(--text-muted)" }}>
                {" "}
                · {xpToNext} to {next.name}
              </span>
            ) : (
              <span style={{ color: "var(--text-muted)" }}> · top level reached</span>
            )}
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px, 5vw, 40px)",
              fontWeight: 900,
              color: state.streak.current > 1 ? "var(--accent-primary)" : "var(--text-primary)",
              lineHeight: 1,
              margin: "0 0 4px",
            }}
          >
            {state.streak.current}
          </p>
          <p style={{ ...MONO_EYEBROW }}>
            day streak{state.streak.longest > state.streak.current ? ` · best ${state.streak.longest}` : ""}
          </p>
        </div>
      </div>

      {/* Continue card */}
      {cont && (
        <Link
          href={cont.href}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            padding: "20px 24px",
            background: "var(--accent-primary-glow)",
            border: "1px solid var(--border-emphasis)",
            borderRadius: "var(--radius-lg)",
            textDecoration: "none",
            marginBottom: 40,
          }}
          className="group hover:border-accent"
        >
          <div style={{ minWidth: 0 }}>
            <p style={{ ...MONO_EYEBROW, color: "var(--accent-primary)", marginBottom: 6 }}>
              {cont.kind}
            </p>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(18px, 3vw, 24px)",
                fontWeight: 600,
                color: "var(--text-primary)",
                letterSpacing: "-0.01em",
                margin: 0,
              }}
            >
              {cont.title}
            </p>
          </div>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 20, color: "var(--accent-primary)" }}>→</span>
        </Link>
      )}

      {/* Due-for-review nudge — the spaced-repetition loop's entry point */}
      {dueCount > 0 && (
        <Link
          href="/review"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            padding: "16px 24px",
            background: "var(--bg-surface)",
            border: "1px solid var(--border-default)",
            borderRadius: "var(--radius-lg)",
            textDecoration: "none",
            marginBottom: 40,
          }}
          className="group hover:border-accent"
        >
          <p
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: 15,
              color: "var(--text-secondary)",
              margin: 0,
            }}
          >
            <span style={{ color: "var(--accent-primary)", fontWeight: 600 }}>
              {dueCount} concept{dueCount !== 1 ? "s" : ""}
            </span>{" "}
            due for review — keep {dueCount !== 1 ? "them" : "it"} from fading.
          </p>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--accent-primary)",
              whiteSpace: "nowrap",
            }}
          >
            Review →
          </span>
        </Link>
      )}

      {/* Stat grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 16,
          marginBottom: 48,
        }}
      >
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              padding: "20px 24px",
              background: "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-lg)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 30,
                fontWeight: 900,
                color: "var(--text-primary)",
                lineHeight: 1,
                margin: "0 0 8px",
                letterSpacing: "-0.02em",
              }}
            >
              {s.value}
            </p>
            <p style={MONO_EYEBROW}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tracks in progress */}
      {trackProgress.length > 0 && (
        <section style={{ marginBottom: 48 }}>
          <p style={{ ...MONO_EYEBROW, color: "var(--accent-primary)", marginBottom: 18 }}>
            tracks in progress
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {trackProgress.map((t) => {
              const complete = t.done >= t.total;
              return (
                <Link
                  key={t.slug}
                  href={`/learn/tracks/${t.slug}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "16px 0",
                    borderBottom: "1px solid var(--border-subtle)",
                    textDecoration: "none",
                  }}
                  className="group"
                >
                  <ProgressRing progress={t.done / t.total} size={28} strokeWidth={3} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span
                      style={{
                        fontFamily: "var(--font-ui)",
                        fontSize: 15,
                        fontWeight: 500,
                        color: "var(--text-primary)",
                        transition: "color 150ms ease",
                      }}
                      className="group-hover:text-accent"
                    >
                      {t.title}
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      color: complete ? "var(--accent-primary)" : "var(--text-muted)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {complete ? "✓ complete" : `${t.done} / ${t.total}`}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Recently read — re-entry points */}
      {recentRead.length > 0 && (
        <section style={{ marginBottom: 48 }}>
          <p style={{ ...MONO_EYEBROW, color: "var(--accent-primary)", marginBottom: 18 }}>
            recently read
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {recentRead.slice(0, 8).map((r) => (
              <Link
                key={r.slug}
                href={`/learn/${r.slug}`}
                className="tag"
                style={{ textDecoration: "none" }}
              >
                {conceptTitles[r.slug] ?? r.slug}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Badges */}
      <section>
        <p style={{ ...MONO_EYEBROW, color: "var(--accent-primary)", marginBottom: 18 }}>
          badges
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 12,
          }}
        >
          {BADGES.map((b) => {
            const got = earned.has(b.id);
            return (
              <div
                key={b.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "16px 18px",
                  background: got ? "var(--accent-primary-glow)" : "var(--bg-surface)",
                  border: `1px solid ${got ? "var(--border-emphasis)" : "var(--border-subtle)"}`,
                  borderRadius: "var(--radius-lg)",
                  opacity: got ? 1 : 0.55,
                }}
              >
                <span
                  aria-hidden
                  style={{
                    fontSize: 18,
                    color: got ? "var(--accent-primary)" : "var(--text-muted)",
                    flexShrink: 0,
                  }}
                >
                  {got ? "◆" : "◇"}
                </span>
                <div style={{ minWidth: 0 }}>
                  <p
                    style={{
                      fontFamily: "var(--font-ui)",
                      fontSize: 14,
                      fontWeight: 600,
                      color: got ? "var(--text-primary)" : "var(--text-secondary)",
                      margin: "0 0 2px",
                    }}
                  >
                    {b.name}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-ui)",
                      fontSize: 12,
                      color: "var(--text-muted)",
                      margin: 0,
                    }}
                  >
                    {got ? "Earned" : b.hint}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
