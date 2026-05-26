'use client';

import { useState } from 'react';
import ConceptDemo from './ConceptDemo/ConceptDemo';
import StepThrough from './ConceptDemo/StepThrough';

// ---------------------------------------------------------------------------
// Pre-computed data
// ---------------------------------------------------------------------------

const SEEDS = [
  { id: 0, text: '"What is 12 × 15?"' },
  { id: 1, text: '"Sort this list in Python."' },
  { id: 2, text: '"Explain photosynthesis briefly."' },
];

// Each seed expands to 10 variations — shown as short chips
const SEED_EXPANSIONS: Record<number, string[]> = {
  0: ['12×15=?', '15×12?', 'Calc 180?', '12·15', '12 times 15', 'result of 12×15', 'multiply 12 15', '180 correct?', "what's 12×15", 'is 180=12×15?'],
  1: ['sort list py', 'sorted() usage', 'list.sort()', 'ascending sort', 'lambda sort', 'sort integers', 'sort strings', 'sort descending', 'sort w/ key', 'in-place sort'],
  2: ['photosyn brief', 'plant energy?', 'chlorophyll?', 'sun → sugar', 'CO₂+H₂O→?', 'leaf process', 'green energy', 'plant food?', 'oxygen source', 'plant biology'],
};

// Filter step: 7 pass, 3 fail per seed
const FILTER_PASS = [true, false, true, true, false, true, true, true, false, true];

// Final dataset chips: 21 examples (3 seeds × 7 passing)
const FINAL_CHIPS = Array.from({ length: 21 }, (_, i) => ({
  id: i,
  label: `ex-${String(i + 1).padStart(3, '0')}`,
}));

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SyntheticDataDemo() {
  const [step, setStep] = useState(0);
  const [activeSeed, setActiveSeed] = useState(0);

  return (
    <ConceptDemo ariaLabel="Synthetic data pipeline" shape="stepthrough">
      <StepThrough
        ariaLabel="Synthetic data steps"
        totalSteps={4}
        activeStep={step}
        onNext={() => setStep((s) => Math.min(3, s + 1))}
        onBack={() => setStep((s) => Math.max(0, s - 1))}
        onReset={() => { setStep(0); setActiveSeed(0); }}
      >
        {/* ---- Step 1: Seed prompts ---- */}
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
              Seed prompts.
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
              A small set of human-curated examples — the starting material.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {SEEDS.map((seed, i) => (
                <div
                  key={seed.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    animation: 'fadeUp 250ms cubic-bezier(0.16,1,0.3,1) both',
                    animationDelay: `${i * 80}ms`,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      letterSpacing: '0.06em',
                      color: 'var(--accent-primary)',
                      background: 'var(--accent-primary-glow)',
                      border: '1px solid var(--border-emphasis)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '2px 8px',
                      flexShrink: 0,
                    }}
                  >
                    seed {i + 1}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-editorial)',
                      fontSize: 14,
                      color: 'var(--text-primary)',
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: 'var(--space-2) var(--space-4)',
                      lineHeight: 1.5,
                    }}
                  >
                    {seed.text}
                  </span>
                </div>
              ))}
            </div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginTop: 'var(--space-4)', letterSpacing: '0.04em' }}>
              3 seeds → next step expands each to 10 variations
            </p>
            <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
          </div>
        )}

        {/* ---- Step 2: Generator expands ---- */}
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
              Generator model expands.
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
              Each seed fans out into 10 variations. Select a seed to see its fan.
            </p>

            {/* Seed selector */}
            <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-5)', flexWrap: 'wrap' }}>
              {SEEDS.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSeed(i)}
                  aria-pressed={activeSeed === i}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    letterSpacing: '0.05em',
                    padding: 'var(--space-1) var(--space-3)',
                    borderRadius: 'var(--radius-sm)',
                    background: activeSeed === i ? 'var(--accent-primary-glow)' : 'var(--bg-elevated)',
                    color: activeSeed === i ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    border: activeSeed === i ? '1px solid var(--border-emphasis)' : '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'all 150ms ease',
                  }}
                >
                  seed {i + 1}
                </button>
              ))}
            </div>

            {/* Fanout grid */}
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-editorial)',
                    fontSize: 13,
                    color: 'var(--text-primary)',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-emphasis)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-2) var(--space-3)',
                  }}
                >
                  {SEEDS[activeSeed].text}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 18, color: 'var(--accent-primary)' }}>→</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 'var(--space-2)',
                }}
              >
                {SEED_EXPANSIONS[activeSeed].map((variant, i) => (
                  <span
                    key={i}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-secondary)',
                      animation: 'fadeUp 200ms cubic-bezier(0.16,1,0.3,1) both',
                      animationDelay: `${i * 40}ms`,
                    }}
                  >
                    {variant}
                  </span>
                ))}
              </div>
            </div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
              3 seeds × 10 = 30 candidates before filtering
            </p>
          </div>
        )}

        {/* ---- Step 3: Filter for quality ---- */}
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
              Filter for quality.
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
              A reward model or verifier scores each example. Low-quality ones are dropped.
            </p>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 'var(--space-2)',
                padding: 'var(--space-5)',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                marginBottom: 'var(--space-4)',
              }}
            >
              {FILTER_PASS.map((pass, i) => (
                <span
                  key={i}
                  aria-label={pass ? 'example passed filter' : 'example rejected'}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-sm)',
                    background: pass ? 'rgba(170,255,77,0.10)' : 'rgba(224,112,112,0.08)',
                    color: pass ? 'var(--accent-primary)' : 'var(--error)',
                    border: pass ? '1px solid rgba(170,255,77,0.28)' : '1px solid rgba(224,112,112,0.22)',
                    animation: 'fadeUp 200ms cubic-bezier(0.16,1,0.3,1) both',
                    animationDelay: `${i * 40}ms`,
                  }}
                >
                  {pass ? '✓' : '✗'} ex-{String(i + 1).padStart(2, '0')}
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent-primary)' }}>
                ✓ {FILTER_PASS.filter(Boolean).length} passed
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--error)' }}>
                ✗ {FILTER_PASS.filter((p) => !p).length} rejected
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
                per seed batch — scaled to millions
              </span>
            </div>
          </div>
        )}

        {/* ---- Step 4: Final dataset ---- */}
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
              Training set is 30× larger.
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
              3 hand-written examples became 21 verified ones. At scale: 1 000 seeds → 21 000+ examples.
            </p>

            {/* Dataset chip cloud */}
            <div
              aria-label="Final training dataset chip cloud"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 'var(--space-2)',
                padding: 'var(--space-5)',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                marginBottom: 'var(--space-5)',
              }}
            >
              {FINAL_CHIPS.map((chip, i) => (
                <span
                  key={chip.id}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    padding: '2px 7px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--accent-primary-glow)',
                    color: 'var(--accent-primary)',
                    border: '1px solid rgba(170,255,77,0.20)',
                    animation: 'fadeUp 200ms cubic-bezier(0.16,1,0.3,1) both',
                    animationDelay: `${i * 20}ms`,
                  }}
                >
                  {chip.label}
                </span>
              ))}
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  padding: '2px 7px',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-base)',
                }}
              >
                + millions more
              </span>
            </div>

            {/* Scale comparison */}
            <div
              style={{
                display: 'flex',
                gap: 'var(--space-4)',
                marginBottom: 'var(--space-5)',
                flexWrap: 'wrap',
              }}
            >
              {[
                { label: 'Seed examples', val: 3, color: 'var(--text-muted)' },
                { label: 'After expansion + filter', val: 21, color: 'var(--accent-primary)' },
                { label: 'At real scale (1k seeds)', val: 21000, color: 'var(--accent-secondary)' },
              ].map(({ label, val, color }) => (
                <div
                  key={label}
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-3) var(--space-4)',
                    textAlign: 'center',
                    flex: '1 1 100px',
                  }}
                >
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', margin: '0 0 4px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</p>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color, margin: 0, lineHeight: 1 }}>
                    {val.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Caption */}
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
                margin: 0,
              }}
            >
              Cheaper than humans. Riskier than humans. The trade-off is the whole game.
            </p>
          </div>
        )}
      </StepThrough>
    </ConceptDemo>
  );
}
