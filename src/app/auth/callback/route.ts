/**
 * /auth/callback — Exchanges a PKCE auth code for a user session.
 *
 * Supabase redirects here after:
 *   - Email confirmation (signup)
 *   - Password reset
 *   - Magic link sign-in
 *
 * The `code` query parameter is exchanged for a session which is stored in
 * cookies by the server client. The user is then forwarded to `next` (default /dashboard).
 */

import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/dashboard";

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            // Forward to the intended destination (may be an absolute URL for OAuth).
            const forwardUrl = next.startsWith("/") ? `${origin}${next}` : next;
            return NextResponse.redirect(forwardUrl);
        }
    }

    // Auth code exchange failed — redirect to login with an error flag.
    const loginUrl = new URL("/auth/login", origin);
    loginUrl.searchParams.set("error", "auth_callback_failed");
    return NextResponse.redirect(loginUrl);
}
