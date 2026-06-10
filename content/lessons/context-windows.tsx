import type { Lesson } from "@/lib/lessons";
import ContextWindowsDemo from "@/components/learn/ContextWindowsDemo";

const lesson: Lesson = {
  slug: "context-windows",
  title: "Context Windows",
  tagline: "The model reads everything from scratch, every time — up to a limit.",
  minutes: 6,
  steps: [
    {
      kind: "explain",
      id: "hook",
      eyebrow: "The idea",
      body: (
        <>
          <p style={{ margin: 0 }}>
            From the model&apos;s perspective, your whole conversation is one
            document it reads from scratch on every message. No memory between
            sessions, no running thread — just one long text it continues.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            The <strong>context window</strong> is the maximum length of that
            text, measured in tokens. GPT-2 handled 1,024 tokens — about 750
            words. Today&apos;s frontier models stretch to a million.
          </p>
        </>
      ),
    },
    {
      kind: "interact",
      id: "demo",
      body: (
        <p style={{ margin: 0 }}>
          Get a feel for the sizes — and the edges.
        </p>
      ),
      demo: ContextWindowsDemo,
      tryThis: "Compare what fits in 1k tokens versus 128k.",
    },
    {
      kind: "check",
      id: "check-memory",
      prompt:
        "A model “forgets” something you told it an hour into a long chat. What most likely happened?",
      choices: [
        {
          text: "The model got bored and stopped caring",
          feedback:
            "Nothing like boredom exists in there — it's all mechanics, and the mechanics have a specific failure mode here.",
        },
        {
          text: "Your earlier message was truncated or summarized away to fit the window",
          correct: true,
          feedback:
            "Right. Long-running chats use sliding windows and summaries — old turns get compressed or dropped to stay under the limit.",
        },
        {
          text: "Models delete sensitive information automatically",
          feedback:
            "No such mechanism — it's a length budget problem, not a privacy feature.",
        },
      ],
    },
    {
      kind: "explain",
      id: "why-limit",
      eyebrow: "Why there's a limit",
      body: (
        <>
          <p style={{ margin: 0 }}>
            The constraint comes from attention: the model computes a
            relationship score between every pair of tokens. For a sequence of
            length n, that&apos;s n² calculations. Double the context, quadruple
            the compute.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Tricks like sparse attention and KV-cache compression keep pushing
            the ceiling up — but for any given model, the ceiling is real.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-middle",
      prompt:
        "You bury the critical fact on page 50 of a 100-page document you paste in. What does research say happens?",
      choices: [
        {
          text: "Position doesn't matter — every token is weighted equally",
          feedback:
            "It genuinely isn't. Where you put information changes how much the model uses it.",
        },
        {
          text: "Models retrieve beginning and end well, and are notably worse in the middle",
          correct: true,
          feedback:
            "The “lost in the middle” effect (Liu et al., 2023). Improving with newer models, but it hasn't disappeared.",
        },
        {
          text: "The middle is actually where models focus most",
          feedback:
            "The opposite — the middle is the dead zone.",
        },
      ],
    },
    {
      kind: "explain",
      id: "patterns",
      eyebrow: "What this explains",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Whole design patterns exist because of this limit.{" "}
            <strong>RAG</strong> retrieves only the relevant chunks instead of
            pasting the manual. <strong>Summarization chains</strong> compress
            long documents section by section. <strong>Sliding windows</strong>{" "}
            keep chat history under budget.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            And it&apos;s why good system prompts stay short: every token of
            setup is a token unavailable for content.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-cost",
      prompt:
        "An app pastes the user's entire document library into every request. What's the predictable consequence?",
      choices: [
        {
          text: "Better answers — more context always helps",
          feedback:
            "Irrelevant material dilutes the response, and you pay for every token of it. Focus beats volume.",
        },
        {
          text: "High costs and weaker answers from diluted context",
          correct: true,
          feedback:
            "Both at once. Token-based pricing punishes the bill; equal-attention-to-everything punishes the quality.",
        },
        {
          text: "Nothing — providers ignore repeated content",
          feedback:
            "Prompt caching can discount repeated prefixes, but it doesn't make stuffing free or smart.",
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
            The context window isn&apos;t a bucket you fill. What you put in —
            and where — changes what the model attends to. Curate, don&apos;t
            stuff.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            The lookup-instead-of-stuff pattern has a name:{" "}
            <strong>RAG</strong>. It has its own lesson.
          </p>
        </>
      ),
    },
  ],
};

export default lesson;
