'use client';

import { useState, useEffect, useRef } from 'react';
import { PanelLabel } from './ConceptDemo';

// ── Data ─────────────────────────────────────────────────────────────────────

interface Scenario {
  id: string;
  label: string;
  question: string;
  direct: string;
  directCorrect: boolean;
  cot: string;
  cotCorrect: boolean;
  directTokens: number;
  cotTokens: number;
  caption: string;
}

// GPT-4o-mini input pricing: $0.15 / 1M tokens = $0.00000015 per token
const PRICE_PER_TOKEN = 0.00000015;

const SCENARIOS: Scenario[] = [
  {
    id: 'math',
    label: 'Math',
    question:
      'Roger has 5 tennis balls. He buys 2 more cans. Each can has 3 balls. How many does he have now?',
    direct: '8',
    directCorrect: false,
    cot: 'Roger starts with 5 balls. He buys 2 cans × 3 balls = 6 new balls. 5 + 6 = 11 balls.',
    cotCorrect: true,
    directTokens: 2,
    cotTokens: 40,
    caption:
      'Direct guesses fail predictably on multi-step arithmetic. CoT pays for itself here.',
  },
  {
    id: 'logic',
    label: 'Logic',
    question:
      'If all bloops are razzles and all razzles are lazzies, are all bloops definitely lazzies?',
    direct: 'Maybe',
    directCorrect: false,
    cot: 'Bloop → razzle (given). Razzle → lazzie (given). By transitivity: bloop → lazzie. Yes.',
    cotCorrect: true,
    directTokens: 2,
    cotTokens: 35,
    caption:
      'For deduction, chain-of-thought is doing the actual work — the answer falls out.',
  },
  {
    id: 'trivia',
    label: 'Trivia',
    question: "What's the capital of France?",
    direct: 'Paris',
    directCorrect: true,
    cot: 'France is a country in Western Europe. Its capital city, where the government sits, is Paris.',
    cotCorrect: true,
    directTokens: 1,
    cotTokens: 25,
    caption:
      "Sometimes you're paying 20× more tokens to confirm what the model knew in two.",
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatCost(tokens: number): string {
  const usd = tokens * PRICE_PER_TOKEN;
  return `$${usd.toFixed(7)}`;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ChainOfThoughtDemo() {
  const [activeId, setActiveId] = useState<string>(SCENARIOS[0].id);
  const [displayed, setDisplayed] = useState({ direct: '', cot: '' });
  const [fading, setFading] = useState(false);

  const directTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const cotTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  function clearTimers() {
    if (directTimer.current) clearInterval(directTimer.current);
    if (cotTimer.current) clearInterval(cotTimer.current);
  }

  function runTypewriter(direct: string, cot: string) {
    clearTimers();
    setDisplayed({ direct: '', cot: '' });

    let di = 0;
    directTimer.current = setInterval(() => {
      di++;
      setDisplayed(prev => ({ ...prev, direct: direct.slice(0, di) }));
      if (di >= direct.length) clearInterval(directTimer.current!);
    }, 15);

    let ci = 0;
    cotTimer.current = setInterval(() => {
      ci++;
      setDisplayed(prev => ({ ...prev, cot: cot.slice(0, ci) }));
      if (ci >= cot.length) clearInterval(cotTimer.current!);
    }, 15);
  }

  function switchScenario(id: string) {
    if (id === activeId) return;
    clearTimers();
    setFading(true);
    setActiveId(id);
    setTimeout(() => {
      setFading(false);
      const s = SCENARIOS.find(sc => sc.id === id)!;
      runTypewriter(s.direct, s.cot);
    }, 200);
  }

  useEffect(() => {
    const s = SCENARIOS[0];
    runTypewriter(s.direct, s.cot);
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scenario = SCENARIOS.find(s => s.id === activeId)!;
  const directTyping = displayed.direct.length < scenario.direct.length;
  const cotTyping = displayed.cot.length < scenario.cot.length;

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-10)',
        margin: 'var(--space-10) 0',
      }}
    >
      {/* INTERACTIVE badge */}
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          marginBottom: 'var(--space-5)',
          marginTop: 0,
        }}
      >
        ◉ INTERACTIVE
      </p>

      {/* Scenario tabs */}
      <div
        style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-6)' }}
      >
        {SCENARIOS.map(s => (
          <button
            key={s.id}
            onClick={() => switchScenario(s.id)}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.05em',
              padding: 'var(--space-1) var(--space-3)',
              borderRadius: 'var(--radius-sm)',
              background: s.id === activeId ? 'var(--accent-primary-glow)' : 'var(--bg-elevated)',
              color: s.id === activeId ? 'var(--accent-primary)' : 'var(--text-secondary)',
              border:
                s.id === activeId
                  ? '1px solid var(--border-emphasis)'
                  : '1px solid var(--border-subtle)',
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Question */}
      <p
        style={{
          fontFamily: 'var(--font-editorial)',
          fontStyle: 'italic',
          fontSize: 'var(--text-base)',
          color: 'var(--text-primary)',
          lineHeight: 1.75,
          textAlign: 'center',
          maxWidth: '60ch',
          margin: '0 auto var(--space-6)',
        }}
      >
        {scenario.question}
      </p>

      {/* Two-panel comparison */}
      <div
        aria-live="polite"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 'var(--space-4)',
          opacity: fading ? 0 : 1,
          transition: 'opacity 200ms ease',
          marginBottom: 'var(--space-6)',
        }}
        className="cot-panels"
      >
        {/* Direct answer panel */}
        <div
          role="group"
          aria-label="Direct answer panel"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-5)',
          }}
        >
          <PanelLabel>Direct Answer</PanelLabel>

          <p
            style={{
              fontFamily: 'var(--font-editorial)',
              fontSize: 'var(--text-sm)',
              color: 'var(--text-secondary)',
              lineHeight: 1.75,
              margin: '0 0 var(--space-4)',
              minHeight: 72,
            }}
          >
            {displayed.direct}
            {directTyping && (
              <span style={{ opacity: 0.6, animation: 'blink 1s step-end infinite' }}>|</span>
            )}
          </p>

          {/* Status */}
          <StatusIndicator correct={scenario.directCorrect} />

          {/* Token cost */}
          <TokenCostLine tokens={scenario.directTokens} />
        </div>

        {/* Chain-of-thought panel */}
        <div
          role="group"
          aria-label="Chain-of-thought answer panel"
          style={{
            background: 'var(--accent-primary-glow)',
            border: '1px solid var(--border-emphasis)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-5)',
          }}
        >
          <PanelLabel accent>With Chain-of-Thought</PanelLabel>

          <p
            style={{
              fontFamily: 'var(--font-editorial)',
              fontSize: 'var(--text-sm)',
              color: 'var(--text-primary)',
              lineHeight: 1.75,
              margin: '0 0 var(--space-4)',
              minHeight: 72,
            }}
          >
            {displayed.cot}
            {cotTyping && (
              <span
                style={{ color: 'var(--accent-primary)', animation: 'blink 1s step-end infinite' }}
              >
                |
              </span>
            )}
          </p>

          {/* Status */}
          <StatusIndicator correct={scenario.cotCorrect} />

          {/* Token cost */}
          <TokenCostLine tokens={scenario.cotTokens} />
        </div>
      </div>

      {/* Footer caption */}
      <p
        style={{
          fontFamily: 'var(--font-editorial)',
          fontStyle: 'italic',
          fontSize: 'var(--text-base)',
          color: 'var(--text-secondary)',
          textAlign: 'center',
          lineHeight: 1.7,
          margin: 0,
        }}
      >
        {scenario.caption}
      </p>

      {/* Mobile responsive */}
      <style>{`
        @media (max-width: 640px) {
          .cot-panels {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatusIndicator({ correct }: { correct: boolean }) {
  return (
    <p
      aria-label={correct ? 'correct' : 'incorrect'}
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: correct ? 'var(--accent-primary)' : 'var(--error)',
        margin: '0 0 var(--space-2)',
      }}
    >
      {correct ? '✓ correct answer' : '✗ wrong answer'}
    </p>
  );
}

function TokenCostLine({ tokens }: { tokens: number }) {
  return (
    <p
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-xs)',
        color: 'var(--text-muted)',
        margin: 0,
      }}
    >
      ~{tokens} tokens · {formatCost(tokens)}
    </p>
  );
}
