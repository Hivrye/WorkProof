import { cn } from "@/lib/utils";
import type { AIDisclosureLevel } from "@/types";

const disclosureConfig: Record<AIDisclosureLevel, { label: string; description: string; color: string }> = {
    none: {
        label: "No AI Used",
        description: "This work was completed without AI assistance.",
        color: "text-slate-400 bg-slate-400/10 border-slate-400/20",
    },
    brainstorm: {
        label: "AI: Brainstorm Only",
        description: "AI was used for brainstorming ideas. All implementation is original.",
        color: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    },
    suggestions: {
        label: "AI: Code Suggestions",
        description: "AI provided code or content suggestions that were reviewed and modified.",
        color: "text-violet-400 bg-violet-400/10 border-violet-400/20",
    },
    heavy: {
        label: "AI: Heavily Assisted",
        description: "AI was used significantly. Output was reviewed, edited, and verified.",
        color: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    },
    explained: {
        label: "AI Used — Fully Explained",
        description: "AI was used and the candidate can explain every part of the final work.",
        color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    },
};

interface DisclosureBadgeProps {
    level: AIDisclosureLevel;
    showDescription?: boolean;
    size?: "sm" | "md";
}

export function DisclosureBadge({ level, showDescription = false, size = "md" }: DisclosureBadgeProps) {
    const config = disclosureConfig[level];

    return (
        <div className="flex flex-col gap-1">
            <span
                className={cn(
                    "inline-flex items-center rounded-md border font-medium",
                    config.color,
                    size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm"
                )}
            >
                {config.label}
            </span>
            {showDescription && (
                <p className="text-xs text-slate-500">{config.description}</p>
            )}
        </div>
    );
}
