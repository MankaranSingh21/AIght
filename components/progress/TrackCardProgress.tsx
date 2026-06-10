'use client';

import { useEffect, useState } from 'react';
import {
  loadProgress,
  PROGRESS_CHANGED_EVENT,
} from '@/lib/progress';
import ProgressRing from './ProgressRing';

/**
 * Per-track progress ring for /learn track cards. Counts a node done when
 * its lesson is completed or its essay is read. Renders nothing until the
 * visitor has any progress on the track.
 */
export default function TrackCardProgress({ slugs }: { slugs: string[] }) {
  const [doneCount, setDoneCount] = useState(0);

  useEffect(() => {
    const sync = () => {
      const p = loadProgress();
      setDoneCount(
        slugs.filter((s) => p.conceptsRead[s] || p.lessons[s]?.completedAt).length
      );
    };
    sync();
    window.addEventListener(PROGRESS_CHANGED_EVENT, sync);
    return () => window.removeEventListener(PROGRESS_CHANGED_EVENT, sync);
  }, [slugs]);

  if (doneCount === 0 || slugs.length === 0) return null;

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <ProgressRing progress={doneCount / slugs.length} size={16} />
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          letterSpacing: '0.06em',
          color: 'var(--accent-primary)',
        }}
      >
        {doneCount}/{slugs.length}
      </span>
    </span>
  );
}
