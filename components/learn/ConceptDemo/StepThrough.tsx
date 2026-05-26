import type { StepThroughProps } from './types';

export default function StepThrough({
  ariaLabel,
  totalSteps,
  activeStep,
  onNext,
  onBack,
  onReset,
  autoAdvance = false,
  children,
}: StepThroughProps) {
  const isAtFirst = activeStep <= 0;
  const isAtLast = activeStep >= totalSteps - 1;

  const navButtonStyle: React.CSSProperties = {
    background: 'transparent',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-default)',
    fontFamily: 'var(--font-ui)',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    padding: 'var(--space-3) var(--space-6)',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    transition: 'border-color 150ms ease, color 150ms ease',
  };

  const resetButtonStyle: React.CSSProperties = {
    background: 'transparent',
    color: 'var(--text-muted)',
    border: 'none',
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    letterSpacing: '0.08em',
    cursor: 'pointer',
    padding: 0,
  };

  return (
    <div role="group" aria-label={ariaLabel}>
      {/* Step counter header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--space-4)',
        }}
      >
        <span
          aria-live="polite"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            color: 'var(--text-muted)',
            letterSpacing: '0.08em',
          }}
        >
          Step {activeStep + 1} of {totalSteps}
        </span>
        {!autoAdvance && onReset && (
          <button onClick={onReset} style={resetButtonStyle}>
            reset ↺
          </button>
        )}
      </div>

      {/* Progress dots */}
      <div
        aria-hidden="true"
        style={{
          display: 'flex',
          gap: 'var(--space-2)',
          marginBottom: 'var(--space-5)',
        }}
      >
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: 'var(--radius-full)',
              background: i <= activeStep ? 'var(--accent-primary)' : 'var(--bg-elevated)',
              transition: 'background 200ms ease',
            }}
          />
        ))}
      </div>

      {/* Demo body */}
      {children}

      {/* Navigation buttons — only when !autoAdvance */}
      {!autoAdvance && (
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-4)',
            marginTop: 'var(--space-5)',
          }}
        >
          {onBack && (
            <button
              onClick={!isAtFirst ? onBack : undefined}
              aria-disabled={isAtFirst}
              style={{
                ...navButtonStyle,
                opacity: isAtFirst ? 0.4 : 1,
                cursor: isAtFirst ? 'not-allowed' : 'pointer',
              }}
            >
              ← Back
            </button>
          )}
          {onNext && (
            <button
              onClick={!isAtLast ? onNext : undefined}
              aria-disabled={isAtLast}
              style={{
                ...navButtonStyle,
                opacity: isAtLast ? 0.4 : 1,
                cursor: isAtLast ? 'not-allowed' : 'pointer',
              }}
            >
              Next →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
