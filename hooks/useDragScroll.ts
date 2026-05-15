'use client';

import { useEffect, useRef } from 'react';

// Enables click-and-drag horizontal scrolling on a container. Useful on desktop
// where a horizontal-snap strip is otherwise hard to scrub without a trackpad.
// Returns a ref to attach to the scrollable element.
export function useDragScroll<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === 'undefined') return;
    // Pointer-fine only — touch devices already have native panning
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    let down = false;
    let startX = 0;
    let startScroll = 0;

    const onDown = (e: PointerEvent) => {
      // Only primary mouse button
      if (e.button !== 0) return;
      // Don't hijack clicks on links / buttons inside cards
      const target = e.target as Element;
      if (target.closest('a, button')) return;
      down = true;
      startX = e.clientX;
      startScroll = el.scrollLeft;
      el.setAttribute('data-grabbing', 'true');
      el.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      el.scrollLeft = startScroll - dx;
    };
    const onUp = (e: PointerEvent) => {
      if (!down) return;
      down = false;
      el.removeAttribute('data-grabbing');
      try { el.releasePointerCapture(e.pointerId); } catch {}
    };

    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
    el.addEventListener('pointerleave', onUp);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
      el.removeEventListener('pointerleave', onUp);
    };
  }, []);

  return ref;
}
