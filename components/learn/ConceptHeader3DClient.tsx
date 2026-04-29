'use client';

import dynamic from 'next/dynamic';

const ConceptHeader3D = dynamic(() => import('./ConceptHeader3D'), { ssr: false });

export default function ConceptHeader3DClient({ slug }: { slug: string }) {
  return <ConceptHeader3D slug={slug} />;
}
