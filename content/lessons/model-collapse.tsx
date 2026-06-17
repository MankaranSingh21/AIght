import type { Lesson } from "@/lib/lessons";
import ModelCollapseDemo from "@/components/learn/ModelCollapseDemo";

const lesson: Lesson = {
  slug: "model-collapse",
  title: "Model Collapse",
  tagline: "What happens when models learn from other models, over and over.",
  minutes: 6,
  steps: [
    {
      kind: "explain",
      id: "hook",
      eyebrow: "The idea",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Photocopy a photocopy of a photocopy. Each pass looks fine on its
            own, but a dozen generations later the image is mush. Train AI models
            on the output of earlier AI models, again and again, and something
            eerily similar happens.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            That degradation is <strong>model collapse</strong>.
          </p>
        </>
      ),
    },
    {
      kind: "explain",
      id: "how",
      eyebrow: "The tails go first",
      body: (
        <>
          <p style={{ margin: 0 }}>
            A model&apos;s output slightly under-represents the rare, the weird,
            the long-tail. Train the next model on that output and it starts from
            an already-narrowed world — and narrows it further. Generation by
            generation, the unusual vanishes and everything drifts toward a bland
            average.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            First the edges of the distribution disappear; eventually the middle
            gets distorted too.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-what",
      prompt: "What is model collapse?",
      choices: [
        {
          text: "Quality degrades when models are trained repeatedly on AI-generated data",
          correct: true,
          feedback:
            "Right — errors and narrowing compound as each generation learns from the last model's output.",
        },
        {
          text: "The training server physically crashing",
          feedback:
            "It's a data-quality spiral across generations, not a hardware failure.",
        },
        {
          text: "A model suddenly forgetting its own name",
          feedback:
            "It's a gradual loss of diversity and quality, not an abrupt memory wipe.",
        },
      ],
    },
    {
      kind: "interact",
      id: "demo",
      body: (
        <p style={{ margin: 0 }}>
          Run the loop — each model trains on the previous one&apos;s output —
          and watch the variety drain away with every generation.
        </p>
      ),
      demo: ModelCollapseDemo,
      tryThis: "Watch the rare cases die first, then the whole thing flatten toward sameness.",
    },
    {
      kind: "check",
      id: "check-first",
      prompt: "What tends to disappear first as collapse sets in?",
      choices: [
        {
          text: "The rare, long-tail cases — the unusual examples the previous model already under-produced",
          correct: true,
          feedback:
            "Right — the tails thin out first, then the distortion creeps toward the common cases.",
        },
        {
          text: "The most common, everyday outputs",
          feedback:
            "Those hold on longest. It's the rare edges that erode first.",
        },
        {
          text: "Only the model's ability to format text",
          feedback:
            "It's about losing diversity and fidelity across the board, not just formatting.",
        },
      ],
    },
    {
      kind: "explain",
      id: "why-matters",
      eyebrow: "Why people worry",
      body: (
        <>
          <p style={{ margin: 0 }}>
            As the open web fills with AI-generated text and images, tomorrow&apos;s
            models will inevitably scrape some of yesterday&apos;s output — risking
            exactly this loop at scale. The defence is keeping a strong anchor of
            genuine human data, and being deliberate about how much synthetic
            data goes into the mix.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Real, diverse data isn&apos;t just nice to have — it&apos;s what keeps
            the loop from closing.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-defense",
      prompt: "What's the main guard against model collapse?",
      choices: [
        {
          text: "Keep a solid base of real, diverse human data rather than training mostly on model output",
          correct: true,
          feedback:
            "Right — anchoring to genuine data preserves the variety that recursive training erodes.",
        },
        {
          text: "Train each generation on even more AI-generated data",
          feedback:
            "That accelerates the collapse — it's the cause, not the cure.",
        },
        {
          text: "Use a faster GPU",
          feedback:
            "Speed doesn't touch the problem — it's about the *source* and diversity of the data.",
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
            Model collapse is the slow rot of training models on models: diversity
            drains, the tails vanish, quality flattens. It&apos;s why genuine
            human data — and restraint with synthetic data — stays precious.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Copies of copies fade. Originals are what keep the picture sharp.
          </p>
        </>
      ),
    },
  ],
};

export default lesson;
