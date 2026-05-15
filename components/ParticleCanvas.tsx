'use client';

import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Design tokens — must match globals.css (--accent-primary, --accent-warm, --accent-secondary)
const GREEN = new THREE.Color('#AAFF4D');
const AMBER = new THREE.Color('#F4AB1F');
const TEAL  = new THREE.Color('#00FFD1');

const N_DESKTOP = 80;
const N_MOBILE  = 60;
const MAX_SEG   = 260;
const SPEED     = 0.00075;       // 3.4× faster — reads as motion, still calm
const THRESH_R  = 0.26;          // connection radius, fraction of viewport height
const REPULSE_R = 0.18;          // cursor repulsion radius, fraction of viewport height
const REPULSE_K = 0.045;         // strength of cursor push per frame
const VEL_DAMP  = 0.965;         // damping so particles drift back to base speed
const TRAIL_LIFE = 36;           // shooting-star trail length in frames (~0.6s)

// Module-scoped mouse target in world units (set by ParticleCanvas wrapper)
// We use a module-level ref so the wrapper can write and AmbientField can read
// without prop-drilling through R3F's <Canvas> boundary.
const mouseWorld = { x: 1e9, y: 1e9, active: false };

// ── Scene ─────────────────────────────────────────────────────────────────────

function AmbientField({ n, showLines, allowShootingStar }: { n: number; showLines: boolean; allowShootingStar: boolean }) {
  const { viewport, camera } = useThree();

  const posArr   = useRef(new Float32Array(N_DESKTOP * 3));
  const velArr   = useRef(new Float32Array(N_DESKTOP * 3));
  const colorArr = useRef(new Float32Array(N_DESKTOP * 3));
  const sizeArr  = useRef(new Float32Array(N_DESKTOP));        // per-particle base size
  const opaArr   = useRef(new Float32Array(N_DESKTOP));        // per-particle base opacity 0..1
  const phaseArr = useRef(new Float32Array(N_DESKTOP));        // twinkle phase offset
  const twSpeed  = useRef(new Float32Array(N_DESKTOP));        // twinkle speed (rad/s)
  const baseVel  = useRef(new Float32Array(N_DESKTOP * 2));    // resting XY velocity to restore after repulsion
  const segArr   = useRef(new Float32Array(MAX_SEG * 6));
  const segOpa   = useRef(new Float32Array(MAX_SEG));          // line per-segment alpha 0..1

  // Shooting-star state — single trail at a time
  const shootRef = useRef({
    active: false,
    nextAt: performance.now() + 4000 + Math.random() * 6000,
    x: 0, y: 0, vx: 0, vy: 0,
    trailIdx: 0,
    trailX: new Float32Array(TRAIL_LIFE),
    trailY: new Float32Array(TRAIL_LIFE),
    life: 0,
  });

  const ptsRef = useRef<THREE.Points>(null);
  const segRef = useRef<THREE.LineSegments>(null);
  const trailRef = useRef<THREE.Line>(null);
  const ready  = useRef(false);

  // Detect prefers-reduced-motion at mount; freeze most motion if requested
  const reducedRef = useRef(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedRef.current = mq.matches;
    const onChange = (e: MediaQueryListEvent) => { reducedRef.current = e.matches; };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const pts = ptsRef.current;
    const seg = segRef.current;
    const tr  = trailRef.current;
    return () => {
      pts?.geometry.dispose();
      (pts?.material as THREE.Material | undefined)?.dispose();
      seg?.geometry.dispose();
      (seg?.material as THREE.Material | undefined)?.dispose();
      tr?.geometry.dispose();
      (tr?.material as THREE.Material | undefined)?.dispose();
    };
  }, []);

  useFrame((state) => {
    const pts = ptsRef.current;
    const seg = segRef.current;
    if (!pts) return;

    const W = viewport.width;
    const H = viewport.height;
    if (W === 0 || H === 0) return;

    const t = state.clock.elapsedTime;

    if (!ready.current) {
      ready.current = true;
      const p = posArr.current;
      const v = velArr.current;
      const c = colorArr.current;
      const sizes = sizeArr.current;
      const opa = opaArr.current;
      const phase = phaseArr.current;
      const ts = twSpeed.current;
      const bv = baseVel.current;
      const s = H * SPEED;

      for (let i = 0; i < n; i++) {
        p[i * 3]     = (Math.random() * 2 - 1) * W * 0.52;
        p[i * 3 + 1] = (Math.random() * 2 - 1) * H * 0.52;
        p[i * 3 + 2] = (Math.random() * 2 - 1) * 5;

        v[i * 3]     = (Math.random() - 0.5) * s * (W / H);
        v[i * 3 + 1] = (Math.random() - 0.5) * s;
        v[i * 3 + 2] = (Math.random() - 0.5) * s * 0.06;
        bv[i * 2]     = v[i * 3];
        bv[i * 2 + 1] = v[i * 3 + 1];

        const r = Math.random();
        const col = r < 0.65 ? GREEN : r < 0.88 ? AMBER : TEAL;
        c[i * 3]     = col.r;
        c[i * 3 + 1] = col.g;
        c[i * 3 + 2] = col.b;

        sizes[i] = 1.6 + Math.random() * 1.8;                          // 1.6–3.4 px
        opa[i]   = 0.45 + Math.random() * 0.40;                        // 0.45–0.85
        phase[i] = Math.random() * Math.PI * 2;
        ts[i]    = (Math.random() < 0.1 ? 1.4 : 0.6) + Math.random() * 0.5;  // ~10% twinkle faster
      }

      pts.geometry.setDrawRange(0, n);
      pts.geometry.attributes.position.needsUpdate = true;
      pts.geometry.attributes.color.needsUpdate    = true;
      pts.geometry.attributes.size.needsUpdate     = true;
      pts.geometry.attributes.alpha.needsUpdate    = true;
    }

    const p  = posArr.current;
    const v  = velArr.current;
    const bv = baseVel.current;
    const sizes = sizeArr.current;
    const opa = opaArr.current;
    const phase = phaseArr.current;
    const ts = twSpeed.current;
    const hw = W * 0.5;
    const hh = H * 0.5;

    // Project mouse client-px → world units via R3F's orthographic camera
    let mx = mouseWorld.x;
    let my = mouseWorld.y;
    const reduced = reducedRef.current;
    const mouseOn = mouseWorld.active && !reduced;
    const repR = H * REPULSE_R;
    const repR2 = repR * repR;

    const sizeAttr  = pts.geometry.attributes.size  as THREE.BufferAttribute;
    const alphaAttr = pts.geometry.attributes.alpha as THREE.BufferAttribute;
    const sBuf = sizeAttr.array as Float32Array;
    const aBuf = alphaAttr.array as Float32Array;

    for (let i = 0; i < n; i++) {
      // Cursor repulsion — particles push away from mouse, then damping returns them to base velocity
      if (mouseOn) {
        const dx = p[i * 3] - mx;
        const dy = p[i * 3 + 1] - my;
        const d2 = dx * dx + dy * dy;
        if (d2 < repR2 && d2 > 0.0001) {
          const d = Math.sqrt(d2);
          const falloff = 1 - d / repR;             // 1 at cursor, 0 at radius
          const push = REPULSE_K * H * falloff * falloff;
          v[i * 3]     += (dx / d) * push;
          v[i * 3 + 1] += (dy / d) * push;
        }
      }

      // Damping pulls velocity back toward resting base velocity (so repulsion doesn't run away)
      const dvx = v[i * 3]     - bv[i * 2];
      const dvy = v[i * 3 + 1] - bv[i * 2 + 1];
      v[i * 3]     = bv[i * 2]     + dvx * VEL_DAMP;
      v[i * 3 + 1] = bv[i * 2 + 1] + dvy * VEL_DAMP;

      // Integrate
      p[i * 3]     += reduced ? v[i * 3]     * 0.2 : v[i * 3];
      p[i * 3 + 1] += reduced ? v[i * 3 + 1] * 0.2 : v[i * 3 + 1];
      p[i * 3 + 2] += v[i * 3 + 2];

      // Wrap
      if (p[i * 3]     >  hw) p[i * 3]     = -hw;
      if (p[i * 3]     < -hw) p[i * 3]     =  hw;
      if (p[i * 3 + 1] >  hh) p[i * 3 + 1] = -hh;
      if (p[i * 3 + 1] < -hh) p[i * 3 + 1] =  hh;

      if (p[i * 3 + 2] >  5) v[i * 3 + 2] = -Math.abs(v[i * 3 + 2]);
      if (p[i * 3 + 2] < -5) v[i * 3 + 2] =  Math.abs(v[i * 3 + 2]);

      // Twinkle — modulate per-particle alpha around its base opacity
      const tw = reduced ? 1 : 0.7 + 0.3 * Math.sin(t * ts[i] + phase[i]);

      // Z-based size attenuation — back particles smaller
      const zAtt = 0.85 + ((p[i * 3 + 2] + 5) / 10) * 0.30;

      sBuf[i] = sizes[i] * zAtt;
      aBuf[i] = opa[i] * tw;
    }

    pts.geometry.attributes.position.needsUpdate = true;
    sizeAttr.needsUpdate  = true;
    alphaAttr.needsUpdate = true;

    // Lines — desktop only; brighten by cursor proximity
    if (showLines && seg) {
      const lp     = segArr.current;
      const lo     = segOpa.current;
      const thresh = H * THRESH_R;
      const t2     = thresh * thresh;
      let lc = 0;

      for (let i = 0; i < n && lc < MAX_SEG; i++) {
        for (let j = i + 1; j < n && lc < MAX_SEG; j++) {
          const dx = p[i * 3]     - p[j * 3];
          const dy = p[i * 3 + 1] - p[j * 3 + 1];
          const d2 = dx * dx + dy * dy;
          if (d2 < t2) {
            const b = lc * 6;
            lp[b]     = p[i * 3];     lp[b + 1] = p[i * 3 + 1]; lp[b + 2] = p[i * 3 + 2];
            lp[b + 3] = p[j * 3];     lp[b + 4] = p[j * 3 + 1]; lp[b + 5] = p[j * 3 + 2];
            // Per-segment alpha: base by distance, boosted by midpoint proximity to cursor
            const fade = 1 - d2 / t2;
            let boost = 0;
            if (mouseOn) {
              const mxp = (p[i * 3] + p[j * 3]) * 0.5;
              const myp = (p[i * 3 + 1] + p[j * 3 + 1]) * 0.5;
              const ddx = mxp - mx;
              const ddy = myp - my;
              const dd2 = ddx * ddx + ddy * ddy;
              if (dd2 < repR2) boost = 1 - dd2 / repR2;
            }
            lo[lc] = fade * (0.55 + 0.65 * boost);
            lc++;
          }
        }
      }
      seg.geometry.attributes.position.needsUpdate = true;
      seg.geometry.attributes.alpha.needsUpdate    = true;
      seg.geometry.setDrawRange(0, lc * 2);
    }

    // Shooting star — desktop only, throttled
    if (allowShootingStar && !reduced) {
      const now = performance.now();
      const ss = shootRef.current;

      if (!ss.active && now > ss.nextAt) {
        // Spawn at one of the four edges, traverse roughly across-screen
        const edge = Math.floor(Math.random() * 4);
        const speed = H * 0.05;  // world-units per frame at 60fps
        const dir = (Math.random() - 0.5) * 0.6;
        if (edge === 0)       { ss.x = -hw * 1.05; ss.y = (Math.random() - 0.5) * H; ss.vx =  speed; ss.vy =  speed * dir; }
        else if (edge === 1)  { ss.x =  hw * 1.05; ss.y = (Math.random() - 0.5) * H; ss.vx = -speed; ss.vy =  speed * dir; }
        else if (edge === 2)  { ss.x = (Math.random() - 0.5) * W; ss.y =  hh * 1.05; ss.vx = speed * dir; ss.vy = -speed; }
        else                  { ss.x = (Math.random() - 0.5) * W; ss.y = -hh * 1.05; ss.vx = speed * dir; ss.vy =  speed; }
        ss.active = true;
        ss.life = 0;
        ss.trailIdx = 0;
        ss.trailX.fill(ss.x);
        ss.trailY.fill(ss.y);
      }

      if (ss.active) {
        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.trailX[ss.trailIdx] = ss.x;
        ss.trailY[ss.trailIdx] = ss.y;
        ss.trailIdx = (ss.trailIdx + 1) % TRAIL_LIFE;
        ss.life++;

        // Off-screen + trail flushed?
        const off = ss.x > hw * 1.2 || ss.x < -hw * 1.2 || ss.y > hh * 1.2 || ss.y < -hh * 1.2;
        if (off && ss.life > TRAIL_LIFE) {
          ss.active = false;
          ss.nextAt = now + 14000 + Math.random() * 8000;  // 14–22s between
        }

        const tr = trailRef.current;
        if (tr) {
          const posAttr = tr.geometry.attributes.position as THREE.BufferAttribute;
          const arr = posAttr.array as Float32Array;
          const alphaA = tr.geometry.attributes.alpha as THREE.BufferAttribute;
          const aArr = alphaA.array as Float32Array;
          // Render trail tail → head with rising alpha
          for (let k = 0; k < TRAIL_LIFE; k++) {
            const idx = (ss.trailIdx + k) % TRAIL_LIFE;
            arr[k * 3]     = ss.trailX[idx];
            arr[k * 3 + 1] = ss.trailY[idx];
            arr[k * 3 + 2] = 0.5;
            aArr[k] = (k / TRAIL_LIFE) * (ss.active ? 1 : 0);
          }
          posAttr.needsUpdate = true;
          alphaA.needsUpdate  = true;
          tr.visible = ss.active;
        }
      } else if (trailRef.current) {
        trailRef.current.visible = false;
      }
    }

    // Touch camera so R3F keeps the loop hot (workaround: ensure render even if no other changes)
    camera.updateMatrixWorld();
  });

  // Vertex/fragment shaders for per-particle size + alpha
  const pointsMaterial = useRef<THREE.ShaderMaterial | null>(null);
  if (!pointsMaterial.current) {
    pointsMaterial.current = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      vertexColors: true,
      uniforms: {},
      vertexShader: `
        attribute float size;
        attribute float alpha;
        varying vec3 vColor;
        varying float vAlpha;
        void main() {
          vColor = color;
          vAlpha = alpha;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        void main() {
          vec2 c = gl_PointCoord - vec2(0.5);
          float d = length(c);
          if (d > 0.5) discard;
          float soft = smoothstep(0.5, 0.15, d);
          gl_FragColor = vec4(vColor, vAlpha * soft);
        }
      `,
    });
  }

  const lineMaterial = useRef<THREE.ShaderMaterial | null>(null);
  if (!lineMaterial.current) {
    lineMaterial.current = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: { uColor: { value: new THREE.Color('#AAFF4D') } },
      vertexShader: `
        attribute float alpha;
        varying float vAlpha;
        void main() {
          vAlpha = alpha;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vAlpha;
        void main() {
          gl_FragColor = vec4(uColor, vAlpha * 0.14);
        }
      `,
    });
  }

  // Line alpha buffer — one per segment, but BufferGeometry needs one per vertex.
  // We expand on the fly each frame? Simpler: per-vertex alpha mirror of per-segment.
  // We'll write paired alpha values into a vertex-aligned buffer.
  const segVAlpha = useRef(new Float32Array(MAX_SEG * 2));
  useFrame(() => {
    const seg = segRef.current;
    if (!seg) return;
    const lo = segOpa.current;
    const va = segVAlpha.current;
    for (let i = 0; i < MAX_SEG; i++) {
      va[i * 2]     = lo[i];
      va[i * 2 + 1] = lo[i];
    }
    (seg.geometry.attributes.alpha as THREE.BufferAttribute).needsUpdate = true;
  });

  return (
    <>
      <points ref={ptsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[posArr.current, 3]} />
          <bufferAttribute attach="attributes-color"    args={[colorArr.current, 3]} />
          <bufferAttribute attach="attributes-size"     args={[sizeArr.current, 1]} />
          <bufferAttribute attach="attributes-alpha"    args={[opaArr.current, 1]} />
        </bufferGeometry>
        <primitive object={pointsMaterial.current} attach="material" />
      </points>

      {showLines && (
        <lineSegments ref={segRef}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[segArr.current, 3]} />
            <bufferAttribute attach="attributes-alpha"    args={[segVAlpha.current, 1]} />
          </bufferGeometry>
          <primitive object={lineMaterial.current} attach="material" />
        </lineSegments>
      )}

      {allowShootingStar && (
        <ShootingTrail trailRef={trailRef} />
      )}
    </>
  );
}

// ── Shooting-star trail geometry ──────────────────────────────────────────────

function ShootingTrail({ trailRef }: { trailRef: React.MutableRefObject<THREE.Line | null> }) {
  const posArr = useRef(new Float32Array(TRAIL_LIFE * 3));
  const alphaArr = useRef(new Float32Array(TRAIL_LIFE));

  const mat = useRef<THREE.ShaderMaterial | null>(null);
  if (!mat.current) {
    mat.current = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: { uColor: { value: new THREE.Color('#F4AB1F') } },
      vertexShader: `
        attribute float alpha;
        varying float vAlpha;
        void main() {
          vAlpha = alpha;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vAlpha;
        void main() {
          gl_FragColor = vec4(uColor, vAlpha * 0.95);
        }
      `,
    });
  }

  // R3F renders <line /> as a THREE.Line, but the JSX namespace also has an
  // SVG <line>. Use `<line_` aliased via `as unknown as` to avoid the conflict.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const LineEl = 'line' as any;
  return (
    <LineEl ref={trailRef} visible={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[posArr.current, 3]} />
        <bufferAttribute attach="attributes-alpha"    args={[alphaArr.current, 1]} />
      </bufferGeometry>
      <primitive object={mat.current} attach="material" />
    </LineEl>
  );
}

// ── Shell ──────────────────────────────────────────────────────────────────────

export default function ParticleCanvas() {
  const [mobile, setMobile] = useState(false);
  const camWorld = useRef({ w: 0, h: 0 });

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    // Convert client px → world units; world units = viewportPx / zoom
    const ZOOM = 180;
    const onMove = (e: MouseEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camWorld.current.w = w / ZOOM;
      camWorld.current.h = h / ZOOM;
      mouseWorld.x = (e.clientX - w / 2) / ZOOM;
      // R3F's orthographic Y is +up, screen Y is +down — flip
      mouseWorld.y = (h / 2 - e.clientY) / ZOOM;
      mouseWorld.active = true;
    };
    const onLeave = () => { mouseWorld.active = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      mouseWorld.active = false;
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.85 }}
    >
      <Canvas
        orthographic
        camera={{ position: [0, 0, 10], zoom: 180 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
        dpr={[1, 2]}
        style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
      >
        <AmbientField
          n={mobile ? N_MOBILE : N_DESKTOP}
          showLines={!mobile}
          allowShootingStar={!mobile}
        />
      </Canvas>
    </div>
  );
}
