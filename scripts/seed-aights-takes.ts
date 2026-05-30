/**
 * scripts/seed-aights-takes.ts
 *
 * Upserts the `aights_take` column on the `tools` table for a curated list of
 * 20 tools, written in Moon's voice. The column is already typed in
 * `utils/supabase/types.ts` and rendered by the `AightsTake` component on
 * `/tool/[slug]` — this script just fills it in.
 *
 * Usage:
 *   # 1) Dry-run (prints what it WOULD do, doesn't touch Supabase)
 *   npx tsx --env-file=.env.local scripts/seed-aights-takes.ts
 *
 *   # 2) Apply (writes to production Supabase)
 *   npx tsx --env-file=.env.local scripts/seed-aights-takes.ts --apply
 *
 * Drafting notes for Moon:
 * - Entries marked `// DRAFT` are Claude's drafts in your voice — please read
 *   and rewrite any that don't sound like you before running with --apply.
 * - Entries marked `// TODO` are scaffold rows for you to fill in.
 * - Slugs match the canonical slugs in Supabase (verified against the live
 *   `tools` table on 2026-05-29 — NOT the versioned slugs in
 *   data/curated_tools.json). The script no-ops silently for unknown slugs.
 */

import { createClient } from "@supabase/supabase-js";

interface Take {
  slug: string;
  aights_take: string;
}

const TAKES: Take[] = [
  // DRAFT — assistants
  {
    slug: "claude",
    aights_take:
      "The one I actually leave open while writing. Calm, careful, more willing to admit when it doesn't know than the alternatives. Refusals are still sometimes overzealous but the prose is the cleanest in the market.",
  },
  {
    slug: "chatgpt",
    aights_take:
      "The default for a reason — it's still the best generalist, and the multimodal stack has caught up to anything Google ships. The personality is a little salesman-y if you let it default; system-prompt it down and it gets honest fast.",
  },
  {
    slug: "grok",
    aights_take:
      "Fast, willing, and refreshingly low on hedging. Treat the search results with the same skepticism you'd treat any LLM citation — and don't mistake the brand voice for the underlying model, which is genuinely strong.",
  },
  {
    slug: "gemini",
    aights_take:
      "Better than the brand suggests. The real value isn't the chat — it's the Workspace integration. If you live in Docs and Gmail, this is the assistant that already knows your context, which the others can't fake. The personality is the part to push past.",
  },

  // DRAFT — dev tools
  {
    slug: "cursor",
    aights_take:
      "If you write code professionally, this is the call. The agent mode is the first one I trust to refactor across files without breaking my head. Pricier than feels fair but I've cancelled and come back twice.",
  },
  {
    slug: "aider",
    aights_take:
      "Cursor's terminal-native cousin, and the right pick if you live in tmux. Free, model-agnostic, and the git integration is the cleanest take on the AI-pair-programming idea anyone's shipped.",
  },
  {
    slug: "windsurf",
    aights_take:
      "Genuinely competitive with Cursor — the cascade mode is excellent and the pricing is friendlier. Worth a week-long trial before you commit to either one.",
  },
  {
    slug: "bolt-new",
    aights_take:
      "Best of the prompt-to-full-stack tools right now. The output is real Next.js, not a sandboxed toy, which means you can actually keep building after the demo wears off.",
  },
  {
    slug: "lovable",
    aights_take:
      "Pretty, fast, and the Supabase integration is the cleanest one-click backend I've seen. The catch is that the abstraction wants you to stay inside it — exporting and owning the code outright is more work than the marketing suggests.",
  },
  {
    slug: "replit-agent",
    aights_take:
      "The cloud-native answer if you don't want anything on your machine. Useful for prototyping, less useful once a project crosses the toy threshold. The deploy story is the strongest part.",
  },

  // DRAFT — research
  {
    slug: "notebooklm",
    aights_take:
      "The single most useful AI product Google has shipped. Hand it a folder of PDFs, get back a notebook that actually understands them. The audio overview gimmick is the part everyone shares but the source-grounded Q&A is why it stays open.",
  },
  {
    slug: "perplexity",
    aights_take:
      "When I want a sourced answer fast, this is the call — and the Pro version's deep research mode is genuinely a different product. Still treat the citations as a starting line, not a finish line.",
  },
  {
    slug: "consensus",
    aights_take:
      "Built for the specific job of synthesising research around a claim, and it does it cleanly. The consensus meter wants to feel like a verdict — treat it as a starting point instead. The citation density is the right kind of overwhelming.",
  },

  // DRAFT — productivity / writing
  {
    slug: "goblin-tools",
    aights_take:
      "Designed for neurodivergent brains and it's quietly the most useful AI product I recommend to friends. The Magic ToDo alone has rescued more of my Sundays than any productivity book ever did.",
  },
  {
    slug: "wispr-flow",
    aights_take:
      "If you talk faster than you type — which most people do, they just don't realize it — this changes the shape of your workday. The accuracy is the part people miss; it's not a dictation tool, it's a translation tool from speech-shaped thinking into prose-shaped writing.",
  },
  {
    slug: "gamma",
    aights_take:
      "The slide generator I actually use, mostly because it gets out of the way. Hand it an outline, get back something I can present without apologizing for. The export-to-PPTX is rough; the in-app deck is excellent.",
  },

  // DRAFT — image / media (lower confidence; please rewrite freely)
  {
    slug: "midjourney",
    aights_take:
      "Still the aesthetic benchmark. v6 onwards finally takes instructions instead of vibes. The Discord-only era was the right kind of friction; the web app sands it down a little, and I miss it.",
  },
  {
    slug: "elevenlabs",
    aights_take:
      "The voice cloning is uncanny in a way that has stopped feeling like a parlour trick. If you make podcasts, audiobooks, or any narrated thing, the time savings are the part that changes your week.",
  },

  // TODO — fill in your take when you've spent more time with these
  // {
  //   slug: "sudowrite",
  //   aights_take: "",
  // },
  // {
  //   slug: "novelcrafter",
  //   aights_take: "",
  // },
  // {
  //   slug: "flux-2",
  //   aights_take: "",
  // },
  // {
  //   slug: "notion-ai",
  //   aights_take: "",
  // },
];

async function main() {
  const apply = process.argv.includes("--apply");

  console.log(`\n🟢 aights_take seed pipeline (${apply ? "APPLY" : "DRY-RUN"})\n`);
  console.log(`Preparing ${TAKES.length} takes:\n`);

  for (const t of TAKES) {
    const preview = t.aights_take.slice(0, 64).replace(/\n/g, " ");
    console.log(`  • ${t.slug.padEnd(20)} ${preview}${t.aights_take.length > 64 ? "…" : ""}`);
  }

  if (!apply) {
    console.log(
      "\n(dry-run) Pass --apply to write these to Supabase. Re-read each take in Moon's voice first.\n",
    );
    return;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env.");
    process.exit(1);
  }

  const supabase = createClient(url, key);
  let updated = 0;
  let skipped = 0;
  const failures: string[] = [];

  for (const t of TAKES) {
    const { data, error } = await supabase
      .from("tools")
      .update({ aights_take: t.aights_take })
      .eq("slug", t.slug)
      .select("slug");

    if (error) {
      failures.push(`${t.slug}: ${error.message}`);
      continue;
    }
    if (!data || data.length === 0) {
      skipped++;
      console.log(`  ⊝ ${t.slug} — slug not found in Supabase, skipped`);
      continue;
    }
    updated++;
    console.log(`  ✓ ${t.slug}`);
  }

  console.log(`\nDone. Updated: ${updated}. Skipped (slug not in DB): ${skipped}.`);
  if (failures.length) {
    console.error(`\n❌ Failures (${failures.length}):`);
    failures.forEach((f) => console.error(`  ${f}`));
    process.exit(1);
  }
}

main();
