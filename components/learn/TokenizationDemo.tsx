'use client';

import { useState } from 'react';
import StepThrough from './ConceptDemo/StepThrough';

// ---------------------------------------------------------------------------
// BPE-approximate tokenizer
// ---------------------------------------------------------------------------
// Pre-defined merges for common English subwords. The order matters: longer
// patterns are checked first so "tokenization" matches before "token".
const MERGE_TABLE: Array<[RegExp, string[]]> = [
  [/\btokenization\b/gi, ['token', 'ization']],
  [/\bunderstanding\b/gi, ['under', 'standing']],
  [/\bprocessing\b/gi, ['process', 'ing']],
  [/\brepresentation\b/gi, ['represent', 'ation']],
  [/\btransformation\b/gi, ['transform', 'ation']],
  [/\bunprecedented\b/gi, ['un', 'prece', 'dented']],
  [/\bgeneration\b/gi, ['gener', 'ation']],
  [/\battention\b/gi, ['atten', 'tion']],
  [/\bembedding\b/gi, ['embed', 'ding']],
  [/\bcompression\b/gi, ['compress', 'ion']],
  [/\bprediction\b/gi, ['predict', 'ion']],
  [/\btraining\b/gi, ['train', 'ing']],
  [/\blanguage\b/gi, ['lang', 'uage']],
  [/\boptimization\b/gi, ['optim', 'ization']],
  [/\bparameters\b/gi, ['param', 'eters']],
  [/\bvocabulary\b/gi, ['vocab', 'ulary']],
  [/\bstrawberry\b/gi, ['straw', 'berry']],
  [/\bblueberry\b/gi, ['blue', 'berry']],
  [/\bunreasonably\b/gi, ['un', 're', 'ason', 'ably']],
  [/\bunnecessarily\b/gi, ['un', 'necess', 'arily']],
  [/\bcalculation\b/gi, ['calcul', 'ation']],
  [/\binformation\b/gi, ['inform', 'ation']],
  [/\bimplementation\b/gi, ['implement', 'ation']],
  [/\bcommunication\b/gi, ['commun', 'ication']],
  [/\bsignal\b/gi, ['signal']],
  [/\bnoise\b/gi, ['noise']],
  [/\bbeneath\b/gi, ['be', 'neath']],
  [/\bsoftware\b/gi, ['soft', 'ware']],
  [/\bhardware\b/gi, ['hard', 'ware']],
  [/\bnetwork\b/gi, ['network']],
];

function tokenize(input: string): string[] {
  if (!input.trim()) return [];

  const tokens: string[] = [];

  // Split on whitespace first, preserving the spaces as their own tokens
  const parts = input.split(/(\s+)/);

  for (const part of parts) {
    if (!part) continue;

    // Whitespace chunks become a single token each
    if (/^\s+$/.test(part)) {
      tokens.push(part);
      continue;
    }

    // For word-like parts, try to split on leading/trailing punctuation
    const leadingPunct = part.match(/^([^a-zA-Z0-9]+)/)?.[1] ?? '';
    const trailingPunct = part.match(/([^a-zA-Z0-9]+)$/)?.[1] ?? '';
    const core = part.slice(
      leadingPunct.length,
      part.length - trailingPunct.length
    );

    if (leadingPunct) tokens.push(leadingPunct);

    if (core) {
      // Check merge table
      let matched = false;
      for (const [pattern, pieces] of MERGE_TABLE) {
        if (pattern.test(core)) {
          // Preserve original casing for display
          const origLower = core.toLowerCase();
          const pieceLower = pieces.join('');
          if (origLower === pieceLower) {
            // Simple case: all pieces can be assembled from the original
            let pos = 0;
            for (const piece of pieces) {
              tokens.push(core.slice(pos, pos + piece.length));
              pos += piece.length;
            }
          } else {
            // Fallback: push as pieces directly
            for (const piece of pieces) tokens.push(piece);
          }
          matched = true;
          break;
        }
      }
      if (!matched) tokens.push(core);
    }

    if (trailingPunct) tokens.push(trailingPunct);
  }

  return tokens.filter((t) => t.length > 0);
}

// ---------------------------------------------------------------------------
// Color palette — 8 distinct accent colors cycling through tokens
// ---------------------------------------------------------------------------
const TOKEN_COLORS = [
  { bg: 'rgba(170,255,77,0.10)', border: 'rgba(170,255,77,0.30)', text: 'var(--accent-primary)' },
  { bg: 'rgba(0,255,209,0.08)', border: 'rgba(0,255,209,0.28)', text: 'var(--accent-secondary)' },
  { bg: 'rgba(244,171,31,0.10)', border: 'rgba(244,171,31,0.28)', text: 'var(--accent-warm)' },
  { bg: 'rgba(163,115,215,0.10)', border: 'rgba(163,115,215,0.28)', text: 'var(--color-lavender)' },
  { bg: 'rgba(170,255,77,0.06)', border: 'rgba(170,255,77,0.20)', text: 'var(--accent-primary-dim)' },
  { bg: 'rgba(0,255,209,0.06)', border: 'rgba(0,255,209,0.18)', text: 'var(--accent-secondary)' },
  { bg: 'rgba(244,171,31,0.06)', border: 'rgba(244,171,31,0.18)', text: 'var(--accent-warm-dim)' },
  { bg: 'rgba(163,115,215,0.06)', border: 'rgba(163,115,215,0.18)', text: 'var(--color-lavender)' },
];

const PRICE_PER_TOKEN = 0.000003; // GPT-4o-mini input pricing ($/token)
const DEFAULT_INPUT = 'The signal beneath the noise.';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function TokenizationDemo() {
  const [activeStep, setActiveStep] = useState(0);
  const [inputText, setInputText] = useState(DEFAULT_INPUT);

  const tokens = tokenize(inputText);
  // Exclude pure-whitespace tokens for cost/count display
  const visibleTokens = tokens.filter((t) => t.trim().length > 0);
  const tokenCount = visibleTokens.length;
  const charCount = inputText.length;
  const estimatedCost = tokenCount * PRICE_PER_TOKEN;
  const costPer1M = PRICE_PER_TOKEN * 1_000_000;

  const handleReset = () => {
    setActiveStep(0);
    setInputText(DEFAULT_INPUT);
  };

  return (
    <StepThrough
      ariaLabel="Tokenization step-by-step"
      totalSteps={4}
      activeStep={activeStep}
      onNext={() => setActiveStep((s) => Math.min(3, s + 1))}
      onBack={() => setActiveStep((s) => Math.max(0, s - 1))}
      onReset={handleReset}
    >
      <style>{`
        @keyframes tokenAppear {
          from { opacity: 0; transform: translateY(6px) scale(0.94); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
        .tok-chip {
          display: inline-block;
          padding: 3px 8px;
          border-radius: 4px;
          font-family: var(--font-mono);
          font-size: 13px;
          line-height: 1.5;
          border: 1px solid;
          animation: tokenAppear 220ms cubic-bezier(0.16,1,0.3,1) both;
          white-space: pre;
        }
        .tok-chip-ws {
          display: inline-block;
          padding: 3px 4px;
          font-family: var(--font-mono);
          font-size: 11px;
          line-height: 1.5;
          color: var(--text-muted);
          white-space: pre;
          animation: tokenAppear 220ms cubic-bezier(0.16,1,0.3,1) both;
        }
        .vis-label {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--text-muted);
        }
      `}</style>

      {/* ---- Step 1: type a sentence ---- */}
      {activeStep === 0 && (
        <div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-2)', letterSpacing: '-0.02em' }}>
            Type a sentence.
          </p>
          <p style={{ fontFamily: 'var(--font-editorial)', fontStyle: 'italic', fontSize: 14, color: 'var(--text-secondary)', marginBottom: 'var(--space-5)', lineHeight: 1.6 }}>
            This is what the model receives before it does anything.
          </p>
          <label htmlFor="tok-input" style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 'var(--space-2)' }}>
            Your text
          </label>
          <input
            id="tok-input"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            maxLength={200}
            style={{
              width: '100%',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px',
              fontFamily: 'var(--font-editorial)',
              fontSize: 16,
              color: 'var(--text-primary)',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 150ms ease',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-default)'; }}
          />
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', marginTop: 'var(--space-2)' }}>
            {charCount} character{charCount !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* ---- Step 2: watch it split ---- */}
      {activeStep === 1 && (
        <div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-2)', letterSpacing: '-0.02em' }}>
            Watch it split.
          </p>
          <p style={{ fontFamily: 'var(--font-editorial)', fontStyle: 'italic', fontSize: 14, color: 'var(--text-secondary)', marginBottom: 'var(--space-5)', lineHeight: 1.6 }}>
            BPE chops at learned boundaries — not at word edges.
          </p>
          {tokens.length === 0 ? (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-muted)' }}>
              No input to split — go back and type something.
            </p>
          ) : (
            <div
              aria-label="Token chips"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 6,
                alignItems: 'baseline',
                padding: 'var(--space-5)',
                background: 'var(--bg-elevated)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              {tokens.map((tok, i) => {
                const isWS = /^\s+$/.test(tok);
                const col = isWS ? null : TOKEN_COLORS[i % TOKEN_COLORS.length];
                if (isWS) {
                  return (
                    <span
                      key={i}
                      className="tok-chip-ws"
                      role="presentation"
                      title="whitespace token"
                      style={{ animationDelay: `${i * 40}ms` }}
                    >
                      ·
                    </span>
                  );
                }
                return (
                  <span
                    key={i}
                    className="tok-chip"
                    role="presentation"
                    style={{
                      background: col!.bg,
                      borderColor: col!.border,
                      color: col!.text,
                      animationDelay: `${i * 40}ms`,
                    }}
                  >
                    {tok}
                  </span>
                );
              })}
            </div>
          )}
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginTop: 'var(--space-3)', letterSpacing: '0.04em' }}>
            · = whitespace token &nbsp;|&nbsp; each color = one token
          </p>
        </div>
      )}

      {/* ---- Step 3: count the tokens ---- */}
      {activeStep === 2 && (
        <div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-2)', letterSpacing: '-0.02em' }}>
            Count the tokens.
          </p>
          <p style={{ fontFamily: 'var(--font-editorial)', fontStyle: 'italic', fontSize: 14, color: 'var(--text-secondary)', marginBottom: 'var(--space-5)', lineHeight: 1.6 }}>
            This is the unit the model reasons in. Not characters. Not words.
          </p>
          <div style={{
            display: 'flex',
            gap: 'var(--space-6)',
            flexWrap: 'wrap',
            marginBottom: 'var(--space-5)',
          }}>
            <div style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-6)',
              flex: '1 1 120px',
              textAlign: 'center',
            }}>
              <p className="vis-label" style={{ marginBottom: 'var(--space-2)' }}>tokens</p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 40, fontWeight: 700, color: 'var(--accent-primary)', lineHeight: 1 }}>
                {tokenCount}
              </p>
            </div>
            <div style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-6)',
              flex: '1 1 120px',
              textAlign: 'center',
            }}>
              <p className="vis-label" style={{ marginBottom: 'var(--space-2)' }}>characters</p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 40, fontWeight: 700, color: 'var(--text-secondary)', lineHeight: 1 }}>
                {charCount}
              </p>
            </div>
          </div>
          <p style={{
            fontFamily: 'var(--font-editorial)',
            fontStyle: 'italic',
            fontSize: 14,
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            padding: 'var(--space-4) var(--space-5)',
            borderLeft: '3px solid var(--border-emphasis)',
            background: 'var(--accent-primary-glow)',
            borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
          }}>
            Tokens ≠ words. Here,{' '}
            <span style={{ fontFamily: 'var(--font-mono)', fontStyle: 'normal', color: 'var(--accent-primary)' }}>{charCount}</span>{' '}
            characters became{' '}
            <span style={{ fontFamily: 'var(--font-mono)', fontStyle: 'normal', color: 'var(--accent-primary)' }}>{tokenCount}</span>{' '}
            tokens.
          </p>
        </div>
      )}

      {/* ---- Step 4: what it costs ---- */}
      {activeStep === 3 && (
        <div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-2)', letterSpacing: '-0.02em' }}>
            What it costs.
          </p>
          <p style={{ fontFamily: 'var(--font-editorial)', fontStyle: 'italic', fontSize: 14, color: 'var(--text-secondary)', marginBottom: 'var(--space-5)', lineHeight: 1.6 }}>
            At GPT-4o-mini input rates (~$0.000003 / token).
          </p>
          <div style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-6)',
            marginBottom: 'var(--space-5)',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  This call
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: 'var(--accent-primary)' }}>
                  ${estimatedCost.toFixed(7)}
                </span>
              </div>
              <div style={{ height: 1, background: 'var(--border-subtle)' }} />
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  1 million tokens
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: 'var(--text-secondary)' }}>
                  ${costPer1M.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          <p style={{
            fontFamily: 'var(--font-editorial)',
            fontStyle: 'italic',
            fontSize: 14,
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            padding: 'var(--space-4) var(--space-5)',
            borderLeft: '3px solid var(--accent-warm)',
            background: 'rgba(244,171,31,0.06)',
            borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
          }}>
            Cheap per call. Expensive at scale. The arithmetic matters.
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginTop: 'var(--space-3)', letterSpacing: '0.04em' }}>
            {tokenCount} token{tokenCount !== 1 ? 's' : ''} × $0.000003 = ${estimatedCost.toFixed(7)}
          </p>
        </div>
      )}
    </StepThrough>
  );
}
