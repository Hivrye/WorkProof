"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { SubmissionPreview } from "@/components/proof/SubmissionPreview";
import { SectionHeading } from "@/components/ui/shared";
import { challenges } from "@/data/challenges";
import { useSubmissions, calculateSubmissionScore } from "@/store/submissions-store";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { AIDisclosureLevel, ProcessStep, Submission } from "@/types";
import Link from "next/link";
import {
    PlusCircle, Trash2, CheckCircle2, Send, Star,
    Loader2, AlertCircle, X, ExternalLink, ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ───────────────────────────────────────────────────────────────────────────────

const aiOptions: { value: AIDisclosureLevel; label: string; desc: string }[] = [
    { value: "none", label: "I did not use AI", desc: "All work was done independently." },
    { value: "brainstorm", label: "AI for brainstorming only", desc: "Used AI to explore ideas. All implementation is mine." },
    { value: "suggestions", label: "AI for code or content suggestions", desc: "AI provided suggestions I reviewed, edited, and applied selectively." },
    { value: "heavy", label: "AI heavily assisted — I reviewed the output", desc: "AI was a significant contributor. I verified and edited the result." },
    { value: "explained", label: "Used AI but can explain every part of the work", desc: "AI helped, and I understand and can defend all final decisions." },
];

// ── URL helper ────────────────────────────────────────────────────────────────

function isValidUrl(value: string): boolean {
    if (!value.trim()) return true; // empty = optional = valid
    try {
        const url = new URL(value);
        return url.protocol === "https:" || url.protocol === "http:";
    } catch {
        return false;
    }
}

// ── Validation ────────────────────────────────────────────────────────────────

interface FormErrors {
    projectTitle?: string;
    problemStatement?: string;
    designDecisions?: string;
    aiDescription?: string;
    liveLink?: string;
    repoLink?: string;
    processSteps?: string;
}

function validate(fields: {
    projectTitle: string;
    problemStatement: string;
    designDecisions: string;
    aiDisclosure: AIDisclosureLevel;
    aiDescription: string;
    liveLink: string;
    repoLink: string;
    processSteps: ProcessStep[];
}): FormErrors {
    const errors: FormErrors = {};
    if (!fields.projectTitle.trim()) errors.projectTitle = "Project title is required.";
    if (fields.projectTitle.trim().length > 0 && fields.projectTitle.trim().length < 3)
        errors.projectTitle = "Project title must be at least 3 characters.";
    if (!fields.problemStatement.trim())
        errors.problemStatement = "Please describe the problem you were solving.";
    if (fields.problemStatement.trim().length > 0 && fields.problemStatement.trim().length < 30)
        errors.problemStatement = "Please write at least a sentence or two (30+ chars).";
    if (!fields.designDecisions.trim())
        errors.designDecisions = "Please describe the decisions you made.";
    if (fields.designDecisions.trim().length > 0 && fields.designDecisions.trim().length < 30)
        errors.designDecisions = "Please write at least a sentence or two (30+ chars).";
    if (fields.aiDisclosure !== "none" && !fields.aiDescription.trim())
        errors.aiDescription = "Please describe exactly how you used AI.";
    if (!isValidUrl(fields.liveLink)) errors.liveLink = "Must be a valid URL (https://…).";
    if (!isValidUrl(fields.repoLink)) errors.repoLink = "Must be a valid URL (https://…).";
    if (fields.processSteps.length === 0)
        errors.processSteps = "Add at least one process step to show your work.";
    return errors;
}

// ─── Inner form (uses useSearchParams — must be inside Suspense) ──────────────

function SubmitFormInner() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { saveSubmission } = useSubmissions();

    // Determine challenge from ?challenge= param or fall back to in-progress
    const paramId = searchParams.get("challenge");
    const targetChallenge =
        (paramId ? challenges.find((c) => c.id === paramId) : null) ??
        challenges.find((c) => c.status === "in-progress") ??
        challenges[0];

    // Form fields
    const [projectTitle, setProjectTitle] = useState("");
    const [liveLink, setLiveLink] = useState("");
    const [repoLink, setRepoLink] = useState("");
    const [explanation, setExplanation] = useState("");
    const [problemStatement, setProblemStatement] = useState("");
    const [designDecisions, setDesignDecisions] = useState("");
    const [improvements, setImprovements] = useState("");
    const [aiDisclosure, setAiDisclosure] = useState<AIDisclosureLevel>("none");
    const [aiDescription, setAiDescription] = useState("");
    const [processSteps, setProcessSteps] = useState<ProcessStep[]>([]);
    const [newStepTitle, setNewStepTitle] = useState("");
    const [newStepDesc, setNewStepDesc] = useState("");

    // UI states
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Set<string>>(new Set());
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [submittedScore, setSubmittedScore] = useState(0);
    const [profileUsername, setProfileUsername] = useState<string | null>(null);

    // Load username for success screen
    useEffect(() => {
        if (!isSupabaseConfigured()) return;
        const supabase = createClient();
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) return;
            supabase
                .from("profiles")
                .select("username")
                .eq("id", user.id)
                .single()
                .then(({ data }) => { if (data?.username) setProfileUsername(data.username); });
        });
    }, []);

    function mark(field: string) {
        setTouched((prev) => new Set([...prev, field]));
    }

    function addProcessStep() {
        if (!newStepTitle.trim()) return;
        const step: ProcessStep = {
            id: `step-${Date.now()}`,
            title: newStepTitle.trim(),
            description: newStepDesc.trim(),
            timestamp: new Date().toISOString(),
        };
        setProcessSteps((prev) => [...prev, step]);
        setNewStepTitle("");
        setNewStepDesc("");
        // Clear the process steps error once they add one
        setErrors((prev) => { const e = { ...prev }; delete e.processSteps; return e; });
    }

    function removeProcessStep(id: string) {
        setProcessSteps((prev) => prev.filter((s) => s.id !== id));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitError(null);

        // Validate all fields
        const validationErrors = validate({
            projectTitle,
            problemStatement,
            designDecisions,
            aiDisclosure,
            aiDescription,
            liveLink,
            repoLink,
            processSteps,
        });

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            // Mark all fields as touched so errors show
            setTouched(new Set(Object.keys(validationErrors)));
            // Scroll to first error
            const firstEl = document.querySelector("[data-field-error]");
            firstEl?.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }

        setErrors({});
        setSubmitting(true);

        const score = calculateSubmissionScore({
            processSteps,
            liveLink,
            repoLink,
            designDecisions,
            improvements,
            aiDisclosure,
        });

        const submission: Submission = {
            id: `sub-${Date.now()}`,
            challengeId: targetChallenge.id,
            challengeTitle: targetChallenge.title,
            track: targetChallenge.track,
            submittedAt: new Date().toISOString(),
            projectTitle: projectTitle.trim() || targetChallenge.title,
            liveLink: liveLink.trim() || undefined,
            repoLink: repoLink.trim() || undefined,
            explanation: explanation.trim(),
            problemStatement: problemStatement.trim(),
            designDecisions: designDecisions.trim(),
            improvements: improvements.trim(),
            aiDisclosure,
            aiDescription: aiDescription.trim() || undefined,
            processSteps,
            score,
            skills: targetChallenge.skillsTested,
        };

        const result = await saveSubmission(submission);

        if (result.error) {
            setSubmitError(`Submission failed: ${result.error}`);
            setSubmitting(false);
            return;
        }

        setSubmittedScore(score);
        setSubmitting(false);
        setSubmitted(true);
    }

    // ── Success screen ──────────────────────────────────────────────────────────

    if (submitted) {
        return (
            <AppShell title="Submit Work">
                <div className="max-w-lg mx-auto py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">Submission Saved to Your Profile</h2>
                    <p className="text-slate-400 mb-2">
                        <strong className="text-white">{projectTitle.trim() || targetChallenge.title}</strong> is now live on your Proof Profile.
                    </p>

                    {/* Score reveal */}
                    <div className="inline-flex items-center gap-3 bg-[#111827] border border-[#1e2d45] rounded-xl px-6 py-4 my-6">
                        <Star className="w-5 h-5 text-amber-400" />
                        <div className="text-left">
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Proof Score</p>
                            <p className="text-3xl font-bold text-white">
                                {submittedScore}
                                <span className="text-lg text-slate-500 font-normal"> / 100</span>
                            </p>
                        </div>
                    </div>

                    <p className="text-sm text-slate-500 mb-8">
                        Your work, process notes, and AI disclosure are now visible to employers on your public profile.
                    </p>
                    <div className="flex items-center justify-center gap-4 flex-wrap">
                        {profileUsername && (
                            <Link
                                href={`/profile/${profileUsername}`}
                                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors text-sm"
                            >
                                View Proof Profile
                                <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                        )}
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-2 px-5 py-2.5 border border-[#1e2d45] bg-white/5 hover:bg-white/10 text-slate-300 font-medium rounded-lg transition-colors text-sm"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            Back to Dashboard
                        </Link>
                        <button
                            onClick={() => {
                                setSubmitted(false);
                                setProjectTitle(""); setLiveLink(""); setRepoLink("");
                                setExplanation(""); setProblemStatement(""); setDesignDecisions("");
                                setImprovements(""); setAiDisclosure("none"); setAiDescription("");
                                setProcessSteps([]); setErrors({}); setTouched(new Set());
                            }}
                            className="px-5 py-2.5 border border-[#1e2d45] bg-white/5 hover:bg-white/10 text-slate-300 font-medium rounded-lg transition-colors text-sm"
                        >
                            Submit Another
                        </button>
                    </div>
                </div>
            </AppShell>
        );
    }

    // ── Form ───────────────────────────────────────────────────────────────────

    const previewData = { projectTitle, liveLink, repoLink, aiDisclosure, processSteps };

    return (
        <AppShell title="Submit Work">
            <SectionHeading
                title="Submit Your Work"
                subtitle="Document your process, share your deliverables, and add this challenge to your Proof Profile."
            />

            {/* Submit error banner */}
            {submitError && (
                <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 flex items-start gap-3">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-300 flex-1">{submitError}</p>
                    <button onClick={() => setSubmitError(null)} className="text-red-400 hover:text-red-300 shrink-0">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Form */}
                <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-8" noValidate>
                    {/* Challenge context */}
                    <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                        <p className="text-sm text-blue-300 font-medium mb-1">Submitting for:</p>
                        <p className="text-white font-semibold">{targetChallenge.title}</p>
                        <p className="text-slate-400 text-sm">{targetChallenge.track} · {targetChallenge.difficulty}</p>
                    </div>

                    {/* ── Project Details ── */}
                    <div className="rounded-xl border border-[#1e2d45] bg-[#111827] p-6 space-y-5">
                        <h3 className="text-base font-semibold text-white">Project Details</h3>

                        {/* Project title */}
                        <Field
                            label="Project Title"
                            required
                            error={touched.has("projectTitle") ? errors.projectTitle : undefined}
                            name="projectTitle"
                        >
                            <input
                                type="text"
                                value={projectTitle}
                                onChange={(e) => setProjectTitle(e.target.value)}
                                onBlur={() => mark("projectTitle")}
                                placeholder="e.g., SaaS Pricing Section — Clarity App"
                                maxLength={120}
                                className={inputCls(touched.has("projectTitle") && !!errors.projectTitle)}
                            />
                        </Field>

                        {/* Links */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <Field
                                label="Live Preview Link"
                                error={touched.has("liveLink") ? errors.liveLink : undefined}
                                name="liveLink"
                            >
                                <input
                                    type="text"
                                    value={liveLink}
                                    onChange={(e) => setLiveLink(e.target.value)}
                                    onBlur={() => mark("liveLink")}
                                    placeholder="https://..."
                                    className={inputCls(touched.has("liveLink") && !!errors.liveLink)}
                                />
                            </Field>
                            <Field
                                label="GitHub / Repo Link"
                                error={touched.has("repoLink") ? errors.repoLink : undefined}
                                name="repoLink"
                            >
                                <input
                                    type="text"
                                    value={repoLink}
                                    onChange={(e) => setRepoLink(e.target.value)}
                                    onBlur={() => mark("repoLink")}
                                    placeholder="https://github.com/..."
                                    className={inputCls(touched.has("repoLink") && !!errors.repoLink)}
                                />
                            </Field>
                        </div>
                    </div>

                    {/* ── Written Explanation ── */}
                    <div className="rounded-xl border border-[#1e2d45] bg-[#111827] p-6 space-y-5">
                        <h3 className="text-base font-semibold text-white">Written Explanation</h3>

                        <Field
                            label="What problem were you solving?"
                            required
                            error={touched.has("problemStatement") ? errors.problemStatement : undefined}
                            name="problemStatement"
                        >
                            <textarea
                                value={problemStatement}
                                onChange={(e) => setProblemStatement(e.target.value)}
                                onBlur={() => mark("problemStatement")}
                                rows={3}
                                placeholder="Describe the challenge scenario and what specific problem your work addressed..."
                                className={textareaCls(touched.has("problemStatement") && !!errors.problemStatement)}
                            />
                        </Field>

                        <Field
                            label="What decisions did you make and why?"
                            required
                            error={touched.has("designDecisions") ? errors.designDecisions : undefined}
                            name="designDecisions"
                        >
                            <textarea
                                value={designDecisions}
                                onChange={(e) => setDesignDecisions(e.target.value)}
                                onBlur={() => mark("designDecisions")}
                                rows={4}
                                placeholder="Describe the key choices you made — about structure, approach, design, tech — and the reasoning behind them..."
                                className={textareaCls(touched.has("designDecisions") && !!errors.designDecisions)}
                            />
                        </Field>

                        <Field label="What would you improve with more time?">
                            <textarea
                                value={improvements}
                                onChange={(e) => setImprovements(e.target.value)}
                                rows={3}
                                placeholder="Be honest about limitations and what you'd revisit if you had another day..."
                                className={textareaCls(false)}
                            />
                        </Field>

                        <Field label="Overall summary">
                            <textarea
                                value={explanation}
                                onChange={(e) => setExplanation(e.target.value)}
                                rows={3}
                                placeholder="Any additional context, approach notes, or things the evaluator should know..."
                                className={textareaCls(false)}
                            />
                        </Field>
                    </div>

                    {/* ── AI Disclosure ── */}
                    <div className="rounded-xl border border-[#1e2d45] bg-[#111827] p-6 space-y-4">
                        <div>
                            <h3 className="text-base font-semibold text-white">AI Usage Disclosure <span className="text-red-400 text-sm">*</span></h3>
                            <p className="text-sm text-slate-400 mt-1">
                                Honest AI disclosure is valued here. It demonstrates transparency and modern collaboration skills — not a weakness.
                            </p>
                        </div>

                        <div className="space-y-2">
                            {aiOptions.map(({ value, label, desc }) => (
                                <label
                                    key={value}
                                    className={cn(
                                        "flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all",
                                        aiDisclosure === value
                                            ? "bg-blue-500/10 border-blue-500/40"
                                            : "bg-[#0b0f1a] border-[#1e2d45] hover:border-blue-500/20"
                                    )}
                                >
                                    <input
                                        type="radio"
                                        name="aiDisclosure"
                                        value={value}
                                        checked={aiDisclosure === value}
                                        onChange={() => { setAiDisclosure(value); mark("aiDisclosure"); }}
                                        className="mt-0.5 accent-blue-500"
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-white">{label}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                                    </div>
                                </label>
                            ))}
                        </div>

                        {aiDisclosure !== "none" && (
                            <Field
                                label="Describe exactly how AI helped"
                                required
                                error={touched.has("aiDescription") ? errors.aiDescription : undefined}
                                name="aiDescription"
                            >
                                <textarea
                                    value={aiDescription}
                                    onChange={(e) => setAiDescription(e.target.value)}
                                    onBlur={() => mark("aiDescription")}
                                    rows={3}
                                    placeholder="Which tools did you use? What did they generate? What did you change, verify, or personally create?"
                                    className={textareaCls(touched.has("aiDescription") && !!errors.aiDescription)}
                                />
                            </Field>
                        )}
                    </div>

                    {/* ── Process Evidence ── */}
                    <div className="rounded-xl border border-[#1e2d45] bg-[#111827] p-6 space-y-4">
                        <div>
                            <div className="flex items-center justify-between">
                                <h3 className="text-base font-semibold text-white">
                                    Process Evidence <span className="text-red-400 text-sm">*</span>
                                </h3>
                                {processSteps.length > 0 && (
                                    <span className="text-xs text-emerald-400 font-medium bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">
                                        {processSteps.length} step{processSteps.length !== 1 ? "s" : ""} added
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-slate-400 mt-1">
                                Log the key steps you took. This shows employers how you think and work — not just what you produced.
                            </p>
                            {touched.has("processSteps") && errors.processSteps && (
                                <p className="text-xs text-red-400 mt-2 flex items-center gap-1" data-field-error>
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.processSteps}
                                </p>
                            )}
                        </div>

                        {/* Existing steps */}
                        {processSteps.length > 0 && (
                            <div className="space-y-2">
                                {processSteps.map((step, i) => (
                                    <div key={step.id} className="flex items-start gap-3 p-3 rounded-lg bg-[#0b0f1a] border border-[#1e2d45]">
                                        <div className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 text-xs shrink-0 mt-0.5 font-medium">
                                            {i + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white">{step.title}</p>
                                            {step.description && <p className="text-xs text-slate-500 mt-0.5">{step.description}</p>}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeProcessStep(step.id)}
                                            className="text-slate-600 hover:text-red-400 transition-colors shrink-0"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Add step */}
                        <div className="space-y-2 border-t border-[#1e2d45] pt-4">
                            <input
                                type="text"
                                value={newStepTitle}
                                onChange={(e) => setNewStepTitle(e.target.value)}
                                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addProcessStep(); } }}
                                placeholder="Step title (e.g., Initial audit, Built layout, Tested on mobile…)"
                                className={inputCls(false)}
                            />
                            <input
                                type="text"
                                value={newStepDesc}
                                onChange={(e) => setNewStepDesc(e.target.value)}
                                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addProcessStep(); } }}
                                placeholder="Short description (optional)"
                                className={inputCls(false)}
                            />
                            <button
                                type="button"
                                onClick={addProcessStep}
                                disabled={!newStepTitle.trim()}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-blue-400 hover:text-blue-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <PlusCircle className="w-4 h-4" />
                                Add Process Step
                            </button>
                        </div>
                    </div>

                    {/* ── Submit button ── */}
                    <button
                        type="submit"
                        disabled={submitting}
                        className={cn(
                            "w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-base transition-all",
                            submitting
                                ? "bg-blue-700/50 text-blue-300 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/30"
                        )}
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Saving to Proof Profile…
                            </>
                        ) : (
                            <>
                                <Send className="w-5 h-5" />
                                Submit to Proof Profile
                            </>
                        )}
                    </button>
                </form>

                {/* Sidebar preview */}
                <div className="space-y-4">
                    <div>
                        <h3 className="text-sm font-semibold text-slate-300 mb-3">Live Preview</h3>
                        <SubmissionPreview submission={previewData} challengeTitle={targetChallenge.title} />
                    </div>
                    <div className="rounded-xl border border-[#1e2d45] bg-[#111827] p-4">
                        <h3 className="text-sm font-semibold text-white mb-2">Tips for a High Score</h3>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li className="flex items-start gap-2"><span className="text-blue-400 shrink-0">›</span> Be specific in your design decisions</li>
                            <li className="flex items-start gap-2"><span className="text-blue-400 shrink-0">›</span> Add at least 3 process steps</li>
                            <li className="flex items-start gap-2"><span className="text-blue-400 shrink-0">›</span> Honest AI disclosure scores higher than "none" when AI was used</li>
                            <li className="flex items-start gap-2"><span className="text-blue-400 shrink-0">›</span> Mention your self-critique in improvements</li>
                            <li className="flex items-start gap-2"><span className="text-blue-400 shrink-0">›</span> Include a live link for maximum score</li>
                        </ul>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}

// ── Shared field wrapper ───────────────────────────────────────────────────────

function Field({
    label,
    required,
    error,
    name,
    children,
}: {
    label: string;
    required?: boolean;
    error?: string;
    name?: string;
    children: React.ReactNode;
}) {
    return (
        <div data-field-error={error ? "" : undefined}>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
                {label}{required && <span className="text-red-400 ml-1">*</span>}
            </label>
            {children}
            {error && (
                <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {error}
                </p>
            )}
        </div>
    );
}

// ── CSS helpers ───────────────────────────────────────────────────────────────

function inputCls(hasError: boolean) {
    return cn(
        "w-full bg-[#0b0f1a] border rounded-lg px-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none transition-all text-sm",
        hasError
            ? "border-red-500/50 focus:border-red-500/70 focus:ring-1 focus:ring-red-500/20"
            : "border-[#1e2d45] focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20"
    );
}

function textareaCls(hasError: boolean) {
    return cn(
        "w-full bg-[#0b0f1a] border rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none transition-all text-sm resize-none",
        hasError
            ? "border-red-500/50 focus:border-red-500/70 focus:ring-1 focus:ring-red-500/20"
            : "border-[#1e2d45] focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20"
    );
}

// ─── Public export (wrapped in Suspense for useSearchParams) ──────────────────

export default function SubmitForm() {
    return (
        <Suspense fallback={
            <AppShell title="Submit Work">
                <div className="flex items-center justify-center py-24">
                    <Loader2 className="w-6 h-6 animate-spin text-slate-500" />
                </div>
            </AppShell>
        }>
            <SubmitFormInner />
        </Suspense>
    );
}
