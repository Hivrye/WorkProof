"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { DisclosureBadge } from "@/components/proof/DisclosureBadge";
import {
    Shield,
    CheckCircle2,
    ExternalLink,
    Copy,
    Check,
    MapPin,
    Wifi,
    Clock,
    Download,
    Award,
    GitBranch,
    ChevronDown,
    ChevronUp,
    Share2,
    Star,
    FileText,
    Info,
    ArrowUpRight,
    Pin,
    Layers,
    CalendarDays,
    CircleDot,
    Sparkles,
} from "lucide-react";
import type { Submission, User } from "@/types";

// ── Self-contained mock data ─────────────────────────────────────────────────
// Registry maps username → { user, submissions, skillEvidence }.
// When real auth exists: replace with a Supabase or API fetch keyed by user ID.

const alexCarterUser: User = {
    id: "user-001",
    name: "Alex Carter",
    username: "alex-carter",
    targetRole: "Front-End Developer",
    location: "Austin, TX",
    bio: "Self-taught front-end developer with 2 years of hands-on project experience. Background in graphic design — I care about accessibility and explaining my decisions clearly. Currently open to junior and mid-level front-end roles.",
    avatarInitials: "AC",
    trackId: "frontend",
    track: "Front-End Developer",
    level: "Emerging Talent",
    profileCompletion: 68,
    completedChallenges: 3,
    inProgressChallenges: 1,
    profileViews: 312,
    weeklyProfileViews: 47,
    avgScore: 88,
    endorsements: 3,
    proofScore: { total: 742, maxTotal: 1000, workQuality: 82, processClarity: 76, skillCoverage: 69, aiTransparency: 91, consistency: 78 },
    skills: [
        { name: "Accessibility", score: 92, maxScore: 100 },
        { name: "UI Implementation", score: 86, maxScore: 100 },
        { name: "CSS & Layout", score: 85, maxScore: 100 },
        { name: "Component Design", score: 79, maxScore: 100 },
        { name: "Process Clarity", score: 88, maxScore: 100 },
    ],
    portfolioLink: "https://alexcarter.dev",
    githubLink: "https://github.com/alexcarter",
    linkedinLink: "https://linkedin.com/in/alexcarter",
    isPublic: true,
    aiTransparencyPreference: "full",
    joinedAt: "2026-02-14",
    availability: "Immediately available",
    openToRemote: true,
};

const alexCarterSubmissions: Submission[] = [
    {
        id: "sub-001",
        challengeId: "fe-003",
        challengeTitle: "Fix Accessibility Issues in a Landing Page",
        track: "Front-End Developer",
        submittedAt: "2026-04-28T14:30:00Z",
        projectTitle: "Accessibility Audit & Fix — Bloom Wellness",
        liveLink: "https://bloom-a11y-fix.vercel.app",
        repoLink: "https://github.com/alexcarter/bloom-a11y-fix",
        explanation: "I audited the landing page using Lighthouse, axe DevTools, and manual keyboard testing. Found 7 distinct issues — the most critical was replacing div-based buttons with real button elements and adding proper ARIA attributes throughout.",
        problemStatement: "The landing page had critical accessibility failures that made it unusable for keyboard-only and screen reader users. Missing landmarks, poor contrast, and non-semantic HTML were the core issues.",
        designDecisions: "I chose to fix rather than redesign — preserving the visual style while correcting the underlying structure. Added skip-to-content links, fixed heading hierarchy, and ensured all interactive elements met WCAG 2.1 AA contrast ratios.",
        improvements: "With more time I would add automated accessibility testing to the CI pipeline and conduct a real user test with a screen reader user.",
        aiDisclosure: "brainstorm",
        aiDescription: "Used ChatGPT to understand the correct ARIA pattern for a disclosure card. Verified every attribute against the ARIA Authoring Practices Guide before applying it.",
        processSteps: [
            { id: "ps-001-1", title: "Lighthouse & axe Audit", description: "Ran Lighthouse — got a 43 accessibility score. Exported the full issue list and organised by impact (critical / serious / moderate).", timestamp: "2026-04-28T09:00:00Z" },
            { id: "ps-001-2", title: "Manual Keyboard Navigation Test", description: "Tabbed through the entire page without a mouse. Found 3 interactive elements that could not receive focus.", timestamp: "2026-04-28T09:45:00Z" },
            { id: "ps-001-3", title: "Semantic HTML Refactor", description: "Replaced all button-like divs with real button elements. Fixed the heading hierarchy. Wrapped navigations in nav with aria-label.", timestamp: "2026-04-28T11:00:00Z" },
            { id: "ps-001-4", title: "ARIA Attributes & Alt Text", description: "Added alt attributes to all 12 images. Added aria-label to all icon-only buttons. Added role='alert' to the form error message.", timestamp: "2026-04-28T12:30:00Z" },
            { id: "ps-001-5", title: "Final Audit & VoiceOver Verification", description: "Re-ran Lighthouse — score improved from 43 to 97. Tested with VoiceOver on macOS Safari. All form controls announced correctly.", timestamp: "2026-04-28T14:00:00Z" },
        ],
        score: 92,
        skills: ["Accessibility", "Semantic HTML", "ARIA", "Keyboard Navigation", "Auditing"],
    },
    {
        id: "sub-002",
        challengeId: "fe-002",
        challengeTitle: "Create a Responsive Dashboard Card System",
        track: "Front-End Developer",
        submittedAt: "2026-04-15T11:00:00Z",
        projectTitle: "Modular Metric Cards — Slate Dashboard",
        liveLink: "https://slate-cards.vercel.app",
        repoLink: "https://github.com/alexcarter/slate-cards",
        explanation: "Built a fully componentised card system using CSS Grid and CSS custom properties. Each card accepts a data object and renders consistently across breakpoints.",
        problemStatement: "The analytics team needed a reusable card system for different data types without maintaining bespoke markup for each.",
        designDecisions: "Used CSS Grid auto-fill/minmax for responsiveness without hardcoded breakpoints. CSS custom properties expose a theming API. The trend indicator is driven by a single numeric prop.",
        improvements: "I would add skeleton loading states and a count-up animation on first render.",
        aiDisclosure: "suggestions",
        aiDescription: "GitHub Copilot autocompleted repetitive CSS property declarations. I reviewed every suggestion before accepting. All component architecture decisions were made by me.",
        processSteps: [
            { id: "ps-002-1", title: "Sketch Card Variants", description: "Drew 3 layout options in Figma. Chose the denser layout after testing it with realistic numbers.", timestamp: "2026-04-15T08:00:00Z" },
            { id: "ps-002-2", title: "Built Base Card Component", description: "Created the HTML structure with BEM naming. Applied base dark-theme styles.", timestamp: "2026-04-15T08:45:00Z" },
            { id: "ps-002-3", title: "Responsive Grid Layout", description: "Implemented auto-fill grid. Tested at 320px, 768px, and 1440px. Cards wrap correctly with no overflow.", timestamp: "2026-04-15T10:00:00Z" },
            { id: "ps-002-4", title: "Trend Indicator Logic", description: "Added percentage change prop. Positive = green arrow, negative = red, zero = flat grey. AA contrast compliant.", timestamp: "2026-04-15T10:30:00Z" },
        ],
        score: 88,
        skills: ["CSS Grid", "Component Design", "Responsive Layout", "Visual Design", "CSS Custom Properties"],
    },
    {
        id: "sub-003",
        challengeId: "fe-001",
        challengeTitle: "Build a SaaS Pricing Section",
        track: "Front-End Developer",
        submittedAt: "2026-03-30T15:00:00Z",
        projectTitle: "Pricing UI — Clarity SaaS",
        liveLink: "https://clarity-pricing.vercel.app",
        repoLink: "https://github.com/alexcarter/clarity-pricing",
        explanation: "Designed and built a three-tier pricing section with a monthly/annual toggle. Prices animate on toggle. The recommended tier has an elevated style. Fully keyboard accessible.",
        problemStatement: "Marketing needed a pricing page that guided users toward the Pro tier without feeling manipulative.",
        designDecisions: "Used a CSS-only toggle for the billing switch. The Recommended tier scales slightly on hover. Prices update via CSS variables toggled by a data attribute on the wrapper.",
        improvements: "I would add an FAQ section and a feature comparison table.",
        aiDisclosure: "none",
        aiDescription: undefined,
        processSteps: [
            { id: "ps-003-1", title: "Research pricing patterns", description: "Reviewed 6 SaaS pricing pages. Noted what drove me toward the middle tier on each.", timestamp: "2026-03-30T09:00:00Z" },
            { id: "ps-003-2", title: "Wireframe & Hierarchy", description: "Built low-fi wireframe. Decided on a 3-column layout with the Pro tier elevated in the centre.", timestamp: "2026-03-30T10:00:00Z" },
            { id: "ps-003-3", title: "HTML & CSS Implementation", description: "Built the structure with semantic HTML. Used CSS Grid for tier columns. Prices set via CSS custom properties.", timestamp: "2026-03-30T11:30:00Z" },
            { id: "ps-003-4", title: "Toggle & Animation", description: "Built the monthly/annual toggle. Prices animate with a 200ms ease transition. Tested in Firefox, Chrome, and Safari.", timestamp: "2026-03-30T13:00:00Z" },
            { id: "ps-003-5", title: "Accessibility Pass", description: "Added aria-pressed to the toggle, aria-label to each tier CTA, and a live region announcing the billing period.", timestamp: "2026-03-30T14:30:00Z" },
        ],
        score: 85,
        skills: ["UI Design", "CSS Animations", "Accessibility", "Information Architecture", "Responsive Layout"],
    },
];

const alexCarterSkillEvidence: Record<string, string[]> = {
    "Accessibility": ["Accessibility Audit & Fix — Bloom Wellness", "Pricing UI — Clarity SaaS"],
    "UI Implementation": ["Accessibility Audit & Fix — Bloom Wellness", "Modular Metric Cards — Slate Dashboard"],
    "CSS & Layout": ["Modular Metric Cards — Slate Dashboard", "Pricing UI — Clarity SaaS"],
    "Component Design": ["Modular Metric Cards — Slate Dashboard"],
    "Process Clarity": ["Accessibility Audit & Fix — Bloom Wellness", "Modular Metric Cards — Slate Dashboard", "Pricing UI — Clarity SaaS"],
};

// Second profile — demonstrates multi-user routing
const alexChenUser: User = {
    id: "user-002",
    name: "Alex Chen",
    username: "alex-chen",
    targetRole: "Back-End Engineer",
    location: "San Francisco, CA",
    bio: "Back-end engineer focused on API design and data integrity. 3 years of Node.js and PostgreSQL experience. I write the code that makes the front end look good.",
    avatarInitials: "AC",
    trackId: "backend",
    track: "Back-End Developer",
    level: "Mid-Level",
    profileCompletion: 72,
    completedChallenges: 1,
    inProgressChallenges: 2,
    profileViews: 188,
    weeklyProfileViews: 31,
    avgScore: 90,
    endorsements: 1,
    proofScore: { total: 680, maxTotal: 1000, workQuality: 88, processClarity: 72, skillCoverage: 60, aiTransparency: 85, consistency: 70 },
    skills: [
        { name: "API Design", score: 90, maxScore: 100 },
        { name: "Database Modelling", score: 87, maxScore: 100 },
        { name: "Security Awareness", score: 83, maxScore: 100 },
        { name: "Process Documentation", score: 72, maxScore: 100 },
    ],
    portfolioLink: "https://alexchen.dev",
    githubLink: "https://github.com/alexchen",
    linkedinLink: "https://linkedin.com/in/alexchen",
    isPublic: true,
    aiTransparencyPreference: "suggestions",
    joinedAt: "2026-03-01",
    availability: "Available in 2 weeks",
    openToRemote: true,
};

const alexChenSubmissions: Submission[] = [
    {
        id: "sub-101",
        challengeId: "be-001",
        challengeTitle: "Design a REST API for a Task Manager",
        track: "Back-End Developer",
        submittedAt: "2026-05-01T10:00:00Z",
        projectTitle: "Task Manager API — Node.js & PostgreSQL",
        repoLink: "https://github.com/alexchen/taskapi",
        explanation: "Designed and implemented a RESTful API with JWT authentication, role-based access, and full CRUD for tasks and projects. Followed REST conventions strictly — resources are nouns, HTTP verbs carry intent.",
        problemStatement: "Build a task management API that supports multiple users, teams, and projects with proper auth and sensible error handling.",
        designDecisions: "Used PostgreSQL over MongoDB for relational data integrity. JWTs stored in httpOnly cookies to prevent XSS. Input validation via Zod at the route layer.",
        improvements: "I would add rate limiting on public endpoints and implement refresh token rotation. Logging needs structured output for production observability.",
        aiDisclosure: "suggestions",
        aiDescription: "Used Copilot for boilerplate SQL queries. All schema design, auth logic, and API structure decisions were made and reviewed manually by me.",
        processSteps: [
            { id: "ps-101-1", title: "Schema Design", description: "Designed the ERD before writing any code: Users → Teams (many-to-many), Teams → Projects (one-to-many), Projects → Tasks (one-to-many).", timestamp: "2026-05-01T08:00:00Z" },
            { id: "ps-101-2", title: "Auth Layer — JWT + httpOnly Cookies", description: "Implemented registration and login. JWTs signed with 1h expiry in httpOnly cookies. Refresh tokens with 7-day expiry stored in DB.", timestamp: "2026-05-01T08:45:00Z" },
            { id: "ps-101-3", title: "Route Implementation", description: "Built CRUD endpoints for /tasks, /projects, /teams with Express Router. Zod middleware validates input before reaching controllers.", timestamp: "2026-05-01T09:30:00Z" },
        ],
        score: 90,
        skills: ["REST API Design", "PostgreSQL", "JWT Auth", "Node.js", "Input Validation"],
    },
];

const alexChenSkillEvidence: Record<string, string[]> = {
    "API Design": ["Task Manager API — Node.js & PostgreSQL"],
    "Database Modelling": ["Task Manager API — Node.js & PostgreSQL"],
    "Security Awareness": ["Task Manager API — Node.js & PostgreSQL"],
    "Process Documentation": ["Task Manager API — Node.js & PostgreSQL"],
};

// Registry — extend as users onboard
const profileRegistry: Record<string, {
    user: User;
    submissions: Submission[];
    skillEvidence: Record<string, string[]>;
}> = {
    "alex-carter": { user: alexCarterUser, submissions: alexCarterSubmissions, skillEvidence: alexCarterSkillEvidence },
    "alex-chen": { user: alexChenUser, submissions: alexChenSubmissions, skillEvidence: alexChenSkillEvidence },
};

// ── Helpers ─────────────────────────────────────────────────────────────────
function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
    });
}

function scoreColor(score: number) {
    if (score >= 90) return "text-emerald-400";
    if (score >= 75) return "text-blue-400";
    if (score >= 60) return "text-amber-400";
    return "text-red-400";
}

function scoreBorderBg(score: number) {
    if (score >= 90) return "border-emerald-500/25 bg-emerald-500/5";
    if (score >= 75) return "border-blue-500/25 bg-blue-500/5";
    if (score >= 60) return "border-amber-500/25 bg-amber-500/5";
    return "border-red-500/25 bg-red-500/5";
}

// ── Skill Evidence Card ──────────────────────────────────────────────────────
function SkillEvidenceCard({ name, score, evidence }: { name: string; score: number; evidence: string[] }) {
    const fillColor = score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-blue-500" : "bg-amber-500";
    const textColor = score >= 80 ? "text-emerald-400" : score >= 60 ? "text-blue-400" : "text-amber-400";
    const label = score >= 80 ? "Strong signal" : score >= 60 ? "Solid foundation" : "Building";
    return (
        <div className="rounded-xl border border-[#1e2d45] bg-[#111827] p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-medium text-white leading-tight">{name}</span>
                <span className={`text-sm font-bold tabular-nums shrink-0 ${textColor}`}>
                    {score}<span className="text-slate-600 font-normal text-xs">/100</span>
                </span>
            </div>
            <div className="h-1.5 bg-[#1e2d45] rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${fillColor}`} style={{ width: `${score}%` }} />
            </div>
            <div className="space-y-1">
                <p className={`text-[10px] font-medium uppercase tracking-wider ${textColor}`}>{label}</p>
                {evidence.length > 0 ? evidence.map((e) => (
                    <div key={e} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-slate-600 shrink-0" />
                        <span className="text-xs text-slate-500 leading-tight">{e}</span>
                    </div>
                )) : (
                    <p className="text-xs text-slate-600 italic">No linked challenges yet</p>
                )}
            </div>
        </div>
    );
}

// ── Challenge Result Card ────────────────────────────────────────────────────
function ChallengeResultCard({
    sub,
    pinned,
    defaultExpanded,
}: {
    sub: Submission;
    pinned?: boolean;
    defaultExpanded?: boolean;
}) {
    const [expanded, setExpanded] = useState(defaultExpanded ?? false);

    return (
        <div className={`rounded-2xl border bg-[#111827] overflow-hidden ${scoreBorderBg(sub.score)}`}>
            <button
                onClick={() => setExpanded((v) => !v)}
                className="w-full text-left p-5 sm:p-6"
                aria-expanded={expanded}
            >
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2.5">
                            {pinned && (
                                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-medium">
                                    <Pin className="w-2.5 h-2.5" /> Featured
                                </span>
                            )}
                            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
                                <CheckCircle2 className="w-2.5 h-2.5" /> Completed
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-slate-400">
                                {sub.track}
                            </span>
                            <DisclosureBadge level={sub.aiDisclosure} size="sm" />
                        </div>
                        <h3 className="text-base font-semibold text-white leading-snug">
                            {sub.projectTitle || sub.challengeTitle}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">{sub.challengeTitle}</p>
                    </div>
                    <div className="flex items-start gap-3 shrink-0">
                        <div className="text-right">
                            <div className={`text-3xl font-bold tabular-nums leading-none ${scoreColor(sub.score)}`}>
                                {sub.score}
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">/ 100</div>
                        </div>
                        <div className="mt-1 text-slate-500">
                            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                    {sub.skills.map((skill) => (
                        <span key={skill} className="text-xs px-2 py-0.5 rounded-full bg-[#1e2d45] text-slate-300 border border-[#243454]">
                            {skill}
                        </span>
                    ))}
                </div>
            </button>

            {/* Expanded content */}
            {expanded && (
                <div className="border-t border-[#1e2d45] divide-y divide-[#1e2d45]">
                    {/* Problem & approach */}
                    <div className="px-6 py-5 grid sm:grid-cols-2 gap-5">
                        <div>
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">
                                Problem Statement
                            </p>
                            <p className="text-sm text-slate-300 leading-relaxed">{sub.problemStatement}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">
                                Design Decisions
                            </p>
                            <p className="text-sm text-slate-300 leading-relaxed">{sub.designDecisions}</p>
                        </div>
                    </div>

                    {/* In their own words */}
                    <div className="px-6 py-5">
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-3">
                            In Their Own Words
                        </p>
                        <blockquote className="border-l-2 border-blue-500/50 pl-4 text-sm text-slate-300 italic leading-relaxed">
                            &ldquo;{sub.explanation}&rdquo;
                        </blockquote>
                    </div>

                    {/* Process timeline */}
                    <div className="px-6 py-5">
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-4">
                            Work Process
                        </p>
                        <div className="space-y-0">
                            {sub.processSteps.map((step, i) => {
                                const isLast = i === sub.processSteps.length - 1;
                                return (
                                    <div key={step.id} className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className="w-7 h-7 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 text-xs font-bold shrink-0">
                                                {i + 1}
                                            </div>
                                            {!isLast && (
                                                <div className="w-px flex-1 bg-[#1e2d45] my-1" />
                                            )}
                                        </div>
                                        <div className={`flex-1 ${isLast ? "pb-0" : "pb-4"}`}>
                                            <div className="flex items-baseline gap-2 flex-wrap">
                                                <p className="text-sm font-medium text-white">{step.title}</p>
                                                <p className="text-xs text-slate-600">
                                                    {formatDate(step.timestamp)} at {formatTime(step.timestamp)}
                                                </p>
                                            </div>
                                            <p className="text-sm text-slate-400 mt-0.5 leading-relaxed">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Self-critique */}
                    <div className="px-5 sm:px-6 py-5">
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">
                            What I&apos;d Improve
                        </p>
                        <p className="text-sm text-slate-300 leading-relaxed">{sub.improvements}</p>
                    </div>

                    {/* AI disclosure inline */}
                    {sub.aiDescription && (
                        <div className="px-5 sm:px-6 py-4 bg-violet-500/5 border-t border-violet-500/10">
                            <div className="flex items-start gap-2.5">
                                <Sparkles className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs font-medium text-violet-300 mb-0.5">AI Usage Disclosure</p>
                                    <p className="text-xs text-slate-400 leading-relaxed">{sub.aiDescription}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Links */}
                    <div className="px-5 sm:px-6 py-4 flex items-center gap-5 flex-wrap">
                        {sub.liveLink && (
                            <a href={sub.liveLink} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium">
                                <ArrowUpRight className="w-3.5 h-3.5" /> Live Preview
                            </a>
                        )}
                        {sub.repoLink && (
                            <a href={sub.repoLink} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
                                <GitBranch className="w-3.5 h-3.5" /> Repository
                            </a>
                        )}
                        <span className="text-xs text-slate-600 ml-auto">
                            Submitted {formatDate(sub.submittedAt)}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Process Timeline ──────────────────────────────────────────────────────────
function ProcessTimeline({ submissions: subs }: { submissions: Submission[] }) {
    const allSteps = subs
        .flatMap((sub) =>
            sub.processSteps.map((step) => ({
                ...step,
                projectTitle: sub.projectTitle || sub.challengeTitle,
            }))
        )
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    const byDate: Record<string, typeof allSteps> = {};
    for (const step of allSteps) {
        const d = formatDate(step.timestamp);
        if (!byDate[d]) byDate[d] = [];
        byDate[d].push(step);
    }

    return (
        <div className="space-y-6">
            {Object.entries(byDate).map(([date, steps]) => (
                <div key={date}>
                    <div className="flex items-center gap-3 mb-4">
                        <CalendarDays className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{date}</span>
                        <div className="flex-1 h-px bg-[#1e2d45]" />
                    </div>
                    <div className="space-y-0 ml-5">
                        {steps.map((step, i) => {
                            const isLast = i === steps.length - 1;
                            return (
                                <div key={step.id} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <CircleDot className="w-4 h-4 text-blue-500/60 shrink-0" />
                                        {!isLast && <div className="w-px flex-1 bg-[#1e2d45] my-1 min-h-4" />}
                                    </div>
                                    <div className={`flex-1 ${isLast ? "pb-2" : "pb-4"}`}>
                                        <div className="flex items-baseline gap-2 flex-wrap">
                                            <p className="text-sm font-medium text-white">{step.title}</p>
                                            <span className="text-[10px] text-slate-600">{formatTime(step.timestamp)}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-0.5 mb-1.5 leading-relaxed">{step.description}</p>
                                        <span className="inline-block text-[10px] px-1.5 py-0.5 rounded bg-[#1e2d45] text-slate-600 border border-[#243454]">
                                            {step.projectTitle}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function PublicProfilePage({
    params,
}: {
    params: Promise<{ username: string }>;
}) {
    const { username } = use(params);
    const entry = profileRegistry[username];
    if (!entry) notFound();

    const { user, submissions: userSubmissions, skillEvidence } = entry;

    const [copied, setCopied] = useState(false);
    const [showTimeline, setShowTimeline] = useState(false);

    function handleCopy() {
        const url = typeof window !== "undefined"
            ? window.location.href
            : `https://workproof.dev/profile/${username}`;
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }

    const avgScore =
        userSubmissions.length > 0
            ? Math.round(userSubmissions.reduce((s, sub) => s + sub.score, 0) / userSubmissions.length)
            : 0;

    const totalSteps = userSubmissions.reduce((n, s) => n + s.processSteps.length, 0);
    const firstName = user.name.split(" ")[0];
    const aiTransparencyPct = user.proofScore.aiTransparency;

    return (
        <div className="min-h-screen bg-[#080e1a] text-white">
            {/* Top bar */}
            <header className="sticky top-0 z-50 border-b border-[#1a2540] bg-[#080e1a]/90 backdrop-blur-sm">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                            <Shield className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="font-bold text-white text-sm tracking-tight">WorkProof</span>
                        <span className="hidden sm:inline text-xs text-slate-500 ml-1 border-l border-[#1e2d45] pl-3">
                            Candidate Proof Profile
                        </span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1e2d45] bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium transition-colors"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                    <span className="text-emerald-400">Copied!</span>
                                </>
                            ) : (
                                <>
                                    <Copy className="w-3.5 h-3.5" /> Copy Link
                                </>
                            )}
                        </button>
                        <button
                            onClick={() => { }}
                            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors"
                            title="PDF download coming soon"
                        >
                            <Download className="w-3.5 h-3.5" /> PDF Summary
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
                {/* ── Hero ── */}
                <div className="rounded-2xl border border-[#1e2d45] bg-gradient-to-br from-[#0d1424] to-[#080e1a] p-7">
                    <div className="flex flex-col sm:flex-row items-start gap-6">
                        {/* Avatar */}
                        <div className="relative shrink-0">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-900/30">
                                {user.avatarInitials}
                            </div>
                            {/* Verified badge on avatar */}
                            <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-[#0d1424] border-2 border-[#0d1424] flex items-center justify-center">
                                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                                    <Check className="w-3 h-3 text-white" />
                                </div>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 flex-wrap">
                                <div>
                                    <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                                    <p className="text-blue-400 font-medium mt-0.5">{user.targetRole}</p>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2">
                                        <span className="flex items-center gap-1.5 text-sm text-slate-400">
                                            <MapPin className="w-3.5 h-3.5" /> {user.location}
                                        </span>
                                        {user.openToRemote && (
                                            <span className="flex items-center gap-1.5 text-sm text-emerald-400">
                                                <Wifi className="w-3.5 h-3.5" /> Open to remote
                                            </span>
                                        )}
                                        {user.availability && (
                                            <span className="flex items-center gap-1.5 text-sm text-emerald-400">
                                                <Clock className="w-3.5 h-3.5" /> {user.availability}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* WorkProof Evidence Badge */}
                                <div className="flex flex-col items-end gap-2">
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-blue-500/30 bg-blue-500/8 text-xs">
                                        <Shield className="w-3.5 h-3.5 text-blue-400" />
                                        <span className="text-blue-300 font-medium">Evidence recorded by WorkProof</span>
                                    </div>
                                    <p className="text-[10px] text-slate-600 text-right max-w-48 leading-relaxed">
                                        Submissions verified through structured challenges. Scores reflect task performance.
                                    </p>
                                </div>
                            </div>

                            <p className="text-slate-300 text-sm leading-relaxed mt-4 max-w-2xl">
                                {user.bio}
                            </p>

                            {/* External links */}
                            <div className="flex flex-wrap items-center gap-4 mt-4">
                                {user.portfolioLink && (
                                    <a
                                        href={user.portfolioLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-blue-400 transition-colors"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" /> Portfolio
                                    </a>
                                )}
                                {user.githubLink && (
                                    <a
                                        href={user.githubLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-blue-400 transition-colors"
                                    >
                                        <GitBranch className="w-3.5 h-3.5" /> GitHub
                                    </a>
                                )}
                                {user.linkedinLink && (
                                    <a
                                        href={user.linkedinLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-blue-400 transition-colors"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" /> LinkedIn
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Stat row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-[#1e2d45]">
                        {[
                            { label: "Proof Score", value: String(user.proofScore.total), suffix: `/ ${user.proofScore.maxTotal}`, color: "text-blue-400", icon: Award },
                            { label: "Challenges Done", value: String(user.completedChallenges), suffix: "", color: "text-emerald-400", icon: CheckCircle2 },
                            { label: "Avg. Score", value: String(avgScore), suffix: "/ 100", color: "text-white", icon: Star },
                            { label: "Steps Logged", value: String(totalSteps), suffix: "", color: "text-violet-400", icon: Layers },
                        ].map(({ label, value, suffix, color, icon: Icon }) => (
                            <div key={label} className="text-center p-3 rounded-xl bg-[#111827] border border-[#1e2d45]">
                                <Icon className={`w-4 h-4 mx-auto mb-1.5 ${color}`} />
                                <div className={`text-xl font-bold tabular-nums ${color}`}>
                                    {value}
                                    {suffix && <span className="text-sm text-slate-500 font-normal ml-1">{suffix}</span>}
                                </div>
                                <div className="text-xs text-slate-500 mt-0.5">{label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Verified by WorkProof ── */}
                <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-600/8 via-[#0d1424] to-violet-600/8 p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="flex items-center gap-3 shrink-0">
                            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                                <Shield className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-white">Profile Evidence Recorded by WorkProof</p>
                                <p className="text-xs text-slate-500">Challenges completed since {formatDate(user.joinedAt)}</p>
                            </div>
                        </div>
                        <div className="flex-1 sm:border-l sm:border-[#1e2d45] sm:pl-6">
                            <p className="text-sm text-slate-400 leading-relaxed">
                                WorkProof records structured, timed challenge submissions and logs the candidate&apos;s reasoning, process steps, and AI usage.
                                Scores reflect task performance only.{" "}
                                <span className="text-slate-500">WorkProof does not certify employment qualifications and is not a substitute for interviews.</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── Main + Sidebar ── */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main — Featured Proof Projects */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Proof of Work */}
                        <section>
                            <div className="flex items-center gap-2 mb-5">
                                <FileText className="w-4 h-4 text-blue-400" />
                                <h2 className="text-base font-semibold text-white">Proof of Work</h2>
                                <span className="text-xs text-slate-500 ml-1">
                                    {userSubmissions.length} completed challenge{userSubmissions.length !== 1 ? "s" : ""}
                                </span>
                            </div>
                            <div className="space-y-4">
                                {userSubmissions.map((sub, i) => (
                                    <ChallengeResultCard
                                        key={sub.id}
                                        sub={sub}
                                        pinned={i === 0}
                                        defaultExpanded={i === 0}
                                    />
                                ))}
                            </div>
                        </section>

                        {/* AI Disclosure Summary */}
                        <section>
                            <div className="flex items-center gap-2 mb-5">
                                <Sparkles className="w-4 h-4 text-violet-400" />
                                <h2 className="text-base font-semibold text-white">AI Transparency</h2>
                            </div>
                            <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6">
                                <div className="flex items-start gap-4 mb-5 flex-wrap">
                                    <div>
                                        <div className="text-4xl font-bold text-white">
                                            {aiTransparencyPct}
                                            <span className="text-xl text-slate-500">/100</span>
                                        </div>
                                        <p className="text-xs text-slate-400 mt-1">AI Transparency Score</p>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-slate-300 leading-relaxed">
                                            Every submission includes an honest disclosure of how AI tools were used.
                                            {firstName} distinguishes clearly between AI-assisted thinking and personally written work.
                                            {aiTransparencyPct >= 85 && " This score is in the top 12% of WorkProof candidates."}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                                            WorkProof does not penalise AI use. It rewards honest disclosure.
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {userSubmissions.map((sub) => (
                                        <div
                                            key={sub.id}
                                            className="flex items-start gap-3 p-3 rounded-xl bg-[#0d1424] border border-[#1e2d45]"
                                        >
                                            <DisclosureBadge level={sub.aiDisclosure} size="sm" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-medium text-white truncate">
                                                    {sub.projectTitle || sub.challengeTitle}
                                                </p>
                                                {sub.aiDescription ? (
                                                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{sub.aiDescription}</p>
                                                ) : (
                                                    <p className="text-xs text-slate-600 mt-0.5 italic">No AI used on this challenge.</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Work Timeline */}
                        <section>
                            <div className="flex items-center justify-between gap-2 mb-5">
                                <div className="flex items-center gap-2">
                                    <CalendarDays className="w-4 h-4 text-slate-400" />
                                    <h2 className="text-base font-semibold text-white">Work Timeline</h2>
                                    <span className="text-xs text-slate-500 ml-1">{totalSteps} logged steps</span>
                                </div>
                                <button
                                    onClick={() => setShowTimeline((v) => !v)}
                                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium flex items-center gap-1"
                                >
                                    {showTimeline ? (
                                        <><ChevronUp className="w-3.5 h-3.5" /> Collapse</>
                                    ) : (
                                        <><ChevronDown className="w-3.5 h-3.5" /> Show all</>
                                    )}
                                </button>
                            </div>
                            <div className="rounded-2xl border border-[#1e2d45] bg-[#0d1424] p-5">
                                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                                    Every step {firstName} logged while completing challenges, in chronological order.
                                    This shows how they think and work — not just the finished result.
                                </p>
                                {showTimeline ? (
                                    <ProcessTimeline submissions={userSubmissions} />
                                ) : (
                                    <button
                                        onClick={() => setShowTimeline(true)}
                                        className="w-full py-3 rounded-xl border border-dashed border-[#1e2d45] text-sm text-slate-500 hover:text-slate-300 hover:border-[#2a3a5c] transition-colors"
                                    >
                                        Show {totalSteps} work process steps &rarr;
                                    </button>
                                )}
                            </div>
                        </section>

                        {/* For employers note */}
                        <div className="flex items-start gap-3 p-4 rounded-xl border border-[#1e2d45] bg-[#0d1424]">
                            <Info className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                            <p className="text-xs text-slate-500 leading-relaxed">
                                <span className="text-slate-400 font-medium">For employers: </span>
                                WorkProof is a tool for gathering structured evidence before an interview — not a replacement for one.
                                Scores measure task performance in a controlled environment. A candidate&apos;s collaboration style, potential, and culture fit still require direct conversation.
                            </p>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Proof Score breakdown */}
                        <div className="rounded-2xl border border-[#1e2d45] bg-[#0d1424] p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <Award className="w-4 h-4 text-blue-400" />
                                <h3 className="text-sm font-semibold text-white">Proof Score Breakdown</h3>
                            </div>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-4xl font-bold text-white">{user.proofScore.total}</span>
                                <span className="text-slate-500 text-lg">/ {user.proofScore.maxTotal}</span>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { label: "Work Quality", value: user.proofScore.workQuality, color: "bg-blue-500" },
                                    { label: "Process Clarity", value: user.proofScore.processClarity, color: "bg-violet-500" },
                                    { label: "Skill Coverage", value: user.proofScore.skillCoverage, color: "bg-emerald-500" },
                                    { label: "AI Transparency", value: user.proofScore.aiTransparency, color: "bg-violet-400" },
                                    { label: "Consistency", value: user.proofScore.consistency, color: "bg-amber-500" },
                                ].map(({ label, value, color }) => (
                                    <div key={label}>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-slate-400">{label}</span>
                                            <span className="text-white font-medium">{value}</span>
                                        </div>
                                        <div className="h-1.5 bg-[#1e2d45] rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Skill evidence cards */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <Star className="w-4 h-4 text-amber-400" />
                                <h3 className="text-sm font-semibold text-white">Skill Evidence</h3>
                            </div>
                            <div className="space-y-3">
                                {user.skills.map((skill) => (
                                    <SkillEvidenceCard
                                        key={skill.name}
                                        name={skill.name}
                                        score={skill.score}
                                        evidence={skillEvidence[skill.name] ?? []}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Share + Download */}
                        <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-600/10 to-violet-600/8 p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <Share2 className="w-4 h-4 text-blue-400" />
                                <h3 className="text-sm font-semibold text-white">Share this Profile</h3>
                            </div>
                            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                                Send this link to hiring managers or recruiters. They see evidence of real work — no resume fluff.
                            </p>
                            <div className="flex items-center gap-2 p-2 rounded-lg bg-[#0d1424] border border-[#1e2d45] mb-3">
                                <span className="text-xs text-slate-500 truncate flex-1">
                                    workproof.dev/profile/{username}
                                </span>
                                <button
                                    onClick={handleCopy}
                                    className="shrink-0 flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium"
                                >
                                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                    {copied ? "Copied" : "Copy"}
                                </button>
                            </div>
                            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-[#1e2d45] bg-white/5 hover:bg-white/8 text-slate-300 text-sm font-medium rounded-lg transition-colors">
                                <Download className="w-3.5 h-3.5" /> Download PDF Summary
                            </button>
                            <p className="text-[10px] text-slate-600 mt-2 text-center">
                                PDF download coming soon. Full profile always available at this link.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-[#1a2540] mt-16">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-blue-500/60" />
                        <span className="text-xs text-slate-600">
                            WorkProof · Evidence-based hiring profiles
                        </span>
                    </div>
                    <p className="text-xs text-slate-700 text-center">
                        Evidence scores reflect challenge task performance only and should be used alongside — not as a replacement for — interviews.
                    </p>
                </div>
            </footer>
        </div>
    );
}
