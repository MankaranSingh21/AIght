# Adding tool screenshots

The gallery + lightbox already ship live (see `components/ToolScreenshots.tsx`).
Renders nothing until at least one URL exists in `tools.screenshots`. To turn
it on for a tool, do this once per tool:

## One-time Supabase setup (only the first tool)

1. Open the Supabase dashboard → **Storage**.
2. Create a new bucket named `tool-screenshots`.
3. Make it **Public** (so `next/image` can hot-link without signed URLs).
4. (Optional, recommended) set max file size = 2 MB, allowed MIME types = `image/png, image/jpeg, image/webp`.

`next.config.mjs` is already allowlisted for
`pfxjaqcclwogedsxtman.supabase.co/storage/v1/object/public/**`.

## Per-tool flow

1. Resize screenshots to ≤ 1600 px wide, save as `.webp` or `.jpg` ~150 KB max.
2. Upload to `tool-screenshots/<slug>/01.webp`, `02.webp`, etc. (1–3 images is the sweet spot).
3. Copy the **Public URL** for each (right-click → Copy URL).
4. In Supabase **Table Editor** → `tools` → find the tool row → edit `screenshots` column → paste the URLs as a JSON array:

```json
[
  "https://pfxjaqcclwogedsxtman.supabase.co/storage/v1/object/public/tool-screenshots/claude/01.webp",
  "https://pfxjaqcclwogedsxtman.supabase.co/storage/v1/object/public/tool-screenshots/claude/02.webp"
]
```

5. Save the row. The "Screenshots" section appears at the bottom of `/tool/<slug>` within an hour (ISR `revalidate = 3600`) — or trigger an instant revalidate by editing any other field on the same row.

## What the user sees

- **1 image** → full-width 16:10 thumbnail
- **2 images** → side-by-side
- **3+** → responsive grid (`minmax(220px, 1fr)`)
- Click any thumbnail → lightbox overlay (Escape or backdrop click to close, ← / → to navigate, dot indicators at the bottom)

## When you want to remove

Empty the array (`[]` or `null`) on the tool row and the section disappears.
