import Link from 'next/link';

type Item = { slug: string; title: string };

type Props = {
  items: Item[];
};

// Sticky-ish card in the right gutter. Lists sibling concept articles so the
// reader can hop laterally without going back to /learn.
export default function RelatedConcepts({ items }: Props) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Related concepts">
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'rgba(245,239,224,0.30)',
          margin: '0 0 12px',
        }}
      >
        Read next
      </p>
      <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.map((it) => (
          <li key={it.slug}>
            <Link
              href={`/learn/${it.slug}`}
              style={{
                display: 'block',
                padding: '8px 10px',
                fontFamily: 'var(--font-ui)',
                fontSize: 13,
                color: 'rgba(245,239,224,0.70)',
                textDecoration: 'none',
                borderRadius: 6,
                border: '1px solid rgba(245,239,224,0.06)',
                background: 'rgba(255,250,240,0.015)',
                transition: 'all 180ms ease',
              }}
              className="related-concept-link"
            >
              {it.title} <span style={{ color: 'var(--accent-primary)' }}>→</span>
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
