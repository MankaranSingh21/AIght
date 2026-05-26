'use client';

import { useState } from 'react';

// ── Precomputed data ───────────────────────────────────────────────────────────

interface ShotConfig {
  shots: number;
  label: string;
  examples: Array<{ input: string; output: string }>;
  newInput: string;
  output: string;
  accuracy: number;
  caption: string;
}

const SHOT_CONFIGS: ShotConfig[] = [
  {
    shots: 0,
    label: '0-shot',
    examples: [],
    newInput: 'hey can you send that file by tomorrow',
    output: 'Hey, can you send that file by tomorrow?',
    accuracy: 0.45,
    caption:
      '0-shot: instruction only. The model guesses the register. Results are inconsistent — it may formalize too much or not enough.',
  },
  {
    shots: 1,
    label: '1-shot',
    examples: [
      {
        input: 'got your email will reply soon',
        output: 'I have received your email and will respond shortly.',
      },
    ],
    newInput: 'hey can you send that file by tomorrow',
    output: 'I wanted to ask if you could send that file by tomorrow.',
    accuracy: 0.70,
    caption:
      '1-shot: one example establishes the pattern. The model grasps "formal" but is still finding its footing on sentence construction.',
  },
  {
    shots: 3,
    label: '3-shot',
    examples: [
      {
        input: 'got your email will reply soon',
        output: 'I have received your email and will respond shortly.',
      },
      {
        input: 'meeting moved to 3 let everyone know',
        output: 'Please be advised that the meeting has been rescheduled to 3:00 PM.',
      },
      {
        input: 'need those slides asap',
        output: 'I would appreciate receiving the slides at your earliest convenience.',
      },
    ],
    newInput: 'hey can you send that file by tomorrow',
    output: 'Could you please send the file at your earliest convenience, ideally by tomorrow?',
    accuracy: 0.92,
    caption:
      '3-shot: the pattern is clear. Formal register, complete sentence structure, appropriate hedging — matching the demonstrated style.',
  },
  {
    shots: 5,
    label: '5-shot',
    examples: [
      {
        input: 'got your email will reply soon',
        output: 'I have received your email and will respond shortly.',
      },
      {
        input: 'meeting moved to 3 let everyone know',
        output: 'Please be advised that the meeting has been rescheduled to 3:00 PM.',
      },
      {
        input: 'need those slides asap',
        output: 'I would appreciate receiving the slides at your earliest convenience.',
      },
      {
        input: 'can you check the report before friday',
        output: 'I would be grateful if you could review the report prior to Friday.',
      },
      {
        input: 'forgot the password again help',
        output: 'I appear to have misplaced my password; any assistance would be greatly appreciated.',
      },
    ],
    newInput: 'hey can you send that file by tomorrow',
    output:
      'I would be grateful if you could forward the file at your earliest convenience, ideally no later than tomorrow.',
    accuracy: 0.95,
    caption:
      '5-shot: output is consistently correct and closely mirrors the demonstrated style — "I would be grateful if…" is lifted directly from example 4.',
  },
];

const SHOT_VALUES = [0, 1, 3, 5];

// ── Component ─────────────────────────────────────────────────────────────────

export default function InContextLearningDemo() {
  const [shotIdx, setShotIdx] = useState(0);
  const config = SHOT_CONFIGS[shotIdx];
  const barWidth = `${Math.round(config.accuracy * 100)}%`;

  const accuracyColor =
    config.accuracy >= 0.9
      ? 'var(--accent-primary)'
      : config.accuracy >= 0.65
      ? 'var(--accent-warm)'
      : 'var(--error)';

  return (
    <div>
      {/* Shot count slider */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 'var(--space-2)',
          }}
        >
          <label
            htmlFor="shot-slider"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
            }}
          >
            Example count
          </label>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-sm)',
              fontWeight: 700,
              color: 'var(--accent-primary)',
            }}
          >
            {config.shots}-shot
          </span>
        </div>
        <input
          id="shot-slider"
          type="range"
          min={0}
          max={3}
          step={1}
          value={shotIdx}
          onChange={(e) => setShotIdx(Number(e.target.value))}
          aria-valuetext={`${config.shots} shots — ${config.label}`}
          style={{
            width: '100%',
            accentColor: 'var(--accent-primary)',
            cursor: 'pointer',
          }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 'var(--space-1)',
          }}
        >
          {SHOT_VALUES.map((v) => (
            <span
              key={v}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: 'var(--text-muted)',
              }}
            >
              {v}
            </span>
          ))}
        </div>
      </div>

      {/* Prompt window */}
      <div
        aria-label="Prompt window"
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-4)',
          marginBottom: 'var(--space-4)',
          fontFamily: 'var(--font-mono)',
          fontSize: '13px',
          lineHeight: 1.7,
        }}
      >
        <p
          style={{
            fontSize: '11px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            margin: '0 0 var(--space-3)',
          }}
        >
          Prompt window
        </p>
        {/* Task instruction */}
        <div
          style={{
            padding: 'var(--space-2) var(--space-3)',
            background: 'rgba(163,115,215,0.08)',
            border: '1px solid rgba(163,115,215,0.20)',
            borderRadius: 'var(--radius-sm)',
            marginBottom: 'var(--space-2)',
          }}
        >
          <span style={{ color: 'var(--color-lavender)' }}>
            Translate to formal professional English:
          </span>
        </div>

        {/* Examples */}
        {config.examples.map((ex, i) => (
          <div
            key={i}
            style={{
              padding: 'var(--space-2) var(--space-3)',
              background: 'rgba(0,255,209,0.05)',
              border: '1px solid rgba(0,255,209,0.15)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: 'var(--space-2)',
            }}
          >
            <span style={{ color: 'var(--text-muted)' }}>Input: </span>
            <span style={{ color: 'var(--accent-secondary)' }}>{ex.input}</span>
            <br />
            <span style={{ color: 'var(--text-muted)' }}>Output: </span>
            <span style={{ color: 'var(--text-secondary)' }}>{ex.output}</span>
          </div>
        ))}

        {/* New query */}
        <div
          style={{
            padding: 'var(--space-2) var(--space-3)',
            background: 'var(--accent-primary-glow)',
            border: '1px solid var(--border-emphasis)',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          <span style={{ color: 'var(--text-muted)' }}>Input: </span>
          <span style={{ color: 'var(--accent-primary)' }}>{config.newInput}</span>
          <br />
          <span style={{ color: 'var(--text-muted)' }}>Output: </span>
          <span style={{ color: 'var(--text-muted)' }}>▋</span>
        </div>
      </div>

      {/* Model output */}
      <div
        aria-live="polite"
        aria-label="Model output"
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-4)',
          marginBottom: 'var(--space-5)',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            margin: '0 0 var(--space-3)',
          }}
        >
          Model output
        </p>
        <p
          style={{
            fontFamily: 'var(--font-editorial)',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-primary)',
            lineHeight: 1.8,
            margin: 0,
          }}
        >
          {config.output}
        </p>
      </div>

      {/* Accuracy bar */}
      <div style={{ marginBottom: 'var(--space-5)' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 'var(--space-2)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
            }}
          >
            Typical accuracy
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-sm)',
              fontWeight: 700,
              color: accuracyColor,
            }}
          >
            {Math.round(config.accuracy * 100)}%
          </span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={Math.round(config.accuracy * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Accuracy"
          style={{
            height: 8,
            background: 'var(--bg-overlay)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: barWidth,
              background: accuracyColor,
              borderRadius: 'var(--radius-full)',
              transition: 'width 350ms cubic-bezier(0.16, 1, 0.3, 1), background 350ms ease',
            }}
          />
        </div>
      </div>

      {/* Caption */}
      <p
        style={{
          fontFamily: 'var(--font-editorial)',
          fontStyle: 'italic',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)',
          lineHeight: 1.75,
          margin: 0,
          paddingLeft: 'var(--space-4)',
          borderLeft: '3px solid var(--border-emphasis)',
        }}
      >
        {config.caption}
      </p>
    </div>
  );
}
