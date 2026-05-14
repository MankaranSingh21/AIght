"use client";
import { useState, useCallback } from "react";

type Phase = "pretraining" | "instruction" | "rlhf";

const PHASES: { id: Phase; label: string; color: string }[] = [
  { id: "pretraining", label: "Pretraining", color: "var(--accent-secondary)" },
  { id: "instruction", label: "Instruction tuning", color: "var(--accent-primary)" },
  { id: "rlhf", label: "RLHF", color: "#A373D7" },
];

// Pre-computed loss curves (steps 0–99)
function makeCurve(start: number, end: number, noise: number, wobble = 0): number[] {
  return Array.from({ length: 100 }, (_, i) => {
    const decay = start * Math.exp(-3 * (i / 99)) + end;
    const n = (Math.random() - 0.5) * noise;
    const w = wobble ? Math.sin(i * 0.4) * wobble * (1 - i / 99) : 0;
    return Math.max(0.05, decay + n + w);
  });
}

const TRAIN_CURVES: Record<Phase, number[]> = {
  pretraining: makeCurve(4.5, 0.3, 0.08),
  instruction: makeCurve(1.2, 0.15, 0.04),
  rlhf: makeCurve(0.6, 0.1, 0.03, 0.06),
};

const EVAL_CURVES: Record<Phase, number[]> = {
  pretraining: makeCurve(4.5, 0.4, 0.06),
  instruction: makeCurve(1.3, 0.22, 0.05),
  rlhf: makeCurve(0.65, 0.15, 0.04, 0.04),
};

const CHECKPOINTS: { step: number; label: string; outputs: Record<Phase, string> }[] = [
  {
    step: 5,
    label: "Very early",
    outputs: {
      pretraining: "The cat sat on the mat. The cat sat on the mat. The cat sat on the…",
      instruction: "Sure! Here is information about: [repetitive generic response]",
      rlhf: "I can help with that. [generic, non-committal]",
    },
  },
  {
    step: 25,
    label: "Early",
    outputs: {
      pretraining: "Paris is the capital of France. It is located in northern France along the Seine River. Paris has a population of…",
      instruction: "The capital of France is Paris. It is a major European city known for the Eiffel Tower.",
      rlhf: "Paris is the capital of France, a beautiful city famous for its art, culture, and the iconic Eiffel Tower.",
    },
  },
  {
    step: 50,
    label: "Mid-training",
    outputs: {
      pretraining: "The mitochondria is the powerhouse of the cell. It produces ATP through oxidative phosphorylation, a process that…",
      instruction: "Explain photosynthesis: Plants use sunlight, water, and CO₂ to produce glucose and oxygen through chlorophyll.",
      rlhf: "Great question! Photosynthesis is how plants convert sunlight into food — they take in CO₂ and water, and release oxygen as a byproduct.",
    },
  },
  {
    step: 75,
    label: "Late",
    outputs: {
      pretraining: "Machine learning models learn statistical patterns from data. Deep neural networks use multiple layers of computation to…",
      instruction: "To sort a list in Python: use `list.sort()` for in-place sorting or `sorted(list)` to return a new sorted list.",
      rlhf: "Here's how to sort a list in Python:\n- `my_list.sort()` — modifies the list in place\n- `sorted(my_list)` — returns a new sorted list without modifying the original\n\nWhich approach works better depends on whether you need the original order preserved.",
    },
  },
  {
    step: 98,
    label: "Fully trained",
    outputs: {
      pretraining: "Transformer models use self-attention mechanisms to capture long-range dependencies in sequences, enabling parallel computation unlike RNNs…",
      instruction: "Recursion in programming: a function calls itself with a smaller subproblem until it reaches a base case. Example: factorial(n) = n × factorial(n-1), with factorial(0) = 1.",
      rlhf: "Recursion is a technique where a function solves a problem by calling itself on simpler versions of the same problem.\n\n**Example — factorial:**\n```python\ndef factorial(n):\n    if n == 0:\n        return 1  # base case\n    return n * factorial(n - 1)\n```\nThe key insight: every recursive function needs a *base case* to stop the recursion, and each call must move closer to that base case.",
    },
  },
];

const W = 580, H = 160, PAD = { top: 12, right: 12, bottom: 24, left: 36 };

function toSVG(values: number[], maxVal: number): string {
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  return values
    .map((v, i) => {
      const x = PAD.left + (i / (values.length - 1)) * innerW;
      const y = PAD.top + innerH - (v / maxVal) * innerH;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export default function TrainingLossViz() {
  const [phase, setPhase] = useState<Phase>("pretraining");
  const [showEval, setShowEval] = useState(false);
  const [playhead, setPlayhead] = useState(50);
  const [checkpoint, setCheckpoint] = useState<number | null>(null);

  const trainCurve = TRAIN_CURVES[phase];
  const evalCurve = EVAL_CURVES[phase];

  const maxVal = Math.max(...trainCurve, ...evalCurve) * 1.05;
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const playheadX = PAD.left + (playhead / 99) * innerW;

  const nearestCheckpoint = CHECKPOINTS.reduce((prev, curr) =>
    Math.abs(curr.step - playhead) < Math.abs(prev.step - playhead) ? curr : prev
  );

  const activeCP = checkpoint !== null ? CHECKPOINTS.find((c) => c.step === checkpoint) : null;

  const trainY = (v: number) => PAD.top + innerH - (v / maxVal) * innerH;

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => ({
    val: +(maxVal * f).toFixed(1),
    y: trainY(maxVal * f),
  }));

  return (
    <div style={{
      background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-xl)", padding: "28px 32px", margin: "32px 0",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent-primary)", margin: 0 }}>
          Training Loss
        </p>
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)" }}>Show eval</span>
          <input type="checkbox" checked={showEval} onChange={(e) => setShowEval(e.target.checked)} />
        </label>
      </div>

      {/* Phase tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {PHASES.map((p) => (
          <button key={p.id} onClick={() => { setPhase(p.id); setCheckpoint(null); }} style={{
            fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.06em",
            padding: "5px 12px", borderRadius: "var(--radius-sm)",
            border: `1px solid ${phase === p.id ? p.color : "var(--border-subtle)"}`,
            background: phase === p.id ? `${p.color}15` : "transparent",
            color: phase === p.id ? p.color : "var(--text-muted)", cursor: "pointer",
          }}>
            {p.label}
          </button>
        ))}
      </div>

      {/* SVG chart */}
      <div style={{ overflowX: "auto" }}>
        <svg
          width={W} height={H}
          style={{ display: "block", cursor: "col-resize", userSelect: "none" }}
          onMouseMove={useCallback((e: React.MouseEvent<SVGSVGElement>) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const relX = e.clientX - rect.left - PAD.left;
            const step = Math.round((relX / innerW) * 99);
            setPlayhead(Math.max(0, Math.min(99, step)));
          }, [innerW])}
          onClick={useCallback(() => {
            setCheckpoint(nearestCheckpoint.step);
          }, [nearestCheckpoint])}
        >
          {/* Y-axis ticks */}
          {yTicks.map((t) => (
            <g key={t.val}>
              <line x1={PAD.left - 4} y1={t.y} x2={PAD.left} y2={t.y} stroke="rgba(245,239,224,0.2)" strokeWidth={1} />
              <text x={PAD.left - 6} y={t.y + 4} textAnchor="end" fill="rgba(245,239,224,0.3)" fontSize={9} fontFamily="var(--font-mono)">
                {t.val}
              </text>
            </g>
          ))}

          {/* Axes */}
          <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={H - PAD.bottom} stroke="rgba(245,239,224,0.15)" strokeWidth={1} />
          <line x1={PAD.left} y1={H - PAD.bottom} x2={W - PAD.right} y2={H - PAD.bottom} stroke="rgba(245,239,224,0.15)" strokeWidth={1} />

          {/* Checkpoint dots */}
          {CHECKPOINTS.map((cp) => {
            const x = PAD.left + (cp.step / 99) * innerW;
            const y = trainY(trainCurve[cp.step]);
            return (
              <circle key={cp.step} cx={x} cy={y} r={4}
                fill={checkpoint === cp.step ? "var(--accent-primary)" : "rgba(170,255,77,0.3)"}
                stroke="var(--accent-primary)" strokeWidth={1}
                style={{ cursor: "pointer" }}
              />
            );
          })}

          {/* Eval curve */}
          {showEval && (
            <path
              d={toSVG(evalCurve, maxVal)}
              fill="none"
              stroke={PHASES.find((p) => p.id === phase)!.color}
              strokeWidth={1.5}
              strokeDasharray="4,3"
              opacity={0.5}
            />
          )}

          {/* Train curve */}
          <path
            d={toSVG(trainCurve, maxVal)}
            fill="none"
            stroke={PHASES.find((p) => p.id === phase)!.color}
            strokeWidth={2}
          />

          {/* Playhead */}
          <line
            x1={playheadX} y1={PAD.top}
            x2={playheadX} y2={H - PAD.bottom}
            stroke="rgba(245,239,224,0.3)" strokeWidth={1} strokeDasharray="3,3"
          />
          <text x={playheadX + 4} y={PAD.top + 12} fill="rgba(245,239,224,0.4)" fontSize={9} fontFamily="var(--font-mono)">
            step {playhead}
          </text>
        </svg>
      </div>

      <p style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-muted)", margin: "6px 0 16px" }}>
        Move mouse over chart to scrub. Click a dot to see a sample output at that checkpoint.
        {showEval && " Dashed = eval loss. Gap between lines = overfitting."}
      </p>

      {/* Checkpoint output */}
      {activeCP && (
        <div style={{
          background: "rgba(170,255,77,0.04)", border: "1px solid rgba(170,255,77,0.2)",
          borderRadius: "var(--radius-md)", padding: "14px 16px",
        }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent-primary)", marginBottom: 8 }}>
            Sample output — {activeCP.label} ({phase})
          </p>
          <p style={{
            fontFamily: "var(--font-editorial)", fontSize: 13, color: "var(--text-primary)",
            lineHeight: 1.75, margin: 0, whiteSpace: "pre-wrap",
          }}>
            {activeCP.outputs[phase]}
          </p>
        </div>
      )}
    </div>
  );
}
