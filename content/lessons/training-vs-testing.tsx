import type { Lesson } from "@/lib/lessons";

const lesson: Lesson = {
  slug: "training-vs-testing",
  title: "Training vs Testing",
  tagline: "The only honest way to know if a model actually learned.",
  minutes: 5,
  steps: [
    {
      kind: "explain",
      id: "hook",
      eyebrow: "The idea",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Hand a student the exam answers, let them study those exact questions,
            then test them on the same paper. A perfect score proves nothing — you
            measured memory, not understanding.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Evaluate a model on the data it trained on and you make the identical
            mistake. So practitioners split their data: some to learn from, some
            held back to test on.
          </p>
        </>
      ),
    },
    {
      kind: "explain",
      id: "split",
      eyebrow: "Two piles, kept apart",
      body: (
        <>
          <p style={{ margin: 0 }}>
            The <em>training set</em> is what the model learns from. The{" "}
            <em>test set</em> is locked away and never seen during training, then
            used at the end to ask the real question: how does it do on examples it
            has never encountered?
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Performance on the test set is your honest estimate of how the model
            will behave in the wild.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-why",
      prompt: "Why hold out a separate test set the model never trains on?",
      choices: [
        {
          text: "To check whether it generalises, rather than just memorised the training data",
          correct: true,
          feedback:
            "Right — testing on training data flatters the model and hides whether it truly learned the pattern.",
        },
        {
          text: "To give the model more data to learn from",
          feedback:
            "The test set is deliberately withheld — learning from it defeats its entire purpose.",
        },
        {
          text: "Because testing is faster than training",
          feedback:
            "Speed isn't the point — an honest estimate of real-world performance is.",
        },
      ],
    },
    {
      kind: "explain",
      id: "generalisation",
      eyebrow: "Generalisation is the goal",
      body: (
        <>
          <p style={{ margin: 0 }}>
            The whole point of a model is to work on data it hasn&apos;t seen.
            That ability — to carry a learned pattern over to new cases — is{" "}
            <em>generalisation</em>. A model that scores high on training but low
            on testing memorised; one that scores well on both generalised.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            The gap between training and test performance is one of the most
            telling numbers in all of machine learning.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-gap",
      prompt: "A model scores 98% on training data and 70% on the test set. What does that gap suggest?",
      choices: [
        {
          text: "It memorised the training data and generalises poorly — a sign of overfitting",
          correct: true,
          feedback:
            "Right — a large train-minus-test gap is the classic overfitting signature.",
        },
        {
          text: "It generalised perfectly",
          feedback:
            "Perfect generalisation means close scores on both. A 28-point gap is the opposite.",
        },
        {
          text: "The test set must be broken",
          feedback:
            "More likely the model overfit — the gap is informative, not a bug in the test set.",
        },
      ],
    },
    {
      kind: "explain",
      id: "leakage",
      eyebrow: "Don't peek",
      body: (
        <>
          <p style={{ margin: 0 }}>
            The test set only stays honest if it stays untouched. Let test
            examples sneak into training, or tune your model over and over against
            the test results, and you&apos;ve quietly contaminated it — the score
            climbs while real performance doesn&apos;t. That&apos;s why a third
            <em> validation</em> set is often used for tuning, keeping the test set
            pristine for the final word.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            A test set you&apos;ve optimised against is just a slower training set.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-leak",
      prompt: "Why can repeatedly tuning a model against the test set be misleading?",
      choices: [
        {
          text: "You start fitting the model to that specific test set, so the score overstates real-world performance",
          correct: true,
          feedback:
            "Right — it quietly leaks. A separate validation set for tuning keeps the test set an honest final check.",
        },
        {
          text: "It makes training slower",
          feedback:
            "Speed isn't the issue — the problem is the test score stops reflecting unseen data.",
        },
        {
          text: "It never causes any problem",
          feedback:
            "It does — over-tuning to the test set is a well-known way to fool yourself.",
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
            Split your data, train on one part, and judge on a held-out part the
            model never saw. The test score — and the gap from the training score
            — is how you know whether a model learned the pattern or just the
            answers.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            And to compute any of these scores, you need a way to measure error:{" "}
            <strong>loss functions</strong>.
          </p>
        </>
      ),
    },
  ],
};

export default lesson;
