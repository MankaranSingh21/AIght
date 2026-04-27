'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/learn',  label: 'Learn'  },
  { href: '/tools',  label: 'Tools'  },
  { href: '/signal', label: 'Signal' },
  { href: '/learn/paths/quiz', label: 'Quiz' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav style={{
      height: 64,
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: scrolled ? 'rgba(12,10,8,0.90)' : 'transparent',
      backdropFilter: scrolled ? 'blur(24px)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(245,239,224,0.07)' : '1px solid transparent',
      transition: 'background 300ms ease, border-color 300ms ease, backdrop-filter 300ms ease',
    }}>
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '0 48px',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
      }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 20,
            fontWeight: 700,
            color: '#F5EFE0',
            letterSpacing: '-0.02em',
            lineHeight: 1,
          }}>
            AI
          </span>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 20,
            fontWeight: 700,
            color: '#AAFF4D',
            letterSpacing: '-0.02em',
            lineHeight: 1,
          }}>
            ght
          </span>
          <span className="logo-cursor" style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 18,
            fontWeight: 500,
            color: '#AAFF4D',
            marginLeft: 1,
          }}>_</span>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: 13,
                  fontWeight: 500,
                  color: active ? '#AAFF4D' : 'rgba(245,239,224,0.55)',
                  textDecoration: 'none',
                  padding: '6px 14px',
                  borderRadius: 8,
                  transition: 'color 150ms ease, background 150ms ease',
                  background: active ? 'rgba(170,255,77,0.07)' : 'transparent',
                }}
                onMouseEnter={e => {
                  if (!active) (e.currentTarget as HTMLAnchorElement).style.color = '#F5EFE0';
                }}
                onMouseLeave={e => {
                  if (!active) (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(245,239,224,0.55)';
                }}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* Search pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '7px 14px',
          borderRadius: 9999,
          background: 'rgba(245,239,224,0.04)',
          border: '1px solid rgba(245,239,224,0.09)',
          width: 168,
          cursor: 'text',
          transition: 'border-color 150ms ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(245,239,224,0.16)')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(245,239,224,0.09)')}
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
            <circle cx="7" cy="7" r="5.5" stroke="rgba(245,239,224,0.30)" strokeWidth="1.5" />
            <path d="M11.5 11.5L14 14" stroke="rgba(245,239,224,0.30)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 12,
            color: 'rgba(245,239,224,0.25)',
            flex: 1,
          }}>
            Search tools…
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'rgba(245,239,224,0.20)',
            padding: '1px 5px',
            borderRadius: 4,
            border: '1px solid rgba(245,239,224,0.12)',
            lineHeight: 1.4,
          }}>
            ⌘K
          </span>
        </div>

      </div>
    </nav>
  );
}
