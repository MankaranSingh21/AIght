'use client';

import { useState, useEffect, useRef } from 'react';

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

interface Scenario {
  id: string;
  label: string;
  prompt: string;
  ungrounded: string;
  grounded: string;
  caption: string;
  failureMode: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 'citation',
    label: 'Fake citation',
    prompt: 'Cite a study on the health effects of drinking cold water in the morning.',
    ungrounded:
      'A 2019 study by Dr. Kenji Watanabe et al. at the University of Tokyo published in the Journal of Nutritional Metabolism found that drinking 500ml of cold water (4°C) within 30 minutes of waking increased morning metabolic rate by 12–15% over a 6-week period (DOI: 10.1017/jnm.2019.48231).',
    grounded:
      'I don\'t have a specific study on cold water and morning metabolic effects that I can cite reliably. There is research on water-induced thermogenesis (drinking water does temporarily boost metabolism), but citing a specific author, journal, and DOI for you would risk fabricating details. I\'d recommend searching PubMed for "water-induced thermogenesis" if you need a citable source.',
    caption:
      'Hallucination mode: confident citation fabrication. The DOI, journal volume, and author are invented but plausible.',
    failureMode: 'Citation fabrication',
  },
  {
    id: 'date',
    label: 'Historical date',
    prompt: 'When did Japan join the League of Nations?',
    ungrounded:
      'Japan became a founding member of the League of Nations in 1922, when the Treaty of Versailles formally established the international body following the Paris Peace Conference.',
    grounded:
      'Japan was actually a founding member of the League of Nations in 1920, when the organisation was established — not 1922. The Treaty of Versailles (1919) created the League framework; it came into force in January 1920. Japan remained a member until its withdrawal in 1933 following the Manchuria crisis.',
    caption:
      'Hallucination mode: plausible date drift. The model conflates 1919 (Treaty signed), 1920 (League formed), and 1922 (Washington treaties) into a wrong but not random-sounding answer.',
    failureMode: 'Plausible date confusion',
  },
  {
    id: 'term',
    label: 'Made-up term',
    prompt: 'What is "latent temporal drift" in machine learning?',
    ungrounded:
      'Latent temporal drift refers to the phenomenon where a model\'s internal representations shift over time as the underlying data distribution changes, even when the model weights remain static. Introduced by Chen & Huang (2021), it\'s now a core concept in continual learning literature and measured using the Temporal Representation Stability Index (TRSI).',
    grounded:
      '"Latent temporal drift" isn\'t a term I recognise as established in machine learning literature. You might be thinking of concept drift (distributional shift in inputs over time), representation drift (changing embeddings under fine-tuning), or model degradation under distribution shift. If you encountered this term somewhere specific, I\'d be happy to help trace it — but I\'m not able to define a term I can\'t verify exists.',
    caption:
      'Hallucination mode: term invention. The model manufactures a coherent definition, plausible authors, and a fake metric for a concept that doesn\'t exist.',
    failureMode: 'Invented terminology',
  },
];

// ---------------------------------------------------------------------------
// Typewriter hook
// ---------------------------------------------------------------------------

function useTypewriter(text: string, speed = 14) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    if (timerRef.current) clearInterval(timerRef.current);
    let i = 0;
    timerRef.current = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(timerRef.current!);
        setDone(true);
      }
    }, speed);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [text, speed]);

  return { displayed, done };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function HallucinationDemo() {
  const [activeId, setActiveId] = useState(SCENARIOS[0].id);
  const [fading, setFading] = useState(false);
  const [scenarioKey, setScenarioKey] = useState(0);

  const scenario = SCENARIOS.find((s) => s.id === activeId)!;

  function switchScenario(id: string) {
    if (id === activeId) return;
    setFading(true);
    setTimeout(() => {
      setActiveId(id);
      setScenarioKey((k) => k + 1);
      setFading(false);
    }, 200);
  }

  const { displayed: ungroundedText, done: ungroundedDone } = useTypewriter(
    scenario.ungrounded,
  );
  const { displayed: groundedText, done: groundedDone } = useTypewriter(scenario.grounded);

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-8)',
        margin: 'var(--space-10) 0',
      }}
    >
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
      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-6)' }}>
        {SCENARIOS.map((s) => (
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
              border: s.id === activeId ? '1px solid var(--border-emphasis)' : '1px solid var(--border-subtle)',
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Prompt */}
      <div
        style={{
          fontFamily: 'var(--font-editorial)',
          fontStyle: 'italic',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-4) var(--space-5)',
          marginBottom: 'var(--space-6)',
          lineHeight: 1.6,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontStyle: 'normal',
            fontSize: '10px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            display: 'block',
            marginBottom: 'var(--space-2)',
          }}
        >
          Prompt
        </span>
        {scenario.prompt}
      </div>

      {/* Two-panel comparison */}
      <div
        aria-live="polite"
        key={scenarioKey}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 'var(--space-4)',
          opacity: fading ? 0 : 1,
          transition: 'opacity 200ms ease',
          marginBottom: 'var(--space-6)',
        }}
        className="halluc-demo-panels"
      >
        {/* Without grounding */}
        <div
          role="group"
          aria-label="Hallucinated response without grounding"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-5)',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              color: 'var(--text-muted)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: 'var(--space-3)',
              marginTop: 0,
            }}
          >
            Without grounding
          </p>
          <p
            style={{
              fontFamily: 'var(--font-editorial)',
              fontSize: 'var(--text-sm)',
              color: 'var(--text-secondary)',
              lineHeight: 1.75,
              margin: '0 0 var(--space-4)',
              minHeight: 96,
            }}
          >
            {ungroundedText}
            {!ungroundedDone && (
              <span style={{ opacity: 0.6, animation: 'blink 1s step-end infinite' }}>|</span>
            )}
          </p>
          <p
            aria-label="Hallucination indicator"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--error)',
              margin: 0,
            }}
          >
            ✗ Hallucination
          </p>
        </div>

        {/* With grounding */}
        <div
          role="group"
          aria-label="Grounded response"
          style={{
            background: 'var(--accent-primary-glow)',
            border: '1px solid var(--border-emphasis)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-5)',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              color: 'var(--accent-primary)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: 'var(--space-3)',
              marginTop: 0,
            }}
          >
            With grounding
          </p>
          <p
            style={{
              fontFamily: 'var(--font-editorial)',
              fontSize: 'var(--text-sm)',
              color: 'var(--text-primary)',
              lineHeight: 1.75,
              margin: '0 0 var(--space-4)',
              minHeight: 96,
            }}
          >
            {groundedText}
            {!groundedDone && (
              <span style={{ color: 'var(--accent-primary)', animation: 'blink 1s step-end infinite' }}>|</span>
            )}
          </p>
          <p
            aria-label="Grounded indicator"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--accent-primary)',
              margin: 0,
            }}
          >
            ✓ Grounded
          </p>
        </div>
      </div>

      {/* Failure mode chip */}
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--error)',
            background: 'rgba(224,112,112,0.08)',
            border: '1px solid rgba(224,112,112,0.22)',
            borderRadius: 'var(--radius-sm)',
            padding: '2px 8px',
          }}
        >
          Failure mode: {scenario.failureMode}
        </span>
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

      <style>{`
        @media (max-width: 640px) {
          .halluc-demo-panels { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
