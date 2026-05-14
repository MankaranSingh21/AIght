"use client";
import { useState } from "react";

type Sentence = { text: string; hallucinated: boolean; explanation: string };
type Round = { intro: string; sentences: Sentence[] };

const ROUNDS: Round[] = [
  {
    intro: "An AI assistant explains the history of the internet.",
    sentences: [
      {
        text: "The World Wide Web was invented by Tim Berners-Lee in 1989.",
        hallucinated: false,
        explanation: "True — Berners-Lee proposed the WWW at CERN in 1989.",
      },
      {
        text: "The first web browser, called Mosaic, was released by CERN in 1991.",
        hallucinated: true,
        explanation: "Fabricated — Mosaic was created by NCSA at the University of Illinois in 1993, not by CERN.",
      },
      {
        text: "The ARPANET, a precursor to the internet, launched in 1969.",
        hallucinated: false,
        explanation: "True — ARPANET's first nodes went live in October 1969.",
      },
    ],
  },
  {
    intro: "An AI summarises a scientific paper on climate change.",
    sentences: [
      {
        text: "Global average temperatures have risen approximately 1.1°C since the pre-industrial period.",
        hallucinated: false,
        explanation: "Accurate — IPCC AR6 confirms ~1.1°C of warming.",
      },
      {
        text: "Arctic sea ice extent has decreased by roughly 13% per decade since satellite records began.",
        hallucinated: false,
        explanation: "Accurate — NASA data confirms ~13% per decade decline in September ice extent.",
      },
      {
        text: "The paper concludes that solar activity accounts for 60% of recent warming.",
        hallucinated: true,
        explanation: "Fabricated — the scientific consensus attributes over 90% of recent warming to human activities, not solar activity.",
      },
    ],
  },
  {
    intro: "An AI describes how large language models work.",
    sentences: [
      {
        text: "LLMs are trained on large corpora of text to predict the next token.",
        hallucinated: false,
        explanation: "Accurate — autoregressive next-token prediction is the core training objective.",
      },
      {
        text: "GPT-4 contains approximately 1 trillion parameters, making it the largest model ever built.",
        hallucinated: true,
        explanation: "Fabricated — OpenAI hasn't disclosed GPT-4's parameter count, and several models (e.g., Google's Switch Transformer at 1.6T) are publicly known to exceed that estimate.",
      },
      {
        text: "Transformer models use attention mechanisms to weigh the importance of different tokens.",
        hallucinated: false,
        explanation: "Accurate — self-attention is the defining mechanism of the transformer architecture.",
      },
    ],
  },
  {
    intro: "An AI gives a biography of Marie Curie.",
    sentences: [
      {
        text: "Marie Curie was the first woman to win a Nobel Prize.",
        hallucinated: false,
        explanation: "True — she won in Physics in 1903.",
      },
      {
        text: "She was born in Warsaw, Poland, in 1867, and moved to Paris to study at the Sorbonne.",
        hallucinated: false,
        explanation: "Accurate — she was born in Warsaw (then under Russian rule) in 1867 and studied in Paris.",
      },
      {
        text: "Her daughter, Irène Joliot-Curie, won the Nobel Prize in Chemistry in 1935 for discovering radioactivity.",
        hallucinated: true,
        explanation: "Partially fabricated — Irène did win the 1935 Nobel Prize in Chemistry, but it was for the synthesis of new radioactive elements, not for discovering radioactivity (which Marie and Pierre Curie pioneered).",
      },
    ],
  },
  {
    intro: "An AI explains quantum computing.",
    sentences: [
      {
        text: "Unlike classical bits, qubits can exist in a superposition of 0 and 1 simultaneously.",
        hallucinated: false,
        explanation: "Accurate — superposition is a fundamental property of qubits.",
      },
      {
        text: "IBM's quantum computer achieved quantum supremacy in 2019 by completing a task in 200 seconds that would take a classical computer 10,000 years.",
        hallucinated: true,
        explanation: "Fabricated — it was Google's Sycamore processor that achieved the claimed quantum supremacy milestone in 2019, not IBM.",
      },
      {
        text: "Quantum entanglement allows qubits to be correlated in ways that have no classical equivalent.",
        hallucinated: false,
        explanation: "Accurate — entanglement is a key resource for quantum algorithms and communication protocols.",
      },
    ],
  },
];

export default function HallucinationSpotter() {
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [scores, setScores] = useState<boolean[]>([]);
  const [done, setDone] = useState(false);

  const current = ROUNDS[round];
  const hallucinatedIdx = current.sentences.findIndex((s) => s.hallucinated);

  function pick(idx: number) {
    if (selected !== null) return;
    setSelected(idx);
    setScores((prev) => [...prev, idx === hallucinatedIdx]);
  }

  function next() {
    if (round < ROUNDS.length - 1) {
      setRound((r) => r + 1);
      setSelected(null);
    } else {
      setDone(true);
    }
  }

  function restart() {
    setRound(0);
    setSelected(null);
    setScores([]);
    setDone(false);
  }

  const finalScore = scores.filter(Boolean).length;

  if (done) {
    return (
      <div style={{
        background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-xl)", padding: "32px", margin: "32px 0", textAlign: "center",
      }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent-primary)", marginBottom: 12 }}>
          Hallucination Spotter
        </p>
        <p style={{ fontFamily: "var(--font-display)", fontSize: 48, fontWeight: 700, color: finalScore >= 4 ? "var(--accent-primary)" : finalScore >= 2 ? "var(--accent-warm)" : "var(--error)", margin: "0 0 8px", lineHeight: 1 }}>
          {finalScore} / 5
        </p>
        <p style={{ fontFamily: "var(--font-editorial)", fontStyle: "italic", fontSize: 16, color: "var(--text-secondary)", marginBottom: 24 }}>
          {finalScore === 5 ? "Perfect. You're a natural fact-checker." : finalScore >= 3 ? "Good instincts — AI is subtle about what it makes up." : "Hallucinations are genuinely hard to spot. That's the problem."}
        </p>
        <button onClick={restart} style={{
          fontFamily: "var(--font-ui)", fontSize: 13, fontWeight: 500,
          padding: "8px 20px", borderRadius: "var(--radius-md)",
          background: "var(--accent-primary)", color: "var(--text-inverse)", border: "none", cursor: "pointer",
        }}>
          Play again
        </button>
      </div>
    );
  }

  return (
    <div style={{
      background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-xl)", padding: "28px 32px", margin: "32px 0",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent-primary)", margin: 0 }}>
          Hallucination Spotter
        </p>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>
          Round {round + 1} / {ROUNDS.length}
        </span>
      </div>

      <p style={{ fontFamily: "var(--font-editorial)", fontStyle: "italic", fontSize: 14, color: "var(--text-secondary)", marginBottom: 20 }}>
        {current.intro} Click the sentence you think is fabricated.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {current.sentences.map((s, i) => {
          const isSelected = selected === i;
          const isCorrect = i === hallucinatedIdx;
          let bg = "rgba(255,250,240,0.02)";
          let border = "var(--border-subtle)";
          let color = "var(--text-primary)";

          if (selected !== null) {
            if (isCorrect) { bg = "rgba(170,255,77,0.07)"; border = "rgba(170,255,77,0.4)"; color = "var(--accent-primary)"; }
            else if (isSelected && !isCorrect) { bg = "rgba(224,112,112,0.08)"; border = "rgba(224,112,112,0.4)"; color = "var(--error)"; }
          }

          return (
            <div key={i}>
              <button
                onClick={() => pick(i)}
                style={{
                  width: "100%", textAlign: "left",
                  background: bg, border: `1px solid ${border}`,
                  borderRadius: "var(--radius-md)", padding: "14px 16px",
                  fontFamily: "var(--font-editorial)", fontSize: 14, color,
                  lineHeight: 1.7, cursor: selected === null ? "pointer" : "default",
                  transition: "all 200ms ease",
                }}
              >
                {s.text}
              </button>
              {selected !== null && isCorrect && (
                <p style={{
                  fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-secondary)",
                  margin: "6px 4px 0", lineHeight: 1.5,
                }}>
                  {s.explanation}
                </p>
              )}
              {selected !== null && isSelected && !isCorrect && (
                <p style={{
                  fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--error)",
                  margin: "6px 4px 0", lineHeight: 1.5,
                }}>
                  Not quite — {current.sentences[hallucinatedIdx].explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {selected !== null && (
        <button onClick={next} style={{
          marginTop: 20,
          fontFamily: "var(--font-ui)", fontSize: 13, fontWeight: 500,
          padding: "8px 20px", borderRadius: "var(--radius-md)",
          background: "var(--accent-primary)", color: "var(--text-inverse)", border: "none", cursor: "pointer",
        }}>
          {round < ROUNDS.length - 1 ? "Next round →" : "See score →"}
        </button>
      )}
    </div>
  );
}
