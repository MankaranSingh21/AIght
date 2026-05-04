"use client";

import { useState } from "react";
import Link from "next/link";
import { usePostHog } from "posthog-js/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type UseCase = {
  audience: string;
  headline: string;
  description: string;
};

export type PricingDetail = {
  free_tier: string;
  cliff: string;
  paid_monthly: string;
  last_verified: string;
};

export type Alternative = {
  slug: string;
  name: string;
  reason: string;
};

export type ToolDetailData = {
  name: string;
  slug: string;
  tagline: string;
  category: string;
  pricing: "Free" | "Open Source" | "Paid" | "Freemium";
  url?: string | null;
  tags: string[];
  useCases: [UseCase, UseCase];
  video_url?: string | null;
  learning_guide?: string | null;
  related_concepts?: string[];
  weaknesses?: string[];
  status?: "stable" | "beta" | "rising" | "deprecated";
  deprecated_reason?: string | null;
  pricing_detail?: PricingDetail | null;
  alternatives?: Alternative[];
  utility_score?: number;
  privacy_score?: number;
  speed_score?: number;
  cost_score?: number;
  transparency_score?: number;
  risk_level?: "Low" | "Medium" | "High";
  is_open_source?: boolean;
  updated_at?: string;
};

function ScoreAxis({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-end">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted">{label}</span>
        <span className="font-sans text-sm font-bold text-primary">{score}</span>
      </div>
      <div className="h-1.5 w-full bg-primary/5 rounded-full overflow-hidden border border-primary/5">
        <div 
          className="h-full rounded-full transition-all duration-1000 ease-out" 
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function getYouTubeEmbedUrl(url: string): string {
  if (url.includes("youtube.com/embed/")) return url;
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  const longMatch = url.match(/youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/)([a-zA-Z0-9_-]{11})/);
  if (longMatch) return `https://www.youtube.com/embed/${longMatch[1]}`;
  return url;
}

export default function ToolDetail({ tool }: { tool: ToolDetailData }) {
  const posthog = usePostHog();
  const aightScore = Math.round(
    ((tool.utility_score || 0) + (tool.privacy_score || 0) + (tool.speed_score || 0) + (tool.cost_score || 0) + (tool.transparency_score || 0)) / 5
  );

  const dateStr = tool.updated_at ? new Date(tool.updated_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : null;

  return (
    <main className="min-h-screen bg-page">
      <div className="max-w-[1000px] mx-auto px-6 md:px-12 py-16 flex flex-col gap-20">

        {/* Navigation / Meta */}
        <div className="flex flex-col gap-8">
          <Link
            href="/tools"
            className="font-sans text-xs text-muted hover:text-primary transition-colors no-underline flex items-center gap-2 w-fit"
          >
            ← Back to archive
          </Link>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-accent px-2 py-1 rounded bg-accent/5 border border-accent/10">
                {tool.category}
              </span>
              {dateStr && (
                <span className="font-mono text-[10px] text-muted uppercase tracking-widest">
                  Last Updated: {dateStr}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="flex flex-col gap-2">
                <h1 className="font-display text-5xl md:text-7xl font-black text-primary tracking-tight m-0">
                  {tool.name}
                </h1>
                <p className="font-serif italic text-xl md:text-2xl text-secondary max-w-[32ch] leading-snug">
                  {tool.tagline}
                </p>
              </div>

              {aightScore > 0 && (
                <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-surface border border-emphasis shadow-[0_0_40px_rgba(170,255,77,0.05)]">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted mb-1">AIght Score</span>
                  <span className="font-display text-5xl font-black text-accent">{aightScore}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Scoring Breakdown & Quick Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Scoring */}
          <div className="lg:col-span-2 flex flex-col gap-10 bg-surface/30 p-8 rounded-2xl border border-primary/5">
            <h2 className="font-display text-2xl font-bold text-primary tracking-tight m-0">Scoring Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ScoreAxis label="Utility" score={tool.utility_score || 0} color="var(--accent-primary)" />
              <ScoreAxis label="Privacy" score={tool.privacy_score || 0} color="#00FFD1" />
              <ScoreAxis label="Speed" score={tool.speed_score || 0} color="#FFD100" />
              <ScoreAxis label="Cost" score={tool.cost_score || 0} color="#B088FF" />
              <ScoreAxis label="Transparency" score={tool.transparency_score || 0} color="var(--accent-warm)" />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-col gap-6">
             <div className="flex flex-col gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted">Pricing</span>
                <span className="font-sans font-bold text-primary">{tool.pricing}</span>
             </div>
             <div className="flex flex-col gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted">Risk Level</span>
                <span className={cn(
                  "font-sans font-bold",
                  tool.risk_level === 'High' ? "text-danger" : tool.risk_level === 'Medium' ? "text-warm" : "text-accent"
                )}>{tool.risk_level}</span>
             </div>
             <div className="flex flex-col gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted">Licensing</span>
                <span className="font-sans font-bold text-primary">{tool.is_open_source ? 'Open Source' : 'Proprietary'}</span>
             </div>
             {tool.url && (
                <a 
                  href={tool.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-primary w-full text-center py-4 mt-4"
                  onClick={() => posthog?.capture("tool_visit_detail", { slug: tool.slug })}
                >
                  Visit {tool.name} →
                </a>
             )}
          </div>
        </div>

        {/* Video / Interactive */}
        <section>
          {tool.video_url ? (
            <div className="aspect-video w-full rounded-2xl overflow-hidden border border-primary/10 shadow-2xl bg-surface">
              <iframe
                src={getYouTubeEmbedUrl(tool.video_url)}
                title={`${tool.name} walkthrough`}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="aspect-video w-full rounded-2xl border border-primary/5 bg-surface/30 flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center text-muted border border-primary/5">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                   <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted">Video walkthrough coming soon</p>
            </div>
          )}
        </section>

        {/* Editorial Context */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
          {/* Use Cases */}
          <section className="flex flex-col gap-8">
            <h2 className="font-display text-3xl font-bold text-primary tracking-tight">Who it&apos;s for</h2>
            <div className="flex flex-col gap-6">
              {tool.useCases.map((uc, i) => (
                <div key={i} className="flex flex-col gap-3 p-6 rounded-xl bg-surface/20 border border-primary/5">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-accent">{uc.audience}</span>
                  <h3 className="font-sans text-lg font-bold text-primary leading-tight">{uc.headline}</h3>
                  <p className="font-editorial text-sm text-secondary leading-relaxed">{uc.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Pros & Cons */}
          <section className="flex flex-col gap-8">
            <h2 className="font-display text-3xl font-bold text-primary tracking-tight">The Assessment</h2>
            
            <div className="flex flex-col gap-10">
              {/* Pros derived from tags */}
              <div className="flex flex-col gap-4">
                <span className="font-mono text-[10px] uppercase tracking-widest text-accent">Strengths</span>
                <ul className="list-none p-0 m-0 flex flex-col gap-3">
                  {tool.tags.slice(0, 4).map((tag, i) => (
                    <li key={i} className="flex items-center gap-3 text-secondary font-editorial text-base">
                      <span className="text-accent">✓</span> {tag.charAt(0).toUpperCase() + tag.slice(1)}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons (Weaknesses) */}
              {tool.weaknesses && tool.weaknesses.length > 0 && (
                <div className="flex flex-col gap-4">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-danger">Friction Points</span>
                  <ul className="list-none p-0 m-0 flex flex-col gap-3">
                    {tool.weaknesses.map((w, i) => (
                      <li key={i} className="flex items-start gap-3 text-secondary font-editorial text-base">
                        <span className="text-danger mt-1">×</span> {w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Pricing Detail */}
        {tool.pricing_detail && (
          <section className="bg-surface/30 p-8 md:p-12 rounded-2xl border border-primary/5 flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted">Economics</span>
              <h2 className="font-display text-3xl font-bold text-primary tracking-tight m-0">The pricing reality</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               <div className="flex flex-col gap-3">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-accent">The Free Tier</span>
                  <p className="font-editorial text-sm text-secondary leading-relaxed m-0">{tool.pricing_detail.free_tier}</p>
               </div>
               <div className="flex flex-col gap-3">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-warm">The Cliff</span>
                  <p className="font-editorial text-sm text-secondary leading-relaxed m-0">{tool.pricing_detail.cliff}</p>
               </div>
               <div className="flex flex-col gap-3">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-muted">Monthly Cost</span>
                  <p className="font-editorial text-sm text-secondary leading-relaxed m-0">{tool.pricing_detail.paid_monthly}</p>
               </div>
            </div>
          </section>
        )}

        {/* Learning Guide */}
        {tool.learning_guide && (
          <section className="flex flex-col gap-8">
            <h2 className="font-display text-3xl font-bold text-primary tracking-tight">The Signal Guide</h2>
            <div className="prose prose-invert max-w-none font-editorial text-lg text-secondary leading-loose bg-surface p-8 md:p-12 rounded-2xl border border-emphasis">
               {tool.learning_guide.split('\n\n').map((para, i) => <p key={i} className="mb-6">{para}</p>)}
            </div>
          </section>
        )}

        {/* Alternatives */}
        {tool.alternatives && tool.alternatives.length > 0 && (
          <section className="flex flex-col gap-8 pt-20 border-t border-primary/5">
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted">If this doesn&apos;t click</span>
              <h2 className="font-display text-3xl font-bold text-primary tracking-tight">Recommended Alternatives</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tool.alternatives.map((alt) => (
                <Link
                  key={alt.slug}
                  href={`/tool/${alt.slug}`}
                  className="p-6 rounded-xl bg-surface/30 border border-primary/5 hover:border-accent/30 transition-all no-underline flex flex-col gap-2"
                >
                  <span className="font-sans font-bold text-accent">{alt.name}</span>
                  <p className="font-editorial text-sm text-secondary m-0 italic">“{alt.reason}”</p>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}
