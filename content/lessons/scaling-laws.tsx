import type { Lesson } from "@/lib/lessons";
import ScalingLawsDemo from "@/components/learn/ScalingLawsDemo";

const lesson: Lesson = {
  slug: "scaling-laws",
  title: "Scaling Laws",
  tagline: "Why “just make it bigger” kept working — predictably.",
  minutes: 6,
  steps: [
    {
      kind: "explain",
      id: "hook",
      eyebrow: "The idea",
      body: (
        <>
          <p style={{ margin: 0 }}>
            For years, the most reliable way to make a model better was almost
            embarrassingly dull: make it bigger, feed it more data, train it
            longer. The surprise wasn&apos;t that this helped — it&apos;s that it
            helped <em>smoothly and predictably</em>.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            <strong>Scaling laws</strong> are the curves that describe exactly
            how.
          </p>
        </>
      ),
    },
    {
      kind: "explain",
      id: "how",
      eyebrow: "A forecast, not a guess",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Plot a model&apos;s error against its size, its data, or its compute,
            and you get a clean, predictable line (a power law). That means you
            can <em>forecast</em> how good a model will be <em>before</em> you
            spend millions training it — and decide whether the gain is worth the
            bill.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            That predictability is what turned &quot;train a giant model&quot;
            from a gamble into an investment.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-what",
      prompt: "What do scaling laws describe?",
      choices: [
        {
          text: "How performance improves predictably as model size, data, and compute grow",
          correct: true,
          feedback:
            "Right — smooth, forecastable gains as you scale the three inputs.",
        },
        {
          text: "How to scale a website's traffic",
          feedback:
            "Different 'scaling' — these laws are about model performance versus resources.",
        },
        {
          text: "Legal limits on how large a model is allowed to be",
          feedback:
            "They're empirical performance trends, not regulations.",
        },
      ],
    },
    {
      kind: "interact",
      id: "demo",
      body: (
        <p style={{ margin: 0 }}>
          Turn up size, data, and compute and watch the error fall along a
          predictable curve — and watch the returns flatten as you go.
        </p>
      ),
      demo: ScalingLawsDemo,
      tryThis: "Notice it keeps improving — but each doubling buys less than the last.",
    },
    {
      kind: "check",
      id: "check-data",
      prompt: "A team makes their model 10× bigger but keeps the same small dataset. What's the catch?",
      choices: [
        {
          text: "Size and data need to grow together — a giant model starved of data is wasted capacity",
          correct: true,
          feedback:
            "Right — this is the Chinchilla lesson: balance parameters and tokens, don't just inflate one.",
        },
        {
          text: "Nothing — more parameters always wins regardless of data",
          feedback:
            "Not so — an under-fed giant underperforms a smaller model trained on enough data.",
        },
        {
          text: "The model will refuse to train",
          feedback:
            "It'll train fine — it just won't be worth its size without the data to match.",
        },
      ],
    },
    {
      kind: "explain",
      id: "limits",
      eyebrow: "Where the curve bends",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Scaling laws are smooth, but they&apos;re not infinite free lunch.
            Returns diminish, high-quality data runs short, and costs balloon —
            so &quot;just scale&quot; eventually hits walls of money and data, not
            just physics.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            They also don&apos;t predict <em>which</em> new abilities appear, only
            that the average error keeps dropping. Some capabilities seem to
            switch on suddenly as scale grows.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-limit",
      prompt: "What do scaling laws NOT promise?",
      choices: [
        {
          text: "Cost-free, unlimited improvement — returns diminish and data and money run out",
          correct: true,
          feedback:
            "Right — the curve is predictable but bends; scaling has real economic and data limits.",
        },
        {
          text: "That bigger models tend to have lower average error",
          feedback:
            "That part they do describe — it's the 'forever and for free' part they don't promise.",
        },
        {
          text: "That training uses compute",
          feedback:
            "Compute is one of the inputs they're built on — that's not the thing in question.",
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
            Scaling laws turned model-building into something you can forecast:
            more size, data, and compute buy predictably lower error — with
            data and parameters best scaled together. They justified the era of
            giant models, and they hint at where it runs out of road.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            All that scale runs on one thing in the end:{" "}
            <strong>compute</strong>.
          </p>
        </>
      ),
    },
  ],
};

export default lesson;
