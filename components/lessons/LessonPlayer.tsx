'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { Lesson, LessonStep } from '@/lib/lessons';
import { completeLesson, recordLessonStep, loadProgress, levelFor } from '@/lib/progress';
import CheckQuestion from './CheckQuestion';

const SPRING_EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

interface LessonPlayerProps {
  lesson: Lesson;
}

/** "· 142 xp · ARCHIVIST · day 3" — read once on mount, after completion XP lands. */
function CompletionXpLine() {
  const [line, setLine] = useState<string | null>(null);
  useEffect(() => {
    const s = loadProgress();
    if (s.xp === 0) return;
    const { level } = levelFor(s.xp);
    const streak = s.streak.current > 1 ? ` · day ${s.streak.current}` : '';
    setLine(` · ${s.xp} xp · ${level.toUpperCase()}${streak}`);
  }, []);
  if (!line) return null;
  return <span style={{ color: 'var(--accent-primary)' }}>{line}</span>;
}

type CheckState = {
  selected: number | null;
  /** Whether the first pick was the correct one. */
  firstTryRight: boolean | null;
};

export default function LessonPlayer({ lesson }: LessonPlayerProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [checks, setChecks] = useState<Record<string, CheckState>>({});
  const reduceMotion = useReducedMotion();

  const step: LessonStep | undefined = lesson.steps[stepIndex];
  const totalSteps = lesson.steps.length;
  const isLast = stepIndex === totalSteps - 1;

  const checkState = step?.kind === 'check' ? checks[step.id] : undefined;
  const stepSolved =
    step?.kind !== 'check' ||
    (checkState?.selected != null && step.choices[checkState.selected]?.correct === true);

  const checksRight = useMemo(
    () => Object.values(checks).filter((c) => c.firstTryRight).length,
    [checks]
  );
  const totalChecks = useMemo(
    () => lesson.steps.filter((s) => s.kind === 'check').length,
    [lesson.steps]
  );

  const goNext = useCallback(() => {
    if (!stepSolved) return;
    if (isLast) {
      completeLesson(lesson.slug, checksRight);
      setDone(true);
    } else {
      recordLessonStep(lesson.slug, stepIndex + 1);
      setStepIndex((i) => i + 1);
    }
  }, [stepSolved, isLast, lesson.slug, checksRight, stepIndex]);

  const goBack = useCallback(() => {
    if (done) {
      setDone(false);
    } else {
      setStepIndex((i) => Math.max(0, i - 1));
    }
  }, [done]);

  const selectChoice = useCallback(
    (index: number) => {
      if (step?.kind !== 'check') return;
      setChecks((prev) => {
        const existing = prev[step.id];
        return {
          ...prev,
          [step.id]: {
            selected: index,
            firstTryRight:
              existing?.firstTryRight ?? step.choices[index]?.correct === true,
          },
        };
      });
    },
    [step]
  );

  const reset = useCallback(() => {
    setStepIndex(0);
    setChecks({});
    setDone(false);
  }, []);

  // Keyboard: ←/→ navigate, 1–4 pick a choice, Enter continues.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;

      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        goNext();
      } else if (e.key === 'ArrowLeft') {
        goBack();
      } else if (step?.kind === 'check' && /^[1-9]$/.test(e.key)) {
        const idx = Number(e.key) - 1;
        if (idx < step.choices.length) selectChoice(idx);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goBack, selectChoice, step]);

  const motionProps = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -12 },
        transition: { duration: 0.3, ease: SPRING_EASE },
      };

  const navButton: React.CSSProperties = {
    background: 'transparent',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-default)',
    fontFamily: 'var(--font-ui)',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    padding: 'var(--space-3) var(--space-6)',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    transition: 'border-color 150ms ease, color 150ms ease, opacity 150ms ease',
  };

  // ── Completion screen ──
  if (done) {
    return (
      <div
        role="status"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-emphasis)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-12) var(--space-8)',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--accent-primary)',
            margin: '0 0 var(--space-4)',
          }}
        >
          Lesson complete
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-3xl)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            margin: '0 0 var(--space-4)',
          }}
        >
          {lesson.title}, understood.
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)',
            margin: '0 0 var(--space-8)',
          }}
        >
          {totalSteps} steps · {checksRight}/{totalChecks} checks right first try
          <CompletionXpLine />
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href={`/learn/${lesson.slug}`} className="btn-primary" style={{ textDecoration: 'none' }}>
            Read the full essay →
          </Link>
          <Link href="/learn" className="btn-ghost" style={{ textDecoration: 'none' }}>
            Back to Learn
          </Link>
        </div>
        <button
          onClick={reset}
          style={{
            background: 'transparent',
            color: 'var(--text-muted)',
            border: 'none',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.08em',
            cursor: 'pointer',
            marginTop: 'var(--space-8)',
            padding: 0,
          }}
        >
          start over ↺
        </button>
      </div>
    );
  }

  if (!step) return null;

  // ── Active step ──
  return (
    <div role="group" aria-label={`${lesson.title} interactive lesson`}>
      {/* Header: counter + reset */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--space-4)',
        }}
      >
        <span
          aria-live="polite"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            color: 'var(--text-muted)',
            letterSpacing: '0.08em',
          }}
        >
          Step {stepIndex + 1} of {totalSteps}
        </span>
        <button
          onClick={reset}
          style={{
            background: 'transparent',
            color: 'var(--text-muted)',
            border: 'none',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.08em',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          reset ↺
        </button>
      </div>

      {/* Progress dots — same visual language as ConceptDemo/StepThrough */}
      <div
        aria-hidden="true"
        style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}
      >
        {lesson.steps.map((s, i) => (
          <div
            key={s.id}
            style={{
              width: 6,
              height: 6,
              borderRadius: 'var(--radius-full)',
              background: i <= stepIndex ? 'var(--accent-primary)' : 'var(--bg-elevated)',
              transition: 'background 200ms ease',
            }}
          />
        ))}
      </div>

      {/* Step body */}
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-8)',
          minHeight: 320,
          overflow: 'hidden',
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={step.id} {...motionProps}>
            {step.kind === 'check' ? (
              <CheckQuestion
                prompt={step.prompt}
                choices={step.choices}
                selected={checkState?.selected ?? null}
                onSelect={selectChoice}
              />
            ) : (
              <>
                {step.kind === 'explain' && step.eyebrow && (
                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--text-muted)',
                      margin: '0 0 var(--space-4)',
                    }}
                  >
                    {step.eyebrow}
                  </p>
                )}
                <div
                  style={{
                    fontFamily: 'var(--font-editorial)',
                    fontSize: 'var(--text-lg)',
                    lineHeight: 1.8,
                    color: 'var(--text-primary)',
                    maxWidth: '58ch',
                  }}
                >
                  {step.body}
                </div>
                {step.demo && (
                  <div style={{ marginTop: 'var(--space-8)' }}>
                    <step.demo />
                    {step.kind === 'interact' && step.tryThis && (
                      <p
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 'var(--text-xs)',
                          letterSpacing: '0.05em',
                          color: 'var(--accent-secondary)',
                          margin: 'var(--space-4) 0 0',
                        }}
                      >
                        → {step.tryThis}
                      </p>
                    )}
                  </div>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer nav */}
      <div
        style={{
          display: 'flex',
          gap: 'var(--space-4)',
          marginTop: 'var(--space-6)',
          alignItems: 'center',
        }}
      >
        <button
          onClick={goBack}
          aria-disabled={stepIndex === 0}
          style={{
            ...navButton,
            opacity: stepIndex === 0 ? 0.4 : 1,
            cursor: stepIndex === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          ← Back
        </button>
        <button
          onClick={goNext}
          aria-disabled={!stepSolved}
          className={stepSolved ? 'btn-primary' : undefined}
          style={
            stepSolved
              ? undefined
              : { ...navButton, opacity: 0.4, cursor: 'not-allowed' }
          }
        >
          {isLast ? 'Finish' : 'Continue →'}
        </button>
        {step.kind === 'check' && !stepSolved && (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              color: 'var(--text-muted)',
              letterSpacing: '0.05em',
            }}
          >
            answer to continue
          </span>
        )}
      </div>
    </div>
  );
}
