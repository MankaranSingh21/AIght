'use client';

import type { ReactNode } from 'react';
import { FootnoteProvider } from './FootnoteContext';

type Props = {
  left?: ReactNode;       // sticky left-gutter content (TOC + Reading Rail)
  right?: ReactNode;      // right-gutter content (ArticleMeta + RelatedConcepts)
  children: ReactNode;    // article body (middle column)
};

// Three-column reading layout. At ≥1100 px it becomes a 220 · 660 · 220 grid.
// Below that everything collapses to a single column with left/right widgets
// rendered after the article body. Provides FootnoteProvider so any
// <Footnote /> or <Cite /> inside the article registers into a shared list
// rendered at the bottom by <Footnotes />.
export default function EditorialLayout({ left, right, children }: Props) {
  return (
    <FootnoteProvider>
      <div className="editorial-layout">
        <aside className="editorial-gutter-left" aria-hidden={!left}>
          {left}
        </aside>
        <div className="editorial-main">
          {children}
        </div>
        <aside className="editorial-gutter-right" aria-hidden={!right}>
          {right}
        </aside>
      </div>
    </FootnoteProvider>
  );
}
