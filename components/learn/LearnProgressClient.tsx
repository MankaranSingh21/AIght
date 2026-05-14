"use client";
import { useEffect, useState } from "react";

const READ_KEY = "aight_learn_read";
const MASTERED_KEY = "aight_learn_mastered";
const TOTAL = 14;

export default function LearnProgressClient() {
  const [read, setRead] = useState(0);
  const [mastered, setMastered] = useState(0);

  useEffect(() => {
    function load() {
      try {
        const r: string[] = JSON.parse(localStorage.getItem(READ_KEY) ?? "[]");
        const m: string[] = JSON.parse(localStorage.getItem(MASTERED_KEY) ?? "[]");
        setRead(r.length);
        setMastered(m.length);
      } catch {}
    }
    load();
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, []);

  if (read === 0 && mastered === 0) return null;

  const pct = Math.round((read / TOTAL) * 100);

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 16,
      padding: "12px 20px",
      borderRadius: 10,
      background: "rgba(170,255,77,0.05)",
      border: "1px solid rgba(170,255,77,0.15)",
      marginBottom: 32,
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.08em",
            color: "var(--accent-primary)",
          }}>
            {read} / {TOTAL} concepts read
            {mastered > 0 && ` · ${mastered} mastered`}
          </span>
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "rgba(245,239,224,0.35)",
          }}>
            {pct}%
          </span>
        </div>
        <div style={{
          height: 3,
          background: "rgba(170,255,77,0.12)",
          borderRadius: 2,
          overflow: "hidden",
        }}>
          <div style={{
            height: "100%",
            width: `${pct}%`,
            background: "var(--accent-primary)",
            borderRadius: 2,
            transition: "width 600ms cubic-bezier(0.16,1,0.3,1)",
          }} />
        </div>
      </div>
    </div>
  );
}
