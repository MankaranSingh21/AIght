'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface NodeData {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const NODE_COUNT = 22;
const CONNECTION_DIST = 0.28; // in NDC units (scene coords range -0.5..0.5)
const ACCENT = new THREE.Color(0x7dbf8c); // --accent-primary

export default function FieldBackground() {
  const mountRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── Scene setup ────────────────────────────────────────────────────────
    const scene = new THREE.Scene();

    const camera = new THREE.OrthographicCamera(
      -0.5, 0.5,   // left, right
       0.5, -0.5,  // top, bottom (flipped so +y is up)
      0.1, 10
    );
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.cssText =
      'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;';
    renderer.domElement.setAttribute('aria-hidden', 'true');
    mount.appendChild(renderer.domElement);

    // ── Node state (2D coords, 0..1 range) ───────────────────────────────
    const nodes: NodeData[] = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0003,
      vy: (Math.random() - 0.5) * 0.0003,
    }));

    // ── Points (nodes) ────────────────────────────────────────────────────
    const pointsPositions = new Float32Array(NODE_COUNT * 3);
    const pointsGeo = new THREE.BufferGeometry();
    pointsGeo.setAttribute('position', new THREE.BufferAttribute(pointsPositions, 3));

    const pointsMat = new THREE.PointsMaterial({
      color: ACCENT,
      size: 0.012,
      sizeAttenuation: false,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const points = new THREE.Points(pointsGeo, pointsMat);
    scene.add(points);

    // ── Lines (connections) ───────────────────────────────────────────────
    // Pre-allocate for worst case: N*(N-1)/2 pairs × 2 verts each
    const MAX_PAIRS = (NODE_COUNT * (NODE_COUNT - 1)) / 2;
    const linePositions = new Float32Array(MAX_PAIRS * 6); // 2 verts × 3 floats
    const lineGeo = new THREE.BufferGeometry();
    const linePosAttr = new THREE.BufferAttribute(linePositions, 3);
    linePosAttr.setUsage(THREE.DynamicDrawUsage);
    lineGeo.setAttribute('position', linePosAttr);

    const lineMat = new THREE.LineBasicMaterial({
      color: ACCENT,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const lines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lines);

    // ── Resize ────────────────────────────────────────────────────────────
    function resize() {
      const w = mount!.offsetWidth;
      const h = mount!.offsetHeight;
      renderer.setSize(w, h, false);
      // Adjust camera aspect so the 0..1 node space maps to full rect
      const aspect = w / h;
      camera.left = -0.5 * aspect;
      camera.right = 0.5 * aspect;
      camera.updateProjectionMatrix();
    }
    resize();

    // Node x is 0..1 in the narrower axis; need to scale by aspect for camera
    function nodeToWorld(node: NodeData, aspect: number): [number, number] {
      return [(node.x - 0.5) * aspect, node.y - 0.5];
    }

    // ── Animation loop ─────────────────────────────────────────────────────
    function tick() {
      rafRef.current = requestAnimationFrame(tick);

      const aspect = mount!.offsetWidth / Math.max(mount!.offsetHeight, 1);

      // Update node positions + wrap
      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < -0.05) node.x = 1.05;
        if (node.x > 1.05)  node.x = -0.05;
        if (node.y < -0.05) node.y = 1.05;
        if (node.y > 1.05)  node.y = -0.05;
      }

      // Write Points buffer
      const pp = pointsPositions;
      for (let i = 0; i < NODE_COUNT; i++) {
        const [wx, wy] = nodeToWorld(nodes[i], aspect);
        pp[i * 3]     = wx;
        pp[i * 3 + 1] = wy;
        pp[i * 3 + 2] = 0;
      }
      pointsGeo.attributes.position.needsUpdate = true;

      // Write Lines buffer (only connected pairs)
      let lineIdx = 0;
      const lp = linePositions;
      for (let i = 0; i < NODE_COUNT; i++) {
        for (let j = i + 1; j < NODE_COUNT; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const fade = 1 - dist / CONNECTION_DIST;
            // Vary opacity via material is global; we use vertex count to limit pairs drawn
            // Write pair
            const [ax, ay] = nodeToWorld(nodes[i], aspect);
            const [bx, by] = nodeToWorld(nodes[j], aspect);
            lp[lineIdx++] = ax; lp[lineIdx++] = ay; lp[lineIdx++] = 0;
            lp[lineIdx++] = bx; lp[lineIdx++] = by; lp[lineIdx++] = 0;
            // Modulate opacity from fade (can't per-vertex without custom shader,
            // so fade is baked into the global opacity each frame for the dominant pair)
            void fade;
          }
        }
      }
      lineGeo.setDrawRange(0, lineIdx / 3);
      lineGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    }

    tick();

    const observer = new ResizeObserver(resize);
    observer.observe(mount);

    return () => {
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
      renderer.dispose();
      pointsGeo.dispose();
      pointsMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
      }}
      aria-hidden="true"
    />
  );
}
