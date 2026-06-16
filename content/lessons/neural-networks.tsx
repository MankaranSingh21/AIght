import type { Lesson } from "@/lib/lessons";
import NeuralNetworkDemo from "@/components/learn/NeuralNetworkDemo";

const lesson: Lesson = {
  slug: "neural-networks",
  title: "Neural Networks",
  tagline: "Millions of dumb little units, arranged just so.",
  minutes: 6,
  steps: [
    {
      kind: "explain",
      id: "hook",
      eyebrow: "The idea",
      body: (
        <>
          <p style={{ margin: 0 }}>
            A neural network sounds brainy. It isn&apos;t. It&apos;s a stack of
            very simple units, each doing the same boring arithmetic, wired
            together so that the whole can learn patterns no single unit could.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            The magic isn&apos;t in any one neuron. It&apos;s in the wiring — and
            in the numbers on the wires.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-neuron",
      prompt: "What does a single artificial neuron actually do?",
      choices: [
        {
          text: "Stores one fact, like a row in a spreadsheet",
          feedback:
            "Neurons don't store facts. They compute — facts live in the pattern of weights across the whole network.",
        },
        {
          text: "Takes its inputs, multiplies each by a weight, adds them up, and passes the total through a simple function",
          correct: true,
          feedback:
            "That's the whole job. A weighted sum, then a squish. Repeat a million times.",
        },
        {
          text: "Decides the network's final answer on its own",
          feedback:
            "No single neuron decides anything. The answer emerges from all of them together.",
        },
      ],
    },
    {
      kind: "explain",
      id: "weights",
      eyebrow: "Weights are the knobs",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Each connection has a <strong>weight</strong> — how much that input
            matters. Each neuron also has a <strong>bias</strong> — a thumb on
            the scale. The weighted sum then passes through an{" "}
            <strong>activation function</strong> that bends the line.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Everything a network &quot;knows&quot; is encoded in those weights.
            Learning is nothing more than nudging them until the outputs stop
            being wrong.
          </p>
        </>
      ),
    },
    {
      kind: "interact",
      id: "demo",
      body: (
        <p style={{ margin: 0 }}>
          Here&apos;s a tiny network — two inputs, a hidden layer, one output.
          Push the inputs through and watch the values flow.
        </p>
      ),
      demo: NeuralNetworkDemo,
      tryThis: "Change an input and follow how it ripples to the output.",
    },
    {
      kind: "check",
      id: "check-activation",
      prompt:
        "Why bother with the activation function? Why not just sum the weighted inputs?",
      choices: [
        {
          text: "Without it, stacking layers gains you nothing — the whole network collapses into one straight line",
          correct: true,
          feedback:
            "Exactly. A sum of sums is still just a sum. The non-linear squish is what lets depth buy you anything.",
        },
        {
          text: "It makes the network run faster",
          feedback:
            "It doesn't speed things up — it changes what the network can represent at all.",
        },
        {
          text: "It keeps the numbers from becoming negative",
          feedback:
            "Some activations do clamp negatives, but that's a side effect. The real point is non-linearity.",
        },
      ],
    },
    {
      kind: "explain",
      id: "depth",
      eyebrow: "Depth builds features",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Early layers catch crude things — an edge, a syllable. Later layers
            combine those into richer ones — a face, a word, a meaning. Each
            layer works on the layer below&apos;s output, so abstraction stacks.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Nobody hand-codes &quot;detect an eye.&quot; The network discovers
            which features are worth building, on its own, from the data.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-training",
      prompt: "When a network &quot;learns,&quot; what is actually changing?",
      choices: [
        {
          text: "The network grows new neurons for each new example",
          feedback:
            "The architecture stays fixed. It's the numbers on the existing wires that move.",
        },
        {
          text: "The weights and biases are adjusted, a little at a time, to reduce the error",
          correct: true,
          feedback:
            "Right. Same wiring, different numbers — tuned until predictions improve.",
        },
        {
          text: "It memorises every training example word for word",
          feedback:
            "If it did that it would fail on anything new. Good training generalises the pattern, not the examples.",
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
            A neural network is simple parts, wired deep, with learnable numbers
            on every wire. The intelligence is in those numbers — and in the
            process that finds them.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            That process — how the weights actually get nudged — is{" "}
            <strong>gradient descent</strong>. That&apos;s the next lesson.
          </p>
        </>
      ),
    },
  ],
};

export default lesson;
