"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Code2, Palette, BarChart3, Headphones, Megaphone, Film,
    TrendingUp, ClipboardList, CalendarCheck, Box, ShieldCheck, Layers,
    ArrowRight, ArrowLeft, CheckCircle2, Briefcase, FolderOpen,
    Repeat2, Dumbbell, Eye, EyeOff, Clock, Zap, Shield, Star,
    User, AtSign, FileText, Loader2, XCircle, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useOnboarding } from "@/store/onboarding-store";
import { tracks } from "@/data/tracks";
import { challenges } from "@/data/challenges";
import type { ExperienceLevel, OnboardingGoal, OnboardingProfile } from "@/types";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { User as AuthUser } from "@supabase/supabase-js";
import type { Enums } from "@/lib/supabase/types";

// ─── Icon map (matches tracks data) ──────────────────────────────────────────

const iconMap: Record<string, React.ElementType> = {
    Code2, Palette, BarChart3, Headphones, Megaphone, Film,
    TrendingUp, ClipboardList, CalendarCheck, Box, ShieldCheck, Layers,
};

const trackColorClass: Record<string, string> = {
    blue: "border-blue-500/30 bg-blue-500/10 text-blue-400",
    violet: "border-violet-500/30 bg-violet-500/10 text-violet-400",
    cyan: "border-cyan-500/30 bg-cyan-500/10 text-cyan-400",
    emerald: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    pink: "border-pink-500/30 bg-pink-500/10 text-pink-400",
    orange: "border-orange-500/30 bg-orange-500/10 text-orange-400",
    amber: "border-amber-500/30 bg-amber-500/10 text-amber-400",
    indigo: "border-indigo-500/30 bg-indigo-500/10 text-indigo-400",
    teal: "border-teal-500/30 bg-teal-500/10 text-teal-400",
    purple: "border-purple-500/30 bg-purple-500/10 text-purple-400",
    red: "border-red-500/30 bg-red-500/10 text-red-400",
    fuchsia: "border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-400",
};

const trackSelectedClass: Record<string, string> = {
    blue: "border-blue-500 ring-1 ring-blue-500/40 bg-blue-500/10",
    violet: "border-violet-500 ring-1 ring-violet-500/40 bg-violet-500/10",
    cyan: "border-cyan-500 ring-1 ring-cyan-500/40 bg-cyan-500/10",
    emerald: "border-emerald-500 ring-1 ring-emerald-500/40 bg-emerald-500/10",
    pink: "border-pink-500 ring-1 ring-pink-500/40 bg-pink-500/10",
    orange: "border-orange-500 ring-1 ring-orange-500/40 bg-orange-500/10",
    amber: "border-amber-500 ring-1 ring-amber-500/40 bg-amber-500/10",
    indigo: "border-indigo-500 ring-1 ring-indigo-500/40 bg-indigo-500/10",
    teal: "border-teal-500 ring-1 ring-teal-500/40 bg-teal-500/10",
    purple: "border-purple-500 ring-1 ring-purple-500/40 bg-purple-500/10",
    red: "border-red-500 ring-1 ring-red-500/40 bg-red-500/10",
    fuchsia: "border-fuchsia-500 ring-1 ring-fuchsia-500/40 bg-fuchsia-500/10",
};

// ─── Experience options ───────────────────────────────────────────────────────

const experienceOptions: { id: ExperienceLevel; label: string; sub: string }[] = [
    {
        id: "no-experience",
        label: "Starting from scratch",
        sub: "No formal experience yet — just motivation and time.",
    },
    {
        id: "some-projects",
        label: "I have some personal projects",
        sub: "Side projects, bootcamp exercises, or self-taught work.",
    },
    {
        id: "1-2-years",
        label: "1–2 years of experience",
        sub: "Some professional or freelance experience in this area.",
    },
    {
        id: "3-plus-years",
        label: "3+ years, changing direction",
        sub: "Experienced in something else — pivoting into this role.",
    },
];

// ─── Goal options ─────────────────────────────────────────────────────────────

const goalOptions: {
    id: OnboardingGoal;
    label: string;
    sub: string;
    Icon: React.ElementType;
}[] = [
        {
            id: "get-hired",
            label: "Get hired",
            sub: "I need a job. I want to show employers real, verifiable proof.",
            Icon: Briefcase,
        },
        {
            id: "build-portfolio",
            label: "Build a portfolio",
            sub: "I want something credible to show — beyond tutorials and toy projects.",
            Icon: FolderOpen,
        },
        {
            id: "switch-careers",
            label: "Switch careers",
            sub: "I'm coming from a different field and need to rebuild credibility.",
            Icon: Repeat2,
        },
        {
            id: "practice",
            label: "Practice real-world skills",
            sub: "I want to work on actual problems, not synthetic exercises.",
            Icon: Dumbbell,
        },
    ];

// ─── Animation variants ────────────────────────────────────────────────────────

const slide = {
    initial: (dir: number) => ({ opacity: 0, x: dir * 40 }),
    animate: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir * -40 }),
};

const TOTAL_STEPS = 6;

// Username validation regex — matches the DB constraint
const USERNAME_REGEX = /^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$/;
const BIO_MAX = 500;

type UsernameStatus = "idle" | "checking" | "available" | "taken" | "invalid";

// ─── Page component ────────────────────────────────────────────────────────────

export default function OnboardingPage() {
    const router = useRouter();
    const { completed, completeOnboarding } = useOnboarding();

    const [step, setStep] = useState(1);
    const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    // Auth state (loaded on mount)
    const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
    const [initialUsername, setInitialUsername] = useState("");

    // Step 1 — track
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    // Step 2 — experience
    const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel | null>(null);
    // Step 3 — goal
    const [goal, setGoal] = useState<OnboardingGoal | null>(null);
    // Step 4 — AI transparency
    const [showAi, setShowAi] = useState<boolean | null>(null);
    // Step 5 — profile details
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>("idle");
    // Step 6 — first challenge
    const [firstChallenge, setFirstChallenge] = useState<string | null>(null);

    // Load auth user + current profile username on mount
    useEffect(() => {
        if (completed) { router.replace("/dashboard"); return; }
        if (!isSupabaseConfigured()) return;
        const supabase = createClient();
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) { router.replace("/auth/login"); return; }
            setCurrentUser(user);
            // Pre-fill name from auth metadata
            const metaName = user.user_metadata?.name as string | undefined;
            if (metaName) setFullName(metaName);
            // Load existing profile for username pre-fill
            supabase
                .from("profiles")
                .select("username, name")
                .eq("id", user.id)
                .single()
                .then(({ data }) => {
                    if (data?.username) {
                        setUsername(data.username);
                        setInitialUsername(data.username);
                    }
                    if (data?.name && !metaName) setFullName(data.name);
                });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Debounced username uniqueness check
    useEffect(() => {
        if (!username) { setUsernameStatus("idle"); return; }
        if (username === initialUsername) { setUsernameStatus("available"); return; }
        if (!USERNAME_REGEX.test(username)) { setUsernameStatus("invalid"); return; }
        setUsernameStatus("checking");
        const timer = setTimeout(async () => {
            if (!isSupabaseConfigured() || !currentUser) {
                setUsernameStatus("available");
                return;
            }
            const supabase = createClient();
            const { data } = await supabase
                .from("profiles")
                .select("id")
                .eq("username", username)
                .neq("id", currentUser.id)
                .maybeSingle();
            setUsernameStatus(data ? "taken" : "available");
        }, 400);
        return () => clearTimeout(timer);
    }, [username, initialUsername, currentUser]);

    const selectedTrack = tracks.find((t) => t.id === selectedRole);

    // Challenges for step 6 — prefer beginner/intermediate from chosen track
    const filteredChallenges = selectedRole
        ? challenges
            .filter((c) => c.trackId === selectedRole && c.status === "not-started")
            .slice(0, 4)
        : challenges.filter((c) => c.status === "not-started").slice(0, 4);

    function canAdvance(): boolean {
        if (step === 1) return selectedRole !== null;
        if (step === 2) return experienceLevel !== null;
        if (step === 3) return goal !== null;
        if (step === 4) return showAi !== null;
        if (step === 5) {
            return (
                fullName.trim().length > 0 &&
                username.trim().length >= 3 &&
                (usernameStatus === "available") &&
                bio.length <= BIO_MAX
            );
        }
        if (step === 6) return firstChallenge !== null;
        return false;
    }

    function advance() {
        if (!canAdvance()) return;
        if (step < TOTAL_STEPS) {
            setDirection(1);
            setStep((s) => s + 1);
        } else {
            handleFinish(false);
        }
    }

    function back() {
        if (step > 1) {
            setDirection(-1);
            setStep((s) => s - 1);
        }
    }

    async function handleFinish(skipped: boolean) {
        setSaving(true);
        setSaveError(null);
        try {
            if (isSupabaseConfigured()) {
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const aiPref: Enums<"ai_disclosure_level"> = showAi ? "suggestions" : "none";
                    const trackName = selectedTrack?.name ?? "";

                    // ── Core profile update (columns from migration 001 — always exist) ──
                    // Only include username in update if one is available and non-empty
                    const usernameToSave = username.trim() || initialUsername;
                    const { error: profileError } = await supabase
                        .from("profiles")
                        .update({
                            name: fullName.trim() || user.email?.split("@")[0] || "",
                            ...(usernameToSave ? { username: usernameToSave } : {}),
                            bio: bio.trim() || null,
                            target_role: trackName,
                            track_id: selectedRole ?? "frontend",
                            ai_transparency_preference: aiPref,
                        })
                        .eq("id", user.id);

                    if (profileError) throw new Error(profileError.message);

                    // ── Extended fields (migration 002 — swallow gracefully if not yet applied) ──
                    try {
                        await supabase
                            .from("profiles")
                            .update({
                                experience_level: experienceLevel ?? "no-experience",
                                goal: goal ?? "get-hired",
                                onboarding_completed: !skipped,
                            })
                            .eq("id", user.id);
                    } catch { /* Migration 002 not yet applied — safe to continue */ }

                    // ── Save selected challenge (non-blocking — may fail if DB challenges not seeded) ──
                    if (!skipped && firstChallenge) {
                        try {
                            await supabase
                                .from("saved_challenges")
                                .upsert({ user_id: user.id, challenge_id: firstChallenge });
                        } catch { /* Silently ignore */ }
                    }

                    // ── Recommend top 3 track challenges ──
                    if (!skipped && selectedRole) {
                        const recommendedIds = challenges
                            .filter((c) => c.trackId === selectedRole && c.status === "not-started" && c.id !== firstChallenge)
                            .slice(0, 3)
                            .map((c) => ({ user_id: user.id, challenge_id: c.id }));
                        if (recommendedIds.length > 0) {
                            try {
                                await supabase.from("saved_challenges").upsert(recommendedIds);
                            } catch { /* Silently ignore */ }
                        }
                    }

                    // ── Activity event (non-critical) ──
                    try {
                        await supabase
                            .from("activity_events")
                            .insert({
                                user_id: user.id,
                                type: "profile",
                                title: skipped ? "Account created" : "Onboarding complete",
                                description: skipped
                                    ? "Setup skipped — complete your profile to improve job visibility."
                                    : `Ready to prove skills as a ${trackName}.`,
                            });
                    } catch { /* Non-critical */ }
                }
            }

            // Update local store so the dashboard doesn't redirect back here
            completeOnboarding({
                roleId: selectedRole ?? "",
                roleName: selectedTrack?.name ?? selectedRole ?? "",
                experienceLevel: experienceLevel ?? "no-experience",
                goal: goal ?? "get-hired",
                showAiOnProfile: showAi ?? true,
                firstChallengeId: firstChallenge ?? "",
                completedAt: new Date().toISOString(),
            });

            router.push("/dashboard");
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Unknown error";
            setSaveError(`Something went wrong saving your profile: ${msg}`);
            setSaving(false);
        }
    }

    function handleSkip() {
        handleFinish(true);
    }

    return (
        <div className="min-h-screen bg-[#0b0f1a] flex flex-col items-center justify-start px-4 py-12">
            {/* Logo + skip */}
            <div className="w-full max-w-2xl flex items-center justify-between mb-10">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                        <Shield className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white font-bold text-lg tracking-tight">WorkProof</span>
                </div>
                <button
                    onClick={handleSkip}
                    disabled={saving}
                    className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1"
                >
                    Skip setup
                    <ArrowRight className="w-3 h-3" />
                </button>
            </div>

            {/* Progress bar */}
            <div className="w-full max-w-2xl mb-8">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span>Step {step} of {TOTAL_STEPS}</span>
                    <span>{Math.round((step / TOTAL_STEPS) * 100)}% complete</span>
                </div>
                <div className="h-1.5 bg-[#1e2d45] rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-blue-600 to-violet-600 rounded-full"
                        animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                    />
                </div>
            </div>

            {/* Error banner */}
            {saveError && (
                <div className="w-full max-w-2xl mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 flex items-center gap-3">
                    <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <p className="text-sm text-red-300">{saveError}</p>
                    <button onClick={() => setSaveError(null)} className="ml-auto text-red-400 hover:text-red-300">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Step content */}
            <div className="w-full max-w-2xl overflow-hidden">
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={step}
                        custom={direction}
                        variants={slide}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.28, ease: "easeInOut" }}
                    >
                        {step === 1 && (
                            <Step1
                                selectedRole={selectedRole}
                                onSelect={setSelectedRole}
                            />
                        )}
                        {step === 2 && (
                            <Step2
                                selected={experienceLevel}
                                onSelect={setExperienceLevel}
                            />
                        )}
                        {step === 3 && (
                            <Step3
                                selected={goal}
                                onSelect={setGoal}
                            />
                        )}
                        {step === 4 && (
                            <Step4
                                selected={showAi}
                                onSelect={setShowAi}
                            />
                        )}
                        {step === 5 && (
                            <Step5Profile
                                fullName={fullName}
                                username={username}
                                bio={bio}
                                usernameStatus={usernameStatus}
                                onNameChange={setFullName}
                                onUsernameChange={setUsername}
                                onBioChange={setBio}
                            />
                        )}
                        {step === 6 && (
                            <Step6Challenges
                                challenges={filteredChallenges}
                                selected={firstChallenge}
                                trackName={selectedTrack?.name}
                                onSelect={setFirstChallenge}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Nav buttons */}
            <div className="w-full max-w-2xl mt-8 flex items-center justify-between">
                <button
                    onClick={back}
                    className={cn(
                        "flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors",
                        step === 1 && "invisible"
                    )}
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>

                <button
                    onClick={advance}
                    disabled={!canAdvance() || saving}
                    className={cn(
                        "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all",
                        canAdvance() && !saving
                            ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/30"
                            : "bg-[#1e2d45] text-slate-500 cursor-not-allowed"
                    )}
                >
                    {saving ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Saving…
                        </>
                    ) : step === TOTAL_STEPS ? (
                        <>
                            Go to my dashboard
                            <Zap className="w-4 h-4" />
                        </>
                    ) : (
                        <>
                            Continue
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

// ─── Step 1: Role ─────────────────────────────────────────────────────────────

function Step1({
    selectedRole,
    onSelect,
}: {
    selectedRole: string | null;
    onSelect: (id: string) => void;
}) {
    return (
        <div>
            <StepHeading
                step={1}
                title="What role are you trying to prove?"
                sub="Pick the track that matches where you want to go — not where you are today."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tracks.map((track) => {
                    const Icon = iconMap[track.icon] ?? Code2;
                    const isSelected = selectedRole === track.id;
                    return (
                        <button
                            key={track.id}
                            onClick={() => onSelect(track.id)}
                            className={cn(
                                "flex items-start gap-3 rounded-xl border p-4 text-left transition-all duration-150",
                                isSelected
                                    ? trackSelectedClass[track.color] ?? "border-blue-500 ring-1 ring-blue-500/40"
                                    : "border-[#1e2d45] bg-[#111827] hover:border-white/20"
                            )}
                        >
                            <div
                                className={cn(
                                    "w-9 h-9 rounded-lg flex items-center justify-center border shrink-0",
                                    trackColorClass[track.color] ?? trackColorClass.blue
                                )}
                            >
                                <Icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-white leading-snug">{track.name}</p>
                                <p className="text-xs text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">{track.description}</p>
                            </div>
                            {isSelected && (
                                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5 ml-auto" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

// ─── Step 2: Experience level ─────────────────────────────────────────────────

function Step2({
    selected,
    onSelect,
}: {
    selected: ExperienceLevel | null;
    onSelect: (v: ExperienceLevel) => void;
}) {
    return (
        <div>
            <StepHeading
                step={2}
                title="What's your current experience level?"
                sub="Be honest — WorkProof is designed to work at every stage."
            />
            <div className="space-y-3">
                {experienceOptions.map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => onSelect(opt.id)}
                        className={cn(
                            "w-full flex items-center gap-4 rounded-xl border p-4 text-left transition-all duration-150",
                            selected === opt.id
                                ? "border-blue-500 ring-1 ring-blue-500/40 bg-blue-500/10"
                                : "border-[#1e2d45] bg-[#111827] hover:border-white/20"
                        )}
                    >
                        <div
                            className={cn(
                                "w-4 h-4 rounded-full border-2 shrink-0 transition-colors",
                                selected === opt.id
                                    ? "border-blue-400 bg-blue-400"
                                    : "border-slate-600"
                            )}
                        />
                        <div>
                            <p className="text-sm font-medium text-white">{opt.label}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{opt.sub}</p>
                        </div>
                        {selected === opt.id && (
                            <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 ml-auto" />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}

// ─── Step 3: Goal ─────────────────────────────────────────────────────────────

function Step3({
    selected,
    onSelect,
}: {
    selected: OnboardingGoal | null;
    onSelect: (v: OnboardingGoal) => void;
}) {
    return (
        <div>
            <StepHeading
                step={3}
                title="What's your main goal right now?"
                sub="This helps us personalize your recommended challenges."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {goalOptions.map(({ id, label, sub, Icon }) => (
                    <button
                        key={id}
                        onClick={() => onSelect(id)}
                        className={cn(
                            "flex flex-col items-start gap-3 rounded-xl border p-5 text-left transition-all duration-150",
                            selected === id
                                ? "border-blue-500 ring-1 ring-blue-500/40 bg-blue-500/10"
                                : "border-[#1e2d45] bg-[#111827] hover:border-white/20"
                        )}
                    >
                        <div
                            className={cn(
                                "w-9 h-9 rounded-lg flex items-center justify-center border transition-colors",
                                selected === id
                                    ? "border-blue-500/50 bg-blue-500/20 text-blue-400"
                                    : "border-[#2a3a55] bg-white/5 text-slate-400"
                            )}
                        >
                            <Icon className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white">{label}</p>
                            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{sub}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

// ─── Step 4: AI transparency ───────────────────────────────────────────────────

function Step4({
    selected,
    onSelect,
}: {
    selected: boolean | null;
    onSelect: (v: boolean) => void;
}) {
    return (
        <div>
            <StepHeading
                step={4}
                title="Do you want AI usage shown on your profile?"
                sub="WorkProof tracks AI usage on every challenge. You decide what employers see."
            />

            <div className="rounded-xl border border-[#1e2d45] bg-[#111827] p-4 mb-5 text-sm text-slate-400 leading-relaxed">
                <span className="text-white font-medium">Why this matters: </span>
                Employers increasingly want to know how candidates use AI — not whether they do.
                Showing AI usage honestly signals maturity, not weakness.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Yes */}
                <button
                    onClick={() => onSelect(true)}
                    className={cn(
                        "flex flex-col items-start gap-3 rounded-xl border p-5 text-left transition-all duration-150",
                        selected === true
                            ? "border-emerald-500 ring-1 ring-emerald-500/40 bg-emerald-500/10"
                            : "border-[#1e2d45] bg-[#111827] hover:border-white/20"
                    )}
                >
                    <div
                        className={cn(
                            "w-9 h-9 rounded-lg flex items-center justify-center border",
                            selected === true
                                ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-400"
                                : "border-[#2a3a55] bg-white/5 text-slate-400"
                        )}
                    >
                        <Eye className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-white">Yes, show it</p>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            Employers see exactly how AI was used on each submission.
                            Most prefer candidates who are transparent.
                        </p>
                    </div>
                    {selected === true && (
                        <span className="text-xs text-emerald-400 font-medium bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">
                            Recommended
                        </span>
                    )}
                </button>

                {/* No */}
                <button
                    onClick={() => onSelect(false)}
                    className={cn(
                        "flex flex-col items-start gap-3 rounded-xl border p-5 text-left transition-all duration-150",
                        selected === false
                            ? "border-slate-500 ring-1 ring-slate-500/40 bg-slate-500/10"
                            : "border-[#1e2d45] bg-[#111827] hover:border-white/20"
                    )}
                >
                    <div
                        className={cn(
                            "w-9 h-9 rounded-lg flex items-center justify-center border",
                            selected === false
                                ? "border-slate-500/50 bg-slate-500/20 text-slate-300"
                                : "border-[#2a3a55] bg-white/5 text-slate-400"
                        )}
                    >
                        <EyeOff className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-white">Keep it private for now</p>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            AI usage is still tracked privately for your own records.
                            You can change this any time in Settings.
                        </p>
                    </div>
                </button>
            </div>
        </div>
    );
}

// ─── Step 5: Profile details ──────────────────────────────────────────────────

function Step5Profile({
    fullName,
    username,
    bio,
    usernameStatus,
    onNameChange,
    onUsernameChange,
    onBioChange,
}: {
    fullName: string;
    username: string;
    bio: string;
    usernameStatus: UsernameStatus;
    onNameChange: (v: string) => void;
    onUsernameChange: (v: string) => void;
    onBioChange: (v: string) => void;
}) {
    const usernameHint: Record<UsernameStatus, { text: string; color: string } | null> = {
        idle: null,
        checking: { text: "Checking availability…", color: "text-slate-400" },
        available: { text: "Username is available", color: "text-emerald-400" },
        taken: { text: "That username is already taken", color: "text-red-400" },
        invalid: {
            text: "3–50 characters, lowercase letters, numbers, and hyphens only",
            color: "text-amber-400",
        },
    };
    const hint = usernameHint[usernameStatus];

    return (
        <div>
            <StepHeading
                step={5}
                title="Build your public profile"
                sub="This is what employers see when they find your WorkProof profile."
            />

            <div className="space-y-5">
                {/* Full name */}
                <div>
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-2">
                        <User className="w-3.5 h-3.5" />
                        Full name <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => onNameChange(e.target.value)}
                        placeholder="Alex Rivera"
                        maxLength={80}
                        className="w-full bg-[#111827] border border-[#1e2d45] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-colors"
                    />
                </div>

                {/* Username */}
                <div>
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-2">
                        <AtSign className="w-3.5 h-3.5" />
                        Public username <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-500 select-none pointer-events-none">
                            workproof.io/
                        </div>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => onUsernameChange(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                            placeholder="your-username"
                            maxLength={50}
                            className="w-full bg-[#111827] border border-[#1e2d45] rounded-xl pl-[7.5rem] pr-10 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-colors"
                        />
                        {usernameStatus === "checking" && (
                            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 animate-spin" />
                        )}
                        {usernameStatus === "available" && (
                            <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                        )}
                        {usernameStatus === "taken" && (
                            <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400" />
                        )}
                    </div>
                    {hint && (
                        <p className={cn("text-xs mt-1.5", hint.color)}>{hint.text}</p>
                    )}
                </div>

                {/* Bio */}
                <div>
                    <label className="flex items-center justify-between text-xs font-medium text-slate-400 mb-2">
                        <span className="flex items-center gap-2">
                            <FileText className="w-3.5 h-3.5" />
                            Bio <span className="text-slate-600">(optional)</span>
                        </span>
                        <span className={cn(bio.length > BIO_MAX ? "text-red-400" : "text-slate-600")}>
                            {bio.length}/{BIO_MAX}
                        </span>
                    </label>
                    <textarea
                        value={bio}
                        onChange={(e) => onBioChange(e.target.value)}
                        placeholder="A quick sentence or two about what you're building toward. Employers read this."
                        rows={3}
                        maxLength={BIO_MAX + 50}
                        className="w-full bg-[#111827] border border-[#1e2d45] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-colors resize-none"
                    />
                    {bio.length > BIO_MAX && (
                        <p className="text-xs text-red-400 mt-1">Bio must be {BIO_MAX} characters or less</p>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Step 6: Pick first challenge ──────────────────────────────────────────────

function Step6Challenges({
    challenges: filteredChallenges,
    selected,
    trackName,
    onSelect,
}: {
    challenges: ReturnType<typeof challenges.filter>;
    selected: string | null;
    trackName?: string;
    onSelect: (id: string) => void;
}) {
    const difficultyColor: Record<string, string> = {
        Beginner: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
        Intermediate: "text-amber-400 bg-amber-400/10 border-amber-400/20",
        Advanced: "text-red-400 bg-red-400/10 border-red-400/20",
    };

    return (
        <div>
            <StepHeading
                step={6}
                title="Pick your first challenge"
                sub={
                    trackName
                        ? `These are the best starting points for the ${trackName} track.`
                        : "Start with something that fits where you are right now."
                }
            />
            <div className="space-y-3">
                {filteredChallenges.map((c) => (
                    <button
                        key={c.id}
                        onClick={() => onSelect(c.id)}
                        className={cn(
                            "w-full flex items-start gap-4 rounded-xl border p-4 text-left transition-all duration-150",
                            selected === c.id
                                ? "border-blue-500 ring-1 ring-blue-500/40 bg-blue-500/10"
                                : "border-[#1e2d45] bg-[#111827] hover:border-white/20"
                        )}
                    >
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                <span
                                    className={cn(
                                        "text-xs px-2 py-0.5 rounded-md border font-medium",
                                        difficultyColor[c.difficulty] ?? difficultyColor.Intermediate
                                    )}
                                >
                                    {c.difficulty}
                                </span>
                                <span className="flex items-center gap-1 text-xs text-slate-500">
                                    <Clock className="w-3 h-3" />
                                    {c.estimatedTime}
                                </span>
                                <span className="flex items-center gap-1 text-xs text-slate-500">
                                    <Star className="w-3 h-3" />
                                    {c.proofValue} pts
                                </span>
                            </div>
                            <p className="text-sm font-semibold text-white leading-snug">{c.title}</p>
                            <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                                {c.description}
                            </p>
                        </div>
                        {selected === c.id && (
                            <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}

// ─── Shared heading component ──────────────────────────────────────────────────

function StepHeading({
    step,
    title,
    sub,
}: {
    step: number;
    title: string;
    sub: string;
}) {
    const encouragement = [
        "Let's get you set up.",
        "Good — now tell us a bit more.",
        "You're doing great.",
        "One more important question.",
        "Almost there.",
        "Last step — then you're in.",
    ];

    return (
        <div className="mb-7">
            <p className="text-xs font-medium text-blue-400 uppercase tracking-widest mb-2">
                {encouragement[step - 1] ?? `Step ${step}`}
            </p>
            <h1 className="text-2xl font-bold text-white leading-snug">{title}</h1>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">{sub}</p>
        </div>
    );
}
