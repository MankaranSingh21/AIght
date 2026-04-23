"use client";

import Image from "next/image";
import { useState } from "react";

export type ToolCardProps = {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  tags: string[];
  url?: string | null;
};

function getMicrolinkUrl(url: string): string {
  return `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&embed=screenshot.url`;
}

export default function ToolCard({
  slug: _slug,
  name,
  tagline,
  category,
  tags,
  url,
}: ToolCardProps) {
  const [screenshotError, setScreenshotError] = useState(false);
  const [hov, setHov] = useState(false);
  const hasUrl = !!url;

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        borderRadius: 12,
        border: `1px solid ${hov ? 'rgba(170,255,77,0.22)' : 'rgba(245,239,224,0.07)'}`,
        background: hov ? 'rgba(255,250,240,0.06)' : 'rgba(255,250,240,0.03)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        cursor: 'pointer',
        transform: hov ? 'translateY(-3px)' : 'none',
        boxShadow: hov ? '0 12px 40px rgba(0,0,0,0.35), 0 0 0 1px rgba(170,255,77,0.06)' : '0 2px 8px rgba(0,0,0,0.2)',
        transition: 'transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease, background 200ms ease',
      }}
    >
      {/* Ghost watermark */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: 'var(--font-display)',
          fontSize: '9rem',
          fontWeight: 900,
          fontStyle: 'italic',
          color: '#AAFF4D',
          opacity: 0.03,
          lineHeight: 1,
          pointerEvents: 'none',
          userSelect: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        {category}
      </span>

      {/* Media */}
      <div style={{
        position: 'relative',
        height: 140,
        flexShrink: 0,
        overflow: 'hidden',
        background: 'rgba(245,239,224,0.03)',
        borderRadius: '12px 12px 0 0',
        filter: hov ? 'brightness(1.08)' : 'brightness(1)',
        transition: 'filter 200ms ease',
      }}>
        {hasUrl && !screenshotError ? (
          <Image
            src={getMicrolinkUrl(url!)}
            alt={`${name} screenshot`}
            fill
            className="object-cover"
            onError={() => setScreenshotError(true)}
            unoptimized
          />
        ) : null}
        {/* Category badge */}
        <span style={{
          position: 'absolute',
          bottom: 10,
          left: 14,
          fontFamily: 'var(--font-ui)',
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.10em',
          textTransform: 'uppercase',
          color: 'rgba(245,239,224,0.35)',
          zIndex: 1,
          padding: '3px 8px',
          borderRadius: 4,
          background: 'rgba(12,10,8,0.55)',
          backdropFilter: 'blur(8px)',
        }}>
          {category}
        </span>
      </div>

      {/* Body */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: 20, gap: 10 }}>
        <h3 style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 16,
          fontWeight: 600,
          color: hov ? '#F5EFE0' : 'rgba(245,239,224,0.90)',
          lineHeight: 1.3,
          margin: 0,
          transition: 'color 150ms ease',
        }}>
          {name}
        </h3>
        <p style={{
          fontFamily: 'var(--font-editorial)',
          fontSize: 13,
          lineHeight: 1.6,
          color: 'rgba(245,239,224,0.50)',
          margin: 0,
          flex: 1,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {tagline}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
          {tags.slice(0, 3).map((tag) => (
            <span key={tag} style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              letterSpacing: '0.05em',
              padding: '2px 8px',
              borderRadius: 4,
              background: 'rgba(245,239,224,0.05)',
              color: 'rgba(245,239,224,0.35)',
              border: '1px solid rgba(245,239,224,0.07)',
            }}>
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Live badge */}
      <div style={{
        padding: '10px 20px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        borderTop: '1px solid rgba(245,239,224,0.05)',
      }}>
        <span style={{
          width: 6, height: 6, borderRadius: '50%',
          background: '#AAFF4D',
          boxShadow: '0 0 6px rgba(170,255,77,0.6)',
          flexShrink: 0,
          animation: 'pulse-dot 2s infinite',
        }} />
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'rgba(245,239,224,0.30)',
        }}>
          Live
        </span>
      </div>
    </div>
  );
}
