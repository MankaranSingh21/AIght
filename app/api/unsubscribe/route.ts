import { NextResponse } from "next/server";
import { createServiceClient } from "@/utils/supabase/service";
import { verifyUnsubscribeToken } from "@/lib/unsubscribe-token";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// One-click unsubscribe handler. Verifies the HMAC token, deletes the row
// from `subscribers`, and redirects to the confirmation page with a status.
//
// Status codes (in the redirect URL):
//   ok       — email removed (or wasn't present to begin with)
//   invalid  — missing/bad token, or UNSUBSCRIBE_SECRET unset
//   error    — Supabase delete failed
export async function GET(request: Request) {
  const url = new URL(request.url);
  const redirect = (status: "ok" | "invalid" | "error") =>
    NextResponse.redirect(new URL(`/unsubscribe?status=${status}`, url));

  const token = url.searchParams.get("token");
  if (!token) return redirect("invalid");

  const email = verifyUnsubscribeToken(token);
  if (!email) return redirect("invalid");

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("subscribers")
    .delete()
    .eq("email", email);

  if (error) {
    console.error("[unsubscribe] delete error:", error.message);
    return redirect("error");
  }

  return redirect("ok");
}
