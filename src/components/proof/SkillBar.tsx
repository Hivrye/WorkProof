import { cn } from "@/lib/utils";
import type { SkillScore } from "@/types";

interface SkillBarProps {
    skill: SkillScore;
    showLabel?: boolean;
    size?: "sm" | "md";
}

function getSkillColor(score: number) {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-blue-500";
    if (score >= 40) return "bg-amber-500";
    return "bg-red-500";
}

export function SkillBar({ skill, showLabel = true, size = "md" }: SkillBarProps) {
    const percentage = Math.round((skill.score / skill.maxScore) * 100);
    const color = getSkillColor(percentage);

    return (
        <div className="flex flex-col gap-1.5">
            {showLabel && (
                <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300 font-medium">{skill.name}</span>
                    <span className="text-slate-500 tabular-nums">{percentage}%</span>
                </div>
            )}
            <div
                className={cn(
                    "w-full bg-[#1e2d45] rounded-full overflow-hidden",
                    size === "sm" ? "h-1.5" : "h-2"
                )}
            >
                <div
                    className={cn("h-full rounded-full transition-all duration-700", color)}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}

interface SkillBarsProps {
    skills: SkillScore[];
    size?: "sm" | "md";
}

export function SkillBars({ skills, size = "md" }: SkillBarsProps) {
    return (
        <div className="space-y-4">
            {skills.map((skill) => (
                <SkillBar key={skill.name} skill={skill} size={size} />
            ))}
        </div>
    );
}
