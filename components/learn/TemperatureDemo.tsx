'use client';

import { useState, useMemo, useId } from 'react';
import { Playground } from './ConceptDemo';

// ── Base token probability distribution ─────────────────────────────────────
// "The cat sat on the ___"
// Precomputed plausible next-token probabilities (sum = 1.0)
const BASE_TOKENS: { token: string; prob: number }[] = [
  { token: 'mat',      prob: 0.32 },
  { token: 'floor',   prob: 0.18 },
  { token: 'bed',     prob: 0.14 },
  { token: 'chair',   prob: 0.10 },
  { token: 'couch',   prob: 0.08 },
  { token: 'moon',    prob: 0.08 },
  { token: 'roof',    prob: 0.06 },
  { token: 'keyboard',prob: 0.04 },
];

// ── Math transforms ──────────────────────────────────────────────────────────

function applyTemperature(probs: number[], temp: number): number[] {
  // Avoid divide-by-zero: clamp temp to a tiny minimum
  const t = Math.max(temp, 0.01);
  // p_new[i] = p_orig[i]^(1/T), then normalize
  const scaled = probs.map((p) => Math.pow(p, 1 / t));
  const sum = scaled.reduce((a, b) => a + b, 0);
  return scaled.map((p) => p / sum);
}

function applyTopK(probs: number[], k: number): number[] {
  // Find the k-th largest value; zero out everything below it
  const sorted = [...probs].sort((a, b) => b - a);
  const threshold = sorted[k - 1] ?? 0;
  const filtered = probs.map((p) => (p >= threshold ? p : 0));
  const sum = filtered.reduce((a, b) => a + b, 0);
  if (sum === 0) return probs.map(() => 0);
  return filtered.map((p) => p / sum);
}

function applyTopP(probs: number[], topP: number): number[] {
  // Sort indices by descending probability
  const indexed = probs.map((p, i) => ({ p, i })).sort((a, b) => b.p - a.p);
  let cumulative = 0;
  const keep = new Set<number>();
  for (const { p, i } of indexed) {
    cumulative += p;
    keep.add(i);
    if (cumulative >= topP) break;
  }
  const filtered = probs.map((p, i) => (keep.has(i) ? p : 0));
  const sum = filtered.reduce((a, b) => a + b, 0);
  if (sum === 0) return probs.map(() => 0);
  return filtered.map((p) => p / sum);
}

function computeDistribution(
  baseProbsIn: number[],
  temperature: number,
  topK: number,
  topP: number,
): number[] {
  let probs = applyTemperature(baseProbsIn, temperature);
  probs = applyTopK(probs, topK);
  probs = applyTopP(probs, topP);
  return probs;
}

// ── Chart constants ──────────────────────────────────────────────────────────
const CHART_W = 480;
const CHART_H = 200;
const BAR_HEIGHT = 18;
const BAR_GAP = 6;
const LABEL_W = 80;
const PCT_W = 48;

// ── Component ────────────────────────────────────────────────────────────────
export default function TemperatureDemo() {
  const [temperature, setTemperature] = useState(1.0);
  const [topK, setTopK] = useState(10);
  const [topP, setTopP] = useState(1.0);

  const tempId = useId();
  const topKId = useId();
  const topPId = useId();

  const baseProbsArray = useMemo(() => BASE_TOKENS.map((t) => t.prob), []);

  const finalProbs = useMemo(
    () => computeDistribution(baseProbsArray, temperature, topK, topP),
    [baseProbsArray, temperature, topK, topP],
  );

  // Caption logic — priority: top-k=1 > extreme T > default (none)
  const caption: string | null = useMemo(() => {
    if (topK === 1) return 'One option. This is greedy decoding.';
    if (temperature <= 0.2) return `Sharp. The model will pick "${BASE_TOKENS[0].token}" nearly every time.`;
    if (temperature >= 1.5) return 'Flat. Every option is roughly equally likely. Output gets weird.';
    return null;
  }, [temperature, topK]);

  // Total SVG height driven by token count
  const totalBars = BASE_TOKENS.length;
  const svgH = totalBars * (BAR_HEIGHT + BAR_GAP) + 12;

  // Max base prob for scaling the bar width within the available area
  const barAvail = CHART_W - LABEL_W - PCT_W - 16;

  return (
    <Playground ariaLabel="Probability distribution explorer">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>

        {/* ── Slider row ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'var(--space-5)',
          // Collapse to single column on mobile via CSS custom property
        }}
          className="temp-demo-sliders"
        >
          {/* Temperature */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <label
                htmlFor={tempId}
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                }}
              >
                Temperature
              </label>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                color: 'var(--accent-primary)',
                minWidth: '2.5ch',
                textAlign: 'right',
              }}>
                {temperature.toFixed(1)}
              </span>
            </div>
            <input
              id={tempId}
              type="range"
              min={0.0}
              max={2.0}
              step={0.1}
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
              aria-valuemin={0}
              aria-valuemax={2}
              aria-valuenow={temperature}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--text-muted)',
            }}>
              <span>0.0</span><span>1.0</span><span>2.0</span>
            </div>
          </div>

          {/* Top-k */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <label
                htmlFor={topKId}
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                }}
              >
                Top-k
              </label>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                color: topK === 10 ? 'var(--text-muted)' : 'var(--accent-primary)',
                minWidth: '2.5ch',
                textAlign: 'right',
              }}>
                {topK === 10 ? 'off' : topK}
              </span>
            </div>
            <input
              id={topKId}
              type="range"
              min={1}
              max={10}
              step={1}
              value={topK}
              onChange={(e) => setTopK(parseInt(e.target.value, 10))}
              style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
              aria-valuemin={1}
              aria-valuemax={10}
              aria-valuenow={topK}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--text-muted)',
            }}>
              <span>1</span><span>5</span><span>10</span>
            </div>
          </div>

          {/* Top-p */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <label
                htmlFor={topPId}
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                }}
              >
                Top-p (nucleus)
              </label>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                color: topP >= 1.0 ? 'var(--text-muted)' : 'var(--accent-primary)',
                minWidth: '2.5ch',
                textAlign: 'right',
              }}>
                {topP >= 1.0 ? 'off' : topP.toFixed(2)}
              </span>
            </div>
            <input
              id={topPId}
              type="range"
              min={0.1}
              max={1.0}
              step={0.05}
              value={topP}
              onChange={(e) => setTopP(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
              aria-valuemin={0.1}
              aria-valuemax={1}
              aria-valuenow={topP}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--text-muted)',
            }}>
              <span>0.1</span><span>0.5</span><span>1.0</span>
            </div>
          </div>
        </div>

        {/* ── Prompt fragment ── */}
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-muted)',
          letterSpacing: '0.02em',
          padding: 'var(--space-3) var(--space-4)',
          background: 'var(--bg-elevated)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
        }}>
          The cat sat on the{' '}
          <span style={{ color: 'var(--accent-primary)', borderBottom: '1.5px dashed var(--accent-primary)' }}>
            ___
          </span>
        </div>

        {/* ── Bar chart ── */}
        <svg
          viewBox={`0 0 ${CHART_W} ${svgH}`}
          width="100%"
          aria-label="Probability distribution over next tokens — updates live with slider changes"
          style={{ display: 'block', overflow: 'visible' }}
        >
          {BASE_TOKENS.map(({ token }, idx) => {
            const prob = finalProbs[idx];
            const isZeroed = prob === 0;
            const barW = isZeroed ? 4 : Math.max(4, prob * barAvail);
            const y = idx * (BAR_HEIGHT + BAR_GAP) + 4;

            return (
              <g key={token} aria-label={`${token}: ${(prob * 100).toFixed(1)}%`}>
                <title>{`${token}: ${(prob * 100).toFixed(1)}%`}</title>

                {/* Token label */}
                <text
                  x={LABEL_W - 8}
                  y={y + BAR_HEIGHT / 2 + 4}
                  textAnchor="end"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    fill: isZeroed ? 'var(--text-muted)' : 'var(--text-secondary)',
                    textDecoration: isZeroed ? 'line-through' : 'none',
                    transition: 'fill 200ms ease',
                  }}
                >
                  {token}
                </text>

                {/* Bar background track */}
                <rect
                  x={LABEL_W}
                  y={y}
                  width={barAvail}
                  height={BAR_HEIGHT}
                  rx={3}
                  fill="var(--bg-elevated)"
                />

                {/* Bar fill */}
                <rect
                  x={LABEL_W}
                  y={y}
                  width={barW}
                  height={BAR_HEIGHT}
                  rx={3}
                  fill={isZeroed ? 'var(--border-subtle)' : 'var(--accent-primary)'}
                  fillOpacity={isZeroed ? 1 : 0.85}
                  style={{ transition: 'width 180ms ease, fill 200ms ease' }}
                />

                {/* Percentage label */}
                <text
                  x={LABEL_W + barAvail + 8}
                  y={y + BAR_HEIGHT / 2 + 4}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    fill: isZeroed ? 'var(--text-muted)' : 'var(--text-secondary)',
                    transition: 'fill 200ms ease',
                  }}
                >
                  {isZeroed ? '—' : `${(prob * 100).toFixed(0)}%`}
                </text>
              </g>
            );
          })}
        </svg>

        {/* ── Reactive caption ── */}
        {caption && (
          <div
            style={{
              fontFamily: 'var(--font-editorial)',
              fontStyle: 'italic',
              fontSize: 'var(--text-sm)',
              color: 'var(--accent-warm)',
              borderLeft: '2px solid var(--accent-warm)',
              paddingLeft: 'var(--space-4)',
              lineHeight: 1.6,
              transition: 'opacity 200ms ease',
            }}
          >
            {caption}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .temp-demo-sliders {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </Playground>
  );
}
