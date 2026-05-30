"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

/**
 * Tool screenshots gallery with click-to-expand lightbox.
 *
 * Reads `screenshots: string[] | null` from the `tools` table (column already
 * typed in `utils/supabase/types.ts`, fetched by `app/tool/[slug]/page.tsx`).
 * Renders nothing until at least one image URL is populated, so this is safe
 * to ship before any data exists.
 *
 * The "lightbox" is a fixed inline overlay, not a modal library — per the
 * design system rule against modal deps. Closes on backdrop click or Escape.
 *
 * Upload location convention: Supabase Storage bucket `tool-screenshots/`,
 * URL pasted into the `screenshots` array. Order in the array = render order.
 */

interface Props {
  screenshots: string[] | null | undefined;
  toolName: string;
}

export default function ToolScreenshots({ screenshots, toolName }: Props) {
  const shots = (screenshots ?? []).filter(
    (s): s is string => typeof s === "string" && s.length > 0,
  );
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? null : (i + 1) % shots.length));
      if (e.key === "ArrowLeft")  setOpen((i) => (i === null ? null : (i - 1 + shots.length) % shots.length));
    }
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, shots.length]);

  if (shots.length === 0) return null;

  // Grid template adapts to count: 1 = full-width, 2 = half each, 3+ = thirds.
  const cols = shots.length === 1 ? "1fr" : shots.length === 2 ? "1fr 1fr" : "repeat(auto-fill, minmax(220px, 1fr))";

  return (
    <section style={{ marginTop: 48, marginBottom: 24 }}>
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--text-muted)",
          marginBottom: 20,
        }}
      >
        Screenshots
      </p>

      <div className="tool-screenshots-grid" style={{ display: "grid", gridTemplateColumns: cols, gap: 12 }}>
        {shots.map((src, i) => (
          <button
            key={`${src}-${i}`}
            type="button"
            onClick={() => setOpen(i)}
            aria-label={`Open screenshot ${i + 1} of ${shots.length} for ${toolName}`}
            style={{
              all: "unset",
              cursor: "zoom-in",
              display: "block",
              position: "relative",
              aspectRatio: "16 / 10",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
              border: "1px solid var(--border-subtle)",
              background: "var(--bg-elevated)",
              transition: "border-color 200ms ease, transform 200ms ease",
            }}
            className="hover:border-accent"
          >
            <Image
              src={src}
              alt={`${toolName} screenshot ${i + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              style={{ objectFit: "cover" }}
            />
          </button>
        ))}
      </div>

      {open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${toolName} screenshot ${open + 1}`}
          onClick={() => setOpen(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(12, 10, 8, 0.92)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "var(--space-8)",
            animation: "fade-in 200ms ease",
          }}
        >
          <button
            type="button"
            onClick={() => setOpen(null)}
            aria-label="Close screenshot"
            style={{
              all: "unset",
              position: "absolute",
              top: "var(--space-6)",
              right: "var(--space-6)",
              cursor: "pointer",
              padding: "var(--space-2) var(--space-3)",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              border: "1px solid var(--border-default)",
              borderRadius: "var(--radius-md)",
            }}
          >
            Close · Esc
          </button>

          {/* Stop the inner image from closing the overlay when clicked */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 1200,
              aspectRatio: "16 / 10",
              maxHeight: "85vh",
            }}
          >
            <Image
              src={shots[open]}
              alt={`${toolName} screenshot ${open + 1}`}
              fill
              sizes="90vw"
              priority
              style={{ objectFit: "contain" }}
            />
          </div>

          {shots.length > 1 && (
            <div
              style={{
                position: "absolute",
                bottom: "var(--space-6)",
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "center",
                gap: 6,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {shots.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setOpen(i)}
                  aria-label={`Show screenshot ${i + 1}`}
                  style={{
                    all: "unset",
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    cursor: "pointer",
                    background: i === open ? "var(--accent-primary)" : "var(--border-default)",
                    transition: "background 150ms ease",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
