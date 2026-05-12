"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { StatCard } from "@/components/cards/StatCard";
import { ChallengeCard } from "@/components/cards/ChallengeCard";
import { ProofScoreCard } from "@/components/cards/ProofScoreCard";
import { SkillBars } from "@/components/proof/SkillBar";
import { ActivityTimeline } from "@/components/proof/ActivityTimeline";
import { SectionHeading } from "@/components/ui/shared";
import { mockUser } from "@/data/user";
import { challenges } from "@/data/challenges";
import { activityItems } from "@/data/activity";
import { useSubmissions } from "@/store/submissions-store";
import { useOnboarding } from "@/store/onboarding-store";
import { useAuth, useCurrentProfile } from "@/lib/supabase/hooks";
import {
    Shield,
    CheckCircle2,
    Zap,
    Eye,
    ArrowRight,
    Clock,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
    const router = useRouter();
    const { submissions: newSubmissions } = useSubmissions();
    const { completed: onboardingDone, profile: onboardingProfile } = useOnboarding();
    const { user } = useAuth();
    const { profile: supabaseProfile } = useCurrentProfile();

    // Redirect to onboarding on first visit
    useEffect(() => {
        if (!onboardingDone) {
            router.replace("/onboarding");
        }
    }, [onboardingDone, router]);

    // Derive live stats from newly submitted work
    const completedCount = mockUser.completedChallenges + newSubmissions.length;
    const proofScoreTotal =
        mockUser.proofScore.total +
        newSubmissions.reduce((sum, s) => Math.round(sum + s.score * 0.5), 0);

    // Hide in-progress challenges that have been submitted
    const submittedIds = new Set(newSubmissions.map((s) => s.challengeId));
    const inProgressChallenge = challenges.find(
        (c) => c.status === "in-progress" && !submittedIds.has(c.id)
    );

    // Use onboarding role if available, else fall back to mock user track
    const activeTrackId = onboardingProfile?.roleId ?? mockUser.trackId;
    const activeTrackName = onboardingProfile?.roleName ?? mockUser.track;

    // Personalised recommendations: prioritise the onboarding first-challenge, then fill from track
    const firstChallengeId = onboardingProfile?.firstChallengeId;
    const firstChallenge = firstChallengeId ? challenges.find((c) => c.id === firstChallengeId) : null;
    const recommendedChallenges = [
        ...(firstChallenge && firstChallenge.status === "not-started" ? [firstChallenge] : []),
        ...challenges.filter(
            (c) =>
                c.status === "not-started" &&
                c.trackId === activeTrackId &&
                c.id !== firstChallengeId
        ),
    ].slice(0, 3);

    // Prepend new submission events to the activity feed
    const liveActivity =
        newSubmissions.length > 0
            ? [
                {
                    id: `act-live-${newSubmissions[0].id}`,
                    type: "submission" as const,
                    title: `Submitted: ${newSubmissions[0].challengeTitle}`,
                    description: `Scored ${newSubmissions[0].score}/100 · just added to your Proof Profile`,
                    timestamp: newSubmissions[0].submittedAt,
                },
                ...activityItems,
            ]
            : activityItems;

    // Prefer: Supabase profile name → auth email prefix → mock
    const displayFirstName = (
        supabaseProfile?.name ||
        user?.email?.split("@")[0] ||
        mockUser.name
    ).split(" ")[0];

    return (
        <AppShell title="Dashboard">
            {/* Welcome header */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white">
                    Welcome back, {displayFirstName}
                </h2>
                <p className="text-slate-400 mt-1">
                    You&apos;re building proof as a{" "}
                    <span className="text-blue-400 font-medium">{activeTrackName}</span>. Your profile was viewed{" "}
                    <span className="text-white font-medium">{mockUser.weeklyProfileViews} times</span> this week.
                </p>
            </div>

            {/* Profile completion banner */}
            {mockUser.profileCompletion < 100 && (
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 mb-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                            <div>
                                <p className="text-sm text-amber-300 font-medium">
                                    Your profile is <strong>{mockUser.profileCompletion}%</strong>{" "}complete — here&apos;s what&apos;s missing:
                                </p>
                                <ul className="mt-1.5 space-y-0.5">
                                    {["Target salary range", "2+ advanced challenges", "LinkedIn URL added"].map((item) => (
                                        <li key={item} className="text-xs text-amber-400/70 flex items-center gap-1.5">
                                            <span className="w-1 h-1 rounded-full bg-amber-400/50" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <Link href="/settings" className="text-xs text-amber-400 hover:text-amber-300 font-medium whitespace-nowrap flex items-center gap-1 shrink-0">
                            Fix it <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                </div>
            )}

            {/* Stats row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                    label="Proof Score"
                    value={proofScoreTotal}
                    icon={Shield}
                    trend={{ value: 34, label: "this month" }}
                    accent="blue"
                />
                <StatCard
                    label="Completed"
                    value={completedCount}
                    icon={CheckCircle2}
                    accent="emerald"
                />
                <StatCard
                    label="In Progress"
                    value={mockUser.inProgressChallenges}
                    icon={Zap}
                    accent="amber"
                />
                <StatCard
                    label="Profile Views"
                    value={mockUser.weeklyProfileViews ?? mockUser.profileViews}
                    icon={Eye}
                    trend={{ value: 40, label: "vs last week" }}
                    accent="violet"
                    suffix="this week"
                />
            </div>

            {/* Main grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left / main column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Continue challenge */}
                    {inProgressChallenge && (
                        <div>
                            <SectionHeading
                                title="Continue Where You Left Off"
                                action={
                                    <Link href={`/challenges/${inProgressChallenge.id}`} className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                                        View <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                }
                            />
                            <div className="rounded-xl border border-[#1e2d45] bg-[#111827] p-6">
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <div>
                                        <span className="text-xs text-blue-400 font-medium bg-blue-400/10 border border-blue-400/20 px-2 py-0.5 rounded-md">
                                            In Progress
                                        </span>
                                        <h3 className="text-lg font-semibold text-white mt-2">{inProgressChallenge.title}</h3>
                                        <p className="text-sm text-slate-400 mt-1">{inProgressChallenge.track} · {inProgressChallenge.difficulty}</p>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-slate-400 text-sm shrink-0">
                                        <Clock className="w-4 h-4" />
                                        {inProgressChallenge.estimatedTime}
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                                        <span>Progress</span>
                                        <span>45%</span>
                                    </div>
                                    <div className="w-full h-2 bg-[#1e2d45] rounded-full overflow-hidden">
                                        <div className="h-full w-[45%] bg-gradient-to-r from-blue-600 to-violet-600 rounded-full" />
                                    </div>
                                </div>
                                <Link
                                    href={`/challenges/${inProgressChallenge.id}`}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                                >
                                    Continue Challenge <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Recommended challenges */}
                    <div>
                        <SectionHeading
                            title="Recommended Challenges"
                            subtitle={`Based on your ${activeTrackName} track`}
                            action={
                                <Link href="/challenges" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                                    View all <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            }
                        />
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {recommendedChallenges.map((challenge) => (
                                <ChallengeCard key={challenge.id} challenge={challenge} compact />
                            ))}
                        </div>
                    </div>

                    {/* Recent activity */}
                    <div>
                        <SectionHeading title="Recent Activity" />
                        <div className="rounded-xl border border-[#1e2d45] bg-[#111827] p-5">
                            <ActivityTimeline items={liveActivity} limit={5} />
                        </div>
                    </div>
                </div>

                {/* Right sidebar */}
                <div className="space-y-6">
                    {/* Proof Score */}
                    <ProofScoreCard score={mockUser.proofScore} />

                    {/* Skill Evidence */}
                    <div className="rounded-xl border border-[#1e2d45] bg-[#111827] p-5">
                        <SectionHeading
                            title="Skill Evidence"
                            action={
                                <Link href="/profile" className="text-sm text-blue-400 hover:text-blue-300">
                                    Full profile
                                </Link>
                            }
                        />
                        <SkillBars skills={mockUser.skills} size="sm" />
                    </div>

                    {/* Next Steps */}
                    <div className="rounded-xl border border-[#1e2d45] bg-[#111827] p-5">
                        <h3 className="text-sm font-semibold text-white mb-1">Your next best steps</h3>
                        <p className="text-xs text-slate-500 mb-4">Based on your current profile and score gaps.</p>
                        <div className="space-y-3">
                            {[
                                { label: "Finish the Pricing Section challenge", detail: "45% done · Worth +180 proof pts", href: `/challenges/${inProgressChallenge?.id ?? "fe-001"}`, urgent: true },
                                { label: "Complete an Advanced challenge", detail: "Skill Coverage is your lowest score (69)", href: "/challenges", urgent: false },
                                { label: "Add your target salary to settings", detail: "Helps employers qualify you faster", href: "/settings", urgent: false },
                            ].map(({ href, label, detail, urgent }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/5 transition-colors group"
                                >
                                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${urgent ? "bg-blue-400" : "bg-slate-600"}`} />
                                    <div className="min-w-0">
                                        <p className="text-sm text-slate-300 group-hover:text-white transition-colors">{label}</p>
                                        <p className="text-xs text-slate-600 mt-0.5">{detail}</p>
                                    </div>
                                    <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-blue-400 transition-colors shrink-0 mt-0.5" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
