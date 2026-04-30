"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { usePostHog } from "posthog-js/react";
import { MagicCard } from "@/components/ui/magic-card";
import { BorderBeam } from "@/components/ui/border-beam";

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
  spanCols?: number;
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
  } else {
    current.splice(idx, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  }
  window.dispatchEvent(new Event("aight_bookmarks_changed"));
  return idx === -1;
}

function isNew(created_at?: string): boolean {
  if (!created_at) return false;
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return new Date(created_at) > sevenDaysAgo;
}

function slugRotation(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) | 0;
  const bucket = ((h % 5) + 5) % 5;
  return [-1.5, -0.75, 0, 0.75, 1.5][bucket];
}

function StatusBadge({
  status,
  showNew,
}: {
  status: string;
  showNew: boolean;
}) {
  const base: React.CSSProperties = {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 2,
    fontFamily: "var(--font-mono)",
    fontSize: 10,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    padding: "2px 8px",
    borderRadius: "var(--radius-sm)",
  };
  if (status === "rising") {
    return (
      <span
        style={{
          ...base,
          color: "var(--accent-primary)",
          background: "var(--accent-primary-glow)",
          border: "1px solid var(--border-emphasis)",
        }}
      >
        Rising
      </span>
    );
  }
  if (status === "beta") {
    return (
      <span
        style={{
          ...base,
          color: "var(--accent-warm)",
          background: "rgba(244,171,31,0.10)",
          border: "1px solid rgba(244,171,31,0.25)",
        }}
      >
        Beta
      </span>
    );
  }
  if (status === "deprecated") {
    return (
      <span
        style={{
          ...base,
          color: "var(--error)",
          background: "rgba(224,112,112,0.10)",
          border: "1px solid rgba(224,112,112,0.25)",
        }}
      >
        Deprecated
      </span>
    );
  }
  if (showNew) {
    return (
      <span
        style={{
          ...base,
          color: "var(--accent-primary)",
          background: "var(--accent-primary-glow)",
          border: "1px solid var(--border-emphasis)",
        }}
      >
        New
      </span>
    );
  }
  return null;
}

function CardFooter({
  hovered,
  bookmarked,
  url,
  slug,
  name,
  accentColor,
  onBookmark,
}: {
  hovered: boolean;
  bookmarked: boolean;
  url?: string | null;
  slug: string;
  name: string;
  accentColor: string;
  onBookmark: (e: React.MouseEvent) => void;
}) {
  const posthog = usePostHog();
  return (
    <div
      style={{
        borderTop: "1px solid var(--border-subtle)",
        minHeight: 44,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Resting: Live dot + bookmark */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 var(--space-5)",
          opacity: hovered ? 0 : 1,
          transform: hovered ? "translateY(-6px)" : "translateY(0)",
          transition: "opacity 150ms ease, transform 150ms ease",
          pointerEvents: hovered ? "none" : "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
          }}
        >
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
          onClick={onBookmark}
          aria-label={bookmarked ? "Remove bookmark" : "Bookmark this tool"}
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
              <path d="M3 2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v12.5a.5.5 0 0 1-.777.416L8 12.101l-4.223 2.815A.5.5 0 0 1 3 14.5V2z" />
            </svg>
          ) : (
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M3 2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v12.5a.5.5 0 0 1-.777.416L8 12.101l-4.223 2.815A.5.5 0 0 1 3 14.5V2z" />
            </svg>
          )}
        </button>
      </div>

      {/* Hover: Visit + Details CTAs */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "0 var(--space-5)",
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 180ms ease, transform 180ms ease",
          pointerEvents: hovered ? "auto" : "none",
        }}
      >
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
              posthog?.capture("tool_visit_from_card", {
                tool_slug: slug,
                tool_name: name,
              });
            }}
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: 12,
              fontWeight: 600,
              color: "var(--text-inverse)",
              background: accentColor,
              border: "none",
              borderRadius: "var(--radius-sm)",
              padding: "5px 12px",
              cursor: "pointer",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              whiteSpace: "nowrap",
            }}
          >
            Visit
          </a>
        )}
        <Link
          href={`/tool/${slug}`}
          onClick={(e) => e.stopPropagation()}
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: 12,
            fontWeight: 500,
            color: "var(--text-muted)",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          Details
        </Link>
      </div>
    </div>
  );
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
  spanCols,
}: ToolCardProps) {
  const showNew = isNew(created_at) && status === "stable";
  const [bookmarked, setBookmarked] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const posthog = usePostHog();
  const router = useRouter();

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

  const accentColor =
    accent && /^#[0-9a-fA-F]{3,8}$/.test(accent) ? accent : "#AAFF4D";
  const rotation = slugRotation(slug);

  const cardTransform = pressed
    ? `rotate(${rotation}deg) translateY(4px)`
    : hovered
    ? `rotate(${rotation}deg) translateY(-2px)`
    : `rotate(${rotation}deg)`;

  const cardShadow = hovered
    ? `inset 0 1px 0 rgba(255,250,240,0.10), 0 2px 0 rgba(0,0,0,0.6), 0 0 0 1px ${accentColor}22, 0 12px 40px ${accentColor}14`
    : pressed
    ? "inset 0 1px 0 rgba(255,250,240,0.06), 0 1px 0 rgba(0,0,0,0.6)"
    : "inset 0 1px 0 rgba(255,250,240,0.06), 0 4px 0 rgba(0,0,0,0.6)";

  return (
    <div
      style={{
        position: "relative",
        zIndex: hovered ? 20 : "auto",
        gridColumn: spanCols ? `span ${spanCols}` : undefined,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
    >
      <div
        onClick={() => router.push(`/tool/${slug}`)}
        style={{ display: "block", cursor: "pointer" }}
      >
        <div
          className="tool-card"
          onMouseDown={() => setPressed(true)}
          onMouseUp={() => setPressed(false)}
          style={{
            transform: cardTransform,
            boxShadow: cardShadow,
            borderColor: hovered ? "var(--border-emphasis)" : undefined,
            transition:
              "transform 80ms ease-out, box-shadow 200ms ease, border-color 150ms ease",
          }}
        >
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

          {!is_sponsored && (
            <StatusBadge status={status} showNew={showNew} />
          )}

          <MagicCard
            gradientColor={`${accentColor}18`}
            gradientSize={220}
            gradientOpacity={1}
            className="flex-col flex-1"
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                padding: "var(--space-5)",
                gap: "var(--space-2)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: accentColor,
                  opacity: 0.75,
                  lineHeight: 1,
                  marginBottom: 4,
                }}
              >
                {category}
              </span>

              <h3
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: "var(--text-xl)",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  lineHeight: 1.2,
                  margin: 0,
                  letterSpacing: "-0.03em",
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
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "var(--space-1)",
                    marginTop: 4,
                  }}
                >
                  {tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="tag" style={{ fontSize: 10 }}>
                      #{tag}
                    </span>
                  ))}
                  {tags.length > 3 && (
                    <span
                      className="tag"
                      style={{ fontSize: 10, opacity: 0.6 }}
                    >
                      +{tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>

            <CardFooter
              hovered={hovered}
              bookmarked={bookmarked}
              url={url}
              slug={slug}
              name={name}
              accentColor={accentColor}
              onBookmark={handleBookmark}
            />
          </MagicCard>

          {hovered && (
            <BorderBeam
              colorFrom={accentColor}
              colorTo="transparent"
              size={100}
              duration={3}
              borderWidth={1}
            />
          )}
        </div>
      </div>
    </div>
  );
}
