/**
 * audit-tool-scores.ts
 *
 * Read-only. Diffs the Supabase `tools` table against the SCORES array in
 * seed-tool-scores.ts and reports:
 *   1. DB tools with no entry in SCORES (will stay at zero)
 *   2. SCORES entries whose slug matches no DB row (silent no-op on seed)
 *   3. DB tools still carrying all-zero scores
 *
 * Run: npx tsx scripts/audit-tool-scores.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import path from "path";
import { SCORES } from "./seed-tool-scores";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data: tools, error } = await supabase
    .from("tools")
    .select("slug, name, category, utility_score, privacy_score, speed_score, cost_score, transparency_score")
    .order("slug");

  if (error || !tools) {
    console.error(`❌ Could not read tools: ${error?.message}`);
    process.exit(1);
  }

  const dbSlugs = new Set(tools.map((t) => t.slug));
  const seedSlugs = new Set(SCORES.map((s) => s.slug));

  const missingFromSeed = tools.filter((t) => !seedSlugs.has(t.slug));
  const orphanSeedRows = SCORES.filter((s) => !dbSlugs.has(s.slug));
  const allZero = tools.filter(
    (t) =>
      !t.utility_score && !t.privacy_score && !t.speed_score && !t.cost_score && !t.transparency_score
  );

  console.log(`\n🔎 Score audit — ${tools.length} tools in DB, ${SCORES.length} rows in seed\n`);

  console.log(`── DB tools missing from seed (${missingFromSeed.length}) ──`);
  for (const t of missingFromSeed) console.log(`  ${t.slug.padEnd(28)} ${t.name}  [${t.category}]`);

  console.log(`\n── Seed rows matching no DB slug (${orphanSeedRows.length}) ──`);
  for (const s of orphanSeedRows) console.log(`  ${s.slug}`);

  console.log(`\n── DB tools with all-zero scores (${allZero.length}) ──`);
  for (const t of allZero) console.log(`  ${t.slug.padEnd(28)} ${t.name}`);

  console.log("");
}

main().catch((e) => { console.error(e); process.exit(1); });
