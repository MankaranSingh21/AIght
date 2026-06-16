'use client';

import type { LessonChoice } from '@/lib/lessons';

interface CheckQuestionProps {
  prompt: string;
  choices: LessonChoice[];
  selected: number | null;
  onSelect: (index: number) => void;
  /** Suppress the "◈ Check yourself" eyebrow — used when a parent groups
   *  several questions under one shared header (e.g. ConceptCheck). */
  hideEyebrow?: boolean;
}

export default function CheckQuestion({ prompt, choices, selected, onSelect, hideEyebrow }: CheckQuestionProps) {
  const picked = selected !== null ? choices[selected] : null;
  const solved = picked?.correct === true;

  return (
    <div role="group" aria-label="Check question">
      {!hideEyebrow && (
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--accent-primary)',
            margin: '0 0 var(--space-4)',
          }}
        >
          ◈ Check yourself
        </p>
      )}
      <p
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 'var(--text-xl)',
          fontWeight: 500,
          lineHeight: 1.4,
          color: 'var(--text-primary)',
          margin: '0 0 var(--space-6)',
        }}
      >
        {prompt}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {choices.map((choice, i) => {
          const isPicked = selected === i;
          const showState = isPicked;
          const borderColor = showState
            ? choice.correct
              ? 'var(--border-emphasis)'
              : 'rgba(244,171,31,0.45)'
            : 'var(--border-default)';

          return (
            <button
              key={choice.text}
              onClick={() => onSelect(i)}
              disabled={solved}
              aria-pressed={isPicked}
              style={{
                textAlign: 'left',
                background: showState
                  ? choice.correct
                    ? 'var(--accent-primary-glow)'
                    : 'rgba(244,171,31,0.08)'
                  : 'var(--bg-elevated)',
                border: `1px solid ${borderColor}`,
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-4) var(--space-5)',
                cursor: solved ? 'default' : 'pointer',
                transition: 'border-color 150ms ease, background 150ms ease',
                display: 'flex',
                gap: 'var(--space-3)',
                alignItems: 'baseline',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  color: showState
                    ? choice.correct
                      ? 'var(--accent-primary)'
                      : 'var(--accent-warm)'
                    : 'var(--text-muted)',
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: 'var(--text-base)',
                  color: 'var(--text-primary)',
                  lineHeight: 1.5,
                }}
              >
                {choice.text}
              </span>
            </button>
          );
        })}
      </div>

      {picked && (
        <p
          aria-live="polite"
          style={{
            fontFamily: 'var(--font-editorial)',
            fontSize: 'var(--text-base)',
            lineHeight: 1.7,
            color: picked.correct ? 'var(--accent-primary)' : 'var(--accent-warm)',
            borderLeft: `3px solid ${picked.correct ? 'var(--accent-primary)' : 'var(--accent-warm)'}`,
            paddingLeft: 'var(--space-4)',
            margin: 'var(--space-6) 0 0',
          }}
        >
          {picked.correct ? '✓ ' : ''}
          {picked.feedback}
          {!picked.correct && (
            <span style={{ color: 'var(--text-secondary)', display: 'block', marginTop: 'var(--space-2)' }}>
              Pick another answer to keep going.
            </span>
          )}
        </p>
      )}
    </div>
  );
}
