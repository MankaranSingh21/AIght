# "Tools like this" — embedding setup

The `<RelatedTools>` component on each `/tool/<slug>` page reads pre-computed
embeddings via Postgres cosine similarity. **Zero runtime AI calls** —
embeddings are generated offline by `scripts/embed-tools.ts` and stored in
`tools.embedding`.

The component renders nothing until both steps below are done. Safe to ship
before either.

## One-time setup

### Step 1 — Apply migration 011 in Supabase

Open the [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql)
and paste the contents of `migrations/011_pgvector_embeddings.sql`. Click Run.

This:
- Enables the `pgvector` extension.
- Adds the `embedding vector(1536)` column to `tools`.
- Creates an `ivfflat` index for fast nearest-neighbour search.
- Defines `match_tools_for_slug(query_slug, match_count)` — the function the
  component calls at request time.

Idempotent — safe to re-run.

### Step 2 — Set `OPENAI_API_KEY` locally

Add to `.env.local`:

```
OPENAI_API_KEY=sk-...
```

This is **only used by the offline script**, not in production. Don't bother
adding it to Vercel.

### Step 3 — Embed all tools

```bash
# Dry-run first to see what would be embedded
npx tsx --env-file=.env.local scripts/embed-tools.ts

# Apply — sends each tool's descriptor to OpenAI and writes the vector
npx tsx --env-file=.env.local scripts/embed-tools.ts --apply
```

Cost: ~60 tools × ~120 tokens each ≈ 7200 tokens at $0.02/1M for
`text-embedding-3-small` → **~$0.00015 total**. Negligible.

## Per-tool re-embed

If you edit a tool's `aights_take` or `vibe_description`, re-embed just
that row:

```bash
npx tsx --env-file=.env.local scripts/embed-tools.ts --apply --only=claude
```

## When to re-run

- After adding a new tool (embed the slug, neighbours pick it up automatically)
- After editing any tool's `name`, `vibe_description`, `tags`, `category`, or `aights_take` (re-embed that slug)
- After bumping the embedding model (re-embed everything)

The script is idempotent — running it twice produces identical vectors.

## Cost expectations as the archive grows

| Catalog size | Approx. tokens | Approx. cost |
|---|---|---|
| 60 tools | 7 200 | $0.00015 |
| 200 tools | 24 000 | $0.0005 |
| 1 000 tools | 120 000 | $0.0024 |

The cost is one-time per re-embed, not per visitor. Each visitor only triggers
a cosine lookup, which is pure Postgres.
