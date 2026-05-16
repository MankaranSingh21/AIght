# Phase G — Migrate tool content from JSON to Supabase columns

This is the user-supervised migration that promotes the four seeded JSON
content files into proper Supabase columns. Phase F already shipped the UI;
this just changes where the data is read from.

## What's changing

Today, three files in `content/` carry per-tool editorial content:
- `aights-take.json` — one-line verdicts in Caveat font
- `tool-replaces.json` — "You can probably stop using…" lists
- `tool-human-notes.json` — "What X can't do" cards

Phase G adds **five DB columns** so this content lives next to the rest of
the tool data, and adds an optional sixth (`fields`, `screenshots`) that
Phase E flagged but never used.

| Column | Type | Source |
|---|---|---|
| `aights_take` | TEXT | from `content/aights-take.json` |
| `replaces` | JSONB | from `content/tool-replaces.json` |
| `human_note` | JSONB | from `content/tool-human-notes.json` |
| `fields` | TEXT[] | new — for field-compatibility tags (Phase H surface) |
| `screenshots` | TEXT[] | new — for tool detail gallery (Phase H surface) |

## Step-by-step

### 1. Apply the SQL migration

Open **Supabase Studio → SQL Editor → New query** and paste the contents of:

```
scripts/migration-007-tool-content-columns.sql
```

Run it. Safe to re-run (uses `IF NOT EXISTS`).

Verify with this query in the same panel:

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'tools'
  AND column_name IN ('aights_take','replaces','fields','screenshots','human_note')
ORDER BY column_name;
```

You should see all five rows back.

### 2. Run the backfill script

From the repo root (`Desktop/Claude_Projects/AIght`):

```bash
# Ensure .env.local has both keys:
#   NEXT_PUBLIC_SUPABASE_URL=...
#   SUPABASE_SERVICE_ROLE_KEY=...    ← service role, NOT the anon key

node scripts/backfill-tool-content.mjs
```

Expected output:

```
Backfilling 40+ tool slugs…
✓ chatgpt: aights_take, replaces, human_note
✓ perplexity: aights_take, replaces, human_note
…
Done. Updated: 42  ·  Skipped (no row): 0  ·  Failed: 0
```

If you see "Skipped (no row)" warnings, that's a slug in the JSON that
doesn't match a `tools.slug` in the DB — usually safe to ignore (or fix
the slug in the JSON file and re-run).

### 3. Switch the code to read from DB

Once the backfill is verified, **ping me in the next session** and I'll
do the code change in one commit:

- `lib/tool-mapping.ts` — drop the JSON import, read `t.aights_take` from the row
- `app/tool/[slug]/page.tsx` — drop both JSON imports, pull `replaces` + `human_note` from the row
- `utils/supabase/types.ts` — add the five new columns to the `Tool` type
- Delete the three JSON files

That commit is small (~50 lines) and idempotent. Until it lands, the site
keeps reading from JSON — no breakage either way.

## Rollback (if needed)

The migration is additive. To roll back:

```sql
ALTER TABLE public.tools
  DROP COLUMN IF EXISTS aights_take,
  DROP COLUMN IF EXISTS replaces,
  DROP COLUMN IF EXISTS fields,
  DROP COLUMN IF EXISTS screenshots,
  DROP COLUMN IF EXISTS human_note;
```

The JSON files in `content/` remain the canonical source until step 3
above is committed.

## Cost / safety notes

- Migration is metadata-only — no row rewrites, takes milliseconds even
  on a large `tools` table.
- Backfill is one UPDATE per seeded slug (~42 statements total). Should
  complete in under 10 seconds on Supabase free tier.
- No downtime. The current production code keeps working throughout.
- `human_note` is JSONB so you can query `WHERE human_note->>'essay' = 'taste'`
  later if you ever want filtering.
