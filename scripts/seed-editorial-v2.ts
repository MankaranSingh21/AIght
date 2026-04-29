/**
 * Seed editorial weaknesses + status for the actual DB tools.
 * Run: npx tsx scripts/seed-editorial-v2.ts
 */
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type ToolUpdate = {
  slug: string;
  status: 'stable' | 'beta' | 'rising' | 'deprecated';
  deprecated_reason?: string;
  weaknesses: string[];
};

const updates: ToolUpdate[] = [
  // ── AI Chat ───────────────────────────────────────────────────────────────
  {
    slug: 'claude',
    status: 'rising',
    weaknesses: [
      'Occasionally over-hedges on nuanced topics, adding caveats where directness would serve better.',
      'Tool use (function calling) can be unreliable in complex multi-step agentic workflows — sometimes stops mid-chain.',
      'Output speed is slower than GPT-4o at comparable quality; noticeable on long-form generation tasks.',
    ],
  },
  {
    slug: 'chatgpt',
    status: 'rising',
    weaknesses: [
      'Browsing citations are sometimes domain-correct but claim-wrong — it cites a real paper that doesn\'t support the exact sentence it attributes to it.',
      'Code generation is inconsistent on edge cases; works well for common patterns, struggles when the problem is genuinely novel.',
      'Free tier throttles hard during peak hours, making it unreliable for time-sensitive work.',
    ],
  },
  {
    slug: 'gemini',
    status: 'stable',
    weaknesses: [
      'Reasoning on complex multi-step problems is weaker than Claude or GPT-4o at equivalent tiers.',
      'Deep Google integration is a feature for some users and a privacy concern for others — the data flow is opaque.',
      'Multimodal quality is strong for images, but video understanding still lags Gemini Ultra\'s advertised benchmarks in practice.',
    ],
  },
  {
    slug: 'grok',
    status: 'stable',
    weaknesses: [
      'Moderation is inconsistent — sometimes refuses benign requests while allowing similar ones through minutes later.',
      'Real-time search integration is powerful but can surface low-quality sources without flagging their reliability.',
      'Tied to X/Twitter — useful if you\'re already in that ecosystem, actively limiting if you\'re not.',
    ],
  },
  {
    slug: 'qwen',
    status: 'stable',
    weaknesses: [
      'Primarily optimised for Chinese-language tasks; English output is good but occasionally awkward in phrasing.',
      'API reliability has historically been inconsistent during peak demand periods.',
      'Ecosystem and integrations are narrower than OpenAI/Anthropic for Western use cases.',
    ],
  },
  {
    slug: 'deepseek',
    status: 'rising',
    weaknesses: [
      'Refuses politically sensitive prompts with no transparency about what triggers refusals — can be unpredictable.',
      'API stability has been variable; not yet suitable as a primary production dependency for critical workloads.',
      'Data handling and residency policies are less transparent than US-based alternatives.',
    ],
  },

  // ── Audio ─────────────────────────────────────────────────────────────────
  {
    slug: 'elevenlabs',
    status: 'stable',
    weaknesses: [
      'Emotional range is still limited for long-form narration — synthetic quality becomes noticeable over 10+ minute audio.',
      'The free tier watermarks audio and limits monthly character count significantly.',
      'Voice cloning from short samples can be inconsistent; you need 3+ minutes of clean audio for reliable results.',
    ],
  },

  // ── Automation ────────────────────────────────────────────────────────────
  {
    slug: 'zapier',
    status: 'stable',
    weaknesses: [
      'Gets expensive fast — complex workflows with high task volumes hit the pricing ceiling quickly.',
      'Error handling is basic; when a zap breaks mid-flow, debugging requires manual step-by-step inspection.',
      'The AI features are thin wrappers over existing tools, not a fundamental rethink of automation.',
    ],
  },
  {
    slug: 'n8n',
    status: 'rising',
    weaknesses: [
      'Self-hosting requires meaningful DevOps knowledge — not plug-and-play for non-technical users.',
      'Documentation quality is uneven; some integrations are well-documented, others require community hunting.',
      'The visual workflow canvas becomes unwieldy for very complex flows with 30+ nodes.',
    ],
  },

  // ── Dev Tools ─────────────────────────────────────────────────────────────
  {
    slug: 'cursor',
    status: 'rising',
    weaknesses: [
      'Context window management in large monorepos is frustrating — coherence drops past ~80k tokens of codebase.',
      'The $20/month tier runs out quickly if you use it as your primary IDE for serious work.',
      'Occasionally enters a loop on hard problems, confidently suggesting the same broken approach multiple times.',
    ],
  },
  {
    slug: 'windsurf',
    status: 'rising',
    weaknesses: [
      'Plugin and extension ecosystem is smaller than VS Code or Cursor; some tools you rely on may not be available.',
      'Tab completion inconsistency — sometimes brilliant, sometimes misses obvious continuations.',
      'Newer product means rough edges; expect more iteration on UX than with Cursor.',
    ],
  },
  {
    slug: 'lovable',
    status: 'rising',
    weaknesses: [
      'Generated code quality is inconsistent — great on simple CRUD apps, becomes unmaintainable at scale.',
      'Limited fine-grained control; if you need specific architecture decisions you end up fighting the tool.',
      'Non-developers hit a complexity ceiling faster than the product suggests; growing projects require real engineering.',
    ],
  },
  {
    slug: 'bolt-new',
    status: 'rising',
    weaknesses: [
      'Excellent for prototyping but struggles with complex multi-file refactors once a project grows past ~20 files.',
      'When it generates bugs it sometimes cannot debug its own output — requires restarting from scratch.',
      'Deployment pipeline is opinionated; hard to eject cleanly if you want custom infrastructure.',
    ],
  },
  {
    slug: 'replit-agent',
    status: 'stable',
    weaknesses: [
      'Apps work in the Replit environment but require significant effort to move elsewhere for production.',
      'Storage and compute limits on the free tier make it unsuitable for anything beyond lightweight prototypes.',
      'The "agent" framing oversells autonomy — you still need to guide it carefully on non-trivial projects.',
    ],
  },
  {
    slug: 'aider',
    status: 'stable',
    weaknesses: [
      'Terminal-only workflow has a steep learning curve — the mental model differs from GUI-based editors.',
      'Context management requires manual attention; you must explicitly tell it which files are in scope.',
      'Model API costs pass through to you directly, so heavy use with GPT-4 or Claude gets expensive fast.',
    ],
  },

  // ── Image Gen ─────────────────────────────────────────────────────────────
  {
    slug: 'midjourney',
    status: 'stable',
    weaknesses: [
      'Discord-only interface is a meaningful barrier — there is no web UI without a third-party wrapper.',
      'Text rendering in images is still unreliable; any prompt requiring legible words will disappoint.',
      'No API access on lower tiers; integrating into products requires workarounds or expensive plan upgrades.',
    ],
  },
  {
    slug: 'flux-2',
    status: 'rising',
    weaknesses: [
      'Generation speed is slower than Stable Diffusion alternatives; not ideal for rapid iteration.',
      'Text rendering in images is improved but still occasionally produces garbled letters in complex layouts.',
      'API costs add up quickly at production scale — self-hosting is cheaper but requires real setup effort.',
    ],
  },
  {
    slug: 'ideogram-3-0',
    status: 'stable',
    weaknesses: [
      'Photorealistic output is weaker than Flux or Midjourney — best for stylised and typographic work.',
      'Style range, while strong for illustration, is narrower than competitors with more granular controls.',
    ],
  },
  {
    slug: 'recraft-v3',
    status: 'stable',
    weaknesses: [
      'Photorealistic generation is not its strength — best for vector-adjacent and illustrative styles.',
      'Limited to specific aesthetic categories; projects outside its range hit a hard ceiling quickly.',
    ],
  },
  {
    slug: 'leonardo-ai',
    status: 'stable',
    weaknesses: [
      'The UI is overwhelming for new users — dozens of models and sliders with minimal guidance.',
      'Subscription tiers and credit system are confusing; users regularly run out faster than expected.',
      'Quality varies significantly across the many models; finding the right one takes experimentation.',
    ],
  },
  {
    slug: 'playground-ai',
    status: 'stable',
    weaknesses: [
      'Free tier limits are tight and refresh slowly — not viable for high-volume iteration.',
      'Output quality is good for experimentation but lags behind Flux or Midjourney for production work.',
    ],
  },
  {
    slug: 'microsoft-designer',
    status: 'stable',
    weaknesses: [
      'Most useful inside the Microsoft 365 ecosystem; limited for users outside it.',
      'Creative control is constrained compared to standalone tools like Canva or Figma.',
      'AI generation quality is solid but not leading-edge; Flux and Ideogram outperform it on complex prompts.',
    ],
  },
  {
    slug: 'canva-magic-studio',
    status: 'stable',
    weaknesses: [
      'AI features are best-in-class for non-designers but feel shallow once you know what you\'re doing.',
      'Export options for print-ready work require careful attention; default settings often produce low-DPI files.',
      'The AI Magic Edit tool works well on simple changes but struggles with complex compositing tasks.',
    ],
  },

  // ── Productivity / Writing ────────────────────────────────────────────────
  {
    slug: 'notion-ai',
    status: 'stable',
    weaknesses: [
      'AI features are only useful if Notion is already your workspace — no standalone value.',
      'Responses are noticeably weaker than Claude or GPT-4 for complex reasoning tasks.',
      'Billed on top of an already expensive Notion plan; the value-per-dollar is poor for occasional users.',
    ],
  },
  {
    slug: 'gamma',
    status: 'stable',
    weaknesses: [
      'Design control is limited — attractive slides are fast, but significant customisation requires fighting the tool.',
      'Templates share a recognisable aesthetic; experienced audiences often identify Gamma decks immediately.',
      'Exporting a fully editable PowerPoint loses some formatting and requires the paid tier.',
    ],
  },
  {
    slug: 'tome',
    status: 'stable',
    weaknesses: [
      'The narrative-focused format is excellent for storytelling decks but limiting for data-heavy presentations.',
      'Export options are limited — no editable PowerPoint or Keynote output.',
      'Less control over layout and design compared to Gamma or traditional tools.',
    ],
  },
  {
    slug: 'fathom',
    status: 'rising',
    weaknesses: [
      'Only works on Zoom, Google Meet, and Teams — no support for other video platforms.',
      'Transcript accuracy drops with heavy accents or poor audio quality.',
      'The AI summary occasionally misses action items that weren\'t stated explicitly in the meeting.',
    ],
  },
  {
    slug: 'sudowrite',
    status: 'stable',
    weaknesses: [
      'Heavy reliance can gradually erode your own voice — a real risk for writers who lean on it too early.',
      'Expensive at high output volumes; credit system runs out faster than expected for novel-length work.',
      'Output style has a detectable pattern that experienced readers often recognise as AI-assisted.',
    ],
  },
  {
    slug: 'novelcrafter',
    status: 'stable',
    weaknesses: [
      'Steeper learning curve than competitors — the planning and codex system takes time before it becomes useful.',
      'Less useful for short-form content; value compounds over novel-length projects, not essays.',
    ],
  },
  {
    slug: 'wispr-flow',
    status: 'stable',
    weaknesses: [
      'Accuracy drops significantly with technical vocabulary, domain-specific terms, and uncommon proper nouns.',
      'Requires background microphone access, which raises privacy concerns in sensitive work contexts.',
    ],
  },
  {
    slug: 'goblin-tools',
    status: 'stable',
    weaknesses: [
      'Highly specialised for task breakdown and executive function support — limited use beyond that niche.',
      'No integrations with task managers or calendars; output stays inside Goblin.tools unless you copy it out.',
    ],
  },
  {
    slug: 'editgpt',
    status: 'stable',
    weaknesses: [
      'Limited to surface-level proofreading — structural suggestions or argument clarity are outside its scope.',
      'Coherence of suggestions degrades on long-form documents past ~2,000 words.',
    ],
  },
  {
    slug: 'quizlet-q-chat',
    status: 'stable',
    weaknesses: [
      'AI integration is shallow — more of a quiz-assistant feature than a deep learning tool.',
      'Limited to the quiz-and-flashcard format; not useful for synthesising complex topics.',
    ],
  },
  {
    slug: 'anki-ai-add-ons',
    status: 'stable',
    weaknesses: [
      'Quality varies enormously between add-ons — some are well-maintained, others abandoned.',
      'Requires existing Anki knowledge; the AI layer adds complexity rather than simplifying onboarding.',
    ],
  },

  // ── Research ──────────────────────────────────────────────────────────────
  {
    slug: 'perplexity',
    status: 'rising',
    weaknesses: [
      'Citations are often correct at the domain level but wrong at the specific-claim level — the paper cited may not say what Perplexity says it says.',
      'Free tier uses a weaker model that noticeably underperforms Pro for complex questions.',
      'Tends to over-summarise contested topics, smoothing out nuance that matters in academic or legal contexts.',
    ],
  },
  {
    slug: 'notebooklm',
    status: 'rising',
    weaknesses: [
      'Hallucinations in citations do occur — it sometimes attributes a claim to a source that contains related but not identical information.',
      'Strictly limited to uploaded sources; cannot search the web or find papers on its own.',
      'Large document sets (20+ PDFs) can degrade answer quality as sources compete for attention.',
    ],
  },
  {
    slug: 'consensus',
    status: 'stable',
    weaknesses: [
      'Tends to oversimplify contested research into consensus/no-consensus binary, missing important nuance.',
      'Coverage is strong for medical and psychological research but weaker in newer or interdisciplinary fields.',
    ],
  },

  // ── Video Gen ─────────────────────────────────────────────────────────────
  {
    slug: 'runway',
    status: 'stable',
    weaknesses: [
      'Expensive at serious usage volume — generation credits run out faster than the pricing page suggests.',
      'Output consistency is still unpredictable for complex motion; simple scene changes work best.',
      'No audio generation; video-only output requires separate tooling to complete a production workflow.',
    ],
  },
  {
    slug: 'luma-dream-machine',
    status: 'stable',
    weaknesses: [
      'Credit costs add up quickly for longer clips; generation budgets disappear faster than expected.',
      'Wait times during peak usage can exceed 30 minutes for high-quality generations.',
      'No audio support; photorealistic video without audio is harder to use in final deliverables.',
    ],
  },
  {
    slug: 'kling-3-0',
    status: 'rising',
    weaknesses: [
      'Expensive at serious usage; the credit system is opaque and runs out faster than expected.',
      'Occasionally produces uncanny-valley motion on human subjects, especially hands and faces in close-up.',
      'No audio generation — you are responsible for sound, which breaks the end-to-end appeal.',
    ],
  },
];

async function main() {
  console.log(`Seeding editorial data for ${updates.length} tools…\n`);
  let ok = 0; let err = 0;

  for (const { slug, status, deprecated_reason, weaknesses } of updates) {
    const { error } = await supabase
      .from('tools')
      .update({ status, deprecated_reason: deprecated_reason ?? null, weaknesses })
      .eq('slug', slug);

    if (error) {
      console.error(`✗ ${slug}: ${error.message}`);
      err++;
    } else {
      const badge = status === 'rising' ? '↑' : status === 'beta' ? 'β' : status === 'deprecated' ? '✗' : '●';
      console.log(`${badge} ${slug} (${weaknesses.length})`);
      ok++;
    }
  }
  console.log(`\nDone. ${ok} updated, ${err} errors.`);
}

main().catch(console.error);
