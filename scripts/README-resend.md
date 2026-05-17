# Resend — newsletter welcome email

Wired up in Phase J. Newsletter signup at `app/actions/newsletter.ts` fires
the welcome email defined in `lib/email-templates/welcome.ts` after a
successful Supabase `subscribers` insert.

## Status today

- `aightai.in` is **verified** in Resend (DKIM/SPF/MX live in GoDaddy DNS).
- `RESEND_API_KEY` is set in `.env.local` (gitignored) and on Vercel.
- `RESEND_FROM` defaults to `"Mankaran at AIght <hello@aightai.in>"` directly
  in `lib/resend.ts` — no env var needed unless you want to override per env.
- Fire-and-forget — if the send fails, the subscriber is still recorded.

## Required Vercel env vars

In the Vercel dashboard → AIght project → Settings → Environment Variables:

- `RESEND_API_KEY` — Resend dashboard → API Keys
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase → Project Settings → API → service_role
- `CRON_SECRET` — any long random string (used to auth `/api/digest` cron)
- `RESEND_FROM_EMAIL` — *optional*; only set if you want to override
  the default `hello@aightai.in` sender per environment.

## Rate-limit reality on free tier

- Resend free tier: **100 emails/day**, 3,000/month, 1 verified domain.
- For an AIght-sized list that's plenty for welcome + a weekly digest of
  ~hundreds of subscribers. Upgrade when you cross that.

## Testing the send

```bash
# Local
npm run dev
# In the dev preview, go to / and submit a fresh email in the newsletter form.
# Within ~10s an email should arrive at that address.
```

If nothing arrives:
1. Check `.env.local` has `RESEND_API_KEY=re_...` (no quotes around the value).
2. Check the dev server's stderr for `[sendWelcomeEmail] resend error:` lines.
3. Confirm the address isn't bouncing — Resend shows recent sends in the
   dashboard's **Emails** tab.

## What's wired in Phase K

- **Weekly digest** — `app/api/digest/route.ts` + `vercel.json` cron at
  `0 14 * * 1` (Mondays 14:00 UTC). Pulls concepts updated in the last 7
  days + tools created in the last 7 days. If nothing changed, the route
  returns `{ skipped: "no items this week" }` and no email goes out.
  Authed via `CRON_SECRET` bearer header.

## What's still NOT wired

- Unsubscribe flow — currently the welcome + digest emails say "reply
  with unsubscribe" or email `hello@aightai.in`. Auto-handle this when
  the list grows enough to justify it.
- Resend audience sync — pushing Supabase `subscribers` into a Resend
  Audience for native unsubscribe management + sender reputation tracking.
