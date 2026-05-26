'use client';

import { useState, useMemo, useId } from 'react';
import { Playground } from './ConceptDemo';

// ── Chinchilla-style loss approximation ───────────────────────────────────────
// loss ≈ A * (params^-alpha + tokens^-beta + compute^-gamma) + irreducible
// Precomputed constants tuned for plausible nats-per-token range ~1.5–4.5

const A = 4.2;
const ALPHA = 0.34;
const BETA  = 0.28;
const GAMMA = 0.20;
const IRREDUCIBLE = 1.50;

function computeLoss(params: number, tokens: number, compute: number): number {
  const p = A * Math.pow(params, -ALPHA);
  const t = A * Math.pow(tokens, -BETA);
  const c = A * Math.pow(compute, -GAMMA);
  return Math.max(IRREDUCIBLE, p + t + c + IRREDUCIBLE);
}

// ── Slider config ─────────────────────────────────────────────────────────────

interface SliderConfig {
  id: 'compute' | 'data' | 'params';
  label: string;
  unit: string;
  min: number;   // log10 min
  max: number;   // log10 max
  default: number; // log10 default
  ticks: { value: number; label: string }[];
}

const SLIDERS: SliderConfig[] = [
  {
    id: 'compute',
    label: 'Compute',
    unit: 'PFLOPS-days',
    min: 0,
    max: 5,
    default: 2.5,
    ticks: [
      { value: 0, label: '1' },
      { value: 2, label: '100' },
      { value: 4, label: '10K' },
    ],
  },
  {
    id: 'data',
    label: 'Data',
    unit: 'B tokens',
    min: 1,
    max: 5,
    default: 3,
    ticks: [
      { value: 1, label: '10B' },
      { value: 3, label: '1T' },
      { value: 5, label: '100T' },
    ],
  },
  {
    id: 'params',
    label: 'Parameters',
    unit: 'B params',
    min: 0,
    max: 4,
    default: 2,
    ticks: [
      { value: 0, label: '1B' },
      { value: 2, label: '100B' },
      { value: 4, label: '10T' },
    ],
  },
];

// ── Chart helpers ─────────────────────────────────────────────────────────────

const SVG_W = 480;
const SVG_H = 130;
const PAD = { top: 8, right: 16, bottom: 28, left: 40 };

function buildPath(
  activeId: SliderConfig['id'],
  fixedCompute: number,
  fixedData: number,
  fixedParams: number,
): string {
  const cfg = SLIDERS.find(s => s.id === activeId)!;
  const steps = 60;
  const points: string[] = [];

  for (let i = 0; i <= steps; i++) {
    const logVal = cfg.min + (i / steps) * (cfg.max - cfg.min);
    const val = Math.pow(10, logVal);

    const c = activeId === 'compute' ? val : Math.pow(10, fixedCompute);
    const d = activeId === 'data'    ? val : Math.pow(10, fixedData);
    const p = activeId === 'params'  ? val : Math.pow(10, fixedParams);

    const loss = computeLoss(p, d, c);

    // Map x: logVal → [PAD.left, SVG_W - PAD.right]
    const x = PAD.left + ((logVal - cfg.min) / (cfg.max - cfg.min)) * (SVG_W - PAD.left - PAD.right);
    // Map y: loss [IRREDUCIBLE, ~8] → [PAD.top, SVG_H - PAD.bottom]
    const lossMin = IRREDUCIBLE;
    const lossMax = 8;
    const y = PAD.top + ((lossMax - loss) / (lossMax - lossMin)) * (SVG_H - PAD.top - PAD.bottom);
    const yc = Math.max(PAD.top, Math.min(SVG_H - PAD.bottom, y));

    points.push(i === 0 ? `M ${x.toFixed(1)} ${yc.toFixed(1)}` : `L ${x.toFixed(1)} ${yc.toFixed(1)}`);
  }
  return points.join(' ');
}

// ── Subcomponent: single slider ────────────────────────────────────────────────

function ScalingSlider({
  config,
  logValue,
  onChange,
  active,
}: {
  config: SliderConfig;
  logValue: number;
  onChange: (v: number) => void;
  active: boolean;
}) {
  const inputId = useId();
  const displayed = Math.pow(10, logValue);
  const displayStr =
    displayed >= 1e12 ? `${(displayed / 1e12).toFixed(0)}T`
    : displayed >= 1e9  ? `${(displayed / 1e9).toFixed(0)}B`
    : displayed >= 1e6  ? `${(displayed / 1e6).toFixed(0)}M`
    : displayed >= 1e3  ? `${(displayed / 1e3).toFixed(0)}K`
    : displayed.toFixed(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <label
          htmlFor={inputId}
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 'var(--text-sm)',
            fontWeight: active ? 600 : 400,
            color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
            cursor: 'pointer',
          }}
        >
          {config.label}
        </label>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            color: active ? 'var(--accent-primary)' : 'var(--text-muted)',
          }}
        >
          {displayStr} {config.unit}
        </span>
      </div>
      <input
        id={inputId}
        type="range"
        min={config.min}
        max={config.max}
        step={0.05}
        value={logValue}
        onChange={e => onChange(parseFloat(e.target.value))}
        style={{
          width: '100%',
          accentColor: active ? 'var(--accent-primary)' : 'var(--text-muted)',
          cursor: 'pointer',
        }}
        aria-valuemin={config.min}
        aria-valuemax={config.max}
        aria-valuenow={logValue}
        aria-label={`${config.label} — ${displayStr} ${config.unit}`}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          color: 'var(--text-muted)',
        }}
      >
        {config.ticks.map(t => (
          <span key={t.value}>{t.label}</span>
        ))}
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function ScalingLawsDemo() {
  const [logCompute, setLogCompute] = useState(SLIDERS[0].default);
  const [logData,    setLogData]    = useState(SLIDERS[1].default);
  const [logParams,  setLogParams]  = useState(SLIDERS[2].default);
  const [activeId,   setActiveId]   = useState<SliderConfig['id']>('compute');

  const loss = useMemo(
    () => computeLoss(Math.pow(10, logParams), Math.pow(10, logData), Math.pow(10, logCompute)),
    [logCompute, logData, logParams],
  );

  const pathD = useMemo(
    () => buildPath(activeId, logCompute, logData, logParams),
    [activeId, logCompute, logData, logParams],
  );

  const activeCfg = SLIDERS.find(s => s.id === activeId)!;
  const activeLogVal = activeId === 'compute' ? logCompute : activeId === 'data' ? logData : logParams;
  const xDot =
    PAD.left +
    ((activeLogVal - activeCfg.min) / (activeCfg.max - activeCfg.min)) *
      (SVG_W - PAD.left - PAD.right);
  const lossMin = IRREDUCIBLE;
  const lossMax = 8;
  const yDot = PAD.top + ((lossMax - loss) / (lossMax - lossMin)) * (SVG_H - PAD.top - PAD.bottom);
  const yDotC = Math.max(PAD.top, Math.min(SVG_H - PAD.bottom, yDot));

  function handleChange(id: SliderConfig['id'], val: number) {
    setActiveId(id);
    if (id === 'compute') setLogCompute(val);
    else if (id === 'data') setLogData(val);
    else setLogParams(val);
  }

  return (
    <Playground
      ariaLabel="Scaling laws playground"
      caption="More of any one input lowers loss — but the curve flattens. Chinchilla's insight: scale all three together."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>

        {/* Loss readout */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-4)',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-4) var(--space-5)',
          }}
        >
          <div>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                margin: 0,
              }}
            >
              Predicted loss
            </p>
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-3xl)',
                fontWeight: 700,
                color: 'var(--accent-primary)',
                letterSpacing: '-0.03em',
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              {loss.toFixed(3)}
            </p>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: 'var(--text-muted)',
                margin: 0,
              }}
            >
              nats per token
            </p>
          </div>
          <div
            style={{
              marginLeft: 'auto',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--text-muted)',
              textAlign: 'right',
              lineHeight: 1.7,
            }}
          >
            <div>floor ≈ {IRREDUCIBLE.toFixed(2)}</div>
            <div style={{ color: 'var(--text-secondary)' }}>Chinchilla-style power law</div>
          </div>
        </div>

        {/* Sliders */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'var(--space-5)',
          }}
          className="scaling-sliders"
        >
          {SLIDERS.map(cfg => (
            <ScalingSlider
              key={cfg.id}
              config={cfg}
              logValue={cfg.id === 'compute' ? logCompute : cfg.id === 'data' ? logData : logParams}
              onChange={val => handleChange(cfg.id, val)}
              active={activeId === cfg.id}
            />
          ))}
        </div>

        {/* Line chart */}
        <div>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              margin: '0 0 var(--space-2)',
            }}
          >
            Loss vs {activeCfg.label} (others fixed)
          </p>
          <svg
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            width="100%"
            style={{ display: 'block', overflow: 'visible' }}
            aria-label={`Line chart of loss vs ${activeCfg.label}`}
          >
            {/* Y axis label */}
            <text
              x={PAD.left - 6}
              y={PAD.top + (SVG_H - PAD.top - PAD.bottom) / 2}
              textAnchor="middle"
              transform={`rotate(-90, ${PAD.left - 24}, ${PAD.top + (SVG_H - PAD.top - PAD.bottom) / 2})`}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fill: 'var(--text-muted)' }}
            >
              loss
            </text>

            {/* Horizontal gridlines */}
            {[2, 4, 6].map(lv => {
              const gy = PAD.top + ((lossMax - lv) / (lossMax - lossMin)) * (SVG_H - PAD.top - PAD.bottom);
              return (
                <g key={lv}>
                  <line
                    x1={PAD.left}
                    x2={SVG_W - PAD.right}
                    y1={gy}
                    y2={gy}
                    stroke="var(--border-subtle)"
                    strokeDasharray="3 4"
                  />
                  <text
                    x={PAD.left - 4}
                    y={gy + 3}
                    textAnchor="end"
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fill: 'var(--text-muted)' }}
                  >
                    {lv}
                  </text>
                </g>
              );
            })}

            {/* X axis ticks */}
            {activeCfg.ticks.map(t => {
              const gx = PAD.left + ((t.value - activeCfg.min) / (activeCfg.max - activeCfg.min)) * (SVG_W - PAD.left - PAD.right);
              return (
                <text
                  key={t.value}
                  x={gx}
                  y={SVG_H - PAD.bottom + 14}
                  textAnchor="middle"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fill: 'var(--text-muted)' }}
                >
                  {t.label}
                </text>
              );
            })}

            {/* Curve */}
            <path
              d={pathD}
              fill="none"
              stroke="var(--accent-primary)"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.85}
            />

            {/* Current point dot */}
            <circle
              cx={xDot}
              cy={yDotC}
              r={5}
              fill="var(--accent-primary)"
              stroke="var(--bg-base)"
              strokeWidth={2}
            />
          </svg>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .scaling-sliders {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </Playground>
  );
}
