import type { Lesson } from "@/lib/lessons";

const lesson: Lesson = {
  slug: "what-is-ai",
  title: "What Is AI, Actually?",
  tagline: "Separating the technology from the marketing.",
  minutes: 5,
  steps: [
    {
      kind: "explain",
      id: "hook",
      eyebrow: "The idea",
      body: (
        <>
          <p style={{ margin: 0 }}>
            &quot;AI&quot; gets stretched to mean everything from a chatbot to a
            sci-fi robot uprising. Strip away the marketing and today&apos;s AI is
            something much more specific — and much less mystical.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            It&apos;s software that learns patterns from examples, instead of
            being told every rule by hand.
          </p>
        </>
      ),
    },
    {
      kind: "explain",
      id: "shift",
      eyebrow: "Rules vs learning",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Old-school software is a recipe: if this, do that — every step written
            by a programmer. That works until the problem is too fuzzy to spell
            out. How do you write the exact rules for &quot;is this photo a
            cat?&quot; You can&apos;t, really.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            So instead, you show a model thousands of labelled examples and let it
            <em> learn</em> the pattern. Nobody hand-codes &quot;cat.&quot; The
            model infers it from the data.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-how",
      prompt: "What best describes how most of today's AI works?",
      choices: [
        {
          text: "It follows a fixed set of hand-written rules for every case",
          feedback:
            "That's classic rule-based software. Modern AI learns patterns from data instead of being told each rule.",
        },
        {
          text: "It learns statistical patterns from large amounts of example data",
          correct: true,
          feedback:
            "Right — today's AI is pattern-matching learned from data, not hand-coded logic.",
        },
        {
          text: "It is conscious and understands meaning the way people do",
          feedback:
            "No — it models patterns in data. There's no awareness or understanding behind the output.",
        },
      ],
    },
    {
      kind: "explain",
      id: "narrow",
      eyebrow: "Narrow, not general",
      body: (
        <>
          <p style={{ margin: 0 }}>
            The AI we actually use is <em>narrow</em>: brilliant within the kind
            of patterns it was trained on, clueless outside them. A model that
            writes poetry can&apos;t drive your car; one that spots tumors
            can&apos;t hold a conversation.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            The fluent, general-feeling chatbots blur this line — but they&apos;re
            still predicting patterns, not understanding the world.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-fluency",
      prompt: "A model writes a flawless, fluent essay. Does that mean it understands the topic?",
      choices: [
        {
          text: "Yes — fluency requires real understanding",
          feedback:
            "Not necessarily. Fluency comes from predicting likely text; a model can be fluent and confidently wrong.",
        },
        {
          text: "No — fluency is skilled pattern prediction, which isn't the same as understanding",
          correct: true,
          feedback:
            "Exactly — sounding right and being right are different things.",
        },
      ],
    },
    {
      kind: "explain",
      id: "why-matters",
      eyebrow: "Why the definition matters",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Getting this right changes how you use the tools. If AI is a
            pattern-learner, then its output is only as good as its data, it can
            be confidently wrong, and it shines on pattern-rich tasks while
            stumbling on ones needing true reasoning or current facts.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Demystified, AI stops being magic — and becomes a tool you can
            actually judge.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-implication",
      prompt: "If AI mainly learns patterns from data, what follows?",
      choices: [
        {
          text: "Its output is only as good as its data, and it can be fluently, confidently wrong",
          correct: true,
          feedback:
            "Right — data quality and the gap between 'plausible' and 'true' are the things to watch.",
        },
        {
          text: "It must be correct, since it learned from real data",
          feedback:
            "Learning from data doesn't guarantee truth — biased or thin data, and plausible-but-false output, are real risks.",
        },
        {
          text: "It can never be useful for anything practical",
          feedback:
            "It's enormously useful — the point is to use it knowing what it is, not to dismiss it.",
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
            Today&apos;s AI is software that learns patterns from data — narrow,
            powerful, and not conscious. Hold onto that and the hype gets easy to
            filter: it&apos;s a tool with real strengths and predictable failure
            modes, not a mind.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            And since it all rests on data, that&apos;s the natural next thing to
            understand.
          </p>
        </>
      ),
    },
  ],
};

export default lesson;
