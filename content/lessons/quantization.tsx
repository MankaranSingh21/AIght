import type { Lesson } from "@/lib/lessons";
import QuantizationDemo from "@/components/learn/QuantizationDemo";

const lesson: Lesson = {
  slug: "quantization",
  title: "Quantization",
  tagline: "Shrinking a model by storing its numbers more coarsely.",
  minutes: 6,
  steps: [
    {
      kind: "explain",
      id: "hook",
      eyebrow: "The idea",
      body: (
        <>
          <p style={{ margin: 0 }}>
            A model&apos;s knowledge lives in billions of numbers — its weights.
            Store each one at full precision and a large model won&apos;t fit on
            anything but serious hardware. So what if we kept the same numbers,
            just <em>rounder</em>?
          </p>
          <p style={{ margin: "1em 0 0" }}>
            That&apos;s <strong>quantization</strong>: representing each weight
            with fewer bits.
          </p>
        </>
      ),
    },
    {
      kind: "explain",
      id: "how",
      eyebrow: "Fewer bits per number",
      body: (
        <>
          <p style={{ margin: 0 }}>
            A weight might normally take 16 bits. Quantize it to 8, or even 4,
            and you&apos;ve halved or quartered the memory. The number gets
            slightly less precise — 0.7341 becomes 0.73 — but across billions of
            weights, those tiny roundings mostly wash out.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Smaller weights mean less memory and faster math, which is why a
            quantized model can run on a laptop — or a phone — that the full one
            never could.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-what",
      prompt: "What does quantization do to a model?",
      choices: [
        {
          text: "Stores its weights at lower numerical precision to shrink size and speed it up",
          correct: true,
          feedback:
            "Right — same weights, coarser numbers, far smaller footprint.",
        },
        {
          text: "Adds more parameters to push accuracy higher",
          feedback:
            "The opposite — it compresses the existing weights; it doesn't add any.",
        },
        {
          text: "Encrypts the weights so they can't be copied",
          feedback:
            "It reduces precision for size and speed, not for secrecy.",
        },
      ],
    },
    {
      kind: "interact",
      id: "demo",
      body: (
        <p style={{ margin: 0 }}>
          Dial the precision down and watch the trade play out — memory drops
          fast, quality holds for a while, then starts to fray.
        </p>
      ),
      demo: QuantizationDemo,
      tryThis: "Push to the lowest precision and notice where quality finally breaks.",
    },
    {
      kind: "check",
      id: "check-tradeoff",
      prompt: "What's the trade-off quantization makes?",
      choices: [
        {
          text: "A small loss of precision in exchange for much less memory and faster inference",
          correct: true,
          feedback:
            "Exactly — push too far and accuracy suffers, but moderate quantization is nearly free.",
        },
        {
          text: "It makes the model slower but more accurate",
          feedback:
            "Backwards — it speeds the model up, at a modest cost to precision.",
        },
        {
          text: "There's no trade-off; it's strictly better in every way",
          feedback:
            "There is a cost — go too low-bit and quality degrades. The art is stopping in time.",
        },
      ],
    },
    {
      kind: "explain",
      id: "why-matters",
      eyebrow: "Why it matters",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Quantization is a big part of why capable models now run locally,
            privately, and cheaply. It doesn&apos;t change what the model knows —
            it changes how expensively that knowledge is stored.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            It pairs naturally with other shrinking tricks. Quantization makes
            each number cheaper; <strong>distillation</strong> makes a smaller
            model in the first place.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-knowledge",
      prompt: "Does quantization change what a model knows?",
      choices: [
        {
          text: "No — it changes how precisely the weights are stored, not the knowledge in them",
          correct: true,
          feedback:
            "Right — same learned patterns, just recorded with fewer bits.",
        },
        {
          text: "Yes — it retrains the model on new data",
          feedback:
            "No new training happens; quantization just re-encodes the existing weights.",
        },
        {
          text: "Yes — it deletes the rarest facts to save space",
          feedback:
            "It doesn't prune knowledge selectively — it lowers precision across the board.",
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
            Quantization keeps a model&apos;s knowledge intact while storing it
            more coarsely — trading a little precision for a lot of memory and
            speed. It&apos;s how big models get small enough to live on everyday
            devices.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Coarser numbers, almost the same model — just far cheaper to run.
          </p>
        </>
      ),
    },
  ],
};

export default lesson;
