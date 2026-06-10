'use client';

import { useMemo, useState } from 'react';

// A fixed, tiny network: 2 inputs → 3 hidden (ReLU) → 1 output (sigmoid).
// Weights are hand-picked so the output responds legibly to the sliders —
// the point is watching activations flow, not training.
const W1: number[][] = [
  [1.6, -1.1],
  [-0.9, 1.4],
  [0.8, 0.9],
];
const B1 = [-0.2, -0.1, -0.6];
const W2 = [1.3, 1.1, -1.5];
const B2 = -0.3;

const relu = (x: number) => Math.max(0, x);
const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));

const X = { in: 60, hid: 280, out: 500 };
const Y = { in: [80, 180], hid: [50, 130, 210], out: [130] };
const H = 260;
const W = 560;

export default function NeuralNetworkDemo() {
  const [a, setA] = useState(0.7);
  const [b, setB] = useState(0.3);

  const { hidden, output } = useMemo(() => {
    const hidden = W1.map((row, i) => relu(row[0] * a + row[1] * b + B1[i]));
    const output = sigmoid(hidden.reduce((s, h, i) => s + h * W2[i], B2));
    return { hidden, output };
  }, [a, b]);

  const inputs = [a, b];
  const maxHidden = Math.max(...hidden, 0.001);

  const mono: React.CSSProperties = {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    color: 'var(--text-muted)',
    letterSpacing: '0.05em',
  };

  const nodeFill = (v: number) => {
    const t = Math.max(0, Math.min(1, v));
    return `rgba(170,255,77,${(0.12 + t * 0.78).toFixed(2)})`;
  };

  return (
    <div role="group" aria-label="Toy neural network forward pass">
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }} aria-hidden="true">
        {/* edges in → hidden */}
        {Y.in.map((yi, i) =>
          Y.hid.map((yh, h) => (
            <line
              key={`ih${i}${h}`}
              x1={X.in} y1={yi} x2={X.hid} y2={yh}
              stroke={W1[h][i] >= 0 ? 'var(--accent-primary)' : 'var(--accent-warm)'}
              strokeWidth={Math.abs(W1[h][i]) * 1.6}
              opacity={0.2 + Math.min(0.5, inputs[i] * 0.5)}
            />
          ))
        )}
        {/* edges hidden → out */}
        {Y.hid.map((yh, h) => (
          <line
            key={`ho${h}`}
            x1={X.hid} y1={yh} x2={X.out} y2={Y.out[0]}
            stroke={W2[h] >= 0 ? 'var(--accent-primary)' : 'var(--accent-warm)'}
            strokeWidth={Math.abs(W2[h]) * 1.6}
            opacity={0.2 + Math.min(0.6, (hidden[h] / maxHidden) * 0.6)}
          />
        ))}
        {/* input nodes */}
        {Y.in.map((y, i) => (
          <g key={`in${i}`}>
            <circle cx={X.in} cy={y} r={18} fill={nodeFill(inputs[i])} stroke="var(--border-default)" />
            <text x={X.in} y={y + 4} textAnchor="middle" fontSize={11} fontFamily="var(--font-mono)" fill="var(--text-inverse)">
              {inputs[i].toFixed(1)}
            </text>
          </g>
        ))}
        {/* hidden nodes */}
        {Y.hid.map((y, h) => (
          <g key={`h${h}`}>
            <circle cx={X.hid} cy={y} r={18} fill={nodeFill(hidden[h] / 2)} stroke="var(--border-default)" />
            <text x={X.hid} y={y + 4} textAnchor="middle" fontSize={11} fontFamily="var(--font-mono)" fill="var(--text-primary)">
              {hidden[h].toFixed(1)}
            </text>
          </g>
        ))}
        {/* output node */}
        <circle cx={X.out} cy={Y.out[0]} r={24} fill={nodeFill(output)} stroke="var(--border-emphasis)" />
        <text x={X.out} y={Y.out[0] + 4} textAnchor="middle" fontSize={12} fontFamily="var(--font-mono)" fill="var(--text-inverse)" fontWeight={600}>
          {output.toFixed(2)}
        </text>
        {/* labels */}
        <text x={X.in} y={235} textAnchor="middle" fontSize={10} fontFamily="var(--font-mono)" fill="var(--text-muted)" letterSpacing={1}>INPUTS</text>
        <text x={X.hid} y={250} textAnchor="middle" fontSize={10} fontFamily="var(--font-mono)" fill="var(--text-muted)" letterSpacing={1}>HIDDEN (RELU)</text>
        <text x={X.out} y={185} textAnchor="middle" fontSize={10} fontFamily="var(--font-mono)" fill="var(--text-muted)" letterSpacing={1}>OUTPUT</text>
      </svg>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-6)', marginTop: 'var(--space-4)' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', ...mono }}>
          input a {a.toFixed(1)}
          <input type="range" min={0} max={1} step={0.1} value={a}
            onChange={(e) => setA(Number(e.target.value))}
            style={{ accentColor: 'var(--accent-primary)' }} />
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', ...mono }}>
          input b {b.toFixed(1)}
          <input type="range" min={0} max={1} step={0.1} value={b}
            onChange={(e) => setB(Number(e.target.value))}
            style={{ accentColor: 'var(--accent-primary)' }} />
        </label>
      </div>

      <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', lineHeight: 1.6, color: 'var(--text-secondary)', marginTop: 'var(--space-4)', marginBottom: 0 }}>
        Lime edges push the answer up, amber edges pull it down; thickness is
        the weight&apos;s size. Every modern model is this picture, repeated
        billions of times.
      </p>
    </div>
  );
}
