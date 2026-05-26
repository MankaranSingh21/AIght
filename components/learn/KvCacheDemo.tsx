'use client';

import { useState } from 'react';
import StepThrough from './ConceptDemo/StepThrough';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type Mode = 'naive' | 'cached';

interface StepConfig {
  title: string;
  naive: string;
  cached: string;
  /** How many tokens are in the sequence at this step (for visualization) */
  tokenCount: number;
  /** Index of the "current" (newly computed) token, 0-based */
  currentIdx: number;
  /** Show abbreviated view (step 5 — 100 tokens) */
  abbreviated?: boolean;
  /** Show bar chart instead of circles (step 6) */
  comparisonChart?: boolean;
}

const STEPS: StepConfig[] = [
  {
    title: "Generate token 1: 'The'",
    naive: "Compute K, V for 'The' from scratch.",
    cached: "Same — first token, nothing to cache yet.",
    tokenCount: 1,
    currentIdx: 0,
  },
  {
    title: "Generate token 2: 'cat'",
    naive: "Recompute K, V for 'The' AND 'cat'. Attention over 2 tokens.",
    cached: "K, V for 'The' is cached. Compute only 'cat's. Attention over 2 tokens.",
    tokenCount: 2,
    currentIdx: 1,
  },
  {
    title: "Generate token 3: 'sat'",
    naive: "Recompute K, V for 'The', 'cat', 'sat'. Attention over 3 tokens.",
    cached: "K, V for 'The', 'cat' cached. Compute only 'sat's. Attention over 3 tokens.",
    tokenCount: 3,
    currentIdx: 2,
  },
  {
    title: "Generate token 4: 'on'",
    naive: "Recompute K, V for ALL 4 tokens.",
    cached: "K, V cached for 3 tokens. Compute only 'on's K, V.",
    tokenCount: 4,
    currentIdx: 3,
  },
  {
    title: "Skip ahead: token 100.",
    naive: "100 recomputations of K, V on each step. 100 × 100 = 10,000 FLOPs in attention.",
    cached: "99 K, V vectors cached. Compute only token 100's. 100 attention operations.",
    tokenCount: 100,
    currentIdx: 99,
    abbreviated: true,
  },
  {
    title: "The savings.",
    naive: "Total work: O(n²) for n tokens. Grows quadratically.",
    cached: "Total work: O(n) for n tokens. Grows linearly. ~100× less compute by token 100.",
    tokenCount: 100,
    currentIdx: 99,
    comparisonChart: true,
  },
];

const TOKEN_LABELS = ["'The'", "'cat'", "'sat'", "'on'"];

// ---------------------------------------------------------------------------
// TokenCircle — individual token visualization
// ---------------------------------------------------------------------------
type CircleState = 'current' | 'cached' | 'recomputed';

function TokenCircle({
  state,
  label,
  cx,
  cy,
  r,
}: {
  state: CircleState;
  label?: string;
  cx: number;
  cy: number;
  r: number;
}) {
  let fill = 'var(--bg-elevated)';
  let stroke = 'var(--text-muted)';
  let strokeWidth = 1;
  let filter: string | undefined;

  if (state === 'current') {
    fill = 'rgba(170,255,77,0.10)';
    stroke = 'var(--accent-primary)';
    strokeWidth = 2;
    filter = 'drop-shadow(0 0 6px rgba(170,255,77,0.40))';
  } else if (state === 'recomputed') {
    fill = 'rgba(244,171,31,0.10)';
    stroke = 'var(--accent-warm)';
    strokeWidth = 1.5;
  }
  // 'cached' keeps the defaults: dim bg + muted border

  return (
    <g filter={filter}>
      <circle cx={cx} cy={cy} r={r} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
      {label && state !== 'cached' && (
        <text
          x={cx}
          y={cy + 4}
          textAnchor="middle"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            fill: state === 'current' ? 'var(--accent-primary)' : 'var(--accent-warm)',
          }}
        >
          {label}
        </text>
      )}
      {state === 'cached' && (
        <text
          x={cx}
          y={cy + 3}
          textAnchor="middle"
          style={{ fontFamily: 'var(--font-mono)', fontSize: 7, fill: 'var(--text-muted)' }}
        >
          ✓
        </text>
      )}
    </g>
  );
}

// ---------------------------------------------------------------------------
// SequenceViz — the SVG showing token states for steps 1-4
// ---------------------------------------------------------------------------
function SequenceViz({
  step,
  mode,
}: {
  step: StepConfig;
  mode: Mode;
}) {
  const { tokenCount, currentIdx, abbreviated, comparisonChart } = step;

  if (comparisonChart) {
    return <ComparisonChart />;
  }

  const r = 20;
  const spacing = 54;
  const cy = 40;

  if (abbreviated) {
    // Show 4 prior tokens + ellipsis + token 100
    const abbrevCount = 5; // 4 shown + 1 current
    const totalWidth = (abbrevCount + 1) * spacing + 50; // +1 for ellipsis gap
    const svgWidth = totalWidth;

    return (
      <svg
        viewBox={`0 0 ${svgWidth} 80`}
        width="100%"
        aria-label="Token sequence visualization — abbreviated to 100 tokens"
        style={{ maxHeight: 80 }}
      >
        {/* First 4 tokens */}
        {[0, 1, 2, 3].map((i) => {
          const cx = r + i * spacing;
          const state: CircleState =
            mode === 'naive' ? 'recomputed' : 'cached';
          return (
            <TokenCircle
              key={i}
              state={state}
              cx={cx}
              cy={cy}
              r={r}
            />
          );
        })}
        {/* Ellipsis */}
        <text
          x={r + 4 * spacing}
          y={cy + 5}
          textAnchor="middle"
          style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fill: 'var(--text-muted)' }}
        >
          …
        </text>
        {/* Token 100 */}
        <TokenCircle
          state="current"
          label="K,V"
          cx={r + 5 * spacing + 10}
          cy={cy}
          r={r}
        />
        {/* Labels */}
        <text x={r} y={75} textAnchor="middle" style={{ fontFamily: 'var(--font-mono)', fontSize: 8, fill: 'var(--text-muted)' }}>
          1
        </text>
        <text x={r + 5 * spacing + 10} y={75} textAnchor="middle" style={{ fontFamily: 'var(--font-mono)', fontSize: 8, fill: 'var(--text-muted)' }}>
          100
        </text>
      </svg>
    );
  }

  // Normal steps 1-4
  const svgWidth = tokenCount * spacing + r * 2;

  return (
    <svg
      viewBox={`0 0 ${svgWidth} 80`}
      width="100%"
      aria-label={`Token sequence: ${tokenCount} token${tokenCount !== 1 ? 's' : ''}`}
      style={{ maxHeight: 80 }}
    >
      {Array.from({ length: tokenCount }, (_, i) => {
        const cx = r + i * spacing;
        let state: CircleState;
        const isCurrent = i === currentIdx;

        if (isCurrent) {
          state = 'current';
        } else if (mode === 'naive') {
          state = 'recomputed';
        } else {
          state = 'cached';
        }

        const label = isCurrent ? 'K,V' : undefined;
        const wordLabel = TOKEN_LABELS[i];

        return (
          <g key={i}>
            <TokenCircle state={state} label={label} cx={cx} cy={35} r={r} />
            {wordLabel && (
              <text
                x={cx}
                y={75}
                textAnchor="middle"
                style={{ fontFamily: 'var(--font-mono)', fontSize: 8, fill: 'var(--text-muted)' }}
              >
                {wordLabel}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// ComparisonChart — step 6 horizontal bar comparison
// ---------------------------------------------------------------------------
function ComparisonChart() {
  return (
    <div
      aria-label="Compute comparison chart: naïve vs cached"
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent-warm)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Naïve — O(n²)
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>10,000 ops</span>
        </div>
        <div style={{ height: 28, background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
          <div style={{
            height: '100%',
            width: '100%',
            background: 'linear-gradient(90deg, rgba(244,171,31,0.40), rgba(244,171,31,0.20))',
            borderRight: '2px solid var(--accent-warm)',
          }} />
        </div>
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent-primary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            With KV Cache — O(n)
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>100 ops</span>
        </div>
        <div style={{ height: 28, background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
          <div style={{
            height: '100%',
            width: '10%',
            background: 'linear-gradient(90deg, rgba(170,255,77,0.40), rgba(170,255,77,0.20))',
            borderRight: '2px solid var(--accent-primary)',
          }} />
        </div>
      </div>
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        color: 'var(--text-muted)',
        letterSpacing: '0.04em',
        marginTop: 'var(--space-1)',
      }}>
        At n=100 tokens: naïve = 100×100 = 10,000 attention ops · cached = 100
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ModeToggle
// ---------------------------------------------------------------------------
function ModeToggle({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  const baseStyle: React.CSSProperties = {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    letterSpacing: '0.06em',
    padding: 'var(--space-2) var(--space-4)',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    transition: 'border-color 150ms ease, color 150ms ease, background 150ms ease',
    background: 'transparent',
    lineHeight: 1.4,
  };

  const activeStyle: React.CSSProperties = {
    ...baseStyle,
    border: '1px solid var(--accent-primary)',
    color: 'var(--accent-primary)',
  };

  const inactiveStyle: React.CSSProperties = {
    ...baseStyle,
    border: '1px solid var(--border-default)',
    color: 'var(--text-secondary)',
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: 'var(--space-2)',
        flexWrap: 'wrap',
        marginBottom: 'var(--space-5)',
      }}
      role="group"
      aria-label="Mode toggle"
    >
      <button
        onClick={() => onChange('naive')}
        aria-pressed={mode === 'naive'}
        style={mode === 'naive' ? activeStyle : inactiveStyle}
      >
        NAÏVE (no cache)
      </button>
      <button
        onClick={() => onChange('cached')}
        aria-pressed={mode === 'cached'}
        style={mode === 'cached' ? activeStyle : inactiveStyle}
      >
        WITH KV CACHE
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function KvCacheDemo() {
  const [activeStep, setActiveStep] = useState(0);
  const [mode, setMode] = useState<Mode>('naive');

  const step = STEPS[activeStep];
  const description = mode === 'naive' ? step.naive : step.cached;

  const handleReset = () => {
    setActiveStep(0);
    setMode('naive');
  };

  return (
    <StepThrough
      ariaLabel="KV cache step-by-step demo"
      totalSteps={6}
      activeStep={activeStep}
      onNext={() => setActiveStep((s) => Math.min(5, s + 1))}
      onBack={() => setActiveStep((s) => Math.max(0, s - 1))}
      onReset={handleReset}
    >
      {/* Mode toggle — persists across steps */}
      <ModeToggle mode={mode} onChange={setMode} />

      {/* Step title */}
      <p
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 20,
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: 'var(--space-2)',
          letterSpacing: '-0.02em',
        }}
      >
        {step.title}
      </p>

      {/* Description — mode-dependent, aria-live for accessibility */}
      <p
        aria-live="polite"
        style={{
          fontFamily: 'var(--font-editorial)',
          fontStyle: 'italic',
          fontSize: 14,
          color: 'var(--text-secondary)',
          marginBottom: 'var(--space-5)',
          lineHeight: 1.6,
        }}
      >
        {description}
      </p>

      {/* Visualization */}
      <div
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-5)',
        }}
      >
        <SequenceViz step={step} mode={mode} />
      </div>

      {/* Legend */}
      {!step.comparisonChart && (
        <div
          aria-hidden="true"
          style={{
            display: 'flex',
            gap: 'var(--space-5)',
            flexWrap: 'wrap',
            marginTop: 'var(--space-3)',
          }}
        >
          <LegendItem color="var(--accent-primary)" label="Computing now" />
          {mode === 'naive' ? (
            <LegendItem color="var(--accent-warm)" label="Recomputed" />
          ) : (
            <LegendItem color="var(--text-muted)" label="Cached (free)" />
          )}
        </div>
      )}
    </StepThrough>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: 'var(--radius-full)',
          border: `2px solid ${color}`,
          flexShrink: 0,
        }}
      />
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
        {label}
      </span>
    </div>
  );
}
