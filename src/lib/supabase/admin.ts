/**
 * admin.ts — WorkProofolio Supabase admin (service-role) client.
 *
 * ⚠ SECURITY: This client bypasses Row Level Security entirely.
 * It MUST only ever be imported in:
 *   - Route Handlers  (app/api/[...]/route.ts)
 * - Server Actions('use server' functions)
    * - Edge functions(supabase / functions/**)
 *
 * The SUPABASE_SERVICE_ROLE_KEY env var intentionally has no NEXT_PUBLIC_ prefix
 * so it is never bundled into client JavaScript. Still, importing this module
 * in a Client Component would expose the key at build time via tree-shaking.
 * A runtime guard below catches accidental client-side imports in development.
 */

import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

if (typeof window !== "undefined") {
    throw new Error(
        "[WorkProofolio] createAdminClient() was called in a browser context. " +
        "This module must only be imported in Route Handlers or Server Actions."
    );
}

/**
 * Returns a Supabase client that uses the service_role key.
 * Bypasses all RLS policies — use with extreme caution.
 *
 * @throws If NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY are missing.
 */
export function createAdminClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        throw new Error(
            "NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must both be set " +
            "to use the admin client."
        );
    }

    return createClient<Database>(url, key, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}
