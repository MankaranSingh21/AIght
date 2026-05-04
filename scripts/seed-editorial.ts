/**
 * Seed script: editorial weaknesses + status for all tools.
 * Run: npx tsx scripts/seed-editorial.ts
 * Requires: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

type ToolUpdate = {
  slug: string;
  status: 'stable' | 'beta' | 'rising' | 'deprecated';
  deprecated_reason?: string;
  weaknesses: string[];
};

const updates: ToolUpdate[] = [
  // ── AI Chat ────────────────────────────────────────────────────────────────
  {
    slug: 'claude-4-6',
    status: 'rising',
    weaknesses: [
      'Occasionally over-hedges on nuanced topics, adding unnecessary caveats even when directness would serve better.',
      'Tool use (function calling) can be unreliable for complex multi-step agentic workflows — sometimes stops mid-chain.',
      'Slower output speed than GPT-4o at comparable quality tiers; noticeable on long-form generation tasks.',
    ],
  },
  {
    slug: 'chatgpt-5-4',
    status: 'rising',
    weaknesses: [
      'Browsing citations are sometimes domain-correct but claim-wrong — it will cite a real paper that does not support the exact sentence it attributes to it.',
      'Code generation is inconsistent on edge cases; works well for common patterns, struggles when the problem is genuinely novel.',
      'The free tier throttles hard during peak hours, making it unreliable for time-sensitive work.',
    ],
  },
  {
    slug: 'grok-4-1',
    status: 'stable',
    weaknesses: [
      'Moderation is inconsistent — sometimes refuses benign requests while allowing similar ones through minutes later.',
      'Real-time search integration is powerful but can surface low-quality sources without flagging their reliability.',
      'Interface is less refined than competitors; the X/Twitter integration is a feature for some users and a distraction for others.',
    ],
  },
  {
    slug: 'qwen-3-6-plus',
    status: 'stable',
    weaknesses: [
      'Primarily optimised for Chinese-language tasks; English-language output is good but occasionally awkward in phrasing.',
      'API reliability has historically been inconsistent during peak demand periods.',
      'Ecosystem and integrations are narrower than OpenAI/Anthropic equivalents for Western use cases.',
    ],
  },
  {
    slug: 'kimi-k2-5',
    status: 'stable',
    weaknesses: [
      'Long-context performance degrades noticeably past 500k tokens — retrieval accuracy drops at the extremes it advertises.',
      'Limited English-language community support and third-party integrations compared to GPT-4 or Claude.',
      'Pricing for high-volume API use becomes uncompetitive at scale.',
    ],
  },
  {
    slug: 'me-bot',
    status: 'beta',
    weaknesses: [
      'The personalisation model requires significant upfront time investment before it becomes meaningfully useful.',
      'Privacy model is unclear — the extent of data retained for personalisation is not fully documented.',
      'Integration surface is limited; currently most useful as a standalone tool, not embedded in existing workflows.',
    ],
  },
  {
    slug: 'openclaw',
    status: 'beta',
    weaknesses: [
      'Documentation is sparse — getting started requires trial and error that better-established tools avoid.',
      'Feature set is still evolving; expect breaking changes as the product matures.',
    ],
  },
  {
    slug: 'openclaw-gateway',
    status: 'beta',
    weaknesses: [
      'Primarily useful as infrastructure for other tools; not a standalone product for most users.',
      'Setup complexity is high relative to what you get at early tiers.',
    ],
  },

  // ── Video Gen ──────────────────────────────────────────────────────────────
  {
    slug: 'wan-2-2',
    status: 'stable',
    weaknesses: [
      'Generation times are slow relative to competitors at similar quality levels — plan for 3–8 minute waits.',
      'Free tier adds watermarks that are difficult to remove without upgrading to a paid plan.',
      'Prompt adherence drops on complex multi-subject scenes; simpler prompts work significantly better.',
    ],
  },
  {
    slug: 'kling-3-0',
    status: 'rising',
    weaknesses: [
      'Expensive at serious usage volume; the credit system is opaque and runs out faster than expected.',
      'Occasionally produces uncanny-valley motion on human subjects, especially hands and faces in close-up.',
      'No audio generation — you are responsible for adding sound, which breaks the "end-to-end" appeal.',
    ],
  },
  {
    slug: 'seedance-2-0',
    status: 'stable',
    weaknesses: [
      'Prompt adherence is still inconsistent — stylistic requests are often interpreted loosely.',
      'Output resolution options are limited compared to Kling or Sora at comparable quality tiers.',
    ],
  },
  {
    slug: 'hailuo-2-3',
    status: 'stable',
    weaknesses: [
      'Coherence degrades noticeably for clips longer than 8 seconds; best for short punchy content.',
      'Character consistency across multiple generations requires careful prompt engineering with no built-in support.',
    ],
  },
  {
    slug: 'vidu-q3',
    status: 'stable',
    weaknesses: [
      'Resolution ceiling is lower than Kling or Wan at the highest quality settings.',
      'Stylistic range is narrower — excels at a specific aesthetic that may not fit all projects.',
    ],
  },
  {
    slug: 'pixverse',
    status: 'stable',
    weaknesses: [
      'Maximum output resolution is capped lower than leading competitors; not suitable for broadcast-quality work.',
      'Limited fine-grained control over motion speed and camera movement compared to Kling.',
    ],
  },
  {
    slug: 'luma-dream-machine',
    status: 'stable',
    weaknesses: [
      'Expensive relative to output length — generation credits go quickly for longer clips.',
      'Wait times during peak usage can exceed 30 minutes for high-quality generations.',
      'No audio support; photorealistic video without audio is harder to use in final deliverables.',
    ],
  },
  {
    slug: 'nano-banana-pro',
    status: 'beta',
    weaknesses: [
      'Very early stage — expect significant UX changes and possible downtime as the product matures.',
      'Use case positioning is not yet clearly differentiated from more established alternatives.',
    ],
  },

  // ── Image Gen ──────────────────────────────────────────────────────────────
  {
    slug: 'ideogram-3-0',
    status: 'stable',
    weaknesses: [
      'Photorealistic output is weaker than Flux or Midjourney; best suited for stylised and typographic work.',
      'The style range, while strong for illustration, is narrower than competitors with more control options.',
    ],
  },
  {
    slug: 'flux-2',
    status: 'rising',
    weaknesses: [
      'Generation speed is slower than Stable Diffusion-based alternatives; not ideal for rapid iteration.',
      'Text rendering in images is improved but still occasionally produces garbled letters in complex layouts.',
      'API costs add up quickly at production scale — self-hosting is the cost-effective path but requires setup.',
    ],
  },
  {
    slug: 'wavespeedai',
    status: 'beta',
    weaknesses: [
      'Speed is the headline feature, but quality consistency lags behind slower alternatives at equal prompt complexity.',
      'Style control options are limited — what you gain in speed you lose in predictability.',
    ],
  },
  {
    slug: 'leonardo-ai',
    status: 'stable',
    weaknesses: [
      'The UI is overwhelming for new users — dozens of models and sliders with minimal guidance on what they do.',
      'Subscription tiers and credit system are confusing; users regularly run out of credits faster than expected.',
      'Quality varies significantly across the many models available; finding the right one for your use case takes time.',
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
    slug: 'recraft-v3',
    status: 'stable',
    weaknesses: [
      'Photorealistic generation is not its strength — best for vector-adjacent and illustrative styles.',
      'Limited to specific aesthetic categories; if your use case doesn\'t fit, you\'ll hit the ceiling quickly.',
    ],
  },
  {
    slug: 'microsoft-designer',
    status: 'stable',
    weaknesses: [
      'Tightly integrated with the Microsoft ecosystem — most useful if you\'re already in 365, less so otherwise.',
      'Limited export options and creative control compared to standalone tools like Canva or Figma.',
      'AI generation quality is solid but not at the leading edge; Flux or Ideogram outperform it for complex prompts.',
    ],
  },

  // ── Dev Tools ──────────────────────────────────────────────────────────────
  {
    slug: 'cursor-3',
    status: 'rising',
    weaknesses: [
      'Context window management in large monorepos is frustrating — the model loses coherence past ~80k tokens of codebase context.',
      'Expensive at serious usage; the $20/month tier runs out quickly if you use it as your primary IDE.',
      'Occasionally enters a loop on hard problems — confidently suggesting the same broken approach multiple times.',
    ],
  },
  {
    slug: 'aider',
    status: 'stable',
    weaknesses: [
      'Terminal-only workflow has a steep learning curve — the mental model is different from GUI-based editors.',
      'Context management requires manual attention; you must explicitly tell it which files are in scope.',
      'Model API costs pass through to you directly, so heavy usage with GPT-4 or Claude can get expensive fast.',
    ],
  },
  {
    slug: 'bolt-new',
    status: 'rising',
    weaknesses: [
      'Excellent for prototyping but struggles with complex multi-file refactors once a project grows past ~20 files.',
      'When it generates bugs, it sometimes cannot debug its own output without being restarted from scratch.',
      'Deployment pipeline is opinionated — hard to eject cleanly if you want to move to a custom infrastructure.',
    ],
  },
  {
    slug: 'lovable',
    status: 'rising',
    weaknesses: [
      'Generated code quality is inconsistent — works beautifully on simple CRUD apps, becomes unmaintainable at scale.',
      'Non-developers are the target audience, but the product becomes more frustrating, not less, as projects grow complex.',
      'Limited fine-grained control; if you need specific architecture decisions, you\'re fighting the tool rather than using it.',
    ],
  },
  {
    slug: 'jdoodle-ai',
    status: 'stable',
    weaknesses: [
      'Primarily an educational tool — not suitable for professional development workflows.',
      'Limited to in-browser execution; no persistent project state or file system access.',
    ],
  },
  {
    slug: 'windsurf',
    status: 'rising',
    weaknesses: [
      'Plugin and extension ecosystem is smaller than VS Code or Cursor; some tools you rely on may not be available.',
      'Tab completion inconsistency — sometimes brilliant, sometimes misses obvious continuations.',
      'Newer product means rough edges exist; expect more iteration on UX than with Cursor.',
    ],
  },
  {
    slug: 'replit-agent',
    status: 'stable',
    weaknesses: [
      'Deployment can be fragile — apps work in the Replit environment but require significant work to move elsewhere.',
      'Storage and compute limits on free tier make it unsuitable for anything beyond lightweight prototypes.',
      'The "agent" framing oversells autonomy — you still need to guide it carefully on non-trivial projects.',
    ],
  },
  {
    slug: 'base44',
    status: 'beta',
    weaknesses: [
      'Still early — limited language and framework support beyond the primary use case.',
      'Community and documentation are thin; troubleshooting requires direct support.',
    ],
  },

  // ── Research ───────────────────────────────────────────────────────────────
  {
    slug: 'notebooklm',
    status: 'rising',
    weaknesses: [
      'Hallucinations in citations do occur — it will sometimes attribute a claim to a source that contains related but not identical information.',
      'Strictly limited to uploaded sources; it cannot search the web or find papers on its own.',
      'Large document sets (20+ PDFs) can degrade answer quality as sources compete for attention.',
    ],
  },
  {
    slug: 'perplexity',
    status: 'rising',
    weaknesses: [
      'Citations are often correct at the domain level but wrong at the specific-claim level — the paper cited exists, but may not say what Perplexity says it says.',
      'Free tier uses a weaker model that noticeably underperforms Pro for complex questions.',
      'Tends to over-summarise contested topics, smoothing out nuance that matters in academic or legal contexts.',
    ],
  },
  {
    slug: 'scispace',
    status: 'stable',
    weaknesses: [
      'Struggles with equations and mathematical notation — explanations of formulae are often imprecise.',
      'Coverage is strongest in natural sciences; social science and humanities papers are less reliably indexed.',
    ],
  },
  {
    slug: 'elicit',
    status: 'stable',
    weaknesses: [
      'Requires well-structured research questions; vague or exploratory queries return low-quality results.',
      'Creative synthesis across sources is weak — it organises evidence but does not connect dots across papers.',
      'Coverage skews toward empirical studies; theoretical or qualitative literature is less well supported.',
    ],
  },
  {
    slug: 'humata',
    status: 'stable',
    weaknesses: [
      'Technical and highly specialised documents (e.g., legal contracts with complex cross-references) can confuse the model.',
      'Free tier severely limits document count and question volume.',
    ],
  },
  {
    slug: 'scholarai',
    status: 'stable',
    weaknesses: [
      'Often limited to abstract-level summaries rather than deep engagement with paper content.',
      'Citation accuracy is better than general AI assistants but not perfect — always verify specific claims.',
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
  {
    slug: 'researchrabbit',
    status: 'stable',
    weaknesses: [
      'Pure discovery tool with no synthesis — you get a map of papers, not an understanding of what they say.',
      'Relies on Semantic Scholar indexing; papers not in that database simply don\'t exist in ResearchRabbit.',
    ],
  },

  // ── Productivity / Writing ─────────────────────────────────────────────────
  {
    slug: 'goblin-tools',
    status: 'stable',
    weaknesses: [
      'Highly specialised for task breakdown and executive function support — limited use cases beyond that niche.',
      'No integrations with task managers or calendars; the output stays inside Goblin.tools unless you copy it out.',
    ],
  },
  {
    slug: 'sudowrite',
    status: 'stable',
    weaknesses: [
      'Heavy reliance on Sudowrite can create a dependency that gradually erodes your own voice — a real risk for fiction writers.',
      'Expensive at high output volumes; the credit system runs out faster than expected for novel-length projects.',
      'Output style has a detectable pattern that experienced readers often recognise as AI-assisted.',
    ],
  },
  {
    slug: 'novelcrafter',
    status: 'stable',
    weaknesses: [
      'Steeper learning curve than competitors — the planning and codex system takes time to understand before it becomes useful.',
      'Less useful for short-form content; the value compounds over novel-length projects, not essays or blog posts.',
    ],
  },
  {
    slug: 'gamma',
    status: 'stable',
    weaknesses: [
      'Design control is limited — you get attractive slides quickly, but significant customisation requires fighting the tool.',
      'Templates share a recognisable aesthetic that makes Gamma decks identifiable at a glance.',
      'Export options are limited; getting a fully editable PowerPoint requires paid tier and loses some formatting.',
    ],
  },
  {
    slug: 'editgpt',
    status: 'stable',
    weaknesses: [
      'Limited to basic proofreading and surface-level edits — structural suggestions or argument clarity are outside its scope.',
      'Works best on shorter texts; coherence of suggestions degrades on long-form documents.',
    ],
  },
  {
    slug: 'wispr-flow',
    status: 'stable',
    weaknesses: [
      'Accuracy drops significantly with technical vocabulary, domain-specific terms, and proper nouns that weren\'t in training data.',
      'Requires microphone access and background listening, which raises privacy concerns for some use cases.',
    ],
  },
  {
    slug: 'anki-ai-add-ons',
    status: 'stable',
    weaknesses: [
      'Quality varies enormously between add-ons — some are well-maintained, others abandoned; research before installing.',
      'Requires existing Anki knowledge; the AI layer adds complexity rather than simplifying the base tool for newcomers.',
    ],
  },
  {
    slug: 'quizlet-q-chat',
    status: 'stable',
    weaknesses: [
      'AI integration is shallow — more of a quiz-assistant feature than a deep learning tool.',
      'Limited to the quiz-and-flashcard format; not useful for understanding complex topics that require synthesis.',
    ],
  },
  {
    slug: 'elser-ai',
    status: 'beta',
    weaknesses: [
      'Early-stage product with limited documentation and a narrow initial use case.',
      'Integration options are limited; mostly useful in isolation rather than as part of a larger workflow.',
    ],
  },
];

async function main() {
  console.log(`Seeding editorial data for ${updates.length} tools…\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const update of updates) {
    const { slug, status, deprecated_reason, weaknesses } = update;

    const { error } = await supabase
      .from('tools')
      .update({
        status,
        deprecated_reason: deprecated_reason ?? null,
        weaknesses,
      })
      .eq('slug', slug);

    if (error) {
      console.error(`✗ ${slug}: ${error.message}`);
      errorCount++;
    } else {
      const badge = status === 'rising' ? '↑' : status === 'beta' ? 'β' : status === 'deprecated' ? '✗' : '●';
      console.log(`${badge} ${slug} (${weaknesses.length} weaknesses)`);
      successCount++;
    }
  }

  console.log(`\nDone. ${successCount} updated, ${errorCount} errors.`);
}

main().catch(console.error);
