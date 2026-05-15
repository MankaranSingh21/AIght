'use client';

import { useEffect, useState } from 'react';

type Heading = { id: string; text: string };

// Scans the document for H2s inside `.editorial-main` after mount, builds a
// table of contents, and uses IntersectionObserver to highlight the active
// section. Sticky at top of the left gutter on desktop; collapses into a
// <details> on mobile (rendered separately).
export default function StickyTOC() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const main = document.querySelector('.editorial-main');
    if (!main) return;

    // Slugify H2 text → id if H2 doesn't already have one
    const h2s = Array.from(main.querySelectorAll<HTMLHeadingElement>('h2'));
    const list: Heading[] = h2s.map((h) => {
      if (!h.id) {
        const text = h.textContent ?? '';
        h.id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
      // Ensure smooth scroll target sits below sticky progress bar
      h.style.scrollMarginTop = '80px';
      return { id: h.id, text: h.textContent ?? '' };
    });
    setHeadings(list);
    if (list[0]) setActiveId(list[0].id);

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the topmost intersecting heading
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-15% 0px -65% 0px', threshold: 0 },
    );
    h2s.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="On this page" style={{ position: 'sticky', top: 100 }}>
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'rgba(245,239,224,0.30)',
          margin: '0 0 14px',
        }}
      >
        On this page
      </p>
      <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {headings.map((h) => {
          const isActive = h.id === activeId;
          return (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 8,
                  padding: '4px 0',
                  fontFamily: 'var(--font-ui)',
                  fontSize: 12,
                  lineHeight: 1.45,
                  color: isActive ? 'var(--accent-primary)' : 'rgba(245,239,224,0.45)',
                  textDecoration: 'none',
                  transition: 'color 180ms ease',
                }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    width: 4,
                    height: 4,
                    borderRadius: 999,
                    marginTop: 7,
                    background: isActive ? 'var(--accent-primary)' : 'rgba(245,239,224,0.18)',
                    boxShadow: isActive ? '0 0 8px var(--accent-primary)' : 'none',
                    transition: 'background 180ms ease, box-shadow 180ms ease',
                  }}
                />
                <span>{h.text}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
