'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import fields from "@/content/paths/fields.json";
import type { HeroTool } from './HeroWidgets';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const HeroWidgets = dynamic(() => import('./HeroWidgets'), { ssr: false });

interface MousePos { x: number; y: number; }

export default function Hero({ heroTools }: { heroTools?: HeroTool[] }) {
  const [mouse, setMouse] = useState<MousePos>({ x: 0.5, y: 0.5 });
  const [revealed, setRevealed] = useState(false);

  const STATS = [
    { num: '60+',  label: 'Curated tools'   },
    { num: fields.length.toString(), label: 'Fields covered'  },
    { num: '0',    label: 'Affiliate links' },
  ];

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 100);
    return () => clearTimeout(t);
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setMouse({
      x: (e.clientX - r.left) / r.width,
      y: (e.clientY - r.top)  / r.height,
    });
  }, []);

  const getLineClass = (revealed: boolean) => 
    cn(
      "transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
      revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[18px]"
    );

  return (
    <section
      onMouseMove={onMouseMove}
      className="relative overflow-hidden pt-24 md:pt-32 pb-20 px-6 md:px-12 max-w-content mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-10 items-center">

        {/* LEFT — copy */}
        <div className="flex flex-col">

          {/* Eyebrow pill */}
          <div 
            className={getLineClass(revealed)}
            style={{ transitionDelay: '0ms' }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-glow border border-accent/20 mb-7">
              <span className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_6px_var(--accent-primary)] animate-[pulse-dot_2s_infinite] shrink-0" />
              <span className="font-sans text-[11px] font-semibold tracking-widest uppercase text-accent">
                Ruthlessly curated. No affiliate links.
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="m-0 mb-6 leading-[1.05]">
            <span 
              className={cn("block font-display text-[44px] md:text-[5.5vw] lg:text-7xl font-black text-primary tracking-tight", getLineClass(revealed))}
              style={{ transitionDelay: '80ms' }}
            >
              The signal
            </span>
            <span 
              className={cn("block font-display text-[44px] md:text-[5.5vw] lg:text-7xl font-black italic text-accent tracking-tight", getLineClass(revealed))}
              style={{ transitionDelay: '180ms' }}
            >
              beneath
            </span>
            <span 
              className={cn("block font-display text-[44px] md:text-[5.5vw] lg:text-7xl font-light text-primary/20 tracking-tight", getLineClass(revealed))}
              style={{ transitionDelay: '280ms' }}
            >
              the noise.
            </span>
          </h1>

          {/* Body */}
          <p 
            className={cn(
              "font-serif text-[17px] leading-relaxed text-secondary max-w-[44ch] mb-9",
              getLineClass(revealed)
            )}
            style={{ transitionDelay: '360ms' }}
          >
            A literary, anti-hype archive of AI tools worth your attention. 
            We do the deep dives so you don&apos;t have to. No sponsored rankings, 
            no hustle energy—just honest signal.
          </p>

          {/* CTAs */}
          <div 
            className={cn("flex flex-wrap gap-3 mb-12", getLineClass(revealed))}
            style={{ transitionDelay: '440ms' }}
          >
            <Link href="/tools" className="btn-primary">
              Explore tools →
            </Link>
            <Link href="/learn/paths/quiz" className="btn-ghost">
              See what&apos;s relevant
            </Link>
          </div>

          {/* Stats strip */}
          <div 
            className={cn(
              "flex gap-8 pt-6 border-t border-primary/10",
              getLineClass(revealed)
            )}
            style={{ transitionDelay: '520ms' }}
          >
            {STATS.map(({ num, label }) => (
              <div key={label}>
                <div className="font-display text-2xl font-bold text-primary mb-1">
                  {num}
                </div>
                <div className="font-sans text-[11px] font-medium tracking-wider uppercase text-muted">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — floating widgets */}
        <div className="relative hidden lg:block">
          <HeroWidgets mouse={mouse} tools={heroTools} />
        </div>
      </div>
    </section>
  );
}
