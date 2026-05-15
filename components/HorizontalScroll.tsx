'use client';

import type { ReactNode } from 'react';
import { useDragScroll } from '@/hooks/useDragScroll';

type Props = {
  children: ReactNode;
  className?: string;
};

// Full-bleed horizontal scroll strip with snap and click-drag panning.
// Margin escapes the centred parent column via `margin: 0 calc(50% - 50vw)`
// applied in the `.h-scroll-strip` class.
export default function HorizontalScroll({ children, className }: Props) {
  const ref = useDragScroll<HTMLDivElement>();
  return (
    <div ref={ref} className={`h-scroll-strip ${className ?? ''}`}>
      {children}
    </div>
  );
}
