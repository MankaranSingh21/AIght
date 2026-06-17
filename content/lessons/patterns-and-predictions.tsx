import type { Lesson } from "@/lib/lessons";

const lesson: Lesson = {
  slug: "patterns-and-predictions",
  title: "Patterns & Predictions",
  tagline: "Almost everything AI does is one trick: guess what comes next.",
  minutes: 5,
  steps: [
    {
      kind: "explain",
      id: "hook",
      eyebrow: "The idea",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Behind the dazzling range of things AI can do sits a single, humble
            move: <em>predict the next thing from the pattern so far</em>. The
            next word in a sentence. The most likely label for a photo. The
            probable price tomorrow.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Learn to see that one move and most of AI stops being mysterious.
          </p>
        </>
      ),
    },
    {
      kind: "explain",
      id: "completion",
      eyebrow: "Generation is just prediction, repeated",
      body: (
        <>
          <p style={{ margin: 0 }}>
            A language model writing an essay isn&apos;t composing — it&apos;s
            predicting one likely next token, adding it, and predicting again. Do
            that hundreds of times and a paragraph appears, each word chosen as the
            natural continuation of the ones before.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Astonishing results, mundane mechanism: pattern in, next-step out, on
            repeat.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-core",
      prompt: "At its core, generating text from a language model is closest to which task?",
      choices: [
        {
          text: "Predicting the next most-likely piece of text, step by step",
          correct: true,
          feedback:
            "Right — it's sequential next-token prediction, one piece at a time.",
        },
        {
          text: "Looking the answer up in a stored database of facts",
          feedback:
            "There's no lookup table — it predicts rather than retrieves (unless you bolt retrieval on).",
        },
        {
          text: "Running a formal logical proof",
          feedback:
            "It approximates reasoning through patterns; it isn't executing formal logic.",
        },
      ],
    },
    {
      kind: "explain",
      id: "not-lookup",
      eyebrow: "Predicting, not retrieving",
      body: (
        <>
          <p style={{ margin: 0 }}>
            This is why a model can answer a question that appears nowhere in its
            training data, and also why it can invent a confident falsehood. It
            isn&apos;t fetching stored facts — it&apos;s generating the most
            plausible continuation, which is usually right and sometimes
            convincingly wrong.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Plausible and true overlap a lot. They are not the same circle.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-implication",
      prompt: "If a model predicts plausible continuations rather than looking up facts, what follows?",
      choices: [
        {
          text: "It can handle novel inputs — but can also produce confident, plausible-sounding falsehoods",
          correct: true,
          feedback:
            "Right — the same mechanism gives flexibility and hallucination. Plausible isn't always true.",
        },
        {
          text: "It can only ever repeat sentences from its training data",
          feedback:
            "Prediction lets it generate new combinations — it's not limited to verbatim recall.",
        },
        {
          text: "It is guaranteed correct because it learned from real text",
          feedback:
            "Learning from real text doesn't guarantee truth — the most likely continuation can still be wrong.",
        },
      ],
    },
    {
      kind: "explain",
      id: "everywhere",
      eyebrow: "The same lens, everywhere",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Classification predicts a category. Recommendation predicts what
            you&apos;ll click. Forecasting predicts a number. Image generation
            predicts pixels. Different costumes, same engine — find the pattern,
            project it forward.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Once you spot &quot;what is this thing predicting, from what
            pattern?&quot;, you can read almost any AI system.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-everywhere",
      prompt: "A recommendation system suggests your next video. In prediction terms, what is it doing?",
      choices: [
        {
          text: "Predicting what you're most likely to engage with, from patterns in past behaviour",
          correct: true,
          feedback:
            "Right — same core move as text generation: learn a pattern, project the most likely next thing.",
        },
        {
          text: "Looking up an official 'correct' next video",
          feedback:
            "There's no correct answer to retrieve — it's predicting a likelihood from your history.",
        },
        {
          text: "Reasoning philosophically about what you should watch",
          feedback:
            "It predicts engagement from patterns; it isn't deliberating about what's good for you.",
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
            Strip away the surface and most AI is pattern-completion: learn the
            regularities, predict the next step. It explains both the power
            (flexible, general) and the failure modes (plausible-but-wrong) in one
            stroke.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            The thing doing the predicting — the bundle of learned patterns
            itself — is what we call a <strong>model</strong>.
          </p>
        </>
      ),
    },
  ],
};

export default lesson;
