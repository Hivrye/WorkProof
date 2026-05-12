"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Shield,
  ArrowRight,
  CheckCircle2,
  Zap,
  FileText,
  Users,
  Star,
  BarChart3,
  ChevronRight,
  Quote,
  BadgeCheck,
  Lightbulb,
  UserCheck,
  GraduationCap,
  Building2,
  Brain,
  Search,
  MessageSquare,
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } },
};

const testimonials = [
  {
    quote: "I had no degree and no big-name employer to point to. WorkProof let me show what I could actually do — and I got three interview invites within two weeks of sharing my profile.",
    name: "Priya M.",
    role: "Self-taught developer, landed front-end role at Relay",
    initials: "PM",
    color: "from-blue-500 to-violet-600",
  },
  {
    quote: "As a bootcamp, we now recommend WorkProof to every grad. Employers respond way better to a proof profile than another portfolio site. It shows process, not just output.",
    name: "Jordan K.",
    role: "Outcomes Director, Launchpad Dev Bootcamp",
    initials: "JK",
    color: "from-emerald-500 to-cyan-600",
  },
  {
    quote: "I was switching careers from marketing to UX. WorkProof gave me a structured way to build credible evidence — and I could be transparent about using AI without it feeling like a liability.",
    name: "Sam T.",
    role: "Career-switcher, now Junior UX Designer at Notion",
    initials: "ST",
    color: "from-pink-500 to-rose-600",
  },
];

export default function LandingPage() {
  const [activeAudience, setActiveAudience] = useState<"seekers" | "bootcamps" | "employers">("seekers");

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white">
      {/* Nav */}
      <nav className="border-b border-[#1a2540] px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">WorkProof</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="#audiences" className="text-sm text-slate-400 hover:text-white transition-colors hidden sm:block">
            Who It&apos;s For
          </Link>
          <Link href="/pricing" className="text-sm text-slate-400 hover:text-white transition-colors hidden sm:block">
            Pricing
          </Link>
          <Link href="/employer-view" className="text-sm text-slate-400 hover:text-white transition-colors hidden sm:block">
            For Employers
          </Link>
          <Link href="/tracks" className="text-sm text-slate-400 hover:text-white transition-colors hidden sm:block">
            Browse Tracks
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
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div {...fadeUp}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-medium mb-6">
              <BadgeCheck className="w-3.5 h-3.5" />
              The career platform built on what you can actually do
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Show your work.{" "}
              <span className="gradient-text">Get the job.</span>
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed mb-8 max-w-xl">
              WorkProof helps job seekers prove their skills through real-world challenges — not
              credentials. Complete tasks, document your process, and share a verified proof profile
              employers can actually evaluate.
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <Link
                href="/onboarding"
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-900/30"
              >
                Build Your Proof Profile
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/employer-view"
                className="flex items-center gap-2 px-6 py-3 border border-[#1e2d45] bg-white/5 hover:bg-white/8 text-white font-semibold rounded-xl transition-all duration-200"
              >
                See the Employer View
              </Link>
            </div>
            <p className="text-xs text-slate-600 mt-4">Free to use · No degree required · AI use welcomed and disclosed</p>
          </motion.div>

          {/* Hero card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="rounded-2xl border border-[#1e2d45] bg-[#111827] p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Proof Score</p>
                  <p className="text-3xl font-bold text-white mt-1">742 <span className="text-slate-600 text-lg">/ 1000</span></p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-400" />
                </div>
              </div>
              <div className="w-full h-2 bg-[#1e2d45] rounded-full mb-6">
                <div className="h-full w-[74%] bg-gradient-to-r from-blue-600 to-violet-600 rounded-full" />
              </div>
              <div className="space-y-3">
                {[
                  { title: "Build a SaaS Pricing Section", status: "In Progress", score: null, color: "text-blue-400 bg-blue-400/10" },
                  { title: "Fix Accessibility Issues", status: "Completed", score: 92, color: "text-emerald-400 bg-emerald-400/10" },
                  { title: "Responsive Dashboard Cards", status: "Completed", score: 88, color: "text-emerald-400 bg-emerald-400/10" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/3 border border-white/5">
                    <div className="flex items-center gap-3 min-w-0">
                      <CheckCircle2 className={`w-4 h-4 shrink-0 ${item.score ? "text-emerald-400" : "text-blue-400"}`} />
                      <span className="text-sm text-slate-300 truncate">{item.title}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {item.score && <span className="text-sm font-bold text-white">{item.score}</span>}
                      <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${item.color}`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-5 border-t border-[#1e2d45] space-y-2">
                {[
                  { name: "Accessibility", val: 88 },
                  { name: "UI Implementation", val: 82 },
                  { name: "AI Collaboration", val: 91 },
                ].map((s) => (
                  <div key={s.name} className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 w-32 shrink-0">{s.name}</span>
                    <div className="flex-1 h-1.5 bg-[#1e2d45] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-600 to-violet-600 rounded-full" style={{ width: `${s.val}%` }} />
                    </div>
                    <span className="text-xs text-slate-500 w-8 text-right">{s.val}%</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <span className="text-xs text-slate-600 flex items-center justify-center gap-1">
                  <Shield className="w-3 h-3 text-blue-500" />
                  Alex Carter — Front-End Developer
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-[#1a2540] py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "1,200+", label: "Proof profiles built" },
              { value: "94%", label: "Employer response rate" },
              { value: "12", label: "Career tracks" },
              { value: "Free", label: "Always, for job seekers" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Hiring is broken. Proof fixes it.</h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Resumes, cover letters, and portfolio sites are getting harder to trust. AI can generate
            polished claims in minutes. WorkProof helps candidates show process, output, and skill
            evidence — things that are genuinely hard to fake.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: FileText, title: "Resumes tell stories.", description: "Anyone can claim they increased revenue by 40% or led a team of 12. Without context or evidence, it is just a sentence." },
            { icon: Users, title: "Portfolios show results.", description: "A beautiful design or a polished project can hide whether the candidate actually drove it — or had it handed to them." },
            { icon: Shield, title: "WorkProof shows proof.", description: "Real tasks. Written process notes. AI disclosure. Scored submissions. Employers see how candidates actually think and work." },
          ].map(({ icon: Icon, title, description }) => (
            <div key={title} className="rounded-xl border border-[#1e2d45] bg-[#111827] p-6">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-[#1a2540] py-20 bg-[#0d1424]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">How WorkProof works</h2>
            <p className="text-slate-400">Four steps to a shareable proof profile.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Pick a career track", desc: "Choose from 12 professional tracks that match your goals — from front-end dev to UX design to data analysis." },
              { step: "02", title: "Complete real challenges", desc: "Work through job-simulation tasks with realistic briefs, deliverables, and evaluation criteria." },
              { step: "03", title: "Submit and document your process", desc: "Share your output, explain your decisions, and disclose any AI usage — transparently and without shame." },
              { step: "04", title: "Share your Proof Profile", desc: "Your profile is a living portfolio of scored submissions, verified skills, and evidence employers can actually evaluate." },
            ].map(({ step, title, desc }) => (
              <div key={step}>
                <div className="text-5xl font-bold text-[#1e2d45] mb-4 font-mono">{step}</div>
                <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Everything you need to prove your skills</h2>
          <p className="text-slate-400">Built for job seekers who want to stand out with substance.</p>
        </div>
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {[
            { icon: Zap, title: "Real-world job simulations", desc: "Every challenge is based on actual work scenarios, not academic exercises.", color: "text-blue-400 bg-blue-400/10 border-blue-500/20" },
            { icon: FileText, title: "Process documentation", desc: "Log your thinking step by step. Employers see how you approach problems, not just the final output.", color: "text-violet-400 bg-violet-400/10 border-violet-500/20" },
            { icon: Shield, title: "AI usage disclosure", desc: "Transparent AI collaboration is a modern workplace skill. WorkProof makes disclosing it easy and respected.", color: "text-cyan-400 bg-cyan-400/10 border-cyan-500/20" },
            { icon: Star, title: "Shareable Proof Profile", desc: "Your profile is a living portfolio of completed challenges, scores, and process evidence.", color: "text-emerald-400 bg-emerald-400/10 border-emerald-500/20" },
            { icon: BarChart3, title: "Proof Score", desc: "A composite score based on challenge quality, process clarity, skill breadth, and AI transparency.", color: "text-amber-400 bg-amber-400/10 border-amber-500/20" },
            { icon: Users, title: "Employer-ready evidence", desc: "Employers get a dedicated view with role fit, red flags, green flags, and interview questions.", color: "text-pink-400 bg-pink-400/10 border-pink-500/20" },
          ].map(({ icon: Icon, title, desc, color }) => (
            <motion.div key={title} variants={fadeUp} className="rounded-xl border border-[#1e2d45] bg-[#111827] p-6 hover:border-blue-500/30 transition-all">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center border mb-4 ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Sample proof card */}
      <section className="bg-[#0d1424] border-y border-[#1a2540] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Built for the way hiring actually works now</h2>
              <div className="space-y-4">
                {[
                  "Resumes say what you've done. Your proof shows how you think.",
                  "AI collaboration is disclosed, explained, and treated as a skill — not hidden.",
                  "Employers see your process, not just your final output.",
                  "One shareable link. No portfolio site required.",
                  "Works whether you have a degree, a bootcamp certificate, or nothing at all.",
                ].map((text) => (
                  <div key={text} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <p className="text-slate-300 text-sm leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex items-center gap-4">
                <Link href="/tracks" className="flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
                  Browse all 12 tracks <ChevronRight className="w-4 h-4" />
                </Link>
                <Link href="/employer-view" className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">
                  See employer view <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="rounded-2xl border border-[#1e2d45] bg-[#111827] p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Proof Evidence</p>
                  <h3 className="text-base font-semibold text-white">Fix Accessibility Issues in a Landing Page</h3>
                </div>
                <span className="text-2xl font-bold text-white">92</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 rounded-md text-xs bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">Completed</span>
                <span className="px-2 py-1 rounded-md text-xs bg-blue-400/10 text-blue-400 border border-blue-400/20">AI: Brainstorm Only</span>
                <span className="px-2 py-1 rounded-md text-xs bg-white/5 text-slate-400 border border-white/5">Front-End</span>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Process Timeline</p>
                {["Initial Lighthouse audit", "Manual keyboard testing", "Fixed semantic HTML", "Added ARIA attributes", "Final verification — score improved to 97"].map((step, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-400">
                    <div className="w-4 h-4 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 text-xs shrink-0">{i + 1}</div>
                    {step}
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t border-[#1e2d45]">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">Skills Verified</p>
                <div className="flex flex-wrap gap-1.5">
                  {["Accessibility", "HTML", "ARIA", "Keyboard Navigation", "Auditing"].map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded-md text-xs bg-white/5 text-slate-400 border border-white/5">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-medium mb-4">
            <Star className="w-3.5 h-3.5" />
            Real people, real outcomes
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">What people are saying</h2>
          <p className="text-slate-400">From bootcamp grads to career-switchers to hiring teams.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-xl border border-[#1e2d45] bg-[#111827] p-6 flex flex-col gap-5">
              <Quote className="w-5 h-5 text-slate-600" />
              <p className="text-sm text-slate-300 leading-relaxed flex-1">{t.quote}</p>
              <div className="flex items-center gap-3 pt-4 border-t border-[#1e2d45]">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Audience sections */}
      <section className="border-y border-[#1a2540] py-20 bg-[#0d1424]" id="audiences">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-3">Who it&apos;s for</p>
            <h2 className="text-3xl font-bold text-white mb-3">One platform. Three groups it actually serves.</h2>
            <p className="text-slate-400 text-base max-w-xl mx-auto">
              WorkProof was built for specific people with specific problems. Pick yours.
            </p>
          </div>

          {/* Audience tab switcher */}
          <div className="flex flex-wrap items-center gap-2 justify-center mb-12">
            {([
              { id: "seekers", icon: UserCheck, label: "For Job Seekers" },
              { id: "bootcamps", icon: GraduationCap, label: "For Bootcamps" },
              { id: "employers", icon: Building2, label: "For Employers" },
            ] as const).map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveAudience(id)}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all",
                  activeAudience === id
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                    : "bg-white/5 border border-[#1e2d45] text-slate-400 hover:text-white hover:border-blue-500/30"
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* ── Job Seekers ── */}
          {activeAudience === "seekers" && (
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-medium mb-5">
                  <UserCheck className="w-3.5 h-3.5" /> For Job Seekers
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Build real proof when you don&apos;t have a traditional résumé.
                </h3>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  Employers are drowning in polished résumés that say nothing verifiable. WorkProof gives you a structured way to show what you can actually do — through real job simulations, documented process, and honest AI disclosure.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    { icon: CheckCircle2, text: "No degree? Complete real job simulations — not toy projects — across 12 career tracks." },
                    { icon: Brain, text: "Document your thinking as you work. Employers see how you approach problems, not just the result." },
                    { icon: Shield, text: "Disclose AI use honestly. It's a modern workplace skill — we treat it like one." },
                    { icon: ArrowRight, text: "Share one link. Your Proof Profile is stronger than any portfolio site or résumé." },
                  ].map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-start gap-3">
                      <Icon className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-300">{text}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/onboarding"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm transition-colors"
                >
                  Start your Proof Profile — it&apos;s free
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              {/* Profile mock */}
              <div className="rounded-2xl border border-[#1e2d45] bg-[#111827] p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Proof Score</p>
                    <p className="text-3xl font-bold text-white">742 <span className="text-slate-600 text-base font-normal">/ 1000</span></p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-blue-400" />
                  </div>
                </div>
                <div className="w-full h-1.5 bg-[#1e2d45] rounded-full mb-5">
                  <div className="h-full w-[74%] bg-gradient-to-r from-blue-600 to-violet-600 rounded-full" />
                </div>
                <div className="space-y-2">
                  {[
                    { title: "Fix Accessibility Issues in a Landing Page", score: 92, done: true },
                    { title: "Responsive Dashboard Card System", score: 88, done: true },
                    { title: "Build a SaaS Pricing Section", score: null, done: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/3 border border-white/5">
                      <CheckCircle2 className={`w-4 h-4 shrink-0 ${item.done ? "text-emerald-400" : "text-blue-400"}`} />
                      <span className="flex-1 text-sm text-slate-300 truncate">{item.title}</span>
                      {item.score && <span className="text-sm font-bold text-white">{item.score}</span>}
                      <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${item.done ? "text-emerald-400 bg-emerald-400/10" : "text-blue-400 bg-blue-400/10"}`}>
                        {item.done ? "Completed" : "In Progress"}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-[#1e2d45] flex items-center justify-between">
                  <span className="text-xs text-slate-500 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Profile viewed 47 times this week
                  </span>
                  <span className="text-xs text-blue-400 font-medium">Copy share link →</span>
                </div>
              </div>
            </div>
          )}

          {/* ── Bootcamps ── */}
          {activeAudience === "bootcamps" && (
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-medium mb-5">
                  <GraduationCap className="w-3.5 h-3.5" /> For Bootcamps &amp; Schools
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Help your graduates prove what they learned — not just that they finished.
                </h3>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  Hiring partners don&apos;t want to read a cohort outcomes PDF. They want to see real work. WorkProof gives your students a scored, shareable proof profile that makes your program&apos;s outcomes measurable — and your graduates more hireable.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    { icon: BarChart3, text: "Track cohort progress across structured, real-world challenge tracks." },
                    { icon: FileText, text: "Every submission includes process notes, AI disclosure, and a quality score — automatically." },
                    { icon: Star, text: "Students graduate with a shareable Proof Profile, not just a certificate or GitHub link." },
                    { icon: Building2, text: "Give hiring partners actual evidence of quality — scored work they can evaluate in minutes." },
                  ].map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-start gap-3">
                      <Icon className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-300">{text}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="mailto:hello@workproof.io"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm transition-colors"
                >
                  Talk to us about a partnership
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
              {/* Cohort outcomes mock */}
              <div className="rounded-2xl border border-[#1e2d45] bg-[#111827] p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Launchpad Dev Bootcamp</p>
                    <p className="text-xs text-slate-500">Spring 2026 Cohort · 34 students</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { value: "89%", label: "Completion rate", color: "text-emerald-400" },
                    { value: "82", label: "Avg proof score", color: "text-blue-400" },
                    { value: "6", label: "Hiring partners", color: "text-violet-400" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-lg bg-white/3 border border-white/5 p-3 text-center">
                      <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                      <p className="text-xs text-slate-500 mt-0.5 leading-tight">{s.label}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  {[
                    { name: "Alex C.", track: "Front-End Dev", score: 92, status: "Hired", hired: true },
                    { name: "Maria S.", track: "UX Design", score: 88, status: "Interviewing", hired: false },
                    { name: "James K.", track: "Data Analysis", score: 85, status: "Interviewing", hired: false },
                  ].map((s) => (
                    <div key={s.name} className="flex items-center gap-3 p-3 rounded-lg bg-white/3 border border-white/5">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {s.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-medium">{s.name}</p>
                        <p className="text-xs text-slate-500">{s.track}</p>
                      </div>
                      <span className="text-sm font-bold text-white">{s.score}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${s.hired ? "text-emerald-400 bg-emerald-400/10" : "text-amber-400 bg-amber-400/10"}`}>
                        {s.status}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-[#1e2d45]">
                  <p className="text-xs text-slate-500 text-center">Proof Profiles shared with 6 hiring partners this cohort</p>
                </div>
              </div>
            </div>
          )}

          {/* ── Employers ── */}
          {activeAudience === "employers" && (
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 text-xs font-medium mb-5">
                  <Building2 className="w-3.5 h-3.5" /> For Employers &amp; Recruiters
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Stop guessing from résumés. Evaluate candidates on real work.
                </h3>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  Résumés tell stories. Portfolios show results. WorkProof shows how candidates actually think — how they approach ambiguous problems, use AI, explain their decisions, and handle constraints under realistic pressure.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    { icon: Search, text: "Review scored work samples with documented process context attached — in minutes, not hours." },
                    { icon: Brain, text: "See exactly how candidates used AI: which tools, what they generated, what they personally built." },
                    { icon: MessageSquare, text: "Get tailored interview questions generated from their specific proof evidence and gaps." },
                    { icon: BarChart3, text: "Filter by track, score range, availability, and skill coverage across all candidates." },
                  ].map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-start gap-3">
                      <Icon className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-300">{text}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/employer-view"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl text-sm transition-colors"
                >
                  See a sample employer profile
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              {/* Employer view mock */}
              <div className="rounded-2xl border border-[#1e2d45] bg-[#111827] p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    AC
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">Alex Carter</p>
                    <p className="text-xs text-slate-500">Front-End Developer · Proof verified</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-2xl font-bold text-white">742</p>
                    <p className="text-xs text-slate-500">Proof Score</p>
                  </div>
                </div>
                <div className="space-y-0 mb-5 rounded-lg bg-white/3 border border-white/5 divide-y divide-[#1e2d45] overflow-hidden">
                  {[
                    { label: "Avg challenge score", value: "90 / 100" },
                    { label: "AI usage disclosed", value: "100% of submissions" },
                    { label: "Availability", value: "Immediately available" },
                    { label: "Challenges completed", value: "8" },
                  ].map((f) => (
                    <div key={f.label} className="flex items-center justify-between px-4 py-2.5">
                      <span className="text-xs text-slate-500">{f.label}</span>
                      <span className="text-xs font-medium text-white">{f.value}</span>
                    </div>
                  ))}
                </div>
                <div className="rounded-lg bg-violet-500/8 border border-violet-500/20 p-3 mb-4">
                  <p className="text-xs text-violet-400 font-semibold uppercase tracking-wider mb-1.5">Suggested interview question</p>
                  <p className="text-sm text-slate-300 leading-relaxed italic">&ldquo;Walk me through your accessibility audit process. What did you check first and why?&rdquo;</p>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 text-xs font-semibold text-white bg-violet-600 rounded-lg">Request Interview</button>
                  <button className="flex-1 py-2 text-xs font-semibold text-slate-300 border border-[#1e2d45] rounded-lg">Download Report</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-[#1a2540] py-20 bg-[#0d1424]">
        <div className="max-w-xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 mb-6">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Start proving what you can do.</h2>
          <p className="text-slate-400 mb-8">No gatekeepers. No degree requirements. Just real work, honest process, and a profile that speaks for itself.</p>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-900/30"
          >
            Build Your Proof Profile
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-xs text-slate-600 mt-4">Free · No account setup required for the MVP preview</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1a2540] py-8">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-sm text-slate-600 flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-500/60" />
            <span className="font-medium text-slate-500">WorkProof</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/tracks" className="hover:text-slate-400 transition-colors">Tracks</Link>
            <Link href="/pricing" className="hover:text-slate-400 transition-colors">Pricing</Link>
            <Link href="/profile" className="hover:text-slate-400 transition-colors">Sample Profile</Link>
            <Link href="/employer-view" className="hover:text-slate-400 transition-colors">For Employers</Link>
            <Link href="/roadmap" className="hover:text-slate-400 transition-colors">Roadmap</Link>
            <Link href="/trust" className="hover:text-slate-400 transition-colors">Trust &amp; Ethics</Link>
          </div>
          <p>Real work beats resumes.</p>
        </div>
      </footer>
    </div>
  );
}
