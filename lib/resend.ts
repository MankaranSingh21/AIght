import "server-only";
import { Resend } from "resend";

// Lazy singleton — avoids constructing the client at import time so build
// works even when RESEND_API_KEY isn't set (e.g. PR previews).
let _client: Resend | null = null;
let _attempted = false;

export function getResend(): Resend | null {
  if (_attempted) return _client;
  _attempted = true;
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  _client = new Resend(key);
  return _client;
}

// Default `from` — falls back to Resend's sandbox sender until the user
// verifies aightai.in in the Resend dashboard. See scripts/README-resend.md.
export const RESEND_FROM = process.env.RESEND_FROM_EMAIL ?? "AIght <onboarding@resend.dev>";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.aightai.in";
