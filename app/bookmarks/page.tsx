"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import ToolCard, { type ToolCardProps } from "@/components/ToolCard";

const STORAGE_KEY = "aight_bookmarks";

function getSlugs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function buildMarkdown(tools: ToolCardProps[]): string {
  const lines = tools.map((t) => `- **${t.name}** (${t.category}) — ${t.tagline}`);
  return [
    "## My AI Stack",
    "",
    ...lines,
    "",
    "Curated via AIght — https://www.aightai.in",
  ].join("\n");
}

export default function BookmarksPage() {
  const [tools, setTools]     = useState<ToolCardProps[] | null>(null); // null = loading
  const [copied, setCopied]   = useState(false);
  const [slugs, setSlugs]     = useState<string[]>([]);

  const load = useCallback(async () => {
    const current = getSlugs();
    setSlugs(current);

    if (current.length === 0) {
      setTools([]);
      return;
    }

    const supabase = createClient();
    const { data } = await supabase
      .from("tools")
      .select("slug, name, vibe_description, category, url, tags, created_at, accent, status")
      .in("slug", current);

    if (!data) { setTools([]); return; }

    // Preserve the order from localStorage
    const map = new Map(data.map((t) => [t.slug, t]));
    const ordered: ToolCardProps[] = current
      .map((s) => map.get(s))
      .filter((t): t is NonNullable<typeof t> => t !== undefined)
      .map((t) => ({
        slug:         t.slug,
        name:         t.name,
        tagline:      t.vibe_description ?? "",
        category:     t.category ?? "AI Tool",
        url:          t.url ?? null,
        tags:         t.tags ?? [],
        created_at:   t.created_at,
        is_sponsored: null,
        accent:       t.accent ?? null,
        status:       t.status ?? "stable",
      }));

    setTools(ordered);
  }, []);

  // Load on mount + keep in sync when localStorage changes (e.g. unbookmarking from this page)
  useEffect(() => {
    load();

    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) load();
    }
    function onCustom() { load(); }

    window.addEventListener("storage", onStorage);
    window.addEventListener("aight_bookmarks_changed", onCustom);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("aight_bookmarks_changed", onCustom);
    };
  }, [load]);

  async function copyStack() {
    if (!tools || tools.length === 0) return;
    await navigator.clipboard.writeText(buildMarkdown(tools));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const isEmpty = tools !== null && tools.length === 0;

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 48px 96px" }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <p style={{
            fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em",
            textTransform: "uppercase", color: "var(--accent-primary)", marginBottom: 14,
          }}>
            your saved tools
          </p>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px, 5vw, 52px)",
              fontWeight: 900,
              color: "var(--text-primary)",
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              margin: 0,
            }}>
              Your stack
              {tools !== null && tools.length > 0 && (
                <span style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "clamp(14px, 2vw, 18px)",
                  fontWeight: 400,
                  color: "var(--text-muted)",
                  marginLeft: 16,
                  letterSpacing: "0.02em",
                }}>
                  {tools.length} tool{tools.length !== 1 ? "s" : ""}
                </span>
              )}
            </h1>

            {tools && tools.length > 0 && (
              <button
                onClick={copyStack}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: copied ? "var(--accent-primary)" : "var(--text-muted)",
                  background: copied ? "var(--accent-primary-glow)" : "var(--bg-elevated)",
                  border: `1px solid ${copied ? "var(--border-emphasis)" : "var(--border-default)"}`,
                  borderRadius: "var(--radius-md)",
                  padding: "8px 16px",
                  cursor: "pointer",
                  transition: "all 150ms ease",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="5" y="2" width="9" height="11" rx="1.5" />
                  <path d="M3 4H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-1" />
                </svg>
                {copied ? "Copied!" : "Copy my stack"}
              </button>
            )}
          </div>
        </div>

        {/* Loading */}
        {tools === null && (
          <p style={{
            fontFamily: "var(--font-mono)", fontSize: 11,
            color: "var(--text-muted)", letterSpacing: "0.08em",
          }}>
            Loading...
          </p>
        )}

        {/* Empty state */}
        {isEmpty && (
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", gap: 16, padding: "96px 0", textAlign: "center",
          }}>
            <svg width="32" height="32" viewBox="0 0 16 16" fill="none" stroke="rgba(245,239,224,0.20)" strokeWidth="1.2">
              <path d="M3 2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v12.5a.5.5 0 0 1-.777.416L8 12.101l-4.223 2.815A.5.5 0 0 1 3 14.5V2z"/>
            </svg>
            <p style={{
              fontFamily: "var(--font-editorial)",
              fontStyle: "italic",
              fontSize: "var(--text-lg)",
              color: "var(--text-muted)",
              maxWidth: "36ch",
              lineHeight: 1.7,
              margin: 0,
            }}>
              Nothing saved yet.
              <br />
              Bookmark tools as you browse — they live here.
            </p>
            <Link
              href="/tools"
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: "var(--text-sm)",
                color: "var(--accent-primary)",
                textDecoration: "none",
                marginTop: 8,
              }}
            >
              Browse the archive →
            </Link>
          </div>
        )}

        {/* Tool grid */}
        {tools && tools.length > 0 && (
          <div className="tool-bento-grid">
            {tools.map((tool, i) => (
              <ToolCard key={tool.slug} {...tool} spanCols={[0, 3, 7, 11].includes(i) ? 2 : 1} />
            ))}
          </div>
        )}

        {/* Copy format preview */}
        {tools && tools.length > 0 && (
          <div style={{ marginTop: 64, paddingTop: 32, borderTop: "1px solid var(--border-subtle)" }}>
            <p style={{
              fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.12em",
              textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 14,
            }}>
              Copy format preview
            </p>
            <pre style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              lineHeight: 1.8,
              color: "rgba(245,239,224,0.35)",
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              padding: "20px 24px",
              overflowX: "auto",
              margin: 0,
              whiteSpace: "pre-wrap",
            }}>
              {buildMarkdown(tools)}
            </pre>
          </div>
        )}

      </div>
    </main>
  );
}
