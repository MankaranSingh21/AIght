import type { Lesson } from "@/lib/lessons";

const lesson: Lesson = {
  slug: "loss-functions",
  title: "Loss Functions",
  tagline: "The single number a model spends all of training trying to shrink.",
  minutes: 5,
  steps: [
    {
      kind: "explain",
      id: "hook",
      eyebrow: "The idea",
      body: (
        <>
          <p style={{ margin: 0 }}>
            To improve, a model needs to know how wrong it is — as a number it can
            chase downward. That number is the <strong>loss</strong>. High loss:
            badly wrong. Low loss: close. All of training is one long campaign to
            make it smaller.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            No loss, no learning. It&apos;s the scoreboard the whole game is
            played against.
          </p>
        </>
      ),
    },
    {
      kind: "explain",
      id: "how",
      eyebrow: "Distance from the right answer",
      body: (
        <>
          <p style={{ margin: 0 }}>
            A loss function compares the model&apos;s prediction to the true label
            and returns a measure of the gap. Predict 9 when the answer is 10 —
            small loss. Predict 2 — large loss. Average that over many examples
            and you get one number summarising how the model is doing.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            That number is exactly what gradient descent follows downhill.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-what",
      prompt: "What does a loss function measure during training?",
      choices: [
        {
          text: "How far the model's predictions are from the correct answers",
          correct: true,
          feedback:
            "Right — training works to make that distance smaller.",
        },
        {
          text: "How fast the model runs",
          feedback:
            "That's speed, not loss. Loss is about prediction error.",
        },
        {
          text: "How much memory the model uses",
          feedback:
            "That's resource usage — loss measures how wrong the predictions are.",
        },
      ],
    },
    {
      kind: "explain",
      id: "choice",
      eyebrow: "The loss defines the goal",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Different tasks need different losses. Predicting a number? A loss that
            penalises being far off (like squared error). Predicting a category?
            A loss that rewards confident-correct and punishes confident-wrong
            (like cross-entropy).
          </p>
          <p style={{ margin: "1em 0 0" }}>
            This is subtle and important: the loss <em>is</em> the model&apos;s
            definition of &quot;good.&quot; Choose a loss that doesn&apos;t match
            what you actually want, and the model will optimise the wrong thing —
            perfectly.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-choice",
      prompt: "Why does the choice of loss function matter so much?",
      choices: [
        {
          text: "The loss defines what 'good' means — the model optimises exactly it, for better or worse",
          correct: true,
          feedback:
            "Right — pick a loss that misaligns with your real goal and you get a model that's great at the wrong thing.",
        },
        {
          text: "It only affects training speed, not behaviour",
          feedback:
            "It shapes what the model becomes — it's the target the whole process aims at.",
        },
        {
          text: "Any loss function gives identical results",
          feedback:
            "Far from it — the loss encodes the objective, and different objectives produce different models.",
        },
      ],
    },
    {
      kind: "explain",
      id: "proxy",
      eyebrow: "A loss is a proxy",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Here&apos;s the catch: a loss is usually a <em>stand-in</em> for what
            you really care about, because the real goal (&quot;be genuinely
            helpful,&quot; &quot;be fair&quot;) is hard to write as math. The model
            relentlessly minimises the proxy — and any gap between the proxy and
            the true goal becomes a gap in the model.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Low loss is necessary, not sufficient. A model can ace its loss and
            still miss the point.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-proxy",
      prompt: "A model reaches very low loss but behaves badly in practice. How is that possible?",
      choices: [
        {
          text: "The loss was an imperfect proxy for the real goal — it optimised the measure, not the intent",
          correct: true,
          feedback:
            "Right — minimising a flawed proxy can drift away from what you actually wanted.",
        },
        {
          text: "Low loss guarantees good behaviour, so it isn't possible",
          feedback:
            "It is possible — low loss only means it matched the proxy, which may not capture the true goal.",
        },
        {
          text: "The loss must have been computed wrong",
          feedback:
            "Not necessarily — even a correctly computed loss can be the wrong target.",
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
            The loss function turns &quot;how wrong is it?&quot; into a number the
            model can minimise — the heart of how it learns. But the loss defines
            the goal, and it&apos;s only ever a proxy for what you truly want, so
            choosing it well is half the battle.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            How the model uses that number to actually adjust itself is{" "}
            <strong>gradient descent</strong> and <strong>backpropagation</strong>.
          </p>
        </>
      ),
    },
  ],
};

export default lesson;
