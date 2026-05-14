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

// ── Radar Chart ────────────────────────────────────────────────────────────────

const AXES = [
  { label: "Utility",      color: "#AAFF4D" },
  { label: "Privacy",      color: "#00FFD1" },
  { label: "Speed",        color: "#FFD100" },
  { label: "Cost",         color: "#B088FF" },
  { label: "Transparency", color: "#F4AB1F" },
];

function radarPoint(angle: number, r: number, cx = 100, cy = 100) {
  const rad = (angle - 90) * (Math.PI / 180);
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)] as [number, number];
}

function RadarChart({ scores }: { scores: number[] }) {
  const maxR = 72;
  const cx = 100, cy = 100;
  const n = 5;
  const angles = Array.from({ length: n }, (_, i) => (360 / n) * i);

  // Grid rings
  const rings = [0.25, 0.5, 0.75, 1].map((t) =>
    angles.map((a) => radarPoint(a, maxR * t, cx, cy)).map((p) => p.join(",")).join(" ")
  );

  // Axis lines
  const axisLines = angles.map((a) => {
    const [x, y] = radarPoint(a, maxR, cx, cy);
    return { x, y };
  });

  // Score polygon — scores are 0–100, normalize to 0–1
  const scorePoints = scores.map((s, i) => radarPoint(angles[i], (s / 100) * maxR, cx, cy));
  const polygon = scorePoints.map((p) => p.join(",")).join(" ");

  // Label positions (slightly outside)
  const labels = angles.map((a, i) => {
    const [x, y] = radarPoint(a, maxR + 18, cx, cy);
    return { x, y, label: AXES[i].label, color: AXES[i].color, score: scores[i] };
  });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap" }}>
      <svg viewBox="0 0 200 200" width={200} height={200} style={{ flexShrink: 0, overflow: "visible" }}>
        {/* Grid rings */}
        {rings.map((pts, i) => (
          <polygon key={i} points={pts} fill="none" stroke="rgba(245,239,224,0.07)" strokeWidth={1} />
        ))}
        {/* Axis lines */}
        {axisLines.map(({ x, y }, i) => (
          <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(245,239,224,0.07)" strokeWidth={1} />
        ))}
        {/* Score polygon */}
        <polygon
          points={polygon}
          fill="rgba(170,255,77,0.12)"
          stroke="#AAFF4D"
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        {/* Vertex dots */}
        {scorePoints.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={3} fill={AXES[i].color} />
        ))}
      </svg>

      {/* Legend */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {labels.map(({ label, color, score }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(245,239,224,0.50)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
              {label}
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color, marginLeft: "auto", minWidth: 24, textAlign: "right" }}>
              {score.toFixed(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Start Here step flow ───────────────────────────────────────────────────────

function parseSteps(guide: string): { title: string; body: string }[] {
  const sections = guide.split(/\n##\s+/).filter(Boolean);
  if (sections.length < 2) return [];
  return sections.slice(0, 3).map((s) => {
    const lines = s.trim().split("\n");
    const title = lines[0].replace(/^#+\s*/, "").trim();
    const body = lines.slice(1).join(" ").trim().replace(/\*\*/g, "").slice(0, 120);
    return { title, body: body + (body.length === 120 ? "…" : "") };
  });
}

function StartHereFlow({ guide }: { guide: string }) {
  const steps = parseSteps(guide);
  if (steps.length === 0) return null;

  return (
    <div style={{ marginBottom: 0 }}>
      <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(245,239,224,0.30)", marginBottom: 20 }}>
        Start here
      </p>
      <div style={{ display: "flex", gap: 0, flexWrap: "wrap" }}>
        {steps.map((step, i) => (
          <div key={i} style={{ display: "flex", alignItems: "stretch", flex: 1, minWidth: 200 }}>
            <div style={{
              flex: 1,
              padding: "20px 24px",
              borderRadius: i === 0 ? "12px 0 0 12px" : i === steps.length - 1 ? "0 12px 12px 0" : 0,
              border: "1px solid rgba(245,239,224,0.08)",
              borderLeft: i > 0 ? "none" : "1px solid rgba(245,239,224,0.08)",
              background: i === 0 ? "rgba(170,255,77,0.04)" : "rgba(255,250,240,0.02)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{
                  width: 22, height: 22, borderRadius: "50%",
                  background: i === 0 ? "#AAFF4D" : "rgba(245,239,224,0.10)",
                  color: i === 0 ? "#0C0A08" : "rgba(245,239,224,0.50)",
                  fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  {i + 1}
                </span>
                <p style={{ fontFamily: "var(--font-ui)", fontSize: 13, fontWeight: 600, color: "#F5EFE0", margin: 0, letterSpacing: "-0.01em", lineHeight: 1.3 }}>
                  {step.title}
                </p>
              </div>
              {step.body && (
                <p style={{ fontFamily: "var(--font-editorial)", fontStyle: "italic", fontSize: 12, color: "rgba(245,239,224,0.45)", margin: 0, lineHeight: 1.6, paddingLeft: 32 }}>
                  {step.body}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Alternatives comparison table ──────────────────────────────────────────────

function AlternativesTable({ tool, alternatives }: { tool: ToolDetailData; alternatives: Alternative[] }) {
  const cols = [
    { name: tool.name, slug: tool.slug, pricing: tool.pricing, bestFor: tool.tags[0] ?? tool.category, risk: tool.risk_level ?? "—", isThis: true },
    ...alternatives.slice(0, 2).map((a) => ({
      name: a.name, slug: a.slug, pricing: "—", bestFor: a.reason.slice(0, 40), risk: "—", isThis: false,
    })),
  ];

  const rows = [
    { label: "Pricing",  key: "pricing" as const },
    { label: "Best for", key: "bestFor" as const },
    { label: "Risk",     key: "risk" as const },
  ];

  return (
    <div style={{
      borderRadius: 12, border: "1px solid rgba(245,239,224,0.08)",
      overflow: "hidden", background: "rgba(255,250,240,0.02)",
    }}>
      {/* Header row */}
      <div style={{ display: "grid", gridTemplateColumns: `120px repeat(${cols.length}, 1fr)`, borderBottom: "1px solid rgba(245,239,224,0.08)" }}>
        <div style={{ padding: "12px 16px" }} />
        {cols.map((col) => (
          <div key={col.slug} style={{ padding: "12px 16px", borderLeft: "1px solid rgba(245,239,224,0.06)" }}>
            {col.isThis ? (
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, color: "#AAFF4D", letterSpacing: "0.05em" }}>
                {col.name}
              </span>
            ) : (
              <Link href={`/tool/${col.slug}`} style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(245,239,224,0.50)", textDecoration: "none", letterSpacing: "0.05em" }}>
                {col.name}
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Data rows */}
      {rows.map(({ label, key }, ri) => (
        <div key={key} style={{
          display: "grid", gridTemplateColumns: `120px repeat(${cols.length}, 1fr)`,
          background: ri % 2 === 0 ? "transparent" : "rgba(255,250,240,0.015)",
          borderBottom: ri < rows.length - 1 ? "1px solid rgba(245,239,224,0.05)" : "none",
        }}>
          <div style={{ padding: "12px 16px" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(245,239,224,0.30)" }}>
              {label}
            </span>
          </div>
          {cols.map((col) => (
            <div key={col.slug} style={{ padding: "12px 16px", borderLeft: "1px solid rgba(245,239,224,0.06)" }}>
              <span style={{
                fontFamily: "var(--font-editorial)", fontSize: 13,
                color: col.isThis ? "rgba(245,239,224,0.80)" : "rgba(245,239,224,0.45)",
                fontStyle: key === "bestFor" ? "italic" : "normal",
              }}>
                {col[key]}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function getYouTubeEmbedUrl(url: string): string {
  if (url.includes("youtube.com/embed/")) return url;
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  const longMatch = url.match(/youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/)([a-zA-Z0-9_-]{11})/);
  if (longMatch) return `https://www.youtube.com/embed/${longMatch[1]}`;
  return url;
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function ToolDetail({ tool }: { tool: ToolDetailData }) {
  const posthog = usePostHog();
  const [, setHovered] = useState(false);

  const scores = [
    tool.utility_score || 0,
    tool.privacy_score || 0,
    tool.speed_score || 0,
    tool.cost_score || 0,
    tool.transparency_score || 0,
  ];
  const aightScore = Math.round(scores.reduce((a, b) => a + b, 0) / 5);
  const hasScores = scores.some((s) => s > 0);

  const dateStr = tool.updated_at
    ? new Date(tool.updated_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : null;

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

              {hasScores && aightScore > 0 && (
                <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-surface border border-emphasis shadow-[0_0_40px_rgba(170,255,77,0.05)]">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted mb-1">AIght Score</span>
                  <span className="font-display text-5xl font-black text-accent">{aightScore}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Radar + Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {hasScores ? (
            <div className="lg:col-span-2 flex flex-col gap-6 bg-surface/30 p-8 rounded-2xl border border-primary/5">
              <h2 className="font-display text-2xl font-bold text-primary tracking-tight m-0">Scoring Breakdown</h2>
              <RadarChart scores={scores} />
            </div>
          ) : (
            <div className="lg:col-span-2 flex flex-col gap-4 bg-surface/20 p-8 rounded-2xl border border-primary/5 justify-center items-start">
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(245,239,224,0.25)", margin: 0 }}>
                Scoring
              </p>
              <p style={{ fontFamily: "var(--font-editorial)", fontStyle: "italic", fontSize: 14, color: "rgba(245,239,224,0.40)", margin: 0, lineHeight: 1.7 }}>
                Detailed scoring for this tool is being reviewed and will be published soon.
              </p>
            </div>
          )}

          {/* Quick Stats */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted">Pricing</span>
              <span className="font-sans font-bold text-primary">{tool.pricing}</span>
            </div>
            {tool.risk_level && (
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted">Risk Level</span>
                <span className={cn(
                  "font-sans font-bold",
                  tool.risk_level === "High" ? "text-danger" : tool.risk_level === "Medium" ? "text-warm" : "text-accent"
                )}>{tool.risk_level}</span>
              </div>
            )}
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted">Licensing</span>
              <span className="font-sans font-bold text-primary">{tool.is_open_source ? "Open Source" : "Proprietary"}</span>
            </div>
            {tool.url && (
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full text-center py-4 mt-4"
                onClick={() => posthog?.capture("tool_visit_detail", { slug: tool.slug })}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
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

        {/* Start Here step flow — only if learning guide has ## sections */}
        {tool.learning_guide && (
          <StartHereFlow guide={tool.learning_guide} />
        )}

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
              {tool.learning_guide.split("\n\n").map((para, i) => <p key={i} className="mb-6">{para}</p>)}
            </div>
          </section>
        )}

        {/* Alternatives */}
        {tool.alternatives && tool.alternatives.length > 0 && (
          <section className="flex flex-col gap-8 pt-20 border-t border-primary/5">
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted">If this doesn&apos;t click</span>
              <h2 className="font-display text-3xl font-bold text-primary tracking-tight">Alternatives</h2>
            </div>

            {tool.alternatives.length >= 2 ? (
              <AlternativesTable tool={tool} alternatives={tool.alternatives} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tool.alternatives.map((alt) => (
                  <Link
                    key={alt.slug}
                    href={`/tool/${alt.slug}`}
                    className="p-6 rounded-xl bg-surface/30 border border-primary/5 hover:border-accent/30 transition-all no-underline flex flex-col gap-2"
                  >
                    <span className="font-sans font-bold text-accent">{alt.name}</span>
                    <p className="font-editorial text-sm text-secondary m-0 italic">&ldquo;{alt.reason}&rdquo;</p>
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}

      </div>
    </main>
  );
}
