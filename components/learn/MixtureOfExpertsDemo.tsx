'use client';

import { useState } from 'react';

// ── Constants ─────────────────────────────────────────────────────────────────

const TOTAL_EXPERTS = 8;
const ACTIVE_EXPERTS = [2, 5]; // 0-indexed, always the "selected" pair

interface Step {
  id: number;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    id: 0,
    title: '8 experts in the layer',
    description: 'Every feed-forward block contains N specialist networks. At rest, none are active.',
  },
  {
    id: 1,
    title: 'Token enters',
    description: 'A single token arrives at this layer. The router network prepares to decide.',
  },
  {
    id: 2,
    title: 'Router picks top-2 experts',
    description: '2 of the 8 experts are selected — based on a learned gating score for this token.',
  },
  {
    id: 3,
    title: 'Outputs combine',
    description: 'The two experts compute independently. Their outputs are weighted-summed into a single vector.',
  },
];

// ── Expert node SVG ───────────────────────────────────────────────────────────

interface ExpertNodeProps {
  index: number;
  step: number;
}

function ExpertNode({ index, step }: ExpertNodeProps) {
  const isActive = ACTIVE_EXPERTS.includes(index);
  const showActive = step >= 2 && isActive;
  const showDim = step >= 2 && !isActive;

  const bg = showActive
    ? 'var(--accent-primary-glow)'
    : 'var(--bg-elevated)';
  const border = showActive
    ? '2px solid var(--accent-primary)'
    : showDim
    ? '1px solid var(--border-subtle)'
    : '1px solid var(--border-default)';
  const textColor = showActive
    ? 'var(--accent-primary)'
    : showDim
    ? 'var(--text-muted)'
    : 'var(--text-secondary)';
  const opacity = showDim ? 0.4 : 1;

  return (
    <div
      role="img"
      aria-label={`Expert ${index + 1}${showActive ? ' — selected' : ''}`}
      style={{
        width: 56,
        height: 56,
        borderRadius: 'var(--radius-md)',
        background: bg,
        border,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        opacity,
        transition: 'all 250ms cubic-bezier(0.16,1,0.3,1)',
        flexShrink: 0,
      }}
    >
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        color: textColor,
        letterSpacing: '0.04em',
        transition: 'color 250ms ease',
      }}>
        E{index + 1}
      </span>
      {showActive && (
        <span style={{
          width: 6,
          height: 6,
          borderRadius: 'var(--radius-full)',
          background: 'var(--accent-primary)',
          display: 'block',
        }} />
      )}
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function MixtureOfExpertsDemo() {
  const [step, setStep] = useState(0);

  const current = STEPS[step];
  const isFirst = step === 0;
  const isLast = step === STEPS.length - 1;

  const navBtn: React.CSSProperties = {
    background: 'transparent',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-default)',
    fontFamily: 'var(--font-ui)',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    padding: 'var(--space-3) var(--space-6)',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    transition: 'border-color 150ms ease, color 150ms ease',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      {/* Step counter + dots */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span aria-live="polite" style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          color: 'var(--text-muted)',
          letterSpacing: '0.08em',
        }}>
          Step {step + 1} of {STEPS.length}
        </span>
        <button
          onClick={() => setStep(0)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            cursor: 'pointer',
          }}
        >
          reset ↺
        </button>
      </div>

      {/* Progress dots */}
      <div aria-hidden="true" style={{ display: 'flex', gap: 'var(--space-2)' }}>
        {STEPS.map((_, i) => (
          <div key={i} style={{
            width: 6, height: 6,
            borderRadius: 'var(--radius-full)',
            background: i <= step ? 'var(--accent-primary)' : 'var(--bg-elevated)',
            transition: 'background 200ms ease',
          }} />
        ))}
      </div>

      {/* Step title + description */}
      <div>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: 18,
          fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
          margin: '0 0 var(--space-1)',
        }}>
          {current.title}
        </p>
        <p style={{
          fontFamily: 'var(--font-editorial)',
          fontStyle: 'italic',
          fontSize: 14,
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          margin: 0,
        }}>
          {current.description}
        </p>
      </div>

      {/* Expert grid */}
      <div style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-5)',
      }}>
        {/* Token chip + router (steps 1-3) */}
        {step >= 1 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            marginBottom: 'var(--space-4)',
            flexWrap: 'wrap',
          }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(0,255,209,0.10)',
              border: '1px solid rgba(0,255,209,0.28)',
              color: 'var(--accent-secondary)',
            }}>
              token
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>→</span>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(244,171,31,0.10)',
              border: '1px solid rgba(244,171,31,0.28)',
              color: 'var(--accent-warm)',
            }}>
              router
            </div>
            {step >= 2 && (
              <>
                <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>→</span>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--accent-primary)',
                  letterSpacing: '0.04em',
                }}>
                  top-2 selected
                </span>
              </>
            )}
          </div>
        )}

        {/* Expert nodes row */}
        <div style={{
          display: 'flex',
          gap: 'var(--space-2)',
          flexWrap: 'wrap',
        }}>
          {Array.from({ length: TOTAL_EXPERTS }, (_, i) => (
            <ExpertNode key={i} index={i} step={step} />
          ))}
        </div>

        {/* Combine output (step 3) */}
        {step === 3 && (
          <div style={{
            marginTop: 'var(--space-4)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            flexWrap: 'wrap',
          }}>
            <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>E3 · 0.6 + E6 · 0.4 →</span>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              padding: '4px 12px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--accent-primary-glow)',
              border: '1px solid var(--border-emphasis)',
              color: 'var(--accent-primary)',
            }}>
              output vector
            </div>
          </div>
        )}
      </div>

      {/* Side caption */}
      <p style={{
        fontFamily: 'var(--font-editorial)',
        fontStyle: 'italic',
        fontSize: 'var(--text-sm)',
        color: 'var(--accent-warm)',
        borderLeft: '2px solid var(--accent-warm)',
        paddingLeft: 'var(--space-4)',
        lineHeight: 1.65,
        margin: 0,
      }}>
        All 8 experts exist; only 2 fire. Sparse compute, dense capability.
      </p>

      {/* Nav buttons */}
      <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          aria-disabled={isFirst}
          style={{ ...navBtn, opacity: isFirst ? 0.4 : 1, cursor: isFirst ? 'not-allowed' : 'pointer' }}
        >
          ← Back
        </button>
        <button
          onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
          aria-disabled={isLast}
          style={{ ...navBtn, opacity: isLast ? 0.4 : 1, cursor: isLast ? 'not-allowed' : 'pointer' }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
