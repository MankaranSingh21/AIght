'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  r: number;
  speed: number;
  phase: number;
  bright: number;
  _fx: number;
  _fy: number;
  _alpha: number;
  _near: number;
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -999, y: -999 });
  const pts = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', e => {
      mouse.current = { x: e.clientX, y: e.clientY };
    });

    const N = 90;
    pts.current = Array.from({ length: N }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.2 + 0.4,
      speed: Math.random() * 0.3 + 0.1,
      phase: Math.random() * Math.PI * 2,
      bright: Math.random(),
      _fx: 0, _fy: 0, _alpha: 0, _near: 0,
    }));

    const draw = (t: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mx = mouse.current.x, my = mouse.current.y;

      for (const p of pts.current) {
        const drift = Math.sin(t * 0.0004 * p.speed + p.phase) * 12;
        const cx = p.x + drift * 0.6;
        const cy = p.y + drift * 0.4;

        const dx = cx - mx, dy = cy - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const near = Math.max(0, 1 - dist / 160);

        // Gentle repulsion from cursor
        const rx = near > 0 ? (dx / (dist + 1)) * near * 18 : 0;
        const ry = near > 0 ? (dy / (dist + 1)) * near * 18 : 0;
        p._fx = cx + rx;
        p._fy = cy + ry;
        p._near = near;
        p._alpha = 0.10 + p.bright * 0.08 + near * 0.5;

        // Color: neon lime near cursor, parchment otherwise
        const isNear = near > 0.1;
        const R = isNear ? 170 : 245;
        const G = isNear ? 255 : 239;
        const B = isNear ? 77  : 224;

        ctx.beginPath();
        ctx.arc(p._fx, p._fy, p.r + near * 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${R},${G},${B},${p._alpha})`;
        ctx.fill();

        // Glow halo near cursor
        if (near > 0.3) {
          ctx.beginPath();
          ctx.arc(p._fx, p._fy, (p.r + near * 2) * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(170,255,77,${near * 0.05})`;
          ctx.fill();
        }
      }

      // Connection lines between nearby dots
      for (let i = 0; i < pts.current.length; i++) {
        const a = pts.current[i];
        for (let j = i + 1; j < pts.current.length; j++) {
          const b = pts.current[j];
          const dx = a._fx - b._fx, dy = a._fy - b._fy;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 100) {
            const nearBoost = Math.max(a._near, b._near);
            const lineAlpha = (1 - d / 100) * (0.04 + nearBoost * 0.10);
            const isNearLine = nearBoost > 0.2;
            ctx.beginPath();
            ctx.moveTo(a._fx, a._fy);
            ctx.lineTo(b._fx, b._fy);
            ctx.strokeStyle = isNearLine
              ? `rgba(170,255,77,${lineAlpha})`
              : `rgba(245,239,224,${lineAlpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
      }}
      aria-hidden="true"
    />
  );
}
