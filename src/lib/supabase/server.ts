/**
 * server.ts — WorkProof Supabase server-side client.
 *
 * Import this in Server Components, Route Handlers, and Server Actions.
 * It reads / writes auth session cookies via next/headers so that SSR
 * always has the current user context without an extra client round-trip.
 *
 * The function is async because cookies() is async in Next.js 15+.
 *
 * NEVER import this file in "use client" modules.
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./types";

export async function createClient() {
    const cookieStore = await cookies();

    return createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // Called from a Server Component — session refresh is
                        // handled by middleware, so this error is safe to ignore.
                    }
                },
            },
        }
    );
}
