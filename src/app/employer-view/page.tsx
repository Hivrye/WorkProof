"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { SkillBars } from "@/components/proof/SkillBar";
import { DisclosureBadge } from "@/components/proof/DisclosureBadge";
import { mockUser } from "@/data/user";
import { submissions } from "@/data/submissions";
import {
    Shield,
    CheckCircle2,
    AlertCircle,
    MessageSquare,
    Star,
    TrendingUp,
    ExternalLink,
    Briefcase,
    MapPin,
    Wifi,
    Clock,
    FileText,
    Info,
    Award,
    ThumbsUp,
    ThumbsDown,
    Minus,
    Zap,
    GitBranch,
} from "lucide-react";

// --- Work quality notes per submission ---
const workQualityNotes: Record<string, { summary: string; standout: string; concern: string }> = {
    "sub-001": {
        summary:
            "Outstanding submission. Alex systematically audited the page using Lighthouse, axe DevTools, and manual keyboard testing. Score improved from 43 to 97 — a documented, reproducible result.",
        standout:
            "Replaced div-based buttons with real semantic elements rather than patching with ARIA — shows deep understanding of HTML semantics, not just surface-level fixes.",
        concern:
            "Focus styles were acknowledged as still relying on browser defaults. Minor issue — the self-critique was unprompted, which is the positive signal here.",
    },
    "sub-002": {
        summary:
            "Solid componentization work. Built a data-driven card system using CSS custom properties rather than bespoke per-type styling. The output is extensible and consistent.",
        standout:
            "Used CSS auto-fill grid with minmax instead of explicit media query breakpoints — a more elegant responsiveness solution most junior candidates skip over.",
        concern:
            "Process notes are lighter than submission 1. Fewer timestamped steps documented. Would have liked more reasoning behind the final grid column count decisions.",
    },
};

// --- Skill evidence breakdown ---
const skillEvidence = [
    {
        skill: "Accessibility",
        score: 88,
        evidence: [
            "Audited with Lighthouse, axe DevTools, and manual keyboard testing",
            "Replaced div-buttons with <button> elements — fixed at the root, not patched with ARIA",
            "Achieved Lighthouse accessibility score 97, up from 43",
            "Demonstrates understanding of WCAG 2.1 AA from first principles",
        ],
        submissionRef: "Fix Accessibility Issues in a Landing Page",
    },
    {
        skill: "UI Implementation",
        score: 82,
        evidence: [
            "Built a complete, responsive dashboard card system using CSS Grid",
            "Implemented data-driven components with CSS custom properties for theming",
            "Tested at 320px, 768px, and 1440px — not just 'looks good on my screen'",
            "Auto-fill grid layout responds without breakpoints",
        ],
        submissionRef: "Create a Responsive Dashboard Card System",
    },
    {
        skill: "Communication",
        score: 71,
        evidence: [
            "Every submission includes a structured decision log explaining what was done and why",
            "Self-critiques are specific and honest without prompting",
            "Clearly distinguishes personal contribution from AI-assisted work in all disclosures",
            "Written explanations are professional and readable by non-technical reviewers",
        ],
        submissionRef: "All submissions",
    },
];

// --- Signals ---
const strengths = [
    "Clear, specific decision logs in every submission",
    "Accessibility depth is above average — scored 92, Lighthouse from 43 → 97",
    "Unprompted, honest self-critique in every review section",
    "AI use disclosed with clear distinctions of personal vs. AI contribution",
    "Responsive layout choices reflect architectural thinking, not just visual execution",
    "Consistent quality across two different challenge types",
];

const riskSignals = [
    "4 challenges completed — sample size is small; consider asking for 1â€“2 more before a final call",
    "No advanced-level challenge completions yet; strongest evidence is Intermediate",
    "Work is concentrated in front-end UI — limited evidence of back-end or API integration skills",
];

// --- Interview questions ---
const interviewQuestions = [
    {
        question: "Walk me through your accessibility audit process. What did you check first, and why?",
        context: "Fix Accessibility Issues in a Landing Page",
        rationale:
            "Tests whether the process was deliberate or tool-guided. A strong answer describes manual keyboard testing before automated tools.",
    },
    {
        question: "Why did you choose CSS auto-fill grid over explicit media query breakpoints?",
        context: "Create a Responsive Dashboard Card System",
        rationale:
            "Probes depth of CSS layout understanding. A strong answer explains the trade-offs, not just 'it was simpler'.",
    },
    {
        question: "Which parts of your submissions did AI help with — and what did you build entirely yourself?",
        context: "AI Transparency Review",
        rationale:
            "Confirms self-reported AI use. Look for specific, honest answers. Vague responses warrant follow-up.",
    },
    {
        question:
            "You mentioned you'd improve the focus visible styles. How would you do that — specifically?",
        context: "Self-critique on accessibility challenge",
        rationale:
            "Tests whether the self-critique was genuine. A real answer references :focus-visible and custom outline styles.",
    },
    {
        question: "How do you decide when to use a native HTML element vs. adding ARIA manually?",
        context: "Accessibility & Semantic HTML Skills",
        rationale:
            "Tests HTML philosophy. The right answer: native elements first, ARIA only when no native alternative exists.",
    },
    {
        question:
            "If you were adding skeleton loading states to the dashboard card system, how would you approach it?",
        context: "Improvement notes on dashboard challenge",
        rationale:
            "Tests whether they can extend their own work. Directly connects to what they said they would improve.",
    },
];

// --- Hiring recommendation options ---
type RecommendationKey = "strong-yes" | "yes" | "maybe" | "no";
const recommendations: Record<
    RecommendationKey,
    { label: string; colorClass: string; borderClass: string; bgClass: string; icon: React.ReactNode; rationale: string }
> = {
    "strong-yes": {
        label: "Strong Yes",
        colorClass: "text-emerald-400",
        borderClass: "border-emerald-500",
        bgClass: "bg-emerald-500/10",
        icon: <Zap className="w-4 h-4" />,
        rationale:
            "Alex demonstrates exceptional work quality, self-awareness, and transparency for their experience level. The accessibility challenge score (92/100) is in the top 15% of WorkProofolio submissions. Recommend proceeding to a technical interview with high confidence.",
    },
    "yes": {
        label: "Yes",
        colorClass: "text-blue-400",
        borderClass: "border-blue-500",
        bgClass: "bg-blue-500/10",
        icon: <ThumbsUp className="w-4 h-4" />,
        rationale:
            "Alex shows consistent quality, honest self-assessment, and strong accessibility skills. 4 challenges are sufficient to proceed. Recommend a focused technical interview on their front-end strengths.",
    },
    "maybe": {
        label: "Maybe",
        colorClass: "text-amber-400",
        borderClass: "border-amber-500",
        bgClass: "bg-amber-500/10",
        icon: <Minus className="w-4 h-4" />,
        rationale:
            "Promising candidate with good fundamentals, but the challenge sample is small and concentrated in front-end UI. Consider requesting 1â€“2 additional challenges in different skill areas before committing to an interview.",
    },
    "no": {
        label: "No",
        colorClass: "text-red-400",
        borderClass: "border-red-500",
        bgClass: "bg-red-500/10",
        icon: <ThumbsDown className="w-4 h-4" />,
        rationale:
            "Based on this evidence, the skill depth or role alignment doesn't meet your current requirements. The candidate may be a stronger fit for other roles or in 6â€“12 months with more challenge completions.",
    },
};

// --- Role fit skill bars ---
const skillFit = [
    { name: "Front-End Development", match: 78 },
    { name: "Accessibility", match: 91 },
    { name: "UI Implementation", match: 82 },
    { name: "Communication", match: 71 },
    { name: "AI Collaboration", match: 91 },
];

export default function EmployerViewPage() {
    const [selectedRec, setSelectedRec] = useState<RecommendationKey | null>(null);
    const [showRationale, setShowRationale] = useState<number | null>(null);

    return (
        <AppShell title="Employer Preview">
            {/* Banner */}
            <div className="rounded-xl border border-[#1e2d45] bg-[#111827] p-4 mb-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Briefcase className="w-4 h-4 text-blue-400 shrink-0" />
                    <div>
                        <p className="text-sm text-white font-medium">Employer-Facing Proof Profile</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Share this link with hiring managers. They see this view — not the candidate&apos;s private dashboard.
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => navigator.clipboard.writeText(window.location.href)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors shrink-0"
                >
                    <ExternalLink className="w-3.5 h-3.5" /> Copy Link
                </button>
            </div>

            {/* Candidate Overview */}
            <div className="rounded-xl border border-[#1e2d45] bg-[#111827] p-6 mb-6">
                <div className="flex items-start justify-between gap-6 flex-wrap">
                    <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-xl shrink-0">
                            {mockUser.avatarInitials}
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">{mockUser.name}</h1>
                            <p className="text-sm text-blue-400 mt-0.5">
                                {mockUser.targetRole} · {mockUser.level}
                            </p>
                            <div className="flex items-center gap-4 mt-2 flex-wrap">
                                <span className="flex items-center gap-1.5 text-xs text-slate-400">
                                    <MapPin className="w-3.5 h-3.5" /> {mockUser.location}
                                </span>
                                <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                                    <Wifi className="w-3.5 h-3.5" /> Open to remote
                                </span>
                                <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                                    <Clock className="w-3.5 h-3.5" /> Immediately available
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 flex-wrap">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white">{mockUser.proofScore.total}</div>
                            <div className="text-xs text-slate-500 mt-0.5">Proof Score</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-emerald-400">{mockUser.avgScore}</div>
                            <div className="text-xs text-slate-500 mt-0.5">Avg Score</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white">{mockUser.completedChallenges}</div>
                            <div className="text-xs text-slate-500 mt-0.5">Challenges</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-violet-400">91%</div>
                            <div className="text-xs text-slate-500 mt-0.5">AI Transparency</div>
                        </div>
                    </div>
                </div>
                <p className="text-sm text-slate-300 mt-5 leading-relaxed border-t border-[#1e2d45] pt-4">
                    {mockUser.bio}
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Hiring Recommendation */}
                    <div className="rounded-xl border border-[#1e2d45] bg-[#111827] p-6">
                        <div className="flex items-center gap-2 mb-2">
                            <Award className="w-4 h-4 text-blue-400" />
                            <h2 className="text-base font-semibold text-white">Hiring Recommendation</h2>
                        </div>
                        <p className="text-xs text-slate-500 mb-5">
                            Record your assessment based on the evidence below. This stays private to your team.
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                            {(Object.entries(recommendations) as [RecommendationKey, (typeof recommendations)[RecommendationKey]][]).map(
                                ([key, rec]) => (
                                    <button
                                        key={key}
                                        onClick={() => setSelectedRec(key)}
                                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${selectedRec === key
                                            ? `${rec.borderClass} ${rec.bgClass} ${rec.colorClass}`
                                            : "border-[#1e2d45] text-slate-400 hover:border-slate-500 hover:text-slate-300"
                                            }`}
                                    >
                                        <span className={selectedRec === key ? rec.colorClass : ""}>{rec.icon}</span>
                                        <span className="text-xs font-semibold">{rec.label}</span>
                                    </button>
                                )
                            )}
                        </div>
                        {selectedRec && (
                            <div
                                className={`rounded-lg border ${recommendations[selectedRec].borderClass} ${recommendations[selectedRec].bgClass} p-4`}
                            >
                                <p className={`text-xs font-semibold ${recommendations[selectedRec].colorClass} mb-1 uppercase tracking-wider`}>
                                    {recommendations[selectedRec].label} — Rationale
                                </p>
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    {recommendations[selectedRec].rationale}
                                </p>
                            </div>
                        )}
                        {!selectedRec && (
                            <p className="text-xs text-slate-600 text-center py-2">Select a recommendation above to see the rationale.</p>
                        )}
                    </div>

                    {/* Role Fit Summary */}
                    <div className="rounded-xl border border-[#1e2d45] bg-[#111827] p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base font-semibold text-white">Role Fit Summary</h2>
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-emerald-400" />
                                <span className="text-emerald-400 font-medium text-sm">Strong Match</span>
                            </div>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed mb-6">
                            Alex Carter is a self-taught front-end developer with a design background and two years of project experience.
                            Challenge submissions show consistent ability to deliver working, accessible front-end code with clearly documented decisions.
                            The strongest evidence is in accessibility — above average for this experience level. The communication pattern across submissions
                            suggests someone who thinks before building, documents their reasoning, and can explain trade-offs to non-technical reviewers.
                            <span className="text-slate-400"> Best fit: Junior or Mid Front-End Developer roles where accessibility and clean code matter, or teams that want transparent AI usage habits from day one.</span>
                        </p>
                        <div className="space-y-4">
                            {skillFit.map((item) => (
                                <div key={item.name} className="flex items-center gap-4">
                                    <span className="text-sm text-slate-300 w-44 shrink-0">{item.name}</span>
                                    <div className="flex-1 h-2 bg-[#1e2d45] rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all ${item.match >= 80
                                                ? "bg-emerald-500"
                                                : item.match >= 60
                                                    ? "bg-blue-500"
                                                    : "bg-amber-500"
                                                }`}
                                            style={{ width: `${item.match}%` }}
                                        />
                                    </div>
                                    <span className="text-sm text-slate-400 w-8 text-right tabular-nums">{item.match}%</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Skill Evidence Breakdown */}
                    <div>
                        <h2 className="text-base font-semibold text-white mb-4">Skill Evidence Breakdown</h2>
                        <div className="space-y-4">
                            {skillEvidence.map((item) => (
                                <div key={item.skill} className="rounded-xl border border-[#1e2d45] bg-[#111827] p-5">
                                    <div className="flex items-center justify-between gap-4 mb-3">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-semibold text-white">{item.skill}</span>
                                            <span className="text-xs text-slate-500 bg-[#1e2d45] px-2 py-0.5 rounded-full">
                                                {item.submissionRef}
                                            </span>
                                        </div>
                                        <span
                                            className={`text-sm font-bold tabular-nums ${item.score >= 85
                                                ? "text-emerald-400"
                                                : item.score >= 70
                                                    ? "text-blue-400"
                                                    : "text-amber-400"
                                                }`}
                                        >
                                            {item.score}/100
                                        </span>
                                    </div>
                                    <ul className="space-y-1.5">
                                        {item.evidence.map((e, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                                {e}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Completed Challenges */}
                    <div>
                        <h2 className="text-base font-semibold text-white mb-4">Completed Challenges</h2>
                        <div className="space-y-5">
                            {submissions.map((sub) => {
                                const notes = workQualityNotes[sub.id];
                                return (
                                    <div key={sub.id} className="rounded-xl border border-[#1e2d45] bg-[#111827] p-5 space-y-4">
                                        {/* Header */}
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <h3 className="text-sm font-semibold text-white">{sub.challengeTitle}</h3>
                                                <p className="text-xs text-slate-500 mt-0.5">{sub.track}</p>
                                            </div>
                                            <div className="flex items-center gap-3 shrink-0">
                                                <div className="text-right">
                                                    <div className="text-lg font-bold text-white">{sub.score}</div>
                                                    <div className="text-xs text-slate-500">/ 100</div>
                                                </div>
                                                <DisclosureBadge level={sub.aiDisclosure} size="sm" />
                                            </div>
                                        </div>

                                        {/* Skills */}
                                        <div className="flex flex-wrap gap-1.5">
                                            {sub.skills.map((skill) => (
                                                <span
                                                    key={skill}
                                                    className="text-xs px-2 py-0.5 rounded-full bg-[#1e2d45] text-slate-300 border border-[#243454]"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Work quality notes */}
                                        {notes && (
                                            <div className="space-y-3 pt-1">
                                                <div>
                                                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1.5">Work Quality Assessment</p>
                                                    <p className="text-sm text-slate-300 leading-relaxed">{notes.summary}</p>
                                                </div>
                                                <div className="grid sm:grid-cols-2 gap-3">
                                                    <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3">
                                                        <p className="text-xs font-medium text-emerald-400 mb-1">Standout</p>
                                                        <p className="text-xs text-slate-300 leading-relaxed">{notes.standout}</p>
                                                    </div>
                                                    <div className="rounded-lg bg-amber-500/5 border border-amber-500/20 p-3">
                                                        <p className="text-xs font-medium text-amber-400 mb-1">Worth Probing</p>
                                                        <p className="text-xs text-slate-300 leading-relaxed">{notes.concern}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Quote */}
                                        <div>
                                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">In Their Own Words</p>
                                            <blockquote className="text-sm text-slate-300 italic border-l-2 border-blue-500/40 pl-3">
                                                &ldquo;{sub.explanation.substring(0, 220)}
                                                {sub.explanation.length > 220 ? "…" : ""}&rdquo;
                                            </blockquote>
                                        </div>

                                        {/* Self-critique */}
                                        <div>
                                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">Self-Critique</p>
                                            <p className="text-sm text-slate-400">
                                                {sub.improvements.substring(0, 200)}
                                                {sub.improvements.length > 200 ? "…" : ""}
                                            </p>
                                        </div>

                                        {/* Links */}
                                        <div className="flex items-center gap-4 pt-2 border-t border-[#1e2d45]">
                                            {sub.liveLink && (
                                                <a
                                                    href={sub.liveLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                                                >
                                                    <ExternalLink className="w-3.5 h-3.5" /> Live Preview
                                                </a>
                                            )}
                                            {sub.repoLink && (
                                                <a
                                                    href={sub.repoLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
                                                >
                                                    <GitBranch className="w-3.5 h-3.5" /> Repository
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Risk Signals & Strengths */}
                    <div className="grid sm:grid-cols-2 gap-6">
                        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                <h3 className="text-sm font-semibold text-white">Strengths</h3>
                            </div>
                            <ul className="space-y-2.5">
                                {strengths.map((flag, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                        <Star className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                        {flag}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <AlertCircle className="w-4 h-4 text-amber-400" />
                                <h3 className="text-sm font-semibold text-white">Risk Signals</h3>
                            </div>
                            <ul className="space-y-2.5">
                                {riskSignals.map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                        <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* AI Usage Transparency */}
                    <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Shield className="w-4 h-4 text-violet-400" />
                            <h2 className="text-base font-semibold text-white">AI Usage Transparency</h2>
                        </div>
                        <div className="flex items-start gap-6 flex-wrap mb-5">
                            <div>
                                <div className="text-4xl font-bold text-white">
                                    91<span className="text-xl text-slate-500">/100</span>
                                </div>
                                <p className="text-xs text-slate-400 mt-1">Top 12% of candidates</p>
                            </div>
                            <p className="text-sm text-slate-300 leading-relaxed max-w-prose">
                                Alex discloses AI use in every submission and explains exactly what it helped with versus what they built themselves. This is the level of transparency that lets you hire confidently in an AI-native environment.
                            </p>
                        </div>
                        <div className="space-y-3">
                            {submissions.map((sub) => (
                                <div key={sub.id} className="flex items-start gap-3 p-3 rounded-lg bg-[#111827] border border-[#1e2d45]">
                                    <DisclosureBadge level={sub.aiDisclosure} size="sm" />
                                    <div>
                                        <p className="text-xs font-medium text-white">{sub.challengeTitle}</p>
                                        <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{sub.aiDescription}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Interview Question Generator */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="w-4 h-4 text-blue-400" />
                            <h2 className="text-base font-semibold text-white">Interview Question Generator</h2>
                        </div>
                        <p className="text-xs text-slate-500 mb-4">
                            These questions are generated from Alex&apos;s actual submissions — not generic prompts. Each one is designed to probe the specific evidence on this profile.
                        </p>
                        <div className="space-y-3">
                            {interviewQuestions.map((item, i) => (
                                <div key={i} className="rounded-xl border border-[#1e2d45] bg-[#111827] p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <p className="text-sm font-medium text-white">{item.question}</p>
                                        <button
                                            onClick={() => setShowRationale(showRationale === i ? null : i)}
                                            className="shrink-0 text-slate-500 hover:text-slate-300 transition-colors"
                                            aria-label="Toggle rationale"
                                        >
                                            <Info className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-2">
                                        <FileText className="w-3 h-3" />
                                        {item.context}
                                    </p>
                                    {showRationale === i && (
                                        <div className="mt-3 p-3 rounded-lg bg-[#1e2d45] border border-[#243454]">
                                            <p className="text-xs text-slate-400 leading-relaxed">
                                                <span className="text-slate-300 font-medium">Why ask this: </span>
                                                {item.rationale}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Ethics notice */}
                    <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-6">
                        <div className="flex items-start gap-3">
                            <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                            <div>
                                <h3 className="text-sm font-semibold text-white mb-2">
                                    WorkProofolio does not replace interviews.
                                </h3>
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    It gives employers better evidence <em>before</em> the interview. Challenge scores reflect skill demonstration in a structured task — not a complete picture of a person.
                                    WorkProofolio is designed to surface relevant signal, not to make the hiring decision for you. Use this profile to ask sharper questions, not to skip the conversation.
                                </p>
                                <ul className="mt-3 space-y-1.5">
                                    {[
                                        "Evidence is based on structured tasks, not personality assessments",
                                        "Candidates control their own AI disclosure — we don't penalize use, we reward transparency",
                                        "Scores reflect task-specific performance, not general intelligence or potential",
                                        "WorkProofolio does not store biometric, demographic, or background data",
                                    ].map((point, i) => (
                                        <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Contact CTA */}
                    <div className="rounded-xl border border-blue-500/30 bg-blue-600/10 p-5">
                        <h3 className="text-sm font-semibold text-white mb-1">Interested in this candidate?</h3>
                        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                            Alex is immediately available and open to remote roles. Reach out directly or request a full work sample.
                        </p>
                        <div className="space-y-2">
                            <button
                                onClick={() => alert("Interview request sent! Alex will be notified.")}
                                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                Request Interview
                            </button>
                            <button
                                onClick={() => alert("Proof Report download will be available in the full release.")}
                                className="w-full px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors border border-[#1e2d45]"
                            >
                                Download Proof Report
                            </button>
                        </div>
                    </div>

                    {/* Candidate Facts */}
                    <div className="rounded-xl border border-[#1e2d45] bg-[#111827] p-5">
                        <h3 className="text-sm font-semibold text-white mb-4">Candidate Facts</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Proof Score</span>
                                <span className="text-white font-semibold">{mockUser.proofScore.total} / 1000</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Challenges completed</span>
                                <span className="text-white">{mockUser.completedChallenges}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Avg. submission score</span>
                                <span className="text-emerald-400 font-medium">90 / 100</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">AI transparency</span>
                                <span className="text-violet-400 font-medium">91%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Work quality</span>
                                <span className="text-white">{mockUser.proofScore.workQuality} / 100</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Process clarity</span>
                                <span className="text-white">{mockUser.proofScore.processClarity} / 100</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Availability</span>
                                <span className="text-emerald-400">Immediately</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Remote</span>
                                <span className="text-white">Open to remote</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">On WorkProofolio since</span>
                                <span className="text-white">{new Date(mockUser.joinedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
                            </div>
                        </div>
                    </div>

                    {/* Verified Skills */}
                    <div className="rounded-xl border border-[#1e2d45] bg-[#111827] p-5">
                        <h3 className="text-sm font-semibold text-white mb-4">Verified Skill Scores</h3>
                        <SkillBars skills={mockUser.skills} size="sm" />
                    </div>

                    {/* AI Transparency sidebar */}
                    <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <Shield className="w-4 h-4 text-violet-400" />
                            <h3 className="text-sm font-semibold text-white">AI Transparency</h3>
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">
                            91<span className="text-lg text-slate-500">/100</span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Alex discloses AI use clearly in every submission. Top 12% of candidates on transparency. Every disclosure includes the specific task and their personal contribution.
                        </p>
                    </div>

                    {/* External links */}
                    <div className="rounded-xl border border-[#1e2d45] bg-[#111827] p-5">
                        <h3 className="text-sm font-semibold text-white mb-4">External Profiles</h3>
                        <div className="space-y-2">
                            {mockUser.portfolioLink && (
                                <a
                                    href={mockUser.portfolioLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    <ExternalLink className="w-3.5 h-3.5" /> Portfolio
                                </a>
                            )}
                            {mockUser.githubLink && (
                                <a
                                    href={mockUser.githubLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
                                >
                                    <GitBranch className="w-3.5 h-3.5" /> GitHub
                                </a>
                            )}
                            {mockUser.linkedinLink && (
                                <a
                                    href={mockUser.linkedinLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
                                >
                                    <ExternalLink className="w-3.5 h-3.5" /> LinkedIn
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
