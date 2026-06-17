import type { Lesson } from "@/lib/lessons";
import AttentionQkvDemo from "@/components/learn/AttentionQkvDemo";

const lesson: Lesson = {
  slug: "transformers",
  title: "Transformers",
  tagline: "The architecture that quietly runs the whole AI boom.",
  minutes: 7,
  steps: [
    {
      kind: "explain",
      id: "hook",
      eyebrow: "The idea",
      body: (
        <>
          <p style={{ margin: 0 }}>
            The &quot;T&quot; in GPT stands for <strong>transformer</strong> — the
            architecture under almost every modern language model. It arrived in
            2017 with a paper boldly titled &quot;Attention Is All You Need,&quot;
            and it&apos;s been all you needed ever since.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            One idea did the heavy lifting: let every word look at every other
            word, all at once.
          </p>
        </>
      ),
    },
    {
      kind: "explain",
      id: "before",
      eyebrow: "What it replaced",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Older models read text the way you might read through a straw — one
            word at a time, left to right, struggling to connect a pronoun to a
            noun twenty words back. Slow to train, and forgetful over distance.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Transformers threw that out. They take in the whole sequence together
            and let <em>attention</em> decide what relates to what — no matter how
            far apart.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-key",
      prompt: "What key idea made transformers so effective for language?",
      choices: [
        {
          text: "An attention mechanism that weighs the relationships between all tokens at once",
          correct: true,
          feedback:
            "Right — attention lets each token look at every other token in context, in parallel.",
        },
        {
          text: "Reading text strictly one word at a time, like older models",
          feedback:
            "That's the older approach transformers replaced — attention sees the whole context together.",
        },
        {
          text: "Storing the entire internet to look answers up",
          feedback:
            "No lookup store — they learn weighted patterns through attention.",
        },
      ],
    },
    {
      kind: "interact",
      id: "demo",
      body: (
        <p style={{ margin: 0 }}>
          Attention works through three roles each token plays — query, key, and
          value. Play with them and watch how a token decides what to pay
          attention to.
        </p>
      ),
      demo: AttentionQkvDemo,
      tryThis: "A token's query is matched against every other token's key — strong matches get the most attention.",
    },
    {
      kind: "check",
      id: "check-attention",
      prompt: "In a transformer, what does attention let a token do?",
      choices: [
        {
          text: "Decide which other tokens matter most for interpreting it, and weight them accordingly",
          correct: true,
          feedback:
            "Right — attention assigns learned weights to other tokens' relevance.",
        },
        {
          text: "Pay exactly equal attention to every token, always",
          feedback:
            "The whole point is unequal, learned weighting — not uniform attention.",
        },
        {
          text: "Ignore all the other tokens",
          feedback:
            "The opposite — attention is about relating tokens to one another.",
        },
      ],
    },
    {
      kind: "explain",
      id: "parallel",
      eyebrow: "Why it took over",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Because a transformer processes the whole sequence at once instead of
            step by step, it trains beautifully on modern parallel hardware. That
            made it possible to scale to enormous sizes on enormous data — and
            scale, it turned out, is what unlocked the abilities we now take for
            granted.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            The architecture didn&apos;t just work better; it worked better{" "}
            <em>at scale</em>, which is what mattered.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-parallel",
      prompt: "Why did transformers scale so much better than the sequential models before them?",
      choices: [
        {
          text: "Processing the whole sequence in parallel suits modern hardware, enabling training on huge data and model sizes",
          correct: true,
          feedback:
            "Right — parallelism unlocked the scale that, in turn, unlocked the capabilities.",
        },
        {
          text: "They use far fewer parameters than older models",
          feedback:
            "They're often much larger — the advantage is parallel training, not smallness.",
        },
        {
          text: "They avoid using GPUs entirely",
          feedback:
            "They lean on GPUs heavily — that parallel compute is exactly what they exploit.",
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
            A transformer reads a whole sequence at once and uses attention to let
            every token weigh every other. That parallel, long-range design is why
            it trains at scale — and why it underpins essentially every frontier
            model today.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Attention is the engine; scale is the fuel. Together they run the
            modern era of AI.
          </p>
        </>
      ),
    },
  ],
};

export default lesson;
