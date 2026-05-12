import { Eye, GitBranch, ExternalLink } from "lucide-react";
import { DisclosureBadge } from "@/components/proof/DisclosureBadge";
import type { Submission } from "@/types";

interface SubmissionPreviewProps {
    submission: Partial<Submission>;
    challengeTitle?: string;
}

export function SubmissionPreview({ submission, challengeTitle }: SubmissionPreviewProps) {
    return (
        <div className="rounded-xl border border-[#1e2d45] bg-[#111827] p-5 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#1e2d45]">
                <Eye className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-300">Proof Preview</span>
            </div>

            {/* Title */}
            <div>
                <p className="text-xs text-slate-500 mb-1">Project</p>
                <p className="text-sm font-semibold text-white">
                    {submission.projectTitle || challengeTitle || "Untitled Project"}
                </p>
            </div>

            {/* Links */}
            {(submission.liveLink || submission.repoLink) && (
                <div className="space-y-2">
                    {submission.liveLink && (
                        <div className="flex items-center gap-2 text-sm text-blue-400">
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span className="truncate">{submission.liveLink}</span>
                        </div>
                    )}
                    {submission.repoLink && (
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                            <GitBranch className="w-3.5 h-3.5" />
                            <span className="truncate">{submission.repoLink}</span>
                        </div>
                    )}
                </div>
            )}

            {/* Process steps */}
            {submission.processSteps && submission.processSteps.length > 0 && (
                <div>
                    <p className="text-xs text-slate-500 mb-2">Process Notes</p>
                    <div className="space-y-1.5">
                        {submission.processSteps.slice(0, 3).map((step, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 text-xs shrink-0">
                                    {i + 1}
                                </div>
                                <span className="text-xs text-slate-400 truncate">{step.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* AI disclosure */}
            {submission.aiDisclosure && (
                <div>
                    <p className="text-xs text-slate-500 mb-2">AI Disclosure</p>
                    <DisclosureBadge level={submission.aiDisclosure} size="sm" />
                </div>
            )}

            {/* How it appears */}
            <div className="pt-3 border-t border-[#1e2d45]">
                <p className="text-xs text-slate-600 leading-relaxed">
                    This proof will appear on your public Proof Profile and is visible to employers.
                </p>
            </div>
        </div>
    );
}
