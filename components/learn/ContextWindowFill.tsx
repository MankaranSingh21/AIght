"use client";
import { useState, useMemo } from "react";

const SEGMENT_TYPES = [
  { id: "system", label: "System prompt", color: "#A373D7" },
  { id: "history", label: "Chat history", color: "var(--accent-secondary)" },
  { id: "docs", label: "Retrieved docs", color: "var(--accent-warm)" },
  { id: "query", label: "New query", color: "var(--accent-primary)" },
] as const;

type SegId = (typeof SEGMENT_TYPES)[number]["id"];

const WINDOW_OPTIONS = [
  { label: "8k", tokens: 8_000 },
  { label: "32k", tokens: 32_000 },
  { label: "128k", tokens: 128_000 },
  { label: "200k", tokens: 200_000 },
];

const MAX_TOKENS_PER_SLIDER = 8_000;

export default function ContextWindowFill() {
  const [windowIdx, setWindowIdx] = useState(1);
  const [vals, setVals] = useState<Record<SegId, number>>({
    system: 1000, history: 2000, docs: 1500, query: 200,
  });

  const window = WINDOW_OPTIONS[windowIdx];
  const total = Object.values(vals).reduce((a, b) => a + b, 0);
  const overflow = total > window.tokens;
  const pct = Math.min(100, (total / window.tokens) * 100);

  const segments = useMemo(() =>
    SEGMENT_TYPES.map((s) => ({
      ...s,
      tokens: vals[s.id],
      pct: Math.min(100, (vals[s.id] / window.tokens) * 100),
    })),
    [vals, window.tokens]);

  function setVal(id: SegId, v: number) {
    setVals((prev) => ({ ...prev, [id]: v }));
  }

  function fmt(n: number) {
    return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`;
  }

  return (
    <div style={{
      background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-xl)", padding: "28px 32px", margin: "32px 0",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent-primary)", margin: 0 }}>
          Context Window Fill
        </p>
        <div style={{ display: "flex", gap: 6 }}>
          {WINDOW_OPTIONS.map((opt, i) => (
            <button key={opt.label} onClick={() => setWindowIdx(i)} style={{
              fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.06em",
              padding: "4px 10px", borderRadius: "var(--radius-sm)",
              border: `1px solid ${i === windowIdx ? "var(--accent-primary)" : "var(--border-subtle)"}`,
              background: i === windowIdx ? "rgba(170,255,77,0.1)" : "transparent",
              color: i === windowIdx ? "var(--accent-primary)" : "var(--text-muted)",
              cursor: "pointer",
            }}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "32px", alignItems: "start" }}>
        {/* Visual bucket */}
        <div style={{ width: 56, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-muted)", letterSpacing: "0.06em" }}>
            {fmt(total)}
          </span>
          <div style={{
            width: 48, height: 220,
            border: `2px solid ${overflow ? "var(--error)" : "var(--border-default)"}`,
            borderRadius: "0 0 8px 8px",
            background: "rgba(0,0,0,0.2)",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column-reverse",
            transition: "border-color 300ms ease",
          }}>
            {segments.map((s) => (
              <div key={s.id} style={{
                width: "100%",
                height: `${s.pct}%`,
                background: overflow ? `${s.color}99` : s.color,
                transition: "height 300ms cubic-bezier(0.16,1,0.3,1), background 300ms ease",
                flexShrink: 0,
              }} />
            ))}
            {overflow && (
              <div style={{
                position: "absolute",
                top: 0, left: 0, right: 0,
                height: `${100 - (window.tokens / total) * 100}%`,
                background: "rgba(224,112,112,0.25)",
                borderBottom: "2px dashed var(--error)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: "var(--error)", writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
                  OVERFLOW
                </span>
              </div>
            )}
          </div>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-muted)", letterSpacing: "0.06em" }}>
            {window.label}
          </span>
        </div>

        {/* Sliders */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {SEGMENT_TYPES.map((s) => (
            <div key={s.id}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: s.color }}>
                  {s.label}
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>
                  {fmt(vals[s.id])} tokens
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={MAX_TOKENS_PER_SLIDER}
                step={100}
                value={vals[s.id]}
                onChange={(e) => setVal(s.id, Number(e.target.value))}
                style={{ width: "100%", accentColor: s.color }}
              />
            </div>
          ))}

          {/* Total bar */}
          <div style={{ marginTop: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: overflow ? "var(--error)" : "var(--text-secondary)" }}>
                Total used
              </span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: overflow ? "var(--error)" : "var(--text-secondary)" }}>
                {fmt(total)} / {window.label} tokens{overflow ? " — EXCEEDS LIMIT" : ""}
              </span>
            </div>
            <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
              <div style={{
                height: "100%", width: `${pct}%`,
                background: overflow ? "var(--error)" : "var(--accent-primary)",
                borderRadius: 3, transition: "width 300ms cubic-bezier(0.16,1,0.3,1), background 300ms ease",
              }} />
            </div>
          </div>

          {overflow && (
            <p style={{
              fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--error)",
              background: "rgba(224,112,112,0.08)", border: "1px solid rgba(224,112,112,0.2)",
              borderRadius: "var(--radius-sm)", padding: "10px 12px", lineHeight: 1.6, margin: 0,
            }}>
              When input exceeds the context limit, the model truncates the oldest chat history first — meaning it may forget earlier parts of your conversation.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
