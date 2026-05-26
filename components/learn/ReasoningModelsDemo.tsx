'use client';

import { useState, useEffect, useRef } from 'react';

// ── Data ──────────────────────────────────────────────────────────────────────

const PROBLEM =
  'A train leaves city A at 60 km/h. Another leaves city B (300 km away) at 90 km/h heading toward A. Where do they meet? Also: a third train leaves A 30 min later at 90 km/h — which train from A arrives first?';

const REASONING_STEPS = [
  'Combined speed = 60 + 90 = 150 km/h. Time to meet = 300 ÷ 150 = 2 h.',
  'Distance from A = 60 × 2 = 120 km. Fast model added instead of dividing.',
  'Third train departs 0.5 h late at 90 km/h: 300 ÷ 90 + 0.5 = 3.83 h total.',
  'First train: 300 ÷ 60 = 5 h. Third train arrives first at ~3.83 h.',
  'Answer: meet at 120 km from A. Third (later, faster) train arrives first.',
];

type Phase = 'idle' | 'running' | 'done';

// ── Sub-components ────────────────────────────────────────────────────────────

function PanelMeta({ label, meta, accent }: { label: string; meta: string; accent?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: accent ? 'var(--accent-primary)' : 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>{meta}</span>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ReasoningModelsDemo() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [thinkSec, setThinkSec] = useState(0);
  const [revealed, setRevealed] = useState<number[]>([]);
  const [openStep, setOpenStep] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  function clearAll() {
    if (timerRef.current) clearInterval(timerRef.current);
    stepRefs.current.forEach(clearTimeout);
    stepRefs.current = [];
  }

  function runDemo() {
    clearAll();
    setPhase('running');
    setThinkSec(0);
    setRevealed([]);
    setOpenStep(null);
    timerRef.current = setInterval(() => setThinkSec((s) => { if (s >= 5) { clearInterval(timerRef.current!); return s; } return s + 1; }), 600);
    REASONING_STEPS.forEach((_, i) => {
      const t = setTimeout(() => {
        setRevealed((p) => [...p, i]);
        if (i === REASONING_STEPS.length - 1) setTimeout(() => setPhase('done'), 400);
      }, 800 + i * 700);
      stepRefs.current.push(t);
    });
  }

  function reset() { clearAll(); setPhase('idle'); setThinkSec(0); setRevealed([]); setOpenStep(null); }
  useEffect(() => () => clearAll(), []);

  const panelStyle = (highlight: boolean): React.CSSProperties => ({
    background: highlight ? 'var(--accent-primary-glow)' : 'var(--bg-elevated)',
    border: highlight ? '1px solid var(--border-emphasis)' : '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--space-5)',
    transition: 'background 350ms ease, border-color 350ms ease',
  });

  return (
    <div>
      {/* Problem */}
      <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 var(--space-2)' }}>Graduate-level puzzle</p>
        <p style={{ fontFamily: 'var(--font-editorial)', fontStyle: 'italic', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', lineHeight: 1.8, margin: 0 }}>{PROBLEM}</p>
      </div>

      {/* Two panels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-5)' }} className="rm-panels">
        {/* Fast */}
        <div role="group" aria-label="Fast model" style={panelStyle(false)}>
          <PanelMeta label="Fast model (GPT-4)" meta="~1 s · $0.001" />
          <p style={{ fontFamily: 'var(--font-editorial)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.75, margin: '0 0 var(--space-3)', minHeight: 48 }}>
            180 km from city A. The second train arrives first.
          </p>
          <p aria-label="wrong answer" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--error)', margin: 0 }}>✗ wrong answer</p>
        </div>

        {/* Reasoning */}
        <div role="group" aria-label="Reasoning model" style={panelStyle(phase === 'done')}>
          <PanelMeta label="Reasoning model (o3)" meta={phase === 'running' ? `◌ thinking… ${thinkSec * 6}s` : phase === 'done' ? '~30 s · $0.15' : '~30 s · $0.15'} accent={phase === 'done'} />

          {revealed.length > 0 && (
            <div aria-label="Internal reasoning" style={{ marginBottom: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {REASONING_STEPS.map((step, i) => {
                if (!revealed.includes(i)) return null;
                const isOpen = openStep === i;
                return (
                  <button key={i} onClick={() => setOpenStep(isOpen ? null : i)} aria-expanded={isOpen}
                    style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-2) var(--space-3)', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>Step {i + 1}/{REASONING_STEPS.length}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{isOpen ? '▲' : '▼'}</span>
                    </div>
                    {isOpen && <p style={{ fontFamily: 'var(--font-editorial)', fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.7, margin: 'var(--space-2) 0 0' }}>{step}</p>}
                  </button>
                );
              })}
            </div>
          )}

          <p style={{ fontFamily: 'var(--font-editorial)', fontSize: 'var(--text-sm)', color: phase === 'done' ? 'var(--text-primary)' : 'var(--text-muted)', lineHeight: 1.75, margin: '0 0 var(--space-3)', minHeight: 48, fontStyle: phase === 'done' ? 'normal' : 'italic' }}>
            {phase === 'idle' && 'Press run to see the reasoning model work.'}
            {phase === 'running' && 'Generating internal chain-of-thought…'}
            {phase === 'done' && 'Trains meet 120 km from A. Third train from A arrives first.'}
          </p>
          {phase === 'done' && <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-primary)', margin: 0 }}>✓ correct answer</p>}
        </div>
      </div>

      {/* Run/Reset */}
      <div style={{ marginBottom: 'var(--space-5)' }}>
        {phase !== 'running' ? (
          <button onClick={phase === 'idle' ? runDemo : reset}
            style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 500, padding: 'var(--space-2) var(--space-5)', borderRadius: 'var(--radius-md)', background: 'var(--accent-primary)', color: 'var(--text-inverse)', border: 'none', cursor: 'pointer' }}>
            {phase === 'idle' ? 'Run comparison →' : 'Reset'}
          </button>
        ) : (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>Reasoning in progress…</span>
        )}
      </div>

      <p style={{ fontFamily: 'var(--font-editorial)', fontStyle: 'italic', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.75, textAlign: 'center', margin: 0 }}>
        Same family of models. Different inference-time computation. Different cost. Different correctness.
      </p>
      <style>{`@media (max-width: 640px) { .rm-panels { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
