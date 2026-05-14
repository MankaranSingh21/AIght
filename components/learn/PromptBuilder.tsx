"use client";
import { useState, useCallback } from "react";

type Task = "summarise" | "write_code" | "explain";

const TASKS: { id: Task; label: string }[] = [
  { id: "summarise", label: "Summarise" },
  { id: "write_code", label: "Write code" },
  { id: "explain", label: "Explain a concept" },
];

const DIMS = ["Clarity", "Specificity", "Context", "Format", "Constraints"] as const;

const REWRITES: Record<Task, (prompt: string) => string> = {
  summarise: (p) =>
    p.length < 20
      ? `Summarise the following text in 3 bullet points, each under 15 words. Focus on the key takeaway, the main evidence, and the call to action: [paste your text here]`
      : `Summarise the following in 3 concise bullet points (max 15 words each). Prioritise: (1) the main claim, (2) key supporting evidence, (3) the practical implication.\n\n${p}`,
  write_code: (p) =>
    p.length < 20
      ? `Write a Python function called process_data(records: list[dict]) -> list[dict] that filters records where the "active" field is True, sorts by "created_at" descending, and returns the top 10. Include type hints and a docstring.`
      : `Write a function that ${p.toLowerCase().replace(/^write|^create|^build/i, "").trim()}. Include: type hints, a one-sentence docstring, and one usage example in a comment.`,
  explain: (p) =>
    p.length < 20
      ? `Explain retrieval-augmented generation (RAG) to a software engineer who knows ML basics but has never built a RAG pipeline. Use an analogy to a search engine. Keep it under 200 words.`
      : `Explain ${p} to someone with a technical background but no prior exposure to this concept. Use one concrete analogy. Limit your response to 200 words.`,
};

function scorePrompt(text: string, task: Task): number[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const len = words.length;
  const lower = text.toLowerCase();

  const clarity = Math.min(100, len < 5 ? 10 : len < 15 ? 45 : len < 30 ? 75 : 88);
  const specificity =
    /[0-9]|bullet|word|sentence|function|class|json|csv|list|table/.test(lower)
      ? Math.min(100, 60 + Math.min(40, len * 1.2))
      : Math.min(60, len * 1.5);
  const context =
    /context|background|assume|given that|my|our|the project|the codebase/.test(lower)
      ? Math.min(100, 55 + len)
      : Math.min(45, len * 1.2);
  const format =
    /bullet|numbered|markdown|json|table|paragraph|one sentence|under \d+ word/.test(lower)
      ? Math.min(100, 65 + len * 0.8)
      : Math.min(40, len);
  const constraints =
    /don't|do not|avoid|only|limit|max|minimum|no more than|must not|never/.test(lower)
      ? Math.min(100, 70 + len * 0.6)
      : Math.min(35, len * 0.9);

  return [clarity, specificity, context, format, constraints].map(Math.round);
}

const DIM_COLORS = [
  "var(--accent-primary)",
  "var(--accent-secondary)",
  "var(--accent-warm)",
  "#A373D7",
  "#E07070",
];

export default function PromptBuilder() {
  const [task, setTask] = useState<Task>("summarise");
  const [prompt, setPrompt] = useState("");
  const [scores, setScores] = useState<number[] | null>(null);
  const [showRewrite, setShowRewrite] = useState(false);

  const analyse = useCallback(() => {
    setScores(scorePrompt(prompt, task));
    setShowRewrite(false);
  }, [prompt, task]);

  const overall = scores ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;

  return (
    <div style={{
      background: "var(--bg-surface)",
      border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-xl)",
      padding: "28px 32px",
      margin: "32px 0",
    }}>
      <p style={{
        fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em",
        textTransform: "uppercase", color: "var(--accent-primary)", marginBottom: 16,
      }}>
        Prompt Builder
      </p>

      {/* Task selector */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {TASKS.map((t) => (
          <button
            key={t.id}
            onClick={() => { setTask(t.id); setScores(null); setShowRewrite(false); }}
            style={{
              fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.06em",
              padding: "6px 14px", borderRadius: "var(--radius-sm)",
              border: `1px solid ${task === t.id ? "var(--accent-primary)" : "var(--border-subtle)"}`,
              background: task === t.id ? "rgba(170,255,77,0.1)" : "transparent",
              color: task === t.id ? "var(--accent-primary)" : "var(--text-muted)",
              cursor: "pointer", transition: "all 150ms ease",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Textarea */}
      <textarea
        value={prompt}
        onChange={(e) => { setPrompt(e.target.value); setScores(null); setShowRewrite(false); }}
        placeholder="Write your prompt here…"
        rows={4}
        style={{
          width: "100%", boxSizing: "border-box",
          background: "var(--bg-elevated)", border: "1px solid var(--border-default)",
          borderRadius: "var(--radius-md)", padding: "12px 14px",
          fontFamily: "var(--font-editorial)", fontSize: 14, color: "var(--text-primary)",
          lineHeight: 1.7, resize: "vertical", outline: "none",
        }}
      />

      <button
        onClick={analyse}
        style={{
          marginTop: 12,
          fontFamily: "var(--font-ui)", fontSize: 13, fontWeight: 500,
          padding: "8px 20px", borderRadius: "var(--radius-md)",
          background: "var(--accent-primary)", color: "var(--text-inverse)",
          border: "none", cursor: "pointer",
        }}
      >
        Score my prompt →
      </button>

      {/* Scores */}
      {scores && (
        <div style={{ marginTop: 24 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 20 }}>
            <span style={{
              fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 700,
              color: overall! >= 65 ? "var(--accent-primary)" : overall! >= 40 ? "var(--accent-warm)" : "var(--error)",
              lineHeight: 1,
            }}>
              {overall}
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>
              / 100 overall
            </span>
          </div>

          {DIMS.map((dim, i) => (
            <div key={dim} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-secondary)" }}>
                  {dim}
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: DIM_COLORS[i] }}>
                  {scores[i]}
                </span>
              </div>
              <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${scores[i]}%`,
                  background: DIM_COLORS[i],
                  borderRadius: 2,
                  transition: "width 500ms cubic-bezier(0.16,1,0.3,1)",
                }} />
              </div>
            </div>
          ))}

          <button
            onClick={() => setShowRewrite((v) => !v)}
            style={{
              marginTop: 16,
              fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 500,
              padding: "7px 16px", borderRadius: "var(--radius-md)",
              background: "transparent", color: "var(--accent-primary)",
              border: "1px solid rgba(170,255,77,0.3)", cursor: "pointer",
            }}
          >
            {showRewrite ? "Hide rewrite" : "Show improved version →"}
          </button>

          {showRewrite && (
            <div style={{
              marginTop: 14,
              background: "rgba(170,255,77,0.04)",
              border: "1px solid rgba(170,255,77,0.18)",
              borderRadius: "var(--radius-md)",
              padding: "14px 16px",
            }}>
              <p style={{
                fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em",
                textTransform: "uppercase", color: "var(--accent-primary)", marginBottom: 8,
              }}>
                Improved prompt
              </p>
              <p style={{
                fontFamily: "var(--font-editorial)", fontSize: 14, color: "var(--text-primary)",
                lineHeight: 1.75, margin: 0,
              }}>
                {REWRITES[task](prompt)}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
