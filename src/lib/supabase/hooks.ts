"use client";

/**
 * hooks.ts — WorkProof Supabase React hooks.
 *
 * All hooks gracefully fall back to null / empty state when Supabase is not
 * configured, so the app continues to work in mock-data mode.
 *
 * Available hooks:
 *   useAuth()              → { user, session, loading }
 *   useCurrentProfile()    → { profile, loading, refresh }
 *   useSavedChallengeIds() → Set<string>
 */

import { useEffect, useState, useCallback } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { createClient, isSupabaseConfigured } from "./client";
import type { Tables } from "./types";

// ── Auth ──────────────────────────────────────────────────────────────────────

export interface AuthState {
    user: User | null;
    session: Session | null;
    loading: boolean;
}

/**
 * Subscribes to Supabase auth state changes.
 * Returns { user: null, session: null, loading: false } when Supabase is not configured.
 */
export function useAuth(): AuthState {
    const [state, setState] = useState<AuthState>({
        user: null,
        session: null,
        loading: isSupabaseConfigured(), // start loading only if we'll actually fetch
    });

    useEffect(() => {
        if (!isSupabaseConfigured()) return;

        const supabase = createClient();

        // Restore initial session from cookies.
        supabase.auth.getSession().then(({ data: { session } }) => {
            setState({ user: session?.user ?? null, session, loading: false });
        });

        // Keep state in sync with auth events (sign in, sign out, token refresh).
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setState({ user: session?.user ?? null, session, loading: false });
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    return state;
}

// ── Profile ───────────────────────────────────────────────────────────────────

export interface ProfileState {
    /** The authenticated user's row from the `profiles` table. Null until loaded or when signed out. */
    profile: Tables<"profiles"> | null;
    loading: boolean;
    /** Call to force a re-fetch (e.g. after saving settings). */
    refresh: () => void;
}

/**
 * Fetches the current user's profile from the `profiles` table.
 * Returns { profile: null, loading: false } when not signed in or Supabase not configured.
 */
export function useCurrentProfile(): ProfileState {
    const { user } = useAuth();
    const [profile, setProfile] = useState<Tables<"profiles"> | null>(null);
    const [loading, setLoading] = useState(false);
    const [tick, setTick] = useState(0);

    const refresh = useCallback(() => setTick((t) => t + 1), []);

    useEffect(() => {
        if (!user || !isSupabaseConfigured()) {
            setLoading(false);
            return;
        }

        const supabase = createClient();
        setLoading(true);

        supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single()
            .then(({ data }) => {
                setProfile(data);
                setLoading(false);
            });
    }, [user, tick]);

    return { profile, loading, refresh };
}

// ── Saved challenges ──────────────────────────────────────────────────────────

/**
 * Returns the set of challenge IDs the current user has saved.
 * Returns an empty Set when not signed in or Supabase not configured.
 */
export function useSavedChallengeIds(): Set<string> {
    const { user } = useAuth();
    const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (!user || !isSupabaseConfigured()) return;

        const supabase = createClient();
        supabase
            .from("saved_challenges")
            .select("challenge_id")
            .eq("user_id", user.id)
            .then(({ data }) => {
                if (data) {
                    setSavedIds(new Set(data.map((r) => r.challenge_id)));
                }
            });
    }, [user]);

    return savedIds;
}
