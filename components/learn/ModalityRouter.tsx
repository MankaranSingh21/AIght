"use client";
import { useState } from "react";

const MODALITIES = [
  { id: "text", label: "Text only", color: "var(--accent-primary)" },
  { id: "image_text", label: "Image + text", color: "var(--accent-warm)" },
  { id: "audio_text", label: "Audio + text", color: "var(--accent-secondary)" },
  { id: "video_text", label: "Video + text", color: "#A373D7" },
] as const;
type ModalityId = (typeof MODALITIES)[number]["id"];

const TASKS: {
  id: string;
  description: string;
  answer: ModalityId;
  explanation: string;
}[] = [
  {
    id: "transcribe",
    description: "Transcribe a customer service phone call",
    answer: "audio_text",
    explanation: "The source is spoken audio. You need a model that can process audio waveforms and convert them to text — text-only models can't hear.",
  },
  {
    id: "medical_scan",
    description: "Describe what's in a medical imaging scan",
    answer: "image_text",
    explanation: "Medical scans are visual data. An image+text model can analyze pixel-level patterns that a text-only model would never see.",
  },
  {
    id: "legal_doc",
    description: "Summarise a 40-page legal contract",
    answer: "text",
    explanation: "Text is text — no other modality is involved. A strong text model is the most efficient and accurate choice here.",
  },
  {
    id: "youtube",
    description: "Identify the main argument made in a YouTube lecture",
    answer: "video_text",
    explanation: "A lecture combines spoken audio, visual slides, and context. Video+text models can process all three streams together.",
  },
  {
    id: "product_photo",
    description: "Generate an alt-text description for a product photo",
    answer: "image_text",
    explanation: "Alt text requires understanding what's visually present. Only an image+text model can see the image.",
  },
  {
    id: "meeting_notes",
    description: "Turn a recorded meeting into structured action items",
    answer: "audio_text",
    explanation: "The source is an audio recording. Transcription + understanding requires audio+text capability.",
  },
  {
    id: "code_review",
    description: "Review a pull request diff for bugs",
    answer: "text",
    explanation: "Code is structured text. No visual or audio component — a code-capable text model is ideal.",
  },
  {
    id: "ad_analysis",
    description: "Analyse sentiment in a video advertisement",
    answer: "video_text",
    explanation: "Ads combine visuals, music, narration, and pacing. A video+text model can capture all these signals together.",
  },
];

export default function ModalityRouter() {
  const [answers, setAnswers] = useState<Record<string, ModalityId>>({});
  const [submitted, setSubmitted] = useState(false);

  function pick(taskId: string, modality: ModalityId) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [taskId]: modality }));
  }

  const allAnswered = TASKS.every((t) => answers[t.id]);
  const score = submitted ? TASKS.filter((t) => answers[t.id] === t.answer).length : null;

  function reset() {
    setAnswers({});
    setSubmitted(false);
  }

  return (
    <div style={{
      background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-xl)", padding: "28px 32px", margin: "32px 0",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent-primary)", margin: 0 }}>
          Modality Router
        </p>
        {submitted && (
          <button onClick={reset} style={{
            fontFamily: "var(--font-mono)", fontSize: 10, padding: "4px 10px",
            borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)",
            background: "transparent", color: "var(--text-muted)", cursor: "pointer",
          }}>
            Try again
          </button>
        )}
      </div>

      <p style={{ fontFamily: "var(--font-editorial)", fontStyle: "italic", fontSize: 14, color: "var(--text-secondary)", marginBottom: 20 }}>
        For each task, pick the right input modality combination.
      </p>

      {/* Legend */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
        {MODALITIES.map((m) => (
          <span key={m.id} style={{
            fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.04em",
            padding: "4px 10px", borderRadius: "var(--radius-full)",
            border: `1px solid ${m.color}55`, background: `${m.color}11`, color: m.color,
          }}>
            {m.label}
          </span>
        ))}
      </div>

      {score !== null && (
        <div style={{
          display: "flex", alignItems: "baseline", gap: 10,
          marginBottom: 20, padding: "14px 16px",
          borderRadius: "var(--radius-md)",
          background: score >= 6 ? "rgba(170,255,77,0.06)" : "rgba(244,171,31,0.06)",
          border: `1px solid ${score >= 6 ? "rgba(170,255,77,0.3)" : "rgba(244,171,31,0.3)"}`,
        }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 700, color: score >= 6 ? "var(--accent-primary)" : "var(--accent-warm)", lineHeight: 1 }}>
            {score}
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-secondary)" }}>
            / {TASKS.length} correct
          </span>
          <span style={{ fontFamily: "var(--font-editorial)", fontStyle: "italic", fontSize: 13, color: "var(--text-secondary)", marginLeft: 8 }}>
            {score === TASKS.length ? "Perfect routing." : score >= 6 ? "Good instincts." : "Tricky ones below — see the explanations."}
          </span>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {TASKS.map((task) => {
          const chosen = answers[task.id];
          const isCorrect = submitted && chosen === task.answer;
          const isWrong = submitted && chosen && chosen !== task.answer;
          const correctModality = MODALITIES.find((m) => m.id === task.answer);

          return (
            <div key={task.id} style={{
              border: `1px solid ${isCorrect ? "rgba(170,255,77,0.3)" : isWrong ? "rgba(224,112,112,0.3)" : "var(--border-subtle)"}`,
              borderRadius: "var(--radius-md)", padding: "14px 16px",
              background: isCorrect ? "rgba(170,255,77,0.04)" : isWrong ? "rgba(224,112,112,0.04)" : "rgba(255,250,240,0.02)",
              transition: "all 200ms ease",
            }}>
              <p style={{ fontFamily: "var(--font-ui)", fontSize: 13, fontWeight: 500, color: "var(--text-primary)", margin: "0 0 10px" }}>
                {task.description}
              </p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {MODALITIES.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => pick(task.id, m.id)}
                    style={{
                      fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.04em",
                      padding: "4px 10px", borderRadius: "var(--radius-sm)",
                      border: `1px solid ${chosen === m.id ? m.color : "var(--border-subtle)"}`,
                      background: chosen === m.id ? `${m.color}18` : "transparent",
                      color: chosen === m.id ? m.color : "var(--text-muted)",
                      cursor: submitted ? "default" : "pointer",
                      transition: "all 150ms ease",
                      opacity: submitted && m.id !== task.answer && chosen !== m.id ? 0.4 : 1,
                    }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
              {submitted && (
                <p style={{
                  fontFamily: "var(--font-ui)", fontSize: 11,
                  color: isCorrect ? "var(--accent-primary)" : isWrong ? "var(--error)" : "var(--text-muted)",
                  margin: "8px 0 0", lineHeight: 1.5,
                }}>
                  {isCorrect ? `✓ ${task.explanation}` : `✗ Answer: ${correctModality?.label} — ${task.explanation}`}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {!submitted && (
        <button
          onClick={() => setSubmitted(true)}
          disabled={!allAnswered}
          style={{
            marginTop: 20,
            fontFamily: "var(--font-ui)", fontSize: 13, fontWeight: 500,
            padding: "8px 20px", borderRadius: "var(--radius-md)",
            background: allAnswered ? "var(--accent-primary)" : "rgba(170,255,77,0.3)",
            color: allAnswered ? "var(--text-inverse)" : "rgba(0,0,0,0.4)",
            border: "none", cursor: allAnswered ? "pointer" : "not-allowed",
          }}
        >
          Check answers →
        </button>
      )}
    </div>
  );
}
