"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import CheckQuestion from "@/components/lessons/CheckQuestion";
import {
  loadProgress,
  gradeReview,
  dueForReview,
  reviewable,
  XP,
  type ProgressState,
} from "@/lib/progress";
import type { ConceptCheckQuestion } from "@/lib/checks";

interface ReviewClientProps {
  bank: Record<string, ConceptCheckQuestion[]>;
  titles: Record<string, string>;
}

const MONO_EYEBROW: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 10,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--text-muted)",
};

const container: CSSProperties = {
  maxWidth: "var(--max-width-editorial)",
  margin: "0 auto",
  padding: "clamp(24px, 4vw, 48px) clamp(20px, 5vw, 32px) 96px",
};

// Light shuffle so a session doesn't always open with the same card.
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Phase = "idle" | "running" | "done";

export default function ReviewClient({ bank, titles }: ReviewClientProps) {
  const available = useMemo(
    () => Object.keys(bank).filter((s) => (bank[s]?.length ?? 0) > 0),
    [bank]
  );

  const [state, setState] = useState<ProgressState | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [queue, setQueue] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [stats, setStats] = useState({ reviewed: 0, remembered: 0 });

  useEffect(() => {
    setState(loadProgress());
  }, []);

  const dueSlugs = useMemo(
    () => (state ? dueForReview(state, available) : []),
    [state, available]
  );
  const practiceSlugs = useMemo(
    () => (state ? reviewable(state, available) : []),
    [state, available]
  );

  function start(slugs: string[]) {
    if (slugs.length === 0) return;
    setQueue(shuffle(slugs));
    setIndex(0);
    setStats({ reviewed: 0, remembered: 0 });
    setPhase("running");
  }

  function handleGraded(slug: string, remembered: boolean) {
    gradeReview(slug, remembered);
    setStats((s) => ({
      reviewed: s.reviewed + 1,
      remembered: s.remembered + (remembered ? 1 : 0),
    }));
    if (index + 1 >= queue.length) {
      setState(loadProgress());
      setPhase("done");
    } else {
      setIndex((i) => i + 1);
    }
  }

  const header = (
    <div style={{ marginBottom: 40 }}>
      <p style={{ ...MONO_EYEBROW, color: "var(--accent-primary)", marginBottom: 14 }}>review</p>
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
        {phase === "running" ? "Remember this?" : "Make it stick"}
      </h1>
    </div>
  );

  // Pre-mount / loading.
  if (state === null) {
    return (
      <div style={container}>
        {header}
        <p style={{ ...MONO_EYEBROW, fontSize: 11, letterSpacing: "0.08em" }}>Loading…</p>
      </div>
    );
  }

  // ---- Running: one card at a time ----
  if (phase === "running") {
    const slug = queue[index];
    return (
      <div style={container}>
        {header}
        <p style={{ ...MONO_EYEBROW, marginBottom: 24 }}>
          card {index + 1} of {queue.length}
        </p>
        <ReviewCard
          key={slug}
          slug={slug}
          title={titles[slug] ?? slug}
          questions={bank[slug]}
          last={index + 1 >= queue.length}
          onGraded={(remembered) => handleGraded(slug, remembered)}
        />
      </div>
    );
  }

  // ---- Done: session summary ----
  if (phase === "done") {
    const earned = stats.remembered * XP.review;
    return (
      <div style={container}>
        {header}
        <div
          style={{
            padding: "clamp(24px, 4vw, 40px)",
            background: "var(--bg-surface)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-xl)",
            marginBottom: 32,
          }}
        >
          <p style={{ ...MONO_EYEBROW, color: "var(--accent-primary)", marginBottom: 12 }}>
            session complete
          </p>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(24px, 4vw, 34px)",
              fontWeight: 700,
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
              margin: "0 0 10px",
            }}
          >
            {stats.remembered} of {stats.reviewed} clean
          </p>
          <p
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: "var(--text-base)",
              color: "var(--text-secondary)",
              margin: 0,
            }}
          >
            {earned > 0 ? `+${earned} xp · ` : ""}streak kept. The ones you fumbled come back sooner.
          </p>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {dueForReview(loadProgress(), available).length > 0 && (
            <button onClick={() => start(dueForReview(loadProgress(), available))} className="btn-primary">
              Keep going
            </button>
          )}
          <Link href="/you" className="btn-ghost" style={{ textDecoration: "none" }}>
            Back to progress
          </Link>
        </div>
      </div>
    );
  }

  // ---- Idle: the queue summary / entry ----
  return (
    <div style={container}>
      {header}

      {dueSlugs.length > 0 ? (
        <>
          <p
            style={{
              fontFamily: "var(--font-editorial)",
              fontSize: "var(--text-lg)",
              lineHeight: 1.7,
              color: "var(--text-secondary)",
              margin: "0 0 28px",
              maxWidth: "48ch",
            }}
          >
            <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>
              {dueSlugs.length} concept{dueSlugs.length !== 1 ? "s" : ""}
            </strong>{" "}
            you&apos;ve learned {dueSlugs.length !== 1 ? "are" : "is"} due for a quick recall check.
            A minute now is worth an hour of re-reading later.
          </p>
          <button onClick={() => start(dueSlugs)} className="btn-primary">
            Start review →
          </button>
          <div style={{ marginTop: 28, display: "flex", flexWrap: "wrap", gap: 8 }}>
            {dueSlugs.slice(0, 10).map((s) => (
              <span key={s} className="tag">
                {titles[s] ?? s}
              </span>
            ))}
          </div>
        </>
      ) : practiceSlugs.length > 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: 16,
            padding: "64px 0",
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
            Nothing due today — you&apos;re caught up. Want to run through what
            you&apos;ve learned anyway?
          </p>
          <button onClick={() => start(practiceSlugs)} className="btn-ghost">
            Practice all {practiceSlugs.length} →
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: 16,
            padding: "64px 0",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-editorial)",
              fontStyle: "italic",
              fontSize: "var(--text-lg)",
              color: "var(--text-muted)",
              maxWidth: "42ch",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            Nothing to review yet. Read a concept and pass its check — it&apos;ll
            come back here in a day or two so it actually sticks.
          </p>
          <Link href="/learn" className="btn-primary" style={{ textDecoration: "none" }}>
            Start learning →
          </Link>
        </div>
      )}
    </div>
  );
}

// ---- One review card: the concept's question(s), with first-try grading ----
function ReviewCard({
  slug,
  title,
  questions,
  last,
  onGraded,
}: {
  slug: string;
  title: string;
  questions: ConceptCheckQuestion[];
  last: boolean;
  onGraded: (remembered: boolean) => void;
}) {
  const [selected, setSelected] = useState<(number | null)[]>(() => questions.map(() => null));
  const [hadWrong, setHadWrong] = useState(false);

  const allSolved = questions.every((q, i) => {
    const pick = selected[i];
    return pick !== null && q.choices[pick]?.correct === true;
  });

  function pick(qi: number, choiceIdx: number) {
    if (questions[qi].choices[choiceIdx]?.correct !== true) setHadWrong(true);
    setSelected((prev) => prev.map((v, j) => (j === qi ? choiceIdx : v)));
  }

  return (
    <section aria-label={`Review: ${title}`}>
      <Link
        href={`/learn/${slug}`}
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--accent-primary)",
          textDecoration: "none",
        }}
      >
        {title}
      </Link>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-10)", marginTop: 20 }}>
        {questions.map((q, i) => (
          <CheckQuestion
            key={q.prompt}
            prompt={q.prompt}
            choices={q.choices}
            selected={selected[i]}
            hideEyebrow
            onSelect={(idx) => pick(i, idx)}
          />
        ))}
      </div>

      {allSolved && (
        <div
          style={{
            marginTop: "var(--space-10)",
            paddingTop: "var(--space-6)",
            borderTop: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: hadWrong ? "var(--accent-warm)" : "var(--accent-primary)",
            }}
          >
            {hadWrong ? "↻ back sooner" : "✓ remembered"}
          </span>
          <button onClick={() => onGraded(!hadWrong)} className="btn-primary">
            {last ? "Finish" : "Next →"}
          </button>
        </div>
      )}
    </section>
  );
}
