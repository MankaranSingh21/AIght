'use client';

import dynamic from 'next/dynamic';

const ConceptCarousel = dynamic(
  () => import('@/components/learn/ConceptCarousel'),
  { ssr: false }
);

export default function ConceptCarouselClient() {
  return <ConceptCarousel />;
}
