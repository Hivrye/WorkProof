"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Code2, Palette, BarChart3, Headphones, Megaphone, Film,
    TrendingUp, ClipboardList, CalendarCheck, Box, ShieldCheck, Layers,
    ArrowRight, ArrowLeft, CheckCircle2, Briefcase, FolderOpen,
    Repeat2, Dumbbell, Eye, EyeOff, Clock, Zap, Shield, Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useOnboarding } from "@/store/onboarding-store";
import { tracks } from "@/data/tracks";
import { challenges } from "@/data/challenges";
import type { ExperienceLevel, OnboardingGoal, OnboardingProfile } from "@/types";

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

const TOTAL_STEPS = 5;

// ─── Page component ────────────────────────────────────────────────────────────

export default function OnboardingPage() {
    const router = useRouter();
    const { completed, completeOnboarding } = useOnboarding();

    const [step, setStep] = useState(1);
    const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward

    // Step field values
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel | null>(null);
    const [goal, setGoal] = useState<OnboardingGoal | null>(null);
    const [showAi, setShowAi] = useState<boolean | null>(null);
    const [firstChallenge, setFirstChallenge] = useState<string | null>(null);

    // If already onboarded, skip straight to dashboard
    useEffect(() => {
        if (completed) router.replace("/dashboard");
    }, [completed, router]);

    const selectedTrack = tracks.find((t) => t.id === selectedRole);

    // Challenges filtered for step 5 — prefer beginner/intermediate from chosen track
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
        if (step === 5) return firstChallenge !== null;
        return false;
    }

    function advance() {
        if (!canAdvance()) return;
        if (step < TOTAL_STEPS) {
            setDirection(1);
            setStep((s) => s + 1);
        } else {
            handleFinish();
        }
    }

    function back() {
        if (step > 1) {
            setDirection(-1);
            setStep((s) => s - 1);
        }
    }

    function handleFinish() {
        if (!selectedRole || !experienceLevel || !goal || showAi === null || !firstChallenge) return;
        const track = tracks.find((t) => t.id === selectedRole);
        const profile: OnboardingProfile = {
            roleId: selectedRole,
            roleName: track?.name ?? selectedRole,
            experienceLevel,
            goal,
            showAiOnProfile: showAi,
            firstChallengeId: firstChallenge,
            completedAt: new Date().toISOString(),
        };
        completeOnboarding(profile);
        router.push("/dashboard");
    }

    return (
        <div className="min-h-screen bg-[#0b0f1a] flex flex-col items-center justify-start px-4 py-12">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-10">
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="text-white font-bold text-lg tracking-tight">WorkProof</span>
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
                            <Step5
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
                    disabled={!canAdvance()}
                    className={cn(
                        "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all",
                        canAdvance()
                            ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/30"
                            : "bg-[#1e2d45] text-slate-500 cursor-not-allowed"
                    )}
                >
                    {step === TOTAL_STEPS ? (
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

// ─── Step 5: Pick first challenge ──────────────────────────────────────────────

function Step5({
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
                step={5}
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
