"use client";

/**
 * Onboarding store — frontend-only state with localStorage persistence.
 *
 * SUPABASE MIGRATION PATH:
 *   1. Replace HYDRATE effect with:
 *        const { data } = await supabase.from("onboarding_profiles").select("*").eq("user_id", userId).single()
 *        if (data) dispatch({ type: "COMPLETE", payload: data })
 *   2. Replace completeOnboarding's dispatch with:
 *        await supabase.from("onboarding_profiles").upsert({ user_id: userId, ...profile })
 *        then dispatch locally
 *   3. Remove localStorage effects.
 */

import {
    createContext,
    useContext,
    useReducer,
    useEffect,
    type ReactNode,
} from "react";
import type { OnboardingProfile } from "@/types";
import { storage, STORAGE_KEYS } from "@/lib/storage";

// ─── State ────────────────────────────────────────────────────────────────────

interface OnboardingState {
    completed: boolean;
    profile: OnboardingProfile | null;
}

// ─── Actions ──────────────────────────────────────────────────────────────────

type Action =
    | { type: "COMPLETE"; payload: OnboardingProfile }
    | { type: "HYDRATE"; payload: OnboardingProfile }
    | { type: "RESET" };

// ─── Reducer ──────────────────────────────────────────────────────────────────

function reducer(state: OnboardingState, action: Action): OnboardingState {
    switch (action.type) {
        case "COMPLETE":
        case "HYDRATE":
            return { completed: true, profile: action.payload };
        case "RESET":
            return { completed: false, profile: null };
        default:
            return state;
    }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface OnboardingContextValue {
    completed: boolean;
    profile: OnboardingProfile | null;
    completeOnboarding: (profile: OnboardingProfile) => void;
    resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function OnboardingProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(reducer, {
        completed: false,
        profile: null,
    });

    // Hydrate from localStorage on mount.
    // Future: replace with supabase.from("onboarding_profiles").select(...)
    useEffect(() => {
        const parsed = storage.get<OnboardingProfile>(STORAGE_KEYS.ONBOARDING);
        if (parsed?.completedAt) {
            dispatch({ type: "HYDRATE", payload: parsed });
        }
    }, []);

    const completeOnboarding = (profile: OnboardingProfile) => {
        storage.set(STORAGE_KEYS.ONBOARDING, profile);
        dispatch({ type: "COMPLETE", payload: profile });
    };

    const resetOnboarding = () => {
        storage.remove(STORAGE_KEYS.ONBOARDING);
        dispatch({ type: "RESET" });
    };

    return (
        <OnboardingContext.Provider
            value={{
                completed: state.completed,
                profile: state.profile,
                completeOnboarding,
                resetOnboarding,
            }}
        >
            {children}
        </OnboardingContext.Provider>
    );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useOnboarding() {
    const ctx = useContext(OnboardingContext);
    if (!ctx) {
        throw new Error("useOnboarding must be used within OnboardingProvider");
    }
    return ctx;
}
