'use client';

import { useState, type ReactNode } from 'react';
import glossary from '@/content/glossary.json';

type Props = {
  term: string;           // key in glossary.json
  children: ReactNode;    // the text in the article that gets wrapped
};

type Entry = { definition: string; related?: string[] };

const REGISTRY = glossary as Record<string, Entry>;

// Inline tooltip for a glossary term. Wraps a word/phrase in a subtle dotted
// underline; on hover (desktop) or tap (mobile), a small popover shows the
// definition. Definitions live in content/glossary.json and are shared across
// every article so the same term reads the same way everywhere.
export default function Glossary({ term, children }: Props) {
  const [open, setOpen] = useState(false);
  const entry = REGISTRY[term];

  // Silently fall back to plain text if the term isn't in the registry — but
  // surface a warning in dev so we don't ship typos.
  if (!entry) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`<Glossary term="${term}"> — not found in content/glossary.json`);
    }
    return <>{children}</>;
  }

  return (
    <span
      style={{ position: 'relative', display: 'inline' }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          all: 'unset',
          cursor: 'help',
          color: 'inherit',
          borderBottom: '1px dotted rgba(170,255,77,0.55)',
          paddingBottom: 1,
        }}
        aria-describedby={open ? `glossary-${term}` : undefined}
      >
        {children}
      </button>
      {open && (
        <span
          id={`glossary-${term}`}
          role="tooltip"
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 10px)',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 40,
            width: 280,
            padding: '14px 16px',
            background: 'rgba(20,16,14,0.96)',
            border: '1px solid rgba(170,255,77,0.18)',
            borderRadius: 10,
            boxShadow: '0 16px 40px rgba(0,0,0,0.55)',
            backdropFilter: 'blur(14px)',
            fontFamily: 'var(--font-editorial)',
            fontSize: 13,
            lineHeight: 1.6,
            color: 'rgba(245,239,224,0.88)',
            pointerEvents: 'none',
            whiteSpace: 'normal',
            fontStyle: 'normal',
          }}
        >
          <span
            style={{
              display: 'block',
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--accent-primary)',
              marginBottom: 6,
            }}
          >
            {term.replace(/-/g, ' ')}
          </span>
          {entry.definition}
        </span>
      )}
    </span>
  );
}
