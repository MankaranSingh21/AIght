"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type RecommendedTool = {
  slug: string;
  name: string;
  vibe_description: string | null;
  category: string;
  is_free: boolean;
  matchReason: string;
};

type Props = {
  responsibilities: string[];
  riskCategory: "high" | "medium" | "low";
  aiToolsUsed?: string[];
  fieldName?: string;
};

export default function QuizToolRecs({ responsibilities, riskCategory, aiToolsUsed = [], fieldName }: Props) {
  const [tools, setTools] = useState<RecommendedTool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams({
      responsibilities: responsibilities.join(","),
      risk_category: riskCategory,
      ai_tools_used: aiToolsUsed.join(","),
    });
    fetch(`/api/quiz-tools?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setTools(data.tools ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [responsibilities, riskCategory, aiToolsUsed]);

  if (loading) return null;
  if (tools.length === 0) return null;

  return (
    <div
      style={{
        marginBottom: 40,
        padding: 28,
        borderRadius: 14,
        border: "1px solid rgba(170,255,77,0.18)",
        background: "rgba(170,255,77,0.03)",
      }}
    >
      <div style={{ marginBottom: 20 }}>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#AAFF4D",
            margin: "0 0 8px",
          }}
        >
          Your AI Toolkit
        </p>
        <p
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: 15,
            fontWeight: 600,
            color: "var(--text-primary)",
            margin: 0,
            letterSpacing: "-0.01em",
          }}
        >
          {fieldName
            ? `Tools worth learning for ${fieldName} work`
            : "Tools matched to your responsibilities"}
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tool/${tool.slug}`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 0",
              borderBottom: "1px solid rgba(245,239,224,0.06)",
              textDecoration: "none",
              gap: 16,
            }}
            className="group"
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 3 }}>
                <span
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    transition: "color 150ms ease",
                  }}
                  className="group-hover:text-accent"
                >
                  {tool.name}
                </span>
                {tool.is_free && (
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 9,
                      letterSpacing: "0.06em",
                      color: "var(--accent-primary)",
                      opacity: 0.7,
                      textTransform: "uppercase",
                    }}
                  >
                    Free
                  </span>
                )}
              </div>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: "0.05em",
                  color: "rgba(170,255,77,0.60)",
                  margin: 0,
                  textTransform: "uppercase",
                }}
              >
                {tool.matchReason}
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              <span className="tag">{tool.category}</span>
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

      <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
        <Link
          href="/tools"
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: 13,
            color: "var(--accent-primary)",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          Browse the full archive →
        </Link>
        {aiToolsUsed.length > 0 && aiToolsUsed[0] !== "none" && (
          <span
            style={{
              fontFamily: "var(--font-editorial)",
              fontStyle: "italic",
              fontSize: 12,
              color: "rgba(245,239,224,0.30)",
            }}
          >
            Tools you already use are filtered out.
          </span>
        )}
      </div>
    </div>
  );
}
