"use client";

/**
 * Submissions store — state with Supabase-primary, localStorage fallback.
 *
 * Behaviour:
 *   - If Supabase is configured AND the user is authenticated:
 *       • Mount: fetches submissions from the `submissions` table.
 *       • addSubmission: inserts to Supabase + logs an activity event.
 *   - Otherwise (demo / unauthenticated mode):
 *       • Mount: hydrates from localStorage.
 *       • addSubmission: persists to localStorage only.
 *
 * Local state is always updated immediately (optimistic) for a snappy UI.
 */

import {
    createContext,
    useContext,
    useReducer,
    useEffect,
    type ReactNode,
} from "react";
import type { Submission } from "@/types";
import { storage, STORAGE_KEYS } from "@/lib/storage";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

// ─── State ──────────────────────────────────────────────────────────────────

interface SubmissionsState {
    submissions: Submission[];
}

// ─── Actions ─────────────────────────────────────────────────────────────────

type Action =
    | { type: "ADD_SUBMISSION"; payload: Submission }
    | { type: "HYDRATE"; payload: Submission[] };

// ─── Reducer ─────────────────────────────────────────────────────────────────

function reducer(state: SubmissionsState, action: Action): SubmissionsState {
    switch (action.type) {
        case "ADD_SUBMISSION":
            return { submissions: [action.payload, ...state.submissions] };
        case "HYDRATE":
            return { submissions: action.payload };
        default:
            return state;
    }
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface SubmissionsContextValue {
    /** Submissions added by the user in this session (not the seed data). */
    submissions: Submission[];
    /** Add a new submission. Future: fires a Supabase insert before dispatching. */
    addSubmission: (submission: Submission) => void;
}

const SubmissionsContext = createContext<SubmissionsContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

export function SubmissionsProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(reducer, { submissions: [] });

    // On mount: prefer Supabase data for authenticated users, fall back to localStorage.
    useEffect(() => {
        async function hydrate() {
            // Always load localStorage first for instant display.
            const cached = storage.get<Submission[]>(STORAGE_KEYS.SUBMISSIONS);
            if (Array.isArray(cached)) {
                dispatch({ type: "HYDRATE", payload: cached });
            }

            if (!isSupabaseConfigured()) return;

            try {
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                // Fetch submissions + process steps in one query.
                const { data } = await supabase
                    .from("submissions")
                    .select("*, submission_process_steps(*)")
                    .eq("user_id", user.id)
                    .order("submitted_at", { ascending: false });

                if (!data) return;

                // Map database rows back to the app's Submission type.
                const mapped: Submission[] = data.map((row) => ({
                    id: row.id,
                    challengeId: row.challenge_id ?? "",
                    challengeTitle: row.challenge_title,
                    track: row.track,
                    submittedAt: row.submitted_at,
                    liveLink: row.live_link ?? undefined,
                    repoLink: row.repo_link ?? undefined,
                    projectTitle: row.project_title,
                    explanation: row.explanation,
                    problemStatement: row.problem_statement,
                    designDecisions: row.design_decisions,
                    improvements: row.improvements,
                    aiDisclosure: row.ai_disclosure,
                    aiDescription: row.ai_description ?? undefined,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    processSteps: ((row as any).submission_process_steps ?? []).map((s: {
                        id: string; title: string; description: string;
                        step_order: number; recorded_at: string;
                    }) => ({
                        id: s.id,
                        title: s.title,
                        description: s.description,
                        timestamp: s.recorded_at,
                    })).sort((a: { timestamp: string }, b: { timestamp: string }) =>
                        a.timestamp.localeCompare(b.timestamp)
                    ),
                    score: row.score,
                    skills: row.skills,
                }));

                dispatch({ type: "HYDRATE", payload: mapped });
            } catch {
                // Supabase unavailable — localStorage data is already displayed.
            }
        }

        void hydrate();
    }, []);

    // Mirror to localStorage so the fallback stays fresh.
    useEffect(() => {
        storage.set(STORAGE_KEYS.SUBMISSIONS, state.submissions);
    }, [state.submissions]);

    function addSubmission(submission: Submission) {
        // Optimistic local update — UI responds instantly.
        dispatch({ type: "ADD_SUBMISSION", payload: submission });

        // Fire-and-forget Supabase insert.
        if (isSupabaseConfigured()) {
            void (async () => {
                try {
                    const supabase = createClient();
                    const { data: { user } } = await supabase.auth.getUser();
                    if (!user) return;

                    const { data: inserted, error } = await supabase
                        .from("submissions")
                        .insert({
                            user_id: user.id,
                            challenge_id: submission.challengeId || null,
                            challenge_title: submission.challengeTitle,
                            track: submission.track,
                            project_title: submission.projectTitle,
                            live_link: submission.liveLink ?? null,
                            repo_link: submission.repoLink ?? null,
                            explanation: submission.explanation,
                            problem_statement: submission.problemStatement,
                            design_decisions: submission.designDecisions,
                            improvements: submission.improvements,
                            ai_disclosure: submission.aiDisclosure,
                            ai_description: submission.aiDescription ?? null,
                            score: submission.score,
                            skills: submission.skills,
                        })
                        .select("id")
                        .single();

                    if (error || !inserted) return;

                    // Insert process steps separately (need the parent submission ID).
                    if (submission.processSteps.length > 0) {
                        await supabase.from("submission_process_steps").insert(
                            submission.processSteps.map((step, i) => ({
                                submission_id: inserted.id,
                                title: step.title,
                                description: step.description,
                                step_order: i,
                                recorded_at: step.timestamp,
                            }))
                        );
                    }

                    // Log an activity event for the dashboard feed.
                    await supabase.from("activity_events").insert({
                        user_id: user.id,
                        type: "submission" as const,
                        title: `Submitted: ${submission.challengeTitle}`,
                        description: `Scored ${submission.score}/100`,
                    });
                } catch {
                    // Silently ignore — local state is already updated.
                }
            })();
        }
    }

    return (
        <SubmissionsContext.Provider value={{ submissions: state.submissions, addSubmission }}>
            {children}
        </SubmissionsContext.Provider>
    );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useSubmissions() {
    const ctx = useContext(SubmissionsContext);
    if (!ctx) throw new Error("useSubmissions must be used within <SubmissionsProvider>");
    return ctx;
}

// ─── Score calculator ────────────────────────────────────────────────────────

/**
 * Deterministic score based on submission quality signals.
 * Future: replace with server-side scoring (Edge Function / Supabase RPC).
 */
export function calculateSubmissionScore(params: {
    processSteps: Submission["processSteps"];
    liveLink: string;
    repoLink: string;
    designDecisions: string;
    improvements: string;
    aiDisclosure: Submission["aiDisclosure"];
}): number {
    let score = 70;
    score += Math.min(params.processSteps.length * 3, 12);   // max +12 for 4+ steps
    if (params.liveLink) score += 6;
    if (params.repoLink) score += 4;
    if (params.designDecisions.trim().length > 200) score += 5;
    if (params.improvements.trim().length > 80) score += 3;
    if (params.aiDisclosure === "explained") score += 4;
    if (params.aiDisclosure === "none") score += 2; // pure independent work
    return Math.min(Math.round(score), 98);
}
