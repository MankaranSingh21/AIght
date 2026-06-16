import type { Lesson } from "@/lib/lessons";
import GradientDescentDemo from "@/components/learn/GradientDescentDemo";

const lesson: Lesson = {
  slug: "gradient-descent",
  title: "Gradient Descent",
  tagline: "How a model finds the right numbers: by rolling downhill.",
  minutes: 6,
  steps: [
    {
      kind: "explain",
      id: "hook",
      eyebrow: "The idea",
      body: (
        <>
          <p style={{ margin: 0 }}>
            A fresh network&apos;s weights are random — it&apos;s wrong about
            everything. So how does it find the millions of right numbers? It
            can&apos;t try them all. Instead, it does something almost stupidly
            simple: it rolls downhill.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Downhill on what? On its own <strong>error</strong>.
          </p>
        </>
      ),
    },
    {
      kind: "explain",
      id: "loss-surface",
      eyebrow: "The loss landscape",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Picture every possible setting of the weights as a point on a vast,
            hilly landscape. The height at each point is the{" "}
            <strong>loss</strong> — how wrong the model is there. High ground is
            bad. Valleys are good.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Training is a search for low ground. The catch: the network is
            standing in fog and can only feel the slope right under its feet.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-gradient",
      prompt: "The gradient at the current point tells the model what?",
      choices: [
        {
          text: "Exactly where the lowest valley in the whole landscape is",
          feedback:
            "If only. The gradient is local — it knows the slope here, not the map of everywhere.",
        },
        {
          text: "Which direction is uphill — so it steps the opposite way",
          correct: true,
          feedback:
            "That's it. The gradient points uphill; descent means stepping against it, toward lower loss.",
        },
        {
          text: "How many training examples are left",
          feedback:
            "The gradient is about the slope of the error, not the size of the dataset.",
        },
      ],
    },
    {
      kind: "interact",
      id: "demo",
      body: (
        <p style={{ margin: 0 }}>
          Step the ball downhill yourself. Each step moves it against the slope
          — and the learning-rate slider controls how big each step is.
        </p>
      ),
      demo: GradientDescentDemo,
      tryThis: "Crank the learning rate up high and watch the ball overshoot.",
    },
    {
      kind: "check",
      id: "check-lr",
      prompt: "You set the learning rate far too high. What happens?",
      choices: [
        {
          text: "The model creeps so slowly it never really moves",
          feedback:
            "That's the too-low failure. Too high goes the other way — wildly.",
        },
        {
          text: "Steps overshoot the valley and bounce around — it may never settle, or even diverge",
          correct: true,
          feedback:
            "Right. Big steps leap past the bottom. Too small wastes time; too big never lands. The art is in between.",
        },
        {
          text: "Nothing — the learning rate doesn't affect the result",
          feedback:
            "It's one of the most consequential knobs in all of training.",
        },
      ],
    },
    {
      kind: "explain",
      id: "iterate",
      eyebrow: "One small step, repeated",
      body: (
        <>
          <p style={{ margin: 0 }}>
            One step barely helps. But take a small step, recompute the slope,
            step again — millions of times, across millions of examples — and
            the model inches its way down into a good valley.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            It won&apos;t find the single deepest valley, and it doesn&apos;t
            need to. A low-enough one that generalises is the whole game.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-what",
      prompt: "Across all those steps, what is gradient descent actually adjusting?",
      choices: [
        {
          text: "The training data, trimming the hardest examples",
          feedback:
            "The data stays put. Descent moves the model, not the dataset.",
        },
        {
          text: "The model's weights, nudging each one in the direction that lowers the loss",
          correct: true,
          feedback:
            "Exactly — it's a weight-tuning loop. The slope tells each weight which way to move.",
        },
        {
          text: "The architecture, adding and removing layers as it goes",
          feedback:
            "The shape is fixed before training. Descent only changes the numbers inside it.",
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
            Gradient descent is the engine of learning: feel the slope of the
            error, step downhill, repeat. No grand plan, just relentless local
            improvement.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            But in a deep network, how do you compute the slope for a weight
            buried five layers down? That&apos;s what{" "}
            <strong>backpropagation</strong> answers.
          </p>
        </>
      ),
    },
  ],
};

export default lesson;
