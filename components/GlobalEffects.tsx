'use client';

import dynamic from 'next/dynamic';

// Load cursor + particle canvas only on client, no SSR
const ParticleCanvas = dynamic(() => import('./ParticleCanvas'), { ssr: false });
const GlowCursor     = dynamic(() => import('./GlowCursor'),     { ssr: false });

export default function GlobalEffects() {
  return (
    <>
      <ParticleCanvas />
      <GlowCursor />
    </>
  );
}
