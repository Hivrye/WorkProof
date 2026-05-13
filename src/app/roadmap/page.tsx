"use client";

import Link from "next/link";
import {
    Shield,
    CheckCircle2,
    Clock,
    Telescope,
    BookOpen,
    UserCircle2,
    Upload,
    Eye,
    Users,
    MessageSquare,
    GraduationCap,
    Database,
    KeyRound,
    BadgeCheck,
    Layers,
    Building2,
    Wrench,
    GitBranch,
    Link2,
    ArrowLeft,
    Sparkles,
    Zap,
    CircleDot,
} from "lucide-react";

type Phase = "now" | "next" | "later";

interface RoadmapItem {
    icon: React.ElementType;
    title: string;
    description: string;
    tag?: string;
}

const phases: {
    id: Phase;
    label: string;
    sublabel: string;
    icon: React.ElementType;
    iconColor: string;
    iconBg: string;
    borderColor: string;
    dotColor: string;
    badgeColor: string;
    badgeText: string;
    items: RoadmapItem[];
}[] = [
        {
            id: "now",
            label: "Now",
            sublabel: "Live in the demo",
            icon: CheckCircle2,
            iconColor: "text-emerald-400",
            iconBg: "bg-emerald-500/10 border-emerald-500/20",
            borderColor: "border-emerald-500/20",
            dotColor: "bg-emerald-400",
            badgeColor: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25",
            badgeText: "Shipped",
            items: [
                {
                    icon: BookOpen,
                    title: "Challenge library",
                    description:
                        "A curated set of real-world challenges across Frontend, Backend, and other tracks — each with a scenario, deliverables, and evaluation criteria.",
                },
                {
                    icon: UserCircle2,
                    title: "Proof profiles",
                    description:
                        "Public, shareable candidate profiles showing completed work, skill evidence, and process documentation. Designed to be sent to employers.",
                },
                {
                    icon: Upload,
                    title: "Submission flow",
                    description:
                        "A structured submission form that captures what was built, why decisions were made, what would be improved, and a step-by-step process log.",
                },
                {
                    icon: Eye,
                    title: "AI disclosure",
                    description:
                        "Candidates declare AI usage at five levels — from none to fully explained. Disclosure is rendered clearly on every submission, never hidden.",
                },
            ],
        },
        {
            id: "next",
            label: "Next",
            sublabel: "In active development",
            icon: Zap,
            iconColor: "text-blue-400",
            iconBg: "bg-blue-500/10 border-blue-500/20",
            borderColor: "border-blue-500/20",
            dotColor: "bg-blue-400",
            badgeColor: "bg-blue-500/15 text-blue-300 border-blue-500/25",
            badgeText: "Building",
            items: [
                {
                    icon: Users,
                    title: "Peer review",
                    description:
                        "Candidates can request structured feedback from other verified practitioners on the platform — adding a human signal alongside the automated score.",
                    tag: "Community",
                },
                {
                    icon: MessageSquare,
                    title: "Employer feedback",
                    description:
                        "Employers who view a profile can leave structured, private feedback that aggregates into a candidate's profile over time (with candidate consent).",
                    tag: "Employers",
                },
                {
                    icon: GraduationCap,
                    title: "Bootcamp dashboards",
                    description:
                        "Cohort-level views for bootcamp partners — track graduate progress, aggregate proof scores, and share class-wide results with hiring partners.",
                    tag: "Partners",
                },
                {
                    icon: Database,
                    title: "Supabase backend",
                    description:
                        "Migrating from localStorage to a real database. All profiles, submissions, and scores persist server-side and sync across devices.",
                    tag: "Infrastructure",
                },
                {
                    icon: KeyRound,
                    title: "Authentication",
                    description:
                        "Email sign-up and login with optional GitHub OAuth. Authenticated accounts unlock persistent profiles, saved progress, and employer views.",
                    tag: "Infrastructure",
                },
            ],
        },
        {
            id: "later",
            label: "Later",
            sublabel: "Planned for future releases",
            icon: Telescope,
            iconColor: "text-violet-400",
            iconBg: "bg-violet-500/10 border-violet-500/20",
            borderColor: "border-violet-500/20",
            dotColor: "bg-violet-400",
            badgeColor: "bg-violet-500/15 text-violet-300 border-violet-500/25",
            badgeText: "Planned",
            items: [
                {
                    icon: BadgeCheck,
                    title: "Real verification",
                    description:
                        "Third-party or community-verified submissions — where a qualified reviewer confirms the work meets the stated standard, adding a harder trust signal.",
                    tag: "Trust",
                },
                {
                    icon: Layers,
                    title: "Team work simulations",
                    description:
                        "Multi-candidate challenges that model collaboration — PR reviews, async decisions, and design handoffs — to evidence how candidates work with others.",
                    tag: "Challenges",
                },
                {
                    icon: Building2,
                    title: "Paid employer accounts",
                    description:
                        "Employer subscriptions that unlock candidate search, saved shortlists, bulk profile export, and direct messaging — without ever selling candidate data.",
                    tag: "Revenue",
                },
                {
                    icon: Wrench,
                    title: "Custom challenge builder",
                    description:
                        "Let companies and bootcamps create private challenge libraries with their own scenarios, deliverables, and scoring rubrics for proprietary hiring flows.",
                    tag: "Employers",
                },
                {
                    icon: GitBranch,
                    title: "GitHub integration",
                    description:
                        "Link a repository directly to a submission. Verifiable commit history, diff views, and code quality signals pulled in as additional proof layers.",
                    tag: "Integrations",
                },
                {
                    icon: Link2,
                    title: "LinkedIn integration",
                    description:
                        "Add a verified WorkProofolio badge and summary to your LinkedIn profile, letting employers find proof evidence without leaving a platform they already use.",
                    tag: "Integrations",
                },
            ],
        },
    ];

const phaseOrder: Phase[] = ["now", "next", "later"];

export default function RoadmapPage() {
    return (
        <div className="min-h-screen bg-[#0b0f1a] text-white">
            {/* Nav */}
            <nav className="border-b border-[#1a2540] px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                        <Shield className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-white text-lg tracking-tight">WorkProofolio</span>
                </div>
                <Link
                    href="/"
                    className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to home
                </Link>
            </nav>

            {/* Header */}
            <section className="max-w-3xl mx-auto px-6 pt-16 pb-12 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 text-xs font-medium mb-6">
                    <Sparkles className="w-3.5 h-3.5" />
                    What we&apos;re building
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-5">
                    Product Roadmap
                </h1>
                <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
                    WorkProofolio is early. This roadmap is a transparent look at where we are, what&apos;s
                    actively being built, and where we intend to go. We publish it because we think
                    candidates and employers deserve to know what they&apos;re betting on.
                </p>
            </section>

            {/* Phase legend */}
            <section className="max-w-3xl mx-auto px-6 mb-10">
                <div className="grid sm:grid-cols-3 gap-3">
                    {phases.map((phase) => {
                        const Icon = phase.icon;
                        return (
                            <a
                                key={phase.id}
                                href={`#${phase.id}`}
                                className="flex items-center gap-3 rounded-xl border border-[#1e2d45] bg-[#111827] px-4 py-3 hover:border-[#2a3d5a] transition-colors group"
                            >
                                <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${phase.iconBg}`}>
                                    <Icon className={`w-4 h-4 ${phase.iconColor}`} />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-white group-hover:text-white">{phase.label}</p>
                                    <p className="text-xs text-slate-500">{phase.sublabel}</p>
                                </div>
                            </a>
                        );
                    })}
                </div>
            </section>

            {/* Timeline */}
            <section className="max-w-3xl mx-auto px-6 pb-20">
                {/* Vertical connector line */}
                <div className="relative">
                    {/* Left rail */}
                    <div className="absolute left-4 top-6 bottom-6 w-px bg-gradient-to-b from-emerald-500/40 via-blue-500/30 to-violet-500/20 hidden sm:block" />

                    <div className="space-y-14">
                        {phases.map((phase) => {
                            const PhaseIcon = phase.icon;
                            return (
                                <div key={phase.id} id={phase.id} className="sm:pl-14">
                                    {/* Phase dot on rail */}
                                    <div className="hidden sm:flex absolute left-0 w-9 h-9 rounded-full border-2 border-[#0b0f1a] items-center justify-center" style={{ marginTop: "2px" }}>
                                        <div className={`w-3 h-3 rounded-full ${phase.dotColor} ring-4 ring-[#0b0f1a]`} />
                                    </div>

                                    {/* Phase header */}
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 sm:hidden ${phase.iconBg}`}>
                                            <PhaseIcon className={`w-5 h-5 ${phase.iconColor}`} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2.5 flex-wrap">
                                                <h2 className="text-2xl font-bold text-white">{phase.label}</h2>
                                                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${phase.badgeColor}`}>
                                                    <CircleDot className="w-2.5 h-2.5" />
                                                    {phase.badgeText}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-500 mt-0.5">{phase.sublabel}</p>
                                        </div>
                                    </div>

                                    {/* Items */}
                                    <div className="space-y-3">
                                        {phase.items.map((item) => {
                                            const ItemIcon = item.icon;
                                            return (
                                                <div
                                                    key={item.title}
                                                    className={`rounded-xl border bg-[#111827] p-5 ${phase.borderColor}`}
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${phase.iconBg}`}>
                                                            <ItemIcon className={`w-4 h-4 ${phase.iconColor}`} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 flex-wrap mb-1.5">
                                                                <h3 className="text-base font-semibold text-white leading-snug">{item.title}</h3>
                                                                {item.tag && (
                                                                    <span className="text-xs text-slate-500 bg-white/5 border border-white/8 px-2 py-0.5 rounded-md">
                                                                        {item.tag}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>
                                                        </div>
                                                        {/* Phase indicator dot */}
                                                        <div className={`w-2 h-2 rounded-full shrink-0 mt-2 ${phase.dotColor} opacity-60`} />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="border-t border-[#1a2540] bg-[#0d1116]">
                <div className="max-w-3xl mx-auto px-6 py-14 text-center">
                    <Clock className="w-8 h-8 text-blue-500/60 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-3">
                        This roadmap is a commitment, not a guarantee
                    </h2>
                    <p className="text-slate-400 text-base leading-relaxed max-w-xl mx-auto mb-6">
                        Priorities shift based on what candidates and employers actually need.
                        If something here matters to you, we want to hear about it — and if we
                        change direction, we&apos;ll explain why.
                    </p>
                    <div className="flex items-center justify-center gap-4 flex-wrap">
                        <Link
                            href="/dashboard"
                            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
                        >
                            Try the demo now
                        </Link>
                        <Link
                            href="/trust"
                            className="px-5 py-2.5 rounded-lg border border-[#1e2d45] bg-white/5 hover:bg-white/8 text-slate-300 text-sm font-medium transition-colors"
                        >
                            Read our Trust &amp; Ethics page
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-[#1a2540] py-8">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-sm text-slate-600 flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-blue-500/60" />
                        <span className="font-medium text-slate-500">WorkProofolio</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link href="/" className="hover:text-slate-400 transition-colors">Home</Link>
                        <Link href="/tracks" className="hover:text-slate-400 transition-colors">Tracks</Link>
                        <Link href="/pricing" className="hover:text-slate-400 transition-colors">Pricing</Link>
                        <Link href="/employer-view" className="hover:text-slate-400 transition-colors">For Employers</Link>
                        <Link href="/trust" className="hover:text-slate-400 transition-colors">Trust &amp; Ethics</Link>
                    </div>
                    <p>Real work beats résumés.</p>
                </div>
            </footer>
        </div>
    );
}
