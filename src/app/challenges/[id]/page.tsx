"use client";

import { useState, use } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { challenges } from "@/data/challenges";
import { getDifficultyColor } from "@/lib/utils";
import {
    Clock,
    Zap,
    ChevronLeft,
    CheckSquare,
    BookOpen,
    Target,
    ExternalLink,
    Bookmark,
    ArrowRight,
    Shield,
    CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "brief" | "deliverables" | "evaluation" | "resources";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function ChallengeDetailPage({ params }: PageProps) {
    const { id } = use(params);
    const [activeTab, setActiveTab] = useState<Tab>("brief");
    const [saved, setSaved] = useState(false);

    const challenge = challenges.find((c) => c.id === id);

    if (!challenge) {
        return (
            <AppShell>
                <div className="text-center py-32">
                    <p className="text-slate-400 mb-4">Challenge not found.</p>
                    <Link href="/challenges" className="text-blue-400 hover:text-blue-300">
                        ← Back to Challenges
                    </Link>
                </div>
            </AppShell>
        );
    }

    const difficultyClass = getDifficultyColor(challenge.difficulty);

    const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
        { id: "brief", label: "Brief", icon: BookOpen },
        { id: "deliverables", label: "Deliverables", icon: CheckSquare },
        { id: "evaluation", label: "Evaluation", icon: Target },
        { id: "resources", label: "Resources", icon: ExternalLink },
    ];

    return (
        <AppShell>
            {/* Breadcrumb */}
            <Link
                href="/challenges"
                className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors mb-6"
            >
                <ChevronLeft className="w-4 h-4" />
                Back to Challenges
            </Link>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Header */}
                    <div>
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span className={cn("px-2.5 py-1 rounded-md text-xs font-medium border", difficultyClass)}>
                                {challenge.difficulty}
                            </span>
                            <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-white/5 text-slate-400 border border-white/5">
                                {challenge.track}
                            </span>
                            {challenge.aiDisclosureRequired && (
                                <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-violet-500/10 text-violet-400 border border-violet-500/20">
                                    AI Disclosure Required
                                </span>
                            )}
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">{challenge.title}</h1>
                        <p className="text-slate-400 leading-relaxed">{challenge.description}</p>
                    </div>

                    {/* Tabs */}
                    <div>
                        <div className="flex border-b border-[#1e2d45] mb-6">
                            {tabs.map(({ id, label, icon: Icon }) => (
                                <button
                                    key={id}
                                    onClick={() => setActiveTab(id)}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px",
                                        activeTab === id
                                            ? "border-blue-500 text-blue-400"
                                            : "border-transparent text-slate-500 hover:text-white"
                                    )}
                                >
                                    <Icon className="w-4 h-4" />
                                    {label}
                                </button>
                            ))}
                        </div>

                        {/* Brief tab */}
                        {activeTab === "brief" && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Scenario</h2>
                                    <div className="rounded-xl border border-[#1e2d45] bg-[#0d1424] p-5">
                                        <p className="text-slate-300 leading-relaxed">{challenge.scenario}</p>
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Your Task</h2>
                                    <div className="rounded-xl border border-[#1e2d45] bg-[#111827] p-5">
                                        <p className="text-slate-300 leading-relaxed">{challenge.taskBrief}</p>
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Skills Tested</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {challenge.skillsTested.map((skill) => (
                                            <span
                                                key={skill}
                                                className="px-3 py-1.5 rounded-lg text-sm bg-white/5 text-slate-300 border border-white/8"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Deliverables tab */}
                        {activeTab === "deliverables" && (
                            <div className="space-y-4">
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Submit all of the following deliverables to receive a Proof Score for this challenge.
                                </p>
                                <div className="space-y-3">
                                    {challenge.deliverables.map((deliverable, i) => (
                                        <div
                                            key={i}
                                            className="flex items-start gap-3 p-4 rounded-xl border border-[#1e2d45] bg-[#111827]"
                                        >
                                            <div className="w-6 h-6 rounded-full border border-[#1e2d45] flex items-center justify-center text-slate-600 text-xs shrink-0 mt-0.5">
                                                {i + 1}
                                            </div>
                                            <p className="text-slate-300 text-sm leading-relaxed">{deliverable}</p>
                                        </div>
                                    ))}
                                </div>
                                {challenge.aiDisclosureRequired && (
                                    <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Shield className="w-4 h-4 text-violet-400" />
                                            <span className="text-sm font-medium text-violet-300">AI Disclosure Required</span>
                                        </div>
                                        <p className="text-sm text-slate-400">
                                            This challenge requires you to disclose how you used AI tools. Honest disclosure is valued — it shows
                                            transparency and modern collaboration skills.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Evaluation tab */}
                        {activeTab === "evaluation" && (
                            <div className="space-y-4">
                                <p className="text-slate-400 text-sm">
                                    Your submission will be evaluated on the following criteria. Each criterion is weighted equally unless noted.
                                </p>
                                <div className="space-y-3">
                                    {challenge.evaluationCriteria.map((criterion, i) => (
                                        <div key={i} className="rounded-xl border border-[#1e2d45] bg-[#111827] p-5">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="text-sm font-semibold text-white">{criterion.name}</h3>
                                                <span className="text-xs text-slate-500">{criterion.weight}%</span>
                                            </div>
                                            <p className="text-sm text-slate-400">{criterion.description}</p>
                                            <div className="mt-3 h-1 bg-[#1e2d45] rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-blue-600 rounded-full"
                                                    style={{ width: `${criterion.weight}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Resources tab */}
                        {activeTab === "resources" && (
                            <div className="space-y-3">
                                {challenge.resources.length === 0 ? (
                                    <p className="text-slate-400 text-sm py-8 text-center">
                                        No additional resources provided for this challenge. Use your preferred references.
                                    </p>
                                ) : (
                                    challenge.resources.map((resource, i) => (
                                        <a
                                            key={i}
                                            href={resource.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between p-4 rounded-xl border border-[#1e2d45] bg-[#111827] hover:border-blue-500/30 transition-colors group"
                                        >
                                            <div>
                                                <p className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors">
                                                    {resource.title}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-0.5 capitalize">{resource.type}</p>
                                            </div>
                                            <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                                        </a>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    {/* Actions */}
                    <div className="rounded-xl border border-[#1e2d45] bg-[#111827] p-5 space-y-3">
                        <Link
                            href={`/submit?challenge=${challenge.id}`}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                        >
                            {challenge.status === "in-progress" ? "Continue Challenge" : "Start Challenge"}
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <button
                            onClick={() => setSaved((s) => !s)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-[#1e2d45] bg-white/5 hover:bg-white/10 text-slate-300 font-medium rounded-lg transition-colors text-sm"
                        >
                            <Bookmark className={cn("w-4 h-4", saved && "fill-current text-blue-400")} />
                            {saved ? "Challenge Saved" : "Save Challenge"}
                        </button>
                    </div>

                    {/* Meta */}
                    <div className="rounded-xl border border-[#1e2d45] bg-[#111827] p-5 space-y-4">
                        <h3 className="text-sm font-semibold text-white">Challenge Details</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Difficulty</span>
                                <span className={cn("px-2 py-0.5 rounded-md text-xs font-medium border", getDifficultyColor(challenge.difficulty))}>
                                    {challenge.difficulty}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Estimated Time</span>
                                <span className="text-slate-300 flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    {challenge.estimatedTime}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Proof Value</span>
                                <span className="text-slate-300 flex items-center gap-1">
                                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                                    {challenge.proofValue} pts
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">AI Disclosure</span>
                                <span className={challenge.aiDisclosureRequired ? "text-violet-400" : "text-slate-400"}>
                                    {challenge.aiDisclosureRequired ? "Required" : "Optional"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="rounded-xl border border-[#1e2d45] bg-[#111827] p-5">
                        <h3 className="text-sm font-semibold text-white mb-3">Skills Tested</h3>
                        <div className="space-y-2">
                            {challenge.skillsTested.map((skill) => (
                                <div key={skill} className="flex items-center gap-2 text-sm text-slate-400">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                    {skill}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tags */}
                    {challenge.tags.length > 0 && (
                        <div className="rounded-xl border border-[#1e2d45] bg-[#111827] p-5">
                            <h3 className="text-sm font-semibold text-white mb-3">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {challenge.tags.map((tag) => (
                                    <span key={tag} className="px-2 py-0.5 rounded-md text-xs bg-white/5 text-slate-400 border border-white/5">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppShell>
    );
}
