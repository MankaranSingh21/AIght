"use client";

import { useState, useId } from "react";
import { useRouter } from "next/navigation";

export interface ComparePickTool {
  slug: string;
  name: string;
  category: string | null;
}

interface Props {
  tools: ComparePickTool[];
  prefilledA?: string;
  prefilledB?: string;
}

export default function CompareSearch({ tools, prefilledA, prefilledB }: Props) {
  const [a, setA] = useState(prefilledA ?? "");
  const [b, setB] = useState(prefilledB ?? "");
  const router = useRouter();
  const aId = useId();
  const bId = useId();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!a || !b || a === b) return;
    router.push(`/compare?a=${encodeURIComponent(a)}&b=${encodeURIComponent(b)}`);
  }

  const ready = a && b && a !== b;

  return (
    <form
      onSubmit={handleSubmit}
      className="compare-search-form"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr auto",
        gap: "var(--space-3)",
        maxWidth: 720,
        margin: "0 auto",
      }}
    >
        <label htmlFor={aId} style={srOnly}>Tool A</label>
        <select
          id={aId}
          value={a}
          onChange={(e) => setA(e.target.value)}
          required
          style={selectStyle}
        >
          <option value="">Tool A…</option>
          {tools.map((t) => (
            <option key={t.slug} value={t.slug} disabled={t.slug === b}>
              {t.name}
            </option>
          ))}
        </select>

        <label htmlFor={bId} style={srOnly}>Tool B</label>
        <select
          id={bId}
          value={b}
          onChange={(e) => setB(e.target.value)}
          required
          style={selectStyle}
        >
          <option value="">Tool B…</option>
          {tools.map((t) => (
            <option key={t.slug} value={t.slug} disabled={t.slug === a}>
              {t.name}
            </option>
          ))}
        </select>

      <button
        type="submit"
        className="btn-primary"
        disabled={!ready}
        style={{ opacity: ready ? 1 : 0.5, cursor: ready ? "pointer" : "not-allowed" }}
      >
        Compare →
      </button>
    </form>
  );
}

const srOnly: React.CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0,0,0,0)",
  whiteSpace: "nowrap",
  border: 0,
};

const selectStyle: React.CSSProperties = {
  fontFamily: "var(--font-ui)",
  fontSize: 14,
  padding: "10px 14px",
  background: "var(--bg-elevated)",
  color: "var(--text-primary)",
  border: "1px solid var(--border-default)",
  borderRadius: "var(--radius-md)",
  cursor: "pointer",
  outline: "none",
  appearance: "auto",
};
