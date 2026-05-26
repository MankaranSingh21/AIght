'use client';

import { useState, useMemo } from 'react';
import { Playground } from './ConceptDemo';

// ── Precomputed Q/K/V vectors (4-dim) ───────────────────────────────────────
// Designed so attention patterns are linguistically plausible:
//   "The" → relatively flat (function word)
//   "cat" → attends to "sat" and "mat" (semantic cluster)
//   "sat" → attends to "cat" and "on" (verb connects subject + prep)
//   "on"  → attends to "sat" and "mat" (prep links verb + object)
//   "mat" → attends to "cat" and "sat" (complement cluster)

const TOKENS = ['The', 'cat', 'sat', 'on', 'mat'] as const;
type Token = (typeof TOKENS)[number];

interface QKV {
  Q: [number, number, number, number];
  K: [number, number, number, number];
  V: [number, number, number, number];
}

const VECTORS: Record<Token, QKV> = {
  The: {
    Q: [0.2, 0.1, -0.3, 0.4],
    K: [0.1, 0.2, -0.1, 0.3],
    V: [0.0, 0.5, 0.1, -0.2],
  },
  cat: {
    Q: [0.8, -0.3, 0.5, 0.1],
    K: [0.7, -0.2, 0.4, 0.2],
    V: [0.9, 0.1, -0.4, 0.3],
  },
  sat: {
    Q: [0.6, 0.4, -0.2, 0.7],
    K: [0.5, 0.3, -0.1, 0.6],
    V: [0.3, 0.8, 0.2, -0.1],
  },
  on: {
    Q: [-0.1, 0.7, 0.3, -0.4],
    K: [-0.2, 0.6, 0.2, -0.3],
    V: [0.1, 0.2, 0.7, -0.5],
  },
  mat: {
    Q: [0.7, -0.2, 0.6, 0.2],
    K: [0.8, -0.3, 0.5, 0.1],
    V: [0.6, 0.0, -0.3, 0.4],
  },
};

// ── Math helpers ─────────────────────────────────────────────────────────────

function dot(a: readonly number[], b: readonly number[]): number {
  return a.reduce((sum, val, i) => sum + val * b[i], 0);
}

function softmax(scores: number[]): number[] {
  const max = Math.max(...scores);
  const exps = scores.map((s) => Math.exp(s - max));
  const total = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / total);
}

function weightedSumV(weights: number[]): [number, number, number, number] {
  const result: [number, number, number, number] = [0, 0, 0, 0];
  TOKENS.forEach((tok, i) => {
    const v = VECTORS[tok].V;
    for (let d = 0; d < 4; d++) result[d] += weights[i] * v[d];
  });
  return result;
}

// ── Precompute all dot products at module load ────────────────────────────────
const DOT_PRODUCTS: Record<Token, number[]> = {} as Record<Token, number[]>;
const SOFTMAX_WEIGHTS: Record<Token, number[]> = {} as Record<Token, number[]>;
const OUTPUT_VECTORS: Record<Token, [number, number, number, number]> = {} as Record<
  Token,
  [number, number, number, number]
>;

TOKENS.forEach((queryTok) => {
  const q = VECTORS[queryTok].Q;
  const scores = TOKENS.map((keyTok) => dot(q, VECTORS[keyTok].K));
  const weights = softmax(scores);
  DOT_PRODUCTS[queryTok] = scores;
  SOFTMAX_WEIGHTS[queryTok] = weights;
  OUTPUT_VECTORS[queryTok] = weightedSumV(weights);
});

// ── Captions per query token ─────────────────────────────────────────────────
const CAPTIONS: Record<Token, string> = {
  The: `"The" is a function word with little semantic content. Its query attends relatively evenly — there's not much to lock onto.`,
  cat: `"cat" attends most to "sat" and "mat" — the words it's grouped with semantically. The math is just dot products and a softmax.`,
  sat: `"sat" is the verb. Its query reaches toward "cat" (the subject) and "on" (the preposition it governs). The structure surfaces in the scores.`,
  on: `"on" bridges verb and object. Its query pulls toward "sat" and "mat" — the words it grammatically connects.`,
  mat: `"mat" completes the phrase. Its query attends back to "cat" and "sat" — the content words that give it context.`,
};

// ── Formatting ────────────────────────────────────────────────────────────────
function fmtNum(n: number): string {
  return (n >= 0 ? '+' : '') + n.toFixed(2);
}

function fmtVec(v: readonly number[]): string {
  return '[' + v.map((x) => x.toFixed(2)).join(', ') + ']';
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function AttentionQkvDemo() {
  const [queryToken, setQueryToken] = useState<Token>('cat');

  const scores = DOT_PRODUCTS[queryToken];
  const weights = SOFTMAX_WEIGHTS[queryToken];
  const outputVec = OUTPUT_VECTORS[queryToken];
  const maxScoreIdx = useMemo(() => {
    let maxIdx = 0;
    scores.forEach((s, i) => { if (s > scores[maxIdx]) maxIdx = i; });
    return maxIdx;
  }, [scores]);

  const qVec = VECTORS[queryToken].Q;

  return (
    <Playground ariaLabel="Attention QKV computation playground">
      <style>{`
        .qkv-token-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: var(--space-4);
        }
        .qkv-token-btn {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 4px;
          background: var(--bg-elevated);
          border: 1.5px solid var(--border-default);
          border-radius: var(--radius-md);
          padding: 8px 12px;
          cursor: pointer;
          transition: border-color 150ms ease, background 150ms ease;
          min-width: 80px;
        }
        .qkv-token-btn[aria-pressed="true"] {
          border-color: var(--accent-primary);
          background: var(--accent-primary-glow);
        }
        .qkv-token-btn:hover:not([aria-pressed="true"]) {
          border-color: var(--glass-border-hover);
        }
        .qkv-pipeline {
          display: grid;
          grid-template-columns: 1fr 1.5fr 1.5fr;
          gap: var(--space-4);
          margin: var(--space-5) 0;
        }
        @media (max-width: 640px) {
          .qkv-pipeline {
            grid-template-columns: 1fr !important;
          }
        }
        .qkv-col {
          background: var(--bg-base);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: var(--space-4);
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }
        .qkv-col-label {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 2px;
        }
        .qkv-col-letter {
          font-family: var(--font-mono);
          font-size: 22px;
          font-weight: 700;
          color: var(--accent-primary);
          line-height: 1;
        }
        .qkv-vec-line {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--text-secondary);
          line-height: 1.6;
        }
        .qkv-dot-row {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .qkv-dot-entry {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--text-secondary);
          line-height: 1.5;
          transition: color 150ms ease;
        }
        .qkv-dot-entry.is-max {
          color: var(--accent-primary);
        }
        .qkv-softmax-label {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.06em;
          color: var(--text-muted);
          padding-top: var(--space-2);
          border-top: 1px solid var(--border-subtle);
        }
        .qkv-bar-row {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .qkv-bar-entry {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .qkv-bar-label {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }
        .qkv-bar-name {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-secondary);
        }
        .qkv-bar-pct {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--text-muted);
        }
        .qkv-bar-track {
          height: 6px;
          background: var(--bg-elevated);
          border-radius: 3px;
          overflow: hidden;
        }
        .qkv-bar-fill {
          height: 100%;
          background: var(--accent-primary);
          border-radius: 3px;
          transition: width 220ms ease;
        }
        .qkv-result {
          margin-top: var(--space-4);
          padding: var(--space-4) var(--space-5);
          background: var(--bg-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
        }
        .qkv-caption {
          margin-top: var(--space-4);
          font-family: var(--font-editorial);
          font-style: italic;
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.7;
          border-left: 2px solid var(--border-emphasis);
          padding-left: var(--space-4);
          transition: opacity 200ms ease;
        }
      `}</style>

      {/* ── Token row ── */}
      <div
        className="qkv-token-row"
        role="group"
        aria-label="Select query token"
      >
        {TOKENS.map((tok) => {
          const qv = VECTORS[tok].Q;
          return (
            <button
              key={tok}
              className="qkv-token-btn"
              aria-pressed={queryToken === tok}
              aria-label={`Set "${tok}" as query token`}
              onClick={() => setQueryToken(tok)}
            >
              <span
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontWeight: 600,
                  fontSize: 15,
                  color: queryToken === tok ? 'var(--accent-primary)' : 'var(--text-primary)',
                  transition: 'color 150ms ease',
                }}
              >
                {tok}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9,
                  color: 'var(--text-muted)',
                  letterSpacing: '0.02em',
                  lineHeight: 1.4,
                  whiteSpace: 'nowrap',
                }}
              >
                [{qv.map((x) => x.toFixed(1)).join(', ')}]
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Query label ── */}
      <p
        style={{
          fontFamily: 'var(--font-editorial)',
          fontStyle: 'italic',
          fontSize: 13,
          color: 'var(--text-secondary)',
          marginBottom: 'var(--space-2)',
        }}
      >
        Computing attention from token:{' '}
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontStyle: 'normal',
            color: 'var(--accent-primary)',
          }}
        >
          &quot;{queryToken}&quot;
        </span>
      </p>

      {/* ── Pipeline columns ── */}
      <div className="qkv-pipeline">
        {/* Column A — Q vector */}
        <div className="qkv-col">
          <div className="qkv-col-label">Column A</div>
          <div className="qkv-col-letter">Q</div>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--text-muted)',
              lineHeight: 1.5,
              marginBottom: 4,
            }}
          >
            Query vector for &quot;{queryToken}&quot;
          </p>
          <div className="qkv-vec-line">
            {qVec.map((val, d) => (
              <div key={d}>
                q[{d}] = <span style={{ color: 'var(--text-primary)' }}>{fmtNum(val)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Column B — Dot products */}
        <div className="qkv-col">
          <div className="qkv-col-label">Column B</div>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 14,
              fontWeight: 700,
              color: 'var(--text-primary)',
              lineHeight: 1,
            }}
          >
            Q · K scores
          </p>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--text-muted)',
              lineHeight: 1.5,
              marginBottom: 4,
            }}
          >
            dot product for each key token
          </p>
          <div className="qkv-dot-row">
            {TOKENS.map((keyTok, i) => (
              <div
                key={keyTok}
                className={`qkv-dot-entry${i === maxScoreIdx ? ' is-max' : ''}`}
              >
                Q · K<sub style={{ fontSize: 9 }}>{keyTok}</sub>{' '}
                ={' '}
                <span style={{ fontWeight: i === maxScoreIdx ? 700 : 400 }}>
                  {fmtNum(scores[i])}
                </span>
                {i === maxScoreIdx && (
                  <span style={{ marginLeft: 6, fontSize: 10, opacity: 0.8 }}>▲</span>
                )}
              </div>
            ))}
          </div>
          <div className="qkv-softmax-label">↓ softmax over all 5 scores</div>
        </div>

        {/* Column C — Attention weights */}
        <div className="qkv-col">
          <div className="qkv-col-label">Column C</div>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 14,
              fontWeight: 700,
              color: 'var(--text-primary)',
              lineHeight: 1,
            }}
          >
            Weights
          </p>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--text-muted)',
              lineHeight: 1.5,
              marginBottom: 4,
            }}
          >
            softmax(scores) — sums to 100%
          </p>
          <div className="qkv-bar-row">
            {TOKENS.map((tok, i) => {
              const pct = weights[i] * 100;
              return (
                <div key={tok} className="qkv-bar-entry">
                  <div className="qkv-bar-label">
                    <span className="qkv-bar-name">{tok}</span>
                    <span className="qkv-bar-pct">{pct.toFixed(1)}%</span>
                  </div>
                  <div className="qkv-bar-track">
                    <div
                      className="qkv-bar-fill"
                      style={{ width: `${pct}%` }}
                      role="img"
                      aria-label={`${tok}: ${pct.toFixed(1)}%`}
                    >
                      <title>{`${tok}: ${pct.toFixed(1)}% attention weight`}</title>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Result row ── */}
      <div className="qkv-result">
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            display: 'block',
            marginBottom: 6,
          }}
        >
          Output
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            color: 'var(--text-primary)',
          }}
        >
          Weighted sum of V vectors ={' '}
          <span style={{ color: 'var(--accent-primary)' }}>
            {fmtVec(outputVec)}
          </span>
        </span>
      </div>

      {/* ── Caption ── */}
      <p className="qkv-caption">{CAPTIONS[queryToken]}</p>
    </Playground>
  );
}
