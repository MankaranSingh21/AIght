'use client';

import { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ── Constants ──────────────────────────────────────────────────────────────────
const N        = 32;      // particle count
const MAX_SEG  = 140;     // pre-allocated line segment pairs
const SPEED    = 0.00030; // world-units per frame, scaled by viewport height
const THRESH_R = 0.27;    // connect if dist < this fraction of viewport height

// ── Three.js scene ─────────────────────────────────────────────────────────────
function AmbientField() {
  const { viewport } = useThree();

  const posArr = useRef(new Float32Array(N * 3));
  const velArr = useRef(new Float32Array(N * 3));
  const segArr = useRef(new Float32Array(MAX_SEG * 6));

  const ptsRef = useRef<THREE.Points>(null);
  const segRef = useRef<THREE.LineSegments>(null);
  const ready  = useRef(false);

  useFrame(() => {
    const pts = ptsRef.current;
    const seg = segRef.current;
    if (!pts || !seg) return;

    const W = viewport.width;
    const H = viewport.height;
    if (W === 0 || H === 0) return;

    // One-time init — deferred until viewport is measured
    if (!ready.current) {
      ready.current = true;
      const p = posArr.current;
      const v = velArr.current;
      const s = H * SPEED;
      for (let i = 0; i < N; i++) {
        p[i * 3]     = (Math.random() * 2 - 1) * W * 0.52;
        p[i * 3 + 1] = (Math.random() * 2 - 1) * H * 0.52;
        p[i * 3 + 2] = 0;
        v[i * 3]     = (Math.random() - 0.5) * s * (W / H);
        v[i * 3 + 1] = (Math.random() - 0.5) * s;
        v[i * 3 + 2] = 0;
      }
      pts.geometry.attributes.position.needsUpdate = true;
    }

    const p  = posArr.current;
    const v  = velArr.current;
    const lp = segArr.current;
    const hw = W * 0.5;
    const hh = H * 0.5;

    // Drift + wrap-around
    for (let i = 0; i < N; i++) {
      p[i * 3]     += v[i * 3];
      p[i * 3 + 1] += v[i * 3 + 1];
      if (p[i * 3]     >  hw) p[i * 3]     = -hw;
      if (p[i * 3]     < -hw) p[i * 3]     =  hw;
      if (p[i * 3 + 1] >  hh) p[i * 3 + 1] = -hh;
      if (p[i * 3 + 1] < -hh) p[i * 3 + 1] =  hh;
    }
    pts.geometry.attributes.position.needsUpdate = true;

    // Organic connections
    const thresh = H * THRESH_R;
    const t2 = thresh * thresh;
    let lc = 0;
    for (let i = 0; i < N && lc < MAX_SEG; i++) {
      for (let j = i + 1; j < N && lc < MAX_SEG; j++) {
        const dx = p[i * 3]     - p[j * 3];
        const dy = p[i * 3 + 1] - p[j * 3 + 1];
        if (dx * dx + dy * dy < t2) {
          const b = lc * 6;
          lp[b]     = p[i * 3];     lp[b + 1] = p[i * 3 + 1]; lp[b + 2] = 0;
          lp[b + 3] = p[j * 3];     lp[b + 4] = p[j * 3 + 1]; lp[b + 5] = 0;
          lc++;
        }
      }
    }
    seg.geometry.attributes.position.needsUpdate = true;
    seg.geometry.setDrawRange(0, lc * 2);
  });

  return (
    <>
      <points ref={ptsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[posArr.current, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#AAFF4D"
          size={2.2}
          sizeAttenuation={false}
          transparent
          opacity={0.45}
          depthWrite={false}
        />
      </points>

      <lineSegments ref={segRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[segArr.current, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#AAFF4D" transparent opacity={0.07} depthWrite={false} />
      </lineSegments>
    </>
  );
}

export default function ParticleCanvas() {
  return (
    <div
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.70 }}
    >
      <Canvas
        orthographic
        camera={{ position: [0, 0, 1], zoom: 180 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
        dpr={1}
        style={{ width: '100%', height: '100%' }}
      >
        <AmbientField />
      </Canvas>
    </div>
  );
}
