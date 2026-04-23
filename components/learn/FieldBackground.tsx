'use client';

import { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

export default function FieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Capture non-null refs for nested functions
    const c = canvas;
    const x = ctx;

    // --accent-primary: #7DBF8C
    const R = 125, G = 191, B = 140;
    const CONNECTION_DIST = 160;
    const NODE_COUNT = 22;

    let nodes: Node[] = [];
    let width = 0, height = 0;

    function resize() {
      const parent = c.parentElement;
      if (!parent) return;
      width = parent.offsetWidth;
      height = parent.offsetHeight;
      c.width = width;
      c.height = height;
    }

    function init() {
      resize();
      nodes = Array.from({ length: NODE_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        radius: 2 + Math.random() * 3,
        opacity: 0.25 + Math.random() * 0.35,
      }));
    }

    function draw() {
      x.clearRect(0, 0, width, height);

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.07;
            x.beginPath();
            x.moveTo(nodes[i].x, nodes[i].y);
            x.lineTo(nodes[j].x, nodes[j].y);
            x.strokeStyle = `rgba(${R},${G},${B},${alpha})`;
            x.lineWidth = 1;
            x.stroke();
          }
        }
      }

      // Draw nodes
      for (const node of nodes) {
        x.beginPath();
        x.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        x.fillStyle = `rgba(${R},${G},${B},${node.opacity * 0.5})`;
        x.fill();

        // Soft glow ring
        const grd = x.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, node.radius * 4
        );
        grd.addColorStop(0, `rgba(${R},${G},${B},${node.opacity * 0.12})`);
        grd.addColorStop(1, `rgba(${R},${G},${B},0)`);
        x.beginPath();
        x.arc(node.x, node.y, node.radius * 4, 0, Math.PI * 2);
        x.fillStyle = grd;
        x.fill();
      }
    }

    function tick() {
      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;
        // Wrap edges softly
        if (node.x < -20) node.x = width + 20;
        if (node.x > width + 20) node.x = -20;
        if (node.y < -20) node.y = height + 20;
        if (node.y > height + 20) node.y = -20;
      }
      draw();
      rafRef.current = requestAnimationFrame(tick);
    }

    init();
    tick();

    const observer = new ResizeObserver(() => {
      resize();
    });
    const parent = c.parentElement;
    if (parent) observer.observe(parent);

    return () => {
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
      aria-hidden="true"
    />
  );
}
