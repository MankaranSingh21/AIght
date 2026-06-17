import type { Lesson } from "@/lib/lessons";
import DistillationDemo from "@/components/learn/DistillationDemo";

const lesson: Lesson = {
  slug: "distillation",
  title: "Distillation",
  tagline: "Teaching a small model to imitate a big one.",
  minutes: 6,
  steps: [
    {
      kind: "explain",
      id: "hook",
      eyebrow: "The idea",
      body: (
        <>
          <p style={{ margin: 0 }}>
            The best models are enormous — slow, costly, hard to serve at scale.
            What if a small model could learn to give nearly the same answers,
            by studying the big one&apos;s work?
          </p>
          <p style={{ margin: "1em 0 0" }}>
            That&apos;s <strong>distillation</strong>: a big{" "}
            <em>teacher</em> trains a small <em>student</em> to imitate it.
          </p>
        </>
      ),
    },
    {
      kind: "explain",
      id: "how",
      eyebrow: "Learn from the teacher's answers",
      body: (
        <>
          <p style={{ margin: 0 }}>
            You run the teacher on lots of inputs and record what it says — not
            just its final answer, but how confident it was across the options.
            The student trains to reproduce those responses.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Those richer signals — &quot;mostly A, but B was a close second&quot;
            — carry more than a bare right answer. The student soaks up the
            teacher&apos;s judgment, not just its conclusions.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-what",
      prompt: "What is model distillation?",
      choices: [
        {
          text: "Training a smaller student model to mimic a larger teacher model",
          correct: true,
          feedback:
            "Right — the student inherits much of the teacher's quality at a fraction of the size.",
        },
        {
          text: "Deleting the least-used layers of a model",
          feedback:
            "That's pruning. Distillation trains a fresh, smaller model to copy a bigger one.",
        },
        {
          text: "Lowering the precision of the weights",
          feedback:
            "That's quantization. Distillation is about a small model learning from a large one.",
        },
      ],
    },
    {
      kind: "interact",
      id: "demo",
      body: (
        <p style={{ margin: 0 }}>
          Watch a small student learn from a large teacher — and see how close it
          can land while being a fraction of the size.
        </p>
      ),
      demo: DistillationDemo,
      tryThis: "The student won't match the teacher exactly — but look how close, and how much cheaper.",
    },
    {
      kind: "check",
      id: "check-vs-quant",
      prompt: "How is distillation different from quantization?",
      choices: [
        {
          text: "Distillation trains a new, smaller model to copy a big one; quantization re-encodes an existing model's weights",
          correct: true,
          feedback:
            "Exactly — one produces a different model, the other compresses the same one. They're often used together.",
        },
        {
          text: "They're the same technique",
          feedback:
            "Different: distillation creates a student model; quantization lowers the precision of weights you already have.",
        },
        {
          text: "Distillation makes the model bigger",
          feedback:
            "The student is smaller than the teacher — shrinking is the whole point.",
        },
      ],
    },
    {
      kind: "explain",
      id: "tradeoffs",
      eyebrow: "What you give up",
      body: (
        <>
          <p style={{ margin: 0 }}>
            The student is rarely as good as the teacher at the hardest, rarest
            cases — that&apos;s the price of being small. And it can only inherit
            what the teacher actually demonstrates, including the teacher&apos;s
            blind spots.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            But for many real workloads, &quot;90% of the quality at 10% of the
            cost&quot; is exactly the trade you want.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-limit",
      prompt: "What's a real limitation of a distilled student model?",
      choices: [
        {
          text: "It tends to fall short of the teacher on the hardest cases, and inherits the teacher's blind spots",
          correct: true,
          feedback:
            "Right — small size has limits, and the student can only copy what the teacher shows it.",
        },
        {
          text: "It can never run faster than the teacher",
          feedback:
            "Speed is the main win — a smaller student is faster and cheaper to run.",
        },
        {
          text: "It requires no teacher at all",
          feedback:
            "The teacher is essential — its responses are the student's training signal.",
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
            Distillation compresses capability by having a small student learn
            from a large teacher&apos;s answers — most of the quality, a fraction
            of the cost. Pair it with quantization and you get models that are
            both small and cheap to run.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Big model to teach; small model to ship.
          </p>
        </>
      ),
    },
  ],
};

export default lesson;
