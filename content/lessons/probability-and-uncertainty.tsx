import type { Lesson } from "@/lib/lessons";

const lesson: Lesson = {
  slug: "probability-and-uncertainty",
  title: "Probability & Uncertainty",
  tagline: "Why a confident answer and a correct one aren't the same.",
  minutes: 5,
  steps: [
    {
      kind: "explain",
      id: "hook",
      eyebrow: "The idea",
      body: (
        <>
          <p style={{ margin: 0 }}>
            People want certainty from machines. AI doesn&apos;t deal in it.
            Every output is, underneath, a bet — a most-likely answer pulled from
            a cloud of possibilities. Learning to read AI means learning to think
            in probabilities instead of yes/no.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            The hard part isn&apos;t the probability. It&apos;s the uncertainty
            that comes with it.
          </p>
        </>
      ),
    },
    {
      kind: "explain",
      id: "degree",
      eyebrow: "A number is a degree of belief",
      body: (
        <>
          <p style={{ margin: 0 }}>
            When a model assigns 90% to an answer, that&apos;s not 90% of a fact —
            it&apos;s the strength of its hunch. A useful gut check: imagine many
            similar situations. If the model says 90% every time, it should be
            wrong about one in ten of them.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            A probability you can&apos;t imagine being wrong isn&apos;t a
            probability. It&apos;s a hope.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-degree",
      prompt: "A model is 90% confident across many predictions. If it's well-behaved, what should you see?",
      choices: [
        {
          text: "It's wrong on roughly one in ten of them — 90% confidence means 10% misses",
          correct: true,
          feedback:
            "Right — a probability only means something if the misses actually show up at that rate.",
        },
        {
          text: "It's never wrong, because 90% is high",
          feedback:
            "90% explicitly leaves room to be wrong 10% of the time — that's the whole point of a probability.",
        },
        {
          text: "It's wrong 90% of the time",
          feedback:
            "The other way around — 90% confident means it expects to be right about 9 in 10.",
        },
      ],
    },
    {
      kind: "explain",
      id: "calibration",
      eyebrow: "Confident ≠ correct",
      body: (
        <>
          <p style={{ margin: 0 }}>
            The dangerous gap is between how sure a model <em>sounds</em> and how
            often it&apos;s <em>right</em>. A well-calibrated model&apos;s 90%s
            come true about 90% of the time. A poorly-calibrated one can be
            breezily certain and routinely wrong — and language models, trained to
            sound fluent, are very good at sounding sure.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Tone is not evidence. The confidence in the wording tells you nothing
            reliable about the truth of it.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-calibration",
      prompt: "A model gives an answer in a confident, authoritative tone. Can it still be wrong?",
      choices: [
        {
          text: "Yes — confidence and correctness are different things, and a model can be fluently, confidently wrong",
          correct: true,
          feedback:
            "Right — calibration (does the confidence match the accuracy?) is its own hard problem.",
        },
        {
          text: "No — a confident tone means it has checked the facts",
          feedback:
            "Tone isn't a fact-check. Fluent certainty can sit on top of a completely wrong answer.",
        },
      ],
    },
    {
      kind: "explain",
      id: "useful",
      eyebrow: "Uncertainty is information",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Treating uncertainty as a flaw is a mistake. A model that can flag
            &quot;I&apos;m not sure&quot; is more useful than one that always
            sounds certain — because you know where to double-check. The goal
            isn&apos;t to banish doubt; it&apos;s to <em>calibrate</em> it.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            The best way to use a probabilistic system is to match your own
            skepticism to its real reliability — high stakes, more checking.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-useful",
      prompt: "What's the healthiest way to work with a model's uncertainty?",
      choices: [
        {
          text: "Calibrate your trust to the stakes — verify more when being wrong would cost more",
          correct: true,
          feedback:
            "Right — uncertainty is a signal to manage, not a defect to ignore.",
        },
        {
          text: "Assume the most confident-sounding answer is always correct",
          feedback:
            "That's exactly the trap — confidence and correctness can diverge.",
        },
        {
          text: "Refuse to use any model that's ever uncertain",
          feedback:
            "All useful models are uncertain — the skill is handling it, not avoiding it.",
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
            AI speaks in probabilities, and a probability is a degree of belief
            that should sometimes be wrong. Confidence isn&apos;t correctness, and
            a fluent tone is no proof. Read the uncertainty, and match your
            scrutiny to the stakes.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Certainty is the one thing a probabilistic system can never honestly
            sell you.
          </p>
        </>
      ),
    },
  ],
};

export default lesson;
