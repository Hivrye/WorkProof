import Link from "next/link";
import {
    Clock, Zap, ArrowRight, CheckCircle2, Circle, PlayCircle,
    Star, BookOpen,
} from "lucide-react";
import { cn, getDifficultyColor, getStatusColor } from "@/lib/utils";
import type { Challenge } from "@/types";

interface ChallengeCardProps {
    challenge: Challenge;
    /** Compact mode: smaller card for dashboard/sidebar grids */
    compact?: boolean;
}

const statusMeta = {
    "not-started": { label: "Not Started", Icon: Circle, ctaLabel: "Start Challenge" },
    "in-progress": { label: "In Progress", Icon: PlayCircle, ctaLabel: "Continue" },
    "completed": { label: "Completed", Icon: CheckCircle2, ctaLabel: "View Proof" },
} as const;

const ctaBg = {
    "not-started": "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20",
    "in-progress": "bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/20",
    "completed": "bg-emerald-700/60 hover:bg-emerald-700 text-emerald-200 shadow-emerald-900/20",
} as const;

export function ChallengeCard({ challenge, compact = false }: ChallengeCardProps) {
    const { label: statusLabel, Icon: StatusIcon, ctaLabel } = statusMeta[challenge.status];

    return (
        <div
            className={cn(
                "rounded-xl border bg-[#111827] flex flex-col transition-all duration-200 group",
                challenge.status === "completed"
                    ? "border-emerald-500/20 hover:border-emerald-500/40"
                    : challenge.status === "in-progress"
                        ? "border-blue-500/30 hover:border-blue-500/50"
                        : "border-[#1e2d45] hover:border-blue-500/30",
                compact ? "p-4 gap-3" : "p-5 gap-4"
            )}
        >
            {/* Top badges row */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Difficulty */}
                    <span
                        className={cn(
                            "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border",
                            getDifficultyColor(challenge.difficulty)
                        )}
                    >
                        {challenge.difficulty}
                    </span>
                    {/* Status — only show if not-started on compact (skip clutter) */}
                    {(!compact || challenge.status !== "not-started") && (
                        <span
                            className={cn(
                                "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border",
                                getStatusColor(challenge.status)
                            )}
                        >
                            <StatusIcon className="w-3 h-3" />
                            {statusLabel}
                        </span>
                    )}
                </div>
                {/* Score chip (completed only) */}
                {challenge.score !== undefined && (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-md">
                        <Star className="w-3 h-3" />
                        {challenge.score} / 100
                    </span>
                )}
            </div>

            {/* Title */}
            <h3
                className={cn(
                    "font-semibold text-white leading-snug group-hover:text-blue-300 transition-colors",
                    compact ? "text-sm" : "text-[15px]"
                )}
            >
                {challenge.title}
            </h3>

            {/* Description — full mode only */}
            {!compact && (
                <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">
                    {challenge.description}
                </p>
            )}

            {/* Meta row: time + track + proof pts */}
            <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {challenge.estimatedTime}
                </span>
                {!compact && (
                    <span className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {challenge.track}
                    </span>
                )}
                <span className="flex items-center gap-1 text-violet-400 font-medium">
                    <Zap className="w-3 h-3" />
                    {challenge.proofValue} pts
                </span>
            </div>

            {/* Skills — full mode, 3 max */}
            {!compact && (
                <div className="flex flex-wrap gap-1.5">
                    {challenge.skillsTested.slice(0, 3).map((skill) => (
                        <span
                            key={skill}
                            className="px-2 py-0.5 rounded-md text-xs bg-white/5 text-slate-400 border border-white/5"
                        >
                            {skill}
                        </span>
                    ))}
                    {challenge.skillsTested.length > 3 && (
                        <span className="px-2 py-0.5 rounded-md text-xs bg-white/5 text-slate-500">
                            +{challenge.skillsTested.length - 3} more
                        </span>
                    )}
                </div>
            )}

            {/* Spacer to push CTA to bottom */}
            <div className="flex-1" />

            {/* CTA button */}
            <Link
                href={`/challenges/${challenge.id}`}
                className={cn(
                    "flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-all duration-150 shadow-sm",
                    compact ? "px-3 py-1.5" : "px-4 py-2.5",
                    ctaBg[challenge.status]
                )}
            >
                {ctaLabel}
                <ArrowRight className="w-3.5 h-3.5" />
            </Link>
        </div>
    );
}
