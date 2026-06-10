'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Track } from '@/lib/curriculum';
import {
  loadProgress,
  PROGRESS_CHANGED_EVENT,
  type ProgressState,
} from '@/lib/progress';

/**
 * Vertical ordered roadmap for one curriculum track. Numbered nodes on a
 * connecting line; completion state comes from the local progress store
 * (lesson completed or essay read). "Soon" nodes render as ghosts.
 */
export default function TrackRoadmap({ track }: { track: Track }) {
  const [progress, setProgress] = useState<ProgressState | null>(null);

  useEffect(() => {
    const sync = () => setProgress(loadProgress());
    sync();
    window.addEventListener(PROGRESS_CHANGED_EVENT, sync);
    return () => window.removeEventListener(PROGRESS_CHANGED_EVENT, sync);
  }, []);

  const isDone = (slug: string): boolean =>
    !!progress &&
    (!!progress.conceptsRead[slug] || !!progress.lessons[slug]?.completedAt);

  return (
    <ol style={{ listStyle: 'none', margin: 0, padding: 0, position: 'relative' }}>
      {/* connecting line */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          left: 15,
          top: 18,
          bottom: 18,
          width: 1,
          background: 'var(--border-subtle)',
        }}
      />
      {track.nodes.map((node, i) => {
        const done = !node.soon && isDone(node.slug);
        return (
          <li
            key={node.slug}
            style={{
              display: 'flex',
              gap: 20,
              padding: '14px 0',
              position: 'relative',
              opacity: node.soon ? 0.45 : 1,
            }}
          >
            {/* node marker */}
            <span
              aria-hidden
              style={{
                width: 32,
                height: 32,
                borderRadius: 'var(--radius-full)',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                background: done ? 'var(--accent-primary)' : 'var(--bg-elevated)',
                color: done ? 'var(--text-inverse)' : 'var(--text-muted)',
                border: `1px solid ${done ? 'var(--accent-primary)' : 'var(--border-default)'}`,
                zIndex: 1,
                transition: 'background 200ms ease',
              }}
            >
              {done ? '✓' : String(i + 1).padStart(2, '0')}
            </span>

            <div style={{ flex: 1, minWidth: 0, paddingTop: 4 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
                {node.soon ? (
                  <span
                    style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: 16,
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                    }}
                  >
                    {node.title}
                  </span>
                ) : (
                  <Link
                    href={`/learn/${node.slug}`}
                    className="hover:text-accent"
                    style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: 16,
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      textDecoration: 'none',
                      transition: 'color 150ms ease',
                    }}
                  >
                    {node.title}
                  </Link>
                )}
                {node.optional && (
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 9,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--text-muted)',
                    }}
                  >
                    optional
                  </span>
                )}
                {node.soon && (
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 9,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--accent-warm)',
                    }}
                  >
                    soon
                  </span>
                )}
              </div>
              {node.tagline && (
                <p
                  style={{
                    fontFamily: 'var(--font-editorial)',
                    fontStyle: 'italic',
                    fontSize: 13,
                    color: 'var(--text-secondary)',
                    margin: '4px 0 0',
                    lineHeight: 1.5,
                  }}
                >
                  {node.tagline}
                </p>
              )}
              {!node.soon && (
                <div style={{ display: 'flex', gap: 14, marginTop: 8, flexWrap: 'wrap' }}>
                  {node.hasLesson && (
                    <Link
                      href={`/learn/${node.slug}/lesson`}
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 10,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--accent-primary)',
                        textDecoration: 'none',
                      }}
                    >
                      ◈ interactive lesson
                    </Link>
                  )}
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      letterSpacing: '0.08em',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {node.readTime}
                  </span>
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
