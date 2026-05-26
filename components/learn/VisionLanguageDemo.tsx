'use client';

import { useState } from 'react';

// ── Scenario data ──────────────────────────────────────────────────────────────

interface AttentionRegion {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  color: string;
}

interface Scenario {
  id: string;
  label: string;
  question: string;
  response: string;
  attentionRegions: AttentionRegion[];
  renderSVG: (showAttention: boolean) => React.ReactNode;
}

const BAR_CHART_SVG = (showAttention: boolean) => (
  <svg
    viewBox="0 0 280 180"
    aria-label="Bar chart showing quarterly revenue"
    style={{ width: '100%', height: '100%' }}
  >
    {/* Background */}
    <rect width="280" height="180" fill="var(--bg-elevated)" rx="8" />
    {/* Axes */}
    <line x1="40" y1="20" x2="40" y2="150" stroke="rgba(245,239,224,0.20)" strokeWidth="1" />
    <line x1="40" y1="150" x2="260" y2="150" stroke="rgba(245,239,224,0.20)" strokeWidth="1" />
    {/* Bars Q1–Q4 */}
    <rect x="60" y="70" width="32" height="80" fill="rgba(0,255,209,0.50)" rx="2" />
    <rect x="110" y="55" width="32" height="95" fill="rgba(0,255,209,0.50)" rx="2" />
    {/* Q3 — drop, highlighted */}
    <rect x="160" y="105" width="32" height="45" fill={showAttention ? 'rgba(244,171,31,0.8)' : 'rgba(0,255,209,0.50)'} rx="2" />
    <rect x="210" y="80" width="32" height="70" fill="rgba(0,255,209,0.50)" rx="2" />
    {/* X-axis labels */}
    {['Q1', 'Q2', 'Q3', 'Q4'].map((q, i) => (
      <text key={q} x={76 + i * 50} y="165" textAnchor="middle" fill="rgba(245,239,224,0.45)" fontSize="11" fontFamily="monospace">
        {q}
      </text>
    ))}
    {/* Attention box on Q3 */}
    {showAttention && (
      <rect x="155" y="100" width="42" height="55" fill="none" stroke="var(--accent-warm)" strokeWidth="2" rx="3" strokeDasharray="4 2" />
    )}
    {/* Title */}
    <text x="160" y="14" textAnchor="middle" fill="rgba(245,239,224,0.55)" fontSize="10" fontFamily="monospace">
      Quarterly Revenue ($M)
    </text>
  </svg>
);

const CODE_SVG = (showAttention: boolean) => (
  <svg
    viewBox="0 0 280 180"
    aria-label="Code screenshot with a bug"
    style={{ width: '100%', height: '100%' }}
  >
    <rect width="280" height="180" fill="#1a1a2e" rx="8" />
    {/* Window chrome */}
    <circle cx="20" cy="16" r="5" fill="#e07070" />
    <circle cx="36" cy="16" r="5" fill="var(--accent-warm)" />
    <circle cx="52" cy="16" r="5" fill="var(--accent-primary)" />
    {/* Code lines */}
    {[
      { y: 38, color: '#569cd6', text: 'def calculate_total(items):' },
      { y: 54, color: 'rgba(245,239,224,0.55)', text: '  total = 0' },
      { y: 70, color: '#c586c0', text: '  for item in items:' },
      { y: 86, color: 'rgba(245,239,224,0.55)', text: '    total += item.price' },
      { y: 102, color: '#f44747', text: '  return total * 1.1  # bug here' },
      { y: 118, color: 'rgba(245,239,224,0.30)', text: '' },
      { y: 134, color: '#6a9955', text: '# Should apply tax once, not always' },
    ].map((line, i) => (
      <text key={i} x="12" y={line.y} fill={line.color} fontSize="10" fontFamily="monospace">
        {line.text}
      </text>
    ))}
    {/* Attention highlight on bug line */}
    {showAttention && (
      <rect x="8" y="93" width="264" height="16" fill="rgba(224,112,112,0.15)" rx="2" stroke="var(--error)" strokeWidth="1" />
    )}
  </svg>
);

const MEAL_SVG = (showAttention: boolean) => (
  <svg
    viewBox="0 0 280 180"
    aria-label="Overhead photo of a meal"
    style={{ width: '100%', height: '100%' }}
  >
    <rect width="280" height="180" fill="#2a2010" rx="8" />
    {/* Plate */}
    <circle cx="140" cy="95" r="72" fill="rgba(255,250,240,0.06)" stroke="rgba(255,250,240,0.12)" strokeWidth="1" />
    {/* Food regions */}
    <ellipse cx="120" cy="85" rx="35" ry="28" fill={showAttention ? 'rgba(170,255,77,0.30)' : 'rgba(80,140,60,0.60)'} />
    <ellipse cx="162" cy="90" rx="28" ry="22" fill="rgba(200,140,80,0.70)" />
    <ellipse cx="140" cy="115" rx="22" ry="16" fill="rgba(220,180,100,0.60)" />
    {/* Garnish dots */}
    {[{ x: 115, y: 78 }, { x: 128, y: 92 }, { x: 108, y: 88 }].map((p, i) => (
      <circle key={i} cx={p.x} cy={p.y} r="3" fill="rgba(170,255,77,0.80)" />
    ))}
    {/* Labels */}
    <text x="105" y="140" fill="rgba(245,239,224,0.40)" fontSize="9" fontFamily="monospace" textAnchor="middle">greens</text>
    <text x="162" y="140" fill="rgba(245,239,224,0.40)" fontSize="9" fontFamily="monospace" textAnchor="middle">protein</text>
    {/* Attention box on greens */}
    {showAttention && (
      <rect x="80" y="55" width="75" height="55" fill="none" stroke="var(--accent-primary)" strokeWidth="2" rx="4" strokeDasharray="4 2" />
    )}
    {/* Calorie estimate bubble */}
    {showAttention && (
      <>
        <rect x="8" y="8" width="110" height="22" fill="rgba(170,255,77,0.15)" rx="4" />
        <text x="63" y="23" textAnchor="middle" fill="var(--accent-primary)" fontSize="10" fontFamily="monospace">~420 kcal est.</text>
      </>
    )}
  </svg>
);

const SCENARIOS: Scenario[] = [
  {
    id: 'chart',
    label: 'Bar chart',
    question: 'What trend do you notice in this revenue chart?',
    response:
      'The bar chart shows quarterly revenue increasing from Q1 to Q2, then dropping sharply in Q3 — the shortest bar, roughly half the Q2 height. Q4 recovers but does not reach Q2 levels. The Q3 drop is the most notable signal here.',
    attentionRegions: [],
    renderSVG: BAR_CHART_SVG,
  },
  {
    id: 'code',
    label: 'Code',
    question: 'Does this code have any issues?',
    response:
      'Line 5 is suspicious: `return total * 1.1` unconditionally multiplies the total by 1.1 (presumably a tax factor). The inline comment confirms this — tax should be conditional or applied only when applicable, not always. This looks like a logic bug.',
    attentionRegions: [],
    renderSVG: CODE_SVG,
  },
  {
    id: 'meal',
    label: 'Meal photo',
    question: 'Can you estimate the calories and describe what you see?',
    response:
      'The plate appears to contain a green leafy component (spinach or arugula, lower calorie), a browned protein — likely chicken or fish — and a starchy side, possibly roasted potato or grain. Rough estimate: 380–460 kcal, depending on portion size and oil used in cooking.',
    attentionRegions: [],
    renderSVG: MEAL_SVG,
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function VisionLanguageDemo() {
  const [activeId, setActiveId] = useState('chart');
  const [showAttention, setShowAttention] = useState(false);

  const scenario = SCENARIOS.find((s) => s.id === activeId)!;

  return (
    <div>
      {/* Scenario picker */}
      <div
        role="tablist"
        aria-label="Select scenario"
        style={{
          display: 'flex',
          gap: 'var(--space-2)',
          flexWrap: 'wrap',
          marginBottom: 'var(--space-6)',
        }}
      >
        {SCENARIOS.map((s) => {
          const active = s.id === activeId;
          return (
            <button
              key={s.id}
              role="tab"
              aria-selected={active}
              onClick={() => {
                setActiveId(s.id);
                setShowAttention(false);
              }}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                letterSpacing: '0.05em',
                padding: 'var(--space-1) var(--space-3)',
                borderRadius: 'var(--radius-sm)',
                background: active ? 'var(--accent-primary-glow)' : 'var(--bg-elevated)',
                color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
                border: active
                  ? '1px solid var(--border-emphasis)'
                  : '1px solid var(--border-subtle)',
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 'var(--space-5)',
          marginBottom: 'var(--space-5)',
        }}
        className="vlm-grid"
      >
        {/* Image panel */}
        <div>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              margin: '0 0 var(--space-3)',
            }}
          >
            Image (SVG placeholder)
          </p>
          <div
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              aspectRatio: '280 / 180',
            }}
          >
            {scenario.renderSVG(showAttention)}
          </div>

          {/* Attention toggle */}
          <button
            onClick={() => setShowAttention((v) => !v)}
            aria-pressed={showAttention}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              marginTop: 'var(--space-3)',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.06em',
              padding: 'var(--space-2) var(--space-3)',
              borderRadius: 'var(--radius-sm)',
              background: showAttention ? 'var(--accent-primary-glow)' : 'var(--bg-elevated)',
              color: showAttention ? 'var(--accent-primary)' : 'var(--text-muted)',
              border: showAttention
                ? '1px solid var(--border-emphasis)'
                : '1px solid var(--border-subtle)',
              cursor: 'pointer',
              transition: 'all 150ms ease',
              width: '100%',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: showAttention ? 'var(--accent-primary)' : 'var(--text-muted)',
                transition: 'background 150ms ease',
              }}
            />
            {showAttention ? 'Attention overlay: on' : 'Show attention overlay'}
          </button>
        </div>

        {/* Question + response panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* User question */}
          <div
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-4)',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                margin: '0 0 var(--space-2)',
              }}
            >
              User question
            </p>
            <p
              style={{
                fontFamily: 'var(--font-editorial)',
                fontStyle: 'italic',
                fontSize: 'var(--text-sm)',
                color: 'var(--text-primary)',
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              {scenario.question}
            </p>
          </div>

          {/* Model response */}
          <div
            aria-live="polite"
            style={{
              background: 'var(--accent-primary-glow)',
              border: '1px solid var(--border-emphasis)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-4)',
              flexGrow: 1,
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--accent-primary)',
                margin: '0 0 var(--space-2)',
              }}
            >
              Model response
            </p>
            <p
              style={{
                fontFamily: 'var(--font-editorial)',
                fontSize: 'var(--text-sm)',
                color: 'var(--text-primary)',
                lineHeight: 1.8,
                margin: 0,
              }}
            >
              {scenario.response}
            </p>
          </div>
        </div>
      </div>

      {/* Caption */}
      <p
        style={{
          fontFamily: 'var(--font-editorial)',
          fontStyle: 'italic',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)',
          lineHeight: 1.75,
          margin: 0,
          textAlign: 'center',
        }}
      >
        The model processes image patches like tokens. The attention overlay shows which regions
        it weighted most heavily when forming its response.
      </p>

      <style>{`
        @media (max-width: 640px) {
          .vlm-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
