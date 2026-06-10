'use client';

import { useMemo, useState } from 'react';

// Fixed "world": a gentle sine trend plus noise, pre-baked so the demo is
// deterministic. The model fits a polynomial of chosen degree to the
// training points (least squares) and we watch what happens to the curve.
const TRAIN: Array<[number, number]> = [
  [0.05, 0.32], [0.12, 0.51], [0.21, 0.74], [0.3, 0.66], [0.38, 0.81],
  [0.47, 0.62], [0.55, 0.49], [0.63, 0.55], [0.72, 0.28], [0.8, 0.34],
  [0.88, 0.18], [0.95, 0.27],
];
const TEST: Array<[number, number]> = [
  [0.08, 0.4], [0.27, 0.7], [0.42, 0.73], [0.58, 0.5], [0.76, 0.27], [0.92, 0.2],
];

const W = 560;
const H = 260;
const PAD = 28;

function sx(x: number) { return PAD + x * (W - PAD * 2); }
function sy(y: number) { return H - PAD - y * (H - PAD * 2); }

/** Least-squares polynomial fit via normal equations + Gaussian elimination. */
function polyfit(points: Array<[number, number]>, degree: number): number[] {
  const n = degree + 1;
  const A: number[][] = Array.from({ length: n }, () => new Array(n + 1).fill(0));
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      A[r][c] = points.reduce((s, [x]) => s + Math.pow(x, r + c), 0);
    }
    A[r][n] = points.reduce((s, [x, y]) => s + y * Math.pow(x, r), 0);
  }
  for (let col = 0; col < n; col++) {
    let pivot = col;
    for (let r = col + 1; r < n; r++) if (Math.abs(A[r][col]) > Math.abs(A[pivot][col])) pivot = r;
    [A[col], A[pivot]] = [A[pivot], A[col]];
    if (Math.abs(A[col][col]) < 1e-12) continue;
    for (let r = col + 1; r < n; r++) {
      const f = A[r][col] / A[col][col];
      for (let c = col; c <= n; c++) A[r][c] -= f * A[col][c];
    }
  }
  const coef = new Array(n).fill(0);
  for (let r = n - 1; r >= 0; r--) {
    let sum = A[r][n];
    for (let c = r + 1; c < n; c++) sum -= A[r][c] * coef[c];
    coef[r] = Math.abs(A[r][r]) < 1e-12 ? 0 : sum / A[r][r];
  }
  return coef;
}

function evalPoly(coef: number[], x: number): number {
  return coef.reduce((s, c, i) => s + c * Math.pow(x, i), 0);
}

function mse(coef: number[], points: Array<[number, number]>): number {
  return points.reduce((s, [x, y]) => s + (evalPoly(coef, x) - y) ** 2, 0) / points.length;
}

export default function OverfittingDemo() {
  const [degree, setDegree] = useState(1);

  const { path, trainErr, testErr } = useMemo(() => {
    const coef = polyfit(TRAIN, degree);
    const pts: string[] = [];
    for (let x = 0; x <= 1.001; x += 0.01) {
      const y = Math.max(-0.25, Math.min(1.25, evalPoly(coef, x)));
      pts.push(`${sx(x).toFixed(1)},${sy(y).toFixed(1)}`);
    }
    return {
      path: pts.join(' '),
      trainErr: mse(coef, TRAIN),
      testErr: mse(coef, TEST),
    };
  }, [degree]);

  const mono: React.CSSProperties = {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    letterSpacing: '0.05em',
  };

  const verdict =
    degree <= 1 ? 'Underfitting — too simple to see the trend.'
    : degree <= 5 ? 'About right — follows the trend, ignores the noise.'
    : 'Overfitting — memorizing noise. Train error falls, test error climbs.';

  return (
    <div role="group" aria-label="Overfitting and underfitting simulation">
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }} aria-hidden="true">
        <polyline points={path} fill="none" stroke="var(--accent-primary)" strokeWidth={2} />
        {TRAIN.map(([x, y], i) => (
          <circle key={`tr${i}`} cx={sx(x)} cy={sy(y)} r={4} fill="var(--text-primary)" opacity={0.85} />
        ))}
        {TEST.map(([x, y], i) => (
          <circle key={`te${i}`} cx={sx(x)} cy={sy(y)} r={4} fill="none" stroke="var(--accent-secondary)" strokeWidth={2} />
        ))}
      </svg>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-5)', alignItems: 'center', marginTop: 'var(--space-4)' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', color: 'var(--text-muted)', ...mono }}>
          model complexity (degree {degree})
          <input
            type="range"
            min={1}
            max={11}
            step={1}
            value={degree}
            onChange={(e) => setDegree(Number(e.target.value))}
            style={{ accentColor: 'var(--accent-primary)' }}
          />
        </label>
        <span aria-live="polite" style={{ ...mono, color: 'var(--text-secondary)' }}>
          train error {trainErr.toFixed(3)} · <span style={{ color: 'var(--accent-secondary)' }}>test error {testErr.toFixed(3)}</span>
        </span>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-5)', marginTop: 'var(--space-3)', ...mono, color: 'var(--text-muted)' }}>
        <span>● training points</span>
        <span style={{ color: 'var(--accent-secondary)' }}>○ unseen test points</span>
      </div>

      <p
        aria-live="polite"
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 'var(--text-sm)',
          lineHeight: 1.6,
          color: 'var(--text-secondary)',
          marginTop: 'var(--space-4)',
          marginBottom: 0,
        }}
      >
        {verdict}
      </p>
    </div>
  );
}
