import "server-only";
import crypto from "crypto";

/**
 * One-click unsubscribe tokens for newsletter digest emails.
 *
 * Design: token = base64url(`${email}:${hmac_sha256(email, SECRET)}`).
 * The separator is `:` because it's banned in email addresses (RFC 5321) —
 * avoids any chance of an email-with-dots colliding with the splitter.
 * Stateless — no DB row needed; revocation is implicit when SECRET rotates.
 *
 * Set `UNSUBSCRIBE_SECRET` in Vercel env vars to a 32+ byte hex string
 * (e.g. `openssl rand -hex 32`).
 */

function getSecret(): string | null {
  const s = process.env.UNSUBSCRIBE_SECRET;
  return s && s.length >= 32 ? s : null;
}

function hmac(email: string, secret: string): string {
  return crypto
    .createHmac("sha256", secret)
    .update(email.toLowerCase())
    .digest("hex");
}

/**
 * Sign a token for `email`. Returns `null` if UNSUBSCRIBE_SECRET is unset —
 * callers should fall back to a "reply unsubscribe" instruction in that case.
 */
export function signUnsubscribeToken(email: string): string | null {
  const secret = getSecret();
  if (!secret) return null;
  const payload = `${email.toLowerCase()}:${hmac(email, secret)}`;
  return Buffer.from(payload, "utf-8").toString("base64url");
}

/**
 * Verify a token. Returns the decoded email on success, `null` otherwise.
 * Uses timing-safe compare to avoid HMAC leakage.
 */
export function verifyUnsubscribeToken(token: string): string | null {
  const secret = getSecret();
  if (!secret) return null;
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    // `:` is RFC-banned in email, so split on the only `:` in the payload.
    const sep = decoded.indexOf(":");
    if (sep < 0) return null;
    const email = decoded.slice(0, sep);
    const sig = decoded.slice(sep + 1);
    if (!email || !/^[a-f0-9]{64}$/.test(sig)) return null;
    const expected = hmac(email, secret);
    const a = Buffer.from(sig, "hex");
    const b = Buffer.from(expected, "hex");
    if (a.length !== b.length) return null;
    if (!crypto.timingSafeEqual(a, b)) return null;
    return email;
  } catch {
    return null;
  }
}

/**
 * Build a full unsubscribe URL or return `null` if signing is unavailable.
 */
export function buildUnsubscribeUrl(email: string, siteUrl: string): string | null {
  const token = signUnsubscribeToken(email);
  if (!token) return null;
  return `${siteUrl}/api/unsubscribe?token=${encodeURIComponent(token)}`;
}
