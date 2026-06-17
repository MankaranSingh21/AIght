import type { Lesson } from "@/lib/lessons";
import VisionLanguageDemo from "@/components/learn/VisionLanguageDemo";

const lesson: Lesson = {
  slug: "vision-language-models",
  title: "Vision-Language Models",
  tagline: "Models that tie what they see to what they can say.",
  minutes: 6,
  steps: [
    {
      kind: "explain",
      id: "hook",
      eyebrow: "The idea",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Show one a photo and ask &quot;is this safe to eat?&quot;, snap a
            menu in another language and ask for the vegetarian options, point a
            camera at a broken appliance and ask what&apos;s wrong. A{" "}
            <strong>vision-language model</strong> answers all three — by joining
            an image to words.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            It&apos;s the corner of multimodality where pictures and language
            meet most directly.
          </p>
        </>
      ),
    },
    {
      kind: "explain",
      id: "how",
      eyebrow: "An encoder and a translator",
      body: (
        <>
          <p style={{ margin: 0 }}>
            A <em>vision encoder</em> turns an image into a sequence of tokens —
            the same currency the language model trades in. The two are trained
            together so the encoder&apos;s output lands in a space the language
            model already understands.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            After that, &quot;describe this&quot; or &quot;what does the sign
            say?&quot; is just the language model reading image-tokens the way it
            reads word-tokens.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-what",
      prompt: "What can a vision-language model do?",
      choices: [
        {
          text: "Connect images and text — describe a photo, read a sign, answer questions about a picture",
          correct: true,
          feedback:
            "Right — it ties what it sees to what it can say.",
        },
        {
          text: "Only process text, never images",
          feedback:
            "The 'vision' half is the point — it takes images as input too.",
        },
        {
          text: "Only generate images, never interpret them",
          feedback:
            "That's image generation. A VLM reads and reasons about images, not just makes them.",
        },
      ],
    },
    {
      kind: "interact",
      id: "demo",
      body: (
        <p style={{ margin: 0 }}>
          Give the model an image and a question and watch it ground its answer
          in what&apos;s actually pictured.
        </p>
      ),
      demo: VisionLanguageDemo,
      tryThis: "Ask about a detail that's in the image and one that isn't — note the difference.",
    },
    {
      kind: "check",
      id: "check-vs-multimodal",
      prompt: "How does a vision-language model relate to multimodal models in general?",
      choices: [
        {
          text: "It's the image-and-text case — the most common slice of the broader multimodal idea",
          correct: true,
          feedback:
            "Right — multimodal can span audio, video and more; VLMs focus on the vision-plus-language pairing.",
        },
        {
          text: "It's a completely unrelated technology",
          feedback:
            "It's a specialisation of multimodality, not a separate thing.",
        },
        {
          text: "It handles every modality except images",
          feedback:
            "Images are its whole specialty — that's the 'vision' in the name.",
        },
      ],
    },
    {
      kind: "explain",
      id: "caveat",
      eyebrow: "It can see wrong",
      body: (
        <>
          <p style={{ margin: 0 }}>
            VLMs are strong on the gist and surprisingly good at reading text in
            images, but shaky on precise detail: exact counts, fine spatial
            relationships, tiny print. They can also <em>hallucinate</em> —
            confidently describing an object that isn&apos;t in the picture.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            For anything that matters, verify what the model claims to see rather
            than taking the description on faith.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-limit",
      prompt: "What's a characteristic failure of a vision-language model?",
      choices: [
        {
          text: "Confidently describing details — or whole objects — that aren't actually in the image",
          correct: true,
          feedback:
            "Right — visual hallucination is real. The fluent description isn't proof it saw correctly.",
        },
        {
          text: "Refusing to look at any image",
          feedback:
            "Reading images is exactly what it does — the issue is accuracy, not refusal.",
        },
        {
          text: "Only working on black-and-white photos",
          feedback:
            "Colour isn't the constraint — fine-detail accuracy and hallucination are.",
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
            A vision-language model fuses a vision encoder with a language model
            so it can reason about images in words. It unlocks a huge range of
            real tasks — and asks you to keep a skeptical eye on the fine details
            it reports.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Capable eyes, occasionally unreliable ones.
          </p>
        </>
      ),
    },
  ],
};

export default lesson;
