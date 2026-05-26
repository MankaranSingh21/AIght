'use client';

import { useState } from 'react';
import StepThrough from './ConceptDemo/StepThrough';

// ---------------------------------------------------------------------------
// Precomputed noise grids — 8×8 cells, each a RGBA-ish string
// ---------------------------------------------------------------------------
// Step 0: full random noise
// Steps 1–7: progressively more structured toward a sun silhouette
// We encode each grid as 64 hex chars representing a simplified pattern

type Grid = readonly string[];

// Utility: generate a deterministic "random" palette for noise at each step
function noiseCell(seed: number, noiseLevel: number): string {
  // pseudo-random based on seed
  const r = ((seed * 1103515245 + 12345) >>> 0) % 256;
  const g = ((seed * 1664525 + 1013904223) >>> 0) % 256;
  const b = ((seed * 22695477 + 1) >>> 0) % 256;

  // Blend toward sun palette as noiseLevel decreases
  // Sun palette: golden core, bright rays, sky background
  const row = Math.floor(seed / 8);
  const col = seed % 8;

  // Sun center at row 3-4, col 3-4
  const distFromCenter = Math.sqrt(Math.pow(row - 3.5, 2) + Math.pow(col - 3.5, 2));
  const inCore = distFromCenter < 1.5;
  const inRay = distFromCenter < 3.2 && (
    row === 0 || row === 7 || col === 0 || col === 7 ||
    (row === col) || (row + col === 7)
  );

  // Target color: golden sun
  let tr = inCore ? 255 : inRay ? 244 : 12;
  let tg = inCore ? 210 : inRay ? 171 : 10;
  let tb = inCore ? 50 : inRay ? 31 : 8;

  const blend = 1 - noiseLevel;
  const fr = Math.round(r + (tr - r) * blend);
  const fg = Math.round(g + (tg - g) * blend);
  const fb = Math.round(b + (tb - b) * blend);
  return `rgb(${fr},${fg},${fb})`;
}

const STEPS = 8;
const GRID_SIZE = 8; // 8x8 grid

// Noise levels: 1.0 down to 0.0
const NOISE_LEVELS = [1.0, 0.86, 0.71, 0.57, 0.43, 0.29, 0.14, 0.0];

function renderGrid(stepIndex: number): Grid {
  const noiseLevel = NOISE_LEVELS[stepIndex];
  return Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) =>
    noiseCell(i, noiseLevel)
  );
}

// Precompute all 8 grids
const PRECOMPUTED_GRIDS: Grid[] = Array.from({ length: STEPS }, (_, s) =>
  renderGrid(s)
);

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function DiffusionDemo() {
  const [activeStep, setActiveStep] = useState(0);
  const grid = PRECOMPUTED_GRIDS[activeStep];
  const noiseLevel = NOISE_LEVELS[activeStep];
  const noisePct = Math.round(noiseLevel * 100);

  return (
    <StepThrough
      ariaLabel="Diffusion denoising steps"
      totalSteps={STEPS}
      activeStep={activeStep}
      onNext={() => setActiveStep((s) => Math.min(STEPS - 1, s + 1))}
      onBack={() => setActiveStep((s) => Math.max(0, s - 1))}
      onReset={() => setActiveStep(0)}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-5)',
        }}
      >
        {/* Step label */}
        <div style={{ textAlign: 'center', width: '100%' }}>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 18,
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-1)',
              letterSpacing: '-0.02em',
            }}
          >
            {activeStep === 0
              ? 'Pure noise'
              : activeStep === STEPS - 1
              ? 'Signal emerges'
              : `Denoising step ${activeStep}`}
          </p>
          <p
            style={{
              fontFamily: 'var(--font-editorial)',
              fontStyle: 'italic',
              fontSize: 13,
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
            }}
          >
            {activeStep === 0
              ? 'The model starts here — pure random static'
              : activeStep === STEPS - 1
              ? 'After 8 steps, a sun silhouette resolves from the noise'
              : 'Each step removes a little structured noise, guided by the target'}
          </p>
        </div>

        {/* SVG canvas — 8×8 grid */}
        <svg
          viewBox="0 0 200 200"
          width={200}
          height={200}
          aria-label={`Denoising step ${activeStep + 1} of ${STEPS}: ${noisePct}% noise`}
          style={{
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            display: 'block',
          }}
        >
          {grid.map((color, i) => {
            const row = Math.floor(i / GRID_SIZE);
            const col = i % GRID_SIZE;
            const cellSize = 200 / GRID_SIZE;
            return (
              <rect
                key={i}
                x={col * cellSize}
                y={row * cellSize}
                width={cellSize}
                height={cellSize}
                fill={color}
              />
            );
          })}
        </svg>

        {/* Noise level bar */}
        <div style={{ width: '100%', maxWidth: 260 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 'var(--space-2)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
              }}
            >
              Noise level
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 13,
                fontWeight: 700,
                color:
                  noisePct === 0 ? 'var(--accent-primary)' : 'var(--text-secondary)',
                transition: 'color 200ms ease',
              }}
            >
              {noisePct}%
            </span>
          </div>
          <div
            aria-hidden="true"
            style={{
              height: 6,
              background: 'var(--bg-elevated)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${noisePct}%`,
                background:
                  noisePct > 50
                    ? 'var(--text-muted)'
                    : noisePct > 0
                    ? 'var(--accent-warm)'
                    : 'var(--accent-primary)',
                borderRadius: 'var(--radius-full)',
                transition: 'width 300ms ease, background 300ms ease',
              }}
            />
          </div>
        </div>

        {/* Caption */}
        <p
          style={{
            fontFamily: 'var(--font-editorial)',
            fontStyle: 'italic',
            fontSize: 13,
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            textAlign: 'center',
            maxWidth: 340,
            padding: 'var(--space-3) var(--space-4)',
            borderLeft: '3px solid var(--border-subtle)',
            background: 'var(--glass-bg)',
            borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
          }}
        >
          Each step removes a tiny bit of noise. After 8 steps, structure emerges.
          A real model does this in 50–1000 steps.
        </p>
      </div>
    </StepThrough>
  );
}
