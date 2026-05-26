'use client';

import { useState } from 'react';
import StepThrough from './ConceptDemo/StepThrough';

// Precomputed loss curve points for each step
// [x, y] pairs where x=0..1 and y=loss (higher = worse)
const CURVE_POINTS: Array<Array<[number, number]>> = [
  // Step 0: Pretraining — loss drops sharply from high
  [
    [0, 0.95], [0.05, 0.88], [0.12, 0.78], [0.2, 0.68],
    [0.3, 0.58], [0.42, 0.5], [0.55, 0.43], [0.7, 0.38],
    [0.85, 0.34], [1, 0.31],
  ],
  // Step 1: SFT — continues from pretraining end, drops further
  [
    [0, 0.31], [0.1, 0.27], [0.22, 0.23], [0.38, 0.20],
    [0.55, 0.18], [0.72, 0.165], [0.88, 0.155], [1, 0.15],
  ],
  // Step 2: RLHF — slight dip then plateau, then refinement
  [
    [0, 0.15], [0.12, 0.145], [0.28, 0.142], [0.45, 0.140],
    [0.62, 0.138], [0.78, 0.133], [0.9, 0.128], [1, 0.125],
  ],
  // Step 3: Final — just the flat plateau (static diagram shown instead)
  [
    [0, 0.125], [0.5, 0.124], [1, 0.123],
  ],
];

const STEPS = [
  {
    title: 'Phase 1 — Pretraining',
    subtitle: 'The raw foundation',
    description:
      'The model sees trillions of tokens from the web, books, and code. One job: predict the next token. Loss falls steeply as weights learn language structure.',
    curveColor: 'var(--accent-primary)',
    phaseLabel: 'TRILLIONS OF TOKENS',
  },
  {
    title: 'Phase 2 — Supervised Fine-Tuning',
    subtitle: 'Teaching the format',
    description:
      'Human-written (prompt, response) pairs replace the raw text corpus. The model learns to respond rather than continue. Loss drops further on this narrower distribution.',
    curveColor: 'var(--accent-secondary)',
    phaseLabel: 'CURATED PAIRS',
  },
  {
    title: 'Phase 3 — RLHF',
    subtitle: 'Teaching preferences',
    description:
      'Human raters compare model outputs. A reward model learns those preferences and guides the policy toward responses people actually rate higher. Loss plateaus then refines.',
    curveColor: 'var(--accent-warm)',
    phaseLabel: 'HUMAN RATINGS',
  },
  {
    title: 'Final Model',
    subtitle: 'Three stages, one artifact',
    description:
      'Each phase contributed something distinct. The result is a model that knows language, follows instructions, and behaves in ways humans prefer.',
    curveColor: 'var(--accent-primary)',
    phaseLabel: 'DEPLOYED',
  },
];

const SVG_W = 400;
const SVG_H = 160;
const PAD = { top: 16, right: 12, bottom: 32, left: 44 };
const PLOT_W = SVG_W - PAD.left - PAD.right;
const PLOT_H = SVG_H - PAD.top - PAD.bottom;

function pointsToPath(pts: Array<[number, number]>): string {
  return pts
    .map(([x, y], i) => {
      const px = PAD.left + x * PLOT_W;
      const py = PAD.top + (1 - y) * PLOT_H;
      return `${i === 0 ? 'M' : 'L'}${px.toFixed(1)},${py.toFixed(1)}`;
    })
    .join(' ');
}

// All previous phases composited for the final step
const PHASE_COLORS = [
  'var(--accent-primary)',
  'var(--accent-secondary)',
  'var(--accent-warm)',
];

const PHASE_LABELS = ['Pretraining', 'SFT', 'RLHF'];

// Concatenated x-offset for full timeline view in final step
const FULL_CURVES: Array<{ pts: Array<[number, number]>; color: string; label: string }> = (() => {
  const segments = [0, 1, 2];
  const totalLen = 3;
  return segments.map((si) => {
    const startX = si / totalLen;
    const segW = 1 / totalLen;
    const pts: Array<[number, number]> = CURVE_POINTS[si].map(([x, y]) => [
      startX + x * segW,
      y,
    ]);
    return { pts, color: PHASE_COLORS[si], label: PHASE_LABELS[si] };
  });
})();

export default function TrainingDemo() {
  const [activeStep, setActiveStep] = useState(0);

  const step = STEPS[activeStep];
  const isFinal = activeStep === 3;
  const pts = CURVE_POINTS[activeStep];
  const pathD = pointsToPath(pts);

  // Y axis ticks
  const yTicks = [0, 0.25, 0.5, 0.75, 1.0];

  return (
    <StepThrough
      ariaLabel="Training pipeline stages"
      totalSteps={4}
      activeStep={activeStep}
      onNext={() => setActiveStep((s) => Math.min(3, s + 1))}
      onBack={() => setActiveStep((s) => Math.max(0, s - 1))}
      onReset={() => setActiveStep(0)}
    >
      <style>{`
        @keyframes drawPath {
          from { stroke-dashoffset: 1200; }
          to   { stroke-dashoffset: 0; }
        }
        .training-path {
          stroke-dasharray: 1200;
          stroke-dashoffset: 0;
          animation: drawPath 700ms cubic-bezier(0.16,1,0.3,1) both;
        }
        @media (max-width: 640px) {
          .training-meta { flex-direction: column !important; }
        }
      `}</style>

      {/* Step header */}
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: 20,
          fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
          margin: '0 0 var(--space-1)',
        }}>
          {step.title}
        </p>
        <p style={{
          fontFamily: 'var(--font-editorial)',
          fontStyle: 'italic',
          fontSize: 14,
          color: 'var(--text-secondary)',
          margin: 0,
          lineHeight: 1.6,
        }}>
          {step.subtitle}
        </p>
      </div>

      {/* Loss curve SVG */}
      <div
        aria-label={isFinal ? 'Full training pipeline loss curve' : `Loss curve for ${step.title}`}
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-3)',
          marginBottom: 'var(--space-4)',
          overflowX: 'auto',
        }}
      >
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          width="100%"
          style={{ display: 'block', minWidth: 260 }}
          aria-hidden="true"
        >
          {/* Grid lines */}
          {yTicks.map((t) => {
            const y = PAD.top + (1 - t) * PLOT_H;
            return (
              <g key={t}>
                <line
                  x1={PAD.left} y1={y}
                  x2={PAD.left + PLOT_W} y2={y}
                  stroke="var(--border-subtle)"
                  strokeWidth={0.5}
                />
                <text
                  x={PAD.left - 6}
                  y={y + 4}
                  textAnchor="end"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fill: 'var(--text-muted)' }}
                >
                  {t.toFixed(2)}
                </text>
              </g>
            );
          })}

          {/* Axis labels */}
          <text
            x={PAD.left - 32}
            y={PAD.top + PLOT_H / 2}
            textAnchor="middle"
            transform={`rotate(-90, ${PAD.left - 32}, ${PAD.top + PLOT_H / 2})`}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fill: 'var(--text-muted)', letterSpacing: '0.04em' }}
          >
            LOSS
          </text>
          <text
            x={PAD.left + PLOT_W / 2}
            y={SVG_H - 4}
            textAnchor="middle"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fill: 'var(--text-muted)', letterSpacing: '0.04em' }}
          >
            {isFinal ? 'TRAINING PROGRESS →' : 'TRAINING STEPS →'}
          </text>

          {/* Final view: all three phases concatenated */}
          {isFinal && FULL_CURVES.map(({ pts: fpts, color, label }, fi) => {
            const startX = (fi / 3) * PLOT_W + PAD.left;
            const midX = ((fi + 0.5) / 3) * PLOT_W + PAD.left;
            return (
              <g key={fi}>
                <path
                  d={pointsToPath(fpts)}
                  fill="none"
                  stroke={color}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="training-path"
                  style={{ animationDelay: `${fi * 180}ms` }}
                />
                {/* Phase divider */}
                {fi > 0 && (
                  <line
                    x1={startX} y1={PAD.top}
                    x2={startX} y2={PAD.top + PLOT_H}
                    stroke="var(--border-default)"
                    strokeWidth={1}
                    strokeDasharray="3 3"
                  />
                )}
                {/* Phase label */}
                <text
                  x={midX}
                  y={PAD.top + PLOT_H + 16}
                  textAnchor="middle"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', fill: color, letterSpacing: '0.04em' }}
                >
                  {label.toUpperCase()}
                </text>
              </g>
            );
          })}

          {/* Single phase curve */}
          {!isFinal && (
            <path
              key={activeStep}
              d={pathD}
              fill="none"
              stroke={step.curveColor}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="training-path"
            />
          )}
        </svg>
      </div>

      {/* Meta row */}
      <div
        className="training-meta"
        style={{
          display: 'flex',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-4)',
          alignItems: 'flex-start',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: isFinal ? 'var(--accent-primary)' : step.curveColor,
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '2px 8px',
            whiteSpace: 'nowrap',
          }}
        >
          {step.phaseLabel}
        </span>
      </div>

      <p style={{
        fontFamily: 'var(--font-editorial)',
        fontSize: 14,
        color: 'var(--text-secondary)',
        lineHeight: 1.75,
        margin: 0,
      }}
        aria-live="polite"
      >
        {step.description}
      </p>
    </StepThrough>
  );
}
