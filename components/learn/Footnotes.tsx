'use client';

import { useFootnotes } from './FootnoteContext';

// Renders the registered footnote + citation list at the bottom of an article.
// Splits into "Notes" and "References" subsections. Each entry has an id of
// `fn-entry-<original-id>` so inline markers can scroll to it.
export default function Footnotes() {
  const { notes } = useFootnotes();
  if (notes.length === 0) return null;

  const sideNotes = notes.filter((n) => n.kind === 'note');
  const cites     = notes.filter((n) => n.kind === 'cite');

  return (
    <section
      style={{
        marginTop: 80,
        paddingTop: 32,
        borderTop: '1px solid rgba(245,239,224,0.07)',
        display: 'flex',
        flexDirection: 'column',
        gap: 40,
      }}
    >
      {sideNotes.length > 0 && (
        <div>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(245,239,224,0.30)',
              margin: '0 0 16px',
            }}
          >
            Notes
          </p>
          <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {sideNotes.map((n) => (
              <li
                key={n.id}
                id={`fn-entry-${n.id}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '32px 1fr',
                  gap: 8,
                  fontFamily: 'var(--font-editorial)',
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: 'rgba(245,239,224,0.70)',
                  scrollMarginTop: 100,
                }}
              >
                <a
                  href={`#fn-ref-${n.id}`}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12,
                    color: 'var(--accent-primary)',
                    textDecoration: 'none',
                  }}
                >
                  [{n.index}]
                </a>
                <span>{n.content}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {cites.length > 0 && (
        <div>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(245,239,224,0.30)',
              margin: '0 0 16px',
            }}
          >
            References
          </p>
          <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {cites.map((n) => (
              <li
                key={n.id}
                id={`fn-entry-${n.id}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '32px 1fr',
                  gap: 8,
                  fontFamily: 'var(--font-editorial)',
                  fontSize: 13,
                  lineHeight: 1.65,
                  color: 'rgba(245,239,224,0.65)',
                  scrollMarginTop: 100,
                }}
              >
                <a
                  href={`#fn-ref-${n.id}`}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12,
                    color: 'var(--accent-secondary)',
                    textDecoration: 'none',
                  }}
                >
                  [{n.index}]
                </a>
                <span>
                  {n.href ? (
                    <a
                      href={n.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: 'rgba(245,239,224,0.85)',
                        textDecoration: 'underline',
                        textDecorationColor: 'rgba(0,255,209,0.35)',
                        textUnderlineOffset: 3,
                      }}
                    >
                      {n.source}
                    </a>
                  ) : (
                    n.source
                  )}
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}
