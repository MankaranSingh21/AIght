'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const NAV_LINKS = [
  { href: '/',           label: 'Home'      },
  { href: '/tools',      label: 'Tools'     },
  { href: '/learn',      label: 'Learn'     },
  { href: '/learn/paths', label: 'Fields'   },
  { href: '/signal',     label: 'Signal'    },
  { href: '/about',      label: 'About'     },
];

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
      <nav className={cn(
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
            <span className="font-display text-xl font-bold text-primary tracking-tight leading-none">
              AI
            </span>
            <span className="font-display text-xl font-bold text-accent tracking-tight leading-none">
              ght
            </span>
            <span className="logo-cursor font-mono text-lg font-medium text-accent ml-0.5">_</span>
          </Link>

          {/* Nav links — hidden on very small screens */}
          <div className="hidden sm:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => {
              const active = href === '/' 
                ? pathname === '/' 
                : pathname === href || pathname.startsWith(href + '/');
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "font-sans text-[13px] font-medium no-underline px-3.5 py-1.5 rounded-lg transition-all duration-150 whitespace-nowrap",
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

          <div className="flex items-center gap-3 ml-auto sm:ml-0">
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
                type="text"
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Search..."
                className="font-sans text-xs color-primary bg-transparent border-none outline-none flex-1 min-w-0"
              />
            </form>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[49] bg-page/95 backdrop-blur-xl sm:hidden flex flex-col pt-24 px-8 gap-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col gap-4">
            {NAV_LINKS.map(({ href, label }) => {
              const active = href === '/' 
                ? pathname === '/' 
                : pathname === href || pathname.startsWith(href + '/');
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

          <div className="mt-auto pb-12">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-4">Search AIght</p>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder="Find a tool, concept, or field..."
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
