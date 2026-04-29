"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePostHog } from "posthog-js/react";

export type ToolCardProps = {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  tags: string[];
  url?: string | null;
  created_at?: string;
  is_sponsored?: boolean | null;
  accent?: string | null;
  status?: "stable" | "beta" | "rising" | "deprecated";
};

const STORAGE_KEY = "aight_bookmarks";

function getBookmarks(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function toggleBookmark(slug: string): boolean {
  const current = getBookmarks();
  const idx = current.indexOf(slug);
  if (idx === -1) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...current, slug]));
    return true;
  }
  current.splice(idx, 1);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  return false;
}

function isNew(created_at?: string): boolean {
  if (!created_at) return false;
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return new Date(created_at) > sevenDaysAgo;
}

export default function ToolCard({
  slug,
  name,
  tagline,
  category,
  tags,
  url,
  created_at,
  is_sponsored,
  accent,
  status = "stable",
}: ToolCardProps) {
  const showNew = isNew(created_at) && status === "stable";
  const [bookmarked, setBookmarked] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [panelFlip, setPanelFlip] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const posthog = usePostHog();

  useEffect(() => {
    setBookmarked(getBookmarks().includes(slug));
  }, [slug]);

  function handleBookmark(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const next = toggleBookmark(slug);
    setBookmarked(next);
    posthog?.capture(next ? "tool_bookmarked" : "tool_unbookmarked", {
      tool_slug: slug,
      tool_name: name,
      tool_category: category,
    });
  }

  function handleMouseEnter() {
    setShowPanel(true);
    // Detect if card is near right edge — flip panel left
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const spaceRight = window.innerWidth - rect.right;
      setPanelFlip(spaceRight < 300);
    }
  }

  function handleMouseLeave() {
    setShowPanel(false);
    setPressed(false);
  }

  // Accent color for header radial glow — fallback to lime
  const accentColor = accent ?? "#AAFF4D";

  return (
    // Outer wrapper: relative so panel can be positioned absolutely
    <div
      ref={cardRef}
      style={{ position: "relative" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link href={`/tool/${slug}`} style={{ textDecoration: "none", display: "block" }}>
        <div
          className="tool-card"
          onMouseDown={() => setPressed(true)}
          onMouseUp={() => setPressed(false)}
          style={{
            // Key-cap 3D press effect
            transform: pressed ? "translateY(4px)" : showPanel ? "translateY(2px)" : "translateY(0)",
            boxShadow: pressed
              ? "inset 0 1px 0 rgba(255,250,240,0.06), 0 1px 0 rgba(0,0,0,0.6)"
              : showPanel
              ? `inset 0 1px 0 rgba(255,250,240,0.08), 0 2px 0 rgba(0,0,0,0.6), 0 0 20px ${accentColor}18`
              : "inset 0 1px 0 rgba(255,250,240,0.06), 0 4px 0 rgba(0,0,0,0.6)",
            transition: "transform 80ms ease-out, box-shadow 80ms ease-out, border-color 150ms ease",
            borderColor: showPanel ? "var(--border-emphasis)" : undefined,
          }}
        >

          {/* Sponsored badge */}
          {is_sponsored && (
            <span
              style={{
                position: "absolute",
                top: 10,
                left: 10,
                zIndex: 2,
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                background: "var(--bg-overlay)",
                border: "1px solid var(--border-subtle)",
                padding: "2px 8px",
                borderRadius: "var(--radius-sm)",
              }}
            >
              Sponsored
            </span>
          )}

          {/* Status / New badge */}
          {!is_sponsored && (() => {
            if (status === "rising") return (
              <span style={{ position: "absolute", top: 10, right: 10, zIndex: 2, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent-primary)", background: "var(--accent-primary-glow)", border: "1px solid var(--border-emphasis)", padding: "2px 8px", borderRadius: "var(--radius-sm)" }}>
                Rising ↑
              </span>
            );
            if (status === "beta") return (
              <span style={{ position: "absolute", top: 10, right: 10, zIndex: 2, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent-warm)", background: "rgba(244,171,31,0.10)", border: "1px solid rgba(244,171,31,0.25)", padding: "2px 8px", borderRadius: "var(--radius-sm)" }}>
                Beta
              </span>
            );
            if (status === "deprecated") return (
              <span style={{ position: "absolute", top: 10, right: 10, zIndex: 2, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--error)", background: "rgba(224,112,112,0.10)", border: "1px solid rgba(224,112,112,0.25)", padding: "2px 8px", borderRadius: "var(--radius-sm)" }}>
                Deprecated
              </span>
            );
            if (showNew) return (
              <span style={{ position: "absolute", top: 10, right: 10, zIndex: 2, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent-primary)", background: "var(--accent-primary-glow)", border: "1px solid var(--border-emphasis)", padding: "2px 8px", borderRadius: "var(--radius-sm)" }}>
                New
              </span>
            );
            return null;
          })()}

          {/* Header — 96px, accent radial glow, category legend top-left + watermark */}
          <div
            style={{
              position: "relative",
              height: 96,
              flexShrink: 0,
              overflow: "hidden",
              borderRadius: "var(--radius-lg) var(--radius-lg) 0 0",
              background: `radial-gradient(ellipse at top, ${accentColor}14 0%, var(--bg-elevated) 65%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Keycap watermark — first letter of category */}
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                fontFamily: "var(--font-mono)",
                fontSize: "6rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                opacity: 0.05,
                lineHeight: 1,
                pointerEvents: "none",
                userSelect: "none",
                letterSpacing: "-0.04em",
              }}
            >
              {category.charAt(0).toUpperCase()}
            </span>

            {/* Keycap legend — top-left like a keyboard key */}
            <span
              style={{
                position: "absolute",
                top: 8,
                left: 10,
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: accentColor,
                opacity: 0.7,
                lineHeight: 1,
              }}
            >
              {category}
            </span>
          </div>

          {/* Body */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              padding: "var(--space-5) var(--space-5) var(--space-3)",
              gap: "var(--space-2)",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: "var(--text-lg)",
                fontWeight: 600,
                color: "var(--text-primary)",
                lineHeight: 1.3,
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              {name}
            </h3>

            <p
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: "var(--text-sm)",
                lineHeight: 1.6,
                color: "var(--text-secondary)",
                margin: 0,
                flex: 1,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {tagline}
            </p>

            {tags.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-1)" }}>
                {tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="tag" style={{ fontSize: 10 }}>
                    #{tag}
                  </span>
                ))}
                {tags.length > 3 && (
                  <span className="tag" style={{ fontSize: 10, opacity: 0.6 }}>
                    +{tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Footer: Live badge + Bookmark */}
          <div
            style={{
              padding: "var(--space-3) var(--space-5) var(--space-4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: "1px solid var(--border-subtle)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "var(--accent-primary)",
                  flexShrink: 0,
                  boxShadow: "0 0 6px var(--accent-primary)",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                }}
              >
                Live
              </span>
            </div>

            <button
              onClick={handleBookmark}
              aria-label={bookmarked ? "Remove bookmark" : "Bookmark this tool"}
              title={bookmarked ? "Remove bookmark" : "Save for later"}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "2px 4px",
                color: bookmarked ? "var(--accent-primary)" : "var(--text-muted)",
                transition: "color 150ms ease",
                lineHeight: 1,
                display: "flex",
                alignItems: "center",
              }}
            >
              {bookmarked ? (
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M3 2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v12.5a.5.5 0 0 1-.777.416L8 12.101l-4.223 2.815A.5.5 0 0 1 3 14.5V2z"/>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v12.5a.5.5 0 0 1-.777.416L8 12.101l-4.223 2.815A.5.5 0 0 1 3 14.5V2z"/>
                </svg>
              )}
            </button>
          </div>

        </div>
      </Link>

      {/* Hover info panel — Raycast-style, no touch */}
      {showPanel && (
        <div
          style={{
            position: "absolute",
            top: 0,
            ...(panelFlip ? { right: "calc(100% + 10px)" } : { left: "calc(100% + 10px)" }),
            width: 260,
            zIndex: 100,
            background: "var(--bg-elevated)",
            border: "1px solid var(--glass-border-hover)",
            borderRadius: "var(--radius-xl)",
            boxShadow: `var(--shadow-card-hover), 0 0 0 1px ${accentColor}18`,
            padding: "var(--space-5)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-3)",
            animation: "panelReveal 150ms ease forwards",
            pointerEvents: "auto",
          }}
        >
          <div>
            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: accentColor,
              margin: "0 0 6px",
              opacity: 0.8,
            }}>
              {category}
            </p>
            <h4 style={{
              fontFamily: "var(--font-ui)",
              fontSize: "var(--text-lg)",
              fontWeight: 600,
              color: "var(--text-primary)",
              margin: 0,
              letterSpacing: "-0.02em",
              lineHeight: 1.3,
            }}>
              {name}
            </h4>
          </div>

          <p style={{
            fontFamily: "var(--font-editorial)",
            fontSize: "var(--text-sm)",
            lineHeight: 1.7,
            color: "var(--text-secondary)",
            margin: 0,
          }}>
            {tagline}
          </p>

          {tags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-1)" }}>
              {tags.map((tag) => (
                <span key={tag} className="tag" style={{ fontSize: 10 }}>
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div style={{ display: "flex", gap: "var(--space-2)", marginTop: "var(--space-1)" }}>
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.stopPropagation();
                  posthog?.capture("tool_visit_from_panel", { tool_slug: slug, tool_name: name });
                }}
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: "var(--text-sm)",
                  fontWeight: 500,
                  color: "var(--text-inverse)",
                  background: "var(--accent-primary)",
                  border: "none",
                  borderRadius: "var(--radius-md)",
                  padding: "6px 14px",
                  cursor: "pointer",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  transition: "background 150ms ease",
                }}
              >
                Visit →
              </a>
            )}
            <Link
              href={`/tool/${slug}`}
              onClick={(e) => e.stopPropagation()}
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: "var(--text-sm)",
                fontWeight: 500,
                color: "var(--text-primary)",
                background: "transparent",
                border: "1px solid var(--border-default)",
                borderRadius: "var(--radius-md)",
                padding: "6px 14px",
                cursor: "pointer",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                transition: "border-color 150ms ease, color 150ms ease",
              }}
            >
              Details
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
