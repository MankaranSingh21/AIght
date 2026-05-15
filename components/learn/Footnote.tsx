'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useFootnotes } from './FootnoteContext';

let nextId = 0;
function uniqueId(prefix: string) {
  nextId += 1;
  return `${prefix}-${nextId}`;
}

// Inline footnote. Renders as a small clickable superscript `[n]` that
// scrolls to the matching entry in <Footnotes />. On hover (desktop) shows
// a popover preview of the note content.
export default function Footnote({ children }: { children: ReactNode }) {
  const idRef = useRef<string>('');
  if (!idRef.current) idRef.current = uniqueId('fn');
  const { notes, register } = useFootnotes();
  const [hover, setHover] = useState(false);

  useEffect(() => {
    register({ id: idRef.current, kind: 'note', content: children });
  }, [register, children]);

  const entry = notes.find((n) => n.id === idRef.current);
  const index = entry?.index;

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById(`fn-entry-${idRef.current}`);
    target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    target?.animate(
      [{ background: 'rgba(170,255,77,0.15)' }, { background: 'transparent' }],
      { duration: 1200, easing: 'ease-out' },
    );
  };

  return (
    <span
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <a
        href={`#fn-entry-${idRef.current}`}
        onClick={onClick}
        id={`fn-ref-${idRef.current}`}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--accent-primary)',
          textDecoration: 'none',
          padding: '0 3px',
          verticalAlign: 'super',
          lineHeight: 1,
          cursor: 'pointer',
        }}
        aria-label={index ? `Footnote ${index}` : 'Footnote'}
      >
        [{index ?? '·'}]
      </a>
      {hover && index !== undefined && (
        <span
          role="tooltip"
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 8px)',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 30,
            width: 280,
            padding: '12px 14px',
            background: 'rgba(20,16,14,0.95)',
            border: '1px solid rgba(170,255,77,0.20)',
            borderRadius: 8,
            boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(12px)',
            fontFamily: 'var(--font-editorial)',
            fontSize: 12,
            lineHeight: 1.55,
            color: 'rgba(245,239,224,0.85)',
            pointerEvents: 'none',
            whiteSpace: 'normal',
          }}
        >
          {children}
        </span>
      )}
    </span>
  );
}
