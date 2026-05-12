"use client";

/**
 * User profile store — Supabase-primary, localStorage fallback.
 *
 * Behaviour:
 *   - If Supabase is configured AND the user is authenticated:
 *       • Mount: fetches profile from the `profiles` table (overrides localStorage).
 *       • saveProfile: upserts to the `profiles` table AND writes to localStorage.
 *   - Otherwise (demo / unauthenticated mode):
 *       • Mount: hydrates from localStorage.
 *       • saveProfile: localStorage only.
 */

import {
    createContext,
    useContext,
    useReducer,
    useEffect,
    useCallback,
    type ReactNode,
} from "react";
import { storage, STORAGE_KEYS } from "@/lib/storage";
import { mockUser } from "@/data/user";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UserProfileSettings {
    name: string;
    targetRole: string;
    bio: string;
    /** Comma-separated skill names — matches the Settings form's text input. */
    skills: string;
    portfolioLink: string;
    githubLink: string;
    linkedinLink: string;
    isPublic: boolean;
    /** Maps to AIDisclosureLevel on challenge submissions. */
    aiTransparencyPreference: string;
    emailNotifications: boolean;
    /** Active track ID. null means "fall back to onboarding / mock default". */
    selectedTrackId: string | null;
}

// ─── Defaults ────────────────────────────────────────────────────────────────

/** Seed values sourced from mockUser — replaced once localStorage is read. */
const DEFAULT_PROFILE: UserProfileSettings = {
    name: mockUser.name,
    targetRole: mockUser.targetRole,
    bio: mockUser.bio,
    skills: mockUser.skills.map((s) => s.name).join(", "),
    portfolioLink: mockUser.portfolioLink,
    githubLink: mockUser.githubLink,
    linkedinLink: mockUser.linkedinLink,
    isPublic: mockUser.isPublic,
    aiTransparencyPreference: mockUser.aiTransparencyPreference,
    emailNotifications: true,
    selectedTrackId: null,
};

// ─── State ────────────────────────────────────────────────────────────────────

interface UserProfileState {
    profile: UserProfileSettings;
    /** True after the first localStorage read so UI can skip loading states. */
    hydrated: boolean;
}

// ─── Actions ──────────────────────────────────────────────────────────────────

type Action =
    | { type: "HYDRATE"; payload: Partial<UserProfileSettings> }
    | { type: "SAVE"; payload: UserProfileSettings };

// ─── Reducer ──────────────────────────────────────────────────────────────────

function reducer(state: UserProfileState, action: Action): UserProfileState {
    switch (action.type) {
        case "HYDRATE":
            return {
                ...state,
                profile: { ...DEFAULT_PROFILE, ...action.payload },
                hydrated: true,
            };
        case "SAVE":
            return { ...state, profile: action.payload };
        default:
            return state;
    }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface UserProfileContextValue {
    profile: UserProfileSettings;
    /** False until localStorage has been read on the client. */
    hydrated: boolean;
    /** Persist a full profile snapshot. Call from the Settings page on save. */
    saveProfile: (updates: UserProfileSettings) => void;
    /** Update just the active track without requiring a full settings save. */
    setSelectedTrack: (trackId: string | null) => void;
}

const UserProfileContext = createContext<UserProfileContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

export function UserProfileProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(reducer, {
        profile: DEFAULT_PROFILE,
        hydrated: false,
    });

    useEffect(() => {
        async function hydrate() {
            // Always hydrate localStorage first for instant display.
            const stored = storage.get<Partial<UserProfileSettings>>(
                STORAGE_KEYS.USER_PROFILE
            );
            dispatch({ type: "HYDRATE", payload: stored ?? {} });

            if (!isSupabaseConfigured()) return;

            try {
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data: profile } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", user.id)
                    .single();

                if (!profile) return;

                // Map database profile to UserProfileSettings.
                dispatch({
                    type: "HYDRATE",
                    payload: {
                        name: profile.name,
                        targetRole: profile.target_role,
                        bio: profile.bio ?? "",
                        skills: profile.skills.join(", "),
                        portfolioLink: profile.portfolio_link ?? "",
                        githubLink: profile.github_link ?? "",
                        linkedinLink: profile.linkedin_link ?? "",
                        isPublic: profile.is_public,
                        aiTransparencyPreference: profile.ai_transparency_preference,
                        selectedTrackId: profile.track_id ?? null,
                    },
                });
            } catch {
                // Supabase unavailable — localStorage data already in place.
            }
        }

        void hydrate();
    }, []);

    const saveProfile = useCallback((updates: UserProfileSettings) => {
        // Always save to localStorage as fallback.
        storage.set(STORAGE_KEYS.USER_PROFILE, updates);
        dispatch({ type: "SAVE", payload: updates });

        // Fire-and-forget Supabase upsert.
        if (isSupabaseConfigured()) {
            void (async () => {
                try {
                    const supabase = createClient();
                    const { data: { user } } = await supabase.auth.getUser();
                    if (!user) return;

                    await supabase
                        .from("profiles")
                        .update({
                            name: updates.name,
                            target_role: updates.targetRole,
                            bio: updates.bio || null,
                            skills: updates.skills
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean),
                            portfolio_link: updates.portfolioLink || null,
                            github_link: updates.githubLink || null,
                            linkedin_link: updates.linkedinLink || null,
                            is_public: updates.isPublic,
                            ai_transparency_preference:
                                updates.aiTransparencyPreference as "none" | "brainstorm" | "suggestions" | "heavy" | "explained",
                            track_id: updates.selectedTrackId ?? "frontend",
                        })
                        .eq("id", user.id);
                } catch {
                    // Silently ignore — localStorage already has the update.
                }
            })();
        }
    }, []);

    const setSelectedTrack = useCallback(
        (trackId: string | null) => {
            const next = { ...state.profile, selectedTrackId: trackId };
            storage.set(STORAGE_KEYS.USER_PROFILE, next);
            dispatch({ type: "SAVE", payload: next });
        },
        [state.profile]
    );

    return (
        <UserProfileContext.Provider
            value={{
                profile: state.profile,
                hydrated: state.hydrated,
                saveProfile,
                setSelectedTrack,
            }}
        >
            {children}
        </UserProfileContext.Provider>
    );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useUserProfile(): UserProfileContextValue {
    const ctx = useContext(UserProfileContext);
    if (!ctx)
        throw new Error(
            "useUserProfile must be used inside <UserProfileProvider>"
        );
    return ctx;
}
