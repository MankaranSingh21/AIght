'use client';

import { useState } from 'react';
import { StepThrough } from './ConceptDemo';

// ── Types ─────────────────────────────────────────────────────────────────────

interface AgentBox {
  id: string;
  label: string;
  icon: string;
  output?: string;
  color: string;
}

// ── Data ──────────────────────────────────────────────────────────────────────

const TASK = 'Plan a 3-day Tokyo trip with $2,000 budget for two';

const COORDINATOR: AgentBox = {
  id: 'coordinator',
  label: 'Coordinator',
  icon: '⬡',
  color: 'var(--accent-primary)',
};

const SUB_AGENTS: AgentBox[] = [
  { id: 'researcher', label: 'Researcher', icon: '◎', color: 'var(--accent-secondary)', output: '5 venue options found:\n· Senso-ji\n· Shibuya Sky\n· teamLab Planets\n· Shinjuku Gyoen\n· Tsukiji Market' },
  { id: 'budgeter', label: 'Budgeter', icon: '◈', color: 'var(--accent-warm)', output: 'Daily caps set:\n· Accommodation: $120/night\n· Food: $80/day\n· Activities: $60/day\n· Transport: $20/day' },
  { id: 'planner', label: 'Planner', icon: '◉', color: 'var(--color-lavender)', output: 'Draft schedule:\n· Day 1: Asakusa + Ueno\n· Day 2: Shibuya + Harajuku\n· Day 3: Shinjuku + Akihabara' },
];

const FINAL_ITINERARY = `Day 1 — Asakusa & Ueno  ($185)
  9am  Senso-ji Temple (free)
  1pm  Ueno Park + Tokyo National Museum ($15)
  7pm  Dinner in Asakusa ($35)

Day 2 — Shibuya & Harajuku  ($200)
  10am Shibuya Sky observation ($22)
  2pm  Harajuku / Takeshita St (free)
  6pm  teamLab Planets ($35)
  8pm  Ramen dinner ($20)

Day 3 — Shinjuku & Tsukiji  ($175)
  7am  Tsukiji Market breakfast ($18)
  12pm Shinjuku Gyoen ($3)
  4pm  Shopping + close out ($80)

Total: $1,760 ✓ under budget`;

// ── Sub-components ─────────────────────────────────────────────────────────────

function AgentCard({
  agent,
  showOutput = false,
  dim = false,
}: {
  agent: AgentBox;
  showOutput?: boolean;
  dim?: boolean;
}) {
  return (
    <div
      style={{
        background: dim ? 'var(--bg-elevated)' : 'var(--bg-surface)',
        border: `1px solid ${dim ? 'var(--border-subtle)' : agent.color}`,
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-4)',
        opacity: dim ? 0.45 : 1,
        transition: 'all 200ms ease',
        minWidth: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: showOutput ? 'var(--space-3)' : 0 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', color: agent.color }}>
          {agent.icon}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            color: 'var(--text-primary)',
          }}
        >
          {agent.label}
        </span>
      </div>
      {showOutput && agent.output && (
        <pre
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            margin: 0,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {agent.output}
        </pre>
      )}
    </div>
  );
}

function Arrow({ label }: { label?: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--space-1)',
        color: 'var(--text-muted)',
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        letterSpacing: '0.05em',
      }}
    >
      {label && <span style={{ color: 'var(--accent-primary)', fontSize: '9px' }}>{label}</span>}
      <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>↓</span>
    </div>
  );
}

// ── Step bodies ────────────────────────────────────────────────────────────────

function Step1() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)' }}>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          color: 'var(--text-muted)',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-3) var(--space-5)',
          textAlign: 'center',
        }}
      >
        Task: <span style={{ color: 'var(--text-primary)' }}>{TASK}</span>
      </div>
      <Arrow label="receives" />
      <AgentCard agent={COORDINATOR} />
      <p
        style={{
          fontFamily: 'var(--font-editorial)',
          fontStyle: 'italic',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)',
          textAlign: 'center',
          margin: 0,
          lineHeight: 1.65,
        }}
      >
        The coordinator agent receives the task and prepares to delegate.
      </p>
    </div>
  );
}

function Step2() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)' }}>
      <AgentCard agent={COORDINATOR} />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--space-6)',
          width: '100%',
        }}
      >
        {SUB_AGENTS.map((agent, i) => (
          <div key={agent.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)', flex: 1, minWidth: 0 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: agent.color }}>↓</span>
            <AgentCard agent={agent} dim={false} />
          </div>
        ))}
      </div>
      <p
        style={{
          fontFamily: 'var(--font-editorial)',
          fontStyle: 'italic',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)',
          textAlign: 'center',
          margin: 0,
          lineHeight: 1.65,
        }}
      >
        Coordinator delegates to three specialised sub-agents — each gets a focused role.
      </p>
    </div>
  );
}

function Step3() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)' }}>
      <AgentCard agent={COORDINATOR} dim />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'var(--space-3)',
          width: '100%',
        }}
        className="multiagent-subgrid"
      >
        {SUB_AGENTS.map(agent => (
          <AgentCard key={agent.id} agent={agent} showOutput />
        ))}
      </div>
      <p
        style={{
          fontFamily: 'var(--font-editorial)',
          fontStyle: 'italic',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)',
          textAlign: 'center',
          margin: 0,
          lineHeight: 1.65,
        }}
      >
        All three work in parallel — each with its own context, no waiting.
      </p>
    </div>
  );
}

function Step4() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'var(--space-3)',
          width: '100%',
        }}
        className="multiagent-subgrid"
      >
        {SUB_AGENTS.map(agent => (
          <AgentCard key={agent.id} agent={agent} dim />
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', justifyContent: 'center' }}>
        {SUB_AGENTS.map((_, i) => (
          <span key={i} style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>↓</span>
        ))}
      </div>
      <AgentCard agent={COORDINATOR} />
      <p
        style={{
          fontFamily: 'var(--font-editorial)',
          fontStyle: 'italic',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)',
          textAlign: 'center',
          margin: 0,
          lineHeight: 1.65,
        }}
      >
        Outputs return to the coordinator, which reconciles conflicts and synthesises.
      </p>
    </div>
  );
}

function Step5() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)' }}>
      <div
        style={{
          background: 'var(--accent-primary-glow)',
          border: '1px solid var(--border-emphasis)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-5)',
          width: '100%',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--accent-primary)',
            margin: '0 0 var(--space-3)',
          }}
        >
          Final Itinerary
        </p>
        <pre
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--text-primary)',
            lineHeight: 1.7,
            margin: 0,
            whiteSpace: 'pre-wrap',
          }}
        >
          {FINAL_ITINERARY}
        </pre>
      </div>
      <p
        style={{
          fontFamily: 'var(--font-editorial)',
          fontStyle: 'italic',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)',
          textAlign: 'center',
          margin: 0,
          lineHeight: 1.65,
        }}
      >
        Three agents, one coherent result. The coordination overhead pays off here.
      </p>
    </div>
  );
}

const STEPS = [Step1, Step2, Step3, Step4, Step5];

// ── Main component ─────────────────────────────────────────────────────────────

export default function MultiagentDemo() {
  const [activeStep, setActiveStep] = useState(0);

  const StepBody = STEPS[activeStep];

  return (
    <StepThrough
      ariaLabel="Multi-agent collaboration"
      totalSteps={STEPS.length}
      activeStep={activeStep}
      onNext={() => setActiveStep(s => Math.min(s + 1, STEPS.length - 1))}
      onBack={() => setActiveStep(s => Math.max(s - 1, 0))}
      onReset={() => setActiveStep(0)}
    >
      <div style={{ minHeight: 320 }}>
        <StepBody />
      </div>

      <style>{`
        @media (max-width: 640px) {
          .multiagent-subgrid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </StepThrough>
  );
}
