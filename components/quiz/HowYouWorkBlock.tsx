import type { CognitiveProfile } from "@/lib/quiz-storage";

interface HowYouWorkBlockProps {
  profile: CognitiveProfile;
}

type Axis = {
  key: keyof CognitiveProfile;
  leftLabel: string;
  rightLabel: string;
};

const AXES: Axis[] = [
  { key: "divergent_vs_convergent",  leftLabel: "Convergent",  rightLabel: "Divergent"  },
  { key: "intuitive_vs_analytical",  leftLabel: "Analytical",  rightLabel: "Intuitive"  },
  { key: "originator_vs_synthesist", leftLabel: "Synthesist",  rightLabel: "Originator" },
];

// 8-quadrant interpretation lookup. Each tuple is sign of (divergent, intuitive,
// originator) → one-sentence read on how AI fits this person's mind.
const INTERPRETATIONS: { match: (p: CognitiveProfile) => boolean; line: string }[] = [
  {
    match: (p) => p.divergent_vs_convergent > 0.2 && p.intuitive_vs_analytical > 0.2 && p.originator_vs_synthesist > 0.2,
    line: "You start broad, trust your instincts, and tend to make things that didn't exist before. AI helps you most when it stays out of the way and disappears once you've found the thread.",
  },
  {
    match: (p) => p.divergent_vs_convergent > 0.2 && p.intuitive_vs_analytical > 0.2 && p.originator_vs_synthesist <= 0.2,
    line: "You think wide and sense your way through ambiguity. AI is most useful as a sparring partner — something to bounce a half-formed shape against before it's ready for anyone else.",
  },
  {
    match: (p) => p.divergent_vs_convergent > 0.2 && p.intuitive_vs_analytical <= -0.2,
    line: "You scan widely but trust the evidence over the gut. AI is at its best for you when it surfaces sources and arguments fast — you'll do the verification yourself anyway.",
  },
  {
    match: (p) => p.divergent_vs_convergent <= -0.2 && p.intuitive_vs_analytical <= -0.2 && p.originator_vs_synthesist <= 0.2,
    line: "You're at your best refining and combining what already exists, carefully. AI helps you most when it hands you a 90%-done input to sharpen — not a blank page.",
  },
  {
    match: (p) => p.divergent_vs_convergent <= -0.2 && p.intuitive_vs_analytical > 0.2,
    line: "You like precision, but you decide by feel once the data's in front of you. AI is a force multiplier when it organizes the inputs — you'll still trust the read in the room.",
  },
  {
    match: (p) => p.divergent_vs_convergent <= -0.2 && p.originator_vs_synthesist > 0.2,
    line: "Methodical operator, original maker — that's a rare combination. AI is most useful for you when it removes the boilerplate so you can spend your focus on the part that's actually yours.",
  },
  {
    match: (p) => p.originator_vs_synthesist > 0.4,
    line: "Ideas show up uninvited, sometimes at inconvenient times. AI is useful when it captures and structures them quickly — not when it tries to generate them for you.",
  },
  {
    match: (p) => Math.abs(p.divergent_vs_convergent) <= 0.2 && Math.abs(p.intuitive_vs_analytical) <= 0.2 && Math.abs(p.originator_vs_synthesist) <= 0.2,
    line: "You move between modes — broad and narrow, analytical and intuitive — depending on what the work asks. AI is useful for you in different ways at different times; treat it as a toolbox, not a partner.",
  },
];

const DEFAULT_LINE =
  "AI tools work best for you when you stay in charge of the questions — they're faster than you on the answers.";

function pickInterpretation(profile: CognitiveProfile): string {
  return INTERPRETATIONS.find((i) => i.match(profile))?.line ?? DEFAULT_LINE;
}

// Three-axis cognitive-profile reveal on the quiz report. Shows the user what
// we sensed about how they work — without surfacing MBTI/Enneagram labels.
export default function HowYouWorkBlock({ profile }: HowYouWorkBlockProps) {
  const interpretation = pickInterpretation(profile);

  return (
    <section
      style={{
        marginTop: 48,
        paddingTop: 48,
        paddingBottom: 8,
        borderTop: "1px solid rgba(245,239,224,0.08)",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--accent-secondary, #00FFD1)",
          marginBottom: 8,
        }}
      >
        How you work
      </p>
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(28px, 4vw, 40px)",
          fontWeight: 800,
          color: "var(--text-primary)",
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
          margin: "0 0 12px",
        }}
      >
        What we sensed from your answers.
      </h2>
      <p
        style={{
          fontFamily: "var(--font-editorial)",
          fontStyle: "italic",
          fontSize: 16,
          color: "rgba(245,239,224,0.55)",
          lineHeight: 1.7,
          maxWidth: "56ch",
          marginBottom: 28,
        }}
      >
        Not a personality type — just how you described your own way of working.
        We use this quietly to tilt the recommendations toward what fits you.
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 18,
          marginBottom: 24,
        }}
      >
        {AXES.map((axis) => {
          const value = profile[axis.key]; // -1..+1
          // Map to 0..100 for visual placement
          const positionPct = ((value + 1) / 2) * 100;
          return (
            <div key={axis.key}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: "0.10em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  marginBottom: 8,
                }}
              >
                <span>{axis.leftLabel}</span>
                <span>{axis.rightLabel}</span>
              </div>
              <div
                role="meter"
                aria-valuenow={Math.round(value * 100) / 100}
                aria-valuemin={-1}
                aria-valuemax={1}
                aria-label={`${axis.leftLabel} to ${axis.rightLabel}`}
                style={{
                  position: "relative",
                  height: 6,
                  background: "rgba(245,239,224,0.06)",
                  borderRadius: 3,
                }}
              >
                {/* Center tick */}
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: -3,
                    bottom: -3,
                    width: 1,
                    background: "rgba(245,239,224,0.10)",
                  }}
                />
                {/* User position dot */}
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    left: `${positionPct}%`,
                    top: "50%",
                    width: 12,
                    height: 12,
                    transform: "translate(-50%, -50%)",
                    borderRadius: "50%",
                    background: "var(--accent-secondary, #00FFD1)",
                    boxShadow: "0 0 12px rgba(0,255,209,0.35)",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <p
        style={{
          fontFamily: "var(--font-editorial)",
          fontSize: 16,
          color: "var(--text-primary)",
          lineHeight: 1.75,
          maxWidth: "60ch",
          margin: 0,
          padding: "16px 20px",
          borderLeft: "3px solid var(--accent-secondary, #00FFD1)",
          background: "rgba(0,255,209,0.04)",
          borderRadius: "0 8px 8px 0",
        }}
      >
        {interpretation}
      </p>
    </section>
  );
}
