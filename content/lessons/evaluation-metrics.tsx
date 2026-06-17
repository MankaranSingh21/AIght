import type { Lesson } from "@/lib/lessons";

const lesson: Lesson = {
  slug: "evaluation-metrics",
  title: "Evaluation Metrics",
  tagline: "Choosing the number that decides whether a model is 'good'.",
  minutes: 5,
  steps: [
    {
      kind: "explain",
      id: "hook",
      eyebrow: "The idea",
      body: (
        <>
          <p style={{ margin: 0 }}>
            &quot;The model is 95% accurate&quot; sounds like a verdict. It&apos;s
            barely a clue. Accuracy is one metric among many, and the wrong one can
            make a useless model look excellent — or a great one look broken.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            <strong>Evaluation metrics</strong> are how you turn &quot;is it
            good?&quot; into a number — and the metric you pick is a decision, not
            a detail.
          </p>
        </>
      ),
    },
    {
      kind: "explain",
      id: "accuracy-trap",
      eyebrow: "The accuracy trap",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Suppose 1 in 100 transactions is fraud. A model that flags{" "}
            <em>nothing</em> as fraud is 99% accurate — and completely worthless.
            When classes are imbalanced, accuracy rewards the lazy majority guess.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            That&apos;s why we split the question: when it says fraud, is it right
            (<em>precision</em>)? And of all the real fraud, how much did it catch
            (<em>recall</em>)?
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-accuracy",
      prompt: "Why isn't raw accuracy always a good metric?",
      choices: [
        {
          text: "On imbalanced data, always guessing the majority class can score very high while being useless",
          correct: true,
          feedback:
            "Right — 99% accuracy means nothing if 99% of cases are one class and you missed all the rare ones.",
        },
        {
          text: "Accuracy is always the single best metric",
          feedback:
            "It can hide real failure modes — that's exactly the problem.",
        },
        {
          text: "Accuracy can't be computed for classifiers",
          feedback:
            "It can — it's just often not the most informative measure.",
        },
      ],
    },
    {
      kind: "explain",
      id: "tradeoff",
      eyebrow: "Precision vs recall: pick your pain",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Precision and recall usually trade off. A cancer screen should favour
            <em> recall</em> — missing a real case is far worse than a false alarm
            you can follow up. A spam filter leans toward <em>precision</em> —
            better to let some spam through than to bin an important email.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            The &quot;right&quot; metric depends on which mistake costs more. There
            is no universal best — only best <em>for this problem</em>.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-recall",
      prompt: "For a cancer-screening model, which usually matters more, and why?",
      choices: [
        {
          text: "Recall — missing a real case (a false negative) is far costlier than a false alarm",
          correct: true,
          feedback:
            "Right — you'd rather over-flag and follow up than let a real case slip through.",
        },
        {
          text: "Precision — false alarms are the worst possible outcome here",
          feedback:
            "A false alarm leads to a follow-up test; a missed cancer is far more dangerous. Recall wins here.",
        },
        {
          text: "Neither — only overall accuracy matters",
          feedback:
            "Accuracy hides the rare-but-critical cases. This is exactly where precision/recall matter most.",
        },
      ],
    },
    {
      kind: "explain",
      id: "match-goal",
      eyebrow: "The metric is the target",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Teams optimise toward whatever metric they track — so a mischosen
            metric quietly steers the whole effort wrong. Pick the number that
            reflects real-world success, watch more than one, and remember a metric
            is a simplification of what you actually care about.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Measure the wrong thing well, and you&apos;ll get exactly the wrong
            thing — efficiently.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-target",
      prompt: "Why does the choice of evaluation metric matter beyond just reporting?",
      choices: [
        {
          text: "Teams optimise toward the tracked metric, so a mischosen one steers the whole project the wrong way",
          correct: true,
          feedback:
            "Right — the metric becomes the goal. Pick one that reflects real success, and watch more than one.",
        },
        {
          text: "It only affects the final report, not the work",
          feedback:
            "It shapes the work — what you measure is what gets optimised.",
        },
        {
          text: "Any metric leads to the same model",
          feedback:
            "Different metrics reward different behaviour and produce different models.",
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
            Evaluation metrics turn &quot;good?&quot; into a number — but accuracy
            can lie on imbalanced data, precision and recall trade off, and the
            metric you track becomes the goal you chase. Choose it to match the
            cost of being wrong.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Metrics tell you <em>if</em> a network learned. How it learned, deep
            inside, is <strong>backpropagation</strong>.
          </p>
        </>
      ),
    },
  ],
};

export default lesson;
