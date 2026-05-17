# Resend — newsletter welcome email

Wired up in Phase J. Newsletter signup at `app/actions/newsletter.ts` fires
the welcome email defined in `lib/email-templates/welcome.ts` after a
successful Supabase `subscribers` insert.

## Status today

- `RESEND_API_KEY` is set in `.env.local` (gitignored).
- `RESEND_FROM_EMAIL` defaults to `"AIght <onboarding@resend.dev>"` — Resend's
  sandbox sender. Works immediately, but emails will look transactional and
  may land in Promotions/Updates tabs.
- Fire-and-forget — if the send fails, the subscriber is still recorded.

## What you need to do (one-time, optional but recommended)

### 1. Verify the `aightai.in` domain in Resend

1. Log into the Resend dashboard.
2. **Domains → Add Domain → `aightai.in`**.
3. Copy the **DKIM, SPF, and (optional) MX** records Resend gives you.
4. Add those records in your domain registrar's DNS panel (Cloudflare,
   Namecheap, etc.).
5. Wait ~5–60 minutes for DNS propagation, then click **Verify** in
   Resend.

### 2. Switch the sender

Once verified, update `.env.local` and the Vercel project's environment
variables:

```bash
RESEND_FROM_EMAIL="Mankaran at AIght <hello@aightai.in>"
```

Redeploy. The welcome email will now land from `hello@aightai.in` and avoid
Promotions tab routing.

### 3. Add the production environment variable to Vercel

In the Vercel dashboard → AIght project → Settings → Environment Variables,
add both:

- `RESEND_API_KEY` (the same value as `.env.local`)
- `RESEND_FROM_EMAIL` (the value above once domain is verified)

Production won't send welcome emails until both are present.

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

## What's NOT wired yet (Phase K candidates)

- Weekly digest email — would be a Vercel cron route hitting `/api/digest`
  that pulls last-7-days of `/signal` posts + new tools and sends to all
  subscribers.
- Unsubscribe flow — currently the welcome email says "reply with
  unsubscribe" or email `hello@aightai.in`. Auto-handle this when Mankaran
  asks.
- Resend audience sync — pushing Supabase `subscribers` into a Resend
  Audience for native unsubscribe management.
