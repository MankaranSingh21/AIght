import { NextResponse } from "next/server";
import { createServiceClient } from "@/utils/supabase/service";
import { getAllConcepts } from "@/lib/learn";
import { sendDigestEmail, type DigestItem } from "@/lib/email-templates/digest";

// Weekly digest. Triggered by Vercel Cron (see vercel.json).
// Vercel sends an `Authorization: Bearer <CRON_SECRET>` header on cron
// invocations — reject anything else.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WINDOW_DAYS = 7;

function withinWindow(iso: string | undefined, now: number): boolean {
  if (!iso) return false;
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return false;
  return now - t <= WINDOW_DAYS * 24 * 60 * 60 * 1000;
}

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  const now = Date.now();

  // --- Build the digest items ---
  const items: DigestItem[] = [];

  // New concepts (lastUpdated within the window)
  for (const c of getAllConcepts()) {
    if (withinWindow(c.lastUpdated ?? c.publishedDate, now)) {
      items.push({
        kind: "concept",
        title: c.title,
        tagline: c.tagline,
        href: `/learn/${c.slug}`,
      });
    }
  }

  // New tools (created_at within the window)
  const supabase = createServiceClient();
  const { data: tools } = await supabase
    .from("tools")
    .select("slug,name,tagline,created_at")
    .gte(
      "created_at",
      new Date(now - WINDOW_DAYS * 24 * 60 * 60 * 1000).toISOString()
    )
    .order("created_at", { ascending: false })
    .limit(6);

  for (const t of tools ?? []) {
    items.push({
      kind: "tool",
      title: t.name,
      tagline: t.tagline ?? "",
      href: `/tool/${t.slug}`,
    });
  }

  if (!items.length) {
    return NextResponse.json({ skipped: "no items this week" });
  }

  // --- Fetch subscribers ---
  const { data: subs, error: subsErr } = await supabase
    .from("subscribers")
    .select("email");

  if (subsErr) {
    return NextResponse.json(
      { error: "subscribers fetch failed", detail: subsErr.message },
      { status: 500 }
    );
  }

  // --- Send. Sequential with a tiny delay to stay within Resend rate limits. ---
  let sent = 0;
  let failed = 0;
  for (const s of subs ?? []) {
    const ok = await sendDigestEmail(s.email, items);
    if (ok) sent++;
    else failed++;
    await new Promise((r) => setTimeout(r, 120));
  }

  return NextResponse.json({
    items: items.length,
    subscribers: subs?.length ?? 0,
    sent,
    failed,
  });
}
