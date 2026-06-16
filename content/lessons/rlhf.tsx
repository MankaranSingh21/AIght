import type { Lesson } from "@/lib/lessons";
import RlhfDemo from "@/components/learn/RlhfDemo";

const lesson: Lesson = {
  slug: "rlhf",
  title: "RLHF",
  tagline: "How a raw text predictor learns to be a helpful assistant.",
  minutes: 6,
  steps: [
    {
      kind: "explain",
      id: "hook",
      eyebrow: "The idea",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Straight out of pretraining, a model is a magnificent autocomplete —
            and a frustrating assistant. It rambles, dodges, or cheerfully
            completes your question with ten more questions. It can predict
            text; it hasn&apos;t learned what <em>you&apos;d prefer</em>.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            <strong>RLHF</strong> — reinforcement learning from human feedback —
            is how that gap gets closed.
          </p>
        </>
      ),
    },
    {
      kind: "explain",
      id: "how",
      eyebrow: "Teach it what 'better' means",
      body: (
        <>
          <p style={{ margin: 0 }}>
            The recipe: show people two model answers and ask which is better.
            Collect thousands of these judgments and train a{" "}
            <strong>reward model</strong> that predicts what humans would prefer.
            Then use reinforcement learning to push the main model toward answers
            the reward model scores highly.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Nobody writes the &quot;correct&quot; answer. People just point at
            the better of two, over and over, and the model learns the shape of
            &quot;better.&quot;
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-what",
      prompt: "What does RLHF tune a model toward?",
      choices: [
        {
          text: "Responses that humans rated as better than the alternatives",
          correct: true,
          feedback:
            "Right — human preferences become a reward signal the model is trained to maximise.",
        },
        {
          text: "Memorising a fixed list of correct answers",
          feedback:
            "There's no answer key — it learns from comparative preferences, not gold responses.",
        },
        {
          text: "Browsing the internet for fresh facts",
          feedback:
            "That's retrieval. RLHF shapes behaviour and tone, not live knowledge.",
        },
      ],
    },
    {
      kind: "interact",
      id: "demo",
      body: (
        <p style={{ margin: 0 }}>
          Play the human: pick the better of two responses and watch a
          preference signal take shape — the raw material RLHF runs on.
        </p>
      ),
      demo: RlhfDemo,
      tryThis: "Your choices are the training signal — this is how 'helpful' gets defined.",
    },
    {
      kind: "check",
      id: "check-knowledge",
      prompt: "Does RLHF make a model know more facts?",
      choices: [
        {
          text: "Yes — it pours new knowledge into the model",
          feedback:
            "Not really. Knowledge mostly comes from pretraining; RLHF reshapes how the model behaves with what it already knows.",
        },
        {
          text: "No — it shapes behaviour and tone toward what people prefer, not the underlying knowledge",
          correct: true,
          feedback:
            "Exactly — it makes the model more helpful and well-mannered, not more knowledgeable.",
        },
        {
          text: "It erases everything the model learned in pretraining",
          feedback:
            "Pretrained knowledge stays — RLHF adjusts the model's manners, not its memory.",
        },
      ],
    },
    {
      kind: "explain",
      id: "caveats",
      eyebrow: "The catch",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Optimising for &quot;what humans rate highly&quot; has a shadow side.
            Models can learn to be <em>sycophantic</em> — agreeing with you
            because agreement gets the thumbs-up — or to <em>reward-hack</em>,
            finding answers that score well without being genuinely better.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            A model can also sound more confident than it should, because
            confident answers often read as better. Alignment to preferences
            isn&apos;t the same as alignment to truth.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-sycophancy",
      prompt: "Why might an RLHF-trained model agree with you a little too readily?",
      choices: [
        {
          text: "Agreement often earned higher human ratings, so the model learned to lean that way — sycophancy",
          correct: true,
          feedback:
            "Right — it optimised for approval, and approval and flattery can be hard to tell apart.",
        },
        {
          text: "It has no opinions stored in its weights",
          feedback:
            "The tilt is learned behaviour from the reward signal, not an absence of stored views.",
        },
        {
          text: "Because RLHF disables disagreement entirely",
          feedback:
            "Nothing is disabled — it's a soft bias toward what rated well, which sometimes means agreeing.",
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
            RLHF is why a model feels like a helpful assistant instead of a wall
            of autocomplete: human preferences, turned into a reward, used to
            steer behaviour. Powerful — and quietly biased toward whatever people
            happened to upvote.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            A newer, simpler route to the same goal skips the separate reward
            model entirely: that&apos;s <strong>DPO</strong>.
          </p>
        </>
      ),
    },
  ],
};

export default lesson;
