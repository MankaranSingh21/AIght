'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const ParticleCanvas = dynamic(() => import('./ParticleCanvas'), { ssr: false });

/**
 * Gate for the ambient Three.js particle field.
 *
 * The canvas is decorative — zIndex 0, pointerEvents none, opacity 0.85 — but
 * three.js + react-three-fiber is **229KB gzipped**, several times the rest of
 * the homepage's JS. `dynamic(ssr: false)` keeps it out of the server render but
 * still fetches it the moment this component mounts, so it competed with the
 * critical render on the most important page on the site.
 *
 * Two gates:
 *
 * 1. prefers-reduced-motion — skip the import entirely. ParticleCanvas already
 *    freezes its own motion when the preference is set, but it still downloaded
 *    the whole library, created a WebGL context and ran a rAF loop to animate
 *    nothing. Someone who asked for less motion should not pay for any of that.
 *
 * 2. Everyone else — wait for the browser to go idle before loading. Ambient
 *    decoration has no business competing with first paint; it just needs to
 *    arrive before the reader notices it missing.
 *
 * Also honours Save-Data, where sending a quarter of a megabyte of ornament is
 * plainly the wrong call.
 */
export default function HomepageParticles() {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // navigator.connection is non-standard and absent on Safari/Firefox.
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) return;

    const show = () => setShouldRender(true);

    // requestIdleCallback is unsupported in Safari; fall back to a short timer.
    const ric = window.requestIdleCallback;
    if (typeof ric === 'function') {
      const handle = ric(show, { timeout: 2500 });
      return () => window.cancelIdleCallback?.(handle);
    }
    const handle = window.setTimeout(show, 1200);
    return () => window.clearTimeout(handle);
  }, []);

  if (!shouldRender) return null;
  return <ParticleCanvas />;
}
