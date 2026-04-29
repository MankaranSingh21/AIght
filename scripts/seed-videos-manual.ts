import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const videos: { slug: string; url: string }[] = [
  { slug: 'n8n',               url: 'https://www.youtube.com/watch?v=EwDAkZ7LT64' },
  { slug: 'canva-magic-studio', url: 'https://www.youtube.com/watch?v=h_smbWrwkRg' },
  { slug: 'tome',              url: 'https://www.youtube.com/watch?v=wnGlF0OhL6I' },
  { slug: 'fathom',            url: 'https://www.youtube.com/watch?v=PWdlX0XBPRM' },
  { slug: 'runway',            url: 'https://www.youtube.com/watch?v=hk8l3ISfwRM' },
];

async function main() {
  for (const { slug, url } of videos) {
    const { error } = await supabase.from('tools').update({ video_url: url }).eq('slug', slug);
    console.log(error ? `✗ ${slug}: ${error.message}` : `✓ ${slug}`);
  }
}
main().catch(console.error);
