// Cognitive-pattern question bank for the AIght quiz. These eight questions
// produce three private axes used by scoring + recommendations. No personality
// labels are ever surfaced — the dimension exists as signals, not categories.

import type { CognitiveProfile } from "@/lib/quiz-storage";

export type CogOpt = { value: string; label: string; sub?: string };
export type CogQType = "single" | "slider";

export type CogQuestion = {
  id: string;
  text: string;
  subtext?: string;
  type: CogQType;
  options?: CogOpt[];
  minLabel?: string;
  maxLabel?: string;
};

// Each option encodes a tilt on one or more axes. The score function below
// reads `OPTION_AXIS_DELTAS` to map answers → axis sums.
export const COG_QUESTIONS: CogQuestion[] = [
  {
    id: "cog_thinking_start",
    text: "When a new problem lands on your desk, where do you start?",
    subtext: "There's no right answer — we're just listening to how you work.",
    type: "single",
    options: [
      { value: "big_picture", label: "Big picture first", sub: "Map the whole shape, then zoom in" },
      { value: "details_up", label: "Smallest detail first", sub: "Get one piece right, then build outward" },
      { value: "both_iter", label: "Bounce between the two", sub: "Hard to tell which comes first" },
    ],
  },
  {
    id: "cog_decision_style",
    text: "How do you make a hard call when the data is mixed?",
    type: "single",
    options: [
      { value: "analyze", label: "Build a careful case", sub: "Weigh the evidence, decide after" },
      { value: "sense", label: "Sit with it, then know", sub: "Wait for a gut signal that's done forming" },
      { value: "stress_test", label: "Decide fast, stress-test later", sub: "Commit, then look for what breaks" },
    ],
  },
  {
    id: "cog_output_pace",
    text: "How does your best work usually emerge?",
    type: "single",
    options: [
      { value: "sprint_revise", label: "Sprint, then revise", sub: "Get a rough version out fast, then carve" },
      { value: "steady_final", label: "Slow and considered", sub: "Build the right thing the first time" },
      { value: "burst_then_pause", label: "Bursts with long pauses", sub: "Something clicks, then a wait" },
    ],
  },
  {
    id: "cog_ambiguity_tolerance",
    text: "How comfortable are you working without a clear definition?",
    subtext: "When the goal is fuzzy, the brief is missing, the right answer hasn't been named yet.",
    type: "slider",
    minLabel: "Need it defined first",
    maxLabel: "Comfortable in the fog",
  },
  {
    id: "cog_energy_mode",
    text: "Where does your deepest thinking happen?",
    type: "single",
    options: [
      { value: "solitary", label: "Alone, uninterrupted", sub: "Long stretches with the door shut" },
      { value: "collab", label: "In real conversation", sub: "Talking it out with someone sharp" },
      { value: "drift", label: "Walking / driving / showering", sub: "When the body's doing something else" },
    ],
  },
  {
    id: "cog_pattern_strength",
    text: "Pattern-spotting vs. precision — which feels more natural?",
    subtext: "Both are skills. We're asking which one your default brain reaches for.",
    type: "slider",
    minLabel: "Precision, get it exactly right",
    maxLabel: "Patterns, see how it connects",
  },
  {
    id: "cog_context_sensitivity",
    text: "How much do you read the room without being told?",
    subtext: "Unspoken signals, what people aren't saying, the politics under the meeting.",
    type: "slider",
    minLabel: "Prefer things stated explicitly",
    maxLabel: "Read the room before words land",
  },
  {
    id: "cog_originality_drive",
    text: "Where do new ideas usually come from for you?",
    type: "single",
    options: [
      { value: "originator", label: "From inside, unsolicited", sub: "Ideas show up — sometimes inconvenient" },
      { value: "synthesist", label: "From combining what exists", sub: "Two old things, one new shape" },
      { value: "constraint", label: "Pushed by a problem", sub: "Constraints squeeze them out" },
    ],
  },
];

// Per-option tilt on the three private axes. Values are -1, 0, or +1; the
// score function averages them per axis.
// divergent (+) vs convergent (-)
// intuitive (+) vs analytical (-)
// originator (+) vs synthesist (-)
type AxisTilt = { div?: number; intu?: number; orig?: number };

const OPTION_AXIS_DELTAS: Record<string, Record<string, AxisTilt>> = {
  cog_thinking_start: {
    big_picture: { div: 1 },
    details_up:  { div: -1 },
    both_iter:   { div: 0 },
  },
  cog_decision_style: {
    analyze:     { intu: -1 },
    sense:       { intu: 1 },
    stress_test: { intu: 0, div: 1 },
  },
  cog_output_pace: {
    sprint_revise:    { div: 1 },
    steady_final:     { div: -1 },
    burst_then_pause: { intu: 1, orig: 1 },
  },
  cog_energy_mode: {
    solitary: { intu: 0, orig: 1 },
    collab:   { div: 1 },
    drift:    { intu: 1 },
  },
  cog_originality_drive: {
    originator: { orig: 1 },
    synthesist: { orig: -1 },
    constraint: { orig: 0, div: 1 },
  },
};

// Accept the same answer shape the quiz uses (Answers in QuizClient.tsx).
// Cognitive questions only produce string or number; other answer types are
// ignored by `computeCognitiveProfile`.
export type CognitiveAnswers = Record<string, string | string[] | number | undefined>;

function clamp(n: number, lo = -1, hi = 1) {
  return Math.max(lo, Math.min(hi, n));
}

// Slider answers come in 0..100. Normalize to -1..+1.
function sliderToAxis(value: unknown): number {
  if (typeof value !== "number") return 0;
  return clamp((value - 50) / 50);
}

export function computeCognitiveProfile(answers: CognitiveAnswers): CognitiveProfile {
  const div: number[] = [];
  const intu: number[] = [];
  const orig: number[] = [];

  // Single-choice tilts
  for (const q of COG_QUESTIONS) {
    if (q.type !== "single") continue;
    const ans = answers[q.id];
    if (typeof ans !== "string") continue;
    const tilt = OPTION_AXIS_DELTAS[q.id]?.[ans];
    if (!tilt) continue;
    if (tilt.div  !== undefined) div.push(tilt.div);
    if (tilt.intu !== undefined) intu.push(tilt.intu);
    if (tilt.orig !== undefined) orig.push(tilt.orig);
  }

  // Slider contributions
  const ambig    = sliderToAxis(answers["cog_ambiguity_tolerance"]);  // div
  const pattern  = sliderToAxis(answers["cog_pattern_strength"]);     // div + intu
  const context  = sliderToAxis(answers["cog_context_sensitivity"]);  // intu

  div.push(ambig);
  div.push(pattern * 0.5);
  intu.push(pattern * 0.5);
  intu.push(context);

  const avg = (xs: number[]) => xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;

  return {
    divergent_vs_convergent: clamp(avg(div)),
    intuitive_vs_analytical: clamp(avg(intu)),
    originator_vs_synthesist: clamp(avg(orig)),
  };
}

// Pick the 3 human-essay slugs most aligned with this profile + topline answers.
// Returns at most 3, in editorial order (taste/care/originality/context).
export function pickHumanEssayRecs(
  profile: CognitiveProfile,
  signals: { human_pct?: number; decision_stakes?: string }
): string[] {
  const scores: Record<string, number> = {
    taste:       0,
    care:        0,
    originality: 0,
    context:     0,
  };

  if (profile.intuitive_vs_analytical > 0.2) scores.taste += 2;
  if (profile.originator_vs_synthesist > 0.2) scores.originality += 2;
  if ((signals.human_pct ?? 0) > 60) scores.care += 2;
  if (signals.decision_stakes === "high") scores.context += 2;

  // Always include at least one of each tilt
  if (profile.divergent_vs_convergent > 0.3) scores.originality += 1;
  if (profile.intuitive_vs_analytical < -0.2) scores.context += 1;
  if ((signals.human_pct ?? 0) > 35) scores.care += 1;

  // Tie-break: editorial order
  const ranked = (Object.entries(scores) as [string, number][])
    .sort((a, b) => b[1] - a[1] || ["taste","care","originality","context"].indexOf(a[0]) - ["taste","care","originality","context"].indexOf(b[0]))
    .map(([slug]) => slug);

  return ranked.slice(0, 3);
}

// Used by computeScore in QuizClient. Capped ±6 so it doesn't dominate field
// and role signals.
export function cognitiveScoreModifier(profile: CognitiveProfile): number {
  // High divergence + originality + intuition → more protective.
  // High convergence + analytical → slightly less protective (more automatable
  // patterns), but mild — these traits are also genuinely valuable.
  const raw =
    profile.divergent_vs_convergent  * -2 +
    profile.intuitive_vs_analytical  * -2 +
    profile.originator_vs_synthesist * -2;
  return Math.max(-6, Math.min(6, Math.round(raw)));
}
