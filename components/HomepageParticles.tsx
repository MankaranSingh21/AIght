'use client';

import dynamic from 'next/dynamic';

const ParticleCanvas = dynamic(() => import('./ParticleCanvas'), { ssr: false });

export default function HomepageParticles() {
  return <ParticleCanvas />;
}
