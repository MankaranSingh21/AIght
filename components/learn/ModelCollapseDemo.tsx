'use client';

import { useState } from 'react';

// ── Pre-computed generation data ──────────────────────────────────────────────

interface Generation {
  label: string;
  text: string;
  diversityScore: number;
  caption: string;
}

const GENERATIONS: Generation[] = [
  {
    label: 'Gen 0',
    text:
      'The Amazon rainforest is home to an extraordinary diversity of life. Jaguars stalk the undergrowth; macaws wheel overhead in flashes of scarlet and green. The river systems, ancient and labyrinthine, carry nutrients from the Andes to the Atlantic. Indigenous communities have mapped these systems for millennia, developing languages and practices that encode ecological knowledge unavailable in any database.',
    diversityScore: 0.92,
    caption:
      'Original human-written corpus. Varied vocabulary, rare words, vivid specificity. The distribution is wide.',
  },
  {
    label: 'Gen 1',
    text:
      'The Amazon rainforest is home to many diverse species of animals and plants. Jaguars can be found in the undergrowth, and colorful birds fly overhead. The rivers carry important nutrients and support many communities. Indigenous peoples have lived in this region for thousands of years and have developed important knowledge about the ecosystem.',
    diversityScore: 0.78,
    caption:
      'First synthetic generation. Still coherent — but "extraordinary" became "many", "labyrinthine" disappeared. Rare words are already fading.',
  },
  {
    label: 'Gen 3',
    text:
      'The Amazon rainforest is an important ecosystem with many animals and plants. Many animals live in the rainforest. The rivers are important for the ecosystem. Many communities live near the rivers. The rainforest is very important for the environment and many species.',
    diversityScore: 0.55,
    caption:
      'Third generation. "Many" appears four times. Sentences converge on the same structure. Specific knowledge — jaguars, Andes, macaws — is gone.',
  },
  {
    label: 'Gen 10',
    text:
      'The rainforest is important. The rainforest has many animals. The animals are important. The ecosystem is important. The rainforest is very important for the animals. The animals live in the rainforest. The rainforest ecosystem is important for the animals and the environment.',
    diversityScore: 0.22,
    caption:
      'Tenth generation. The model has converged on looping fragments. It generates confident, grammatical text — and has almost nothing left to say.',
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function ModelCollapseDemo() {
  const [activeIdx, setActiveIdx] = useState(0);
  const gen = GENERATIONS[activeIdx];
  const barWidth = `${Math.round(gen.diversityScore * 100)}%`;

  const scoreColor =
    gen.diversityScore > 0.75
      ? 'var(--accent-primary)'
      : gen.diversityScore > 0.45
      ? 'var(--accent-warm)'
      : 'var(--error)';

  return (
    <div>
      {/* Generation tabs */}
      <div
        role="tablist"
        aria-label="Select generation"
        style={{
          display: 'flex',
          gap: 'var(--space-2)',
          flexWrap: 'wrap',
          marginBottom: 'var(--space-6)',
        }}
      >
        {GENERATIONS.map((g, i) => {
          const active = i === activeIdx;
          return (
            <button
              key={g.label}
              role="tab"
              aria-selected={active}
              onClick={() => setActiveIdx(i)}
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
              {g.label}
            </button>
          );
        })}
      </div>

      {/* Sample text */}
      <div
        role="region"
        aria-label={`${gen.label} sample text`}
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-5)',
          marginBottom: 'var(--space-5)',
          minHeight: 120,
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-editorial)',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-primary)',
            lineHeight: 1.8,
            margin: 0,
          }}
        >
          {gen.text}
        </p>
      </div>

      {/* Diversity score bar */}
      <div style={{ marginBottom: 'var(--space-5)' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 'var(--space-2)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
            }}
          >
            Vocabulary diversity score
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-sm)',
              fontWeight: 700,
              color: scoreColor,
            }}
          >
            {gen.diversityScore.toFixed(2)}
          </span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={Math.round(gen.diversityScore * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Diversity score"
          style={{
            height: 8,
            background: 'var(--bg-overlay)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: barWidth,
              background: scoreColor,
              borderRadius: 'var(--radius-full)',
              transition: 'width 350ms cubic-bezier(0.16, 1, 0.3, 1), background 350ms ease',
            }}
          />
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
          paddingLeft: 'var(--space-4)',
          borderLeft: '3px solid var(--border-emphasis)',
        }}
      >
        {gen.caption}
      </p>

      <style>{`
        @media (max-width: 640px) {
          .mc-tabs { flex-direction: column; }
        }
      `}</style>
    </div>
  );
}
