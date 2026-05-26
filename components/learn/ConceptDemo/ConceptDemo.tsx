import type { ConceptDemoProps } from './types';

export default function ConceptDemo({
  background,
  ariaLabel,
  hint,
  margin,
  children,
}: ConceptDemoProps) {
  const labelText = `◉ INTERACTIVE${hint ? ' ' + hint : ''}`;

  return (
    <div
      role="region"
      aria-label={ariaLabel}
      style={{
        background: background ?? 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-8)',
        margin: margin ?? 'var(--space-10) 0',
        overflowX: 'hidden',
      }}
    >
      <p
        aria-hidden="true"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          marginBottom: 'var(--space-4)',
          margin: `0 0 var(--space-4)`,
        }}
      >
        {labelText}
      </p>
      {children}
    </div>
  );
}
