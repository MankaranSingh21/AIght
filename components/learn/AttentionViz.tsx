'use client';
import { useState } from 'react';

interface WordToken {
  text: string;
  cx: number;
}

// Words positioned in a 460×160 SVG, centred at y=120 (dot) + y=137 (label)
const WORDS: WordToken[] = [
  { text: 'The',     cx: 26  },
  { text: 'cat',     cx: 66  },
  { text: 'sat',     cx: 106 },
  { text: 'on',      cx: 143 },
  { text: 'the',     cx: 176 },
  { text: 'mat',     cx: 210 },
  { text: 'because', cx: 265 },
  { text: 'it',      cx: 326 },
  { text: 'was',     cx: 362 },
  { text: 'tired',   cx: 406 },
];

// Attention weights: WEIGHTS[sourceIdx][targetIdx] = weight (0–1)
const WEIGHTS: Record<number, Record<number, number>> = {
  0: { 1: 0.75, 5: 0.30 },
  1: { 2: 0.70, 0: 0.50, 5: 0.25 },
  2: { 1: 0.65, 3: 0.55 },
  3: { 5: 0.70, 2: 0.40 },
  4: { 5: 0.80, 1: 0.20 },
  5: { 3: 0.55, 1: 0.45, 7: 0.30 },
  6: { 1: 0.60, 7: 0.50, 5: 0.35 },
  7: { 1: 0.85, 5: 0.40, 8: 0.15 },
  8: { 9: 0.75, 7: 0.45 },
  9: { 7: 0.80, 8: 0.65, 1: 0.20 },
};

const LABELS: Record<number, string> = {
  0: "Reading 'The' — the model looks forward to find its subject.",
  1: "Reading 'cat' — strongly linked to 'sat', the action that follows.",
  2: "Reading 'sat' — looks back to 'cat', its subject.",
  3: "Reading 'on' — looks ahead to 'mat', completing the phrase.",
  4: "Reading 'the' (second) — almost entirely predicts 'mat'.",
  5: "Reading 'mat' — cross-references 'on' and 'cat'.",
  6: "Reading 'because' — anticipates the cause through 'cat' and 'it'.",
  7: "Reading 'it' — focuses most on 'cat'. That's the referent.",
  8: "Reading 'was' — traces forward to 'tired' as its predicate.",
  9: "Reading 'tired' — resolves through 'it' and 'was' to find the subject.",
};

const DOT_Y = 112;
const TEXT_Y = 130;

function curvePath(x1: number, x2: number): string {
  const midX = (x1 + x2) / 2;
  const ctrlY = Math.max(18, DOT_Y - Math.abs(x2 - x1) * 0.42);
  return `M ${x1},${DOT_Y} Q ${midX},${ctrlY} ${x2},${DOT_Y}`;
}

export default function AttentionViz() {
  const [selected, setSelected] = useState<number | null>(null);
  const [animKey, setAnimKey] = useState(0);

  function handleClick(i: number) {
    setSelected(i);
    setAnimKey(k => k + 1);
  }

  const connections = selected !== null ? WEIGHTS[selected] ?? {} : {};

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-xl)',
      padding: 'var(--space-10)',
      margin: 'var(--space-10) 0',
    }}>
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
        marginBottom: 'var(--space-4)',
      }}>
        ◉ INTERACTIVE — click any word
      </p>

      <svg
        viewBox="0 0 460 148"
        style={{ width: '100%', height: 'auto', display: 'block' }}
        aria-label="Transformer attention visualisation — click a word to see what the model attends to"
      >
        <style>{`
          @keyframes attnDraw {
            from { stroke-dashoffset: 500; }
            to   { stroke-dashoffset: 0; }
          }
        `}</style>

        {/* Connection lines */}
        {Object.entries(connections).map(([targetStr, weight]) => {
          const target = Number(targetStr);
          if (selected === null || target === selected) return null;
          const x1 = WORDS[selected].cx;
          const x2 = WORDS[target].cx;
          const sw = 1 + (weight as number) * 2.4;
          return (
            <path
              key={`${animKey}-${target}`}
              d={curvePath(x1, x2)}
              stroke="var(--accent-primary)"
              strokeWidth={sw}
              strokeDasharray={500}
              fill="none"
              opacity={weight as number}
              style={{ animation: 'attnDraw 400ms ease forwards' }}
            />
          );
        })}

        {/* Word tokens */}
        {WORDS.map(({ text, cx }, i) => {
          const isSelected = i === selected;
          const isTarget = selected !== null && connections[i] !== undefined && i !== selected;
          const isDimmed = selected !== null && !isSelected && !isTarget;

          const chipW = text.length * 7 + 14;
          const chipX = cx - chipW / 2;

          return (
            <g
              key={i}
              onClick={() => handleClick(i)}
              style={{ cursor: 'pointer' }}
              role="button"
              aria-label={`Click to see attention from "${text}"`}
            >
              <rect
                x={chipX}
                y={DOT_Y - 14}
                width={chipW}
                height={24}
                rx={4}
                style={{
                  fill: isSelected
                    ? 'var(--accent-primary)'
                    : isTarget
                    ? 'var(--accent-primary-glow)'
                    : 'var(--bg-elevated)',
                  stroke: isSelected
                    ? 'var(--accent-primary)'
                    : isTarget
                    ? 'var(--accent-primary)'
                    : 'var(--border-default)',
                  strokeWidth: isTarget ? 1.5 : 1,
                  opacity: isDimmed ? 0.35 : 1,
                  transition: 'fill 200ms ease, stroke 200ms ease, opacity 200ms ease',
                }}
              />
              <text
                x={cx}
                y={TEXT_Y}
                textAnchor="middle"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fill: isSelected
                    ? 'var(--text-inverse)'
                    : isTarget
                    ? 'var(--accent-primary)'
                    : 'var(--text-secondary)',
                  opacity: isDimmed ? 0.35 : 1,
                  pointerEvents: 'none',
                  userSelect: 'none',
                  transition: 'fill 200ms ease, opacity 200ms ease',
                }}
              >
                {text}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Label */}
      <div style={{
        minHeight: 40,
        marginTop: 'var(--space-4)',
        transition: 'opacity 300ms ease',
        opacity: selected !== null ? 1 : 0,
      }}>
        {selected !== null && (
          <p style={{
            fontFamily: 'var(--font-editorial)',
            fontStyle: 'italic',
            fontSize: 'var(--text-base)',
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            margin: 0,
          }}>
            {LABELS[selected]}
          </p>
        )}
      </div>

      {selected === null && (
        <p style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-muted)',
          marginTop: 'var(--space-4)',
          margin: 0,
        }}>
          Click a word to see which others the model attends to.
        </p>
      )}
    </div>
  );
}
