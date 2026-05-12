"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import {
    cohortMeta,
    cohortStats,
    students,
    recentSubmissions,
    cohortSkillGaps,
} from "@/data/bootcamp";
import {
    Users,
    Zap,
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    Clock,
    Award,
    Shield,
    BarChart2,
    ChevronRight,
    Star,
    ExternalLink,
    Building2,
    GraduationCap,
    Eye,
    Info,
    Calendar,
} from "lucide-react";
import type { BootcampStudent } from "@/data/bootcamp";

// --- Helpers ---
function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return "Yesterday";
    return `${days}d ago`;
}

function statusConfig(status: BootcampStudent["status"]) {
    switch (status) {
        case "employer-ready":
            return { label: "Employer Ready", colorClass: "text-emerald-400", bgClass: "bg-emerald-500/10 border-emerald-500/20" };
        case "on-track":
            return { label: "On Track", colorClass: "text-blue-400", bgClass: "bg-blue-500/10 border-blue-500/20" };
        case "needs-review":
            return { label: "Needs Review", colorClass: "text-amber-400", bgClass: "bg-amber-500/10 border-amber-500/20" };
        case "at-risk":
            return { label: "At Risk", colorClass: "text-red-400", bgClass: "bg-red-500/10 border-red-500/20" };
    }
}

function scoreColor(score: number) {
    if (score >= 85) return "text-emerald-400";
    if (score >= 70) return "text-blue-400";
    if (score >= 55) return "text-amber-400";
    return "text-red-400";
}

const disclosureLabel: Record<string, { label: string; color: string }> = {
    none: { label: "No AI", color: "text-emerald-400" },
    brainstorm: { label: "Brainstorm only", color: "text-blue-400" },
    suggestions: { label: "AI suggestions", color: "text-violet-400" },
    heavy: { label: "Heavy AI use", color: "text-amber-400" },
    explained: { label: "AI + explained", color: "text-sky-400" },
};

type TabId = "overview" | "students" | "submissions" | "gaps" | "employers";

const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview", icon: BarChart2 },
    { id: "students", label: "Students", icon: Users },
    { id: "submissions", label: "Recent Submissions", icon: Zap },
    { id: "gaps", label: "Skill Gaps", icon: TrendingUp },
    { id: "employers", label: "Employer Ready", icon: Building2 },
];

export default function BootcampDashboardPage() {
    const [activeTab, setActiveTab] = useState<TabId>("overview");
    const [studentFilter, setStudentFilter] = useState<BootcampStudent["status"] | "all">("all");

    const progressPct = Math.round((cohortMeta.weekNumber / cohortMeta.totalWeeks) * 100);

    const employerReady = students.filter((s) => s.status === "employer-ready");
    const needsReview = students.filter((s) => s.status === "needs-review" || s.status === "at-risk");
    const filteredStudents =
        studentFilter === "all" ? students : students.filter((s) => s.status === studentFilter);

    return (
        <AppShell title="Bootcamp Dashboard">
            {/* Header */}
            <div className="rounded-xl border border-[#1e2d45] bg-[#111827] p-5 mb-6">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center shrink-0">
                            <GraduationCap className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-base font-bold text-white">{cohortMeta.name}</h1>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400">
                                    Week {cohortMeta.weekNumber} of {cohortMeta.totalWeeks}
                                </span>
                            </div>
                            <p className="text-sm text-slate-400 mt-0.5">
                                {cohortMeta.program} · {cohortMeta.city} · Instructor: {cohortMeta.instructor}
                            </p>
                            <div className="flex items-center gap-2 mt-3">
                                <div className="flex-1 max-w-xs h-2 bg-[#1e2d45] rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-violet-500 to-blue-500 rounded-full"
                                        style={{ width: `${progressPct}%` }}
                                    />
                                </div>
                                <span className="text-xs text-slate-400">{progressPct}% through program</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <Calendar className="w-3.5 h-3.5" />
                            Ends {new Date(cohortMeta.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </div>
                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors">
                            <ExternalLink className="w-3.5 h-3.5" /> Share Cohort Report
                        </button>
                    </div>
                </div>
            </div>

            {/* Stat strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
                {[
                    { label: "Total Students", value: cohortStats.totalStudents, icon: Users, accent: "text-slate-300" },
                    { label: "Active This Week", value: cohortStats.activeThisWeek, icon: Zap, accent: "text-blue-400" },
                    { label: "Challenges Done", value: cohortStats.challengesCompleted, icon: CheckCircle2, accent: "text-emerald-400" },
                    { label: "Avg Proof Score", value: cohortStats.avgProofScore, icon: Award, accent: "text-violet-400" },
                    { label: "Employer Ready", value: cohortStats.employerReadyCount, icon: Star, accent: "text-emerald-400" },
                    { label: "Needs Review", value: cohortStats.needsReviewCount + cohortStats.atRiskCount, icon: AlertCircle, accent: "text-amber-400" },
                    { label: "Avg AI Transparency", value: `${cohortStats.avgAiTransparency}%`, icon: Shield, accent: "text-violet-400" },
                ].map((stat) => (
                    <div key={stat.label} className="rounded-xl border border-[#1e2d45] bg-[#111827] p-4 flex flex-col gap-1.5">
                        <stat.icon className={`w-4 h-4 ${stat.accent}`} />
                        <div className={`text-xl font-bold ${stat.accent}`}>{stat.value}</div>
                        <div className="text-xs text-slate-500 leading-tight">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 border-b border-[#1e2d45] mb-6 overflow-x-auto">
                {tabs.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        onClick={() => setActiveTab(id)}
                        className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap border-b-2 -mb-px ${activeTab === id
                                ? "border-blue-500 text-white"
                                : "border-transparent text-slate-400 hover:text-slate-300"
                            }`}
                    >
                        <Icon className="w-3.5 h-3.5" />
                        {label}
                    </button>
                ))}
            </div>

            {/* ── Tab: Overview ── */}
            {activeTab === "overview" && (
                <div className="space-y-6">
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Needs review */}
                        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <AlertCircle className="w-4 h-4 text-amber-400" />
                                <h2 className="text-sm font-semibold text-white">Needs Review ({needsReview.length})</h2>
                            </div>
                            <div className="space-y-3">
                                {needsReview.map((s) => {
                                    const cfg = statusConfig(s.status);
                                    return (
                                        <div key={s.id} className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                                {s.initials}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-white truncate">{s.name}</p>
                                                <p className="text-xs text-slate-500">{s.challengesCompleted} challenges · Last active {timeAgo(s.lastActive)}</p>
                                            </div>
                                            <span className={`text-xs px-2 py-0.5 rounded-full border ${cfg.bgClass} ${cfg.colorClass} shrink-0`}>
                                                {cfg.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Top performers */}
                        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <Star className="w-4 h-4 text-emerald-400" />
                                <h2 className="text-sm font-semibold text-white">Top Performers</h2>
                            </div>
                            <div className="space-y-3">
                                {students
                                    .slice()
                                    .sort((a, b) => b.proofScore - a.proofScore)
                                    .slice(0, 5)
                                    .map((s, i) => (
                                        <div key={s.id} className="flex items-center gap-3">
                                            <span className="text-xs font-bold text-slate-500 w-5 text-right">{i + 1}</span>
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-600 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                                {s.initials}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-white truncate">{s.name}</p>
                                                <p className="text-xs text-slate-500">{s.track}</p>
                                            </div>
                                            <span className="text-sm font-bold text-emerald-400 tabular-nums">{s.proofScore}</span>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        {/* Cohort skill gap snapshot */}
                        <div className="rounded-xl border border-[#1e2d45] bg-[#111827] p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <TrendingUp className="w-4 h-4 text-blue-400" />
                                <h2 className="text-sm font-semibold text-white">Top Skill Gaps</h2>
                            </div>
                            <div className="space-y-3">
                                {cohortSkillGaps.slice(0, 5).map((gap) => (
                                    <div key={gap.skill}>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs text-slate-300">{gap.skill}</span>
                                            <span className="text-xs text-amber-400 font-medium">{gap.studentsBelow} students below benchmark</span>
                                        </div>
                                        <div className="relative h-2 bg-[#1e2d45] rounded-full overflow-hidden">
                                            <div
                                                className="absolute h-full bg-amber-500/60 rounded-full"
                                                style={{ width: `${gap.industryBenchmark}%` }}
                                            />
                                            <div
                                                className="absolute h-full bg-amber-400 rounded-full"
                                                style={{ width: `${gap.cohortAvg}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between mt-0.5">
                                            <span className="text-[10px] text-slate-500">Cohort avg: {gap.cohortAvg}</span>
                                            <span className="text-[10px] text-slate-600">Benchmark: {gap.industryBenchmark}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Recent submissions preview */}
                    <div className="rounded-xl border border-[#1e2d45] bg-[#111827] p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-blue-400" />
                                <h2 className="text-sm font-semibold text-white">Recent Submissions</h2>
                            </div>
                            <button
                                onClick={() => setActiveTab("submissions")}
                                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                            >
                                View all <ChevronRight className="w-3 h-3" />
                            </button>
                        </div>
                        <div className="space-y-2">
                            {recentSubmissions.slice(0, 4).map((sub) => (
                                <div key={sub.id} className="flex items-center gap-3 p-3 rounded-lg bg-[#0d1424] border border-[#1a2540]">
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                        {sub.studentInitials}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-white font-medium truncate">{sub.challengeTitle}</p>
                                        <p className="text-xs text-slate-500">{sub.studentName} · {timeAgo(sub.submittedAt)}</p>
                                    </div>
                                    <span className={`text-sm font-bold tabular-nums ${scoreColor(sub.score)}`}>{sub.score}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Employer partner section */}
                    <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <Building2 className="w-4 h-4 text-blue-400" />
                            <h2 className="text-sm font-semibold text-white">Partner Employers</h2>
                        </div>
                        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                            These companies receive WorkProof cohort briefs for this program. Employer-ready candidates are surfaced automatically when their Proof Score exceeds 700 and 6+ challenges are completed.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {cohortMeta.partnerEmployers.map((emp) => (
                                <span key={emp} className="text-sm px-3 py-1 rounded-lg bg-[#111827] border border-[#1e2d45] text-white font-medium">
                                    {emp}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Tab: Students ── */}
            {activeTab === "students" && (
                <div className="space-y-4">
                    {/* Filter */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {(["all", "employer-ready", "on-track", "needs-review", "at-risk"] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setStudentFilter(f)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${studentFilter === f
                                        ? "bg-blue-600/20 border-blue-500/40 text-blue-400"
                                        : "bg-transparent border-[#1e2d45] text-slate-400 hover:text-slate-300"
                                    }`}
                            >
                                {f === "all" ? "All Students" : statusConfig(f as BootcampStudent["status"]).label}
                                {f === "at-risk" || f === "needs-review" ? (
                                    <span className="ml-1.5 text-amber-400">
                                        {students.filter((s) => s.status === f).length}
                                    </span>
                                ) : null}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-3">
                        {filteredStudents.map((s) => {
                            const cfg = statusConfig(s.status);
                            const pct = Math.round((s.challengesCompleted / s.challengesTotal) * 100);
                            return (
                                <div key={s.id} className="rounded-xl border border-[#1e2d45] bg-[#111827] p-5">
                                    <div className="flex items-start gap-4 flex-wrap">
                                        {/* Avatar + info */}
                                        <div className="flex items-start gap-3 flex-1 min-w-0">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                                                {s.initials}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <p className="text-sm font-semibold text-white">{s.name}</p>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full border ${cfg.bgClass} ${cfg.colorClass}`}>
                                                        {cfg.label}
                                                    </span>
                                                    {s.linkedinReady && (
                                                        <span className="text-xs px-2 py-0.5 rounded-full border bg-emerald-500/10 border-emerald-500/20 text-emerald-400">
                                                            LinkedIn Ready
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-slate-500 mt-0.5">{s.track} · Last active {timeAgo(s.lastActive)}</p>
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="flex items-center gap-6 flex-wrap shrink-0">
                                            <div className="text-center">
                                                <div className="text-base font-bold text-white tabular-nums">{s.proofScore}</div>
                                                <div className="text-[10px] text-slate-500">Proof Score</div>
                                            </div>
                                            <div className="text-center">
                                                <div className={`text-base font-bold tabular-nums ${scoreColor(s.avgScore)}`}>{s.avgScore}</div>
                                                <div className="text-[10px] text-slate-500">Avg Score</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-base font-bold text-white tabular-nums">{s.challengesCompleted}<span className="text-slate-500 text-xs">/{s.challengesTotal}</span></div>
                                                <div className="text-[10px] text-slate-500">Challenges</div>
                                            </div>
                                            <div className="text-center">
                                                <div className={`text-base font-bold tabular-nums ${s.aiTransparency >= 80 ? "text-violet-400" : s.aiTransparency >= 60 ? "text-blue-400" : "text-amber-400"}`}>{s.aiTransparency}%</div>
                                                <div className="text-[10px] text-slate-500">AI Transparency</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Progress bar */}
                                    <div className="mt-4">
                                        <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                                            <span>Program progress</span>
                                            <span>{pct}%</span>
                                        </div>
                                        <div className="h-1.5 bg-[#1e2d45] rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${s.status === "at-risk" ? "bg-red-500" : s.status === "needs-review" ? "bg-amber-500" : "bg-blue-500"}`}
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Skill gaps / strengths */}
                                    {(s.strengths.length > 0 || s.skillGaps.length > 0) && (
                                        <div className="mt-3 flex gap-4 flex-wrap">
                                            {s.strengths.length > 0 && (
                                                <div className="flex flex-wrap gap-1">
                                                    {s.strengths.map((sk) => (
                                                        <span key={sk} className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                                            ✓ {sk}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                            {s.skillGaps.length > 0 && (
                                                <div className="flex flex-wrap gap-1">
                                                    {s.skillGaps.map((sk) => (
                                                        <span key={sk} className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400">
                                                            ↑ {sk}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ── Tab: Submissions ── */}
            {activeTab === "submissions" && (
                <div className="space-y-3">
                    <p className="text-xs text-slate-500">
                        {recentSubmissions.length} submissions this week · Cohort avg score this week: <span className="text-white font-medium">{cohortStats.avgScore}/100</span>
                    </p>
                    {recentSubmissions.map((sub) => {
                        const disc = disclosureLabel[sub.aiDisclosure];
                        return (
                            <div key={sub.id} className="rounded-xl border border-[#1e2d45] bg-[#111827] p-5">
                                <div className="flex items-start gap-4 flex-wrap">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                                        {sub.studentInitials}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-white">{sub.challengeTitle}</p>
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            {sub.studentName} · {sub.track}
                                        </p>
                                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                                            <span className={`text-xs font-medium ${disc.color}`}>
                                                {disc.label}
                                            </span>
                                            <span className="text-xs text-slate-500">{timeAgo(sub.submittedAt)}</span>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <div className={`text-2xl font-bold tabular-nums ${scoreColor(sub.score)}`}>{sub.score}</div>
                                        <div className="text-xs text-slate-500">/ 100</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── Tab: Skill Gaps ── */}
            {activeTab === "gaps" && (
                <div className="space-y-6">
                    <div className="flex items-start gap-3 p-4 rounded-xl border border-blue-500/20 bg-blue-500/5">
                        <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                        <p className="text-sm text-slate-300 leading-relaxed">
                            Skill gaps are calculated from challenge submission scores across the cohort. Industry benchmarks reflect employer-reported minimum expectations for junior and mid-level roles. Use these to plan targeted workshops or recommend specific challenges.
                        </p>
                    </div>

                    <div className="space-y-5">
                        {cohortSkillGaps.map((gap) => {
                            const delta = gap.industryBenchmark - gap.cohortAvg;
                            return (
                                <div key={gap.skill} className="rounded-xl border border-[#1e2d45] bg-[#111827] p-5">
                                    <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
                                        <div>
                                            <h3 className="text-sm font-semibold text-white">{gap.skill}</h3>
                                            <p className="text-xs text-slate-500 mt-0.5">
                                                {gap.studentsBelow} of {cohortStats.totalStudents} students below industry benchmark
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs text-amber-400 font-semibold">
                                                {delta} point gap
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-slate-500 w-32 shrink-0">Cohort average</span>
                                            <div className="flex-1 h-3 bg-[#1e2d45] rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-amber-400 rounded-full"
                                                    style={{ width: `${gap.cohortAvg}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-white font-bold tabular-nums w-8 text-right">{gap.cohortAvg}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-slate-500 w-32 shrink-0">Industry benchmark</span>
                                            <div className="flex-1 h-3 bg-[#1e2d45] rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-slate-400/40 rounded-full"
                                                    style={{ width: `${gap.industryBenchmark}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-slate-400 font-medium tabular-nums w-8 text-right">{gap.industryBenchmark}</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-[#1e2d45] flex items-center gap-2">
                                        <Zap className="w-3.5 h-3.5 text-blue-400" />
                                        <p className="text-xs text-blue-400 font-medium">
                                            Assign a targeted challenge in this area to close the gap before program end.
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ── Tab: Employer Ready ── */}
            {activeTab === "employers" && (
                <div className="space-y-6">
                    <div className="flex items-start gap-3 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <p className="text-sm text-slate-300 leading-relaxed">
                            <span className="text-white font-medium">{employerReady.length} candidates</span> in this cohort meet the employer-ready threshold: Proof Score 700+, 6+ challenges completed, avg score 80+, and AI transparency 75+. Their profiles are automatically surfaced to partner employers.
                        </p>
                    </div>

                    {/* Partner employers */}
                    <div className="rounded-xl border border-[#1e2d45] bg-[#111827] p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <Building2 className="w-4 h-4 text-blue-400" />
                            <h2 className="text-sm font-semibold text-white">Partner Employers</h2>
                        </div>
                        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                            These companies receive a cohort brief when the program ends, including a table of employer-ready candidates, their Proof Scores, skill highlights, and AI transparency ratings. No resumes. No cold outreach from students.
                        </p>
                        <div className="grid sm:grid-cols-3 gap-3">
                            {cohortMeta.partnerEmployers.map((emp) => (
                                <div key={emp} className="rounded-lg border border-[#1e2d45] bg-[#0d1424] p-3 text-center">
                                    <p className="text-sm font-semibold text-white">{emp}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">Hiring partner</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Employer ready cards */}
                    <div className="space-y-4">
                        {employerReady.map((s) => (
                            <div key={s.id} className="rounded-xl border border-emerald-500/20 bg-[#111827] p-5">
                                <div className="flex items-start gap-4 flex-wrap">
                                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-600 to-blue-600 flex items-center justify-center text-white font-bold shrink-0">
                                        {s.initials}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="text-sm font-semibold text-white">{s.name}</p>
                                            <span className="text-xs px-2 py-0.5 rounded-full border bg-emerald-500/10 border-emerald-500/20 text-emerald-400">
                                                Employer Ready
                                            </span>
                                            {s.linkedinReady && (
                                                <span className="text-xs px-2 py-0.5 rounded-full border bg-blue-500/10 border-blue-500/20 text-blue-400">
                                                    LinkedIn Ready
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-500 mt-0.5">{s.track}</p>
                                        {s.strengths.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {s.strengths.map((sk) => (
                                                    <span key={sk} className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                                        {sk}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-5 shrink-0 flex-wrap">
                                        <div className="text-center">
                                            <div className="text-lg font-bold text-white">{s.proofScore}</div>
                                            <div className="text-[10px] text-slate-500">Proof Score</div>
                                        </div>
                                        <div className="text-center">
                                            <div className={`text-lg font-bold ${scoreColor(s.avgScore)}`}>{s.avgScore}</div>
                                            <div className="text-[10px] text-slate-500">Avg Score</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-lg font-bold text-violet-400">{s.aiTransparency}%</div>
                                            <div className="text-[10px] text-slate-500">AI Transparency</div>
                                        </div>
                                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors">
                                            <Eye className="w-3.5 h-3.5" /> View Profile
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Ethics callout */}
                    <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-5">
                        <div className="flex items-start gap-3">
                            <Shield className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                            <div>
                                <h3 className="text-sm font-semibold text-white mb-1">How WorkProof surfaces candidates ethically</h3>
                                <ul className="space-y-1.5 mt-2">
                                    {[
                                        "Students opt in to employer visibility — profiles are private by default",
                                        "Employers see evidence from real work, not AI-generated resumes",
                                        "AI usage is disclosed per submission — employers know exactly how work was done",
                                        "No demographic, age, location, or photo data is shared with employers without consent",
                                        "WorkProof does not rank candidates against each other — evidence is presented, not stacked",
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
            )}

            {/* B2B value callout — always visible at bottom */}
            <div className="mt-10 rounded-xl border border-violet-500/20 bg-violet-500/5 p-6">
                <div className="flex items-start gap-4 flex-wrap">
                    <div className="w-10 h-10 rounded-xl bg-violet-600/20 flex items-center justify-center shrink-0">
                        <GraduationCap className="w-5 h-5 text-violet-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-base font-semibold text-white mb-1">WorkProof for Bootcamps & Workforce Programs</h2>
                        <p className="text-sm text-slate-300 leading-relaxed mb-4">
                            WorkProof replaces generic graduation certificates with verified, employer-readable evidence. Students build a proof portfolio over the course of your program. Instructors get real-time signal on who&apos;s progressing, who needs support, and who is genuinely ready to hire. Employers trust the output because the work is real.
                        </p>
                        <div className="grid sm:grid-cols-3 gap-4">
                            {[
                                { icon: BarChart2, title: "Live cohort analytics", desc: "Track progress, skill gaps, and engagement across your entire cohort — updated in real time." },
                                { icon: Building2, title: "Direct employer pipeline", desc: "Partner employers receive curated talent briefs at program end, matched to verified skills — not keywords." },
                                { icon: Award, title: "Proof certificates", desc: "Graduates leave with a shareable, evidence-backed profile they can show on LinkedIn, portfolios, and in interviews." },
                            ].map(({ icon: Icon, title, desc }) => (
                                <div key={title} className="rounded-lg border border-violet-500/10 bg-[#111827] p-4">
                                    <Icon className="w-4 h-4 text-violet-400 mb-2" />
                                    <p className="text-sm font-medium text-white mb-1">{title}</p>
                                    <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 flex gap-3 flex-wrap">
                            <button className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors">
                                Request a Demo
                            </button>
                            <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-[#1e2d45] text-white text-sm font-medium rounded-lg transition-colors">
                                Download Program Guide
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
