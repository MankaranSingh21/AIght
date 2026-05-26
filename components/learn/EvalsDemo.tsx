'use client';

import { useState } from 'react';
import { StepThrough } from './ConceptDemo';

// ── Data ──────────────────────────────────────────────────────────────────────

interface QAPair {
  question: string;
  expected: string;
  modelAnswer?: string;
  correct?: boolean;
}

const BENCHMARK: QAPair[] = [
  { question: 'Capital of Japan?', expected: 'Tokyo' },
  { question: 'sqrt(144)?', expected: '12' },
  { question: '"Hamlet" author?', expected: 'Shakespeare' },
  { question: '3 × 7 × 2?', expected: '42' },
  { question: 'Boiling point of water (°C)?', expected: '100' },
];

const MODEL_ANSWERS: QAPair[] = [
  { question: 'Capital of Japan?', expected: 'Tokyo', modelAnswer: 'Tokyo', correct: true },
  { question: 'sqrt(144)?', expected: '12', modelAnswer: '12', correct: true },
  { question: '"Hamlet" author?', expected: 'Shakespeare', modelAnswer: 'Marlowe', correct: false },
  { question: '3 × 7 × 2?', expected: '42', modelAnswer: '42', correct: true },
  { question: 'Boiling point of water (°C)?', expected: '100', modelAnswer: '100', correct: true },
];

interface ModelScore {
  name: string;
  score: number;
  highlight?: boolean;
}

const LEADERBOARD: ModelScore[] = [
  { name: 'GPT-4o', score: 92 },
  { name: 'Claude 3.5', score: 89 },
  { name: 'Gemini 1.5', score: 85 },
  { name: 'Llama 70B', score: 82 },
  { name: 'Your model', score: 80, highlight: true },
];

// ── Step bodies ────────────────────────────────────────────────────────────────

function Step1() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <p
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 'var(--text-sm)',
          fontWeight: 600,
          color: 'var(--text-primary)',
          margin: 0,
        }}
      >
        Benchmark dataset
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {BENCHMARK.map((row, i) => (
          <div
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              gap: 'var(--space-4)',
              alignItems: 'center',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-3) var(--space-4)',
            }}
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
              {row.question}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                color: 'var(--accent-primary)',
                background: 'var(--accent-primary-glow)',
                border: '1px solid var(--border-emphasis)',
                borderRadius: 'var(--radius-sm)',
                padding: '2px var(--space-2)',
                whiteSpace: 'nowrap',
              }}
            >
              {row.expected}
            </span>
          </div>
        ))}
      </div>
      <p
        style={{
          fontFamily: 'var(--font-editorial)',
          fontStyle: 'italic',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)',
          margin: 0,
          lineHeight: 1.65,
        }}
      >
        5 questions, 5 pre-labelled ground-truth answers. Every model sees the same 5.
      </p>
    </div>
  );
}

function Step2() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <p
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 'var(--text-sm)',
          fontWeight: 600,
          color: 'var(--text-primary)',
          margin: 0,
        }}
      >
        Model generates answers
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {MODEL_ANSWERS.map((row, i) => (
          <div
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto auto',
              gap: 'var(--space-3)',
              alignItems: 'center',
              background: 'var(--bg-elevated)',
              border: `1px solid ${row.correct ? 'var(--border-subtle)' : 'rgba(224,112,112,0.3)'}`,
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-3) var(--space-4)',
            }}
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
              {row.question}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
              → {row.modelAnswer}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                color: row.correct ? 'var(--accent-primary)' : 'var(--error)',
              }}
              aria-label={row.correct ? 'correct' : 'incorrect'}
            >
              {row.correct ? '✓' : '✗'}
            </span>
          </div>
        ))}
      </div>
      <p
        style={{
          fontFamily: 'var(--font-editorial)',
          fontStyle: 'italic',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)',
          margin: 0,
          lineHeight: 1.65,
        }}
      >
        The model answered 4 correctly, missed 1. The grader hasn't run yet — these are raw outputs.
      </p>
    </div>
  );
}

function Step3() {
  const correct = MODEL_ANSWERS.filter(r => r.correct).length;
  const total = MODEL_ANSWERS.length;
  const pct = Math.round((correct / total) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      <p
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 'var(--text-sm)',
          fontWeight: 600,
          color: 'var(--text-primary)',
          margin: 0,
        }}
      >
        Grader checks
      </p>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-6)',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-6)',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', flex: 1, minWidth: 140 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Automated comparison
          </span>
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginTop: 'var(--space-2)' }}>
            {MODEL_ANSWERS.map((r, i) => (
              <span
                key={i}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  color: r.correct ? 'var(--accent-primary)' : 'var(--error)',
                }}
              >
                {r.correct ? '✓' : '✗'}
              </span>
            ))}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-4xl)',
              fontWeight: 700,
              color: 'var(--accent-primary)',
              lineHeight: 1,
              letterSpacing: '-0.03em',
            }}
          >
            {pct}%
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
            {correct}/{total} correct
          </span>
        </div>
      </div>
      <p
        style={{
          fontFamily: 'var(--font-editorial)',
          fontStyle: 'italic',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)',
          margin: 0,
          lineHeight: 1.65,
        }}
      >
        Exact-match grader runs in milliseconds. The score is just the ratio that matched.
      </p>
    </div>
  );
}

function Step4() {
  const maxScore = Math.max(...LEADERBOARD.map(m => m.score));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <p
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 'var(--text-sm)',
          fontWeight: 600,
          color: 'var(--text-primary)',
          margin: 0,
        }}
      >
        Leaderboard
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {LEADERBOARD.map(model => {
          const barWidth = (model.score / maxScore) * 100;
          return (
            <div
              key={model.name}
              style={{
                display: 'grid',
                gridTemplateColumns: '110px 1fr 44px',
                gap: 'var(--space-3)',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  color: model.highlight ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  textAlign: 'right',
                }}
              >
                {model.name}
              </span>
              <div
                style={{
                  background: 'var(--bg-elevated)',
                  borderRadius: 'var(--radius-sm)',
                  height: 18,
                  overflow: 'hidden',
                  border: '1px solid var(--border-subtle)',
                }}
                aria-label={`${model.name}: ${model.score}%`}
              >
                <div
                  style={{
                    width: `${barWidth}%`,
                    height: '100%',
                    background: model.highlight ? 'var(--accent-primary)' : 'var(--accent-secondary)',
                    opacity: model.highlight ? 1 : 0.55,
                    borderRadius: 'var(--radius-sm)',
                    transition: 'width 400ms ease',
                  }}
                />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  color: model.highlight ? 'var(--accent-primary)' : 'var(--text-muted)',
                }}
              >
                {model.score}%
              </span>
            </div>
          );
        })}
      </div>
      <p
        style={{
          fontFamily: 'var(--font-editorial)',
          fontStyle: 'italic',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)',
          margin: 0,
          lineHeight: 1.65,
        }}
      >
        Same questions for every model. Same grader. The leaderboard is what falls out.
      </p>
    </div>
  );
}

const STEPS = [Step1, Step2, Step3, Step4];

// ── Main component ─────────────────────────────────────────────────────────────

export default function EvalsDemo() {
  const [activeStep, setActiveStep] = useState(0);
  const StepBody = STEPS[activeStep];

  return (
    <StepThrough
      ariaLabel="Evals pipeline"
      totalSteps={STEPS.length}
      activeStep={activeStep}
      onNext={() => setActiveStep(s => Math.min(s + 1, STEPS.length - 1))}
      onBack={() => setActiveStep(s => Math.max(s - 1, 0))}
      onReset={() => setActiveStep(0)}
    >
      <div style={{ minHeight: 300 }}>
        <StepBody />
      </div>
    </StepThrough>
  );
}
