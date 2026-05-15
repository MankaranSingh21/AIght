'use client';

import { useEffect, useRef, useState } from 'react';
import { useFootnotes } from './FootnoteContext';

let nextId = 0;
function uniqueId(prefix: string) {
  nextId += 1;
  return `${prefix}-${nextId}`;
}

type Props = {
  source: string;
  href?: string;
  label?: string;
};

// Inline citation. Registers into the shared footnote list as a `cite` entry
// rendered in a "References" section. Visually a small lime superscript that
// links to the entry; hover shows the source string.
export default function Cite({ source, href, label }: Props) {
  const idRef = useRef<string>('');
  if (!idRef.current) idRef.current = uniqueId('cite');
  const { notes, register } = useFootnotes();
  const [hover, setHover] = useState(false);

  useEffect(() => {
    register({
      id: idRef.current,
      kind: 'cite',
      content: source,
      source,
      href,
    });
  }, [register, source, href]);

  const entry = notes.find((n) => n.id === idRef.current);
  const index = entry?.index;

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById(`fn-entry-${idRef.current}`);
    target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
          color: 'var(--accent-secondary)',
          textDecoration: 'none',
          padding: '0 3px',
          verticalAlign: 'super',
          lineHeight: 1,
          cursor: 'pointer',
        }}
        aria-label={`Citation: ${source}`}
      >
        [{label ?? index ?? '·'}]
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
            border: '1px solid rgba(0,255,209,0.20)',
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
          <em style={{ color: 'var(--accent-secondary)', fontStyle: 'normal', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Source
          </em>
          <br />
          {source}
        </span>
      )}
    </span>
  );
}
