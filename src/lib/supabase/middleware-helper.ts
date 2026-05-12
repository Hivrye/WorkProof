/**
 * middleware-helper.ts — Session refresh + route protection for WorkProof.
 *
 * Called by src/middleware.ts on every non-static request.
 * Responsibilities:
 *   1. Refresh the Supabase auth session cookie so it never expires silently.
 *   2. Redirect unauthenticated users away from protected routes → /auth/login.
 *   3. Redirect authenticated users away from /auth/* routes → /dashboard.
 *
 * When Supabase env vars are not configured (mock-data mode), the function
 * returns a plain next() response so the app still works without a database.
 */

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Routes that require an authenticated session.
const PROTECTED_PATHS = [
    "/dashboard",
    "/submit",
    "/challenges",
    "/tracks",
    "/settings",
    "/employer-view",
    "/bootcamp",
    "/onboarding",
];

function isProtectedPath(pathname: string): boolean {
    return PROTECTED_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export async function updateSession(request: NextRequest): Promise<NextResponse> {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

    // If Supabase is not configured, skip auth checks entirely.
    if (!url.startsWith("https://") || key.length < 20) {
        return NextResponse.next({ request });
    }

    // Build a mutable response so cookie mutations are forwarded.
    let response = NextResponse.next({ request });

    const supabase = createServerClient(url, key, {
        cookies: {
            getAll() {
                return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
                // Mutate the request cookies first (required by @supabase/ssr).
                cookiesToSet.forEach(({ name, value }) =>
                    request.cookies.set(name, value)
                );
                // Rebuild the response so mutated cookies are forwarded to the browser.
                response = NextResponse.next({ request });
                cookiesToSet.forEach(({ name, value, options }) =>
                    response.cookies.set(name, value, options)
                );
            },
        },
    });

    // IMPORTANT: Do not write any logic between createServerClient and
    // supabase.auth.getUser(). Even a single await in between can break
    // session refresh and cause random sign-outs.
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { pathname } = request.nextUrl;

    // Unauthenticated → redirect to login, preserving the intended destination.
    if (!user && isProtectedPath(pathname)) {
        const loginUrl = new URL("/auth/login", request.url);
        loginUrl.searchParams.set("next", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Authenticated → skip auth UI pages (but allow API routes like /auth/signout and /auth/callback).
    const authUiPaths = ["/auth/login", "/auth/signup", "/auth/forgot-password", "/auth/reset-password"];
    if (user && authUiPaths.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return response;
}
