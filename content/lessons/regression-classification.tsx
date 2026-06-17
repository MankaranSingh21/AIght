import type { Lesson } from "@/lib/lessons";

const lesson: Lesson = {
  slug: "regression-classification",
  title: "Regression & Classification",
  tagline: "Predicting a number, or predicting a category.",
  minutes: 5,
  steps: [
    {
      kind: "explain",
      id: "hook",
      eyebrow: "The idea",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Most supervised learning splits into two questions. &quot;How
            much?&quot; — a number. &quot;Which one?&quot; — a category. Almost
            every prediction task is one or the other in disguise.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            &quot;How much?&quot; is <strong>regression</strong>. &quot;Which
            one?&quot; is <strong>classification</strong>.
          </p>
        </>
      ),
    },
    {
      kind: "explain",
      id: "examples",
      eyebrow: "Number vs category",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Regression predicts a value on a continuous scale: a house price, a
            temperature, tomorrow&apos;s demand. The answer could be 412 or 413.7
            or anything in between.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Classification predicts which bucket something belongs to: spam or not,
            cat or dog or bird, approve or deny. The answer is one of a fixed set
            of labels — no in-between.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-diff",
      prompt: "What's the core difference between regression and classification?",
      choices: [
        {
          text: "Regression predicts a number; classification predicts a category",
          correct: true,
          feedback:
            "Right — a continuous value versus a discrete label like spam/not-spam.",
        },
        {
          text: "Regression is for images, classification for text",
          feedback:
            "Neither is tied to a data type — the difference is number versus category.",
        },
        {
          text: "They're two names for the same thing",
          feedback:
            "They're distinct tasks: continuous outputs versus discrete classes.",
        },
      ],
    },
    {
      kind: "check",
      id: "check-which",
      prompt: "Predicting how many days until a machine needs maintenance is which kind of task?",
      choices: [
        {
          text: "Regression — the answer is a number on a continuous scale",
          correct: true,
          feedback:
            "Right — '4.5 days' is a value, not a category, so it's regression.",
        },
        {
          text: "Classification — it picks from fixed labels",
          feedback:
            "There are no fixed buckets here — the answer is a continuous number of days.",
        },
        {
          text: "Clustering — it has no answer key",
          feedback:
            "There is an answer to predict (days), so it's supervised — specifically regression.",
        },
      ],
    },
    {
      kind: "explain",
      id: "consequences",
      eyebrow: "It changes everything downstream",
      body: (
        <>
          <p style={{ margin: 0 }}>
            The choice ripples through the whole pipeline. They use different loss
            functions, different output shapes, and different success metrics —
            &quot;how far off was the number?&quot; for regression, &quot;how often
            was the label right?&quot; for classification.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Many problems can be framed either way, too. &quot;How likely is this
            customer to churn?&quot; (a probability — regression-ish) versus
            &quot;will they churn, yes or no?&quot; (classification). How you frame
            it shapes what you can do with the answer.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-metric",
      prompt: "Why can't you score a regression model with plain 'accuracy' the way you score a classifier?",
      choices: [
        {
          text: "Regression answers are continuous — 'exactly right' rarely happens, so you measure how far off it is instead",
          correct: true,
          feedback:
            "Right — regression uses error-size metrics; accuracy fits discrete labels, not continuous values.",
        },
        {
          text: "Accuracy works perfectly for both with no change",
          feedback:
            "Not really — demanding an exact numeric match would call nearly everything 'wrong'.",
        },
        {
          text: "Regression models don't produce any output to score",
          feedback:
            "They produce a number — you just score it by distance from the truth, not exact match.",
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
            Regression predicts a number; classification predicts a category. The
            distinction sets your loss, your output, and how you measure success —
            so naming the task correctly is the first real decision in a project.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Both need labelled answers to learn from. When there are no labels at
            all, you turn to <strong>clustering</strong>.
          </p>
        </>
      ),
    },
  ],
};

export default lesson;
