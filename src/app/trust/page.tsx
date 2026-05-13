"use client";

import Link from "next/link";
import {
    Shield,
    Eye,
    Brain,
    Users,
    UserCheck,
    Lock,
    Scale,
    ArrowLeft,
    CheckCircle2,
    AlertTriangle,
} from "lucide-react";

const sections = [
    {
        id: "ai-disclosure",
        icon: Brain,
        iconColor: "text-violet-400",
        iconBg: "bg-violet-500/10 border-violet-500/20",
        title: "AI use is disclosed, not hidden",
        body: [
            "WorkProofolio was built in an era when AI tools are a normal part of how people work. We do not pretend otherwise, and we do not expect candidates to pretend otherwise either.",
            "When a candidate uses AI — for brainstorming, for reviewing drafts, for understanding a problem — they are encouraged to say so clearly. That disclosure is shown directly on their submission. It is not a mark against them. It is evidence that they can work honestly with modern tools.",
            "The alternative — penalising candidates for AI use while employers' own teams use it freely every day — would be both hypocritical and harmful. We will not build a platform that forces people to lie.",
        ],
        commitment: "Candidates are never penalised for disclosing responsible AI use.",
    },
    {
        id: "hiring-context",
        icon: Scale,
        iconColor: "text-blue-400",
        iconBg: "bg-blue-500/10 border-blue-500/20",
        title: "WorkProofolio is evidence, not a verdict",
        body: [
            "A proof profile is one strong signal among many. It shows how someone approached a real problem, documented their thinking, and disclosed their tools. That is genuinely useful information — far more useful than a list of keywords on a résumé.",
            "But no single platform score should be the only reason a person is hired or rejected. Candidates are whole people. Their proof submissions are snapshots, not a complete picture of what they can do on your team.",
            "We ask employers to use WorkProofolio as structured evidence that improves hiring conversations, not as a filter that removes humans from the process.",
        ],
        commitment: "Employers should use profiles to inform decisions, not to replace human judgment.",
    },
    {
        id: "data-ownership",
        icon: UserCheck,
        iconColor: "text-emerald-400",
        iconBg: "bg-emerald-500/10 border-emerald-500/20",
        title: "Candidates own their work",
        body: [
            "Everything a candidate submits on WorkProofolio — their challenge responses, process documentation, written explanations, skill evidence — belongs to them. We store it, but we do not own it.",
            "Candidates can make their profile private at any time. They can delete their submissions. They can choose exactly what is visible and to whom. These controls are not buried in settings; they are a first-class part of the product.",
            "If a candidate leaves WorkProofolio, their data should leave with them. Export and deletion tooling is part of our roadmap, not an afterthought.",
        ],
        commitment: "Profile visibility, submission history, and deletion are candidate-controlled.",
    },
    {
        id: "data-privacy",
        icon: Lock,
        iconColor: "text-amber-400",
        iconBg: "bg-amber-500/10 border-amber-500/20",
        title: "We do not sell candidate data",
        body: [
            "WorkProofolio earns revenue by charging employers and organisations for access to the platform — not by selling candidate information to third parties. That model matters. It means our incentives are aligned with candidates building genuine proof, not with harvesting attention or personal data.",
            "Candidate profiles are shared with employers only as candidates explicitly intend: through a public profile link they control, or through a verification request they approve. We do not surface candidate data in bulk to recruiters without consent.",
            "Aggregate, anonymised usage data may be used to improve the product. It will never be linked back to individual candidates or sold.",
        ],
        commitment: "Candidate data is never sold to third parties.",
    },
    {
        id: "verification",
        icon: Eye,
        iconColor: "text-cyan-400",
        iconBg: "bg-cyan-500/10 border-cyan-500/20",
        title: "Verification is transparent and fair",
        body: [
            "A 'Verified by WorkProofolio' marker means that the submission was completed on our platform, the candidate documented their process, and AI usage was disclosed according to our guidelines. It does not mean WorkProofolio has validated every technical decision the candidate made, or that the candidate will be a guaranteed hire.",
            "Scoring criteria are published. When we score a submission, candidates can see which dimensions were evaluated and with what weight. There are no hidden penalties. If scoring changes over time, existing submissions are not retroactively re-scored without notice.",
            "We acknowledge that any automated scoring system has limitations. Candidates who feel a score is unfair have a path to flag it. We read those flags.",
        ],
        commitment: "Scoring criteria are public. Verification means what we say it means — nothing more.",
    },
    {
        id: "platform-responsibility",
        icon: Users,
        iconColor: "text-rose-400",
        iconBg: "bg-rose-500/10 border-rose-500/20",
        title: "We have a responsibility to get this right",
        body: [
            "WorkProofolio sits at the intersection of someone's livelihood and an employer's trust. That is not a neutral position. The decisions we make about scoring, disclosure, visibility, and data affect real people's careers.",
            "We are a small team, and we will make mistakes. When we do, we will say so clearly rather than issuing vague statements. We will fix the problem, explain what changed, and — where candidates were concretely harmed — do something meaningful about it.",
            "This page is not a legal document. It is a statement of intent. We are committing to it publicly so that you can hold us to it.",
        ],
        commitment: "We are accountable for the impact of our product on candidates and employers alike.",
    },
];

export default function TrustPage() {
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
            <section className="max-w-3xl mx-auto px-6 pt-16 pb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-medium mb-6">
                    <Shield className="w-3.5 h-3.5" />
                    Our commitments to candidates and employers
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
                    Trust & Ethics
                </h1>
                <p className="text-lg text-slate-400 leading-relaxed mb-4">
                    WorkProofolio exists to make hiring fairer by replacing vague credentials with verifiable work.
                    Doing that well requires being honest about what we are, what we are not, and what we owe to the people who use this platform.
                </p>
                <p className="text-base text-slate-500 leading-relaxed">
                    This page describes how we approach AI disclosure, data ownership, employer use of profiles,
                    and our own accountability. It is written in plain language on purpose.
                </p>
            </section>

            {/* Warning callout */}
            <section className="max-w-3xl mx-auto px-6 mb-12">
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 flex gap-4">
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-semibold text-amber-300 mb-1">This is not a terms-of-service document</p>
                        <p className="text-sm text-slate-400">
                            Legal terms and privacy policies are separate documents. This page is a plain-language statement of our values and operating principles.
                            We hold ourselves to these publicly so that you can call us out if we fall short.
                        </p>
                    </div>
                </div>
            </section>

            {/* Sections */}
            <section className="max-w-3xl mx-auto px-6 pb-16 space-y-10">
                {sections.map((section, i) => {
                    const Icon = section.icon;
                    return (
                        <article
                            key={section.id}
                            id={section.id}
                            className="rounded-2xl border border-[#1e2d45] bg-[#111827] overflow-hidden"
                        >
                            {/* Card header */}
                            <div className="flex items-start gap-4 p-6 pb-5">
                                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${section.iconBg}`}>
                                    <Icon className={`w-5 h-5 ${section.iconColor}`} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-600 font-medium uppercase tracking-wider mb-1">
                                        Principle {i + 1} of {sections.length}
                                    </p>
                                    <h2 className="text-xl font-semibold text-white leading-snug">
                                        {section.title}
                                    </h2>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-[#1e2d45]" />

                            {/* Body */}
                            <div className="p-6 space-y-4">
                                {section.body.map((paragraph, j) => (
                                    <p key={j} className="text-[15px] text-slate-400 leading-relaxed">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>

                            {/* Commitment strip */}
                            <div className="border-t border-[#1e2d45] bg-[#0d1422] px-6 py-4 flex items-center gap-3">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                <p className="text-sm text-emerald-300 font-medium">
                                    {section.commitment}
                                </p>
                            </div>
                        </article>
                    );
                })}
            </section>

            {/* Bottom section — feedback */}
            <section className="border-t border-[#1a2540] bg-[#0d1116]">
                <div className="max-w-3xl mx-auto px-6 py-14 text-center">
                    <Shield className="w-8 h-8 text-blue-500/60 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-3">Hold us to this</h2>
                    <p className="text-slate-400 text-base leading-relaxed max-w-xl mx-auto mb-6">
                        If something on this platform contradicts what is written on this page, we want to know.
                        These principles exist to be enforced — including by you.
                    </p>
                    <div className="flex items-center justify-center gap-4 flex-wrap">
                        <Link
                            href="/dashboard"
                            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
                        >
                            Start building your proof
                        </Link>
                        <Link
                            href="/"
                            className="px-5 py-2.5 rounded-lg border border-[#1e2d45] bg-white/5 hover:bg-white/8 text-slate-300 text-sm font-medium transition-colors"
                        >
                            Back to home
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
                        <Link href="/roadmap" className="hover:text-slate-400 transition-colors">Roadmap</Link>
                        <Link href="/employer-view" className="hover:text-slate-400 transition-colors">For Employers</Link>
                    </div>
                    <p>Real work beats résumés.</p>
                </div>
            </footer>
        </div>
    );
}
