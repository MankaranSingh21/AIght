"use client";
import { useState } from "react";

const PROBLEMS: {
  id: string;
  label: string;
  prompt: string;
  standard: string;
  reasoning: { steps: string[]; answer: string };
}[] = [
  {
    id: "logic",
    label: "Logic puzzle",
    prompt: "Alice, Bob, and Carol each have a different pet: a cat, a dog, and a fish. Alice doesn't have the cat. Bob doesn't have the dog. Carol doesn't have the fish. Who has what?",
    standard: "Alice has the dog, Bob has the fish, Carol has the cat.",
    reasoning: {
      steps: [
        "List the constraints: Alice ≠ cat, Bob ≠ dog, Carol ≠ fish.",
        "Carol ≠ fish, and the options are {cat, dog, fish}. So Carol has cat or dog.",
        "Alice ≠ cat, so Alice has dog or fish.",
        "Bob ≠ dog, so Bob has cat or fish.",
        "Try Carol = cat → Bob can have dog or fish. But Bob ≠ dog, so Bob = fish. That leaves Alice = dog. Check: Alice ≠ cat ✓, Bob ≠ dog ✓, Carol ≠ fish ✓. Valid.",
        "Try Carol = dog → Then Bob ≠ dog is satisfied elsewhere. Alice ≠ cat, so Alice = fish. Bob = cat. Check: Alice ≠ cat ✓, Bob ≠ dog ✓, Carol ≠ fish ✓. Also valid.",
        "Both solutions satisfy the constraints as given. The puzzle has two valid answers: (Alice=dog, Bob=fish, Carol=cat) OR (Alice=fish, Bob=cat, Carol=dog).",
      ],
      answer: "The puzzle has two valid solutions: Alice=dog/Bob=fish/Carol=cat, OR Alice=fish/Bob=cat/Carol=dog. A standard model often picks one without noting the ambiguity.",
    },
  },
  {
    id: "maths",
    label: "Maths",
    prompt: "A train travels from A to B at 60 mph. It returns from B to A at 40 mph. What is the average speed for the entire trip?",
    standard: "50 mph.",
    reasoning: {
      steps: [
        "Intuition says average of 60 and 40 = 50 mph. But is that right?",
        "Average speed = total distance / total time. Let distance A→B = d.",
        "Time A→B = d/60. Time B→A = d/40.",
        "Total time = d/60 + d/40 = 2d/120 + 3d/120 = 5d/120 = d/24.",
        "Total distance = 2d.",
        "Average speed = 2d / (d/24) = 2d × 24/d = 48 mph.",
        "The correct answer is 48 mph, not 50. The simple average fails because the slower return leg takes more time.",
      ],
      answer: "48 mph — not 50. The harmonic mean applies here, not the arithmetic mean. Reasoning models catch this; standard models often say 50.",
    },
  },
  {
    id: "ambiguous",
    label: "Ambiguous instruction",
    prompt: "Edit my code so the tests don't fail.",
    standard: "I'll fix the bugs in your code to make the tests pass. Please share the code and test output.",
    reasoning: {
      steps: [
        "The literal instruction is 'make tests not fail.' Multiple strategies satisfy this literally.",
        "Option A: Fix the actual bugs. This is what the user probably wants.",
        "Option B: Delete the failing tests. Tests no longer run → can't fail. Technically satisfies the literal request.",
        "Option C: Add special-case code that detects test execution and forces passing values.",
        "Option D: Comment out the tests.",
        "Options B-D satisfy the literal request but violate the spirit. A reward-hacking AI might pursue them.",
        "The intended interpretation requires inferring that 'tests don't fail' means 'the code is correct' — not 'tests are removed.'",
        "This is Goodhart's Law in action: optimising the measure (test pass/fail) rather than the goal (working code).",
      ],
      answer: "The right answer is to fix the code — but this requires inferring intent, not just following instructions literally. Reasoning models surface this ambiguity rather than taking the easy path.",
    },
  },
];

export default function ReasoningTrace() {
  const [problem, setProblem] = useState(PROBLEMS[0].id);
  const [mode, setMode] = useState<"standard" | "reasoning">("standard");
  const [expanded, setExpanded] = useState(false);

  const current = PROBLEMS.find((p) => p.id === problem)!;

  return (
    <div style={{
      background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-xl)", padding: "28px 32px", margin: "32px 0",
    }}>
      <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent-primary)", marginBottom: 16 }}>
        Reasoning Trace
      </p>

      {/* Problem tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {PROBLEMS.map((p) => (
          <button key={p.id} onClick={() => { setProblem(p.id); setExpanded(false); }} style={{
            fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.06em",
            padding: "5px 12px", borderRadius: "var(--radius-sm)",
            border: `1px solid ${problem === p.id ? "var(--accent-primary)" : "var(--border-subtle)"}`,
            background: problem === p.id ? "rgba(170,255,77,0.1)" : "transparent",
            color: problem === p.id ? "var(--accent-primary)" : "var(--text-muted)", cursor: "pointer",
          }}>
            {p.label}
          </button>
        ))}
      </div>

      {/* Prompt */}
      <div style={{ padding: "12px 16px", background: "var(--bg-elevated)", borderRadius: "var(--radius-md)", marginBottom: 20 }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 6 }}>
          Prompt
        </p>
        <p style={{ fontFamily: "var(--font-editorial)", fontSize: 14, color: "var(--text-primary)", margin: 0, lineHeight: 1.7 }}>
          {current.prompt}
        </p>
      </div>

      {/* Mode toggle */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {(["standard", "reasoning"] as const).map((m) => (
          <button key={m} onClick={() => setMode(m)} style={{
            fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.06em",
            padding: "5px 12px", borderRadius: "var(--radius-sm)", cursor: "pointer",
            border: `1px solid ${mode === m ? (m === "reasoning" ? "#A373D7" : "var(--border-default)") : "var(--border-subtle)"}`,
            background: mode === m ? (m === "reasoning" ? "rgba(163,115,215,0.1)" : "rgba(255,255,255,0.05)") : "transparent",
            color: mode === m ? (m === "reasoning" ? "#A373D7" : "var(--text-primary)") : "var(--text-muted)",
          }}>
            {m === "standard" ? "Standard output" : "Reasoning model"}
          </button>
        ))}
      </div>

      {/* Output */}
      {mode === "standard" ? (
        <div style={{
          padding: "16px 18px", background: "rgba(255,250,240,0.03)",
          border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)",
        }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>
            Standard output
          </p>
          <p style={{ fontFamily: "var(--font-editorial)", fontSize: 14, color: "var(--text-primary)", margin: 0, lineHeight: 1.7 }}>
            {current.standard}
          </p>
        </div>
      ) : (
        <div style={{ border: "1px solid rgba(163,115,215,0.3)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
          {/* Thinking steps (collapsible) */}
          <button
            onClick={() => setExpanded((v) => !v)}
            style={{
              width: "100%", textAlign: "left", padding: "12px 16px",
              background: "rgba(163,115,215,0.06)", border: "none", borderBottom: "1px solid rgba(163,115,215,0.2)",
              cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center",
            }}
          >
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#A373D7" }}>
              Thinking ({current.reasoning.steps.length} steps)
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#A373D7" }}>
              {expanded ? "▲" : "▼"}
            </span>
          </button>

          {expanded && (
            <div style={{ padding: "14px 16px", background: "rgba(163,115,215,0.04)", borderBottom: "1px solid rgba(163,115,215,0.2)" }}>
              {current.reasoning.steps.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#A373D7", flexShrink: 0, paddingTop: 2 }}>
                    {i + 1}.
                  </span>
                  <p style={{ fontFamily: "var(--font-editorial)", fontSize: 13, color: "var(--text-secondary)", margin: 0, lineHeight: 1.65 }}>
                    {step}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div style={{ padding: "14px 16px", background: "rgba(163,115,215,0.03)" }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "#A373D7", marginBottom: 8 }}>
              Final answer
            </p>
            <p style={{ fontFamily: "var(--font-editorial)", fontSize: 14, color: "var(--text-primary)", margin: 0, lineHeight: 1.7 }}>
              {current.reasoning.answer}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
