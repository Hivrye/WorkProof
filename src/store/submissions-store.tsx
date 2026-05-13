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

export interface SaveResult {
    /** The database-assigned UUID for the saved submission (or local ID in fallback mode). */
    id: string;
    error: string | null;
}

interface SubmissionsContextValue {
    /** Submissions added by the user in this session (not the seed data). */
    submissions: Submission[];
    /**
     * Optimistically adds a submission to local state.
     * For a persistent async save, use saveSubmission() instead.
     */
    addSubmission: (submission: Submission) => void;
    /**
     * Awaitable Supabase save: inserts submission + process steps + activity event,
     * then upserts proof_scores. Updates local state on success.
     * Falls back to localStorage-only in unauthenticated / unconfigured mode.
     */
    saveSubmission: (submission: Submission) => Promise<SaveResult>;
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

        // Fire-and-forget Supabase insert (legacy path — prefer saveSubmission()).
        if (isSupabaseConfigured()) {
            void saveToSupabase(submission);
        }
    }

    async function saveSubmission(submission: Submission): Promise<SaveResult> {
        // Always update local state first.
        dispatch({ type: "ADD_SUBMISSION", payload: submission });

        if (!isSupabaseConfigured()) {
            return { id: submission.id, error: null };
        }

        return saveToSupabase(submission);
    }

    async function saveToSupabase(submission: Submission): Promise<SaveResult> {
        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return { id: submission.id, error: "Not authenticated" };

            // 1. Insert main submission row.
            const { data: inserted, error: insertError } = await supabase
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

            if (insertError || !inserted) {
                return { id: submission.id, error: insertError?.message ?? "Insert failed" };
            }

            const dbId = inserted.id;

            // 2. Insert process steps.
            if (submission.processSteps.length > 0) {
                await supabase.from("submission_process_steps").insert(
                    submission.processSteps.map((step, i) => ({
                        submission_id: dbId,
                        title: step.title,
                        description: step.description,
                        step_order: i,
                        recorded_at: step.timestamp,
                    }))
                );
            }

            // 3. Upsert proof_scores — increment cumulative total.
            const contribution = Math.round(submission.score * 0.5);
            const { data: current } = await supabase
                .from("proof_scores")
                .select("total, max_total, work_quality, process_clarity, skill_coverage, ai_transparency, consistency")
                .eq("user_id", user.id)
                .single();

            if (current) {
                const subScores = calculateSubScores(submission);
                await supabase
                    .from("proof_scores")
                    .update({
                        total: Math.min(current.total + contribution, current.max_total),
                        work_quality: blendScore(current.work_quality, subScores.work_quality),
                        process_clarity: blendScore(current.process_clarity, subScores.process_clarity),
                        skill_coverage: blendScore(current.skill_coverage, subScores.skill_coverage),
                        ai_transparency: blendScore(current.ai_transparency, subScores.ai_transparency),
                        consistency: Math.min(current.consistency + 3, 100),
                    })
                    .eq("user_id", user.id);
            }

            // 4. Activity event.
            await supabase.from("activity_events").insert({
                user_id: user.id,
                type: "submission" as const,
                title: `Submitted: ${submission.challengeTitle}`,
                description: `Scored ${submission.score}/100 · ${submission.track}`,
            });

            return { id: dbId, error: null };
        } catch (err) {
            return { id: submission.id, error: err instanceof Error ? err.message : "Unknown error" };
        }
    }

    return (
        <SubmissionsContext.Provider value={{ submissions: state.submissions, addSubmission, saveSubmission }}>
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

// ─── Sub-score breakdown (maps to proof_scores columns) ──────────────────────

interface SubScores {
    work_quality: number;
    process_clarity: number;
    skill_coverage: number;
    ai_transparency: number;
}

function calculateSubScores(submission: Submission): SubScores {
    // work_quality: explanation depth + design decisions quality
    let wq = 60;
    if (submission.problemStatement.trim().length > 100) wq += 10;
    if (submission.designDecisions.trim().length > 200) wq += 15;
    if (submission.improvements.trim().length > 80) wq += 10;
    if (submission.liveLink) wq += 5;
    const work_quality = Math.min(wq, 100);

    // process_clarity: number and detail of process steps
    const stepCount = submission.processSteps.length;
    let pc = 40 + Math.min(stepCount * 10, 40);
    const withDesc = submission.processSteps.filter((s) => s.description.trim().length > 20).length;
    pc += Math.min(withDesc * 5, 20);
    const process_clarity = Math.min(pc, 100);

    // skill_coverage: based on how many skills the challenge tests
    const skill_coverage = Math.min(40 + submission.skills.length * 10, 100);

    // ai_transparency: level of AI honesty
    const aiMap: Record<Submission["aiDisclosure"], number> = {
        none: 80,         // no AI — clean
        brainstorm: 90,   // transparent about minimal usage
        suggestions: 95,  // transparent with details
        explained: 100,   // highest — can explain everything
        heavy: 85,        // honest about heavy usage
    };
    const ai_transparency = aiMap[submission.aiDisclosure] ?? 80;

    return { work_quality, process_clarity, skill_coverage, ai_transparency };
}

/** Rolling blend: new score moves the needle 30% toward the latest value. */
function blendScore(current: number, next: number): number {
    return Math.round(current * 0.7 + next * 0.3);
}
