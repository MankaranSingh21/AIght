'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import StreakChip from '@/components/progress/StreakChip';

// Desktop nav drops Home — the logo serves that role. Mobile menu shows
// the full set including Home for users who don't know the logo is clickable.
// Desktop nav at 7 slots. Compare and Universe are first-class — they were
// the two routes flagged as orphans in the recent IA audit. About moves to
// footer-only (it's already in NAV_LINKS there) so we stay under 8.
const DESKTOP_NAV = [
  { href: '/tools',       label: 'Tools'     },
  { href: '/compare',     label: 'Compare'   },
  { href: '/learn',       label: 'Learn'     },
  { href: '/learn/map',   label: 'Universe'  },
  { href: '/workflows',   label: 'Workflows' },
  { href: '/signal',      label: 'Signal'    },
  { href: '/human',       label: 'Human'     },
];

// Mobile menu shows everything the desktop dropped: Home, Fields, Progress, About.
const MOBILE_NAV = [
  { href: '/',            label: 'Home'      },
  ...DESKTOP_NAV,
  { href: '/learn/paths', label: 'Fields'    },
  { href: '/you',         label: 'Progress'  },
  { href: '/review',      label: 'Review'    },
  { href: '/about',       label: 'About'     },
];

const QUIZ_HREF = '/learn/paths/quiz';

const STORAGE_KEY = 'aight_bookmarks';

function getBookmarkCount(): number {
  if (typeof window === 'undefined') return 0;
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]').length;
  } catch {
    return 0;
  }
}

export default function Navbar() {
  const [scrolled, setScrolled]           = useState(false);
  const [searchVal, setSearchVal]         = useState('');
  const [searchFocused, setFocused]       = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchInputRef                    = useRef<HTMLInputElement>(null);
  const pathname                          = usePathname();
  const router                            = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setBookmarkCount(getBookmarkCount());
    const sync = () => setBookmarkCount(getBookmarkCount());
    window.addEventListener('storage', sync);
    window.addEventListener('aight_bookmarks_changed', sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('aight_bookmarks_changed', sync);
    };
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = searchVal.trim();
    router.push(q ? `/tools?q=${encodeURIComponent(q)}` : '/tools');
    setSearchVal('');
    searchInputRef.current?.blur();
  }

  return (
    <>
      <nav
        aria-label="Main navigation"
        className={cn(
        "h-16 sticky top-0 z-50 transition-all duration-300 ease-in-out",
        scrolled
          ? "bg-page/90 backdrop-blur-2xl border-b border-primary/10"
          : "bg-transparent border-b border-transparent"
      )}>
        <div className="max-w-content mx-auto px-4 md:px-12 h-full flex items-center justify-between gap-4">

          {/* Mobile Hamburger Toggle */}
          <button 
            className="flex sm:hidden items-center justify-center w-10 h-10 text-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            )}
          </button>

          {/* Logo */}
          <Link href="/" className="no-underline shrink-0 flex items-center">
            <span className="font-mono text-xl font-medium text-primary leading-none">
              AI
            </span>
            <span className="font-mono text-xl font-medium text-accent leading-none">
              ght
            </span>
            <span className="logo-cursor font-mono text-xl font-medium text-accent ml-0.5">_</span>
          </Link>

          {/* Nav links — hidden on very small screens. Tight gap to fit 7 items + CTA. */}
          <div className="hidden sm:flex items-center gap-0.5">
            {DESKTOP_NAV.map(({ href, label }) => {
              // Longest-prefix match prevents /learn highlighting when on /learn/map or /learn/paths.
              const matchingHrefs = DESKTOP_NAV
                .map((n) => n.href)
                .filter((h) => pathname === h || pathname.startsWith(h + '/'));
              const longest = matchingHrefs.sort((a, b) => b.length - a.length)[0];
              const active = href === longest;
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "font-sans text-[13px] font-medium no-underline px-2.5 lg:px-3 py-1.5 rounded-lg transition-all duration-150 whitespace-nowrap",
                    active
                      ? "text-accent bg-accent/10"
                      : "text-secondary hover:text-primary"
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2.5 ml-auto sm:ml-0">
            {/* Learning progress — level ring + streak; hidden until first XP */}
            <span className="hidden lg:inline-flex">
              <StreakChip />
            </span>

            {/* Take-the-quiz CTA — primary action, visible md+ to avoid crowding. */}
            <Link
              href={QUIZ_HREF}
              className={cn(
                "hidden md:inline-flex items-center gap-1.5 font-sans text-[12px] font-semibold no-underline px-3 py-1.5 rounded-full whitespace-nowrap transition-all duration-150",
                pathname.startsWith(QUIZ_HREF)
                  ? "bg-accent text-page"
                  : "bg-accent/12 text-accent border border-accent/30 hover:bg-accent/20"
              )}
            >
              <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zm0 3.5a1 1 0 0 1 1 1v2.586l1.707 1.707a1 1 0 0 1-1.414 1.414L7.293 9.5A1 1 0 0 1 7 8.793V6a1 1 0 0 1 1-1z" />
              </svg>
              Take the quiz
            </Link>

            {/* Bookmark icon link */}
            <Link
              href="/bookmarks"
              aria-label="Saved tools"
              className={cn(
                "relative flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150 shrink-0",
                pathname === '/bookmarks' 
                  ? "text-accent bg-accent/10" 
                  : "text-muted/60 hover:text-primary"
              )}
            >
              {pathname === '/bookmarks' ? (
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M3 2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v12.5a.5.5 0 0 1-.777.416L8 12.101l-4.223 2.815A.5.5 0 0 1 3 14.5V2z"/>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v12.5a.5.5 0 0 1-.777.416L8 12.101l-4.223 2.815A.5.5 0 0 1 3 14.5V2z"/>
                </svg>
              )}
              {bookmarkCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[14px] h-3.5 rounded-full bg-accent text-page font-mono text-[8px] font-bold flex items-center justify-center px-1 leading-none">
                  {bookmarkCount > 99 ? '99+' : bookmarkCount}
                </span>
              )}
            </Link>

            {/* Search pill — functional search input */}
            <form
              onSubmit={handleSearchSubmit}
              className={cn(
                "hidden xs:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/[0.04] border transition-all duration-150 w-32 sm:w-40 md:w-48",
                searchFocused ? "border-accent/30" : "border-primary/10"
              )}
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="shrink-0">
                <circle cx="7" cy="7" r="5.5" stroke={searchFocused ? 'rgba(170,255,77,0.55)' : 'rgba(245,239,224,0.30)'} strokeWidth="1.5" />
                <path d="M11.5 11.5L14 14" stroke={searchFocused ? 'rgba(170,255,77,0.55)' : 'rgba(245,239,224,0.30)'} strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                ref={searchInputRef}
                type="search"
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Search..."
                aria-label="Search AIght tools"
                className="font-sans text-xs color-primary bg-transparent border-none outline-none flex-1 min-w-0"
              />
            </form>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[49] bg-page/95 backdrop-blur-xl sm:hidden flex flex-col pt-24 px-8 gap-6 animate-in fade-in slide-in-from-top-4 duration-300 overflow-y-auto">
          <div className="flex flex-col gap-3.5">
            {MOBILE_NAV.map(({ href, label }) => {
              const matchingHrefs = MOBILE_NAV
                .map((n) => n.href)
                .filter((h) => h === '/' ? pathname === '/' : pathname === h || pathname.startsWith(h + '/'));
              const longest = matchingHrefs.sort((a, b) => b.length - a.length)[0];
              const active = href === longest;
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "font-display text-3xl font-bold no-underline transition-all duration-150",
                    active ? "text-accent" : "text-primary"
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Prominent Quiz CTA */}
          <Link
            href={QUIZ_HREF}
            className="inline-flex items-center justify-center gap-2 mt-2 px-5 py-4 rounded-2xl bg-accent text-page font-sans text-base font-semibold no-underline"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
              <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zm0 3.5a1 1 0 0 1 1 1v2.586l1.707 1.707a1 1 0 0 1-1.414 1.414L7.293 9.5A1 1 0 0 1 7 8.793V6a1 1 0 0 1 1-1z" />
            </svg>
            Take the quiz
          </Link>

          <div className="mt-auto pb-12">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-4">Search AIght</p>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="search"
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder="Find a tool, concept, or field..."
                aria-label="Search AIght tools, concepts, or fields"
                className="w-full bg-primary/5 border border-primary/10 rounded-xl px-4 py-4 font-sans text-lg text-primary outline-none focus:border-accent/30 transition-all"
              />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-accent">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
