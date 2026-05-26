'use client';

import { useState } from 'react';
import { Playground } from './ConceptDemo';

// ── Data ──────────────────────────────────────────────────────────────────────

interface BiasAxis {
  axis: string;
  score: number; // 0–100
}

interface ModelCard {
  id: string;
  name: string;
  intendedUse: string;
  trainingData: string;
  limitations: string[];
  biasEvals: BiasAxis[];
  lastUpdated: string;
}

const MODEL_CARDS: ModelCard[] = [
  {
    id: 'gpt4o',
    name: 'GPT-4o',
    intendedUse: 'General-purpose assistant for text, vision, and audio across consumer and API uses.',
    trainingData: 'Web text, books, code, and multimodal data up to April 2023; exact sources undisclosed.',
    limitations: [
      'May generate plausible but factually incorrect information (hallucination).',
      'Uneven performance on low-resource languages and specialised domains.',
      'Cannot reliably perform real-time reasoning on current events.',
    ],
    biasEvals: [
      { axis: 'Gender', score: 73 },
      { axis: 'Political', score: 61 },
      { axis: 'Profession', score: 68 },
    ],
    lastUpdated: '2024-05-13',
  },
  {
    id: 'claude35',
    name: 'Claude 3.5 Sonnet',
    intendedUse: 'Long-context reasoning, code generation, and nuanced instruction-following for enterprise use.',
    trainingData: 'Web crawls, books, and code repositories; data filtered to April 2024 with Constitutional AI post-training.',
    limitations: [
      'Tends toward over-caution and refusals on edge-case queries.',
      'Performance degrades on very long documents approaching context limits.',
      'Struggles with precise numerical calculations without tool use.',
    ],
    biasEvals: [
      { axis: 'Gender', score: 81 },
      { axis: 'Political', score: 70 },
      { axis: 'Profession', score: 76 },
    ],
    lastUpdated: '2024-06-20',
  },
  {
    id: 'llama70b',
    name: 'Llama 3.1 70B',
    intendedUse: 'Open-weights base for fine-tuning, research, and on-premise deployment across verticals.',
    trainingData: '15T tokens of public internet data and licensed sources; details in Meta technical report.',
    limitations: [
      'Requires substantial hardware (≥2× A100 GPUs) for inference.',
      'Safety alignment weaker than proprietary models without additional fine-tuning.',
      'Multilingual quality notably lower than English-only tasks.',
    ],
    biasEvals: [
      { axis: 'Gender', score: 64 },
      { axis: 'Political', score: 55 },
      { axis: 'Profession', score: 60 },
    ],
    lastUpdated: '2024-07-23',
  },
  {
    id: 'mistral7b',
    name: 'Mistral 7B',
    intendedUse: 'Efficient edge deployment, embedded use cases, and rapid prototyping on consumer hardware.',
    trainingData: 'Web and code data; exact token count and sources are not publicly documented.',
    limitations: [
      'Parameter count limits complex multi-step reasoning depth.',
      'Fine-tuning required for most production safety requirements.',
      'Context window (32K) smaller than frontier models for long-document tasks.',
    ],
    biasEvals: [
      { axis: 'Gender', score: 58 },
      { axis: 'Political', score: 50 },
      { axis: 'Profession', score: 54 },
    ],
    lastUpdated: '2023-09-27',
  },
];

// ── Sub-components ─────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: string }) {
  return (
    <span
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
        display: 'block',
        marginBottom: 'var(--space-1)',
      }}
    >
      {children}
    </span>
  );
}

function BiasBar({ axis, score }: BiasAxis) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '72px 1fr 36px', gap: 'var(--space-2)', alignItems: 'center' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)' }}>
        {axis}
      </span>
      <div
        style={{
          background: 'var(--bg-elevated)',
          borderRadius: 'var(--radius-sm)',
          height: 10,
          overflow: 'hidden',
          border: '1px solid var(--border-subtle)',
        }}
        aria-label={`${axis}: ${score}%`}
      >
        <div
          style={{
            width: `${score}%`,
            height: '100%',
            background: score >= 70 ? 'var(--accent-primary)' : score >= 60 ? 'var(--accent-warm)' : 'var(--error)',
            opacity: 0.8,
            borderRadius: 'var(--radius-sm)',
            transition: 'width 300ms ease',
          }}
        />
      </div>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', textAlign: 'right' }}>
        {score}%
      </span>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function ModelCardsDemo() {
  const [activeId, setActiveId] = useState<string>(MODEL_CARDS[0].id);

  const card = MODEL_CARDS.find(m => m.id === activeId)!;

  return (
    <Playground
      ariaLabel="Model card explorer"
      caption="A model card is the cover letter the model writes about itself. The interesting parts are usually buried."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>

        {/* Model tabs */}
        <div
          style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}
          role="tablist"
          aria-label="Model selector"
        >
          {MODEL_CARDS.map(m => (
            <button
              key={m.id}
              role="tab"
              aria-selected={m.id === activeId}
              onClick={() => setActiveId(m.id)}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                letterSpacing: '0.05em',
                padding: 'var(--space-1) var(--space-3)',
                borderRadius: 'var(--radius-sm)',
                background: m.id === activeId ? 'var(--accent-primary-glow)' : 'var(--bg-elevated)',
                color: m.id === activeId ? 'var(--accent-primary)' : 'var(--text-secondary)',
                border: m.id === activeId ? '1px solid var(--border-emphasis)' : '1px solid var(--border-subtle)',
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
            >
              {m.name}
            </button>
          ))}
        </div>

        {/* Card body */}
        <div
          role="tabpanel"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-5)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-5)',
          }}
        >
          {/* Intended use */}
          <div>
            <SectionLabel>Intended use</SectionLabel>
            <p
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: 'var(--text-sm)',
                color: 'var(--text-primary)',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {card.intendedUse}
            </p>
          </div>

          {/* Training data */}
          <div>
            <SectionLabel>Training data</SectionLabel>
            <p
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: 'var(--text-sm)',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {card.trainingData}
            </p>
          </div>

          {/* Known limitations */}
          <div>
            <SectionLabel>Known limitations</SectionLabel>
            <ul
              style={{
                margin: 0,
                padding: 0,
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-2)',
              }}
            >
              {card.limitations.map((lim, i) => (
                <li
                  key={i}
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                    paddingLeft: 'var(--space-4)',
                    position: 'relative',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: 0,
                      color: 'var(--accent-warm)',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    ·
                  </span>
                  {lim}
                </li>
              ))}
            </ul>
          </div>

          {/* Bias evals */}
          <div>
            <SectionLabel>Bias evaluation results</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
              {card.biasEvals.map(b => (
                <BiasBar key={b.axis} {...b} />
              ))}
            </div>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: 'var(--text-muted)',
                margin: 'var(--space-2) 0 0',
              }}
            >
              Higher = lower bias on internal eval set. Methodology varies by lab.
            </p>
          </div>

          {/* Last updated */}
          <div
            style={{
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: 'var(--space-3)',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: 'var(--text-muted)',
                letterSpacing: '0.04em',
              }}
            >
              Last updated: {card.lastUpdated}
            </span>
          </div>
        </div>
      </div>
    </Playground>
  );
}
