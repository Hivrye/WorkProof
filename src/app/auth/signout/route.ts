/**
 * /auth/signout — Signs the current user out of Supabase and redirects to login.
 *
 * Use as a form action (POST) to avoid CSRF via links:
 *
 *   <form action="/auth/signout" method="POST">
 *     <button type="submit">Sign out</button>
 *   </form>
 */

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const supabase = await createClient();
    await supabase.auth.signOut();

    // Invalidate all cached data so the next page load reflects signed-out state.
    revalidatePath("/", "layout");

    return NextResponse.redirect(new URL("/auth/login", req.url));
}
