import type { Lesson } from "@/lib/lessons";
import RetrievalRerankDemo from "@/components/learn/RetrievalRerankDemo";

const lesson: Lesson = {
  slug: "retrieval-rerank",
  title: "Retrieval & Reranking",
  tagline: "Cast a wide net fast, then sort it by what actually matters.",
  minutes: 6,
  steps: [
    {
      kind: "explain",
      id: "hook",
      eyebrow: "The idea",
      body: (
        <>
          <p style={{ margin: 0 }}>
            In a RAG system, the model is only as good as the documents you feed
            it. Hand it the wrong chunks and even a brilliant model writes a
            confident, well-grounded — wrong — answer. So the quality of{" "}
            <em>retrieval</em> quietly decides everything.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            The trouble: fast search is imprecise, and precise search is slow.
            <strong> Reranking</strong> is how you get both.
          </p>
        </>
      ),
    },
    {
      kind: "explain",
      id: "two-stage",
      eyebrow: "Two passes, not one",
      body: (
        <>
          <p style={{ margin: 0 }}>
            First pass: a cheap, fast search (usually vector similarity) grabs a
            wide set of maybe-relevant chunks — high recall, rough order. It
            errs on the side of &quot;include it, just in case.&quot;
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Second pass: a <em>reranker</em> — a slower, smarter model — reads
            each candidate against the actual query and reorders them, so the
            genuinely best few float to the top. You only run the expensive step
            on a short list.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-what",
      prompt: "What does a reranker do?",
      choices: [
        {
          text: "Reorders the first-pass results so the most relevant rise to the top",
          correct: true,
          feedback:
            "Right — cheap search casts the net; the reranker sharpens the order before anything reaches the model.",
        },
        {
          text: "Deletes the user's query and writes a new one",
          feedback:
            "It refines the *results* for the query — it doesn't rewrite the question.",
        },
        {
          text: "Generates the final answer itself",
          feedback:
            "That's the generator's job. The reranker only orders the retrieved candidates.",
        },
      ],
    },
    {
      kind: "interact",
      id: "demo",
      body: (
        <p style={{ margin: 0 }}>
          Watch a fast search return a rough pile of chunks, then a reranker pull
          the truly relevant ones to the front.
        </p>
      ),
      demo: RetrievalRerankDemo,
      tryThis: "Notice the best chunk often isn't first after the cheap search — the reranker fixes that.",
    },
    {
      kind: "check",
      id: "check-why",
      prompt: "Why split retrieval into a cheap search plus a reranker, instead of one precise search?",
      choices: [
        {
          text: "Running the expensive, precise scorer on every document would be far too slow — so you only rerank a small shortlist",
          correct: true,
          feedback:
            "Exactly — fast-and-wide first, slow-and-precise on the few. Best of both.",
        },
        {
          text: "Because vector search can't find anything relevant at all",
          feedback:
            "It finds plenty — it's just rough on ordering. The reranker refines, it doesn't rescue from nothing.",
        },
        {
          text: "To avoid using a model anywhere in the pipeline",
          feedback:
            "The reranker is itself a model — the point is using the expensive one sparingly.",
        },
      ],
    },
    {
      kind: "explain",
      id: "why-matters",
      eyebrow: "Where answers are won or lost",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Most &quot;the RAG bot gave a bad answer&quot; problems aren&apos;t
            the model — they&apos;re retrieval handing over the wrong context. A
            good reranker is one of the highest-leverage upgrades you can make to
            a retrieval system.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Garbage in, garbage out applies at query time too: the model can only
            reason over what retrieval chose to show it.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-impact",
      prompt: "A RAG assistant keeps giving grounded but wrong answers. Where should you look first?",
      choices: [
        {
          text: "Retrieval — whether the right chunks are even making it into the model's context",
          correct: true,
          feedback:
            "Right — if the wrong documents are retrieved, no model can save the answer. Reranking is a prime fix.",
        },
        {
          text: "Only the model — swap in a bigger one",
          feedback:
            "A bigger model still can't reason over context it never received. Fix retrieval first.",
        },
        {
          text: "The user's wording, which is the only possible cause",
          feedback:
            "Phrasing matters, but grounded-yet-wrong usually means the wrong context was retrieved.",
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
            Retrieval is two jobs: a fast, wide search for recall, then a precise
            reranker for order. Get the right chunks to the top and the model&apos;s
            answer improves without touching the model at all.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            In RAG, who you ask matters — but what you hand them matters more.
          </p>
        </>
      ),
    },
  ],
};

export default lesson;
