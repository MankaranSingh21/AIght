'use client';

import { useState } from 'react';
import { PanelLabel } from './ConceptDemo';

// ── Data ─────────────────────────────────────────────────────────────────────

const QUESTION = 'What was mentioned in chapter 3?';
const CHAPTER3_INFO = 'Chapter 3 discusses the importance of connection pooling, explaining how PgBouncer reduces overhead by maintaining a pool of persistent database connections rather than opening a new one per request.';
const NO_ACCESS_RESPONSE = "I don't have access to chapter 3 from the provided context. The content you're asking about falls outside the portion of the document I can see.";
const FULL_RESPONSE = CHAPTER3_INFO;

// Document segments: 12 stripes, each = ~8.3% of doc. Chapter 3 = stripes 3-4 (25-35%)
const DOC_SEGMENTS = 12;
const CHAPTER3_STRIPES = [2, 3]; // 0-indexed

// Map context size (tokens) to % of doc visible. Doc = ~20 000 tokens total.
const DOC_TOTAL_TOKENS = 20000;

function getVisibleFraction(contextK: number): number {
  return Math.min(1, (contextK * 1000) / DOC_TOTAL_TOKENS);
}

function contextLabel(k: number): string {
  if (k >= 1000) return `${k / 1000}M`;
  return `${k}K`;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ContextWindowsDemo() {
  const [contextK, setContextK] = useState<number>(4);

  const PRESETS: number[] = [4, 16, 64, 128, 200];
  const fraction = getVisibleFraction(contextK);
  const visibleStripes = Math.round(fraction * DOC_SEGMENTS);
  const coversChapter3 = visibleStripes > CHAPTER3_STRIPES[CHAPTER3_STRIPES.length - 1];
  const response = coversChapter3 ? FULL_RESPONSE : NO_ACCESS_RESPONSE;

  // 4K panel is always fixed at 4K
  const smallFraction = getVisibleFraction(4);
  const smallStripes = Math.round(smallFraction * DOC_SEGMENTS);
  const smallCoversChapter3 = false; // 4K never covers ch3

  return (
    <div>
      {/* Two panels */}
      <div className="cw-panels" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        {/* Left panel: 4K context — fixed */}
        <DocumentPanel
          label="4K Context"
          fraction={smallFraction}
          visibleStripes={smallStripes}
          totalStripes={DOC_SEGMENTS}
          chapter3Stripes={CHAPTER3_STRIPES}
          coversChapter3={smallCoversChapter3}
          contextLabel="4K"
          response={NO_ACCESS_RESPONSE}
          accent={false}
          question={QUESTION}
        />

        {/* Right panel: adjustable */}
        <DocumentPanel
          label={`${contextLabel(contextK)} Context`}
          fraction={fraction}
          visibleStripes={visibleStripes}
          totalStripes={DOC_SEGMENTS}
          chapter3Stripes={CHAPTER3_STRIPES}
          coversChapter3={coversChapter3}
          contextLabel={contextLabel(contextK)}
          response={response}
          accent={coversChapter3}
          question={QUESTION}
        />
      </div>

      {/* Slider control */}
      <div
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-4) var(--space-5)',
          marginBottom: 'var(--space-5)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
          <label htmlFor="ctx-slider" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Right panel context size
          </label>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--accent-primary)', fontWeight: 700 }}>
            {contextLabel(contextK)} tokens
          </span>
        </div>

        <input
          id="ctx-slider"
          type="range"
          min={2}
          max={200}
          step={1}
          value={contextK}
          onChange={e => setContextK(Number(e.target.value))}
          style={{
            width: '100%',
            accentColor: 'var(--accent-primary)',
            cursor: 'pointer',
          }}
          aria-label={`Context size: ${contextLabel(contextK)} tokens`}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-1)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>2K</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>200K</span>
        </div>

        {/* Preset buttons */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-3)', flexWrap: 'wrap' }}>
          {PRESETS.map(p => (
            <button
              key={p}
              onClick={() => setContextK(p)}
              aria-pressed={contextK === p}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                padding: '3px 10px',
                borderRadius: 'var(--radius-sm)',
                background: contextK === p ? 'var(--accent-primary-glow)' : 'var(--bg-base)',
                color: contextK === p ? 'var(--accent-primary)' : 'var(--text-muted)',
                border: `1px solid ${contextK === p ? 'var(--border-emphasis)' : 'var(--border-subtle)'}`,
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
            >
              {contextLabel(p)}
            </button>
          ))}
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
      }}>
        Same model. Same document. Different windows. Different answers.
      </p>

      <style>{`
        @media (max-width: 640px) {
          .cw-panels { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

// ── Sub-component ─────────────────────────────────────────────────────────────

interface DocumentPanelProps {
  label: string;
  fraction: number;
  visibleStripes: number;
  totalStripes: number;
  chapter3Stripes: number[];
  coversChapter3: boolean;
  contextLabel: string;
  response: string;
  accent: boolean;
  question: string;
}

function DocumentPanel({
  label,
  visibleStripes,
  totalStripes,
  chapter3Stripes,
  coversChapter3,
  response,
  accent,
  question,
}: DocumentPanelProps) {
  return (
    <div
      role="group"
      aria-label={`${label} panel`}
      style={{
        background: accent ? 'var(--accent-primary-glow)' : 'var(--bg-elevated)',
        border: `1px solid ${accent ? 'var(--border-emphasis)' : 'var(--border-subtle)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-5)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
        transition: 'background 200ms ease, border-color 200ms ease',
      }}
    >
      <PanelLabel accent={accent}>{label}</PanelLabel>

      {/* Document visualisation */}
      <div
        aria-label="Document stripe visualisation"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          background: 'var(--bg-base)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-3)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        {Array.from({ length: totalStripes }, (_, i) => {
          const inWindow = i < visibleStripes;
          const isChapter3 = chapter3Stripes.includes(i);
          return (
            <div
              key={i}
              aria-hidden="true"
              style={{
                height: 10,
                borderRadius: 2,
                background: isChapter3
                  ? (inWindow ? 'var(--accent-secondary)' : 'rgba(0,255,209,0.15)')
                  : (inWindow ? 'rgba(170,255,77,0.25)' : 'var(--bg-elevated)'),
                border: isChapter3 ? '1px solid rgba(0,255,209,0.4)' : '1px solid transparent',
                transition: 'background 200ms ease',
              }}
            />
          );
        })}
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', margin: '4px 0 0', letterSpacing: '0.04em' }}>
          <span style={{ display: 'inline-block', width: 10, height: 10, background: 'rgba(0,255,209,0.4)', borderRadius: 2, verticalAlign: 'middle', marginRight: 4 }} />
          ch. 3 &nbsp;
          <span style={{ display: 'inline-block', width: 10, height: 10, background: 'rgba(170,255,77,0.25)', borderRadius: 2, verticalAlign: 'middle', marginRight: 4, marginLeft: 8 }} />
          in window
        </p>
      </div>

      {/* Question */}
      <div style={{
        background: 'var(--bg-base)',
        borderRadius: 'var(--radius-sm)',
        padding: 'var(--space-3)',
        border: '1px solid var(--border-subtle)',
      }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', color: 'var(--text-muted)', textTransform: 'uppercase', margin: '0 0 4px' }}>Q</p>
        <p style={{ fontFamily: 'var(--font-editorial)', fontStyle: 'italic', fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
          {question}
        </p>
      </div>

      {/* Response */}
      <div
        aria-live="polite"
        style={{
          background: 'var(--bg-base)',
          borderRadius: 'var(--radius-sm)',
          padding: 'var(--space-3)',
          border: `1px solid ${coversChapter3 ? 'var(--border-emphasis)' : 'var(--border-subtle)'}`,
          transition: 'border-color 200ms ease',
        }}
      >
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', color: coversChapter3 ? 'var(--accent-primary)' : 'var(--error)', textTransform: 'uppercase', margin: '0 0 4px' }}>
          {coversChapter3 ? '✓ Answer' : '✗ Answer'}
        </p>
        <p style={{ fontFamily: 'var(--font-editorial)', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
          {response}
        </p>
      </div>
    </div>
  );
}
