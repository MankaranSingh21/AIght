import { createClient } from "@supabase/supabase-js";

/**
 * Cookie-less anon Supabase client for public, cacheable reads (the tools
 * directory, homepage tool strip, etc.).
 *
 * Unlike the cookie-based server client in ./server.ts, this never calls
 * cookies(), so routes that use it stay statically generated / ISR-cacheable
 * (otherwise `export const revalidate` is silently ignored and every request
 * re-renders dynamically — the cause of the slow /tools TTFB). Uses the anon
 * key, so it respects RLS — only for data that's public-readable.
 */
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}
