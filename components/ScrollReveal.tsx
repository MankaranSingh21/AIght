'use client';

import { useEffect, useRef } from 'react';

export default function ScrollReveal({
  children,
  delay = 0,
  scale = false,
}: {
  children: React.ReactNode;
  delay?: number;
  scale?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.classList.add('is-revealed');
          }, delay);
          observer.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={scale ? 'reveal-section-scale' : 'reveal-section'}>
      {children}
    </div>
  );
}
