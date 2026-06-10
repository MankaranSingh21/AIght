'use client';

import { useEffect, useRef } from 'react';
import { recordConceptRead } from '@/lib/progress';

const DWELL_MS = 45_000;
const SCROLL_THRESHOLD = 0.8;

/**
 * Invisible. Marks a concept as read once the visitor has both scrolled
 * past 80% of the page and stayed at least 45 seconds — a skim doesn't
 * count, parking a tab doesn't count.
 */
export default function ConceptReadTracker({ slug }: { slug: string }) {
  const firedRef = useRef(false);

  useEffect(() => {
    firedRef.current = false;
    let dwelled = false;
    let scrolled = false;

    const maybeFire = () => {
      if (firedRef.current || !dwelled || !scrolled) return;
      firedRef.current = true;
      recordConceptRead(slug);
    };

    const timer = setTimeout(() => {
      dwelled = true;
      maybeFire();
    }, DWELL_MS);

    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      if (max <= 0 || window.scrollY / max >= SCROLL_THRESHOLD) {
        scrolled = true;
        maybeFire();
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    };
  }, [slug]);

  return null;
}
