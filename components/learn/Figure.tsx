import type { ReactNode } from "react";

/**
 * Static diagram / figure for concept essays.
 *
 * Authored in MDX as:
 *   <Figure caption="How attention routes information" number={1}>
 *     <svg viewBox="0 0 600 300">…</svg>
 *   </Figure>
 *
 * Children are typically inline SVG drawn with the design tokens
 * (var(--accent-primary), var(--text-secondary), etc.). The wrapper
 * supplies the on-brand frame, centring, and the editorial caption —
 * the complement to the interactive `*Demo` widgets, for diagrams that
 * don't need interaction.
 */
export default function Figure({
  children,
  caption,
  number,
  bleed = false,
}: {
  children: ReactNode;
  caption?: string;
  /** Optional figure number shown as a mono "Fig. N" eyebrow. */
  number?: number;
  /** Let the SVG fill the column edge-to-edge instead of the padded card. */
  bleed?: boolean;
}) {
  return (
    <figure style={{ margin: "44px 0" }}>
      <div
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-xl)",
          padding: bleed ? 0 : "var(--space-8)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {children}
        </div>
      </div>

      {caption && (
        <figcaption
          style={{
            display: "flex",
            gap: 10,
            alignItems: "baseline",
            justifyContent: "center",
            marginTop: "var(--space-3)",
            padding: "0 var(--space-4)",
          }}
        >
          {typeof number === "number" && (
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--accent-primary)",
                flexShrink: 0,
              }}
            >
              Fig. {number}
            </span>
          )}
          <span
            style={{
              fontFamily: "var(--font-editorial)",
              fontStyle: "italic",
              fontSize: 14,
              lineHeight: 1.6,
              color: "var(--text-secondary)",
              textAlign: "center",
            }}
          >
            {caption}
          </span>
        </figcaption>
      )}
    </figure>
  );
}
