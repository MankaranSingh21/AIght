'use client';

import { useEffect, useRef } from 'react';

type Options = {
  radius?: number;     // px around element center where attraction begins
  strength?: number;   // 0..1 — fraction of (dx,dy) applied as translate
  max?: number;        // px — cap on the translation magnitude
};

// Magnetic hover hook. Returns a ref to attach to the element. While the cursor
// is within `radius` of the element's center, the element translates by
// (dx,dy) * strength (capped at `max`). On leave, returns smoothly to (0,0).
// Disabled on touch and when prefers-reduced-motion is set.
export function useMagneticHover<T extends HTMLElement = HTMLElement>(
  { radius = 90, strength = 0.28, max = 14 }: Options = {},
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === 'undefined') return;

    const hover = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!hover.matches || reduce.matches) return;

    el.setAttribute('data-magnetic', 'true');
    el.style.willChange = 'transform';
    el.style.transition = 'transform 320ms cubic-bezier(0.16, 1, 0.3, 1)';

    let inside = false;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top  + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < radius + Math.max(r.width, r.height) / 2) {
        const tx = Math.max(-max, Math.min(max, dx * strength));
        const ty = Math.max(-max, Math.min(max, dy * strength));
        inside = true;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          el.style.transition = 'transform 120ms linear';
          el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`;
        });
      } else if (inside) {
        inside = false;
        cancelAnimationFrame(raf);
        el.style.transition = 'transform 380ms cubic-bezier(0.16, 1, 0.3, 1)';
        el.style.transform = 'translate3d(0, 0, 0)';
      }
    };

    const onLeaveWindow = () => {
      inside = false;
      el.style.transition = 'transform 380ms cubic-bezier(0.16, 1, 0.3, 1)';
      el.style.transform = 'translate3d(0, 0, 0)';
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeaveWindow);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeaveWindow);
      cancelAnimationFrame(raf);
      el.removeAttribute('data-magnetic');
      el.style.transform = '';
      el.style.willChange = '';
    };
  }, [radius, strength, max]);

  return ref;
}
