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

    // Grow ring over interactive elements
    const onEnter = () => {
      if (!ringRef.current) return;
      ringRef.current.style.width  = '44px';
      ringRef.current.style.height = '44px';
      ringRef.current.style.borderColor = ringHover;
    };
    const onLeave = () => {
      if (!ringRef.current) return;
      ringRef.current.style.width  = '36px';
      ringRef.current.style.height = '36px';
      ringRef.current.style.borderColor = ringIdle;
    };

    const attach = () => {
      document.querySelectorAll('a, button, [data-hover]').forEach(el => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };
    attach();
    // Re-attach on DOM mutations (dynamically rendered components)
    const mo = new MutationObserver(attach);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
      mo.disconnect();
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
