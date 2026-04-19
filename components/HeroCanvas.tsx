"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  opacity: number;
  radius: number;
}

interface Blob {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

const GREEN = "#7DBF8C";
const AMBER = "#C9A96E";
const PARTICLE_COUNT = 90;
const LINE_DIST = 72;

function randBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function makeParticle(w: number, h: number): Particle {
  const color = Math.random() < 0.65 ? GREEN : AMBER;
  const speed = randBetween(0.03, 0.18);
  const angle = Math.random() * Math.PI * 2;
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    color,
    opacity: randBetween(0.08, 0.58),
    radius: randBetween(1, 2.5),
  };
}

function makeBlob(w: number, h: number): Blob {
  const color = Math.random() < 0.6 ? GREEN : AMBER;
  const speed = randBetween(0.008, 0.025);
  const angle = Math.random() * Math.PI * 2;
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    radius: randBetween(w * 0.18, w * 0.35),
    color,
  };
}

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animId: number;
    let particles: Particle[] = [];
    let blobs: Blob[] = [];

    function resize() {
      const parent = canvas!.parentElement;
      width = canvas!.width = parent ? parent.offsetWidth : window.innerWidth;
      height = canvas!.height = parent ? parent.offsetHeight : 600;
    }

    function init() {
      resize();
      particles = Array.from({ length: PARTICLE_COUNT }, () => makeParticle(width, height));
      blobs = Array.from({ length: 3 }, () => makeBlob(width, height));
    }

    function drawBlobs() {
      for (const blob of blobs) {
        const grad = ctx!.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.radius);
        // 0x0E ≈ 14/255 ≈ 0.055 alpha
        grad.addColorStop(0, blob.color + "0E");
        grad.addColorStop(1, blob.color + "00");
        ctx!.fillStyle = grad;
        ctx!.beginPath();
        ctx!.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function tick() {
      ctx!.clearRect(0, 0, width, height);

      for (const blob of blobs) {
        blob.x += blob.vx;
        blob.y += blob.vy;
        if (blob.x < -blob.radius) blob.x = width + blob.radius;
        else if (blob.x > width + blob.radius) blob.x = -blob.radius;
        if (blob.y < -blob.radius) blob.y = height + blob.radius;
        else if (blob.y > height + blob.radius) blob.y = -blob.radius;
      }
      drawBlobs();

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        else if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        else if (p.y > height) p.y = 0;
      }

      // Lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINE_DIST) {
            const alpha = (1 - dist / LINE_DIST) * 0.12;
            ctx!.strokeStyle = `rgba(125,191,140,${alpha.toFixed(3)})`;
            ctx!.lineWidth = 0.5;
            ctx!.beginPath();
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.stroke();
          }
        }
      }

      for (const p of particles) {
        ctx!.globalAlpha = p.opacity;
        ctx!.fillStyle = p.color;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;

      animId = requestAnimationFrame(tick);
    }

    init();
    tick();

    const ro = new ResizeObserver(() => {
      resize();
    });
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
