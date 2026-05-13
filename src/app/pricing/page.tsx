"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Shield,
    CheckCircle2,
    ArrowRight,
    ChevronDown,
    ChevronUp,
    Zap,
    Users,
    Star,
    Building2,
    GraduationCap,
    Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
    {
        id: "free",
        name: "Free",
        price: null,
        priceLabel: "$0",
        billing: "forever",
        tagline: "Start building proof. No credit card, no catch.",
        cta: "Get started free",
        ctaHref: "/dashboard",
        ctaStyle: "border border-[#1e2d45] bg-white/5 hover:bg-white/8 text-white",
        highlight: false,
        icon: Star,
        iconColor: "text-slate-400 bg-white/5 border-white/10",
        features: [
            { text: "1 Proof Profile" },
            { text: "Up to 3 completed challenges" },
            { text: "Public shareable link" },
            { text: "Basic skill evidence display" },
            { text: "AI disclosure on submissions" },
            { text: "Process documentation (up to 5 steps)" },
        ],
        notIncluded: [
            "Unlimited challenges",
            "Advanced Proof Score breakdown",
            "Employer-ready profile view",
            "Custom portfolio links",
        ],
    },
    {
        id: "pro",
        name: "Pro",
        price: 12,
        priceLabel: "$12",
        billing: "per month",
        tagline: "For job seekers who are serious about standing out.",
        cta: "Start Pro — 14 days free",
        ctaHref: "/dashboard",
        ctaStyle: "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/30",
        highlight: true,
        icon: Zap,
        iconColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
        features: [
            { text: "Everything in Free" },
            { text: "Unlimited challenge completions" },
            { text: "Full Proof Score breakdown" },
            { text: "Unlimited process documentation steps" },
            { text: "Employer-ready profile view" },
            { text: "AI usage disclosure reports" },
            { text: "Custom portfolio links (GitHub, Behance, Figma…)" },
            { text: "Profile view analytics — who looked, when" },
            { text: "Priority support" },
        ],
        notIncluded: [],
    },
    {
        id: "teams",
        name: "Teams",
        price: null,
        priceLabel: "Custom",
        billing: "per cohort or seat",
        tagline: "For bootcamps, schools, and hiring teams.",
        cta: "Talk to us",
        ctaHref: "mailto:hello@workproofolio.io",
        ctaStyle: "border border-emerald-500/40 bg-emerald-500/8 hover:bg-emerald-500/12 text-emerald-400",
        highlight: false,
        icon: Building2,
        iconColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        features: [
            { text: "Everything in Pro, for all students" },
            { text: "Cohort dashboard with progress tracking" },
            { text: "Instructor submission review tools" },
            { text: "Custom challenge libraries for your curriculum" },
            { text: "Employer evaluation portal with candidate search" },
            { text: "Cohort-level analytics and outcomes reporting" },
            { text: "Branded profile pages for your school" },
            { text: "Dedicated onboarding and support" },
        ],
        notIncluded: [],
    },
];

const faqs = [
    {
        q: "Is the free plan actually free forever?",
        a: "Yes. We don't believe in bait-and-switch. The free plan lets you complete up to 3 challenges and build a real proof profile with a shareable link. No credit card required. No trial countdown. It stays free.",
    },
    {
        q: "What happens to my work if I downgrade from Pro?",
        a: "Nothing gets deleted. Your submissions, process notes, and profile stay intact. You'll just lose access to Pro-only features like unlimited challenges and employer analytics. Any challenges beyond 3 remain visible but are locked from new additions.",
    },
    {
        q: "Do you offer discounts for people who are currently unemployed?",
        a: "Yes — email us at hello@workproofolio.io. We don't want cost to be the reason someone can't build proof of their skills. We'll work something out.",
    },
    {
        q: "What does 'employer-ready profile' mean?",
        a: "Pro users get a dedicated employer view: a clean, focused page that shows your challenge scores, process documentation, AI disclosure summary, and skill evidence — with no dashboard UI or nav. It's designed specifically to be sent to recruiters and hiring managers.",
    },
    {
        q: "How does the Teams plan work for bootcamps?",
        a: "We work with you to set up a cohort workspace. Instructors can track student progress across challenges, review submissions, and share a hiring partner portal with employers — giving them a searchable, scored view of your graduates. Pricing is per-cohort or per-seat depending on your needs.",
    },
    {
        q: "Why is AI disclosure a feature, not a restriction?",
        a: "Because how you use AI is a real skill. WorkProofolio doesn't penalize AI use — it requires transparent disclosure. Employers are increasingly interested in candidates who can collaborate with AI effectively and explain what they personally contributed. Honest disclosure is scored positively.",
    },
    {
        q: "Is there a student or bootcamp discount?",
        a: "Teams pricing is designed for institutions, not students. Individual students on the free or Pro plan are always welcome. If you're a bootcamp student referred by your school, ask your school if they have a Teams account — you may get Pro features included.",
    },
];

export default function PricingPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <div className="min-h-screen bg-[#0b0f1a] text-white">
            {/* Nav */}
            <nav className="border-b border-[#1a2540] px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                        <Shield className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-white text-lg tracking-tight">WorkProofolio</span>
                </Link>
                <div className="flex items-center gap-3">
                    <Link href="/#audiences" className="text-sm text-slate-400 hover:text-white transition-colors hidden sm:block">
                        Who It&apos;s For
                    </Link>
                    <Link href="/employer-view" className="text-sm text-slate-400 hover:text-white transition-colors hidden sm:block">
                        For Employers
                    </Link>
                    <Link
                        href="/dashboard"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                        Try the Demo
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <section className="max-w-4xl mx-auto px-6 pt-20 pb-12 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-medium mb-6">
                    <Shield className="w-3.5 h-3.5" />
                    Pricing that doesn&apos;t punish you for being early in your career
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                    Simple pricing.<br />No dark patterns.
                </h1>
                <p className="text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
                    Job seekers always get a free tier — no card required, no artificial urgency. Upgrade when it makes sense for you.
                </p>
            </section>

            {/* Pricing cards */}
            <section className="max-w-6xl mx-auto px-6 pb-16">
                <div className="grid lg:grid-cols-3 gap-6 items-start">
                    {plans.map((plan) => {
                        const Icon = plan.icon;
                        return (
                            <div
                                key={plan.id}
                                className={cn(
                                    "rounded-2xl border p-7 flex flex-col gap-6 relative",
                                    plan.highlight
                                        ? "border-blue-500/40 bg-[#111827] ring-1 ring-blue-500/20"
                                        : "border-[#1e2d45] bg-[#111827]"
                                )}
                            >
                                {plan.highlight && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white shadow-lg shadow-blue-900/40">
                                            <Star className="w-3 h-3" /> Most popular
                                        </span>
                                    </div>
                                )}

                                {/* Plan header */}
                                <div>
                                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border mb-4", plan.iconColor)}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-xl font-bold text-white mb-1">{plan.name}</h2>
                                    <p className="text-sm text-slate-400 leading-relaxed">{plan.tagline}</p>
                                </div>

                                {/* Price */}
                                <div className="border-t border-b border-[#1e2d45] py-5">
                                    <div className="flex items-end gap-1.5">
                                        <span className="text-4xl font-bold text-white">{plan.priceLabel}</span>
                                        {plan.price && (
                                            <span className="text-slate-500 text-sm mb-1.5">/ month</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-600 mt-1">{plan.billing}</p>
                                    {plan.highlight && (
                                        <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                                            <CheckCircle2 className="w-3 h-3" /> 14-day free trial — no card required
                                        </p>
                                    )}
                                    {plan.id === "free" && (
                                        <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                                            <Info className="w-3 h-3" /> No card. No trial. Just free.
                                        </p>
                                    )}
                                    {plan.id === "teams" && (
                                        <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                                            <GraduationCap className="w-3 h-3" /> Per-cohort or per-seat — we&apos;ll find what fits.
                                        </p>
                                    )}
                                </div>

                                {/* CTA */}
                                <Link
                                    href={plan.ctaHref}
                                    className={cn(
                                        "flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-all",
                                        plan.ctaStyle
                                    )}
                                >
                                    {plan.cta}
                                    <ArrowRight className="w-4 h-4" />
                                </Link>

                                {/* Features */}
                                <div className="space-y-2.5">
                                    {plan.features.map((f) => (
                                        <div key={f.text} className="flex items-start gap-2.5">
                                            <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                                            <span className="text-sm text-slate-300">{f.text}</span>
                                        </div>
                                    ))}
                                    {plan.notIncluded.map((f) => (
                                        <div key={f} className="flex items-start gap-2.5 opacity-35">
                                            <div className="w-4 h-4 shrink-0 mt-0.5 flex items-center justify-center">
                                                <div className="w-3 h-px bg-slate-600" />
                                            </div>
                                            <span className="text-sm text-slate-500">{f}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Ethics note */}
                <div className="mt-10 rounded-xl border border-[#1e2d45] bg-[#0d1424] p-6 flex items-start gap-4 max-w-3xl mx-auto">
                    <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                        <Shield className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-white mb-1">Our pricing philosophy</p>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Job seekers — especially those without degrees or at early career stages — shouldn&apos;t pay to prove their worth. The free plan is permanent, not a trial. Pro is for people who have found WorkProofolio genuinely useful and want more horsepower. We&apos;ll never put your existing submissions behind a paywall or delete your profile for downgrading.
                        </p>
                    </div>
                </div>
            </section>

            {/* Audience callouts */}
            <section className="border-y border-[#1a2540] py-16 bg-[#0d1424]">
                <div className="max-w-5xl mx-auto px-6">
                    <h2 className="text-2xl font-bold text-white text-center mb-10">Which plan is right for you?</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: Star,
                                iconColor: "text-slate-400 bg-white/5 border-white/10",
                                title: "Just starting out",
                                plan: "Free",
                                planColor: "text-slate-400",
                                points: [
                                    "You want to see if WorkProofolio is worth it",
                                    "You're building your first 1–3 proof submissions",
                                    "You want a shareable link with no upfront cost",
                                ],
                            },
                            {
                                icon: Zap,
                                iconColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
                                title: "Actively job hunting",
                                plan: "Pro — $12/mo",
                                planColor: "text-blue-400",
                                points: [
                                    "You want to complete more than 3 challenges",
                                    "You're sending your profile to employers and want analytics",
                                    "You want a polished, employer-ready profile view",
                                ],
                            },
                            {
                                icon: Users,
                                iconColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
                                title: "Institution or hiring team",
                                plan: "Teams — Custom",
                                planColor: "text-emerald-400",
                                points: [
                                    "You run a bootcamp, school, or coding program",
                                    "You hire developers and want to review proof work",
                                    "You need cohort-level dashboards and reporting",
                                ],
                            },
                        ].map(({ icon: Icon, iconColor, title, plan, planColor, points }) => (
                            <div key={title} className="rounded-xl border border-[#1e2d45] bg-[#111827] p-6">
                                <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center border mb-4", iconColor)}>
                                    <Icon className="w-4 h-4" />
                                </div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">{title}</p>
                                <p className={cn("text-base font-bold mb-4", planColor)}>{plan}</p>
                                <ul className="space-y-2">
                                    {points.map((p) => (
                                        <li key={p} className="flex items-start gap-2 text-sm text-slate-400">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-slate-600 shrink-0 mt-0.5" />
                                            {p}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="max-w-3xl mx-auto px-6 py-20">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-white mb-3">Frequently asked questions</h2>
                    <p className="text-slate-400">Honest answers about how pricing works.</p>
                </div>
                <div className="space-y-2">
                    {faqs.map((faq, i) => (
                        <div
                            key={i}
                            className="rounded-xl border border-[#1e2d45] bg-[#111827] overflow-hidden"
                        >
                            <button
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                            >
                                <span className="text-sm font-medium text-white">{faq.q}</span>
                                {openFaq === i
                                    ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                                    : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                                }
                            </button>
                            {openFaq === i && (
                                <div className="px-5 pb-5 border-t border-[#1e2d45]">
                                    <p className="text-sm text-slate-400 leading-relaxed pt-4">{faq.a}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Final CTA */}
            <section className="border-t border-[#1a2540] py-20 bg-[#0d1424]">
                <div className="max-w-xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 mb-6">
                        <Shield className="w-7 h-7 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-3">Start free. Upgrade when it&apos;s worth it.</h2>
                    <p className="text-slate-400 mb-8 leading-relaxed">
                        Build your first proof submissions at no cost. No card, no trial expiry, no pressure.
                        Upgrade to Pro when you&apos;re ready to go deeper.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-2 px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-blue-900/30"
                        >
                            Get started for free
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <a
                            href="mailto:hello@workproofolio.io"
                            className="flex items-center gap-2 px-7 py-3.5 border border-[#1e2d45] bg-white/5 hover:bg-white/8 text-slate-300 font-medium rounded-xl transition-colors text-sm"
                        >
                            <GraduationCap className="w-4 h-4" />
                            Talk to us about Teams
                        </a>
                    </div>
                    <p className="text-xs text-slate-600 mt-5">
                        Questions? Email us at{" "}
                        <a href="mailto:hello@workproofolio.io" className="text-slate-500 hover:text-slate-400 underline underline-offset-2">
                            hello@workproofolio.io
                        </a>
                    </p>
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
                        <Link href="/profile" className="hover:text-slate-400 transition-colors">Sample Profile</Link>
                        <Link href="/employer-view" className="hover:text-slate-400 transition-colors">For Employers</Link>
                        <Link href="/roadmap" className="hover:text-slate-400 transition-colors">Roadmap</Link>
                        <Link href="/trust" className="hover:text-slate-400 transition-colors">Trust &amp; Ethics</Link>
                    </div>
                    <p>Real work beats résumés.</p>
                </div>
            </footer>
        </div>
    );
}
