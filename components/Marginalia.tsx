import type { ReactNode } from 'react';

type Props = {
  side?: 'left' | 'right';
  eyebrow?: string;
  children: ReactNode;
};

// Floats a small block (pull quote, stat, footnote) into the gutter on screens
// ≥ 1280 px and collapses inline below the next sibling on smaller screens.
// Drop this *inside* a `.marginalia-wrap` element so the absolute positioning
// is anchored correctly.
export default function Marginalia({ side = 'left', eyebrow, children }: Props) {
  return (
    <aside className={`marginalia marginalia-${side}`}>
      {eyebrow && <span className="marginalia-eyebrow">{eyebrow}</span>}
      {children}
    </aside>
  );
}
