import type { Lesson } from "@/lib/lessons";

const lesson: Lesson = {
  slug: "statistics-essentials",
  title: "Statistics Essentials",
  tagline: "The quiet math under every model's hunches.",
  minutes: 5,
  steps: [
    {
      kind: "explain",
      id: "hook",
      eyebrow: "The idea",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Strip an AI model down to its core and you find statistics — not
            magic, not reasoning, but patterns in numbers: averages, spreads,
            correlations, likelihoods. The whole field runs on a handful of ideas
            you can hold in your head.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            You don&apos;t need the formulas. You need the intuitions.
          </p>
        </>
      ),
    },
    {
      kind: "explain",
      id: "spread",
      eyebrow: "Averages hide as much as they show",
      body: (
        <>
          <p style={{ margin: 0 }}>
            An average is a single number standing in for a crowd. Two datasets
            can share an average and look nothing alike — one tightly clustered,
            one wildly scattered. That scatter, the <em>spread</em>, often matters
            more than the middle.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            &quot;Average response time: 2 seconds&quot; feels great — until you
            learn one in twenty users waits a minute. The spread is where the pain
            lives.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-spread",
      prompt: "Two systems both average a 2-second response. Why might that not tell the whole story?",
      choices: [
        {
          text: "The spread can differ wildly — one is steady, the other swings from instant to a minute",
          correct: true,
          feedback:
            "Right — the average hides the variation, and the variation is often what users actually feel.",
        },
        {
          text: "Averages are always wrong",
          feedback:
            "They're not wrong — just incomplete. They summarise the middle and say nothing about the spread.",
        },
        {
          text: "It means both systems are identical",
          feedback:
            "A shared average doesn't make them identical — their distributions can be completely different.",
        },
      ],
    },
    {
      kind: "explain",
      id: "probabilistic",
      eyebrow: "Models think in odds",
      body: (
        <>
          <p style={{ margin: 0 }}>
            A model rarely says &quot;the answer is X.&quot; Underneath, it says
            &quot;X is most likely, Y is possible, Z is unlikely&quot; — a
            distribution over options. When it picks a word or a label, it&apos;s
            sampling from those odds.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            So a model&apos;s output isn&apos;t a fact it looked up. It&apos;s the
            most probable continuation, given everything it learned.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-prob",
      prompt: "An AI says there's a 70% chance of rain. What does that 70% best represent?",
      choices: [
        {
          text: "A measure of the model's confidence in the outcome, not a guarantee",
          correct: true,
          feedback:
            "Right — it's an estimate of likelihood. Roughly 3 in 10 such days, it should stay dry.",
        },
        {
          text: "It will rain on exactly 70% of the map",
          feedback:
            "Probability isn't area — it's a degree of confidence about whether it rains at all.",
        },
        {
          text: "The model is 70% finished computing",
          feedback:
            "It describes the prediction, not how far along the computation is.",
        },
      ],
    },
    {
      kind: "explain",
      id: "samples",
      eyebrow: "A sample isn't the world",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Everything a model learns comes from a <em>sample</em> — a finite
            slice of reality. If that sample is skewed, the statistics it learns
            are skewed too, no matter how cleanly the math is done. Good numbers on
            a bad sample are still misleading.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Statistics can only describe the data it was given. It can&apos;t
            conjure the part of the world that was never sampled.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-sample",
      prompt: "A survey of one neighbourhood reports a confident, precise result. What's the catch?",
      choices: [
        {
          text: "Precise math on a narrow sample can be confidently unrepresentative of the wider population",
          correct: true,
          feedback:
            "Right — clean statistics can't fix a skewed sample. The result describes the slice, not the whole.",
        },
        {
          text: "Precise numbers are always trustworthy",
          feedback:
            "Precision isn't the same as representativeness — a tight number from a biased sample still misleads.",
        },
        {
          text: "Surveys can never produce useful numbers",
          feedback:
            "They can — with a representative sample. The issue here is the narrow slice, not surveys themselves.",
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
            A few statistical intuitions unlock most of AI: look at the spread,
            not just the average; remember models speak in odds, not certainties;
            and never trust a number more than the sample behind it.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Those odds the model deals in are <strong>probability</strong> — worth
            a closer look next.
          </p>
        </>
      ),
    },
  ],
};

export default lesson;
