import Link from 'next/link';

type Props = {
  readTime?: string;
  lastUpdated?: string;
  sources?: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
};

const DIFFICULTY_COLOR: Record<NonNullable<Props['difficulty']>, string> = {
  beginner: 'var(--accent-primary)',
  intermediate: 'var(--accent-warm)',
  advanced: '#E07070',
};

// Small card pinned to the top of the right gutter. Shows reading time,
// last-updated date, source count, and a difficulty pill.
export default function ArticleMeta({ readTime, lastUpdated, sources, difficulty }: Props) {
  return (
    <div
      style={{
        padding: '14px 16px',
        background: 'rgba(255,250,240,0.025)',
        border: '1px solid rgba(245,239,224,0.08)',
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      {difficulty && (
        <span
          style={{
            alignSelf: 'flex-start',
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            padding: '3px 8px',
            borderRadius: 999,
            background: 'rgba(255,255,255,0.03)',
            border: `1px solid ${DIFFICULTY_COLOR[difficulty]}55`,
            color: DIFFICULTY_COLOR[difficulty],
          }}
        >
          {difficulty}
        </span>
      )}
      <Row label="Read time" value={readTime ?? '—'} />
      {lastUpdated && <Row label="Updated" value={formatDate(lastUpdated)} />}
      {sources !== undefined && <Row label="Sources" value={String(sources)} accent />}
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'rgba(245,239,224,0.32)',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: accent ? 'var(--font-mono)' : 'var(--font-ui)',
          fontSize: 12,
          color: accent ? 'var(--accent-primary)' : 'rgba(245,239,224,0.80)',
        }}
      >
        {value}
      </span>
    </div>
  );
}

function formatDate(d: string): string {
  try {
    const date = new Date(d);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  } catch {
    return d;
  }
}
// Keep `Link` import for future right-gutter expansions (action chips, etc.)
void Link;
