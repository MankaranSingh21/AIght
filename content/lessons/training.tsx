import type { Lesson } from "@/lib/lessons";
import TrainingDemo from "@/components/learn/TrainingDemo";

const lesson: Lesson = {
  slug: "training",
  title: "How Models Are Trained",
  tagline: "From random noise to fluent text, by being wrong trillions of times.",
  minutes: 7,
  steps: [
    {
      kind: "explain",
      id: "hook",
      eyebrow: "The idea",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Every model you&apos;ve used started as random noise — billions of
            weights initialized to essentially nothing. Weeks of training on
            thousands of chips later, those weights have organized into
            something that writes and reasons.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            The key insight needs no PhD: <strong>a model gets better by
            being wrong</strong>. Predict, get corrected, adjust, repeat.
          </p>
        </>
      ),
    },
    {
      kind: "interact",
      id: "demo",
      body: (
        <p style={{ margin: 0 }}>
          Step through the pipeline a model goes through, stage by stage.
        </p>
      ),
      demo: TrainingDemo,
      tryThis: "Note how each stage changes what the model is for.",
    },
    {
      kind: "check",
      id: "check-pretrain",
      prompt: "What single task does pretraining consist of?",
      choices: [
        {
          text: "Answering human questions with feedback from teachers",
          feedback:
            "No humans in this phase — that comes later. Pretraining is fully unsupervised.",
        },
        {
          text: "Predicting the next token, trillions of times",
          correct: true,
          feedback:
            "That's all of it. The “label” for every piece of text is simply the next word — which is why internet-scale data works.",
        },
        {
          text: "Memorizing a database of verified facts",
          feedback:
            "There's no fact database — just text and the pressure to predict it well.",
        },
      ],
    },
    {
      kind: "explain",
      id: "proxy",
      eyebrow: "Why it works",
      body: (
        <>
          <p style={{ margin: 0 }}>
            &quot;Predict the next word&quot; sounds too simple to produce
            GPT-4. Most of the field thought so too. But predicting text well
            forces a model to absorb grammar, facts, and reasoning patterns —
            because all of them are required to predict well.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Prediction accuracy is a proxy for understanding. Scale did the
            rest.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-raw",
      prompt: "What can a model do right after pretraining, before any tuning?",
      choices: [
        {
          text: "Follow instructions like a helpful assistant",
          feedback:
            "Not yet — instruction-following has to be taught in a second phase.",
        },
        {
          text: "Continue text plausibly — not necessarily helpfully",
          correct: true,
          feedback:
            "Right — a powerful but raw text predictor. Ask it a question and it might continue with three more questions.",
        },
        {
          text: "Nothing — it's still random noise",
          feedback:
            "Pretraining is where almost all the capability comes from — what's missing is the assistant behavior.",
        },
      ],
    },
    {
      kind: "explain",
      id: "tuning",
      eyebrow: "Making an assistant",
      body: (
        <>
          <p style={{ margin: 0 }}>
            <strong>Instruction tuning</strong> (supervised fine-tuning) trains
            the raw predictor on curated prompt → ideal-response pairs, teaching
            it to behave as an assistant rather than a text completer.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Quality beats quantity here: a small, well-curated instruction set
            routinely outperforms a huge noisy one. Stanford&apos;s Alpaca made
            the point with just ~52k examples.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-phases",
      prompt:
        "A model answers questions helpfully and declines harmful requests. Which is the right account of how it got there?",
      choices: [
        {
          text: "One giant training run taught it everything at once",
          feedback:
            "It's staged — capability and behavior come from different phases.",
        },
        {
          text: "Pretraining built the capability; instruction tuning and preference training shaped the behavior",
          correct: true,
          feedback:
            "Right — raw prediction first, then assistant behavior, then preference alignment (RLHF and friends, a separate lesson's worth).",
        },
        {
          text: "Engineers hand-coded the helpful responses",
          feedback:
            "Nobody writes the responses into the weights — behavior is trained, not programmed.",
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
            Noise → next-token predictor → assistant. Unsupervised scale builds
            the capability; curated tuning shapes the behavior.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            The preference-shaping step has its own machinery —{" "}
            <strong>RLHF</strong> — and its own essay.
          </p>
        </>
      ),
    },
  ],
};

export default lesson;
