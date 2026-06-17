import type { Lesson } from "@/lib/lessons";

const lesson: Lesson = {
  slug: "what-is-a-model",
  title: "What Is a Model?",
  tagline: "Not a brain, not a database — just a very large pile of numbers.",
  minutes: 5,
  steps: [
    {
      kind: "explain",
      id: "hook",
      eyebrow: "The idea",
      body: (
        <>
          <p style={{ margin: 0 }}>
            We say &quot;the model&quot; as if it were a thing with a personality.
            Concretely, it&apos;s far more boring: a giant collection of numbers —
            the <em>weights</em> — plus the wiring that says how to combine them.
            That&apos;s it. That&apos;s the model.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Everything it &quot;knows&quot; is encoded in those numbers.
          </p>
        </>
      ),
    },
    {
      kind: "explain",
      id: "function",
      eyebrow: "A machine that maps inputs to outputs",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Think of a model as a function: feed in an input (some text, an
            image), and the weights transform it, step by step, into an output (a
            next word, a label). Training is the process of tuning those weights
            until the mapping is useful.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Same architecture, different weights, completely different model. The
            numbers are where the learning lives.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-what",
      prompt: "What is an AI model, concretely?",
      choices: [
        {
          text: "A set of learned numbers (parameters) plus an architecture that maps inputs to outputs",
          correct: true,
          feedback:
            "Right — training tunes those weights; the model *is* the numbers plus the wiring.",
        },
        {
          text: "A physical robot or a particular server",
          feedback:
            "Hardware runs the model, but the model itself is the learned parameters.",
        },
        {
          text: "A copy of the internet stored word-for-word",
          feedback:
            "It doesn't store text verbatim — it compresses patterns into weights.",
        },
      ],
    },
    {
      kind: "explain",
      id: "not-database",
      eyebrow: "Not a database of facts",
      body: (
        <>
          <p style={{ margin: 0 }}>
            A common misread: that a model is a searchable library of everything
            it read. It isn&apos;t. Training <em>compresses</em> patterns from the
            data into the weights — it doesn&apos;t keep the documents. The model
            can&apos;t look anything up; it can only reconstruct from what those
            numbers encode.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            That&apos;s why it can paraphrase an idea perfectly and still get a
            specific fact wrong — there was never a record to retrieve.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-database",
      prompt: "Why can't a base model reliably 'look up' an exact fact it was trained on?",
      choices: [
        {
          text: "Training compresses patterns into weights — it doesn't store the original documents to retrieve",
          correct: true,
          feedback:
            "Right — there's no archive inside, only learned patterns. Reconstruction, not retrieval.",
        },
        {
          text: "Because the model deleted its training data out of caution",
          feedback:
            "It was never stored verbatim in the first place — training keeps patterns, not the source text.",
        },
        {
          text: "Because looking things up is too slow",
          feedback:
            "Speed isn't the issue — there's simply no stored copy to look up.",
        },
      ],
    },
    {
      kind: "explain",
      id: "size",
      eyebrow: "Why 'how many parameters' is a headline",
      body: (
        <>
          <p style={{ margin: 0 }}>
            When you hear a model has &quot;70 billion parameters,&quot; that&apos;s
            the count of those tunable numbers. More parameters means more
            capacity to capture patterns — but also more memory, compute, and
            cost. Bigger isn&apos;t automatically better; it&apos;s a trade.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            The weights are the model&apos;s substance; their count is one rough
            measure of its capacity.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-params",
      prompt: "What does a model's 'parameter count' refer to?",
      choices: [
        {
          text: "The number of tunable numbers (weights) it has — a rough measure of capacity",
          correct: true,
          feedback:
            "Right — more parameters means more capacity, at more memory and compute cost.",
        },
        {
          text: "The number of questions it can answer",
          feedback:
            "It's not a count of answers — it's the count of the weights inside the model.",
        },
        {
          text: "How many users can run it at once",
          feedback:
            "That's a serving concern — parameters are the model's internal numbers.",
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
            A model is learned numbers plus an architecture — a function that maps
            inputs to outputs, with its knowledge compressed into weights rather
            than stored as facts. Not a mind, not a database: a very large,
            carefully tuned pile of numbers.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Hold that picture and terms like training, fine-tuning, and parameters
            all click into place.
          </p>
        </>
      ),
    },
  ],
};

export default lesson;
