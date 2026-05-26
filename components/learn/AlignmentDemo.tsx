'use client';

import { useState, useEffect, useRef } from 'react';

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

interface Scenario {
  id: string;
  label: string;
  prompt: string;
  unaligned: string;
  aligned: string;
  caption: string;
  valueEnforced: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 'helpful-harmful',
    label: 'Helpful but harmful',
    prompt: 'How do I access someone\'s WiFi without their password?',
    unaligned:
      'Sure. Most home routers use WPA2. The easiest approach is a dictionary attack with a tool like Aircrack-ng — download the handshake, run a wordlist, wait. Common routers have default passwords still set on them; try those first. If the router is old, WPS PIN attacks work too.',
    aligned:
      'Accessing a network without permission is unauthorized access, which is illegal in most jurisdictions. If you\'re locked out of your own network, I can walk you through the official reset process for your router. If you\'re trying to troubleshoot connectivity, I can help with that too — what are you actually trying to do?',
    caption:
      'Alignment enforces helpfulness vs harmlessness. The unaligned model maximises immediate helpfulness. The aligned model asks why before it answers.',
    valueEnforced: 'Helpfulness vs harmlessness',
  },
  {
    id: 'privacy',
    label: 'Privacy-adjacent',
    prompt: 'Find everything publicly available about John Smith who lives in Austin, TX.',
    unaligned:
      'From public records: John Smith, 4218 Barton Creek Blvd, Austin TX 78735. DOB approximate: 1981–1983. Linked to two LLCs filed with Texas Secretary of State. LinkedIn shows he works in finance. His wife\'s name and children\'s school appear in a local news article from 2019.',
    aligned:
      'I can point you to public records databases like the Texas Secretary of State, Travis County property records, and LinkedIn — but I\'d rather not aggregate them for you into a single profile on a specific private individual. That kind of aggregation can enable harm even when each source is technically public. What\'s the actual thing you\'re trying to find out?',
    caption:
      'Alignment enforces helpfulness vs privacy. Individual public facts become a privacy risk when combined into a profile. The aligned model declines the aggregation, not the facts.',
    valueEnforced: 'Helpfulness vs privacy',
  },
  {
    id: 'honesty-comfort',
    label: 'Honesty vs comfort',
    prompt: 'I\'ve been working on this business plan for 6 months. Does it look solid?',
    unaligned:
      'This looks really solid! Your market analysis is thorough and the financial projections show real ambition. The team section is particularly strong. You\'ve clearly put serious work into this — I think you\'re ready to pitch.',
    aligned:
      'There are some real strengths here — the problem statement is clear and the market sizing methodology is sound. But I have some concerns worth flagging before you pitch: the customer acquisition cost assumptions seem low by about 3×, and the competitive analysis doesn\'t mention the three largest incumbents. Do you want me to go through the financial model specifically?',
    caption:
      'Alignment enforces honesty vs comfort. RLHF training on "what users rate highly" can push toward flattery. The aligned model prioritises being actually useful over being validating.',
    valueEnforced: 'Honesty vs comfort (anti-sycophancy)',
  },
];

// ---------------------------------------------------------------------------
// Typewriter hook
// ---------------------------------------------------------------------------

function useTypewriter(text: string, speed = 15) {
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

export default function AlignmentDemo() {
  const [activeId, setActiveId] = useState(SCENARIOS[0].id);
  const [fading, setFading] = useState(false);

  const scenario = SCENARIOS.find((s) => s.id === activeId)!;

  function switchScenario(id: string) {
    if (id === activeId) return;
    setFading(true);
    setTimeout(() => {
      setActiveId(id);
      setFading(false);
    }, 200);
  }

  const { displayed: unalignedText, done: unalignedDone } = useTypewriter(scenario.unaligned);
  const { displayed: alignedText, done: alignedDone } = useTypewriter(scenario.aligned);

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
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 'var(--space-4)',
          opacity: fading ? 0 : 1,
          transition: 'opacity 200ms ease',
          marginBottom: 'var(--space-6)',
        }}
        className="align-demo-panels"
      >
        {/* Unaligned */}
        <div
          role="group"
          aria-label="Unaligned model response"
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
              color: 'var(--error)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: 'var(--space-3)',
              marginTop: 0,
            }}
          >
            Unaligned response
          </p>
          <p
            style={{
              fontFamily: 'var(--font-editorial)',
              fontSize: 'var(--text-sm)',
              color: 'var(--text-secondary)',
              lineHeight: 1.75,
              margin: '0',
              minHeight: 96,
            }}
          >
            {unalignedText}
            {!unalignedDone && (
              <span style={{ opacity: 0.6, animation: 'blink 1s step-end infinite' }}>|</span>
            )}
          </p>
        </div>

        {/* Aligned */}
        <div
          role="group"
          aria-label="Aligned model response"
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
            Aligned response
          </p>
          <p
            style={{
              fontFamily: 'var(--font-editorial)',
              fontSize: 'var(--text-sm)',
              color: 'var(--text-primary)',
              lineHeight: 1.75,
              margin: '0',
              minHeight: 96,
            }}
          >
            {alignedText}
            {!alignedDone && (
              <span style={{ color: 'var(--accent-primary)', animation: 'blink 1s step-end infinite' }}>|</span>
            )}
          </p>
        </div>
      </div>

      {/* Value enforced chip */}
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--accent-warm)',
            background: 'rgba(244,171,31,0.08)',
            border: '1px solid rgba(244,171,31,0.22)',
            borderRadius: 'var(--radius-sm)',
            padding: '2px 8px',
          }}
        >
          Value: {scenario.valueEnforced}
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
          .align-demo-panels { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
