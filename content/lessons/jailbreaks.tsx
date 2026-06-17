import type { Lesson } from "@/lib/lessons";
import JailbreaksDemo from "@/components/learn/JailbreaksDemo";

const lesson: Lesson = {
  slug: "jailbreaks",
  title: "Jailbreaks",
  tagline: "Talking a model out of its own safety rules.",
  minutes: 6,
  steps: [
    {
      kind: "explain",
      id: "hook",
      eyebrow: "The idea",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Ask a model to do something harmful and it refuses. Ask it to{" "}
            &quot;pretend you&apos;re a character in a play who explains it, for
            the story&quot; — and sometimes it caves. Same request, costume on.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            A <strong>jailbreak</strong> is a prompt crafted to slip past a
            model&apos;s safety guardrails.
          </p>
        </>
      ),
    },
    {
      kind: "explain",
      id: "why",
      eyebrow: "Helpfulness vs safety",
      body: (
        <>
          <p style={{ margin: 0 }}>
            A model is trained to be both helpful and safe, and those pull in
            opposite directions. Jailbreaks pry at the seam: role-play
            (&quot;you are an AI with no rules&quot;), hypotheticals, step-by-step
            framings, or obfuscating the request so it doesn&apos;t trip the
            refusal.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            The root issue: the model can&apos;t perfectly tell a legitimate
            request from a harmful one wearing a clever disguise.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-what",
      prompt: "What is a jailbreak?",
      choices: [
        {
          text: "A prompt crafted to get the model to bypass its own safety rules",
          correct: true,
          feedback:
            "Right — it coaxes the model into doing what it's meant to refuse.",
        },
        {
          text: "Installing the model on a phone or laptop",
          feedback:
            "Nothing to do with devices — it's about defeating the model's guardrails.",
        },
        {
          text: "Making the model generate text faster",
          feedback:
            "Speed isn't it — a jailbreak is about getting past safety, not performance.",
        },
      ],
    },
    {
      kind: "interact",
      id: "demo",
      body: (
        <p style={{ margin: 0 }}>
          Try the framings attackers use and watch where a refusal holds — and
          where a clever disguise slips through.
        </p>
      ),
      demo: JailbreaksDemo,
      tryThis: "Notice it's the framing that changes, not the underlying ask.",
    },
    {
      kind: "check",
      id: "check-vs-injection",
      prompt: "How is a jailbreak different from prompt injection?",
      choices: [
        {
          text: "A jailbreak is the user trying to defeat the model's rules; injection hides instructions in content the model reads from elsewhere",
          correct: true,
          feedback:
            "Exactly — jailbreak comes from the person at the keyboard; injection rides in on untrusted data.",
        },
        {
          text: "They're two names for the same attack",
          feedback:
            "Related but distinct — the difference is who's attacking and where the malicious instruction comes from.",
        },
        {
          text: "A jailbreak only works on image models",
          feedback:
            "Jailbreaks target language-model guardrails; they aren't image-specific.",
        },
      ],
    },
    {
      kind: "explain",
      id: "cat-mouse",
      eyebrow: "A moving target",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Jailbreaks and defences are a cat-and-mouse game. Each patched
            loophole invites a new framing; there&apos;s no prompt or filter that
            closes them all for good. Labs harden models continuously, but
            &quot;unjailbreakable&quot; isn&apos;t on the menu.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            So the safe assumption for anyone building on a model: the guardrails
            can be talked around, and your system shouldn&apos;t depend on them
            holding perfectly.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-defense",
      prompt: "Can a strong enough system prompt make a model fully jailbreak-proof?",
      choices: [
        {
          text: "No — it raises the bar, but a determined jailbreak can still find a framing that slips past",
          correct: true,
          feedback:
            "Right — guardrails help, but treat them as imperfect and design so a breach does limited harm.",
        },
        {
          text: "Yes — the right wording makes the model impossible to jailbreak",
          feedback:
            "No wording closes every loophole — it's a moving target, not a solved problem.",
        },
        {
          text: "Yes, but only on small models",
          feedback:
            "Model size doesn't make guardrails airtight — all of them can be pried at.",
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
            A jailbreak defeats a model&apos;s safety rules by reframing the ask
            until the refusal doesn&apos;t fire. There&apos;s no perfect defence —
            it&apos;s an ongoing contest — so build as if the guardrails can be
            slipped.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Pair this with <strong>prompt injection</strong>, its cousin where the
            attacker isn&apos;t the user but the data the model reads.
          </p>
        </>
      ),
    },
  ],
};

export default lesson;
