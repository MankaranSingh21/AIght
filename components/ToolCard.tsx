"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { usePostHog } from "posthog-js/react";
import { MagicCard } from "@/components/ui/magic-card";
import { BorderBeam } from "@/components/ui/border-beam";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  pricing?: "Free" | "Freemium" | "Paid";
  bestFor?: string;
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

function MetadataPill({ 
  label 
}: { 
  label: string; 
}) {
  const getVariantStyles = () => {
    switch (label) {
      case "Beginner": return "text-accent bg-accent-glow border-accent/20";
      case "Intermediate": return "text-warm bg-warm/10 border-warm/20";
      case "Advanced": return "text-lavender bg-lavender/10 border-lavender/20";
      case "Free": return "text-accent bg-accent-glow border-accent/20";
      case "Freemium": return "text-accent bg-accent-glow border-accent/20";
      case "Paid": return "text-secondary bg-primary/5 border-primary/10";
      default: return "text-muted bg-primary/[0.03] border-primary/10";
    }
  };

  return (
    <span className={cn(
      "font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-sm border transition-colors duration-200",
      getVariantStyles()
    )}>
      {label}
    </span>
  );
}

function StatusBadge({
  status,
  showNew,
}: {
  status: string;
  showNew: boolean;
}) {
  const baseClass = "absolute top-2.5 right-2.5 z-[2] font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-sm border transition-all duration-200";
  
  if (status === "rising") {
    return (
      <span className={cn(baseClass, "text-accent bg-accent-glow border-emphasis shadow-[0_0_12px_rgba(170,255,77,0.15)]")}>
        Rising
      </span>
    );
  }
  if (status === "beta") {
    return (
      <span className={cn(baseClass, "text-warm bg-warm/10 border-warm/25")}>
        Beta
      </span>
    );
  }
  if (status === "deprecated") {
    return (
      <span className={cn(baseClass, "text-danger bg-danger/10 border-danger/25")}>
        Deprecated
      </span>
    );
  }
  if (showNew) {
    return (
      <span className={cn(baseClass, "text-accent bg-accent-glow border-emphasis")}>
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
    <div className="relative border-t border-subtle min-h-[44px] overflow-hidden">
      {/* Resting: Live dot + bookmark */}
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-between px-5 transition-all duration-200",
          hovered ? "opacity-0 -translate-y-1.5 pointer-events-none" : "opacity-100 translate-y-0"
        )}
      >
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 shadow-[0_0_6px_var(--accent-primary)]" />
          <span className="font-mono text-xs tracking-widest uppercase text-muted">
            Live
          </span>
        </div>
        <button
          onClick={onBookmark}
          aria-label={bookmarked ? "Remove bookmark" : "Bookmark this tool"}
          className={cn(
            "bg-transparent border-none cursor-pointer p-1 transition-colors duration-150 flex items-center",
            bookmarked ? "text-accent" : "text-muted hover:text-primary"
          )}
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
        className={cn(
          "absolute inset-0 flex items-center gap-2.5 px-5 transition-all duration-200",
          hovered ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-2 pointer-events-none"
        )}
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
            className="font-sans text-[11px] font-bold text-inverse px-3 py-1 rounded-sm no-underline whitespace-nowrap"
            style={{ backgroundColor: accentColor }}
          >
            Visit
          </a>
        )}
        <Link
          href={`/tool/${slug}`}
          onClick={(e) => e.stopPropagation()}
          className="font-sans text-[11px] font-medium text-muted hover:text-primary no-underline transition-colors"
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
  difficulty = "Beginner",
  pricing = "Free",
  bestFor,
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
      className={cn(
        "relative transition-all duration-200",
        hovered ? "z-20" : "z-auto"
      )}
      style={{
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
        className="block h-full cursor-pointer"
      >
        <div
          className="tool-card h-full"
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
            <span className="absolute top-2.5 left-2.5 z-[2] font-mono text-[10px] tracking-wider uppercase text-muted bg-overlay border border-subtle px-2 py-0.5 rounded-sm">
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
            <div className="flex flex-col flex-1 p-5 gap-2">
              <span 
                className="font-mono text-[9px] tracking-[0.14em] uppercase opacity-75 leading-none mb-1"
                style={{ color: accentColor }}
              >
                {category}
              </span>

              <h3 className="font-sans text-xl font-bold text-primary leading-tight m-0 tracking-tight">
                {name}
              </h3>

              {/* Metadata row */}
              <div className="flex flex-wrap gap-1.5 mt-0.5 mb-1">
                <MetadataPill label={difficulty} />
                <MetadataPill label={pricing} />
                {bestFor && <MetadataPill label={bestFor} />}
              </div>

              <p className="font-sans text-sm leading-relaxed text-secondary m-0 flex-1 line-clamp-2 overflow-hidden">
                {tagline}
              </p>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="tag text-[10px]">
                      #{tag}
                    </span>
                  ))}
                  {tags.length > 3 && (
                    <span className="tag text-[10px] opacity-60">
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
