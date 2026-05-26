'use client';

import { useState } from 'react';
import ConceptDemo from './ConceptDemo/ConceptDemo';
import StepThrough from './ConceptDemo/StepThrough';

// ---------------------------------------------------------------------------
// Pre-computed example outputs from the teacher model
// ---------------------------------------------------------------------------

const TEACHER_OUTPUTS = [
  { prompt: 'Summarise a contract', label: 'Legal summary', qual: 96 },
  { prompt: 'Debug this Python fn', label: 'Code review',   qual: 94 },
  { prompt: 'Explain RLHF simply',  label: 'Explanation',   qual: 98 },
  { prompt: 'Write a cover letter', label: 'Writing',       qual: 92 },
  { prompt: 'Translate to Spanish', label: 'Translation',   qual: 97 },
];

// Loss curve: decreasing from 1.0 to 0.18 over 8 checkpoints
const LOSS_CURVE = [1.0, 0.78, 0.58, 0.42, 0.31, 0.24, 0.20, 0.18];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DistillationDemo() {
  const [step, setStep] = useState(0);

  return (
    <ConceptDemo ariaLabel="Knowledge distillation pipeline" shape="stepthrough">
      <StepThrough
        ariaLabel="Distillation steps"
        totalSteps={4}
        activeStep={step}
        onNext={() => setStep((s) => Math.min(3, s + 1))}
        onBack={() => setStep((s) => Math.max(0, s - 1))}
        onReset={() => setStep(0)}
      >
        {/* ---- Step 1: Teacher model ---- */}
        {step === 0 && (
          <div>
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
              The teacher model.
            </p>
            <p
              style={{
                fontFamily: 'var(--font-editorial)',
                fontStyle: 'italic',
                fontSize: 14,
                color: 'var(--text-secondary)',
                marginBottom: 'var(--space-6)',
                lineHeight: 1.6,
              }}
            >
              A large frontier model — capable, expensive to run.
            </p>
            <div
              aria-label="Teacher model block"
              style={{
                background: 'var(--bg-elevated)',
                border: '2px solid var(--border-emphasis)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-8)',
                textAlign: 'center',
                position: 'relative',
                maxWidth: 340,
                boxShadow: 'var(--shadow-glow-lime)',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--accent-primary)',
                  margin: '0 0 var(--space-3)',
                }}
              >
                Teacher model
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 48,
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  margin: '0 0 var(--space-2)',
                  lineHeight: 1,
                }}
              >
                70B
              </p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>
                parameters
              </p>
              <div
                style={{
                  marginTop: 'var(--space-5)',
                  display: 'flex',
                  gap: 'var(--space-3)',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}
              >
                {[
                  { label: 'Benchmark', val: '100%' },
                  { label: 'Latency', val: '~2.4 s' },
                  { label: 'Cost / 1M tok', val: '$15' },
                ].map(({ label, val }) => (
                  <div
                    key={label}
                    style={{
                      background: 'var(--bg-base)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: 'var(--space-2) var(--space-3)',
                      textAlign: 'center',
                    }}
                  >
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', margin: '0 0 2px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</p>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ---- Step 2: Teacher generates outputs ---- */}
        {step === 1 && (
          <div>
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
              Teacher generates outputs.
            </p>
            <p
              style={{
                fontFamily: 'var(--font-editorial)',
                fontStyle: 'italic',
                fontSize: 14,
                color: 'var(--text-secondary)',
                marginBottom: 'var(--space-5)',
                lineHeight: 1.6,
              }}
            >
              Millions of (prompt, response) pairs. This is the expensive step.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {TEACHER_OUTPUTS.map((ex, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    animation: `fadeUp 250ms cubic-bezier(0.16,1,0.3,1) both`,
                    animationDelay: `${i * 60}ms`,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 12,
                      color: 'var(--text-muted)',
                      padding: 'var(--space-2) var(--space-3)',
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      minWidth: 160,
                      flexShrink: 0,
                    }}
                  >
                    {ex.prompt}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--accent-primary)' }}>→</span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--accent-primary-glow)',
                      color: 'var(--accent-primary)',
                      border: '1px solid var(--border-emphasis)',
                    }}
                  >
                    {ex.label}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginLeft: 'auto' }}>
                    Q: {ex.qual}%
                  </span>
                </div>
              ))}
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginTop: 'var(--space-2)', letterSpacing: '0.04em' }}>
                + millions more examples
              </p>
            </div>
            <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
          </div>
        )}

        {/* ---- Step 3: Student trains ---- */}
        {step === 2 && (
          <div>
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
              Student trains to mimic.
            </p>
            <p
              style={{
                fontFamily: 'var(--font-editorial)',
                fontStyle: 'italic',
                fontSize: 14,
                color: 'var(--text-secondary)',
                marginBottom: 'var(--space-5)',
                lineHeight: 1.6,
              }}
            >
              Loss drops as the student learns the teacher's behaviour.
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 'var(--space-4)',
                marginBottom: 'var(--space-5)',
              }}
            >
              {/* Student model box */}
              <div
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-5)',
                  textAlign: 'center',
                }}
              >
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 var(--space-2)' }}>
                  Student model
                </p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 36, fontWeight: 700, color: 'var(--accent-secondary)', margin: '0 0 var(--space-1)', lineHeight: 1 }}>
                  7B
                </p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', margin: 0 }}>parameters</p>
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    color: 'var(--accent-warm)',
                    marginTop: 'var(--space-3)',
                    padding: '2px 8px',
                    background: 'rgba(244,171,31,0.08)',
                    border: '1px solid rgba(244,171,31,0.22)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'inline-block',
                  }}
                >
                  training…
                </p>
              </div>

              {/* Loss curve */}
              <div
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-5)',
                }}
              >
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 var(--space-3)' }}>
                  Training loss
                </p>
                <div
                  aria-label="Loss curve chart"
                  style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 60 }}
                >
                  {LOSS_CURVE.map((val, i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: `${val * 100}%`,
                        background: `linear-gradient(to top, var(--accent-primary), var(--accent-primary-dim))`,
                        borderRadius: '2px 2px 0 0',
                        opacity: 0.7 + i * 0.04,
                        transition: 'height 300ms ease',
                      }}
                      title={`Checkpoint ${i + 1}: loss ${val.toFixed(2)}`}
                    />
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>start</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>converged</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---- Step 4: Results ---- */}
        {step === 3 && (
          <div>
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
              10× faster, 90% as good.
            </p>
            <p
              style={{
                fontFamily: 'var(--font-editorial)',
                fontStyle: 'italic',
                fontSize: 14,
                color: 'var(--text-secondary)',
                marginBottom: 'var(--space-6)',
                lineHeight: 1.6,
              }}
            >
              The trade-off in concrete numbers.
            </p>

            {/* Side-by-side bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              {/* Benchmark accuracy */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    Benchmark score
                  </span>
                </div>
                {[
                  { label: 'Teacher  70B', val: 100, color: 'var(--accent-primary)', display: '100%' },
                  { label: 'Student   7B', val: 90,  color: 'var(--accent-secondary)', display: '90%' },
                ].map(({ label, val, color, display }) => (
                  <div key={label} style={{ marginBottom: 'var(--space-3)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)' }}>{label}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color }}>{display}</span>
                    </div>
                    <div style={{ height: 10, background: 'var(--bg-base)', borderRadius: 'var(--radius-full)', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                      <div
                        role="progressbar"
                        aria-valuenow={val}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${label}: ${display}`}
                        style={{ width: `${val}%`, height: '100%', background: color, borderRadius: 'var(--radius-full)', transition: 'width 400ms ease' }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Speed */}
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: 'var(--space-2)' }}>
                  Inference speed
                </span>
                {[
                  { label: 'Teacher  70B', val: 10, color: 'var(--accent-primary)', display: '240 ms / tok' },
                  { label: 'Student   7B', val: 100, color: 'var(--accent-secondary)', display: '24 ms / tok  ← 10× faster' },
                ].map(({ label, val, color, display }) => (
                  <div key={label} style={{ marginBottom: 'var(--space-3)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)' }}>{label}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color }}>{display}</span>
                    </div>
                    <div style={{ height: 10, background: 'var(--bg-base)', borderRadius: 'var(--radius-full)', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                      <div
                        role="progressbar"
                        aria-valuenow={val}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        style={{ width: `${val}%`, height: '100%', background: color, borderRadius: 'var(--radius-full)', transition: 'width 400ms ease' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pull quote */}
            <p
              style={{
                fontFamily: 'var(--font-editorial)',
                fontStyle: 'italic',
                fontSize: 14,
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                padding: 'var(--space-4) var(--space-5)',
                borderLeft: '3px solid var(--accent-warm)',
                background: 'rgba(244,171,31,0.06)',
                borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                margin: 'var(--space-5) 0 0',
              }}
            >
              GPT-4o mini, Claude Haiku, Gemini Flash — all distilled from their larger siblings. The pricing reflects inference cost, not training effort.
            </p>
          </div>
        )}
      </StepThrough>
    </ConceptDemo>
  );
}
