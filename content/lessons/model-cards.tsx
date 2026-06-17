import type { Lesson } from "@/lib/lessons";
import ModelCardsDemo from "@/components/learn/ModelCardsDemo";

const lesson: Lesson = {
  slug: "model-cards",
  title: "Model Cards",
  tagline: "The label on the tin — what a model is for, and isn't.",
  minutes: 5,
  steps: [
    {
      kind: "explain",
      id: "hook",
      eyebrow: "The idea",
      body: (
        <>
          <p style={{ margin: 0 }}>
            You wouldn&apos;t buy a medicine with no label — no dosage, no
            warnings, no &quot;do not operate heavy machinery.&quot; Yet powerful
            models often ship as a black box with a name and a benchmark score.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            A <strong>model card</strong> is the label: a short document on what a
            model is for, how it behaves, and where it shouldn&apos;t be trusted.
          </p>
        </>
      ),
    },
    {
      kind: "explain",
      id: "whats-in",
      eyebrow: "What's on the card",
      body: (
        <>
          <p style={{ margin: 0 }}>
            A good card covers the unglamorous-but-vital: intended uses and
            out-of-scope ones, the kind of data it was trained on, how it performs
            (and for whom), known limitations and biases, and the risks of misuse.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            The limitations section is the point. A benchmark tells you the best
            case; the card is supposed to tell you the failure cases.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-what",
      prompt: "What is a model card?",
      choices: [
        {
          text: "A short document describing a model's intended use, performance, limits, and risks",
          correct: true,
          feedback:
            "Right — a transparency label, like nutrition facts for a model.",
        },
        {
          text: "A collectible trading card with the model's stats",
          feedback:
            "It's documentation for responsible use, not a collectible.",
        },
        {
          text: "The invoice for using the model's API",
          feedback:
            "It's about what the model is and isn't good for, not billing.",
        },
      ],
    },
    {
      kind: "interact",
      id: "demo",
      body: (
        <p style={{ margin: 0 }}>
          Read a model card and notice what it tells you that a single accuracy
          number never could.
        </p>
      ),
      demo: ModelCardsDemo,
      tryThis: "Look for the limitations and intended-use sections — that's where the real information is.",
    },
    {
      kind: "check",
      id: "check-value",
      prompt: "Why is the 'limitations' section often the most useful part of a model card?",
      choices: [
        {
          text: "It tells you the failure cases — where the model shouldn't be trusted — which a benchmark score hides",
          correct: true,
          feedback:
            "Exactly — knowing where a model breaks is what keeps you from deploying it into that exact spot.",
        },
        {
          text: "Because it lists the model's price",
          feedback:
            "Pricing isn't the point — it's about scope and failure modes.",
        },
        {
          text: "Because limitations don't really matter",
          feedback:
            "They matter most — they're the difference between safe use and a quiet disaster.",
        },
      ],
    },
    {
      kind: "explain",
      id: "caveat",
      eyebrow: "Only as honest as it's written",
      body: (
        <>
          <p style={{ margin: 0 }}>
            A model card is voluntary prose, not an audit. It&apos;s only as
            useful as the authors are candid — a vague or rosy card can give false
            comfort. Still, the practice matters: it makes intended use and known
            risks <em>explicit</em>, something to point to and hold a model maker
            accountable for.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Read it skeptically — but be far more wary of a model that ships
            without one.
          </p>
        </>
      ),
    },
    {
      kind: "explain",
      id: "wrap",
      eyebrow: "Keep this",
      body: (
        <>
          <p style={{ margin: 0 }}>
            A model card documents what a model is for, how it performs, and where
            it fails — the context a bare score leaves out. It won&apos;t make a
            model safe by itself, but it makes responsible use possible and
            accountability concrete.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            No label is no excuse — but a label still has to be read with open
            eyes.
          </p>
        </>
      ),
    },
  ],
};

export default lesson;
