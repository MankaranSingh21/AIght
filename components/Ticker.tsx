'use client';

const ITEMS = [
  '52+ curated tools',
  '20 fields covered',
  '0 affiliate links',
  'Daily signal updates',
  'Healthcare',
  'Law & Legal',
  'Design',
  'Engineering',
  'Education',
  'Finance',
];

export default function Ticker() {
  const str = ITEMS.join('  ·  ') + '  ·  ';

  return (
    <div
      style={{
        overflow: 'hidden',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '11px 0',
        background: 'rgba(255,250,240,0.02)',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div className="ticker-track" style={{ display: 'flex', whiteSpace: 'nowrap' }}>
        {[str, str].map((s, i) => (
          <span
            key={i}
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
            }}
          >
            {s.split('·').map((seg, j) => (
              <span key={j}>
                {j > 0 && (
                  <span style={{ color: 'var(--accent-primary)', margin: '0 10px' }}>·</span>
                )}
                {seg.trim()}
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
