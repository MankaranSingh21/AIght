import type { Lesson } from "@/lib/lessons";
import RagSimulation from "@/components/learn/RagSimulation";

const lesson: Lesson = {
  slug: "rag",
  title: "Retrieval-Augmented Generation",
  tagline: "Before the model answers, it looks something up.",
  minutes: 7,
  steps: [
    {
      kind: "explain",
      id: "hook",
      eyebrow: "The idea",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Language models are trained once, then frozen. Their knowledge is a
            photograph, not a window — nothing after the training cutoff,
            nothing from your private documents.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            <strong>RAG</strong> — Retrieval-Augmented Generation — is the fix,
            and it&apos;s almost embarrassingly simple: before the model
            answers, it looks something up.
          </p>
        </>
      ),
    },
    {
      kind: "explain",
      id: "friend",
      eyebrow: "The mental model",
      body: (
        <p style={{ margin: 0 }}>
          Imagine a brilliant friend who read voraciously for years, then went
          off the grid. They reason beautifully — but they&apos;ve never seen
          your company&apos;s docs and don&apos;t know what happened last week.
          Now hand that friend a library card and a research assistant who
          sprints to the shelves and brings back the right pages before each
          question. That&apos;s RAG.
        </p>
      ),
    },
    {
      kind: "check",
      id: "check-steps",
      prompt: "What are the three steps of the simplest RAG pipeline, in order?",
      choices: [
        {
          text: "Embed documents → retrieve closest chunks → paste them into the prompt",
          correct: true,
          feedback:
            "That's the whole loop. The model reads the retrieved chunks right then, like you'd read a passage before answering.",
        },
        {
          text: "Fine-tune the model → cache its answers → filter for accuracy",
          feedback:
            "No fine-tuning involved — RAG's appeal is precisely that the model stays frozen.",
        },
        {
          text: "Search the web → summarize results → train on the summary",
          feedback:
            "Nothing gets trained at query time. Retrieval feeds the prompt, not the weights.",
        },
      ],
    },
    {
      kind: "interact",
      id: "demo",
      body: (
        <p style={{ margin: 0 }}>
          Run the loop yourself: a question goes in, chunks come back, an
          answer gets assembled.
        </p>
      ),
      demo: RagSimulation,
      tryThis: "Watch which chunks get retrieved — and which get left on the shelf.",
    },
    {
      kind: "check",
      id: "check-knows",
      prompt: "After a RAG query, does the model now “know” your documents?",
      choices: [
        {
          text: "Yes — retrieved documents are absorbed into the model",
          feedback:
            "Nothing is absorbed. The weights don't change at query time.",
        },
        {
          text: "No — it read them in the prompt, just for this one answer",
          correct: true,
          feedback:
            "Right. Next question starts from scratch: re-retrieve, re-read, re-answer.",
        },
        {
          text: "Only if the same question is asked twice",
          feedback:
            "Repetition doesn't teach it anything — every query is a fresh read.",
        },
      ],
    },
    {
      kind: "explain",
      id: "changes",
      eyebrow: "What it changes",
      body: (
        <>
          <p style={{ margin: 0 }}>
            RAG doesn&apos;t make the model smarter. It makes it{" "}
            <em>better-informed</em>. Without sources, asking about your
            codebase gets you something plausible — and wrong. With sources,
            the model has something real to be wrong <em>about</em>, and you
            can audit the failure.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Five years after the original paper, this is the default
            architecture behind every &quot;talk to your docs&quot; product
            you&apos;ve used.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-when",
      prompt: "Which problem is RAG the right tool for?",
      choices: [
        {
          text: "The model writes in a style you don't like",
          feedback:
            "Style is a prompting (or fine-tuning) problem — retrieval won't change the voice.",
        },
        {
          text: "The model needs to answer from your internal wiki, which changes weekly",
          correct: true,
          feedback:
            "Perfect fit: private, frequently-updated knowledge the frozen model can't contain. Retrieve it fresh each time.",
        },
        {
          text: "The model is too slow at generating long answers",
          feedback:
            "RAG adds a retrieval step — if anything it costs a little latency, in exchange for grounding.",
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
            Embed, retrieve, augment. The model stays frozen; the knowledge
            stays fresh; failures become auditable.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Give the loop the ability to <em>act</em> on what it reads, and you
            get <strong>agents</strong> — the next lesson.
          </p>
        </>
      ),
    },
  ],
};

export default lesson;
