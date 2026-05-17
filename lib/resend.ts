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

// Default `from` — aightai.in is verified in Resend (DKIM/SPF pass). Override
// via RESEND_FROM_EMAIL if you ever need to switch sender identity per env.
export const RESEND_FROM =
  process.env.RESEND_FROM_EMAIL ?? "Mankaran at AIght <hello@aightai.in>";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.aightai.in";
