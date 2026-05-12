/**
 * storage.ts — Centralized localStorage utility for WorkProof.
 *
 * All storage keys live here so a name-change happens in one place.
 * Every read/write is SSR-safe and silently catches quota/parse errors.
 *
 * SUPABASE MIGRATION PATH:
 *   Replace storage.get / storage.set calls in each store with the
 *   corresponding Supabase query, then delete the localStorage effects.
 *   The key suffixes below map well to Supabase table / column names.
 */

// ─── Keys ─────────────────────────────────────────────────────────────────────

export const STORAGE_KEYS = {
    ONBOARDING: "workproof:onboarding:v1",
    SUBMISSIONS: "workproof:submissions:v1",
    USER_PROFILE: "workproof:user-profile:v1",
    DASHBOARD_PROGRESS: "workproof:dashboard-progress:v1",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

// ─── SSR guard ────────────────────────────────────────────────────────────────

/** True only in browser environments. Guards every localStorage call. */
const isBrowser = typeof window !== "undefined";

// ─── API ──────────────────────────────────────────────────────────────────────

export const storage = {
    /**
     * Read and deserialize a value from localStorage.
     * Returns `null` if the key doesn't exist, the environment is SSR,
     * or JSON parsing fails.
     *
     * SUPABASE MIGRATION: replace with
     *   `supabase.from(table).select(columns).eq("user_id", userId).single()`
     */
    get<T>(key: StorageKey): T | null {
        if (!isBrowser) return null;
        try {
            const raw = localStorage.getItem(key);
            return raw ? (JSON.parse(raw) as T) : null;
        } catch {
            return null;
        }
    },

    /**
     * Serialize and write a value to localStorage.
     * Silently no-ops on SSR or when the storage quota is exceeded.
     *
     * SUPABASE MIGRATION: replace with
     *   `supabase.from(table).upsert({ user_id: userId, ...value })`
     */
    set<T>(key: StorageKey, value: T): void {
        if (!isBrowser) return;
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch {
            // quota exceeded or private-browsing restriction — ignore
        }
    },

    /**
     * Remove a single key.
     *
     * SUPABASE MIGRATION: replace with
     *   `supabase.from(table).delete().eq("user_id", userId)`
     */
    remove(key: StorageKey): void {
        if (!isBrowser) return;
        try {
            localStorage.removeItem(key);
        } catch {
            // ignore
        }
    },

    /**
     * Wipe every WorkProof key.
     * Call this on sign-out or explicit "reset account" actions.
     *
     * SUPABASE MIGRATION: sign out via `supabase.auth.signOut()` instead;
     *   Supabase clears its own session storage automatically.
     */
    clearAll(): void {
        if (!isBrowser) return;
        try {
            Object.values(STORAGE_KEYS).forEach((key) =>
                localStorage.removeItem(key)
            );
        } catch {
            // ignore
        }
    },
};
