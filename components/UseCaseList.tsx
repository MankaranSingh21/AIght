"use client";

import Link from "next/link";

type UseCase = {
  slug: string;
  label: string;
  description: string;
  tool_slugs: string[];
};

export default function UseCaseList({ useCases }: { useCases: UseCase[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {useCases.map((uc, i) => (
        <Link
          key={uc.slug}
          href={`/use-cases/${uc.slug}`}
          style={{ textDecoration: "none", display: "block" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2rem 1fr auto",
              alignItems: "center",
              gap: "clamp(16px, 3vw, 40px)",
              padding: "clamp(20px, 3vw, 32px) 0",
              borderBottom: "1px solid var(--border-subtle)",
              transition: "all 200ms ease",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.paddingLeft = "12px";
              const label = e.currentTarget.querySelector<HTMLElement>(".uc-label");
              if (label) label.style.color = "var(--accent-primary)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.paddingLeft = "0";
              const label = e.currentTarget.querySelector<HTMLElement>(".uc-label");
              if (label) label.style.color = "var(--text-primary)";
            }}
          >
            <span style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--text-muted)",
              letterSpacing: "0.05em",
              alignSelf: "flex-start",
              paddingTop: 6,
            }}>
              {String(i + 1).padStart(2, "0")}
            </span>

            <div>
              <h2
                className="uc-label"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(20px, 3.5vw, 36px)",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  letterSpacing: "-0.025em",
                  lineHeight: 1.15,
                  margin: "0 0 8px",
                  transition: "color 150ms ease",
                }}
              >
                {uc.label}
              </h2>
              <p style={{
                fontFamily: "var(--font-editorial)",
                fontSize: 14,
                color: "var(--text-secondary)",
                lineHeight: 1.65,
                margin: 0,
                maxWidth: "58ch",
              }}>
                {uc.description}
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
              <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "var(--text-muted)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}>
                {uc.tool_slugs.length} tools
              </span>
              <span style={{
                fontFamily: "var(--font-ui)",
                fontSize: 18,
                color: "var(--text-muted)",
              }}>
                →
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
