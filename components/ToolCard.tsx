"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export type ToolCardProps = {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  tags: string[];
  url?: string | null;
  created_at?: string;
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
  created_at,
}: ToolCardProps) {
  const showNew = isNew(created_at);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    setBookmarked(getBookmarks().includes(slug));
  }, [slug]);

  function handleBookmark(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const next = toggleBookmark(slug);
    setBookmarked(next);
  }

  return (
    <Link href={`/tool/${slug}`} style={{ textDecoration: "none", display: "block" }}>
      <div className="tool-card">

        {/* New badge */}
        {showNew && (
          <span
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              zIndex: 2,
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--accent-primary)",
              background: "var(--accent-primary-glow)",
              border: "1px solid var(--border-emphasis)",
              padding: "2px 8px",
              borderRadius: "var(--radius-xs)",
            }}
          >
            New
          </span>
        )}

        {/* Header block — 148px, category watermark + label */}
        <div
          style={{
            position: "relative",
            height: 148,
            flexShrink: 0,
            overflow: "hidden",
            background: "var(--bg-elevated)",
            borderRadius: "var(--radius-lg) var(--radius-lg) 0 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Large watermark */}
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              fontFamily: "var(--font-mono)",
              fontSize: "8rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              opacity: 0.04,
              lineHeight: 1,
              pointerEvents: "none",
              userSelect: "none",
              whiteSpace: "nowrap",
              textTransform: "uppercase",
            }}
          >
            {category}
          </span>

          {/* Category label */}
          <span
            style={{
              position: "relative",
              zIndex: 1,
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              color: "var(--accent-primary)",
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
            padding: "var(--space-6)",
            gap: "var(--space-3)",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: "var(--text-xl)",
              fontWeight: 500,
              color: "var(--text-primary)",
              lineHeight: 1.3,
              margin: 0,
              letterSpacing: "-0.01em",
            }}
          >
            {name}
          </h3>

          <p
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: "var(--text-base)",
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
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
              {tags.slice(0, 3).map((tag) => (
                <span key={tag} className="tag">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer: Live badge + Bookmark */}
        <div
          style={{
            padding: "var(--space-3) var(--space-6) var(--space-4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid var(--border-subtle)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--accent-primary)",
                flexShrink: 0,
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
              // Filled bookmark
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <path d="M3 2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v12.5a.5.5 0 0 1-.777.416L8 12.101l-4.223 2.815A.5.5 0 0 1 3 14.5V2z"/>
              </svg>
            ) : (
              // Outline bookmark
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v12.5a.5.5 0 0 1-.777.416L8 12.101l-4.223 2.815A.5.5 0 0 1 3 14.5V2z"/>
              </svg>
            )}
          </button>
        </div>

      </div>
    </Link>
  );
}
