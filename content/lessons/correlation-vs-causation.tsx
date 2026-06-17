import type { Lesson } from "@/lib/lessons";

const lesson: Lesson = {
  slug: "correlation-vs-causation",
  title: "Correlation vs Causation",
  tagline: "The mistake every model — and every human — is tempted to make.",
  minutes: 5,
  steps: [
    {
      kind: "explain",
      id: "hook",
      eyebrow: "The idea",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Ice-cream sales and drownings rise together every summer. Ban ice
            cream to save lives? Obviously not — hot weather drives both. They
            move together; neither causes the other.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            <strong>Correlation</strong> is things moving together.{" "}
            <strong>Causation</strong> is one thing actually making another
            happen. Models are brilliant at the first and blind to the second.
          </p>
        </>
      ),
    },
    {
      kind: "explain",
      id: "models-find",
      eyebrow: "Models only see co-occurrence",
      body: (
        <>
          <p style={{ margin: 0 }}>
            A model learns by spotting what goes with what. It will happily learn
            &quot;umbrellas predict rain&quot; — and for forecasting, that&apos;s
            fine. The trouble starts when someone reads a correlation as a cause
            and acts on it: confiscate the umbrellas and the rain keeps coming.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            The model never claimed a cause. We did, on its behalf.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-safe",
      prompt: "A model notices ice-cream sales and drownings rise together. What's the safe conclusion?",
      choices: [
        {
          text: "They're correlated, but one may not cause the other",
          correct: true,
          feedback:
            "Right — a shared cause (hot weather) drives both. Correlation alone can't establish cause.",
        },
        {
          text: "Ice cream causes drowning",
          feedback:
            "The classic trap — reading co-occurrence as cause. A lurking third factor explains it.",
        },
        {
          text: "Drowning causes ice-cream sales",
          feedback:
            "Reversing the arrow doesn't fix it — correlation alone can't even tell you the direction.",
        },
      ],
    },
    {
      kind: "explain",
      id: "traps",
      eyebrow: "Three ways it fools you",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Correlation misleads in three flavours. A <em>hidden common cause</em>
            {" "}(hot weather). <em>Reversed direction</em> (does stress cause poor
            sleep, or poor sleep cause stress?). And plain <em>coincidence</em> —
            with enough variables, some will line up by pure chance.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            A model can&apos;t tell these apart from a real cause. They all look
            like the same useful pattern from the inside.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-why",
      prompt: "Why can't a model, on its own, tell correlation from causation?",
      choices: [
        {
          text: "It only sees which things co-occur in the data — cause needs evidence beyond co-occurrence",
          correct: true,
          feedback:
            "Right — establishing cause usually needs experiments or careful design, not just patterns in observed data.",
        },
        {
          text: "It could, if it had a bigger context window",
          feedback:
            "More context doesn't conjure causal evidence — the limit is in observational data itself.",
        },
        {
          text: "It can — models always know the true cause",
          feedback:
            "They don't — a model learns associations, and associations can mislead about cause.",
        },
      ],
    },
    {
      kind: "explain",
      id: "why-matters",
      eyebrow: "Why it matters for AI",
      body: (
        <>
          <p style={{ margin: 0 }}>
            This is how models pick up spurious shortcuts: a tumor detector that
            keys off a ruler that happened to appear in cancer scans, a hiring
            model that latches onto a proxy for something it shouldn&apos;t. The
            correlation works in the training data and quietly fails in the world.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            When a model offers an &quot;insight,&quot; ask: is this a cause, or
            just a coincidence it found?
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-shortcut",
      prompt: "A scan classifier secretly learned to detect a ruler that often appears in cancer images. What went wrong?",
      choices: [
        {
          text: "It latched onto a spurious correlation that won't hold when the ruler isn't there",
          correct: true,
          feedback:
            "Right — it learned a co-occurrence, not the actual cause, and that shortcut breaks in the real world.",
        },
        {
          text: "It simply needed more training time",
          feedback:
            "Training longer can entrench the shortcut — the issue is what it correlated with, not how long it trained.",
        },
        {
          text: "Rulers genuinely cause cancer",
          feedback:
            "Of course not — that's exactly the correlation-as-causation error the model fell into.",
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
            Models trade in correlation, and correlation is not causation —
            hidden causes, reversed arrows, and coincidence all wear the same
            disguise. Great for prediction, treacherous as an explanation.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Many of the worst correlations a model learns are baked in by{" "}
            <strong>bias in the data</strong> — next.
          </p>
        </>
      ),
    },
  ],
};

export default lesson;
