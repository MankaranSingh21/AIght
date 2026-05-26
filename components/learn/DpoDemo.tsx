'use client';

import Compare, { PanelLabel } from './ConceptDemo/Compare';

interface PipelineStep {
  label: string;
  sub?: string;
  accent?: boolean;
}

const RLHF_STEPS: PipelineStep[] = [
  { label: 'Collect preferences', sub: '(preferred, rejected) pairs', accent: false },
  { label: 'Train reward model', sub: 'separate classifier on pairs', accent: false },
  { label: 'PPO loop', sub: 'RL fine-tuning against reward model', accent: false },
  { label: 'Final aligned policy', sub: 'the language model you deploy', accent: true },
];

const DPO_STEPS: PipelineStep[] = [
  { label: 'Collect preferences', sub: '(preferred, rejected) pairs', accent: false },
  { label: 'Direct optimization', sub: 'derived loss on preference pairs', accent: false },
  { label: 'Final aligned policy', sub: 'the language model you deploy', accent: true },
];

function PipelineBox({ step, index, total, color }: {
  step: PipelineStep;
  index: number;
  total: number;
  color: string;
}) {
  const isLast = index === total - 1;
  return (
    <div>
      <div
        role="listitem"
        style={{
          background: step.accent ? 'var(--accent-primary-glow)' : 'var(--bg-elevated)',
          border: `1px solid ${step.accent ? 'var(--border-emphasis)' : 'var(--border-subtle)'}`,
          borderLeft: `3px solid ${color}`,
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-3) var(--space-4)',
        }}
      >
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: step.accent ? 'var(--accent-primary)' : 'var(--text-primary)',
          letterSpacing: '0.04em',
          margin: 0,
          fontWeight: 500,
        }}>
          {step.label}
        </p>
        {step.sub && (
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            color: 'var(--text-muted)',
            letterSpacing: '0.04em',
            margin: '2px 0 0',
          }}>
            {step.sub}
          </p>
        )}
      </div>
      {!isLast && (
        <div style={{
          textAlign: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          color: 'var(--text-muted)',
          lineHeight: 2,
          userSelect: 'none',
        }} aria-hidden="true">
          ↓
        </div>
      )}
    </div>
  );
}

export default function DpoDemo() {
  return (
    <Compare ariaLabel="DPO vs RLHF pipeline comparison" panelLabels={['RLHF', 'DPO']}>
      <style>{`
        .dpo-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-5);
          align-items: start;
        }
        @media (max-width: 640px) {
          .dpo-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Shared origin */}
      <div style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-3) var(--space-4)',
        textAlign: 'center',
        marginBottom: 'var(--space-2)',
      }}>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--text-muted)',
          letterSpacing: '0.06em',
          margin: '0 0 2px',
        }}>
          SHARED STARTING POINT
        </p>
        <p style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 13,
          color: 'var(--text-primary)',
          fontWeight: 500,
          margin: 0,
        }}>
          Human preference data
        </p>
      </div>

      {/* Shared origin → two paths */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        color: 'var(--text-muted)',
        marginBottom: 'var(--space-2)',
        userSelect: 'none',
      }} aria-hidden="true">
        <span>↙</span>
        <span>↘</span>
      </div>

      {/* Two-column pipelines */}
      <div className="dpo-grid">
        {/* RLHF column */}
        <div role="list" aria-label="RLHF pipeline steps">
          <PanelLabel>RLHF — 4 steps</PanelLabel>
          {RLHF_STEPS.map((step, i) => (
            <PipelineBox
              key={i}
              step={step}
              index={i}
              total={RLHF_STEPS.length}
              color="var(--accent-secondary)"
            />
          ))}
          {/* Step count badge */}
          <div style={{
            marginTop: 'var(--space-3)',
            display: 'flex',
            gap: 'var(--space-2)',
            flexWrap: 'wrap',
          }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              color: 'var(--text-muted)',
              letterSpacing: '0.06em',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '2px 6px',
            }}>
              SEPARATE REWARD MODEL
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              color: 'var(--text-muted)',
              letterSpacing: '0.06em',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '2px 6px',
            }}>
              PPO REQUIRED
            </span>
          </div>
        </div>

        {/* DPO column */}
        <div role="list" aria-label="DPO pipeline steps">
          <PanelLabel accent>DPO — 3 steps</PanelLabel>
          {DPO_STEPS.map((step, i) => (
            <PipelineBox
              key={i}
              step={step}
              index={i}
              total={DPO_STEPS.length}
              color="var(--accent-primary)"
            />
          ))}
          {/* Benefit badges */}
          <div style={{
            marginTop: 'var(--space-3)',
            display: 'flex',
            gap: 'var(--space-2)',
            flexWrap: 'wrap',
          }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              color: 'var(--accent-primary)',
              letterSpacing: '0.06em',
              background: 'var(--accent-primary-glow)',
              border: '1px solid var(--border-emphasis)',
              borderRadius: 'var(--radius-sm)',
              padding: '2px 6px',
            }}>
              NO REWARD MODEL
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              color: 'var(--accent-primary)',
              letterSpacing: '0.06em',
              background: 'var(--accent-primary-glow)',
              border: '1px solid var(--border-emphasis)',
              borderRadius: 'var(--radius-sm)',
              padding: '2px 6px',
            }}>
              ~10× CHEAPER
            </span>
          </div>
        </div>
      </div>

      {/* Shared outcome */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        color: 'var(--text-muted)',
        margin: 'var(--space-2) 0',
        userSelect: 'none',
      }} aria-hidden="true">
        <span>↘</span>
        <span>↙</span>
      </div>

      <div style={{
        background: 'var(--accent-primary-glow)',
        border: '1px solid var(--border-emphasis)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-3) var(--space-4)',
        textAlign: 'center',
        marginBottom: 'var(--space-5)',
      }}>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--accent-primary)',
          letterSpacing: '0.06em',
          margin: '0 0 2px',
        }}>
          SHARED OUTCOME
        </p>
        <p style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 13,
          color: 'var(--text-primary)',
          fontWeight: 500,
          margin: 0,
        }}>
          Final aligned model
        </p>
      </div>

      {/* Caption */}
      <p style={{
        fontFamily: 'var(--font-editorial)',
        fontStyle: 'italic',
        fontSize: 14,
        color: 'var(--text-secondary)',
        lineHeight: 1.75,
        margin: 0,
        padding: 'var(--space-4) var(--space-5)',
        borderLeft: '3px solid var(--accent-warm)',
        background: 'rgba(244,171,31,0.06)',
        borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
      }}>
        Same outcome, half the moving parts. DPO is what you&apos;d build if you started from scratch.
      </p>
    </Compare>
  );
}
