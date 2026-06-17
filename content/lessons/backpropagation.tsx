import type { Lesson } from "@/lib/lessons";

const lesson: Lesson = {
  slug: "backpropagation",
  title: "Backpropagation",
  tagline: "How a network figures out which of its millions of knobs to blame.",
  minutes: 6,
  steps: [
    {
      kind: "explain",
      id: "hook",
      eyebrow: "The idea",
      body: (
        <>
          <p style={{ margin: 0 }}>
            A network makes a prediction, it&apos;s off by some amount, and now the
            hard question: out of millions of weights, which ones caused the error,
            and how much should each move? Guessing one at a time would take
            forever.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            <strong>Backpropagation</strong> is the algorithm that answers this for
            every weight at once.
          </p>
        </>
      ),
    },
    {
      kind: "explain",
      id: "blame",
      eyebrow: "Push the blame backward",
      body: (
        <>
          <p style={{ margin: 0 }}>
            It starts at the output, where the error is known, and works{" "}
            <em>backward</em> through the layers. At each step it asks: how much
            did this weight contribute to the error just behind it? Layer by layer,
            the blame flows back toward the input.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            The result is a precise share of responsibility for every single weight
            — a <em>gradient</em> saying which way, and how hard, to nudge it.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-what",
      prompt: "What does backpropagation do during training?",
      choices: [
        {
          text: "Sends the error backward through the network to find how each weight should change",
          correct: true,
          feedback:
            "Right — it assigns each weight its share of the blame, producing the gradients.",
        },
        {
          text: "Generates new training data",
          feedback:
            "It works with existing data — it computes how to update weights, it doesn't create examples.",
        },
        {
          text: "Picks which examples to train on next",
          feedback:
            "That's data selection — backprop is about propagating the error to every weight.",
        },
      ],
    },
    {
      kind: "explain",
      id: "with-gd",
      eyebrow: "Backprop finds, descent moves",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Backpropagation and gradient descent are a tag team. Backprop computes
            the gradient — the direction of blame for each weight. Gradient descent
            then takes the actual step, nudging each weight a little against its
            gradient to lower the error.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Compute the blame, take a small step, repeat — millions of times. That
            loop <em>is</em> deep learning.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-vs-gd",
      prompt: "How do backpropagation and gradient descent divide the work?",
      choices: [
        {
          text: "Backprop computes the gradient (which way each weight should move); gradient descent takes the step",
          correct: true,
          feedback:
            "Right — one figures out the direction of blame, the other actually updates the weights.",
        },
        {
          text: "They're two names for the same single operation",
          feedback:
            "Related but distinct — backprop produces the gradients that descent then uses.",
        },
        {
          text: "Gradient descent computes the error; backprop stores the data",
          feedback:
            "Not quite — backprop computes the gradient of the error; descent applies it.",
        },
      ],
    },
    {
      kind: "explain",
      id: "why-matters",
      eyebrow: "Why it was the breakthrough",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Backprop is what makes training deep networks <em>feasible</em>. It
            computes the gradient for all weights efficiently in essentially one
            backward sweep — without it, deep learning at today&apos;s scale simply
            wouldn&apos;t be practical. Every giant model you&apos;ve heard of was
            trained with this same core idea.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            An old algorithm, quietly doing the heavy lifting behind the entire
            field.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-why",
      prompt: "Why is backpropagation considered foundational to deep learning?",
      choices: [
        {
          text: "It efficiently computes how to update every weight, making training deep networks practical at scale",
          correct: true,
          feedback:
            "Right — without an efficient way to assign blame across millions of weights, deep nets couldn't be trained.",
        },
        {
          text: "It lets the model skip training entirely",
          feedback:
            "It's the engine *of* training — it doesn't skip it.",
        },
        {
          text: "It replaces the need for any data",
          feedback:
            "It needs data and the error signal — it's how the model learns from them.",
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
            Backpropagation traces the error backward through a network to tell
            every weight how to change — the gradients that gradient descent then
            acts on. Compute the blame, take the step, repeat: that loop is how
            deep models learn.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            And running that loop over billions of weights takes serious hardware
            — which is where <strong>GPUs and compute</strong> come in.
          </p>
        </>
      ),
    },
  ],
};

export default lesson;
