"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { SubmissionPreview } from "@/components/proof/SubmissionPreview";
import { SectionHeading } from "@/components/ui/shared";
import { challenges } from "@/data/challenges";
import { mockUser } from "@/data/user";
import { useSubmissions, calculateSubmissionScore } from "@/store/submissions-store";
import type { AIDisclosureLevel, ProcessStep, Submission } from "@/types";
import Link from "next/link";
import { PlusCircle, Trash2, CheckCircle2, Send, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const aiOptions: { value: AIDisclosureLevel; label: string; desc: string }[] = [
    { value: "none", label: "I did not use AI", desc: "All work was done independently." },
    { value: "brainstorm", label: "AI for brainstorming only", desc: "Used AI to explore ideas. All implementation is mine." },
    { value: "suggestions", label: "AI for code or content suggestions", desc: "AI provided suggestions I reviewed, edited, and applied selectively." },
    { value: "heavy", label: "AI heavily assisted — I reviewed the output", desc: "AI was a significant contributor. I verified and edited the result." },
    { value: "explained", label: "Used AI but can explain every part of the work", desc: "AI helped, and I understand and can defend all final decisions." },
];

export default function SubmitWorkPage() {
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
    const [submitted, setSubmitted] = useState(false);
    const [submittedScore, setSubmittedScore] = useState(0);
    const { addSubmission } = useSubmissions();

    // Use the current in-progress challenge as the submission target
    const targetChallenge =
        challenges.find((c) => c.status === "in-progress") ?? challenges[0];

    function addProcessStep() {
        if (!newStepTitle.trim()) return;
        const step: ProcessStep = {
            id: `step-${Date.now()}`,
            title: newStepTitle,
            description: newStepDesc,
            timestamp: new Date().toISOString(),
        };
        setProcessSteps((prev) => [...prev, step]);
        setNewStepTitle("");
        setNewStepDesc("");
    }

    function removeProcessStep(id: string) {
        setProcessSteps((prev) => prev.filter((s) => s.id !== id));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

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
            projectTitle: projectTitle || targetChallenge.title,
            liveLink: liveLink || undefined,
            repoLink: repoLink || undefined,
            explanation,
            problemStatement,
            designDecisions,
            improvements,
            aiDisclosure,
            aiDescription: aiDescription || undefined,
            processSteps,
            score,
            skills: targetChallenge.skillsTested,
        };

        addSubmission(submission);
        setSubmittedScore(score);
        setSubmitted(true);
    }

    const previewData = {
        projectTitle,
        liveLink,
        repoLink,
        aiDisclosure,
        processSteps,
    };

    if (submitted) {
        return (
            <AppShell title="Submit Work">
                <div className="max-w-lg mx-auto py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">Submission Added to Your Profile</h2>
                    <p className="text-slate-400 mb-2">
                        <strong className="text-white">{projectTitle || targetChallenge.title}</strong> is now live on your Proof Profile.
                    </p>

                    {/* Score reveal */}
                    <div className="inline-flex items-center gap-3 bg-[#111827] border border-[#1e2d45] rounded-xl px-6 py-4 my-6">
                        <Star className="w-5 h-5 text-amber-400" />
                        <div className="text-left">
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Proof Score</p>
                            <p className="text-3xl font-bold text-white">{submittedScore}<span className="text-lg text-slate-500 font-normal"> / 100</span></p>
                        </div>
                    </div>

                    <p className="text-sm text-slate-500 mb-8">
                        Your work, process notes, and AI disclosure are now visible to employers on your public profile.
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <Link
                            href={`/profile/${mockUser.username}`}
                            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors text-sm"
                        >
                            View Proof Profile
                        </Link>
                        <button
                            onClick={() => {
                                setSubmitted(false);
                                setProjectTitle("");
                                setLiveLink("");
                                setRepoLink("");
                                setExplanation("");
                                setProblemStatement("");
                                setDesignDecisions("");
                                setImprovements("");
                                setAiDisclosure("none");
                                setAiDescription("");
                                setProcessSteps([]);
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

    return (
        <AppShell title="Submit Work">
            <SectionHeading
                title="Submit Your Work"
                subtitle="Document your process, share your deliverables, and add this challenge to your Proof Profile."
            />

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Form */}
                <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-8">
                    {/* Challenge selector context */}
                    <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                        <p className="text-sm text-blue-300 font-medium mb-1">Submitting for:</p>
                        <p className="text-white font-semibold">{targetChallenge.title}</p>
                        <p className="text-slate-400 text-sm">{targetChallenge.track} · {targetChallenge.difficulty}</p>
                    </div>

                    {/* Basic info */}
                    <div className="rounded-xl border border-[#1e2d45] bg-[#111827] p-6 space-y-5">
                        <h3 className="text-base font-semibold text-white">Project Details</h3>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                Project Title <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={projectTitle}
                                onChange={(e) => setProjectTitle(e.target.value)}
                                placeholder="e.g., SaaS Pricing Section — Clarity App"
                                className="w-full bg-[#0b0f1a] border border-[#1e2d45] rounded-lg px-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/60 transition-all text-sm"
                            />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                    Live Preview Link
                                </label>
                                <input
                                    type="url"
                                    value={liveLink}
                                    onChange={(e) => setLiveLink(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full bg-[#0b0f1a] border border-[#1e2d45] rounded-lg px-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/60 transition-all text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                    GitHub / Repo Link
                                </label>
                                <input
                                    type="url"
                                    value={repoLink}
                                    onChange={(e) => setRepoLink(e.target.value)}
                                    placeholder="https://github.com/..."
                                    className="w-full bg-[#0b0f1a] border border-[#1e2d45] rounded-lg px-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/60 transition-all text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                File Upload <span className="text-slate-500">(optional)</span>
                            </label>
                            <label
                                htmlFor="file-upload"
                                className="block border-2 border-dashed border-[#1e2d45] rounded-lg p-6 text-center hover:border-blue-500/40 transition-colors cursor-pointer"
                            >
                                <input type="file" id="file-upload" className="sr-only" accept=".pdf,.zip,.png,.jpg,.jpeg" multiple />
                                <p className="text-sm text-slate-500">Drag and drop files, or click to browse</p>
                                <p className="text-xs text-slate-600 mt-1">PDF, ZIP, PNG, JPG up to 20MB</p>
                            </label>
                        </div>
                    </div>

                    {/* Written explanation */}
                    <div className="rounded-xl border border-[#1e2d45] bg-[#111827] p-6 space-y-5">
                        <h3 className="text-base font-semibold text-white">Written Explanation</h3>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                What problem were you solving? <span className="text-red-400">*</span>
                            </label>
                            <textarea
                                required
                                value={problemStatement}
                                onChange={(e) => setProblemStatement(e.target.value)}
                                rows={3}
                                placeholder="Describe the challenge scenario and what specific problem your work addressed..."
                                className="w-full bg-[#0b0f1a] border border-[#1e2d45] rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/60 transition-all text-sm resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                What decisions did you make and why? <span className="text-red-400">*</span>
                            </label>
                            <textarea
                                required
                                value={designDecisions}
                                onChange={(e) => setDesignDecisions(e.target.value)}
                                rows={4}
                                placeholder="Describe the key choices you made — about structure, approach, design, tech — and the reasoning behind them..."
                                className="w-full bg-[#0b0f1a] border border-[#1e2d45] rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/60 transition-all text-sm resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                What would you improve with more time?
                            </label>
                            <textarea
                                value={improvements}
                                onChange={(e) => setImprovements(e.target.value)}
                                rows={3}
                                placeholder="Be honest about limitations and what you'd revisit if you had another day..."
                                className="w-full bg-[#0b0f1a] border border-[#1e2d45] rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/60 transition-all text-sm resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                Overall explanation / summary
                            </label>
                            <textarea
                                value={explanation}
                                onChange={(e) => setExplanation(e.target.value)}
                                rows={3}
                                placeholder="Any additional context, approach notes, or things the evaluator should know..."
                                className="w-full bg-[#0b0f1a] border border-[#1e2d45] rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/60 transition-all text-sm resize-none"
                            />
                        </div>
                    </div>

                    {/* AI disclosure */}
                    <div className="rounded-xl border border-[#1e2d45] bg-[#111827] p-6 space-y-4">
                        <div>
                            <h3 className="text-base font-semibold text-white">AI Usage Disclosure</h3>
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
                                        onChange={() => setAiDisclosure(value)}
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
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                    Describe exactly how AI helped
                                </label>
                                <textarea
                                    value={aiDescription}
                                    onChange={(e) => setAiDescription(e.target.value)}
                                    rows={3}
                                    placeholder="Which tools did you use? What did they generate? What did you change, verify, or personally create?"
                                    className="w-full bg-[#0b0f1a] border border-[#1e2d45] rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/60 transition-all text-sm resize-none"
                                />
                            </div>
                        )}
                    </div>

                    {/* Process notes */}
                    <div className="rounded-xl border border-[#1e2d45] bg-[#111827] p-6 space-y-4">
                        <div>
                            <h3 className="text-base font-semibold text-white">Process Evidence</h3>
                            <p className="text-sm text-slate-400 mt-1">
                                Log the key steps you took. This shows employers how you think and work — not just what you produced.
                            </p>
                        </div>

                        {/* Existing steps */}
                        {processSteps.length > 0 && (
                            <div className="space-y-2">
                                {processSteps.map((step, i) => (
                                    <div key={step.id} className="flex items-start gap-3 p-3 rounded-lg bg-[#0b0f1a] border border-[#1e2d45]">
                                        <div className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 text-xs shrink-0 mt-0.5">
                                            {i + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white">{step.title}</p>
                                            {step.description && <p className="text-xs text-slate-500 mt-0.5">{step.description}</p>}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeProcessStep(step.id)}
                                            className="text-slate-600 hover:text-red-400 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Add step */}
                        <div className="space-y-2">
                            <input
                                type="text"
                                value={newStepTitle}
                                onChange={(e) => setNewStepTitle(e.target.value)}
                                placeholder="Step title (e.g., Initial audit, Built layout, Tested on mobile...)"
                                className="w-full bg-[#0b0f1a] border border-[#1e2d45] rounded-lg px-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/60 transition-all text-sm"
                            />
                            <input
                                type="text"
                                value={newStepDesc}
                                onChange={(e) => setNewStepDesc(e.target.value)}
                                placeholder="Short description (optional)"
                                className="w-full bg-[#0b0f1a] border border-[#1e2d45] rounded-lg px-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/60 transition-all text-sm"
                            />
                            <button
                                type="button"
                                onClick={addProcessStep}
                                disabled={!newStepTitle.trim()}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-blue-400 hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <PlusCircle className="w-4 h-4" />
                                Add Process Step
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors text-base"
                    >
                        <Send className="w-5 h-5" />
                        Submit to Proof Profile
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
