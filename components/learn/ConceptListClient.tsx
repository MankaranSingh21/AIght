"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const READ_KEY = "aight_learn_read";
const MASTERED_KEY = "aight_learn_mastered";

type Concept = {
  slug: string;
  title: string;
  tagline: string;
  readTime: string;
};

export default function ConceptListClient({ concepts }: { concepts: Concept[] }) {
  const [read, setRead] = useState<string[]>([]);
  const [mastered, setMastered] = useState<string[]>([]);

  useEffect(() => {
    function load() {
      try {
        setRead(JSON.parse(localStorage.getItem(READ_KEY) ?? "[]"));
        setMastered(JSON.parse(localStorage.getItem(MASTERED_KEY) ?? "[]"));
      } catch {}
    }
    load();
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, []);

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: 1,
    }}>
      {concepts.map((concept) => {
        const isRead = read.includes(concept.slug);
        const isMastered = mastered.includes(concept.slug);
        return (
          <Link
            key={concept.slug}
            href={`/learn/${concept.slug}`}
            style={{ textDecoration: "none" }}
            className="group"
          >
            <div style={{
              padding: "20px 0",
              borderBottom: "1px solid rgba(245,239,224,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              ...(isMastered ? { borderLeft: "2px solid var(--accent-primary)", paddingLeft: 12 } : {}),
              ...(isRead && !isMastered ? { opacity: 0.75 } : {}),
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: 15,
                  fontWeight: 600,
                  color: isMastered ? "var(--accent-primary)" : "var(--text-primary)",
                  margin: "0 0 4px",
                  letterSpacing: "-0.01em",
                  transition: "color 150ms ease",
                }}
                  className={isMastered ? "" : "group-hover:text-accent"}
                >
                  {concept.title}
                  {isMastered && (
                    <span style={{ marginLeft: 8, fontSize: 11, opacity: 0.7 }}>✓</span>
                  )}
                </h3>
                <p style={{
                  fontFamily: "var(--font-editorial)",
                  fontStyle: "italic",
                  fontSize: 13,
                  color: "rgba(245,239,224,0.45)",
                  margin: 0,
                  lineHeight: 1.5,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}>
                  {concept.tagline}
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                {isRead && !isMastered && (
                  <span style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    letterSpacing: "0.08em",
                    color: "rgba(170,255,77,0.5)",
                    textTransform: "uppercase",
                  }}>
                    read
                  </span>
                )}
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: 10,
                  color: "rgba(245,239,224,0.25)",
                  letterSpacing: "0.06em",
                }}>
                  {concept.readTime}
                </span>
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: 12,
                  color: "var(--accent-primary)",
                  opacity: 0,
                  transition: "opacity 150ms ease",
                }}
                  className="group-hover:opacity-100"
                >
                  →
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
