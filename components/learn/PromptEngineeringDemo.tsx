'use client';

import { useState } from 'react';
import { Playground } from './ConceptDemo';

// ── Precomputed outputs for all 16 toggle combinations ──────────────────────
// Key: "role-examples-cot-json" (1=on, 0=off)
const OUTPUTS: Record<string, string> = {
  '0000': `Photosynthesis is the process by which plants use sunlight, water, and carbon dioxide to produce oxygen and energy. This happens mainly in the leaves of plants.`,
  '1000': `Photosynthesis is the biochemical process by which plants convert light energy into chemical energy, producing glucose from carbon dioxide and water while releasing oxygen as a by-product.`,
  '0100': `Photosynthesis is the process by which plants use sunlight, water, and carbon dioxide to produce oxygen and energy — similar to how a solar panel converts sunlight into electricity.`,
  '0010': `First, I'll identify the core mechanism. Photosynthesis converts light energy to chemical energy. Second, the inputs: CO₂ + water. Third, the outputs: glucose + oxygen. Summary: plants use sunlight, water, and CO₂ to make glucose and oxygen.`,
  '0001': `{"summary": "Plants convert sunlight, water, and carbon dioxide into glucose and oxygen through photosynthesis.", "process": "light-dependent + Calvin cycle", "location": "chloroplasts"}`,
  '1100': `Photosynthesis is the process by which plants capture light energy and convert it into chemical energy — transforming CO₂ and water into glucose and oxygen, much like a factory turning raw materials into fuel.`,
  '1010': `Let me work through this systematically. The core reaction: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂. Step 1: Light-dependent reactions occur in the thylakoid. Step 2: The Calvin cycle occurs in the stroma. Summary: plants use light to convert CO₂ and water into glucose and oxygen.`,
  '1001': `{"summary": "Photosynthesis is the biochemical process by which plants synthesize glucose from CO₂ and H₂O using light energy.", "stages": ["light-dependent reactions", "Calvin cycle"], "location": "chloroplasts", "by_product": "oxygen"}`,
  '0110': `Photosynthesis (like solar panels, but biological): Step 1, light is absorbed by chlorophyll. Step 2, water molecules are split. Step 3, CO₂ is fixed into glucose. Result: oxygen released, plant feeds itself.`,
  '0101': `{"summary": "Plants use sunlight, water, and CO₂ to produce glucose and oxygen.", "analogy": "biological solar panel", "key_inputs": ["sunlight", "water", "CO2"], "key_outputs": ["glucose", "oxygen"]}`,
  '0011': `First: what is it? Photosynthesis converts light to chemical energy. Second: inputs (CO₂, water, light), outputs (glucose, oxygen). Third: where it happens (chloroplasts). {"summary": "Plants use light energy to synthesize glucose from CO₂ and water, releasing oxygen."}`,
  '1110': `Using my expertise: I'll reason step-by-step, as in expert practice. (1) Photosynthesis is the light-driven reaction: 6CO₂ + 6H₂O + hν → C₆H₁₂O₆ + 6O₂. (2) This mirrors how industrial solar-to-hydrogen works, but biochemically. (3) Summary: plants capture photons to build sugars from air and water.`,
  '1101': `{"summary": "Photosynthesis is the light-driven biochemical synthesis of glucose from CO₂ and H₂O.", "analogy": "biological photovoltaic system", "equation": "6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂", "location": "chloroplasts"}`,
  '0111': `Step 1 (identify): photosynthesis converts light → chemical energy. Step 2 (inputs/outputs): CO₂ + H₂O + light → glucose + O₂. {"summary": "Photosynthesis uses sunlight, water, and CO₂ to produce glucose and oxygen — like a solar-powered factory.", "analogy": "solar panel"}`,
  '1011': `As a botanist: reasoning step by step. (1) Core chemistry: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂. (2) Two stages: light-dependent (thylakoid) and Calvin cycle (stroma). {"summary": "Plants use light to convert CO₂ and water into glucose and oxygen via two-stage photochemistry."}`,
  '1111': `Expert reasoning with examples and structured output. Step 1: identify — light energy converted to chemical. Step 2: like solar panels (analogous to photovoltaic cells). Step 3: two phases — light reactions → ATP/NADPH; Calvin cycle → glucose. {"summary": "Photosynthesis: light-driven glucose synthesis from CO₂ and H₂O.", "stages": ["light reactions", "Calvin cycle"], "location": "chloroplasts", "equation": "6CO₂ + 6H₂O + hν → C₆H₁₂O₆ + 6O₂"}`,
};

const TASK = 'Summarize this paragraph about photosynthesis.';

const TECHNIQUE_LABELS: Record<string, { label: string; snippet: string }> = {
  role: {
    label: 'Role',
    snippet: 'You are an expert botanist and science educator.',
  },
  examples: {
    label: 'Examples',
    snippet: 'Example: "Mitosis is cell division." → "Cells split into two identical copies using chromosomes."',
  },
  cot: {
    label: 'Think step-by-step',
    snippet: 'Think through this step by step before writing your summary.',
  },
  json: {
    label: 'Output as JSON',
    snippet: 'Respond in valid JSON with a "summary" key.',
  },
};

function estimateTokens(text: string): number {
  return Math.max(1, Math.round(text.length / 4));
}

const PRICE_PER_TOKEN = 0.0000003;

function buildCaption(role: boolean, examples: boolean, cot: boolean, json: boolean): string {
  const active = [
    role && 'role assignment',
    examples && 'few-shot examples',
    cot && 'chain-of-thought',
    json && 'JSON format',
  ].filter(Boolean);
  if (active.length === 0) return 'Base prompt — no techniques active. Output is loose and generic.';
  if (active.length === 4) return 'All four techniques active. Output is precise, structured, and reasoned.';
  return `Active: ${active.join(', ')}.`;
}

export default function PromptEngineeringDemo() {
  const [role, setRole] = useState(false);
  const [examples, setExamples] = useState(false);
  const [cot, setCot] = useState(false);
  const [json, setJson] = useState(false);

  const key = `${role ? 1 : 0}${examples ? 1 : 0}${cot ? 1 : 0}${json ? 1 : 0}`;
  const output = OUTPUTS[key] ?? OUTPUTS['0000'];
  const caption = buildCaption(role, examples, cot, json);

  const promptParts = [
    role && TECHNIQUE_LABELS.role.snippet,
    examples && TECHNIQUE_LABELS.examples.snippet,
    cot && TECHNIQUE_LABELS.cot.snippet,
    TASK,
    json && TECHNIQUE_LABELS.json.snippet,
  ].filter(Boolean) as string[];

  const fullPrompt = promptParts.join('\n');
  const promptTokens = estimateTokens(fullPrompt);
  const outputTokens = estimateTokens(output);
  const totalCost = (promptTokens + outputTokens) * PRICE_PER_TOKEN;

  const toggleStyle = (active: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-3)',
    padding: 'var(--space-3) var(--space-4)',
    borderRadius: 'var(--radius-md)',
    border: `1px solid ${active ? 'var(--border-emphasis)' : 'var(--border-subtle)'}`,
    background: active ? 'var(--accent-primary-glow)' : 'var(--bg-elevated)',
    cursor: 'pointer',
    transition: 'all 150ms ease',
  });

  const knobStyle = (active: boolean): React.CSSProperties => ({
    width: 28,
    height: 16,
    borderRadius: 'var(--radius-full)',
    background: active ? 'var(--accent-primary)' : 'var(--bg-overlay)',
    position: 'relative',
    transition: 'background 150ms ease',
    flexShrink: 0,
  });

  const dotStyle = (active: boolean): React.CSSProperties => ({
    position: 'absolute',
    top: 3,
    left: active ? 15 : 3,
    width: 10,
    height: 10,
    borderRadius: '50%',
    background: active ? 'var(--text-inverse)' : 'var(--text-muted)',
    transition: 'left 150ms ease, background 150ms ease',
  });

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-ui)',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    color: 'var(--text-primary)',
    flex: 1,
  };

  const monoLabel: React.CSSProperties = {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    letterSpacing: '0.07em',
    textTransform: 'uppercase' as const,
    color: 'var(--text-muted)',
    marginBottom: 'var(--space-2)',
  };

  const codeBlock: React.CSSProperties = {
    fontFamily: 'var(--font-mono)',
    fontSize: 13,
    lineHeight: 1.7,
    color: 'var(--text-secondary)',
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-4) var(--space-5)',
    whiteSpace: 'pre-wrap' as const,
    wordBreak: 'break-word' as const,
    minHeight: 80,
  };

  const toggles: Array<{ key: string; val: boolean; set: (v: boolean) => void }> = [
    { key: 'role', val: role, set: setRole },
    { key: 'examples', val: examples, set: setExamples },
    { key: 'cot', val: cot, set: setCot },
    { key: 'json', val: json, set: setJson },
  ];

  return (
    <Playground ariaLabel="Prompt engineering toggle demo" caption={caption}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>

        {/* Toggle row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-3)' }} className="pe-toggles">
          {toggles.map(({ key: k, val, set }) => (
            <button
              key={k}
              role="switch"
              aria-checked={val}
              onClick={() => set(!val)}
              style={toggleStyle(val)}
            >
              <div style={knobStyle(val)} aria-hidden="true">
                <div style={dotStyle(val)} />
              </div>
              <span style={labelStyle}>{TECHNIQUE_LABELS[k].label}</span>
            </button>
          ))}
        </div>

        {/* Two panels */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }} className="pe-panels">
          {/* Base prompt */}
          <div>
            <p style={monoLabel}>Base prompt</p>
            <pre style={codeBlock}>{fullPrompt}</pre>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginTop: 'var(--space-2)' }}>
              ~{promptTokens} prompt tokens
            </p>
          </div>

          {/* Model output */}
          <div>
            <p style={monoLabel}>Model output</p>
            <pre style={{ ...codeBlock, borderColor: json ? 'var(--border-emphasis)' : 'var(--border-subtle)', color: 'var(--text-primary)' }}>
              {output}
            </pre>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginTop: 'var(--space-2)' }}>
              ~{outputTokens} output tokens &nbsp;·&nbsp; est. ${totalCost.toFixed(6)}
            </p>
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 640px) {
          .pe-toggles { grid-template-columns: 1fr !important; }
          .pe-panels  { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </Playground>
  );
}
