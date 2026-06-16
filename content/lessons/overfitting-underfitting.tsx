import type { Lesson } from "@/lib/lessons";
import OverfittingDemo from "@/components/learn/OverfittingDemo";

const lesson: Lesson = {
  slug: "overfitting-underfitting",
  title: "Overfitting & Underfitting",
  tagline: "Acing the practice exam and flunking the real one.",
  minutes: 6,
  steps: [
    {
      kind: "explain",
      id: "hook",
      eyebrow: "The idea",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Imagine a student who memorises every answer on the practice exam —
            word for word — then sits the real test and falls apart the moment
            the questions are phrased differently. They didn&apos;t learn the
            subject. They learned the answer key.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Models do this too. It&apos;s called <strong>overfitting</strong>,
            and its mirror image is <strong>underfitting</strong>.
          </p>
        </>
      ),
    },
    {
      kind: "explain",
      id: "memorise",
      eyebrow: "Memorise vs generalise",
      body: (
        <>
          <p style={{ margin: 0 }}>
            We never care how a model does on data it trained on — it has
            already seen the answers. We care how it does on data it{" "}
            <em>hasn&apos;t</em> seen. That&apos;s why we hold out a separate
            test set.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            An overfit model has memorised quirks and noise in the training data
            that don&apos;t generalise. It looks brilliant in practice and
            mediocre in the wild.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-overfit",
      prompt:
        "A model scores 99% on its training data but 62% on fresh data. What's going on?",
      choices: [
        {
          text: "Underfitting — the model is too simple",
          feedback:
            "Underfitting scores poorly on both. A huge gap between train and test points the other way.",
        },
        {
          text: "Overfitting — it memorised the training set instead of learning the pattern",
          correct: true,
          feedback:
            "Exactly. A big train-minus-test gap is the textbook signature of overfitting.",
        },
        {
          text: "Perfect generalisation — 99% is great",
          feedback:
            "Generalisation means the two scores are close. A 37-point drop is the opposite of that.",
        },
      ],
    },
    {
      kind: "interact",
      id: "demo",
      body: (
        <p style={{ margin: 0 }}>
          Crank up the model&apos;s complexity and watch what happens to the
          training error versus the test error. They tell very different
          stories.
        </p>
      ),
      demo: OverfittingDemo,
      tryThis:
        "Push complexity to the max — training error keeps falling while test error turns and climbs.",
    },
    {
      kind: "check",
      id: "check-underfit",
      prompt: "What does underfitting look like?",
      choices: [
        {
          text: "Great on training data, poor on new data",
          feedback:
            "That's overfitting. Underfitting is worse — it can't even nail the data it trained on.",
        },
        {
          text: "Poor on both training and new data — the model is too simple to capture the pattern",
          correct: true,
          feedback:
            "Right. Too little capacity, and it misses the signal everywhere.",
        },
        {
          text: "Perfect on both",
          feedback:
            "That would be the dream, not a failure mode. Underfitting is the too-simple end.",
        },
      ],
    },
    {
      kind: "explain",
      id: "sweetspot",
      eyebrow: "The sweet spot",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Too simple and the model can&apos;t learn the pattern (underfit).
            Too complex and it learns the noise (overfit). The art is the middle
            — enough capacity to capture the real structure, not so much that it
            starts memorising accidents.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Tools to stay there: more data, simpler models, and{" "}
            <em>regularisation</em> — gentle pressure that discourages the model
            from contorting itself to fit every point.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-detect",
      prompt: "What's the most reliable way to catch overfitting?",
      choices: [
        {
          text: "Watch for a widening gap between training error and held-out test error",
          correct: true,
          feedback:
            "That gap is the tell. When training keeps improving but test stalls or worsens, you've gone too far.",
        },
        {
          text: "Check whether the training error reaches zero",
          feedback:
            "Low training error alone proves nothing — an overfit model often has the lowest training error of all.",
        },
        {
          text: "Count the number of layers",
          feedback:
            "Capacity is a factor, but the symptom you measure is the train/test gap, not the layer count.",
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
            Low training error is easy and almost meaningless on its own. What
            matters is the gap to unseen data. Overfit memorises; underfit
            oversimplifies; good models generalise.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            This is why the held-out <strong>test set</strong> — and honest{" "}
            <strong>evaluation</strong> — is the quiet hero of every model that
            actually works.
          </p>
        </>
      ),
    },
  ],
};

export default lesson;
