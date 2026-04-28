"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type RecommendedTool = {
  slug: string;
  name: string;
  vibe_description: string | null;
  category: string;
  is_free: boolean;
};

type Props = {
  responsibilities: string[];
  riskCategory: "high" | "medium" | "low";
};

export default function QuizToolRecs({ responsibilities, riskCategory }: Props) {
  const [tools, setTools] = useState<RecommendedTool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams({
      responsibilities: responsibilities.join(","),
      risk_category: riskCategory,
    });
    fetch(`/api/quiz-tools?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setTools(data.tools ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [responsibilities, riskCategory]);

  if (loading) return null;
  if (tools.length === 0) return null;

  return (
    <div
      style={{
        marginBottom: 40,
        padding: 28,
        borderRadius: 12,
        border: "1px solid var(--border-subtle)",
        background: "var(--bg-surface)",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "rgba(245,239,224,0.30)",
          marginBottom: 16,
          margin: "0 0 16px",
        }}
      >
        Tools to start with
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tool/${tool.slug}`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 0",
              borderBottom: "1px solid rgba(245,239,224,0.06)",
              textDecoration: "none",
              gap: 16,
            }}
            className="group"
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <span
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "var(--text-primary)",
                  display: "block",
                  marginBottom: 2,
                  transition: "color 150ms ease",
                }}
                className="group-hover:text-accent"
              >
                {tool.name}
              </span>
              {tool.vibe_description && (
                <span
                  style={{
                    fontFamily: "var(--font-editorial)",
                    fontStyle: "italic",
                    fontSize: 12,
                    color: "var(--text-secondary)",
                    display: "block",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {tool.vibe_description}
                </span>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              <span className="tag">{tool.category}</span>
              {tool.is_free && (
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    letterSpacing: "0.06em",
                    color: "var(--accent-primary)",
                    opacity: 0.7,
                  }}
                >
                  Free
                </span>
              )}
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: "var(--accent-primary)",
                  opacity: 0,
                  transition: "opacity 150ms ease",
                }}
                className="group-hover:opacity-100"
              >
                →
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ marginTop: 16 }}>
        <Link
          href="/tools"
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: 13,
            color: "var(--accent-primary)",
            textDecoration: "none",
          }}
        >
          Browse the full archive →
        </Link>
      </div>
    </div>
  );
}
