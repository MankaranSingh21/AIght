import type { Lesson } from "@/lib/lessons";
import HallucinationDemo from "@/components/learn/HallucinationDemo";

const lesson: Lesson = {
  slug: "hallucination",
  title: "Hallucination",
  tagline: "Fluent, confident, and wrong — without ever lying.",
  minutes: 6,
  steps: [
    {
      kind: "explain",
      id: "hook",
      eyebrow: "The idea",
      body: (
        <>
          <p style={{ margin: 0 }}>
            AI models don&apos;t lie. They don&apos;t know they&apos;re wrong.
            When a model cites a paper that doesn&apos;t exist or invents a
            court case with perfect confidence, it&apos;s doing exactly what it
            was trained to do: predict the most plausible continuation of text.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            The plausible continuation just sometimes happens to be false.
            That&apos;s <strong>hallucination</strong>.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-why",
      prompt: "Why does a model state false facts so confidently?",
      choices: [
        {
          text: "It's trained to sound persuasive even when unsure",
          feedback:
            "Confident tone is a side effect, not the cause. The root is what the model optimizes for.",
        },
        {
          text: "“Statistically likely text” and “factually true text” are different things — and it only learned the first",
          correct: true,
          feedback:
            "That's the gap. A plausible-sounding biography pattern-matches beautifully whether or not the person exists.",
        },
        {
          text: "Its training data was mostly fiction",
          feedback:
            "Even a model trained purely on accurate text would hallucinate — the failure is in prediction, not the diet.",
        },
      ],
    },
    {
      kind: "explain",
      id: "no-alarm",
      eyebrow: "No internal alarm",
      body: (
        <>
          <p style={{ margin: 0 }}>
            There&apos;s no internal truth-checker. From the model&apos;s
            perspective, generating a real fact and a made-up one feel exactly
            the same. No ground-truth database is consulted at inference time —
            only learned patterns.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Risk varies by task: rare, obscure topics are highest-risk;
            well-documented common facts are lower. Calibrate your skepticism
            to the obscurity of the claim.
          </p>
        </>
      ),
    },
    {
      kind: "interact",
      id: "demo",
      body: (
        <p style={{ margin: 0 }}>
          Compare a hallucinated answer with a grounded one.
        </p>
      ),
      demo: HallucinationDemo,
      tryThis: "Notice the tone is identical — only the sourcing differs.",
    },
    {
      kind: "check",
      id: "check-spot",
      prompt: "Which request is most likely to produce a hallucination?",
      choices: [
        {
          text: "“Summarize this article I'm pasting below”",
          feedback:
            "Working from provided text is the safer mode — the model synthesizes instead of recalling.",
        },
        {
          text: "“List the publications of this obscure 1970s researcher”",
          correct: true,
          feedback:
            "Rare-entity factual recall is the classic danger zone — the model knows what publication lists look like, not what this one contains.",
        },
        {
          text: "“Rewrite this paragraph in a friendlier tone”",
          feedback:
            "Style transfer barely touches factual recall — low risk.",
        },
      ],
    },
    {
      kind: "explain",
      id: "grounding",
      eyebrow: "The grounding fix",
      body: (
        <>
          <p style={{ margin: 0 }}>
            <strong>Grounding</strong> anchors outputs to verified sources —
            most commonly via RAG: retrieve real documents at query time and
            make the model work from them. Its job becomes synthesis, not
            recall.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            That doesn&apos;t eliminate hallucination — models can still
            misread a document — but it moves the failure from invisible to
            auditable. Treat models as reasoning engines, not knowledge stores.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-rag",
      prompt: "Grounding a model with RAG changes the failure mode how?",
      choices: [
        {
          text: "It guarantees factual accuracy",
          feedback:
            "No guarantee — models can still misread or misweight the documents you give them.",
        },
        {
          text: "Mistakes become misreadings of inspectable documents instead of inventions from nothing",
          correct: true,
          feedback:
            "Exactly — invisible failure becomes auditable failure. That's the real win.",
        },
        {
          text: "The model refuses to answer anything outside the documents",
          feedback:
            "Only if you explicitly constrain it to — RAG by itself doesn't enforce that.",
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
            Hallucination isn&apos;t deception — it&apos;s plausibility without
            verification, and there&apos;s no internal “I don&apos;t know”
            signal to save you.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Give the model knowledge and let it reason about it. How that works
            in practice is the <strong>RAG</strong> lesson.
          </p>
        </>
      ),
    },
  ],
};

export default lesson;
