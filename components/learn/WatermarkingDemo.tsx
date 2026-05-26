'use client';

import { useState } from 'react';
import ConceptDemo from './ConceptDemo/ConceptDemo';

// ---------------------------------------------------------------------------
// Pre-computed token data (30 tokens, fixed)
// ---------------------------------------------------------------------------

// "Green" = biased toward in watermarked mode. Each token has a fixed
// green-list membership. Watermarked mode shows ~70% green, plain ~50%.

interface Token {
  text: string;
  isGreen: boolean;   // fixed membership in this demo's green list
}

const TOKENS: Token[] = [
  { text: 'The',       isGreen: true  },
  { text: ' model',    isGreen: false },
  { text: ' samples',  isGreen: true  },
  { text: ' the',      isGreen: true  },
  { text: ' next',     isGreen: false },
  { text: ' token',    isGreen: true  },
  { text: ' from',     isGreen: false },
  { text: ' a',        isGreen: true  },
  { text: ' prob',     isGreen: true  },
  { text: 'ability',   isGreen: false },
  { text: ' dist',     isGreen: true  },
  { text: 'ribution',  isGreen: false },
  { text: '.',         isGreen: true  },
  { text: ' A',        isGreen: true  },
  { text: ' secret',   isGreen: false },
  { text: ' key',      isGreen: true  },
  { text: ' splits',   isGreen: true  },
  { text: ' vocab',    isGreen: false },
  { text: 'ulary',     isGreen: true  },
  { text: ' into',     isGreen: true  },
  { text: ' green',    isGreen: true  },
  { text: ' and',      isGreen: false },
  { text: ' red',      isGreen: false },
  { text: ' lists',    isGreen: true  },
  { text: '.',         isGreen: true  },
  { text: ' Green',    isGreen: true  },
  { text: ' tokens',   isGreen: false },
  { text: ' win',      isGreen: true  },
  { text: '.',         isGreen: true  },
  { text: ' Always',   isGreen: false },
];

// In watermarked mode: green tokens are boosted → visible. In plain mode,
// some green tokens are swapped for neutral ones.
// We simulate this by giving each token a "plain" override (sometimes non-green).
const PLAIN_OVERRIDES: boolean[] = [
  true, false, false, true, false, true, false, true, false, false,
  true, false, true, true, false, false, true, false, true, false,
  true, false, false, false, true, false, false, true, false, false,
];

function getTokensForMode(watermarked: boolean): Array<Token & { display: boolean }> {
  return TOKENS.map((tok, i) => ({
    ...tok,
    display: watermarked ? tok.isGreen : PLAIN_OVERRIDES[i],
  }));
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function WatermarkingDemo() {
  const [watermarked, setWatermarked] = useState(true);

  const displayTokens = getTokensForMode(watermarked);
  const greenCount = displayTokens.filter((t) => t.display).length;
  const total = displayTokens.length;
  const ratio = Math.round((greenCount / total) * 100);

  return (
    <ConceptDemo ariaLabel="Watermarking green-list demo" shape="playground">
      {/* Mode toggle */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-6)', alignItems: 'center', flexWrap: 'wrap' }}>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
          }}
        >
          Mode:
        </span>
        {(['WATERMARKED', 'PLAIN'] as const).map((mode) => {
          const active = (mode === 'WATERMARKED') === watermarked;
          return (
            <button
              key={mode}
              onClick={() => setWatermarked(mode === 'WATERMARKED')}
              aria-pressed={active}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                letterSpacing: '0.08em',
                padding: 'var(--space-2) var(--space-4)',
                borderRadius: 'var(--radius-sm)',
                background: active ? 'var(--accent-primary-glow)' : 'var(--bg-elevated)',
                color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
                border: active ? '1px solid var(--border-emphasis)' : '1px solid var(--border-subtle)',
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
            >
              {mode}
            </button>
          );
        })}
      </div>

      {/* Token chips */}
      <div
        aria-label="Generated paragraph as token chips"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 4,
          alignItems: 'baseline',
          padding: 'var(--space-5)',
          background: 'var(--bg-elevated)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          marginBottom: 'var(--space-5)',
          lineHeight: 1.8,
        }}
      >
        {displayTokens.map((tok, i) => (
          <span
            key={i}
            title={tok.display ? 'green-list token' : 'neutral token'}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              padding: '2px 5px',
              borderRadius: 3,
              background: tok.display ? 'rgba(170,255,77,0.12)' : 'var(--bg-base)',
              color: tok.display ? 'var(--accent-primary)' : 'var(--text-secondary)',
              border: tok.display ? '1px solid rgba(170,255,77,0.28)' : '1px solid var(--border-subtle)',
              transition: 'all 200ms ease',
              whiteSpace: 'pre' as const,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 3,
            }}
          >
            {tok.text.trimStart()}
            <span
              aria-hidden="true"
              style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: tok.display ? 'var(--accent-primary)' : 'rgba(245,239,224,0.20)',
                display: 'inline-block',
                flexShrink: 0,
              }}
            />
          </span>
        ))}
      </div>

      {/* Gauge bar */}
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
            }}
          >
            Green-list ratio
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: watermarked ? 'var(--accent-primary)' : 'var(--text-secondary)',
              transition: 'color 200ms ease',
            }}
          >
            {greenCount} / {total} tokens ({ratio}%)
          </span>
        </div>
        <div
          role="meter"
          aria-label="Green-list ratio gauge"
          aria-valuenow={ratio}
          aria-valuemin={0}
          aria-valuemax={100}
          style={{
            height: 8,
            background: 'var(--bg-base)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div
            style={{
              width: `${ratio}%`,
              height: '100%',
              background: watermarked ? 'var(--accent-primary)' : 'rgba(245,239,224,0.30)',
              borderRadius: 'var(--radius-full)',
              transition: 'width 350ms ease, background 200ms ease',
            }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-1)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>0%</span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--accent-warm)',
              letterSpacing: '0.04em',
            }}
          >
            detection threshold ~60%
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>100%</span>
        </div>
      </div>

      {/* Caption */}
      <p
        style={{
          fontFamily: 'var(--font-editorial)',
          fontStyle: 'italic',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)',
          lineHeight: 1.7,
          margin: 0,
        }}
      >
        Readers see no difference. A watermark detector reads the ratio.
      </p>
    </ConceptDemo>
  );
}
