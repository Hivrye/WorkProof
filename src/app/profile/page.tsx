"use client";

import { AppShell } from "@/components/layout/AppShell";
import { ProfileHeader } from "@/components/proof/ProfileHeader";
import { ProofScoreCard } from "@/components/cards/ProofScoreCard";
import { SkillBars } from "@/components/proof/SkillBar";
import { ActivityTimeline } from "@/components/proof/ActivityTimeline";
import { DisclosureBadge } from "@/components/proof/DisclosureBadge";
import { StatCard } from "@/components/cards/StatCard";
import { SectionHeading } from "@/components/ui/shared";
import { mockUser } from "@/data/user";
import { submissions as seedSubmissions } from "@/data/submissions";
import { activityItems } from "@/data/activity";
import { useSubmissions } from "@/store/submissions-store";
import {
    Shield,
    ExternalLink,
    CheckCircle2,
    Users,
    FileText,
    Share2,
    Copy,
    Check,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function ProfilePage() {
    const [copied, setCopied] = useState(false);

    function handleCopyLink() {
        const url = `${window.location.origin}/profile/${mockUser.username}`;
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }
    const { submissions: newSubmissions } = useSubmissions();
    const submissions = [...newSubmissions, ...seedSubmissions];

    // Derive updated stats from combined submissions
    const completedCount = mockUser.completedChallenges + newSubmissions.length;
    const avgScore =
        submissions.length > 0
            ? Math.round(submissions.reduce((sum, s) => sum + s.score, 0) / submissions.length)
            : mockUser.avgScore ?? 90;
    const proofScoreTotal =
        mockUser.proofScore.total +
        newSubmissions.reduce((sum, s) => Math.round(sum + s.score * 0.5), 0);

    // Prepend a live activity item for the most recent new submission
    const liveActivity =
        newSubmissions.length > 0
            ? [
                {
                    id: `act-live-${newSubmissions[0].id}`,
                    type: "submission" as const,
                    title: `Submitted: ${newSubmissions[0].challengeTitle}`,
                    description: `Scored ${newSubmissions[0].score}/100 · ${newSubmissions[0].track}`,
                    timestamp: newSubmissions[0].submittedAt,
                },
                ...activityItems,
            ]
            : activityItems;

    return (
        <AppShell title="Proof Profile">
            {/* Profile header */}
            <div className="mb-6">
                <ProfileHeader user={mockUser} />
            </div>

            {/* Proof summary stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard label="Proof Score" value={proofScoreTotal} icon={Shield} accent="blue" />
                <StatCard label="Challenges Completed" value={completedCount} icon={CheckCircle2} accent="emerald" />
                <StatCard label="Avg. Submission Score" value={avgScore} icon={FileText} accent="amber" suffix="/ 100" />
                <StatCard label="Profile Views" value={mockUser.weeklyProfileViews ?? mockUser.profileViews} icon={Users} accent="violet" suffix="this week" trend={{ value: 40, label: "vs last week" }} />
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Featured Proof */}
                    <div>
                        <SectionHeading title="Featured Proof" subtitle="Completed challenges with verified submissions." />
                        <div className="space-y-5">
                            {submissions.map((sub) => (
                                <div
                                    key={sub.id}
                                    className="rounded-xl border border-[#1e2d45] bg-[#111827] p-6 space-y-4"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                                                    Completed
                                                </span>
                                                <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-white/5 text-slate-400 border border-white/5">
                                                    {sub.track}
                                                </span>
                                                <DisclosureBadge level={sub.aiDisclosure} size="sm" />
                                            </div>
                                            <h3 className="text-base font-semibold text-white">{sub.challengeTitle}</h3>
                                            <p className="text-sm text-slate-400 mt-1 line-clamp-2">{sub.explanation}</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <div className="text-2xl font-bold text-white">{sub.score}</div>
                                            <div className="text-xs text-slate-500">/ 100</div>
                                        </div>
                                    </div>

                                    {/* Skills */}
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-2">Skills Verified</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {sub.skills.map((skill) => (
                                                <span key={skill} className="px-2 py-0.5 rounded-md text-xs bg-white/5 text-slate-400 border border-white/5">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Process summary */}
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-2">Process</p>
                                        <div className="space-y-1">
                                            {sub.processSteps.slice(0, 3).map((step, i) => (
                                                <div key={step.id} className="flex items-center gap-2 text-sm text-slate-400">
                                                    <div className="w-4 h-4 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 text-xs shrink-0">
                                                        {i + 1}
                                                    </div>
                                                    {step.title}
                                                </div>
                                            ))}
                                            {sub.processSteps.length > 3 && (
                                                <p className="text-xs text-slate-600 ml-6">+{sub.processSteps.length - 3} more steps</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Links */}
                                    <div className="flex items-center gap-4 pt-2 border-t border-[#1e2d45]">
                                        {sub.liveLink && (
                                            <a href={sub.liveLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                                                <ExternalLink className="w-3.5 h-3.5" /> Live Preview
                                            </a>
                                        )}
                                        {sub.repoLink && (
                                            <a href={sub.repoLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
                                                <ExternalLink className="w-3.5 h-3.5" /> Repository
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* AI Transparency */}
                    <div>
                        <SectionHeading title="AI Transparency" />
                        <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-6">
                            <div className="flex items-start gap-3 mb-4">
                                <Shield className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="text-sm font-semibold text-white mb-1">AI Collaboration Disclosed</h3>
                                    <p className="text-sm text-slate-400 leading-relaxed">
                                        This profile includes AI usage disclosures so employers can evaluate both independent skill
                                        and AI collaboration ability. AI use is not hidden here — it is disclosed, explained, and evaluated.
                                    </p>
                                </div>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-3">
                                {submissions.map((sub) => (
                                    <div key={sub.id} className="rounded-lg bg-[#111827] border border-[#1e2d45] p-3">
                                        <p className="text-xs text-slate-400 font-medium mb-1.5 truncate">{sub.challengeTitle}</p>
                                        <DisclosureBadge level={sub.aiDisclosure} showDescription size="sm" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Work Process Timeline */}
                    <div>
                        <SectionHeading title="Recent Work Activity" />
                        <div className="rounded-xl border border-[#1e2d45] bg-[#111827] p-5">
                            <ActivityTimeline items={liveActivity} />
                        </div>
                    </div>
                </div>

                {/* Right sidebar */}
                <div className="space-y-6">
                    <ProofScoreCard score={mockUser.proofScore} />

                    {/* Skill Evidence */}
                    <div className="rounded-xl border border-[#1e2d45] bg-[#111827] p-5">
                        <SectionHeading title="Skill Evidence" />
                        <SkillBars skills={mockUser.skills} />
                    </div>

                    {/* Share profile */}
                    <div className="rounded-xl border border-[#1e2d45] bg-gradient-to-br from-blue-600/15 to-violet-600/10 p-5">
                        <h3 className="text-sm font-semibold text-white mb-2">Share this Profile</h3>
                        <p className="text-xs text-slate-400 mb-4">
                            Send your Proof Profile to recruiters, hiring managers, or clients to show real evidence of your skills.
                        </p>
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-[#0d1424] border border-[#1e2d45] mb-3">
                            <span className="text-xs text-slate-500 truncate flex-1">
                                workproof.dev/profile/{mockUser.username}
                            </span>
                        </div>
                        <button
                            onClick={handleCopyLink}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors text-sm"
                        >
                            {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                            {copied ? "Copied!" : "Copy Shareable Link"}
                        </button>
                        <p className="text-xs text-slate-600 mt-2 text-center">Employers see a clean view — no dashboard, no settings.</p>
                    </div>

                    {/* Employer view link */}
                    <div className="rounded-xl border border-[#1e2d45] bg-[#111827] p-5">
                        <h3 className="text-sm font-semibold text-white mb-2">See the Employer View</h3>
                        <p className="text-xs text-slate-400 mb-3">
                            Preview how employers evaluate your profile, including role fit and interview questions.
                        </p>
                        <div className="space-y-2">
                            <a
                                href="/employer-view"
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-[#1e2d45] bg-white/5 hover:bg-white/10 text-slate-300 font-medium rounded-lg transition-colors text-sm"
                            >
                                <ExternalLink className="w-4 h-4" />
                                Employer View
                            </a>
                            <Link
                                href={`/profile/${mockUser.username}`}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-[#1e2d45] bg-white/5 hover:bg-white/10 text-slate-300 font-medium rounded-lg transition-colors text-sm"
                            >
                                <FileText className="w-4 h-4" />
                                View Public Profile
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
