'use client';

import type { ReactNode } from 'react';

// A pull-quote variant for the right gutter. Sized for the 220 px gutter,
// keeps the editorial italic + warm-accent treatment. On narrow screens it
// inlines as a centered emphasis block (handled in CSS via `.margin-pullquote`
// matching the same mobile fallback pattern as MarginNote).
export default function PullquoteMargin({ children }: { children: ReactNode }) {
  return (
    <aside
      className="margin-pullquote"
      data-side="right"
      style={{
        fontFamily: 'var(--font-editorial)',
        fontStyle: 'italic',
        color: 'var(--accent-warm)',
        lineHeight: 1.4,
      }}
    >
      <span
        aria-hidden
        style={{
          display: 'block',
          fontFamily: 'var(--font-display)',
          fontSize: 36,
          lineHeight: 0.7,
          color: 'var(--accent-warm)',
          opacity: 0.65,
          marginBottom: 6,
        }}
      >
        “
      </span>
      {children}
    </aside>
  );
}
