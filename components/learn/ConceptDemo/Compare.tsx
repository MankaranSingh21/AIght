import type { ReactNode } from 'react';
import type { CompareProps } from './types';

interface PanelLabelProps {
  children: ReactNode;
  accent?: boolean;
}

export function PanelLabel({ children, accent = false }: PanelLabelProps) {
  return (
    <p
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-xs)',
        color: accent ? 'var(--accent-primary)' : 'var(--text-muted)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        marginBottom: 'var(--space-3)',
        marginTop: 0,
        marginLeft: 0,
        marginRight: 0,
      }}
    >
      {children}
    </p>
  );
}

export default function Compare({
  ariaLabel,
  children,
}: CompareProps) {
  return (
    <div role="group" aria-label={ariaLabel}>
      {children}
    </div>
  );
}
