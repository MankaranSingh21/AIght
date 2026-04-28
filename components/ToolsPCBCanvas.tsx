'use client';

import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// PCB / circuit-board ambient layer for the tools grid.
// Renders a sparse grid of trace lines + junction dots in neon lime at very low opacity.
// Nodes near the mouse cursor glow brighter — a subtle "backlight" effect.

const LINE_COLOR  = '#AAFF4D';
const DOT_COLOR   = '#AAFF4D';
const LINE_OPACITY = 0.055;
const DOT_OPACITY  = 0.18;
const DOT_GLOW     = 0.70;  // opacity when cursor is close
const GLOW_RADIUS  = 0.30;  // fraction of viewport height

// Grid params — kept light for GPU
const COLS = 18;
const ROWS = 12;
// Probability a potential edge actually exists
const EDGE_PROB = 0.28;

interface Node { x: number; y: number; }

function PCBScene({ mouse }: { mouse: React.MutableRefObject<[number, number]> }) {
  const { viewport } = useThree();

  // Build grid once on mount
  const nodesRef = useRef<Node[]>([]);
  const edgesRef = useRef<[number, number][]>([]);
  const initialized = useRef(false);

  const dotPosArr   = useRef<Float32Array>(new Float32Array(0));
  const dotColorArr = useRef<Float32Array>(new Float32Array(0));
  const linePosArr  = useRef<Float32Array>(new Float32Array(0));

  const dotsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  // Explicit disposal
  useEffect(() => {
    const d = dotsRef.current;
    const l = linesRef.current;
    return () => {
      d?.geometry.dispose();
      (d?.material as THREE.Material | undefined)?.dispose();
      l?.geometry.dispose();
      (l?.material as THREE.Material | undefined)?.dispose();
    };
  }, []);

  useFrame(() => {
    const W = viewport.width;
    const H = viewport.height;
    if (W === 0 || H === 0) return;

    // One-time grid construction (needs viewport dimensions)
    if (!initialized.current) {
      initialized.current = true;

      const nodes: Node[] = [];
      const cellW = W / (COLS - 1);
      const cellH = H / (ROWS - 1);
      const jitterX = cellW * 0.18;
      const jitterY = cellH * 0.18;

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          // Sparse: ~70% of grid positions actually exist
          if (Math.random() > 0.70) continue;
          nodes.push({
            x: -W / 2 + c * cellW + (Math.random() * 2 - 1) * jitterX,
            y: -H / 2 + r * cellH + (Math.random() * 2 - 1) * jitterY,
          });
        }
      }
      nodesRef.current = nodes;

      // Dot buffers
      const dp = new Float32Array(nodes.length * 3);
      const dc = new Float32Array(nodes.length * 3);
      const lime = new THREE.Color(DOT_COLOR);
      for (let i = 0; i < nodes.length; i++) {
        dp[i * 3]     = nodes[i].x;
        dp[i * 3 + 1] = nodes[i].y;
        dp[i * 3 + 2] = 0;
        dc[i * 3]     = lime.r;
        dc[i * 3 + 1] = lime.g;
        dc[i * 3 + 2] = lime.b;
      }
      dotPosArr.current   = dp;
      dotColorArr.current = dc;

      // Build edges: connect node pairs that are roughly cell-adjacent
      const edges: [number, number][] = [];
      const maxDist = Math.sqrt(cellW * cellW + cellH * cellH) * 1.5;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          if (Math.random() > EDGE_PROB) continue;
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            // Prefer axis-aligned traces (PCB style) — skip diagonals
            const angle = Math.abs(Math.atan2(dy, dx));
            const isAxisAligned = angle < 0.35 || angle > Math.PI - 0.35 ||
              Math.abs(angle - Math.PI / 2) < 0.35;
            if (isAxisAligned) edges.push([i, j]);
          }
        }
      }
      edgesRef.current = edges;

      const lp = new Float32Array(edges.length * 6);
      for (let e = 0; e < edges.length; e++) {
        const [a, b] = edges[e];
        lp[e * 6]     = nodes[a].x;
        lp[e * 6 + 1] = nodes[a].y;
        lp[e * 6 + 2] = 0;
        lp[e * 6 + 3] = nodes[b].x;
        lp[e * 6 + 4] = nodes[b].y;
        lp[e * 6 + 5] = 0;
      }
      linePosArr.current = lp;

      const pts = dotsRef.current;
      const seg = linesRef.current;
      if (pts) {
        pts.geometry.setAttribute('position', new THREE.BufferAttribute(dp, 3));
        pts.geometry.setAttribute('color', new THREE.BufferAttribute(dc, 3));
      }
      if (seg) {
        seg.geometry.setAttribute('position', new THREE.BufferAttribute(lp, 3));
      }
    }

    // Mouse glow — update dot opacity via size (points material doesn't support per-vertex opacity,
    // so we modulate size instead: dots near cursor are larger/brighter looking)
    const pts = dotsRef.current;
    if (!pts || nodesRef.current.length === 0) return;

    const [mx, my] = mouse.current;
    // mouse.current is in clip space [-1,1]; convert to world
    const mwx = mx * (viewport.width  / 2);
    const mwy = my * (viewport.height / 2);
    const glowR = viewport.height * GLOW_RADIUS;
    const glowR2 = glowR * glowR;

    const nodes = nodesRef.current;
    // We'll communicate glow via color intensity (r channel modulation)
    const dc = dotColorArr.current;
    const lime = new THREE.Color(DOT_COLOR);
    for (let i = 0; i < nodes.length; i++) {
      const dx = nodes[i].x - mwx;
      const dy = nodes[i].y - mwy;
      const d2 = dx * dx + dy * dy;
      const t   = d2 < glowR2 ? 1 - Math.sqrt(d2) / glowR : 0;
      const intensity = DOT_OPACITY + (DOT_GLOW - DOT_OPACITY) * t;
      // Store intensity in alpha implicitly via color brightness
      dc[i * 3]     = lime.r * intensity;
      dc[i * 3 + 1] = lime.g * intensity;
      dc[i * 3 + 2] = lime.b * intensity;
    }
    pts.geometry.attributes.color.needsUpdate = true;
  });

  return (
    <>
      <points ref={dotsRef}>
        <bufferGeometry />
        <pointsMaterial
          vertexColors
          size={3.5}
          sizeAttenuation={false}
          transparent
          opacity={1}
          depthWrite={false}
        />
      </points>

      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial
          color={LINE_COLOR}
          transparent
          opacity={LINE_OPACITY}
          depthWrite={false}
        />
      </lineSegments>
    </>
  );
}

export default function ToolsPCBCanvas() {
  const [mobile, setMobile] = useState(false);
  const mouse = useRef<[number, number]>([9999, 9999]); // off-screen default
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setMobile(mq.matches);
    const h = (e: MediaQueryListEvent) => setMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);

  // Global mouse tracker — canvas has pointer-events: none so we listen on window
  useEffect(() => {
    function onMove(e: MouseEvent) {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      mouse.current = [
        ((e.clientX - rect.left) / rect.width)  * 2 - 1,
        -((e.clientY - rect.top)  / rect.height) * 2 + 1,
      ];
    }
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  if (mobile) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}
    >
      <Canvas
        orthographic
        camera={{ position: [0, 0, 10], zoom: 80 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
        dpr={[1, 1.5]}
        style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
      >
        <PCBScene mouse={mouse} />
      </Canvas>
    </div>
  );
}
