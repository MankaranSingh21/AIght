'use client';

import { useRef, useState, useEffect, type ReactNode, type CSSProperties } from 'react';

type Props = {
  children: ReactNode;
  maxDeg?: number;        // max rotation in degrees, default 6
  scale?: number;         // hover scale, default 1.015
  perspective?: number;   // CSS perspective px, default 1000
  className?: string;
  style?: CSSProperties;
};

// 3D mouse-tilt wrapper. Disabled on touch devices and when the user requests
// reduced motion. The transform is applied on mousemove and lerped back to
// neutral on leave via a CSS transition.
export default function TiltCard({
  children,
  maxDeg = 6,
  scale = 1.015,
  perspective = 1000,
  className,
  style,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const hover = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setEnabled(hover.matches && !reduce.matches);
    update();
    hover.addEventListener('change', update);
    reduce.addEventListener('change', update);
    return () => {
      hover.removeEventListener('change', update);
      reduce.removeEventListener('change', update);
    };
  }, []);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!enabled || !ref.current) return;
    const el = ref.current;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - r.left) / r.width - 0.5;     // -0.5 … 0.5
    const dy = (e.clientY - r.top)  / r.height - 0.5;
    const rotY = dx * maxDeg * 2;
    const rotX = -dy * maxDeg * 2;
    el.style.transition = 'transform 80ms linear';
    el.style.transform =
      `perspective(${perspective}px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale(${scale})`;
  }

  function onLeave() {
    if (!ref.current) return;
    ref.current.style.transition = 'transform 380ms cubic-bezier(0.16, 1, 0.3, 1)';
    ref.current.style.transform =
      `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`;
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{
        transformStyle: 'preserve-3d',
        willChange: enabled ? 'transform' : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
