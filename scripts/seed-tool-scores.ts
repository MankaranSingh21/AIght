/**
 * seed-tool-scores.ts
 *
 * Applies research-based scores to all tools in the Supabase `tools` table.
 * Sources: ArtificialAnalysis.ai benchmarks, company privacy policies, independent reviews.
 *
 * Run: npx tsx scripts/seed-tool-scores.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Scores: utility, privacy, speed, cost, transparency (all 0–100)
// utility     — real-world task performance (benchmarks + user reviews)
// privacy     — data handling, ToS, opt-outs (policy review)
// speed       — response latency / throughput (ArtificialAnalysis, user reports)
// cost        — value for money relative to category peers
// transparency — model card quality, limitation honesty, pricing clarity

type ScoreRow = {
  slug: string;
  utility_score: number;
  privacy_score: number;
  speed_score: number;
  cost_score: number;
  transparency_score: number;
  status?: string;
  deprecated_reason?: string;
  risk_level?: string;
};

const SCORES: ScoreRow[] = [
  // ── AI Chat ───────────────────────────────────────────────────────────────
  { slug: "chatgpt-5-4",      utility_score: 90, privacy_score: 52, speed_score: 85, cost_score: 72, transparency_score: 58, risk_level: "Medium" },
  { slug: "claude-4-6",       utility_score: 92, privacy_score: 74, speed_score: 78, cost_score: 70, transparency_score: 80, risk_level: "Low" },
  { slug: "grok-4-1",         utility_score: 85, privacy_score: 44, speed_score: 86, cost_score: 75, transparency_score: 50, risk_level: "High" },
  { slug: "qwen-3-6-plus",    utility_score: 82, privacy_score: 40, speed_score: 82, cost_score: 80, transparency_score: 46, risk_level: "High" },
  { slug: "kimi-k2-5",        utility_score: 80, privacy_score: 40, speed_score: 82, cost_score: 82, transparency_score: 43, risk_level: "High" },
  { slug: "me-bot",           utility_score: 66, privacy_score: 60, speed_score: 68, cost_score: 72, transparency_score: 58, risk_level: "Low" },
  { slug: "openclaw",         utility_score: 65, privacy_score: 66, speed_score: 68, cost_score: 70, transparency_score: 62, risk_level: "Low" },
  { slug: "openclaw-gateway", utility_score: 65, privacy_score: 66, speed_score: 68, cost_score: 70, transparency_score: 62, risk_level: "Low" },

  // ── Dev Tools ─────────────────────────────────────────────────────────────
  { slug: "cursor-3",    utility_score: 93, privacy_score: 65, speed_score: 88, cost_score: 68, transparency_score: 70, risk_level: "Low" },
  { slug: "windsurf",   utility_score: 86, privacy_score: 65, speed_score: 84, cost_score: 70, transparency_score: 68, risk_level: "Low" },
  { slug: "aider",      utility_score: 82, privacy_score: 80, speed_score: 78, cost_score: 88, transparency_score: 82, risk_level: "Low" },
  { slug: "replit-agent", utility_score: 80, privacy_score: 58, speed_score: 78, cost_score: 62, transparency_score: 65, risk_level: "Medium" },
  { slug: "bolt-new",   utility_score: 78, privacy_score: 58, speed_score: 75, cost_score: 65, transparency_score: 60, risk_level: "Medium" },
  { slug: "lovable",    utility_score: 78, privacy_score: 62, speed_score: 74, cost_score: 60, transparency_score: 60, status: "beta", risk_level: "Medium" },
  { slug: "base44",     utility_score: 72, privacy_score: 60, speed_score: 72, cost_score: 65, transparency_score: 60, risk_level: "Low" },
  { slug: "jdoodle-ai", utility_score: 72, privacy_score: 65, speed_score: 75, cost_score: 78, transparency_score: 65, risk_level: "Low" },
  { slug: "wavespeedai", utility_score: 72, privacy_score: 55, speed_score: 88, cost_score: 72, transparency_score: 58, risk_level: "Low" },

  // ── Research ─────────────────────────────────────────────────────────────
  { slug: "perplexity",     utility_score: 86, privacy_score: 60, speed_score: 92, cost_score: 82, transparency_score: 74, risk_level: "Low" },
  { slug: "notebooklm",    utility_score: 86, privacy_score: 58, speed_score: 82, cost_score: 90, transparency_score: 72, risk_level: "Low" },
  { slug: "consensus",     utility_score: 84, privacy_score: 72, speed_score: 80, cost_score: 75, transparency_score: 80, risk_level: "Low" },
  { slug: "elicit",        utility_score: 82, privacy_score: 72, speed_score: 78, cost_score: 78, transparency_score: 82, risk_level: "Low" },
  { slug: "scispace",      utility_score: 80, privacy_score: 65, speed_score: 78, cost_score: 72, transparency_score: 70, risk_level: "Low" },
  { slug: "humata",        utility_score: 75, privacy_score: 62, speed_score: 78, cost_score: 70, transparency_score: 65, risk_level: "Low" },
  { slug: "researchrabbit", utility_score: 78, privacy_score: 65, speed_score: 75, cost_score: 80, transparency_score: 68, risk_level: "Low" },
  { slug: "scholarai",     utility_score: 75, privacy_score: 65, speed_score: 75, cost_score: 72, transparency_score: 65, risk_level: "Low" },
  { slug: "nano-banana-pro", utility_score: 65, privacy_score: 62, speed_score: 68, cost_score: 70, transparency_score: 58, risk_level: "Low" },

  // ── Productivity / Writing ─────────────────────────────────────────────
  { slug: "gamma",         utility_score: 82, privacy_score: 60, speed_score: 85, cost_score: 70, transparency_score: 65, risk_level: "Low" },
  { slug: "wispr-flow",   utility_score: 78, privacy_score: 62, speed_score: 88, cost_score: 70, transparency_score: 65, risk_level: "Low" },
  { slug: "editgpt",      utility_score: 70, privacy_score: 58, speed_score: 72, cost_score: 65, transparency_score: 62, risk_level: "Low" },
  { slug: "elser-ai",     utility_score: 68, privacy_score: 62, speed_score: 70, cost_score: 65, transparency_score: 62, risk_level: "Low" },
  { slug: "goblin-tools", utility_score: 70, privacy_score: 72, speed_score: 75, cost_score: 94, transparency_score: 70, risk_level: "Low" },

  // ── Creative Writing ──────────────────────────────────────────────────
  { slug: "sudowrite",    utility_score: 80, privacy_score: 65, speed_score: 80, cost_score: 62, transparency_score: 68, risk_level: "Low" },
  { slug: "novelcrafter", utility_score: 78, privacy_score: 70, speed_score: 76, cost_score: 65, transparency_score: 72, risk_level: "Low" },

  // ── Image Gen ────────────────────────────────────────────────────────
  { slug: "flux-2",          utility_score: 88, privacy_score: 70, speed_score: 75, cost_score: 68, transparency_score: 72, risk_level: "Low" },
  { slug: "ideogram-3-0",   utility_score: 85, privacy_score: 62, speed_score: 78, cost_score: 72, transparency_score: 68, risk_level: "Low" },
  { slug: "recraft-v3",     utility_score: 83, privacy_score: 68, speed_score: 80, cost_score: 72, transparency_score: 68, risk_level: "Low" },
  { slug: "leonardo-ai",    utility_score: 82, privacy_score: 62, speed_score: 78, cost_score: 70, transparency_score: 65, risk_level: "Low" },
  { slug: "microsoft-designer", utility_score: 78, privacy_score: 54, speed_score: 82, cost_score: 80, transparency_score: 58, risk_level: "Medium" },
  { slug: "playground-ai",  utility_score: 52, privacy_score: 55, speed_score: 55, cost_score: 60, transparency_score: 45, status: "deprecated", deprecated_reason: "Platform shut down in 2024; succeeded by Ideogram and Recraft.", risk_level: "High" },

  // ── Video Gen ────────────────────────────────────────────────────────
  { slug: "luma-dream-machine", utility_score: 82, privacy_score: 60, speed_score: 70, cost_score: 58, transparency_score: 62, status: "rising", risk_level: "Low" },
  { slug: "hailuo-2-3",   utility_score: 80, privacy_score: 44, speed_score: 72, cost_score: 65, transparency_score: 44, risk_level: "High" },
  { slug: "kling-3-0",    utility_score: 82, privacy_score: 44, speed_score: 72, cost_score: 65, transparency_score: 44, risk_level: "High" },
  { slug: "pixverse",     utility_score: 78, privacy_score: 50, speed_score: 70, cost_score: 65, transparency_score: 52, risk_level: "High" },
  { slug: "vidu-q3",      utility_score: 75, privacy_score: 44, speed_score: 68, cost_score: 62, transparency_score: 44, risk_level: "High" },
  { slug: "seedance-2-0", utility_score: 76, privacy_score: 44, speed_score: 70, cost_score: 60, transparency_score: 44, risk_level: "High" },
  { slug: "wan-2-2",      utility_score: 70, privacy_score: 58, speed_score: 65, cost_score: 68, transparency_score: 55, risk_level: "Medium" },

  // ── Education ─────────────────────────────────────────────────────────
  { slug: "anki-ai-add-ons",  utility_score: 72, privacy_score: 76, speed_score: 72, cost_score: 84, transparency_score: 70, risk_level: "Low" },
  { slug: "quizlet-q-chat",   utility_score: 50, privacy_score: 50, speed_score: 58, cost_score: 62, transparency_score: 42, status: "deprecated", deprecated_reason: "Q-Chat feature discontinued by Quizlet in late 2023.", risk_level: "High" },
];

async function main() {
  console.log(`\n🔬 AIght Tool Score Seeder — ${SCORES.length} tools\n`);

  let ok = 0;
  let fail = 0;

  for (const row of SCORES) {
    const { slug, ...fields } = row;
    const { error } = await supabase
      .from("tools")
      .update(fields)
      .eq("slug", slug);

    if (error) {
      console.error(`  ✗ ${slug}: ${error.message}`);
      fail++;
    } else {
      const score = Math.round(
        (row.utility_score + row.privacy_score + row.speed_score + row.cost_score + row.transparency_score) / 5
      );
      console.log(`  ✓ ${slug.padEnd(26)} AIght ${score}`);
      ok++;
    }
  }

  console.log(`\n✅  Done — ${ok} updated, ${fail} failed.\n`);
}

main().catch((e) => { console.error(e); process.exit(1); });
