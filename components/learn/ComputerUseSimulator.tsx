"use client";
import { useState } from "react";

type StepStatus = "pending" | "approved" | "rejected" | "cascading";

const STEPS: {
  id: number;
  title: string;
  screenshot: string;
  action: string;
  safeToApprove: boolean;
  warning?: string;
  cascadeNote?: string;
}[] = [
  {
    id: 1,
    title: "Search for Italian restaurants",
    screenshot: "🔍 [Browser] google.com/search?q=italian+restaurant+near+me",
    action: 'Type "italian restaurant near me" in Google search',
    safeToApprove: true,
  },
  {
    id: 2,
    title: "Open restaurant page",
    screenshot: "📄 [Browser] yelp.com → Piccolo Trattoria — ★★★★☆ (482 reviews) — Open until 10 PM",
    action: "Click on 'Piccolo Trattoria' listing",
    safeToApprove: true,
  },
  {
    id: 3,
    title: "Navigate to reservation form",
    screenshot: "📅 [Browser] resy.com → Reserve table at Piccolo Trattoria\nDate: [tomorrow]\nParty size: [2]\nTime: [7:00 PM ▼]",
    action: "Click 'Make a Reservation' button",
    safeToApprove: true,
  },
  {
    id: 4,
    title: "Select time slot",
    screenshot: "🕐 Available times: 6:30 PM ✓  |  7:00 PM ✓  |  7:30 PM ✓\n[Agent selects: 9:00 PM]",
    action: "Select 9:00 PM time slot",
    safeToApprove: false,
    warning: "You mentioned 7 PM. The agent selected 9:00 PM. Approving this will book the wrong time.",
  },
  {
    id: 5,
    title: "Submit reservation with card",
    screenshot: "💳 Confirm reservation\nPiccolo Trattoria — tomorrow, 9:00 PM, party of 2\n[Credit card ending in 4242 on file]\n[Confirm reservation — $25 hold]",
    action: "Click 'Confirm Reservation' — charges $25 hold to your card",
    safeToApprove: false,
    warning: "This places a $25 hold and locks in 9:00 PM (already wrong). Approving both errors compounds the damage.",
    cascadeNote: "This step only appears because you approved the wrong time in step 4. One bad approval cascades.",
  },
  {
    id: 6,
    title: "Confirmation sent",
    screenshot: "✉️ Confirmation email sent to user@email.com\nPiccolo Trattoria — tomorrow 9:00 PM — 2 guests\nCancellation policy: 24h notice required or $25 fee charged",
    action: "Reservation confirmed — email sent",
    safeToApprove: true,
  },
];

export default function ComputerUseSimulator() {
  const [stepStatuses, setStepStatuses] = useState<Record<number, StepStatus>>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [done, setDone] = useState(false);

  function approve(stepId: number) {
    const step = STEPS.find((s) => s.id === stepId)!;
    if (!step.safeToApprove) {
      setStepStatuses((prev) => ({ ...prev, [stepId]: "approved" }));
    } else {
      setStepStatuses((prev) => ({ ...prev, [stepId]: "approved" }));
    }
    const nextId = stepId + 1;
    const nextStep = STEPS.find((s) => s.id === nextId);
    if (nextStep) {
      if (nextStep.cascadeNote && !stepStatuses[stepId - 1]) {
        setStepStatuses((prev) => ({ ...prev, [nextId]: "cascading" }));
      }
      setCurrentStep(nextId);
    } else {
      setDone(true);
    }
  }

  function reject(stepId: number) {
    setStepStatuses((prev) => ({ ...prev, [stepId]: "rejected" }));
    setDone(true);
  }

  function reset() {
    setStepStatuses({});
    setCurrentStep(1);
    setDone(false);
  }

  const mistakes = Object.entries(stepStatuses).filter(([id, s]) => {
    const step = STEPS.find((step) => step.id === Number(id))!;
    return s === "approved" && !step.safeToApprove;
  }).length;

  return (
    <div style={{
      background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-xl)", padding: "28px 32px", margin: "32px 0",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent-primary)", margin: 0 }}>
          Computer Use Simulator
        </p>
        <button onClick={reset} style={{
          fontFamily: "var(--font-mono)", fontSize: 10, padding: "4px 10px",
          borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)",
          background: "transparent", color: "var(--text-muted)", cursor: "pointer",
        }}>
          Reset
        </button>
      </div>
      <p style={{ fontFamily: "var(--font-editorial)", fontStyle: "italic", fontSize: 14, color: "var(--text-secondary)", marginBottom: 24 }}>
        Task: "Book an Italian restaurant for tomorrow at 7 PM for 2 people." Review each agent action — approve or reject.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {STEPS.map((step) => {
          const status = stepStatuses[step.id];
          const isActive = step.id === currentStep && !done;
          const isPast = step.id < currentStep || done;
          const isFuture = step.id > currentStep && !done;

          let borderColor = "var(--border-subtle)";
          let bg = "rgba(255,250,240,0.02)";
          if (status === "approved" && step.safeToApprove) { borderColor = "rgba(170,255,77,0.3)"; bg = "rgba(170,255,77,0.04)"; }
          if (status === "approved" && !step.safeToApprove) { borderColor = "rgba(224,112,112,0.4)"; bg = "rgba(224,112,112,0.06)"; }
          if (status === "rejected") { borderColor = "rgba(244,171,31,0.3)"; bg = "rgba(244,171,31,0.04)"; }
          if (isActive) { borderColor = "rgba(170,255,77,0.5)"; bg = "rgba(170,255,77,0.03)"; }

          return (
            <div key={step.id} style={{
              border: `1px solid ${borderColor}`, borderRadius: "var(--radius-md)",
              padding: "14px 16px", background: bg,
              opacity: isFuture ? 0.4 : 1,
              transition: "all 200ms ease",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: 10, width: 20, height: 20,
                  borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  background: status === "approved" && step.safeToApprove ? "var(--accent-primary)" :
                              status === "approved" ? "var(--error)" :
                              status === "rejected" ? "var(--accent-warm)" :
                              isActive ? "rgba(170,255,77,0.3)" : "rgba(255,255,255,0.1)",
                  color: status === "approved" || status === "rejected" ? "var(--bg-base)" : "var(--text-muted)",
                  flexShrink: 0,
                }}>
                  {status === "approved" && step.safeToApprove ? "✓" :
                   status === "approved" ? "✗" :
                   status === "rejected" ? "—" : step.id}
                </span>
                <span style={{ fontFamily: "var(--font-ui)", fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>
                  Step {step.id}: {step.title}
                </span>
              </div>

              {(isActive || isPast) && (
                <>
                  <div style={{
                    fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-secondary)",
                    background: "var(--bg-elevated)", borderRadius: "var(--radius-sm)",
                    padding: "10px 12px", marginBottom: 10, lineHeight: 1.7, whiteSpace: "pre",
                  }}>
                    {step.screenshot}
                  </div>
                  <p style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-secondary)", marginBottom: 10, lineHeight: 1.5 }}>
                    <strong>Proposed action:</strong> {step.action}
                  </p>
                </>
              )}

              {step.cascadeNote && isPast && status === "approved" && (
                <p style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--error)", marginBottom: 8, lineHeight: 1.5 }}>
                  ⚠ {step.cascadeNote}
                </p>
              )}

              {!step.safeToApprove && (isActive || (isPast && status)) && step.warning && (
                <div style={{ padding: "8px 10px", background: "rgba(224,112,112,0.08)", border: "1px solid rgba(224,112,112,0.25)", borderRadius: "var(--radius-sm)", marginBottom: 10 }}>
                  <p style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--error)", margin: 0, lineHeight: 1.5 }}>
                    ⚠ {step.warning}
                  </p>
                </div>
              )}

              {isActive && !status && (
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => approve(step.id)} style={{
                    fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 500,
                    padding: "6px 16px", borderRadius: "var(--radius-md)",
                    background: "var(--accent-primary)", color: "var(--text-inverse)", border: "none", cursor: "pointer",
                  }}>
                    Approve →
                  </button>
                  <button onClick={() => reject(step.id)} style={{
                    fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 500,
                    padding: "6px 16px", borderRadius: "var(--radius-md)",
                    background: "transparent", color: "var(--accent-warm)",
                    border: "1px solid rgba(244,171,31,0.4)", cursor: "pointer",
                  }}>
                    Stop task
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {done && (
        <div style={{
          marginTop: 20, padding: "16px 18px",
          borderRadius: "var(--radius-md)",
          background: mistakes > 0 ? "rgba(224,112,112,0.06)" : "rgba(170,255,77,0.06)",
          border: `1px solid ${mistakes > 0 ? "rgba(224,112,112,0.3)" : "rgba(170,255,77,0.3)"}`,
        }}>
          <p style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: mistakes > 0 ? "var(--error)" : "var(--accent-primary)", margin: 0, lineHeight: 1.6 }}>
            {mistakes > 0
              ? `${mistakes} wrong approval(s) — you now have a reservation at the wrong time with a $25 hold. This is why every step in a computer-use pipeline needs human review when high-stakes actions are involved.`
              : stepStatuses[currentStep] === "rejected"
              ? "Task stopped before damage was done. In real deployments, pause-and-confirm checkpoints are essential for irreversible actions."
              : "Task completed successfully. You caught the wrong time and stopped the agent before committing."}
          </p>
        </div>
      )}
    </div>
  );
}
