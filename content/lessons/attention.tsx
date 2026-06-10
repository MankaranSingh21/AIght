import type { Lesson } from "@/lib/lessons";
import AttentionQkvDemo from "@/components/learn/AttentionQkvDemo";

const lesson: Lesson = {
  slug: "attention",
  title: "Attention",
  tagline: "The matrix multiplication that replaced an entire architecture.",
  minutes: 7,
  steps: [
    {
      kind: "explain",
      id: "hook",
      eyebrow: "The idea",
      body: (
        <>
          <p style={{ margin: 0 }}>
            In 2017, a paper called <em>Attention Is All You Need</em> threw
            out recurrence — then the dominant way to process sequences — and
            replaced it with one mechanism: every token looks at every other
            token, in parallel.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Every model you&apos;ve heard of — GPT, Claude, Gemini, Llama — is
            built around that mechanism.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-human",
      prompt: "Is the model “paying attention” the way you do?",
      choices: [
        {
          text: "Yes — it decides what's salient and focuses on it",
          feedback:
            "There's no deciding and no awareness. It's a learned function, not a spotlight of consciousness.",
        },
        {
          text: "No — it's a matrix multiplication that weighs how much each token influences each other token",
          correct: true,
          feedback:
            "Exactly. Comparison scores, a softmax, a weighted sum. The name is a metaphor that oversells the mechanism.",
        },
        {
          text: "No — the model reads strictly left to right, one word at a time",
          feedback:
            "That was the old recurrent world. Attention's whole trick is looking at everything at once.",
        },
      ],
    },
    {
      kind: "explain",
      id: "qkv",
      eyebrow: "Query, Key, Value",
      body: (
        <>
          <p style={{ margin: 0 }}>
            For each token the model computes three vectors. The{" "}
            <strong>query</strong> asks “what am I looking for?” The{" "}
            <strong>key</strong> answers “here&apos;s what I offer.” The{" "}
            <strong>value</strong> is the actual content.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Each token&apos;s query is scored against every other token&apos;s
            key; the scores become weights; the weighted average of the values
            becomes that token&apos;s new representation — now informed by
            whatever was relevant.
          </p>
        </>
      ),
    },
    {
      kind: "interact",
      id: "demo",
      body: (
        <p style={{ margin: 0 }}>
          Walk through the Q·K·V computation yourself.
        </p>
      ),
      demo: AttentionQkvDemo,
      tryThis: "Watch which tokens earn the biggest weights — and which get ignored.",
    },
    {
      kind: "check",
      id: "check-parallel",
      prompt: "Why did attention beat recurrence?",
      choices: [
        {
          text: "It needs less memory",
          feedback:
            "It actually tends to need more memory — every pair of tokens gets a score.",
        },
        {
          text: "Every token can be processed in parallel, and GPUs love parallel work",
          correct: true,
          feedback:
            "Right. Recurrence forces you to wait for the previous step; attention doesn't. That unlocked the scale era.",
        },
        {
          text: "It understands grammar better by design",
          feedback:
            "Nothing grammatical is built in — any language understanding is learned, not designed.",
        },
      ],
    },
    {
      kind: "explain",
      id: "cost",
      eyebrow: "The cost",
      body: (
        <>
          <p style={{ margin: 0 }}>
            The math is <strong>O(n²)</strong> in sequence length: every token
            attends to every other token. Double the input, quadruple the
            attention compute.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            This is why long context windows are technically possible but
            operationally expensive — and why so much research goes into
            cheaper approximations: sparse attention, sliding windows, the KV
            cache.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-quad",
      prompt:
        "You double the length of a document you send to a model. Roughly what happens to the attention compute?",
      choices: [
        {
          text: "It doubles",
          feedback:
            "It would, if attention were linear — but every token attends to every other token.",
        },
        {
          text: "It quadruples",
          correct: true,
          feedback:
            "n² in action. This is why long-document work costs more than the per-token price suggests.",
        },
        {
          text: "It stays the same — models read everything at once",
          feedback:
            "Reading in parallel doesn't make it free — the pairwise scores still have to be computed.",
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
            Attention is a learned influence function between tokens — no
            awareness, just weights. Its parallelism made modern models
            possible; its n² cost shapes their limits.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Those limits are exactly where <strong>context windows</strong>{" "}
            come from — the next lesson.
          </p>
        </>
      ),
    },
  ],
};

export default lesson;
