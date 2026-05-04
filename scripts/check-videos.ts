import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

async function main() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { data } = await supabase.from('tools').select('slug, name, category, video_url').order('category');
  for (const t of (data ?? [])) {
    const s = t.video_url ? '✓' : '✗';
    console.log(`${s}  ${(t.category ?? '').padEnd(16)} ${t.slug}`);
  }
  const missing = (data ?? []).filter((t: { video_url: string | null }) => !t.video_url);
  console.log(`\nMissing: ${missing.length} / ${data?.length}`);
}
main().catch(console.error);
