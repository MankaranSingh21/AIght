'use client';

import { useMemo, useState } from 'react';

// 1-D loss surface with two valleys — steep enough to overshoot at high
// learning rates, so the demo can show divergence, not just convergence.
function loss(x: number): number {
  return 0.04 * x * x + Math.sin(x * 0.9) * 1.4 + 2.2;
}

function gradient(x: number): number {
  return 0.08 * x + Math.cos(x * 0.9) * 1.26;
}

const X_MIN = -10;
const X_MAX = 10;
const W = 560;
const H = 240;
const PAD = 24;

function toSvgX(x: number) {
  return PAD + ((x - X_MIN) / (X_MAX - X_MIN)) * (W - PAD * 2);
}
function toSvgY(y: number) {
  // loss ranges roughly 0.3..6.5 across the window
  return H - PAD - ((y - 0.2) / 6.5) * (H - PAD * 2);
}

const START_X = 8.2;

export default function GradientDescentDemo() {
  const [pos, setPos] = useState(START_X);
  const [lr, setLr] = useState(0.5);
  const [steps, setSteps] = useState(0);
  const [trail, setTrail] = useState<number[]>([START_X]);

  const curve = useMemo(() => {
    const pts: string[] = [];
    for (let x = X_MIN; x <= X_MAX; x += 0.2) {
      pts.push(`${toSvgX(x).toFixed(1)},${toSvgY(loss(x)).toFixed(1)}`);
    }
    return pts.join(' ');
  }, []);

  const step = () => {
    setPos((p) => {
      const next = Math.max(X_MIN, Math.min(X_MAX, p - lr * gradient(p)));
      setTrail((t) => [...t.slice(-14), next]);
      return next;
    });
    setSteps((s) => s + 1);
  };

  const reset = () => {
    setPos(START_X);
    setSteps(0);
    setTrail([START_X]);
  };

  const mono: React.CSSProperties = {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    color: 'var(--text-muted)',
    letterSpacing: '0.05em',
  };

  return (
    <div role="group" aria-label="Gradient descent simulation">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        aria-hidden="true"
      >
        <polyline
          points={curve}
          fill="none"
          stroke="var(--border-default)"
          strokeWidth={2}
        />
        {trail.map((x, i) => (
          <circle
            key={i}
            cx={toSvgX(x)}
            cy={toSvgY(loss(x))}
            r={i === trail.length - 1 ? 7 : 3}
            fill={i === trail.length - 1 ? 'var(--accent-primary)' : 'var(--accent-primary-dim)'}
            opacity={i === trail.length - 1 ? 1 : 0.25 + (i / trail.length) * 0.5}
          />
        ))}
      </svg>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-5)', alignItems: 'center', marginTop: 'var(--space-4)' }}>
        <button onClick={step} className="btn-primary">
          Take a step ↓
        </button>
        <button
          onClick={reset}
          style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            ...mono,
          }}
        >
          reset ↺
        </button>
        <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', ...mono }}>
          learning rate {lr.toFixed(1)}
          <input
            type="range"
            min={0.1}
            max={2.4}
            step={0.1}
            value={lr}
            onChange={(e) => setLr(Number(e.target.value))}
            style={{ accentColor: 'var(--accent-primary)' }}
          />
        </label>
        <span aria-live="polite" style={mono}>
          step {steps} · loss {loss(pos).toFixed(2)}
        </span>
      </div>

      <p style={{ ...mono, color: 'var(--text-secondary)', marginTop: 'var(--space-4)', marginBottom: 0, letterSpacing: 0, fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
        The ball only ever feels the slope under its feet. Small learning rate:
        slow but steady. Crank it past ~2 and watch it overshoot the valley
        entirely.
      </p>
    </div>
  );
}
