'use client';

import { STATS } from '@/lib/stats';

const STATIC_ITEMS = [
  `${STATS.tools}+ curated tools`,
  `${STATS.fields} fields covered`,
  `${STATS.affiliateLinks} affiliate links`,
];

const FIELD_FALLBACK = [
  'Healthcare', 'Law & Legal', 'Design', 'Engineering', 'Education', 'Finance',
];

// Optional live data. The homepage fetches the most-recent tool/concept titles
// once (server-side) and passes them in — keeps the ticker honest instead of
// rotating six hardcoded field names.
export interface TickerProps {
  recentToolNames?: string[];
  recentConceptTitles?: string[];
  fields?: string[];
}

export default function Ticker({
  recentToolNames,
  recentConceptTitles,
  fields,
}: TickerProps = {}) {
  const live: string[] = [];
  if (recentToolNames?.length) {
    live.push(`Just added: ${recentToolNames.slice(0, 3).join(', ')}`);
  }
  if (recentConceptTitles?.length) {
    live.push(`Latest essay: ${recentConceptTitles[0]}`);
  }

  const fieldChips = (fields?.length ? fields : FIELD_FALLBACK).slice(0, 6);

  const items = [...STATIC_ITEMS, ...live, ...fieldChips];
  const str = items.join('  ·  ') + '  ·  ';

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
