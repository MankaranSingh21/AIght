'use client';

import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Design tokens — must match globals.css (--accent-primary, --accent-warm)
const GREEN = new THREE.Color('#AAFF4D');
const AMBER = new THREE.Color('#F4AB1F');

const N_DESKTOP = 80;    // ≤120 per spec
const N_MOBILE  = 60;
const MAX_SEG   = 240;   // pre-allocated line pairs for 80 particles
const SPEED     = 0.00022; // world-units/frame × viewport height — "unhurried"
const THRESH_R  = 0.22;  // connect if XY distance < this fraction of viewport height

// ── Scene ─────────────────────────────────────────────────────────────────────

function AmbientField({ n, showLines }: { n: number; showLines: boolean }) {
  const { viewport } = useThree();

  // Float32Arrays sized to the desktop maximum so we never reallocate on resize.
  // geometry.setDrawRange(0, n) keeps unused slots invisible.
  const posArr   = useRef(new Float32Array(N_DESKTOP * 3));
  const velArr   = useRef(new Float32Array(N_DESKTOP * 3));
  const colorArr = useRef(new Float32Array(N_DESKTOP * 3));
  const segArr   = useRef(new Float32Array(MAX_SEG * 6));

  const ptsRef = useRef<THREE.Points>(null);
  const segRef = useRef<THREE.LineSegments>(null);
  const ready  = useRef(false);

  // Explicit disposal — R3F does not auto-dispose BufferGeometry / Material
  useEffect(() => {
    const pts = ptsRef.current;
    const seg = segRef.current;
    return () => {
      pts?.geometry.dispose();
      (pts?.material as THREE.Material | undefined)?.dispose();
      seg?.geometry.dispose();
      (seg?.material as THREE.Material | undefined)?.dispose();
    };
  }, []);

  useFrame(() => {
    const pts = ptsRef.current;
    const seg = segRef.current;
    if (!pts) return;

    const W = viewport.width;
    const H = viewport.height;
    if (W === 0 || H === 0) return;

    // One-time init — deferred until viewport is measured by R3F
    if (!ready.current) {
      ready.current = true;
      const p = posArr.current;
      const v = velArr.current;
      const c = colorArr.current;
      const s = H * SPEED;

      for (let i = 0; i < n; i++) {
        // XY: fill the viewport with a small bleed
        p[i * 3]     = (Math.random() * 2 - 1) * W * 0.52;
        p[i * 3 + 1] = (Math.random() * 2 - 1) * H * 0.52;
        // Z: depth field −5 to 5 (camera at z=10, all particles safely in front)
        p[i * 3 + 2] = (Math.random() * 2 - 1) * 5;

        v[i * 3]     = (Math.random() - 0.5) * s * (W / H);
        v[i * 3 + 1] = (Math.random() - 0.5) * s;
        // Z drift: very slow — just enough to suggest the forest breathing
        v[i * 3 + 2] = (Math.random() - 0.5) * s * 0.06;

        // 70% warm Ghibli green, 30% amber — no white, no blue, no neon
        const col = Math.random() < 0.7 ? GREEN : AMBER;
        c[i * 3]     = col.r;
        c[i * 3 + 1] = col.g;
        c[i * 3 + 2] = col.b;
      }

      pts.geometry.setDrawRange(0, n);
      pts.geometry.attributes.position.needsUpdate = true;
      pts.geometry.attributes.color.needsUpdate    = true;
    }

    const p  = posArr.current;
    const v  = velArr.current;
    const hw = W * 0.5;
    const hh = H * 0.5;

    // Drift — wrap XY, reflect Z softly so particles drift back (feels organic)
    for (let i = 0; i < n; i++) {
      p[i * 3]     += v[i * 3];
      p[i * 3 + 1] += v[i * 3 + 1];
      p[i * 3 + 2] += v[i * 3 + 2];

      if (p[i * 3]     >  hw) p[i * 3]     = -hw;
      if (p[i * 3]     < -hw) p[i * 3]     =  hw;
      if (p[i * 3 + 1] >  hh) p[i * 3 + 1] = -hh;
      if (p[i * 3 + 1] < -hh) p[i * 3 + 1] =  hh;

      if (p[i * 3 + 2] >  5) v[i * 3 + 2] = -Math.abs(v[i * 3 + 2]);
      if (p[i * 3 + 2] < -5) v[i * 3 + 2] =  Math.abs(v[i * 3 + 2]);
    }
    pts.geometry.attributes.position.needsUpdate = true;

    // Organic connections — desktop only
    if (showLines && seg) {
      const lp     = segArr.current;
      const thresh = H * THRESH_R;
      const t2     = thresh * thresh;
      let lc = 0;

      for (let i = 0; i < n && lc < MAX_SEG; i++) {
        for (let j = i + 1; j < n && lc < MAX_SEG; j++) {
          const dx = p[i * 3]     - p[j * 3];
          const dy = p[i * 3 + 1] - p[j * 3 + 1];
          // XY-only distance — z-separated particles should not connect
          if (dx * dx + dy * dy < t2) {
            const b = lc * 6;
            lp[b]     = p[i * 3];     lp[b + 1] = p[i * 3 + 1]; lp[b + 2] = p[i * 3 + 2];
            lp[b + 3] = p[j * 3];     lp[b + 4] = p[j * 3 + 1]; lp[b + 5] = p[j * 3 + 2];
            lc++;
          }
        }
      }
      seg.geometry.attributes.position.needsUpdate = true;
      seg.geometry.setDrawRange(0, lc * 2);
    }
  });

  return (
    <>
      <points ref={ptsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[posArr.current, 3]} />
          <bufferAttribute attach="attributes-color"    args={[colorArr.current, 3]} />
        </bufferGeometry>
        <pointsMaterial
          vertexColors
          size={2.5}
          sizeAttenuation={false}
          transparent
          opacity={0.55}
          depthWrite={false}
        />
      </points>

      {showLines && (
        <lineSegments ref={segRef}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[segArr.current, 3]} />
          </bufferGeometry>
          <lineBasicMaterial color="#AAFF4D" transparent opacity={0.06} depthWrite={false} />
        </lineSegments>
      )}
    </>
  );
}

// ── Shell ──────────────────────────────────────────────────────────────────────

export default function ParticleCanvas() {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.70 }}
    >
      <Canvas
        orthographic
        camera={{ position: [0, 0, 10], zoom: 180 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
        dpr={[1, 2]}
        style={{ width: '100%', height: '100%' }}
      >
        <AmbientField n={mobile ? N_MOBILE : N_DESKTOP} showLines={!mobile} />
      </Canvas>
    </div>
  );
}
