'use client';

import { useEffect, useRef } from 'react';

export default function GlowCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef  = useRef<HTMLDivElement>(null);
  const pos     = useRef({ x: -200, y: -200 });
  const tgt     = useRef({ x: -200, y: -200 });
  const rafRef  = useRef<number>(0);

  useEffect(() => {
    // Only activate on pointer-fine devices (mouse)
    if (!window.matchMedia('(pointer: fine)').matches) return;
    document.body.classList.add('js-cursor-active');

    const css = getComputedStyle(document.documentElement);
    const ringIdle  = css.getPropertyValue('--cursor-ring').trim();
    const ringHover = css.getPropertyValue('--cursor-ring-hover').trim();

    const onMove = (e: MouseEvent) => {
      tgt.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMove);

    const loop = () => {
      // Ring lags behind target (lerp)
      pos.current.x += (tgt.current.x - pos.current.x) * 0.09;
      pos.current.y += (tgt.current.y - pos.current.y) * 0.09;

      if (ringRef.current) {
        ringRef.current.style.transform =
          `translate(${pos.current.x - 18}px, ${pos.current.y - 18}px)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate(${tgt.current.x - 3}px, ${tgt.current.y - 3}px)`;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    loop();

    // Grow ring over interactive elements — event delegation, no MutationObserver
    let magnetic = false;     // additional bump when near a [data-magnetic]
    const setRingSize = (base: number, hovered: boolean) => {
      if (!ringRef.current) return;
      const size = base + (magnetic ? 8 : 0);
      ringRef.current.style.width  = `${size}px`;
      ringRef.current.style.height = `${size}px`;
      ringRef.current.style.borderColor = hovered ? ringHover : ringIdle;
    };
    let hoveredEl = false;

    const onEnter = () => { hoveredEl = true;  setRingSize(44, true);  };
    const onLeave = () => { hoveredEl = false; setRingSize(36, false); };

    const onDocOver = (e: MouseEvent) => {
      if ((e.target as Element).closest('a, button, [data-hover]')) onEnter();
    };
    const onDocOut = (e: MouseEvent) => {
      if ((e.target as Element).closest('a, button, [data-hover]')) onLeave();
    };
    document.addEventListener('mouseover', onDocOver);
    document.addEventListener('mouseout', onDocOut);

    // Magnetic proximity — check the cursor against every [data-magnetic]
    // element on each mousemove. Cheap: usually 1–6 such elements on a page.
    const onProximity = (e: MouseEvent) => {
      const nodes = document.querySelectorAll<HTMLElement>('[data-magnetic="true"]');
      let near = false;
      for (let i = 0; i < nodes.length; i++) {
        const r = nodes[i].getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top  + r.height / 2;
        const d = Math.hypot(e.clientX - cx, e.clientY - cy);
        if (d < 110 + Math.max(r.width, r.height) / 2) { near = true; break; }
      }
      if (near !== magnetic) {
        magnetic = near;
        setRingSize(hoveredEl ? 44 : 36, hoveredEl);
      }
    };
    window.addEventListener('mousemove', onProximity);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousemove', onProximity);
      document.removeEventListener('mouseover', onDocOver);
      document.removeEventListener('mouseout', onDocOut);
      cancelAnimationFrame(rafRef.current);
      document.body.classList.remove('js-cursor-active');
    };
  }, []);

  return (
    <>
      {/* Outer ring — lags cursor */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 9998,
          pointerEvents: 'none',
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: '1px solid var(--cursor-ring)',
          background: 'radial-gradient(circle, var(--cursor-bg) 0%, transparent 70%)',
          transition: 'width 200ms ease, height 200ms ease, border-color 200ms ease',
          willChange: 'transform',
        }}
        aria-hidden="true"
      />
      {/* Inner dot — snaps to cursor */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 9999,
          pointerEvents: 'none',
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: 'var(--cursor-dot)',
          boxShadow: '0 0 8px var(--cursor-dot-glow)',
          willChange: 'transform',
        }}
        aria-hidden="true"
      />
    </>
  );
}
