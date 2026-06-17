import type { Lesson } from "@/lib/lessons";
import MultimodalDemo from "@/components/learn/MultimodalDemo";

const lesson: Lesson = {
  slug: "multimodal",
  title: "Multimodal Models",
  tagline: "One model that can read, see, and sometimes hear.",
  minutes: 6,
  steps: [
    {
      kind: "explain",
      id: "hook",
      eyebrow: "The idea",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Early language models lived in a world of pure text. Show one a
            photo and it had nothing to say. A <strong>multimodal</strong> model
            breaks that wall: paste an image, a chart, a screenshot — and it can
            actually work with what it sees, in the same conversation.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            One model, more than one kind of input.
          </p>
        </>
      ),
    },
    {
      kind: "explain",
      id: "how",
      eyebrow: "Everything becomes the same kind of thing",
      body: (
        <>
          <p style={{ margin: 0 }}>
            The trick is a shared representation. An image gets turned into the
            same sort of numerical tokens that text does, so the model can attend
            across both at once — relating the words &quot;what&apos;s wrong with
            this code?&quot; to the screenshot you pasted.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Once pictures and words live in one space, the model reasons over
            them together instead of treating them as separate problems.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-what",
      prompt: "What makes a model multimodal?",
      choices: [
        {
          text: "It works across more than one kind of input — like text and images together",
          correct: true,
          feedback:
            "Right — multiple modalities in one model, reasoned over jointly.",
        },
        {
          text: "It can respond in multiple languages",
          feedback:
            "Many languages is still one modality (text). Multimodal spans different *types* of input.",
        },
        {
          text: "It runs several copies of itself at once",
          feedback:
            "That's scaling. Modality is about the kinds of data it handles, not how many instances run.",
        },
      ],
    },
    {
      kind: "interact",
      id: "demo",
      body: (
        <p style={{ margin: 0 }}>
          Hand the model both an image and a question and watch it tie the two
          together — something a text-only model simply can&apos;t do.
        </p>
      ),
      demo: MultimodalDemo,
      tryThis: "The answer depends on both the picture and the words — neither alone is enough.",
    },
    {
      kind: "check",
      id: "check-key",
      prompt: "What lets a model reason over an image and text at the same time?",
      choices: [
        {
          text: "Both are converted into a shared representation the model can attend across",
          correct: true,
          feedback:
            "Exactly — once images and words live in the same space, the model relates them directly.",
        },
        {
          text: "It runs a separate image program and pastes the result in",
          feedback:
            "Modern multimodal models fold vision into the model itself, not a bolted-on side tool.",
        },
        {
          text: "It first writes the image down as a long English description, then forgets the image",
          feedback:
            "Captioning is a weaker approach — true multimodal models keep the visual information available, not just a text summary.",
        },
      ],
    },
    {
      kind: "explain",
      id: "why-matters",
      eyebrow: "Why it matters",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Most real tasks aren&apos;t pure text. Debugging from a screenshot,
            reading a receipt, explaining a diagram, describing a scene for
            someone who can&apos;t see it — all need a model that perceives more
            than words.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            It&apos;s not flawless: models can misread fine details, small text,
            or spatial relationships. Trust, but verify what it claims to see.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-limit",
      prompt: "What should you stay wary of with a multimodal model?",
      choices: [
        {
          text: "It can misread fine detail — small text, exact positions, subtle features in an image",
          correct: true,
          feedback:
            "Right — broad understanding is strong, but precise visual details are a known weak spot.",
        },
        {
          text: "It can only ever look at one image, never text",
          feedback:
            "It handles text and images together — that's the whole point of being multimodal.",
        },
        {
          text: "It permanently stores every image you show it in its weights",
          feedback:
            "Images you paste are processed in context, not written into the model's weights.",
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
            A multimodal model brings different kinds of input into one shared
            space, so it can reason over a picture and a sentence together. It
            opens up the many tasks that were never just text — with a standing
            caution about fine visual detail.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Models specialised for the image-and-text pairing are{" "}
            <strong>vision-language models</strong>.
          </p>
        </>
      ),
    },
  ],
};

export default lesson;
