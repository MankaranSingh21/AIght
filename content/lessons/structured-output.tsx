import type { Lesson } from "@/lib/lessons";
import StructuredOutputDemo from "@/components/learn/StructuredOutputDemo";

const lesson: Lesson = {
  slug: "structured-output",
  title: "Structured Output",
  tagline: "Getting answers software can actually parse — not just prose.",
  minutes: 6,
  steps: [
    {
      kind: "explain",
      id: "hook",
      eyebrow: "The idea",
      body: (
        <>
          <p style={{ margin: 0 }}>
            A model that replies &quot;Sure! The total is about $42, due next
            Tuesday 🙂&quot; is lovely for a human and useless for a program. Code
            needs fields, not friendliness: an amount, a date, a status — in a
            shape it can read every single time.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            <strong>Structured output</strong> is making the model answer in
            exactly that machine-readable shape, like JSON.
          </p>
        </>
      ),
    },
    {
      kind: "explain",
      id: "why",
      eyebrow: "Reliability is the whole point",
      body: (
        <>
          <p style={{ margin: 0 }}>
            If your app expects <code>{`{"amount": 42, "due": "2026-...";}`}</code>{" "}
            and the model decides to add a chatty preamble, your parser breaks.
            At scale, &quot;usually formats it right&quot; means &quot;fails a few
            percent of the time&quot; — which in production is a constant fire.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            So you don&apos;t ask nicely and hope. You constrain the output so the
            shape is guaranteed.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-why",
      prompt: "Why ask a model for structured output like JSON?",
      choices: [
        {
          text: "So the answer can be reliably parsed and used by other software",
          correct: true,
          feedback:
            "Right — a predictable shape lets code consume the output without guessing.",
        },
        {
          text: "Because models can't produce normal prose",
          feedback:
            "They can — structure is for machine-readability, not because plain text is impossible.",
        },
        {
          text: "To make the model generate faster",
          feedback:
            "It's about a usable format, not speed.",
        },
      ],
    },
    {
      kind: "interact",
      id: "demo",
      body: (
        <p style={{ margin: 0 }}>
          Ask for the same information as free text and as a strict schema. One
          you can eyeball; the other you can feed straight into code.
        </p>
      ),
      demo: StructuredOutputDemo,
      tryThis: "The structured version is duller to read — and that's exactly why software loves it.",
    },
    {
      kind: "check",
      id: "check-how",
      prompt: "What's the most reliable way to get valid structured output?",
      choices: [
        {
          text: "Constrain the generation to a schema, so invalid shapes can't be produced",
          correct: true,
          feedback:
            "Right — schemas, constrained decoding, or tool/function calling enforce the shape rather than hoping for it.",
        },
        {
          text: "Politely ask in the prompt and trust it every time",
          feedback:
            "Prompting helps, but 'usually valid' breaks at scale. Enforcement beats hope.",
        },
        {
          text: "Generate prose and let users fix the format by hand",
          feedback:
            "That defeats the purpose — the point is output software can ingest automatically.",
        },
      ],
    },
    {
      kind: "explain",
      id: "tradeoffs",
      eyebrow: "A small catch",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Locking the output into a rigid shape can box the model in — a
            too-strict schema may force it to drop nuance or guess at a field it
            should have left blank. And valid JSON isn&apos;t the same as{" "}
            <em>correct</em> JSON: the structure can be perfect while the values
            are wrong.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Structure guarantees the form, never the truth inside it.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-limit",
      prompt: "Your model returns perfectly valid JSON. What does that guarantee?",
      choices: [
        {
          text: "Only that the shape is right — the values inside can still be wrong",
          correct: true,
          feedback:
            "Exactly — valid form, not guaranteed-correct content. You still have to check the facts.",
        },
        {
          text: "That every value is factually correct",
          feedback:
            "No — well-formed and accurate are different things. A tidy structure can hold a wrong number.",
        },
        {
          text: "That the model didn't hallucinate",
          feedback:
            "It can hallucinate in perfect JSON. Structure constrains the format, not the truthfulness.",
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
            Structured output is how a language model becomes a dependable
            component in software: enforce the shape so code can parse it every
            time. Just remember it guarantees the form, not the facts — validate
            the values too.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            It&apos;s the same instinct behind <strong>function calling</strong>:
            structured requests a program can act on.
          </p>
        </>
      ),
    },
  ],
};

export default lesson;
