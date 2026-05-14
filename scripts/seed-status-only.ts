/**
 * seed-status-only.ts — updates tool status and deprecated flags.
 * Runs against existing schema (no score columns needed).
 */
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const STATUS_UPDATES: { slug: string; status: string; deprecated_reason?: string }[] = [
  // Rising tools
  { slug: "luma-dream-machine", status: "rising" },
  { slug: "deepseek", status: "rising" },
  { slug: "windsurf", status: "rising" },
  { slug: "flux-2", status: "rising" },
  { slug: "ideogram-3-0", status: "rising" },
  { slug: "hailuo-2-3", status: "rising" },
  { slug: "kling-3-0", status: "rising" },
  // Beta / experimental
  { slug: "lovable", status: "beta" },
  { slug: "bolt-new", status: "beta" },
  // Deprecated
  { slug: "quizlet-q-chat", status: "deprecated", deprecated_reason: "Feature discontinued by Quizlet in 2024" },
  { slug: "playground-ai", status: "deprecated", deprecated_reason: "Replaced by Ideogram, Recraft, and Flux as preferred image generation alternatives" },
];

async function main() {
  let updated = 0, failed = 0;
  for (const { slug, status, deprecated_reason } of STATUS_UPDATES) {
    const fields: Record<string, string> = { status };
    if (deprecated_reason) fields.deprecated_reason = deprecated_reason;
    const { error } = await supabase.from("tools").update(fields).eq("slug", slug);
    if (error) {
      console.log(`  ✗ ${slug}: ${error.message}`);
      failed++;
    } else {
      console.log(`  ✓ ${slug} → ${status}`);
      updated++;
    }
  }
  console.log(`\n✅  Done — ${updated} updated, ${failed} failed.`);
}

main();
