/**
 * proxy.ts — WorkProof edge proxy (Next.js 16+).
 *
 * Runs on every non-static request to:
 *   1. Refresh the Supabase auth session cookie (prevents silent expiry).
 *   2. Protect authenticated-only routes (redirects to /auth/login).
 *   3. Redirect signed-in users away from /auth/* pages.
 *
 * When NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are
 * not set (mock-data / demo mode), the proxy is a no-op and all routes pass through.
 */

import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware-helper";

export async function proxy(request: NextRequest) {
    return await updateSession(request);
}

export const config = {
    matcher: [
        /*
         * Run on all routes except:
         *  - Next.js internals (_next/static, _next/image)
         *  - Static files (favicon, images, fonts)
         */
        "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
