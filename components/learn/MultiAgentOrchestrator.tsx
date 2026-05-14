"use client";
import { useState } from "react";

const AGENTS = [
  { id: "researcher", label: "Researcher", color: "var(--accent-secondary)" },
  { id: "writer", label: "Writer", color: "var(--accent-primary)" },
  { id: "fact_checker", label: "Fact-checker", color: "var(--accent-warm)" },
  { id: "publisher", label: "Publisher", color: "#A373D7" },
] as const;
type AgentId = (typeof AGENTS)[number]["id"];

const TASKS = [
  { id: "search", label: "Search academic databases", validAgents: ["researcher"] as AgentId[], parallel: true, duration: 3 },
  { id: "outline", label: "Create report outline", validAgents: ["researcher", "writer"] as AgentId[], parallel: false, duration: 2 },
  { id: "draft", label: "Write first draft", validAgents: ["writer"] as AgentId[], parallel: false, duration: 5 },
  { id: "verify", label: "Verify all claims", validAgents: ["fact_checker"] as AgentId[], parallel: true, duration: 4 },
  { id: "edit", label: "Edit and polish prose", validAgents: ["writer"] as AgentId[], parallel: false, duration: 3 },
  { id: "publish", label: "Format & publish report", validAgents: ["publisher"] as AgentId[], parallel: false, duration: 1 },
] as const;
type TaskId = (typeof TASKS)[number]["id"];

type Phase = "assign" | "simulate" | "done";

export default function MultiAgentOrchestrator() {
  const [assignments, setAssignments] = useState<Partial<Record<TaskId, AgentId>>>({});
  const [phase, setPhase] = useState<Phase>("assign");
  const [simStep, setSimStep] = useState(0);
  const [failures, setFailures] = useState<TaskId[]>([]);

  function assign(taskId: TaskId, agentId: AgentId) {
    if (phase !== "assign") return;
    setAssignments((prev) => ({ ...prev, [taskId]: agentId }));
  }

  function allAssigned() {
    return TASKS.every((t) => assignments[t.id]);
  }

  function getInvalidTasks(): TaskId[] {
    return TASKS.filter(
      (t) => assignments[t.id] && !t.validAgents.includes(assignments[t.id]!)
    ).map((t) => t.id);
  }

  function run() {
    const invalid = getInvalidTasks();
    setFailures(invalid);
    setPhase("simulate");
    setSimStep(0);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      setSimStep(step);
      if (step >= TASKS.length) {
        clearInterval(interval);
        setTimeout(() => setPhase("done"), 600);
      }
    }, 700);
  }

  function reset() {
    setAssignments({});
    setPhase("assign");
    setSimStep(0);
    setFailures([]);
  }

  const invalid = getInvalidTasks();
  const completedSteps = phase === "simulate" || phase === "done" ? simStep : 0;

  return (
    <div style={{
      background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-xl)", padding: "28px 32px", margin: "32px 0",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent-primary)", margin: 0 }}>
          Multi-Agent Orchestrator
        </p>
        {phase !== "assign" && (
          <button onClick={reset} style={{
            fontFamily: "var(--font-mono)", fontSize: 10, padding: "4px 10px",
            borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)",
            background: "transparent", color: "var(--text-muted)", cursor: "pointer",
          }}>
            Reset
          </button>
        )}
      </div>

      <p style={{ fontFamily: "var(--font-editorial)", fontStyle: "italic", fontSize: 14, color: "var(--text-secondary)", marginBottom: 20 }}>
        Goal: publish a research report. Assign each task to an agent, then run the pipeline.
      </p>

      {/* Agent legend */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
        {AGENTS.map((a) => (
          <span key={a.id} style={{
            fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.06em",
            padding: "4px 10px", borderRadius: "var(--radius-full)",
            border: `1px solid ${a.color}55`, background: `${a.color}11`,
            color: a.color,
          }}>
            {a.label}
          </span>
        ))}
      </div>

      {/* Task list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {TASKS.map((task, idx) => {
          const assigned = assignments[task.id];
          const agent = AGENTS.find((a) => a.id === assigned);
          const isInvalid = invalid.includes(task.id);
          const isFailed = failures.includes(task.id);
          const isCompleted = completedSteps > idx;
          const isRunning = completedSteps === idx && phase === "simulate";

          let borderColor = "var(--border-subtle)";
          let bg = "rgba(255,250,240,0.02)";
          if (isFailed) { borderColor = "rgba(224,112,112,0.5)"; bg = "rgba(224,112,112,0.06)"; }
          else if (isCompleted) { borderColor = "rgba(170,255,77,0.3)"; bg = "rgba(170,255,77,0.04)"; }
          else if (isRunning) { borderColor = "rgba(170,255,77,0.6)"; bg = "rgba(170,255,77,0.08)"; }
          else if (isInvalid && phase === "assign") { borderColor = "rgba(244,171,31,0.5)"; bg = "rgba(244,171,31,0.05)"; }

          return (
            <div key={task.id} style={{
              border: `1px solid ${borderColor}`,
              borderRadius: "var(--radius-md)",
              padding: "12px 16px",
              background: bg,
              transition: "all 300ms ease",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{
                      fontFamily: "var(--font-mono)", fontSize: 10,
                      color: "var(--text-muted)", width: 16,
                    }}>
                      {idx + 1}
                    </span>
                    <span style={{
                      fontFamily: "var(--font-ui)", fontSize: 13, fontWeight: 500,
                      color: isFailed ? "var(--error)" : isCompleted ? "var(--accent-primary)" : "var(--text-primary)",
                    }}>
                      {task.label}
                    </span>
                    {task.parallel && (
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--accent-secondary)", letterSpacing: "0.06em" }}>
                        parallel
                      </span>
                    )}
                  </div>
                  {isInvalid && phase === "assign" && (
                    <p style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--accent-warm)", margin: "4px 0 0 24px" }}>
                      Wrong agent — should be: {task.validAgents.map((a) => AGENTS.find((ag) => ag.id === a)?.label).join(" or ")}
                    </p>
                  )}
                  {isFailed && (
                    <p style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--error)", margin: "4px 0 0 24px" }}>
                      Task failed — {AGENTS.find((a) => a.id === assigned)?.label} cannot do this. Pipeline stalled.
                    </p>
                  )}
                </div>

                {phase === "assign" ? (
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {AGENTS.map((a) => (
                      <button
                        key={a.id}
                        onClick={() => assign(task.id, a.id)}
                        style={{
                          fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.04em",
                          padding: "4px 8px", borderRadius: "var(--radius-sm)",
                          border: `1px solid ${assigned === a.id ? a.color : "var(--border-subtle)"}`,
                          background: assigned === a.id ? `${a.color}18` : "transparent",
                          color: assigned === a.id ? a.color : "var(--text-muted)",
                          cursor: "pointer", transition: "all 150ms ease",
                        }}
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {agent && (
                      <span style={{
                        fontFamily: "var(--font-mono)", fontSize: 10, padding: "3px 8px",
                        borderRadius: "var(--radius-full)", border: `1px solid ${agent.color}55`,
                        background: `${agent.color}11`, color: agent.color,
                      }}>
                        {agent.label}
                      </span>
                    )}
                    {isCompleted && !isFailed && (
                      <span style={{ color: "var(--accent-primary)", fontSize: 14 }}>✓</span>
                    )}
                    {isRunning && (
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--accent-primary)" }}>
                        running…
                      </span>
                    )}
                    {isFailed && (
                      <span style={{ color: "var(--error)", fontSize: 14 }}>✗</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {phase === "assign" && (
        <button
          onClick={run}
          disabled={!allAssigned()}
          style={{
            marginTop: 20,
            fontFamily: "var(--font-ui)", fontSize: 13, fontWeight: 500,
            padding: "8px 20px", borderRadius: "var(--radius-md)",
            background: allAssigned() ? "var(--accent-primary)" : "rgba(170,255,77,0.3)",
            color: allAssigned() ? "var(--text-inverse)" : "rgba(0,0,0,0.4)",
            border: "none", cursor: allAssigned() ? "pointer" : "not-allowed",
          }}
        >
          Run pipeline →
        </button>
      )}

      {phase === "done" && (
        <div style={{
          marginTop: 20, padding: "14px 16px",
          borderRadius: "var(--radius-md)",
          background: failures.length > 0 ? "rgba(224,112,112,0.06)" : "rgba(170,255,77,0.06)",
          border: `1px solid ${failures.length > 0 ? "rgba(224,112,112,0.3)" : "rgba(170,255,77,0.3)"}`,
        }}>
          <p style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: failures.length > 0 ? "var(--error)" : "var(--accent-primary)", margin: 0, lineHeight: 1.5 }}>
            {failures.length > 0
              ? `Pipeline failed at ${failures.length} task(s). Wrong agent assignments create bottlenecks and failures — orchestration requires precise role matching.`
              : "Pipeline complete! Every task was matched to the right agent. Real multi-agent systems use capability declarations and routing logic to achieve this automatically."}
          </p>
        </div>
      )}
    </div>
  );
}
