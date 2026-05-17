import { NextResponse } from "next/server";
import { createServiceClient } from "@/utils/supabase/service";
import { getAllConcepts } from "@/lib/learn";
import { sendDigestEmail, type DigestItem } from "@/lib/email-templates/digest";

// Weekly digest. Triggered by Vercel Cron (see vercel.json).
// Vercel sends an `Authorization: Bearer <CRON_SECRET>` header on cron
// invocations — reject anything else.
//
// Manual test query params (require auth too):
//   ?force=1  — ignore the 7-day window, pick the latest 5 concepts + 5 tools
//   ?dry=1    — build the digest but don't send; return the items it would send
//   ?to=x     — send only to this address (skip the subscribers table)

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
  const url = new URL(request.url);
  const force = url.searchParams.get("force") === "1";
  const dry = url.searchParams.get("dry") === "1";
  const toOverride = url.searchParams.get("to");

  // --- Auth ---
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      console.warn("[digest] unauthorized: bad or missing bearer");
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  } else {
    console.warn("[digest] CRON_SECRET not set — route is open");
  }

  const now = Date.now();
  console.log(
    `[digest] start now=${new Date(now).toISOString()} force=${force} dry=${dry} to=${toOverride ?? "<subscribers>"}`
  );

  // --- Build the digest items ---
  const items: DigestItem[] = [];

  const allConcepts = getAllConcepts();
  const conceptCandidates = force
    ? [...allConcepts]
        .sort((a, b) =>
          (b.lastUpdated ?? b.publishedDate).localeCompare(
            a.lastUpdated ?? a.publishedDate
          )
        )
        .slice(0, 5)
    : allConcepts.filter((c) =>
        withinWindow(c.lastUpdated ?? c.publishedDate, now)
      );
  for (const c of conceptCandidates) {
    items.push({
      kind: "concept",
      title: c.title,
      tagline: c.tagline,
      href: `/learn/${c.slug}`,
    });
  }
  console.log(
    `[digest] concepts: total=${allConcepts.length} matched=${conceptCandidates.length}`
  );

  // New tools (created_at within the window, or latest 5 in force mode)
  const supabase = createServiceClient();
  const toolsQuery = supabase
    .from("tools")
    .select("slug,name,tagline,created_at")
    .order("created_at", { ascending: false })
    .limit(force ? 5 : 6);
  const { data: tools, error: toolsErr } = force
    ? await toolsQuery
    : await toolsQuery.gte(
        "created_at",
        new Date(now - WINDOW_DAYS * 24 * 60 * 60 * 1000).toISOString()
      );

  if (toolsErr) {
    console.error("[digest] tools fetch error:", toolsErr.message);
  }

  for (const t of tools ?? []) {
    items.push({
      kind: "tool",
      title: t.name,
      tagline: t.tagline ?? "",
      href: `/tool/${t.slug}`,
    });
  }
  console.log(`[digest] tools matched=${tools?.length ?? 0}`);

  if (!items.length) {
    console.log("[digest] no items this week — skipping");
    return NextResponse.json({ skipped: "no items this week" });
  }

  // --- Recipient list ---
  let recipients: string[] = [];
  if (toOverride) {
    recipients = [toOverride];
  } else {
    const { data: subs, error: subsErr } = await supabase
      .from("subscribers")
      .select("email");
    if (subsErr) {
      console.error("[digest] subscribers fetch error:", subsErr.message);
      return NextResponse.json(
        { error: "subscribers fetch failed", detail: subsErr.message },
        { status: 500 }
      );
    }
    recipients = (subs ?? []).map((s) => s.email).filter(Boolean);
  }
  console.log(`[digest] recipients=${recipients.length}`);

  if (dry) {
    console.log("[digest] dry-run — not sending");
    return NextResponse.json({
      dry: true,
      items,
      recipientCount: recipients.length,
    });
  }

  // --- Send. Sequential with a tiny delay to stay within Resend rate limits. ---
  let sent = 0;
  let failed = 0;
  for (const email of recipients) {
    const ok = await sendDigestEmail(email, items);
    if (ok) sent++;
    else failed++;
    await new Promise((r) => setTimeout(r, 120));
  }
  console.log(`[digest] done sent=${sent} failed=${failed}`);

  return NextResponse.json({
    items: items.length,
    recipients: recipients.length,
    sent,
    failed,
  });
}
