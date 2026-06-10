import type { Lesson } from "@/lib/lessons";
import EmbeddingsViz from "@/components/learn/EmbeddingsViz";

const lesson: Lesson = {
  slug: "embeddings",
  title: "Embeddings",
  tagline: "The coordinates that give language a sense of direction.",
  minutes: 6,
  steps: [
    {
      kind: "explain",
      id: "hook",
      eyebrow: "The idea",
      body: (
        <>
          <p style={{ margin: 0 }}>
            What if every word had an address? Not a dictionary entry — a
            location in a <em>map of meaning</em>, where “joyful” and “elated”
            live a few blocks apart and “photosynthesis” sits far across town
            from “heartbreak”.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            That&apos;s an <strong>embedding</strong>: a list of hundreds or
            thousands of numbers representing the meaning of a piece of text.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-distances",
      prompt: "In an embedding, what actually carries the meaning?",
      choices: [
        {
          text: "The individual numbers — each one encodes a specific concept",
          feedback:
            "The numbers themselves are arbitrary. No single dimension means “royalty” or “cold”.",
        },
        {
          text: "The distances between vectors — what's near what",
          correct: true,
          feedback:
            "Yes. Proximity means similarity. The values are arbitrary; the geometry is the meaning.",
        },
        {
          text: "The length of the list — longer vectors mean richer words",
          feedback:
            "Every text gets the same number of dimensions from a given model, rich or plain.",
        },
      ],
    },
    {
      kind: "explain",
      id: "geometry",
      eyebrow: "The geometry of meaning",
      body: (
        <>
          <p style={{ margin: 0 }}>
            The space has structure you can do arithmetic on. Take the vector
            for “king”, subtract “man”, add “woman” — the result lands very
            close to “queen”.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Nobody hand-coded that. The model learned it from patterns in
            text, and it holds for capitals and countries, verb tenses,
            comparatives. The structure of meaning shows up as structure in
            space.
          </p>
        </>
      ),
    },
    {
      kind: "interact",
      id: "demo",
      body: (
        <p style={{ margin: 0 }}>
          Here&apos;s a 2D projection of an embedding space. Related ideas
          cluster; unrelated ones drift apart.
        </p>
      ),
      demo: EmbeddingsViz,
      tryThis: "Find a cluster — then ask yourself what its members share.",
    },
    {
      kind: "check",
      id: "check-search",
      prompt:
        "A search engine matches “cheap flights to Rome” with “affordable airfare to Italy” despite sharing zero words. How?",
      choices: [
        {
          text: "It keeps a giant table of synonyms",
          feedback:
            "Synonym tables can't cover phrasing this loose — nobody lists “cheap flights” next to “affordable airfare” by hand.",
        },
        {
          text: "Both phrases embed to nearby points, so their distance is small",
          correct: true,
          feedback:
            "Right — that's semantic search. Compare positions in meaning-space instead of matching words.",
        },
        {
          text: "It secretly translates both into Latin first",
          feedback:
            "Tempting for Rome specifically, but no — it's geometry, not translation.",
        },
      ],
    },
    {
      kind: "explain",
      id: "powers",
      eyebrow: "What this powers",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Embeddings are the quiet workhorse behind semantic search,
            recommendations, clustering, deduplication — and retrieval-augmented
            generation, where a model fetches the documents whose embeddings
            sit closest to your question.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            One caution: vectors from different providers live in different
            spaces. An OpenAI embedding and a Cohere embedding of the same
            sentence are not comparable — mixing them gives you noise, not
            meaning.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-providers",
      prompt:
        "You embedded half your documents with provider A and half with provider B. Can you search across both with one query vector?",
      choices: [
        {
          text: "Yes — embeddings are a standard format",
          feedback:
            "Each model learns its own space from scratch. The coordinates only mean something within that space.",
        },
        {
          text: "Yes, if both vectors have the same number of dimensions",
          feedback:
            "Same dimension count doesn't mean same space — direction 412 in one model has nothing to do with direction 412 in another.",
        },
        {
          text: "No — distances are only meaningful within one model's space",
          correct: true,
          feedback:
            "Correct. Re-embed everything with one model, or keep the collections separate.",
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
            Embeddings turn meaning into geometry: similar things near, different
            things far. The numbers are arbitrary; the distances are everything.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Next stop: <strong>RAG</strong> — what happens when a model uses
            this map to look things up before it answers.
          </p>
        </>
      ),
    },
  ],
};

export default lesson;
