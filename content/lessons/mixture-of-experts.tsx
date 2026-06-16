import type { Lesson } from "@/lib/lessons";
import MixtureOfExpertsDemo from "@/components/learn/MixtureOfExpertsDemo";

const lesson: Lesson = {
  slug: "mixture-of-experts",
  title: "Mixture of Experts",
  tagline: "A huge model that only switches on the parts it needs.",
  minutes: 6,
  steps: [
    {
      kind: "explain",
      id: "hook",
      eyebrow: "The idea",
      body: (
        <>
          <p style={{ margin: 0 }}>
            In a normal model, every token you process runs through every single
            parameter. Make the model ten times bigger and every token costs ten
            times as much. That ceiling is expensive.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            <strong>Mixture of experts</strong> breaks it with a simple move:
            don&apos;t use the whole model for every token. Use the right part.
          </p>
        </>
      ),
    },
    {
      kind: "explain",
      id: "router",
      eyebrow: "Many specialists, one router",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Inside an MoE layer sit many sub-networks — the <em>experts</em>. A
            small <em>router</em> looks at each token and sends it to just a few
            of them. The rest stay dark. Different tokens light up different
            experts.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            So the model can hold an enormous number of parameters in total,
            while only a small slice does work on any given token.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-what",
      prompt: "What does a mixture-of-experts model do differently?",
      choices: [
        {
          text: "It averages the answers of many separate, complete models",
          feedback:
            "That's ensembling. MoE routes each token to a few experts inside one model — it doesn't run many full models.",
        },
        {
          text: "It routes each token to a few specialised sub-networks instead of using the whole model",
          correct: true,
          feedback:
            "Right — a router picks the experts, and only those fire for that token.",
        },
        {
          text: "It asks human experts to label the training data",
          feedback:
            "The 'experts' are sub-networks, not people — and this is about inference, not labelling.",
        },
      ],
    },
    {
      kind: "interact",
      id: "demo",
      body: (
        <p style={{ margin: 0 }}>
          Send different inputs through and watch the router pick which experts
          light up. Most of the model stays dark for any single token.
        </p>
      ),
      demo: MixtureOfExpertsDemo,
      tryThis: "Notice only a couple of experts activate at a time — that's the whole trick.",
    },
    {
      kind: "check",
      id: "check-why",
      prompt: "What's the payoff of only activating a few experts per token?",
      choices: [
        {
          text: "Huge total capacity at a fraction of the compute a dense model that size would cost",
          correct: true,
          feedback:
            "Exactly — you get the knowledge of a giant model without paying full price on every token.",
        },
        {
          text: "It removes the need for any training",
          feedback:
            "MoE models still train — including the tricky business of teaching the router.",
        },
        {
          text: "It guarantees the model is smaller on disk",
          feedback:
            "Total size is actually large — the saving is in compute per token, not storage.",
        },
      ],
    },
    {
      kind: "explain",
      id: "tradeoffs",
      eyebrow: "No free lunch",
      body: (
        <>
          <p style={{ margin: 0 }}>
            MoE has its headaches. All those parameters still have to live in
            memory, even the dark ones. The router can play favourites — piling
            tokens onto a few experts while others idle — so training needs care
            to keep the load balanced.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Get it right, though, and MoE is a big reason today&apos;s largest
            models stay affordable enough to actually run.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-cost",
      prompt: "What stays expensive even in an MoE model?",
      choices: [
        {
          text: "Memory — every expert's parameters must be loaded, even the ones not used on a given token",
          correct: true,
          feedback:
            "Right — MoE saves compute per token, but the full parameter set still has to fit in memory.",
        },
        {
          text: "Nothing — MoE makes the model free to run",
          feedback:
            "It cuts per-token compute, not every cost. Memory in particular stays heavy.",
        },
        {
          text: "The router, which is larger than all the experts combined",
          feedback:
            "The router is tiny relative to the experts — its job is just to choose.",
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
            Mixture of experts decouples how much a model <em>knows</em> from how
            much it <em>computes per token</em>: many experts in total, only a
            few active at once, chosen by a router. Big brain, light footprint
            per step.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            It&apos;s one of the quiet architectural tricks behind models that
            are both very large and still usable.
          </p>
        </>
      ),
    },
  ],
};

export default lesson;
