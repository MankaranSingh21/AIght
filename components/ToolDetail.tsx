"use client";

import { useState } from "react";
import Link from "next/link";
import { usePostHog } from "posthog-js/react";

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
};

function getYouTubeEmbedUrl(url: string): string {
  if (url.includes("youtube.com/embed/")) return url;
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  const longMatch = url.match(/youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/)([a-zA-Z0-9_-]{11})/);
  if (longMatch) return `https://www.youtube.com/embed/${longMatch[1]}`;
  return url;
}

function statusStyle(status: NonNullable<ToolDetailData["status"]>): React.CSSProperties {
  if (status === "rising") {
    return { background: 'rgba(170,255,77,0.10)', color: '#AAFF4D', border: '1px solid rgba(170,255,77,0.25)', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.08em', padding: '2px 8px', borderRadius: 4, display: 'inline-flex', alignItems: 'center' };
  }
  if (status === "beta") {
    return { background: 'rgba(244,171,31,0.10)', color: 'var(--accent-warm)', border: '1px solid rgba(244,171,31,0.25)', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.08em', padding: '2px 8px', borderRadius: 4, display: 'inline-flex', alignItems: 'center' };
  }
  if (status === "deprecated") {
    return { background: 'rgba(224,112,112,0.10)', color: 'var(--error)', border: '1px solid rgba(224,112,112,0.25)', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.08em', padding: '2px 8px', borderRadius: 4, display: 'inline-flex', alignItems: 'center' };
  }
  return {};
}

const STATUS_LABEL: Record<string, string> = {
  rising: "Rising ↑",
  beta: "Beta",
  deprecated: "Deprecated",
};

function pricingStyle(pricing: ToolDetailData["pricing"]): React.CSSProperties {
  if (pricing === "Free" || pricing === "Open Source") {
    return { background: 'rgba(170,255,77,0.10)', color: '#AAFF4D', border: '1px solid rgba(170,255,77,0.25)', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.08em', padding: '2px 8px', borderRadius: 4, display: 'inline-flex', alignItems: 'center' };
  }
  if (pricing === "Freemium") {
    return { background: 'rgba(244,171,31,0.10)', color: 'var(--accent-warm)', border: '1px solid rgba(244,171,31,0.25)', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.08em', padding: '2px 8px', borderRadius: 4, display: 'inline-flex', alignItems: 'center' };
  }
  return { background: 'rgba(245,239,224,0.05)', color: 'rgba(245,239,224,0.45)', border: '1px solid rgba(245,239,224,0.10)', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.08em', padding: '2px 8px', borderRadius: 4, display: 'inline-flex', alignItems: 'center' };
}

function UseCaseCard({ useCase }: { useCase: UseCase }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: 14,
        border: `1px solid ${hov ? 'rgba(170,255,77,0.20)' : 'rgba(245,239,224,0.07)'}`,
        background: hov ? 'rgba(255,250,240,0.06)' : 'rgba(255,250,240,0.03)',
        backdropFilter: 'blur(20px)',
        overflow: 'hidden',
        transform: hov ? 'translateY(-2px)' : 'none',
        transition: 'all 220ms ease',
      }}
    >
      <div style={{ background: 'rgba(245,239,224,0.03)', padding: '24px 28px 20px' }}>
        <div style={{ marginBottom: 12 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.09em', textTransform: 'uppercase', padding: '2px 10px', borderRadius: 4, background: '#AAFF4D', color: '#0C0A08', fontWeight: 700 }}>
            {useCase.audience}
          </span>
        </div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: '#F5EFE0', letterSpacing: '-0.02em', lineHeight: 1.3, margin: 0 }}>
          {useCase.headline}
        </h3>
      </div>
      <div style={{ padding: '16px 28px 24px' }}>
        <p style={{ fontFamily: 'var(--font-editorial)', fontSize: 13, color: 'rgba(245,239,224,0.55)', lineHeight: 1.75, margin: 0 }}>
          {useCase.description}
        </p>
      </div>
    </div>
  );
}

export default function ToolDetail({ tool }: { tool: ToolDetailData }) {
  const posthog = usePostHog();

  function trackOutbound() {
    posthog?.capture("tool_outbound_click", {
      tool_slug: tool.slug,
      tool_name: tool.name,
      tool_category: tool.category,
      tool_pricing: tool.pricing,
    });
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 48px 96px', display: 'flex', flexDirection: 'column', gap: 64 }}>

        {/* Back */}
        <Link
          href="/"
          style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'rgba(245,239,224,0.45)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, width: 'fit-content', transition: 'color 150ms ease' }}
          className="hover:text-primary"
        >
          ← Back to all tools
        </Link>

        {/* Deprecated notice — shown before header if tool is deprecated */}
        {tool.status === "deprecated" && (
          <div style={{ borderRadius: 10, border: '1px solid rgba(224,112,112,0.20)', background: 'rgba(224,112,112,0.06)', padding: '16px 20px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, lineHeight: 1, flexShrink: 0 }}>⚠</span>
            <div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--error)', margin: '0 0 4px' }}>
                No longer recommended
              </p>
              <p style={{ fontFamily: 'var(--font-editorial)', fontSize: 14, color: 'rgba(245,239,224,0.55)', lineHeight: 1.6, margin: 0 }}>
                {tool.deprecated_reason ?? "This tool is deprecated. We keep it archived for reference."}
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 14 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 900, color: '#F5EFE0', letterSpacing: '-0.03em', lineHeight: 1, margin: 0 }}>
              {tool.name}
            </h1>
            <span style={{ ...pricingStyle(tool.pricing), marginTop: 10 }}>
              {tool.pricing}
            </span>
            {tool.status && tool.status !== "stable" && (
              <span style={{ ...statusStyle(tool.status), marginTop: 10 }}>
                {STATUS_LABEL[tool.status]}
              </span>
            )}
          </div>

          <p style={{ fontFamily: 'var(--font-editorial)', fontSize: 18, color: 'rgba(245,239,224,0.60)', lineHeight: 1.75, maxWidth: '54ch', fontStyle: 'italic' }}>
            {tool.tagline}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.09em', textTransform: 'uppercase', padding: '3px 10px', borderRadius: 4, background: '#AAFF4D', color: '#0C0A08', fontWeight: 700 }}>
              {tool.category}
            </span>
            {tool.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* Video */}
        <section>
          {tool.video_url ? (
            <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 14, border: '1px solid rgba(245,239,224,0.07)', background: 'rgba(255,250,240,0.03)', aspectRatio: '16/9' }}>
              <iframe
                src={getYouTubeEmbedUrl(tool.video_url)}
                title={`${tool.name} demo`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
              />
            </div>
          ) : (
            <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 14, border: '1px solid rgba(245,239,224,0.07)', background: 'rgba(255,250,240,0.03)', height: 360, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
              <div style={{ position: 'absolute', top: 24, left: 32, width: 160, height: 160, background: 'rgba(170,255,77,0.07)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', bottom: 32, right: 40, width: 200, height: 200, background: 'rgba(244,171,31,0.05)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />
              <div style={{ position: 'relative', width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,250,240,0.04)', border: '1px solid rgba(245,239,224,0.09)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="rgba(245,239,224,0.60)" style={{ marginLeft: 4 }}>
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <div style={{ position: 'relative', textAlign: 'center' }}>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: 16, fontWeight: 600, color: '#F5EFE0', marginBottom: 4 }}>Video walkthrough</p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(245,239,224,0.30)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>coming soon</p>
              </div>
            </div>
          )}
        </section>

        {/* Use Cases */}
        <section>
          <div style={{ marginBottom: 32 }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#AAFF4D', marginBottom: 8 }}>
              Real workflows, real people
            </p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, color: '#F5EFE0', letterSpacing: '-0.02em', margin: 0 }}>
              How people are using it
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {tool.useCases.map((uc) => (
              <UseCaseCard key={uc.audience} useCase={uc} />
            ))}
          </div>
        </section>

        {/* Where it struggles */}
        {tool.weaknesses && tool.weaknesses.length > 0 && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(224,112,112,0.70)', marginBottom: 8 }}>
                honest assessment
              </p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, color: '#F5EFE0', letterSpacing: '-0.02em', margin: 0 }}>
                Where it struggles
              </h2>
            </div>
            <div style={{ borderLeft: '3px solid rgba(224,112,112,0.30)', paddingLeft: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {tool.weaknesses.map((w, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(224,112,112,0.50)', flexShrink: 0, lineHeight: 1.8, minWidth: 18 }}>
                    {i + 1}.
                  </span>
                  <p style={{ fontFamily: 'var(--font-editorial)', fontSize: 15, color: 'rgba(245,239,224,0.58)', lineHeight: 1.75, margin: 0 }}>
                    {w}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Learning Guide */}
        {tool.learning_guide && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#AAFF4D', marginBottom: 8 }}>
                your starter pack
              </p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, color: '#F5EFE0', letterSpacing: '-0.02em', margin: 0 }}>
                Learning Guide
              </h2>
            </div>
            <div style={{ borderRadius: 14, border: '1px solid rgba(245,239,224,0.07)', background: 'rgba(255,250,240,0.03)', padding: '40px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {tool.learning_guide.split(/\n\n+/).map((para, i) => (
                <p key={i} style={{ fontFamily: 'var(--font-editorial)', fontSize: 15, color: 'rgba(245,239,224,0.60)', lineHeight: 1.85, margin: 0 }}>
                  {para.trim()}
                </p>
              ))}
            </div>
          </section>
        )}

        {/* Related concepts */}
        {tool.related_concepts && tool.related_concepts.length > 0 && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(245,239,224,0.30)', marginBottom: 8 }}>
                under the hood
              </p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, color: '#F5EFE0', letterSpacing: '-0.02em', margin: 0 }}>
                How this works
              </h2>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {tool.related_concepts.map((concept) => (
                <Link
                  key={concept}
                  href={`/learn/${concept.toLowerCase().replace(/\s+/g, "-")}`}
                  className="tag tag-accent"
                  style={{ textDecoration: 'none' }}
                >
                  {concept} →
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Pricing Reality */}
        {tool.pricing_detail && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(244,171,31,0.70)', marginBottom: 8 }}>
                what "free" actually means
              </p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, color: '#F5EFE0', letterSpacing: '-0.02em', margin: 0 }}>
                Pricing, honestly
              </h2>
            </div>
            <div style={{ borderRadius: 14, border: '1px solid rgba(244,171,31,0.12)', background: 'rgba(244,171,31,0.03)', overflow: 'hidden' }}>
              {/* Free tier */}
              <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(244,171,31,0.10)' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#AAFF4D', marginBottom: 8 }}>
                  Free tier
                </p>
                <p style={{ fontFamily: 'var(--font-editorial)', fontSize: 15, color: 'rgba(245,239,224,0.65)', lineHeight: 1.7, margin: 0 }}>
                  {tool.pricing_detail.free_tier}
                </p>
              </div>
              {/* The cliff */}
              <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(244,171,31,0.10)', background: 'rgba(244,171,31,0.04)' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--accent-warm)', marginBottom: 8 }}>
                  Where it cliffs
                </p>
                <p style={{ fontFamily: 'var(--font-editorial)', fontSize: 15, color: 'rgba(245,239,224,0.65)', lineHeight: 1.7, margin: 0 }}>
                  {tool.pricing_detail.cliff}
                </p>
              </div>
              {/* Paid cost */}
              <div style={{ padding: '20px 24px' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'rgba(245,239,224,0.35)', marginBottom: 8 }}>
                  What paid actually costs
                </p>
                <p style={{ fontFamily: 'var(--font-editorial)', fontSize: 15, color: 'rgba(245,239,224,0.65)', lineHeight: 1.7, margin: 0 }}>
                  {tool.pricing_detail.paid_monthly}
                </p>
              </div>
            </div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(245,239,224,0.25)', letterSpacing: '0.06em' }}>
              Verified {tool.pricing_detail.last_verified}
            </p>
          </section>
        )}

        {/* Alternatives */}
        {tool.alternatives && tool.alternatives.length > 0 && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(245,239,224,0.30)', marginBottom: 8 }}>
                if this doesn't click
              </p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, color: '#F5EFE0', letterSpacing: '-0.02em', margin: 0 }}>
                Also worth trying
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {tool.alternatives.map((alt) => (
                <Link
                  key={alt.slug}
                  href={`/tool/${alt.slug}`}
                  style={{ textDecoration: 'none', display: 'block', padding: '18px 0', borderBottom: '1px solid rgba(245,239,224,0.06)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: 15, fontWeight: 600, color: 'var(--accent-primary)', flexShrink: 0 }}>
                      {alt.name}
                    </span>
                    <span style={{ fontFamily: 'var(--font-editorial)', fontStyle: 'italic', fontSize: 14, color: 'rgba(245,239,224,0.50)', lineHeight: 1.65 }}>
                      {alt.reason}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        {tool.url && (
          <section style={{ paddingTop: 48, borderTop: '1px solid rgba(245,239,224,0.07)' }}>
            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
              style={{ fontSize: 14 }}
              onClick={trackOutbound}
            >
              Visit {tool.name} ↗
            </a>
          </section>
        )}

      </div>
    </main>
  );
}
