import type { Lesson } from "@/lib/lessons";
import WatermarkingDemo from "@/components/learn/WatermarkingDemo";

const lesson: Lesson = {
  slug: "watermarking",
  title: "Watermarking",
  tagline: "Hiding a signature in AI output, so it can be spotted later.",
  minutes: 5,
  steps: [
    {
      kind: "explain",
      id: "hook",
      eyebrow: "The idea",
      body: (
        <>
          <p style={{ margin: 0 }}>
            As AI text and images flood the web, a hard question gets louder: was
            this made by a machine? Telling by eye is increasingly hopeless. So
            what if the model left a mark — invisible to readers, but detectable
            if you know what to look for?
          </p>
          <p style={{ margin: "1em 0 0" }}>
            That mark is a <strong>watermark</strong>.
          </p>
        </>
      ),
    },
    {
      kind: "explain",
      id: "how",
      eyebrow: "A bias you can't see",
      body: (
        <>
          <p style={{ margin: 0 }}>
            For text, one approach nudges the model&apos;s token choices toward a
            secret &quot;preferred&quot; set at each step. Any single word still
            looks natural — but across a whole passage, the pattern shows up under
            a statistical test. A detector that knows the secret can say
            &quot;this was very likely generated.&quot;
          </p>
          <p style={{ margin: "1em 0 0" }}>
            The reader sees ordinary writing; the signal hides in the
            distribution.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-what",
      prompt: "What's the goal of watermarking AI output?",
      choices: [
        {
          text: "Embedding a detectable signal so AI-generated content can be identified later",
          correct: true,
          feedback:
            "Right — usually an invisible statistical fingerprint, not a visible stamp.",
        },
        {
          text: "Adding a visible company logo to every answer",
          feedback:
            "Watermarks here are typically hidden signals, not visible branding.",
        },
        {
          text: "Protecting the model from computer viruses",
          feedback:
            "It's about the provenance of the output, not security against malware.",
        },
      ],
    },
    {
      kind: "interact",
      id: "demo",
      body: (
        <p style={{ margin: 0 }}>
          Generate watermarked and unwatermarked text and run the detector. The
          text reads the same — the signal only shows up under the test.
        </p>
      ),
      demo: WatermarkingDemo,
      tryThis: "You can't see the watermark by reading — only the statistical detector can.",
    },
    {
      kind: "check",
      id: "check-how",
      prompt: "How is a text watermark usually hidden?",
      choices: [
        {
          text: "By subtly biasing token choices so a pattern emerges across the whole text, invisible word-by-word",
          correct: true,
          feedback:
            "Right — no single word gives it away; the signal lives in the aggregate distribution.",
        },
        {
          text: "By printing 'AI GENERATED' at the top of every response",
          feedback:
            "That would be a visible label — watermarks are designed to be unobtrusive and statistical.",
        },
        {
          text: "By encrypting the entire text so no one can read it",
          feedback:
            "The text stays perfectly readable — the watermark is a hidden pattern, not encryption.",
        },
      ],
    },
    {
      kind: "explain",
      id: "limits",
      eyebrow: "Easier to dodge than you'd hope",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Watermarks are fragile. Paraphrase the text, translate it, or edit it
            heavily and the signal weakens or washes out. They only work if the
            generator chose to add one — an open model can simply omit it. And
            they raise false-positive worries: wrongly flagging human writing as
            machine-made has real costs.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Helpful for provenance at scale, never a guarantee for any single
            piece of text.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-limit",
      prompt: "Why can't watermarking reliably prove a specific piece of text is AI-generated?",
      choices: [
        {
          text: "It can be removed by paraphrasing or editing, and only exists if the generator added it in the first place",
          correct: true,
          feedback:
            "Right — evadable and opt-in, so absence of a watermark proves nothing, and edits erode presence.",
        },
        {
          text: "Because detectors are illegal to run",
          feedback:
            "There's no legal barrier — the limits are technical: evasion, opt-in generators, false positives.",
        },
        {
          text: "Because watermarks make text unreadable",
          feedback:
            "The text stays perfectly readable — that's the whole design.",
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
            Watermarking hides a detectable statistical signal in AI output to
            help trace provenance. It&apos;s a useful tool at scale — and an
            evadable, opt-in one that can&apos;t be the last word on whether any
            single text was machine-made.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            A faint signature in the noise — real, but rubbable-off.
          </p>
        </>
      ),
    },
  ],
};

export default lesson;
