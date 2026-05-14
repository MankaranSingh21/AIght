"use client";
import { useState } from "react";

const SCENARIOS: {
  id: string;
  question: string;
  answers: { level: string; label: string; response: string; color: string; trustScore: number; explanation: string }[];
}[] = [
  {
    id: "drug",
    question: "Is melatonin safe to take every night long-term?",
    answers: [
      {
        level: "ungrounded",
        label: "Ungrounded",
        color: "var(--error)",
        trustScore: 32,
        response: "Yes, melatonin is completely safe to take every night. It's a natural hormone your body already produces, so there are no real risks to long-term use. Most people find 10mg works well.",
        explanation: "No source cited. 10mg is the highest dose sold but not the recommended starting dose (0.5–1mg). 'Completely safe' and 'no real risks' are unsupported overstatements.",
      },
      {
        level: "retrieval",
        label: "Retrieval-grounded",
        color: "var(--accent-warm)",
        trustScore: 71,
        response: "According to a 2022 JAMA Pediatrics study, melatonin use has increased dramatically but long-term safety data beyond 3 months is limited. Short-term use (up to 3 months) at low doses (0.5–5mg) appears generally safe for adults. Long-term nightly use lacks robust clinical trial data. The NIH recommends starting with the lowest effective dose.",
        explanation: "Cites a real study and the NIH. Appropriately hedged — 'limited data' rather than false certainty. Still relies on the LLM's ability to faithfully represent the retrieved content.",
      },
      {
        level: "tool",
        label: "Tool-grounded",
        color: "var(--accent-primary)",
        trustScore: 91,
        response: "[PubMed query: 'melatonin long-term safety adults' → 847 results] [NIH MedlinePlus API call → retrieved: 'Melatonin supplements appear safe for short-term use. Long-term safety: insufficient evidence. Recommended dose: 0.5–5mg, 30–60 min before sleep.']\n\nBased on retrieved NIH guidance and peer-reviewed data: short-term melatonin use (≤3 months) at low doses is well-tolerated. There is insufficient clinical evidence for routine long-term nightly use. Start with 0.5–1mg.",
        explanation: "Tool calls are visible and auditable. The response quotes retrieved text directly. You can verify the source independently — the model is acting as a transparent interface to authoritative data.",
      },
    ],
  },
  {
    id: "climate",
    question: "How much has global temperature risen since 1850?",
    answers: [
      {
        level: "ungrounded",
        label: "Ungrounded",
        color: "var(--error)",
        trustScore: 41,
        response: "Global temperatures have risen by about 2 degrees Celsius since the industrial revolution. Scientists are increasingly concerned that we are approaching dangerous tipping points.",
        explanation: "The figure is wrong — consensus is ~1.1–1.2°C (IPCC AR6, 2021). A plausible-sounding but incorrect number stated with confidence.",
      },
      {
        level: "retrieval",
        label: "Retrieval-grounded",
        color: "var(--accent-warm)",
        trustScore: 78,
        response: "According to the IPCC Sixth Assessment Report (AR6, 2021), global surface temperature has increased by approximately 1.1°C above 1850–1900 levels. The report notes this warming is unequivocally caused by human influence.",
        explanation: "Correct figure from a real source. However, the model retrieved this from its context — the document could theoretically have been manipulated. Better than ungrounded, but less auditable than a live API call.",
      },
      {
        level: "tool",
        label: "Tool-grounded",
        color: "var(--accent-primary)",
        trustScore: 95,
        response: "[NASA GISS Surface Temperature Analysis API → retrieved: Global mean temp anomaly (2023 vs 1951–1980 baseline): +1.17°C] [IPCC AR6 Summary for Policymakers → retrieved: 'Global surface temperature was 1.09°C higher in 2011–2020 than 1850–1900.']\n\nCurrent NASA GISS data shows approximately +1.17°C warming relative to the 1951–1980 baseline. IPCC AR6 reports 1.09°C relative to the 1850–1900 pre-industrial baseline. Both indicate roughly 1.1°C of warming.",
        explanation: "Live data query + cited IPCC source. The small difference between baselines is explained rather than hidden. Fully auditable — you can run the same API query yourself.",
      },
    ],
  },
];

export default function GroundingMeter() {
  const [scenario, setScenario] = useState(SCENARIOS[0].id);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [revealed, setRevealed] = useState(false);

  const current = SCENARIOS.find((s) => s.id === scenario)!;

  function rate(level: string, val: number) {
    if (revealed) return;
    setRatings((prev) => ({ ...prev, [`${scenario}-${level}`]: val }));
  }

  function reveal() { setRevealed(true); }

  const allRated = current.answers.every((a) => (ratings[`${scenario}-${a.level}`] ?? 0) > 0);

  return (
    <div style={{
      background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-xl)", padding: "28px 32px", margin: "32px 0",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent-primary)", margin: 0 }}>
          Grounding Meter
        </p>
        {revealed && (
          <button onClick={() => { setRevealed(false); setRatings({}); }} style={{
            fontFamily: "var(--font-mono)", fontSize: 10, padding: "4px 10px",
            borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)",
            background: "transparent", color: "var(--text-muted)", cursor: "pointer",
          }}>
            Reset
          </button>
        )}
      </div>

      {/* Scenario tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {SCENARIOS.map((s) => (
          <button key={s.id} onClick={() => { setScenario(s.id); setRevealed(false); setRatings({}); }} style={{
            fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.06em",
            padding: "5px 12px", borderRadius: "var(--radius-sm)",
            border: `1px solid ${scenario === s.id ? "var(--accent-primary)" : "var(--border-subtle)"}`,
            background: scenario === s.id ? "rgba(170,255,77,0.1)" : "transparent",
            color: scenario === s.id ? "var(--accent-primary)" : "var(--text-muted)", cursor: "pointer",
          }}>
            {s.id === "drug" ? "Health question" : "Science fact"}
          </button>
        ))}
      </div>

      <div style={{ padding: "12px 16px", background: "var(--bg-elevated)", borderRadius: "var(--radius-md)", marginBottom: 20 }}>
        <p style={{ fontFamily: "var(--font-editorial)", fontSize: 14, color: "var(--text-primary)", margin: 0, lineHeight: 1.7, fontStyle: "italic" }}>
          Q: {current.question}
        </p>
      </div>

      <p style={{ fontFamily: "var(--font-editorial)", fontStyle: "italic", fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>
        Rate how much you'd trust each answer (1 = wouldn't trust, 10 = fully trust), then reveal the analysis.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {current.answers.map((a) => {
          const myRating = ratings[`${scenario}-${a.level}`] ?? 0;
          return (
            <div key={a.level} style={{
              border: `1px solid ${revealed ? `${a.color}40` : "var(--border-subtle)"}`,
              borderRadius: "var(--radius-md)", padding: "14px 16px",
              background: revealed ? `${a.color}08` : "rgba(255,250,240,0.02)",
              transition: "all 300ms ease",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: a.color }}>
                  {a.label}
                </span>
                <div style={{ display: "flex", gap: 12 }}>
                  {myRating > 0 && <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>You: {myRating}/10</span>}
                  {revealed && <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: a.color }}>Expert: {a.trustScore}/100</span>}
                </div>
              </div>

              <p style={{ fontFamily: "var(--font-editorial)", fontSize: 13, color: "var(--text-primary)", lineHeight: 1.7, marginBottom: 12, whiteSpace: "pre-wrap" }}>
                {a.response}
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)" }}>Your trust:</span>
                <input
                  type="range" min={1} max={10} step={1}
                  value={myRating || 5}
                  onChange={(e) => rate(a.level, Number(e.target.value))}
                  disabled={revealed}
                  style={{ flex: 1, accentColor: a.color }}
                />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-secondary)", width: 30 }}>
                  {myRating || "–"}/10
                </span>
              </div>

              {revealed && (
                <p style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-secondary)", margin: "10px 0 0", lineHeight: 1.6 }}>
                  {a.explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {!revealed && (
        <button
          onClick={reveal}
          disabled={!allRated}
          style={{
            marginTop: 20,
            fontFamily: "var(--font-ui)", fontSize: 13, fontWeight: 500,
            padding: "8px 20px", borderRadius: "var(--radius-md)",
            background: allRated ? "var(--accent-primary)" : "rgba(170,255,77,0.3)",
            color: allRated ? "var(--text-inverse)" : "rgba(0,0,0,0.4)",
            border: "none", cursor: allRated ? "pointer" : "not-allowed",
          }}
        >
          Reveal analysis →
        </button>
      )}
    </div>
  );
}
