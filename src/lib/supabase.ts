/**
 * supabase.ts — Proofolio Supabase client placeholder.
 *
 * ─── ACTIVATION STEPS ────────────────────────────────────────────────────────
 *  1. Install the client:
 *       npm install @supabase/supabase-js
 *
 *  2. Add the following to your .env.local (never commit this file):
 *       NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
 *       NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
 *
 *  3. Uncomment the import and createClient call below, remove the stub.
 *
 *  4. Replace storage.get / storage.set calls in each store with the
 *     corresponding Supabase query. See src/lib/storage.ts for migration notes.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * SECURITY NOTES:
 *  - Only ever expose the `anon` key on the client side (it is safe by design).
 *  - The `service_role` key must NEVER be imported in client-side code.
 *  - All sensitive operations (admin actions, bulk inserts) must run server-side
 *    via Route Handlers or Server Actions using the service_role key.
 *  - Row-Level Security (RLS) must be enabled on every table. See SUPABASE_SCHEMA.md.
 */

// ─── Placeholder types (remove after installing @supabase/supabase-js) ───────

/**
 * Minimal typed stub that mirrors the shape code throughout the app will use.
 * Once the real client is wired up this interface is replaced by the inferred
 * type from `createClient<Database>()`.
 */
export interface SupabaseClient {
    auth: {
        /** Sign in with email + password */
        signInWithPassword(credentials: { email: string; password: string }): Promise<unknown>;
        /** Sign up a new user */
        signUp(credentials: { email: string; password: string; options?: { data?: Record<string, unknown> } }): Promise<unknown>;
        /** Sign out current session */
        signOut(): Promise<unknown>;
        /** Get current session */
        getSession(): Promise<unknown>;
        /** Get current user */
        getUser(): Promise<unknown>;
        /** Subscribe to auth state changes */
        onAuthStateChange(callback: (event: string, session: unknown) => void): { data: { subscription: { unsubscribe(): void } } };
    };
    from(table: string): {
        select(columns?: string): unknown;
        insert(values: unknown): unknown;
        update(values: unknown): unknown;
        upsert(values: unknown): unknown;
        delete(): unknown;
    };
    rpc(fn: string, params?: Record<string, unknown>): Promise<unknown>;
}

// ─── Environment variables ────────────────────────────────────────────────────

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

const keysPresent = SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;

// ─── Client ──────────────────────────────────────────────────────────────────

/* ── ACTIVATE THIS BLOCK when @supabase/supabase-js is installed ──
 *
 * import { createClient } from "@supabase/supabase-js";
 * import type { Database } from "@/types/database";
 *
 * export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
 *     auth: {
 *         persistSession: true,
 *         autoRefreshToken: true,
 *         detectSessionInUrl: true,
 *     },
 * });
 *
 * ─── Then delete the stub below ─────────────────────────────────────────── */

/**
 * Stub client — no-ops all calls and warns in development when keys are missing.
 * Replace with the real `createClient` call above once the package is installed.
 */
function createStubClient(): SupabaseClient {
    const warn = (method: string) => {
        if (process.env.NODE_ENV !== "production") {
            console.warn(
                `[Proofolio] supabase.${method}() called but Supabase is not configured.\n` +
                `Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.`
            );
        }
    };

    const noopQuery = () => ({
        select: () => noopQuery(),
        insert: () => noopQuery(),
        update: () => noopQuery(),
        upsert: () => noopQuery(),
        delete: () => noopQuery(),
        eq: () => noopQuery(),
        single: () => Promise.resolve({ data: null, error: new Error("Supabase not configured") }),
        then: (resolve: (v: unknown) => unknown) =>
            Promise.resolve({ data: null, error: new Error("Supabase not configured") }).then(resolve),
    });

    return {
        auth: {
            signInWithPassword: async () => { warn("auth.signInWithPassword"); return { data: null, error: new Error("Supabase not configured") }; },
            signUp: async () => { warn("auth.signUp"); return { data: null, error: new Error("Supabase not configured") }; },
            signOut: async () => { warn("auth.signOut"); return { error: null }; },
            getSession: async () => { warn("auth.getSession"); return { data: { session: null }, error: null }; },
            getUser: async () => { warn("auth.getUser"); return { data: { user: null }, error: null }; },
            onAuthStateChange: () => {
                warn("auth.onAuthStateChange");
                return { data: { subscription: { unsubscribe: () => undefined } } };
            },
        },
        from: (table: string) => {
            warn(`from("${table}")`);
            return noopQuery() as ReturnType<SupabaseClient["from"]>;
        },
        rpc: async (fn: string) => {
            warn(`rpc("${fn}")`);
            return { data: null, error: new Error("Supabase not configured") };
        },
    };
}

export const supabase: SupabaseClient = keysPresent
    ? (() => {
        // Real client would be created here — keys present but package not yet installed.
        // Once @supabase/supabase-js is installed, replace this branch with createClient().
        console.warn("[Proofolio] Supabase keys found but @supabase/supabase-js is not installed. Run: npm install @supabase/supabase-js");
        return createStubClient();
    })()
    : createStubClient();

// ─── Auth helpers ─────────────────────────────────────────────────────────────
//  These thin wrappers centralise error handling so individual components
//  don't need to know whether we are in stub or live mode.

/**
 * Sign in with email + password.
 *
 * CONNECT TO: auth.users (managed by Supabase Auth)
 */
export async function signIn(email: string, password: string) {
    return supabase.auth.signInWithPassword({ email, password });
}

/**
 * Register a new user. After sign-up, a trigger creates a row in `profiles`.
 *
 * CONNECT TO: auth.users → trigger → public.profiles (INSERT)
 */
export async function signUp(email: string, password: string, displayName: string) {
    return supabase.auth.signUp({ email, password, options: { data: { display_name: displayName } } });
}

/**
 * Sign out and clear the local session.
 */
export async function signOut() {
    return supabase.auth.signOut();
}

/**
 * Get the current authenticated user (server-safe).
 *
 * CONNECT TO: auth.users
 */
export async function getUser() {
    return supabase.auth.getUser();
}

// ─── Table helpers (stubs showing intended query patterns) ────────────────────

/**
 * Fetch a public profile by username slug.
 *
 * CONNECT TO: public.profiles WHERE username = ?
 * RLS: Anyone can read rows where is_public = true.
 */
export async function getProfileByUsername(_username: string) {
    // TODO: return supabase.from("profiles").select("*, proof_scores(*)").eq("username", username).eq("is_public", true).single();
    return { data: null, error: new Error("Supabase not configured") };
}

/**
 * Fetch all completed submissions for a given user.
 *
 * CONNECT TO: public.submissions WHERE user_id = ? AND status = 'completed'
 * RLS: User can read own rows. Employers can read rows of public profiles.
 */
export async function getSubmissionsByUser(_userId: string) {
    // TODO: return supabase.from("submissions").select("*, challenges(title, track_id, difficulty)").eq("user_id", userId).eq("status", "completed").order("submitted_at", { ascending: false });
    return { data: null, error: new Error("Supabase not configured") };
}

/**
 * Upsert the proof score for a user (typically called server-side after scoring).
 *
 * CONNECT TO: public.proof_scores ON CONFLICT (user_id) DO UPDATE
 * RLS: Only the score computation service_role can upsert.
 */
export async function upsertProofScore(_userId: string, _score: Record<string, number>) {
    // TODO: return supabase.from("proof_scores").upsert({ user_id: userId, ...score, computed_at: new Date().toISOString() });
    return { data: null, error: new Error("Supabase not configured") };
}

/**
 * Log an activity event (challenge started, submission made, etc.).
 *
 * CONNECT TO: public.activity_events (INSERT)
 * RLS: Users can insert and read their own events.
 */
export async function logActivity(_userId: string, _event: { type: string; title: string; description: string; metadata?: Record<string, unknown> }) {
    // TODO: return supabase.from("activity_events").insert({ user_id: userId, ...event });
    return { data: null, error: new Error("Supabase not configured") };
}

/**
 * Record an employer review / candidate view.
 *
 * CONNECT TO: public.employer_reviews (INSERT)
 * RLS: Employers can insert; candidates can read their own reviews.
 */
export async function recordEmployerReview(_review: { employerUserId: string; candidateUserId: string; organizationId?: string; submissionId?: string; notes?: string }) {
    // TODO: return supabase.from("employer_reviews").insert({ employer_user_id: review.employerUserId, candidate_user_id: review.candidateUserId, organization_id: review.organizationId ?? null, submission_id: review.submissionId ?? null, notes: review.notes ?? null, status: "viewed" });
    return { data: null, error: new Error("Supabase not configured") };
}
