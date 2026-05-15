'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type FootnoteKind = 'note' | 'cite';

export type FootnoteEntry = {
  id: string;
  kind: FootnoteKind;
  index: number;
  content: ReactNode;
  source?: string;
  href?: string;
};

type Ctx = {
  notes: FootnoteEntry[];
  register: (e: Omit<FootnoteEntry, 'index'>) => void;
};

const FootnoteContext = createContext<Ctx | null>(null);

// Shared registry for <Footnote> and <Cite>. Each registered entry gets an
// index in order of first appearance; the index is rendered as the superscript
// marker, and <Footnotes /> renders the ordered list at the bottom.
//
// Consumers look up their index by id from `notes` after calling register —
// this avoids the async-state race where the register return value could be
// 0 before setNotes flushed.
export function FootnoteProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<FootnoteEntry[]>([]);

  const register = useCallback((e: Omit<FootnoteEntry, 'index'>) => {
    setNotes((prev) => {
      if (prev.some((n) => n.id === e.id)) return prev;
      return [...prev, { ...e, index: prev.length + 1 }];
    });
  }, []);

  const value = useMemo<Ctx>(() => ({ notes, register }), [notes, register]);

  return (
    <FootnoteContext.Provider value={value}>
      {children}
    </FootnoteContext.Provider>
  );
}

export function useFootnotes(): Ctx {
  const ctx = useContext(FootnoteContext);
  if (!ctx) {
    return { notes: [], register: () => {} };
  }
  return ctx;
}
