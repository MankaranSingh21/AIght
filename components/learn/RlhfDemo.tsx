'use client';

import { useState } from 'react';
import StepThrough from './ConceptDemo/StepThrough';

const PROMPTS = [
  { id: 'p1', text: 'Explain quantum entanglement simply.' },
  { id: 'p2', text: 'Help me write a cover letter.' },
  { id: 'p3', text: 'What should I eat to lose weight?' },
];

const RESPONSES: Record<string, { a: string; b: string }> = {
  p1: {
    a: 'Quantum entanglement is when two particles become correlated so that measuring one instantly affects the other, no matter the distance.',
    b: 'Particles that are entangled share quantum state. When one is measured it collapses and its partner collapses too simultaneously.',
  },
  p2: {
    a: 'Dear Hiring Manager, I am writing to express my strong interest in the position at your esteemed organization...',
    b: 'I saw the opening and think I\'d be a great fit. Here\'s why: [relevant experience]. I\'d love to chat.',
  },
  p3: {
    a: 'Focus on whole foods: vegetables, lean protein, legumes. Reduce ultra-processed food. Sleep matters as much as diet.',
    b: 'Cut carbs and calories. Intermittent fasting works for some. Track everything you eat with an app.',
  },
};

// Precomputed: which response humans preferred
const PREFERRED: Record<string, 'a' | 'b'> = {
  p1: 'a',
  p2: 'b',
  p3: 'a',
};

const STEPS = [
  { title: 'Step 1 — Collect prompts', subtitle: 'A seed dataset of human-written questions' },
  { title: 'Step 2 — Generate two responses', subtitle: 'The model drafts two candidates per prompt' },
  { title: 'Step 3 — Humans rank them', subtitle: 'Contractors pick the better response' },
  { title: 'Step 4 — Train a reward model', subtitle: 'Rankings become training signal' },
  { title: 'Step 5 — PPO loop', subtitle: 'Policy updates toward higher reward' },
];

const STEP_DESCRIPTIONS = [
  'Human writers (or curators) assemble a diverse set of prompts. These seed the feedback collection process. Quality and diversity here matter — garbage in, garbage out for the reward model.',
  'The language model generates two distinct responses for each prompt. They vary in length, tone, and accuracy. The model has no preference yet.',
  'Human raters compare A vs B for each prompt. They pick whichever is more helpful, honest, and harmless. Their choices become labeled data.',
  'A separate "reward model" — a classifier — trains on the ranked pairs. It learns to predict human preference scores for any (prompt, response) pair.',
  'PPO (Proximal Policy Optimization) fine-tunes the language model: generate a response, score it with the reward model, update weights to increase expected reward. Repeat until the policy converges.',
];

export default function RlhfDemo() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <StepThrough
      ariaLabel="RLHF training loop"
      totalSteps={5}
      activeStep={activeStep}
      onNext={() => setActiveStep((s) => Math.min(4, s + 1))}
      onBack={() => setActiveStep((s) => Math.max(0, s - 1))}
      onReset={() => setActiveStep(0)}
    >
      <style>{`
        @keyframes rlhfFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .rlhf-item { animation: rlhfFadeIn 240ms cubic-bezier(0.16,1,0.3,1) both; }
        .rlhf-loop-arrow {
          animation: rlhfFadeIn 500ms cubic-bezier(0.16,1,0.3,1) 200ms both;
        }
      `}</style>

      {/* Step header */}
      <div style={{ marginBottom: 'var(--space-5)' }}>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: 20,
          fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
          margin: '0 0 var(--space-1)',
        }}>
          {STEPS[activeStep].title}
        </p>
        <p style={{
          fontFamily: 'var(--font-editorial)',
          fontStyle: 'italic',
          fontSize: 14,
          color: 'var(--text-secondary)',
          margin: 0,
          lineHeight: 1.6,
        }}>
          {STEPS[activeStep].subtitle}
        </p>
      </div>

      {/* Step 0: Prompts list */}
      {activeStep === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }} aria-live="polite">
          {PROMPTS.map((p, i) => (
            <div
              key={p.id}
              className="rlhf-item"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-3) var(--space-4)',
                display: 'flex',
                gap: 'var(--space-3)',
                alignItems: 'flex-start',
                animationDelay: `${i * 80}ms`,
              }}
            >
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: 'var(--accent-primary)',
                letterSpacing: '0.06em',
                minWidth: 20,
                paddingTop: 2,
              }}>
                P{i + 1}
              </span>
              <span style={{
                fontFamily: 'var(--font-editorial)',
                fontSize: 14,
                color: 'var(--text-primary)',
                lineHeight: 1.6,
              }}>
                {p.text}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Step 1: Two responses per prompt */}
      {activeStep === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }} aria-live="polite">
          {PROMPTS.map((p, i) => (
            <div key={p.id} className="rlhf-item" style={{ animationDelay: `${i * 80}ms` }}>
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: 'var(--text-muted)',
                letterSpacing: '0.06em',
                margin: '0 0 var(--space-2)',
              }}>
                PROMPT {i + 1}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}
                className="rlhf-pair">
                {(['a', 'b'] as const).map((side) => (
                  <div
                    key={side}
                    style={{
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: 'var(--space-3)',
                    }}
                  >
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 9,
                      color: 'var(--text-muted)',
                      letterSpacing: '0.08em',
                      display: 'block',
                      marginBottom: 4,
                    }}>
                      RESPONSE {side.toUpperCase()}
                    </span>
                    <p style={{
                      fontFamily: 'var(--font-editorial)',
                      fontSize: 12,
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                      margin: 0,
                    }}>
                      {RESPONSES[p.id][side]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <style>{`.rlhf-pair { } @media(max-width:640px){.rlhf-pair{grid-template-columns:1fr !important}}`}</style>
        </div>
      )}

      {/* Step 2: Human rankings */}
      {activeStep === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }} aria-live="polite">
          {PROMPTS.map((p, i) => {
            const pref = PREFERRED[p.id];
            return (
              <div key={p.id} className="rlhf-item" style={{ animationDelay: `${i * 80}ms` }}>
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  color: 'var(--text-muted)',
                  letterSpacing: '0.06em',
                  margin: '0 0 var(--space-2)',
                }}>
                  PROMPT {i + 1}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}
                  className="rlhf-pair2">
                  {(['a', 'b'] as const).map((side) => {
                    const chosen = side === pref;
                    return (
                      <div
                        key={side}
                        role="group"
                        aria-label={`Response ${side.toUpperCase()}: ${chosen ? 'preferred' : 'not preferred'}`}
                        style={{
                          background: chosen ? 'var(--accent-primary-glow)' : 'var(--bg-elevated)',
                          border: `1px solid ${chosen ? 'var(--border-emphasis)' : 'var(--border-subtle)'}`,
                          borderRadius: 'var(--radius-md)',
                          padding: 'var(--space-3)',
                          position: 'relative',
                        }}
                      >
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 9,
                          color: chosen ? 'var(--accent-primary)' : 'var(--text-muted)',
                          letterSpacing: '0.08em',
                          display: 'block',
                          marginBottom: 4,
                        }}>
                          RESPONSE {side.toUpperCase()}
                        </span>
                        <p style={{
                          fontFamily: 'var(--font-editorial)',
                          fontSize: 12,
                          color: chosen ? 'var(--text-primary)' : 'var(--text-muted)',
                          lineHeight: 1.6,
                          margin: '0 0 var(--space-2)',
                        }}>
                          {RESPONSES[p.id][side]}
                        </p>
                        {chosen && (
                          <span style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: 11,
                            color: 'var(--accent-primary)',
                          }} aria-label="preferred">
                            👍 preferred
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
                <style>{`.rlhf-pair2{} @media(max-width:640px){.rlhf-pair2{grid-template-columns:1fr !important}}`}</style>
              </div>
            );
          })}
        </div>
      )}

      {/* Step 3: Reward model training */}
      {activeStep === 3 && (
        <div aria-live="polite">
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-3)',
            marginBottom: 'var(--space-5)',
          }}>
            {PROMPTS.map((p, i) => {
              const pref = PREFERRED[p.id];
              return (
                <div
                  key={p.id}
                  className="rlhf-item"
                  style={{
                    display: 'flex',
                    gap: 'var(--space-4)',
                    alignItems: 'center',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-3) var(--space-4)',
                    animationDelay: `${i * 80}ms`,
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', minWidth: 24 }}>P{i + 1}</span>
                  <div style={{ flex: 1, display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      padding: '2px 6px',
                      borderRadius: 'var(--radius-sm)',
                      background: pref === 'a' ? 'var(--accent-primary-glow)' : 'var(--bg-overlay)',
                      color: pref === 'a' ? 'var(--accent-primary)' : 'var(--text-muted)',
                      border: `1px solid ${pref === 'a' ? 'var(--border-emphasis)' : 'var(--border-subtle)'}`,
                    }}>
                      A {pref === 'a' ? '▲ +1.0' : '▼ -1.0'}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      padding: '2px 6px',
                      borderRadius: 'var(--radius-sm)',
                      background: pref === 'b' ? 'var(--accent-primary-glow)' : 'var(--bg-overlay)',
                      color: pref === 'b' ? 'var(--accent-primary)' : 'var(--text-muted)',
                      border: `1px solid ${pref === 'b' ? 'var(--border-emphasis)' : 'var(--border-subtle)'}`,
                    }}>
                      B {pref === 'b' ? '▲ +1.0' : '▼ -1.0'}
                    </span>
                  </div>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9,
                    color: 'var(--text-muted)',
                    letterSpacing: '0.04em',
                    whiteSpace: 'nowrap',
                  }}>
                    → training pair
                  </span>
                </div>
              );
            })}
          </div>
          <div style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-4)',
            display: 'flex',
            gap: 'var(--space-3)',
            alignItems: 'center',
          }}>
            <span style={{ fontSize: 20 }} aria-hidden="true">🏆</span>
            <div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent-primary)', letterSpacing: '0.06em', margin: '0 0 2px' }}>
                REWARD MODEL
              </p>
              <p style={{ fontFamily: 'var(--font-editorial)', fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
                A classifier trained on ranked pairs. Given any (prompt, response), it outputs a scalar reward score.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: PPO loop */}
      {activeStep === 4 && (
        <div aria-live="polite">
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-3)',
            marginBottom: 'var(--space-5)',
          }}>
            {[
              { label: 'POLICY MODEL', sub: 'generates a response', color: 'var(--accent-primary)', icon: '🧠' },
              { label: '↓ SCORE', sub: '', color: 'var(--text-muted)', icon: null },
              { label: 'REWARD MODEL', sub: 'assigns a scalar reward', color: 'var(--accent-secondary)', icon: '🏆' },
              { label: '↓ GRADIENT', sub: '', color: 'var(--text-muted)', icon: null },
              { label: 'PPO UPDATE', sub: 'policy weights adjust to increase expected reward', color: 'var(--accent-warm)', icon: '⚡' },
              { label: '↑ LOOP', sub: 'repeat until convergence', color: 'var(--text-muted)', icon: null },
            ].map((row, i) => {
              if (!row.icon && row.label.startsWith('↑')) {
                return (
                  <div key={i} className="rlhf-loop-arrow" style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    color: 'var(--accent-primary)',
                    letterSpacing: '0.06em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                  }}>
                    <span>↑</span>
                    <span style={{ color: 'var(--text-muted)' }}>LOOP — repeat until convergence</span>
                  </div>
                );
              }
              if (!row.icon) {
                return (
                  <div key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
                    {row.label}
                  </div>
                );
              }
              return (
                <div
                  key={i}
                  className="rlhf-item"
                  style={{
                    background: 'var(--bg-elevated)',
                    border: `1px solid var(--border-subtle)`,
                    borderLeft: `3px solid ${row.color}`,
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-3) var(--space-4)',
                    width: '100%',
                    maxWidth: 480,
                    display: 'flex',
                    gap: 'var(--space-3)',
                    alignItems: 'center',
                    animationDelay: `${i * 80}ms`,
                  }}
                >
                  <span style={{ fontSize: 18 }} aria-hidden="true">{row.icon}</span>
                  <div>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: row.color, letterSpacing: '0.06em', margin: '0 0 2px' }}>
                      {row.label}
                    </p>
                    {row.sub && (
                      <p style={{ fontFamily: 'var(--font-editorial)', fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>
                        {row.sub}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Description */}
      <p
        style={{
          fontFamily: 'var(--font-editorial)',
          fontSize: 14,
          color: 'var(--text-secondary)',
          lineHeight: 1.75,
          margin: 'var(--space-4) 0 0',
          padding: 'var(--space-3) var(--space-4)',
          borderLeft: '2px solid var(--border-default)',
          borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
        }}
        aria-live="polite"
      >
        {STEP_DESCRIPTIONS[activeStep]}
      </p>
    </StepThrough>
  );
}
