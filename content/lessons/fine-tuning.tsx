import type { Lesson } from "@/lib/lessons";
import FineTuningComparison from "@/components/learn/FineTuningComparison";

const lesson: Lesson = {
  slug: "fine-tuning",
  title: "Fine-Tuning",
  tagline: "Taking a model that knows a lot and teaching it your way.",
  minutes: 6,
  steps: [
    {
      kind: "explain",
      id: "hook",
      eyebrow: "The idea",
      body: (
        <>
          <p style={{ margin: 0 }}>
            A frontier model is a brilliant generalist — competent at almost
            everything, expert at almost nothing in particular. Sometimes you
            need it to nail <em>your</em> thing: your format, your tone, your
            narrow task, every single time.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            <strong>Fine-tuning</strong> takes that generalist and trains it a
            little further, on examples of exactly what you want.
          </p>
        </>
      ),
    },
    {
      kind: "explain",
      id: "how",
      eyebrow: "Further training, not a new model",
      body: (
        <>
          <p style={{ margin: 0 }}>
            You start from the pretrained model — all its general ability intact
            — and continue training on a focused dataset of your examples. Its
            weights shift, gently, toward your domain and style.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Crucially, this changes the model itself. That&apos;s different from
            writing a clever prompt, which changes nothing permanent.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-what",
      prompt: "What does fine-tuning actually do?",
      choices: [
        {
          text: "Adds a longer, more detailed instruction to each prompt",
          feedback:
            "That's prompting. Fine-tuning updates the model's weights — the change persists with no prompt at all.",
        },
        {
          text: "Continues training a pretrained model on a narrow dataset to specialise it",
          correct: true,
          feedback:
            "Right — same model, nudged toward your task, tone, and format.",
        },
        {
          text: "Runs the model on faster hardware",
          feedback:
            "Hardware doesn't specialise a model. Training on focused examples does.",
        },
      ],
    },
    {
      kind: "interact",
      id: "demo",
      body: (
        <p style={{ margin: 0 }}>
          Compare a base model and a fine-tuned one on the same prompt. Same
          request — notice how differently they answer.
        </p>
      ),
      demo: FineTuningComparison,
      tryThis: "The base model is capable; the fine-tuned one is on-brand.",
    },
    {
      kind: "check",
      id: "check-vs-rag",
      prompt:
        "You need the model to always answer in your company's exact format and voice. Fine-tune, or use RAG?",
      choices: [
        {
          text: "Fine-tune — consistent style, tone, and format are exactly what shifting the weights is good at",
          correct: true,
          feedback:
            "Right. Fine-tuning shapes behaviour. RAG is for supplying facts, not enforcing a voice.",
        },
        {
          text: "RAG — it teaches the model your writing style",
          feedback:
            "RAG injects documents as context; it doesn't reshape how the model writes. Style is a fine-tuning job.",
        },
        {
          text: "Neither can affect format",
          feedback:
            "Fine-tuning very much can — consistent format is one of its clearest wins.",
        },
      ],
    },
    {
      kind: "explain",
      id: "cost",
      eyebrow: "It isn't free",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Fine-tuning needs a quality dataset, costs compute, and has to be
            redone when the base model updates. Push too hard and it{" "}
            <em>overfits</em> your examples — or suffers{" "}
            <em>catastrophic forgetting</em>, losing general skills it used to
            have.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            So reach for it last, not first. Most &quot;we need to fine-tune&quot;
            problems are solved by a better prompt or RAG.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-risk",
      prompt: "What's a real risk of over-aggressive fine-tuning?",
      choices: [
        {
          text: "The model can lose general abilities it used to have — catastrophic forgetting",
          correct: true,
          feedback:
            "Yes — narrow it too hard and broad competence erodes. Balance is the whole game.",
        },
        {
          text: "It permanently deletes the base model for everyone",
          feedback:
            "Your fine-tune is a separate copy — the base model is untouched for other users.",
        },
        {
          text: "It makes prompts stop working entirely",
          feedback:
            "Prompts still work; the danger is degraded general skill, not a broken interface.",
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
            Fine-tuning specialises a capable model by nudging its weights toward
            your examples — best for consistent behaviour and format, worst as a
            first resort. Knowledge → reach for RAG. Behaviour → reach for this.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            One special kind of fine-tuning aligns a model to human preferences:
            that&apos;s <strong>RLHF</strong>.
          </p>
        </>
      ),
    },
  ],
};

export default lesson;
