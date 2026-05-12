import { Shield, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProofScore } from "@/types";

interface ProofScoreCardProps {
    score: ProofScore;
    className?: string;
}

const scoreBreakdown = [
    { key: "workQuality" as keyof ProofScore, label: "Work Quality", color: "bg-blue-500" },
    { key: "processClarity" as keyof ProofScore, label: "Process Clarity", color: "bg-violet-500" },
    { key: "skillCoverage" as keyof ProofScore, label: "Skill Coverage", color: "bg-cyan-500" },
    { key: "aiTransparency" as keyof ProofScore, label: "AI Transparency", color: "bg-emerald-500" },
    { key: "consistency" as keyof ProofScore, label: "Consistency", color: "bg-amber-500" },
];

export function ProofScoreCard({ score, className }: ProofScoreCardProps) {
    const percentage = Math.round((score.total / score.maxTotal) * 100);

    return (
        <div className={cn("rounded-xl border border-[#1e2d45] bg-[#111827] p-6", className)}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                        <Shield className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-white">Proof Score</h3>
                        <p className="text-xs text-slate-500">Updated after each submission</p>
                    </div>
                </div>
                <div className="flex items-center gap-1 text-emerald-400 text-sm">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">+34 this month</span>
                </div>
            </div>

            {/* Score display */}
            <div className="flex items-end gap-2 mb-6">
                <span className="text-5xl font-bold text-white tabular-nums">{score.total}</span>
                <span className="text-xl text-slate-600 mb-1">/ {score.maxTotal}</span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-[#1e2d45] rounded-full mb-6 overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-blue-600 to-violet-600 rounded-full transition-all duration-700"
                    style={{ width: `${percentage}%` }}
                />
            </div>

            {/* Breakdown */}
            <div className="space-y-3">
                {scoreBreakdown.map(({ key, label, color }) => {
                    const val = score[key] as number;
                    return (
                        <div key={key} className="flex items-center gap-3">
                            <span className="text-xs text-slate-400 w-32 shrink-0">{label}</span>
                            <div className="flex-1 h-1.5 bg-[#1e2d45] rounded-full overflow-hidden">
                                <div
                                    className={cn("h-full rounded-full transition-all duration-500", color)}
                                    style={{ width: `${val}%` }}
                                />
                            </div>
                            <span className="text-xs text-slate-400 w-8 text-right tabular-nums">{val}%</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
