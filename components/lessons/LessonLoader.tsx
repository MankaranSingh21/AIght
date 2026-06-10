'use client';

import { useEffect, useState } from 'react';
import type { Lesson } from '@/lib/lessons';
import { LESSON_LOADERS } from '@/content/lessons';
import LessonPlayer from './LessonPlayer';

export default function LessonLoader({ slug }: { slug: string }) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = LESSON_LOADERS[slug];
    if (!load) {
      setFailed(true);
      return;
    }
    load()
      .then((mod) => {
        if (!cancelled) setLesson(mod.default);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (failed) {
    return (
      <p
        style={{
          fontFamily: 'var(--font-ui)',
          color: 'var(--text-secondary)',
          padding: 'var(--space-8) 0',
        }}
      >
        This lesson could not be loaded. The full essay still has everything —{' '}
        <a href={`/learn/${slug}`} style={{ color: 'var(--accent-secondary)' }}>
          read it here
        </a>
        .
      </p>
    );
  }

  if (!lesson) {
    return (
      <div
        aria-label="Loading lesson"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          minHeight: 380,
        }}
      />
    );
  }

  return <LessonPlayer lesson={lesson} />;
}
