import type { Lesson } from "@/lib/lessons";
import TemperatureDemo from "@/components/learn/TemperatureDemo";

const lesson: Lesson = {
  slug: "temperature-sampling",
  title: "Temperature & Sampling",
  tagline: "Why “more creative” is not the same as “more random”.",
  minutes: 5,
  steps: [
    {
      kind: "explain",
      id: "hook",
      eyebrow: "The idea",
      body: (
        <>
          <p style={{ margin: 0 }}>
            At every step of generation, the model produces a probability
            distribution over the next token — thousands of candidates, each
            with a score. <strong>Temperature</strong> controls how that
            distribution gets sampled.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Low temperature: pick the safest token, every time. High
            temperature: give the long shots a real chance.
          </p>
        </>
      ),
    },
    {
      kind: "interact",
      id: "demo",
      body: (
        <p style={{ margin: 0 }}>
          Move the knob and watch the distribution reshape.
        </p>
      ),
      demo: TemperatureDemo,
      tryThis: "Push it to the extremes — near 0, then as high as it goes.",
    },
    {
      kind: "check",
      id: "check-zero",
      prompt: "What happens at temperature 0?",
      choices: [
        {
          text: "The model refuses to answer — there's no randomness to work with",
          feedback:
            "It still answers fine — it just stops gambling on which token comes next.",
        },
        {
          text: "It always picks the single most likely next token",
          correct: true,
          feedback:
            "Right — argmax decoding. The same input gives (nearly) the same output, which is what you want for extraction and structured tasks.",
        },
        {
          text: "It answers faster because it skips the sampling step",
          feedback:
            "Speed barely changes — the full distribution is computed either way; only the picking rule differs.",
        },
      ],
    },
    {
      kind: "explain",
      id: "topp",
      eyebrow: "The other knob",
      body: (
        <>
          <p style={{ margin: 0 }}>
            <strong>Top-p</strong> (nucleus sampling) trims the candidate pool
            instead of reshaping it: only consider the smallest set of tokens
            whose probabilities add up to <code>p</code>.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            At <code>top_p = 0.9</code>, the model samples from the plausible
            head of the distribution and never touches the absurd tail — even
            at higher temperatures.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-creative",
      prompt: "Does higher temperature make a model more creative?",
      choices: [
        {
          text: "Yes — creativity is randomness, and temperature adds randomness",
          feedback:
            "More random, yes — but creative work has voice, internal logic, and relevance. High temperature breaks all three.",
        },
        {
          text: "No — it makes output more random, which is not the same thing",
          correct: true,
          feedback:
            "Exactly the distinction that matters. Above ~1.2 the text looks interesting for two sentences and falls apart by the fifth.",
        },
        {
          text: "Temperature has no effect on style at all",
          feedback:
            "It clearly changes the texture of output — just not in the direction of disciplined creativity.",
        },
      ],
    },
    {
      kind: "explain",
      id: "practice",
      eyebrow: "In practice",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Useful defaults: <code>0</code> for extraction, classification, and
            anything that must be reproducible. <code>0.5–0.9</code> for most
            writing — enough variation to avoid the flattest phrasing, not
            enough to lose the plot.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            If output quality feels erratic, check the sampling settings before
            blaming the prompt.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-json",
      prompt:
        "You're extracting structured JSON from invoices. Which setting do you reach for?",
      choices: [
        {
          text: "Temperature 0 — reproducible, no gambling on field names",
          correct: true,
          feedback:
            "Right. Determinism is the feature here; variation is a bug.",
        },
        {
          text: "Temperature 1.5 — so the model can think outside the schema",
          feedback:
            "Outside the schema is exactly where you don't want it — that's how field names get inventive.",
        },
        {
          text: "It makes no difference for structured output",
          feedback:
            "It very much does — sampling noise is a top cause of malformed structured output.",
        },
      ],
    },
  ],
};

export default lesson;
