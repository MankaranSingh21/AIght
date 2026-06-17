import type { Lesson } from "@/lib/lessons";

const lesson: Lesson = {
  slug: "data-and-datasets",
  title: "Data & Datasets",
  tagline: "The raw material that quietly decides everything.",
  minutes: 5,
  steps: [
    {
      kind: "explain",
      id: "hook",
      eyebrow: "The idea",
      body: (
        <>
          <p style={{ margin: 0 }}>
            We talk endlessly about models and almost never about the thing that
            shapes them most: the data. A model doesn&apos;t learn from the world.
            It learns from whatever slice of the world someone collected and fed
            it.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Change the data and you change the model — its skills, its gaps, its
            blind spots.
          </p>
        </>
      ),
    },
    {
      kind: "explain",
      id: "gigo",
      eyebrow: "Garbage in, garbage out",
      body: (
        <>
          <p style={{ margin: 0 }}>
            The oldest rule in computing applies with a vengeance. A model trained
            on sloppy, skewed, or thin data learns sloppy, skewed, thin patterns —
            and states them with total confidence. It can&apos;t rise above its
            ingredients.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            More isn&apos;t automatically better, either. A huge pile of
            low-quality, repetitive data can be worse than a smaller, cleaner one.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-gigo",
      prompt: "Why does \"garbage in, garbage out\" matter so much for AI?",
      choices: [
        {
          text: "A model mostly inherits the patterns — and flaws — of the data it was trained on",
          correct: true,
          feedback:
            "Right — a model is a mirror of its data, biases and gaps included.",
        },
        {
          text: "Because more data always makes a model worse",
          feedback:
            "Not quantity itself — it's quality and representativeness. More clean data usually helps; more junk doesn't.",
        },
        {
          text: "Because models ignore their training data once deployed",
          feedback:
            "They don't — everything a model 'knows' was shaped by that data.",
        },
      ],
    },
    {
      kind: "explain",
      id: "representative",
      eyebrow: "Who's in the data?",
      body: (
        <>
          <p style={{ margin: 0 }}>
            The most important question about a dataset is often <em>who and what
            it left out</em>. A medical model trained mostly on one population, a
            voice model trained mostly on one accent — they work beautifully for
            the data they saw and stumble for everyone else.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            The data&apos;s blind spots quietly become the model&apos;s blind
            spots.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-rep",
      prompt: "A face-recognition model works great in testing but fails on certain groups in the real world. The likeliest cause?",
      choices: [
        {
          text: "Those groups were under-represented in the training data",
          correct: true,
          feedback:
            "Right — a model is reliable mainly for the kinds of examples it actually saw enough of.",
        },
        {
          text: "The model simply isn't big enough",
          feedback:
            "Size won't fix a representation gap — if the data didn't cover those cases, more parameters won't either.",
        },
        {
          text: "Real-world faces are fundamentally unlearnable",
          feedback:
            "They're very learnable — with representative data. The failure points back to what was collected.",
        },
      ],
    },
    {
      kind: "explain",
      id: "splits",
      eyebrow: "Not one pile, but parts",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Practitioners don&apos;t dump all their data into training. They split
            it: most for <em>training</em>, a held-out slice for{" "}
            <em>testing</em> on examples the model never saw. That&apos;s the only
            honest way to tell whether it actually learned the pattern or just
            memorised the answers.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            How you slice the data is as consequential as how much you have.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-split",
      prompt: "Why hold back part of the data instead of training on all of it?",
      choices: [
        {
          text: "To test the model on examples it never saw — checking it generalises rather than memorises",
          correct: true,
          feedback:
            "Exactly — a held-out set is the honest measure of real-world performance.",
        },
        {
          text: "To save disk space",
          feedback:
            "It's not about storage — it's about having untouched examples to evaluate on.",
        },
        {
          text: "Because models can only read a little data at a time",
          feedback:
            "They train on the whole training set — the held-out part is deliberately kept for honest testing.",
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
            Data is the quiet author of every model: its quality, its coverage,
            and how it&apos;s split decide what the model can do and where it
            fails. When a model surprises you — good or bad — the data is the first
            place to look.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Understand the data, and the model stops being a mystery.
          </p>
        </>
      ),
    },
  ],
};

export default lesson;
