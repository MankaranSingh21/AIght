import type { Lesson } from "@/lib/lessons";
import TokenizationDemo from "@/components/learn/TokenizationDemo";

const lesson: Lesson = {
  slug: "tokenization",
  title: "Tokenization",
  tagline: "The first thing every model does to your words.",
  minutes: 6,
  steps: [
    {
      kind: "explain",
      id: "hook",
      eyebrow: "The idea",
      body: (
        <>
          <p style={{ margin: 0 }}>
            A language model never sees your sentence. Before anything else
            happens, your text is chopped into <strong>tokens</strong> — pieces
            somewhere between letters and words — and each piece is swapped for
            an integer. The model reads a sequence of numbers, nothing more.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            The chopping rule is fixed when the model is trained. GPT and
            Claude use slightly different ones, which is part of why the same
            prompt can give surprisingly different outputs.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-sees",
      prompt: "What does the model actually receive when you send it a sentence?",
      choices: [
        {
          text: "The words, exactly as you typed them",
          feedback:
            "Not quite — words never make it inside. They're converted first.",
        },
        {
          text: "A sequence of integers, each pointing to a token-shaped piece of text",
          correct: true,
          feedback:
            "Exactly. Every prompt becomes numbers before the model sees it — the text itself stays outside.",
        },
        {
          text: "An image of the text, read character by character",
          feedback:
            "Text models don't read pixels or characters — they read token IDs.",
        },
      ],
    },
    {
      kind: "explain",
      id: "bpe",
      eyebrow: "How tokens get picked",
      body: (
        <>
          <p style={{ margin: 0 }}>
            The dominant scheme is <strong>byte-pair encoding</strong> (BPE).
            Start with single characters. Find the pair that appears most often
            in the training text. Merge it into a new token. Repeat tens of
            thousands of times.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            The result is a vocabulary of roughly 50–100k pieces where common
            substrings like <code>the</code>, <code>ing</code> and{" "}
            <code>tion</code> get their own slot — and rare words get split
            into smaller pieces.
          </p>
        </>
      ),
    },
    {
      kind: "interact",
      id: "demo",
      body: (
        <p style={{ margin: 0 }}>
          See it happen. Type a sentence and watch where the tokenizer cuts it.
        </p>
      ),
      demo: TokenizationDemo,
      tryThis: "Try a rare long word like “unprecedented”, then a common one like “lol”.",
    },
    {
      kind: "check",
      id: "check-lol",
      prompt: "Why is “lol” a single token while “unprecedented” splits into several?",
      choices: [
        {
          text: "Shorter words are always one token",
          feedback:
            "Length isn't the rule — plenty of short rare strings split, and some long common ones don't.",
        },
        {
          text: "“lol” appears constantly in training text, so BPE gave it its own slot",
          correct: true,
          feedback:
            "Right. The tokenizer optimizes for frequency in its training corpus, not for being intuitive.",
        },
        {
          text: "The tokenizer understands slang and keeps it whole",
          feedback:
            "There's no understanding involved — only statistics about which character pairs co-occur.",
        },
      ],
    },
    {
      kind: "explain",
      id: "bites",
      eyebrow: "Why this bites",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Because the model sees tokens — not letters — it can fail at
            things that look trivial. Ask it to count the r&apos;s in
            “strawberry” and it&apos;s reasoning about <code>straw</code> +{" "}
            <code>berry</code>, two opaque chunks, not nine letters.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            It also makes cost uneven: the same sentence in Bengali can take
            several times more tokens than in English, because the tokenizer
            saw far less Bengali during training. You pay per token.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-strawberry",
      prompt: "Why do models famously miscount the letters in “strawberry”?",
      choices: [
        {
          text: "The model can't do arithmetic at all",
          feedback:
            "Models handle plenty of arithmetic — the failure here is about what they can see, not how they count.",
        },
        {
          text: "It sees opaque token chunks, not individual letters",
          correct: true,
          feedback:
            "That's the one. You can't reliably count letters you never saw — the word arrives as two sealed pieces.",
        },
        {
          text: "Berries weren't in the training data",
          feedback:
            "Strawberries appear plenty in training data — the problem is the token boundary, not the fruit.",
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
            Tokens are the model&apos;s atoms: a learned compression scheme,
            frozen at training time, that decides what the model can see, what
            it costs you, and where it stumbles.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Next, those token IDs become <strong>embeddings</strong> — the
            coordinates that give language a sense of direction.
          </p>
        </>
      ),
    },
  ],
};

export default lesson;
