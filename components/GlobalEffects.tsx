'use client';

import dynamic from 'next/dynamic';

const GlowCursor = dynamic(() => import('./GlowCursor'), { ssr: false });

export default function GlobalEffects() {
  return <GlowCursor />;
}
