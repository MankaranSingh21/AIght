import type { Lesson } from "@/lib/lessons";
import EvalsDemo from "@/components/learn/EvalsDemo";

const lesson: Lesson = {
  slug: "evals",
  title: "Evals",
  tagline: "Turning “it seems good” into something you can actually measure.",
  minutes: 6,
  steps: [
    {
      kind: "explain",
      id: "hook",
      eyebrow: "The idea",
      body: (
        <>
          <p style={{ margin: 0 }}>
            You tweak a prompt, try it once, and it looks great. Ship it? A
            single good answer tells you almost nothing — the next ten might
            flop. &quot;Seems good&quot; is a vibe, not evidence.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            <strong>Evals</strong> are how you replace the vibe with a number.
          </p>
        </>
      ),
    },
    {
      kind: "explain",
      id: "what",
      eyebrow: "A test set, scored",
      body: (
        <>
          <p style={{ margin: 0 }}>
            An eval is just a test for a model or prompt: a set of example
            inputs, a way to score each output, and a tally across all of them.
            Run it and you get a score you can compare — version A vs version B,
            today vs last week.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            The point isn&apos;t one perfect answer. It&apos;s consistent
            behaviour across many cases — including the awkward ones you&apos;d
            rather not think about.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-what",
      prompt: "What is an eval, at its core?",
      choices: [
        {
          text: "The model's private inner monologue while it answers",
          feedback:
            "That's reasoning, not evaluation. An eval is an external measurement you run on the outputs.",
        },
        {
          text: "A repeatable test that scores a model or prompt across many example inputs",
          correct: true,
          feedback:
            "Right — examples in, a scoring rule, a number out. Repeatable so you can compare.",
        },
        {
          text: "A bigger pile of training data",
          feedback:
            "Evals measure a model; they aren't what it learns from. (Reusing test cases for training even hurts.)",
        },
      ],
    },
    {
      kind: "interact",
      id: "demo",
      body: (
        <p style={{ margin: 0 }}>
          Run a prompt against a set of cases and watch the score, not the single
          answer. One win means little; the aggregate is the signal.
        </p>
      ),
      demo: EvalsDemo,
      tryThis: "Watch the failures — they teach you more than the passes.",
    },
    {
      kind: "check",
      id: "check-demo",
      prompt: "Why isn't a single impressive demo a good eval?",
      choices: [
        {
          text: "One cherry-picked case can't reveal how the model handles the other ninety-nine",
          correct: true,
          feedback:
            "Exactly — variance is the enemy. You need a spread of cases to trust the result.",
        },
        {
          text: "Demos are always faked",
          feedback:
            "Not faked — just not representative. One real success still doesn't measure consistency.",
        },
        {
          text: "Because demos can't be scored at all",
          feedback:
            "You can score it — the problem is the sample size of one, not the scoring.",
        },
      ],
    },
    {
      kind: "explain",
      id: "how-score",
      eyebrow: "How you score",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Some outputs check themselves: exact match, a passing unit test, a
            valid JSON shape. Open-ended ones are harder — you might use human
            ratings, or an <em>LLM-as-judge</em> (a model grading another
            model&apos;s work).
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Each method has blind spots: a judge model inherits its own biases.
            A flawed eval can be worse than none — it gives false confidence.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-trust",
      prompt: "When should you be most cautious about trusting an eval's score?",
      choices: [
        {
          text: "When the scoring is shaky or the test cases don't reflect real usage",
          correct: true,
          feedback:
            "Right — a clean number from a bad rubric or unrepresentative cases is false confidence.",
        },
        {
          text: "Whenever the score is high",
          feedback:
            "A high score isn't inherently suspect — what matters is whether the test itself is sound.",
        },
        {
          text: "Only when humans did the scoring",
          feedback:
            "Human and automated scoring both have failure modes; the rubric and cases matter more than who scored.",
        },
      ],
    },
    {
      kind: "explain",
      id: "wrap",
      eyebrow: "Keep this",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Evals turn &quot;feels better&quot; into &quot;measurably better,&quot;
            so you can change a prompt or swap a model and actually know whether
            you improved things. Just make sure the test reflects reality, or the
            number lies to you.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            A model without evals is shipped on hope. With them, it&apos;s shipped
            on evidence.
          </p>
        </>
      ),
    },
  ],
};

export default lesson;
