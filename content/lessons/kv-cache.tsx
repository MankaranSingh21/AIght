import type { Lesson } from "@/lib/lessons";
import KvCacheDemo from "@/components/learn/KvCacheDemo";

const lesson: Lesson = {
  slug: "kv-cache",
  title: "The KV Cache",
  tagline: "The bookkeeping trick that makes generation fast.",
  minutes: 6,
  steps: [
    {
      kind: "explain",
      id: "hook",
      eyebrow: "The idea",
      body: (
        <>
          <p style={{ margin: 0 }}>
            A model writes one token at a time. To pick the next word, it uses
            attention to look back over everything so far. Here&apos;s the
            problem: do that from scratch for every new token, and you redo the
            same work on the same old tokens, over and over.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            The <strong>KV cache</strong> is how models stop repeating
            themselves.
          </p>
        </>
      ),
    },
    {
      kind: "explain",
      id: "how",
      eyebrow: "Compute once, reuse forever",
      body: (
        <>
          <p style={{ margin: 0 }}>
            For attention, each token gets turned into a <em>key</em> and a{" "}
            <em>value</em>. Those never change once computed. So the model stores
            them — caches the K and V for every token it&apos;s already seen.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Generating the next token then only means computing K and V for{" "}
            <em>that one new token</em> and reusing the rest from the cache.
            Quadratic busywork collapses into something far cheaper per step.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-what",
      prompt: "What problem does the KV cache solve?",
      choices: [
        {
          text: "It avoids recomputing earlier tokens' attention each step, so generation is much faster",
          correct: true,
          feedback:
            "Right — past keys and values are stored once and reused for every later token.",
        },
        {
          text: "It stores the user's password securely",
          feedback:
            "Nothing to do with credentials — it caches attention state to speed up generation.",
        },
        {
          text: "It permanently saves the whole conversation to disk",
          feedback:
            "It's a short-lived, in-memory speedup for one generation, not persistent storage.",
        },
      ],
    },
    {
      kind: "interact",
      id: "demo",
      body: (
        <p style={{ margin: 0 }}>
          Generate with the cache on and off. Watch the redundant recomputation
          pile up without it — and melt away with it.
        </p>
      ),
      demo: KvCacheDemo,
      tryThis: "Without the cache, every new token re-does all the old work. With it, only the new token costs.",
    },
    {
      kind: "check",
      id: "check-cost",
      prompt: "What's the trade-off the KV cache makes?",
      choices: [
        {
          text: "It spends memory to save computation — the cache grows with how long the context gets",
          correct: true,
          feedback:
            "Exactly — speed in exchange for memory, and long contexts make the cache large.",
        },
        {
          text: "It makes generation slower but more accurate",
          feedback:
            "The opposite — it speeds generation up, and doesn't change the answer at all.",
        },
        {
          text: "It changes what the model would have said",
          feedback:
            "No — it's a pure optimisation. Same output, fewer redundant computations.",
        },
      ],
    },
    {
      kind: "explain",
      id: "why-matters",
      eyebrow: "Why you should care",
      body: (
        <>
          <p style={{ margin: 0 }}>
            That growing cache is a hidden reason long contexts get expensive:
            it&apos;s not just more tokens to read, it&apos;s more K/V to hold in
            precious GPU memory the whole time. Managing it well is a big part of
            serving models cheaply at scale.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            The KV cache is invisible to you as a user — but it shapes the speed
            and cost of everything a model generates.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-context",
      prompt: "Why does a very long context make generation more memory-hungry, KV-cache-wise?",
      choices: [
        {
          text: "The cache holds a key and value for every token in context, so it grows as the context grows",
          correct: true,
          feedback:
            "Right — more context means a bigger cache sitting in GPU memory throughout generation.",
        },
        {
          text: "Long contexts disable the cache entirely",
          feedback:
            "The cache still works — it just gets larger, which is exactly the memory pressure.",
        },
        {
          text: "The cache duplicates the model's weights per token",
          feedback:
            "It stores per-token keys and values, not copies of the weights.",
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
            The KV cache trades memory for speed: store each token&apos;s key and
            value once, reuse them for every token after. It&apos;s why
            generation is fast — and part of why long contexts are heavy.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            A small piece of bookkeeping with an outsized effect on cost and
            latency.
          </p>
        </>
      ),
    },
  ],
};

export default lesson;
