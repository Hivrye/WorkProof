/**
 * client.ts — WorkProofolio Supabase browser client.
 *
 * Uses @supabase/ssr's createBrowserClient which stores the session in cookies
 * (not localStorage), enabling the server to read the auth state via SSR.
 *
 * Import this in Client Components ("use client") only.
 * For Server Components and Route Handlers, use @/lib/supabase/server instead.
 */

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

/**
 * Returns true when NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
 * are both set. Use this guard before calling createClient() so the app
 * continues to work in pure-mock mode (no .env.local configured).
 */
export function isSupabaseConfigured(): boolean {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";
    return url.startsWith("https://") && key.length > 20;
}

/**
 * Creates (or reuses) a Supabase browser client with full TypeScript types.
 * createBrowserClient automatically deduplicates — calling this multiple times
 * returns the same underlying GoTrue client instance.
 *
 * @throws If Supabase env vars are not configured. Guard with isSupabaseConfigured().
 */
export function createClient() {
    if (!isSupabaseConfigured()) {
        throw new Error(
            "Supabase is not configured. " +
            "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local"
        );
    }
    return createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    );
}
