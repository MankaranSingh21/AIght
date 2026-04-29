'use client';

import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Per-concept visual config — color, node count, connection radius
const CONCEPT_CONFIG: Record<string, { color: string; n: number; radius: number; speed: number }> = {
  'transformers':        { color: '#AAFF4D', n: 80,  radius: 1.8, speed: 0.0007 },
  'embeddings':          { color: '#00FFD1', n: 110, radius: 2.2, speed: 0.0012 },
  'rag':                 { color: '#AAFF4D', n: 65,  radius: 1.6, speed: 0.0006 },
  'mcp':                 { color: '#00FFD1', n: 72,  radius: 1.9, speed: 0.0009 },
  'agents':              { color: '#A373D7', n: 90,  radius: 2.0, speed: 0.0014 },
  'prompt-engineering':  { color: '#F4AB1F', n: 68,  radius: 1.7, speed: 0.0007 },
  'fine-tuning':         { color: '#AAFF4D', n: 95,  radius: 2.1, speed: 0.0009 },
  'context-windows':     { color: '#00FFD1', n: 70,  radius: 1.8, speed: 0.0008 },
  'multimodal':          { color: '#A373D7', n: 100, radius: 2.0, speed: 0.0011 },
};
const DEFAULT_CFG = { color: '#AAFF4D', n: 80, radius: 1.8, speed: 0.0008 };

function pointInSphere(r: number): [number, number, number] {
  // Uniform distribution inside a sphere
  const u = Math.random(), v = Math.random(), w = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const rr = r * Math.cbrt(w);
  return [
    rr * Math.sin(phi) * Math.cos(theta),
    rr * Math.cos(phi) * 0.55,   // flatten slightly on Y — feels more cinematic
    rr * Math.sin(phi) * Math.sin(theta),
  ];
}

function ConstellationScene({ slug }: { slug: string }) {
  const cfg = CONCEPT_CONFIG[slug] ?? DEFAULT_CFG;
  const groupRef  = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef  = useRef<THREE.LineSegments>(null);
  const { viewport } = useThree();

  // Build geometry once on mount
  useEffect(() => {
    const pts = groupRef.current;
    if (!pts) return;

    // Generate node positions
    const positions: [number, number, number][] = Array.from({ length: cfg.n }, () =>
      pointInSphere(cfg.radius)
    );

    // Dot buffer
    const dpArr = new Float32Array(cfg.n * 3);
    positions.forEach(([x, y, z], i) => {
      dpArr[i * 3] = x; dpArr[i * 3 + 1] = y; dpArr[i * 3 + 2] = z;
    });

    // Edge buffer — connect pairs within connection distance
    const connDist = cfg.radius * 0.72;
    const connDist2 = connDist * connDist;
    const edges: number[] = [];
    for (let i = 0; i < cfg.n; i++) {
      let connections = 0;
      for (let j = i + 1; j < cfg.n && connections < 4; j++) {
        const dx = positions[i][0] - positions[j][0];
        const dy = positions[i][1] - positions[j][1];
        const dz = positions[i][2] - positions[j][2];
        if (dx * dx + dy * dy + dz * dz < connDist2) {
          edges.push(...positions[i], ...positions[j]);
          connections++;
        }
      }
    }
    const lpArr = new Float32Array(edges);

    if (pointsRef.current) {
      pointsRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(dpArr, 3));
    }
    if (linesRef.current) {
      linesRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(lpArr, 3));
    }

    return () => {
      pointsRef.current?.geometry.dispose();
      linesRef.current?.geometry.dispose();
    };
  }, [cfg]);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * cfg.speed * 1000 * 0.001;
      groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.0003 * 1000 * 0.001) * 0.08;
    }
  });

  const col = new THREE.Color(cfg.color);
  void viewport; // used for responsive scaling if needed

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry />
        <pointsMaterial
          color={col}
          size={2.8}
          sizeAttenuation={false}
          transparent
          opacity={0.55}
          depthWrite={false}
        />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial
          color={col}
          transparent
          opacity={0.10}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

export default function ConceptHeader3D({ slug }: { slug: string }) {
  return (
    <div
      aria-hidden="true"
      style={{
        width: '100%',
        height: 200,
        position: 'relative',
        overflow: 'hidden',
        pointerEvents: 'none',
        maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 30%, rgba(0,0,0,0.6) 70%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 30%, rgba(0,0,0,0.6) 70%, transparent 100%)',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
        dpr={[1, 1.5]}
        style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
      >
        <ConstellationScene slug={slug} />
      </Canvas>
    </div>
  );
}
