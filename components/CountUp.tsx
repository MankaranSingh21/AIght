'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

interface CountUpProps {
  end: number;
  suffix?: string;
  durationMs?: number;
  className?: string;
}

// useLayoutEffect warns during SSR; fall back to useEffect on the server.
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Counts up to `end` the first time it scrolls into view.
 *
 * Initial state is `end` (not 0) so the server-rendered HTML — and therefore
 * crawlers and no-JS visitors — shows the real number instead of a misleading
 * "0". When JS runs, a pre-paint layout effect resets the value to 0 so the
 * count-up animation still plays, with no flash of the final number. Honours
 * prefers-reduced-motion (and end === 0) by leaving the real value in place.
 */
export default function CountUp({ end, suffix = '', durationMs = 600, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(end);
  const startedRef = useRef(false);

  // Before the first client paint, drop to 0 so the animation has somewhere to
  // climb from. SSR keeps `end`, so hydration matches and crawlers see `end`.
  useIsoLayoutEffect(() => {
    if (end === 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setValue(0);
  }, [end]);

  useEffect(() => {
    const el = ref.current;
    if (!el || end === 0) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(end);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || startedRef.current) return;
        startedRef.current = true;
        observer.disconnect();

        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / durationMs);
          // ease-out cubic — settles like breath, no bounce
          const eased = 1 - Math.pow(1 - t, 3);
          setValue(Math.round(eased * end));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, durationMs]);

  return (
    <span ref={ref} className={className}>
      {value}
      {suffix}
    </span>
  );
}
