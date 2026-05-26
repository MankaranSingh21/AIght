'use client';

import { useState } from 'react';

// ── Precomputed data ──────────────────────────────────────────────────────────

interface QuantLevel {
  id: string;
  label: string;
  bits: number;
  memory: number;     // GB for a 70B model
  memoryMax: number;  // scale denominator for bar
  accuracy: number;   // % of FP16 accuracy
  speed: number;      // relative to FP16 (1×)
  caption: string;
}

const QUANT_LEVELS: QuantLevel[] = [
  {
    id: 'fp16',
    label: 'FP16',
    bits: 16,
    memory: 14,
    memoryMax: 14,
    accuracy: 100,
    speed: 1,
    caption: 'Full precision. Every weight stored as a 16-bit float. Gold standard for quality; gold standard for cost.',
  },
  {
    id: 'int8',
    label: 'INT8',
    bits: 8,
    memory: 7,
    memoryMax: 14,
    accuracy: 99,
    speed: 1.8,
    caption: 'Half the memory. 99% as capable. The go-to for production deployments where you control the hardware.',
  },
  {
    id: 'int4',
    label: 'INT4',
    bits: 4,
    memory: 3.5,
    memoryMax: 14,
    accuracy: 96,
    speed: 3.5,
    caption: 'At INT4: 4× less memory, 96% as smart. Most apps will never notice.',
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────

interface BarRowProps {
  label: string;
  value: number;
  max: number;
  displayValue: string;
  accentFill?: boolean;
}

function BarRow({ label, value, max, displayValue, accentFill = false }: BarRowProps) {
  const pct = Math.round((value / max) * 100);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
        }}>
          {label}
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '13px',
          color: accentFill ? 'var(--accent-primary)' : 'var(--text-secondary)',
          fontWeight: 600,
        }}>
          {displayValue}
        </span>
      </div>
      <div style={{
        height: 8,
        background: 'var(--bg-overlay)',
        borderRadius: 'var(--radius-full)',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: accentFill ? 'var(--accent-primary)' : 'var(--text-secondary)',
          borderRadius: 'var(--radius-full)',
          transition: 'width 350ms cubic-bezier(0.16,1,0.3,1)',
          opacity: accentFill ? 0.9 : 0.5,
        }} />
      </div>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function QuantizationDemo() {
  const [activeId, setActiveId] = useState<string>('fp16');

  const active = QUANT_LEVELS.find((q) => q.id === activeId)!;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Tab selector */}
      <div
        role="tablist"
        aria-label="Quantization precision level"
        style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}
      >
        {QUANT_LEVELS.map((q) => {
          const isActive = q.id === activeId;
          return (
            <button
              key={q.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveId(q.id)}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                letterSpacing: '0.06em',
                padding: 'var(--space-2) var(--space-4)',
                borderRadius: 'var(--radius-sm)',
                border: isActive ? '1px solid var(--border-emphasis)' : '1px solid var(--border-subtle)',
                background: isActive ? 'var(--accent-primary-glow)' : 'var(--bg-elevated)',
                color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
            >
              {q.label}
            </button>
          );
        })}
      </div>

      {/* Two-panel comparison — always shows FP16 baseline vs selected */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 'var(--space-4)',
        }}
        className="quant-panels"
      >
        {/* FP16 baseline */}
        <div style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-5)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
        }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--text-muted)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            margin: 0,
          }}>
            FP16 — Baseline
          </p>
          <BarRow label="Memory" value={14} max={14} displayValue="14 GB" />
          <BarRow label="Accuracy" value={100} max={100} displayValue="100%" />
          <BarRow label="Speed" value={1} max={3.5} displayValue="1×" />
        </div>

        {/* Active quantization level */}
        <div style={{
          background: 'var(--accent-primary-glow)',
          border: '1px solid var(--border-emphasis)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-5)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
          transition: 'all 200ms ease',
        }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--accent-primary)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            margin: 0,
          }}>
            {active.label} — Selected
          </p>
          <BarRow label="Memory" value={active.memory} max={14} displayValue={`${active.memory} GB`} accentFill />
          <BarRow label="Accuracy" value={active.accuracy} max={100} displayValue={`${active.accuracy}%`} accentFill />
          <BarRow label="Speed" value={active.speed} max={3.5} displayValue={`${active.speed}×`} accentFill />
        </div>
      </div>

      {/* Caption */}
      <p style={{
        fontFamily: 'var(--font-editorial)',
        fontStyle: 'italic',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-secondary)',
        lineHeight: 1.7,
        padding: 'var(--space-4) var(--space-5)',
        borderLeft: '3px solid var(--border-emphasis)',
        background: 'var(--accent-primary-glow)',
        borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
        margin: 0,
        transition: 'opacity 200ms ease',
      }}>
        {active.caption}
      </p>

      <style>{`
        @media (max-width: 640px) {
          .quant-panels { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
