'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  loadProgress,
  levelFor,
  PROGRESS_CHANGED_EVENT,
  type ProgressState,
} from '@/lib/progress';
import ProgressRing from './ProgressRing';

/**
 * Quiet progress indicator for the navbar: level ring + streak count. Links to
 * the /you dashboard. Renders nothing until the visitor has earned any XP — the
 * chrome stays clean for first-time readers (so there's no empty link either).
 */
export default function StreakChip() {
  const [state, setState] = useState<ProgressState | null>(null);

  useEffect(() => {
    const sync = () => setState(loadProgress());
    sync();
    window.addEventListener(PROGRESS_CHANGED_EVENT, sync);
    return () => window.removeEventListener(PROGRESS_CHANGED_EVENT, sync);
  }, []);

  if (!state || state.xp === 0) return null;

  const { level, progress } = levelFor(state.xp);

  return (
    <Link
      href="/you"
      title={`${level} · ${state.xp} xp${state.streak.current > 1 ? ` · day ${state.streak.current} streak` : ''} — see your progress`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 10px',
        borderRadius: 'var(--radius-full)',
        border: '1px solid var(--border-subtle)',
        background: 'var(--bg-surface)',
        textDecoration: 'none',
      }}
    >
      <ProgressRing progress={progress} />
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--text-secondary)',
          whiteSpace: 'nowrap',
        }}
      >
        {level}
        {state.streak.current > 1 && (
          <span style={{ color: 'var(--accent-primary)' }}> · {state.streak.current}d</span>
        )}
      </span>
    </Link>
  );
}
