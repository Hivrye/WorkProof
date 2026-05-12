import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
    label: string;
    value: string | number;
    icon?: LucideIcon;
    trend?: { value: number; label: string };
    accent?: "blue" | "violet" | "emerald" | "amber";
    suffix?: string;
    className?: string;
}

export function StatCard({ label, value, icon: Icon, trend, accent = "blue", suffix, className }: StatCardProps) {
    const accentMap = {
        blue: "text-blue-400 bg-blue-500/10",
        violet: "text-violet-400 bg-violet-500/10",
        emerald: "text-emerald-400 bg-emerald-500/10",
        amber: "text-amber-400 bg-amber-500/10",
    };

    const trendColor = trend
        ? trend.value > 0
            ? "text-emerald-400"
            : trend.value < 0
                ? "text-red-400"
                : "text-slate-400"
        : "";

    return (
        <div className={cn("rounded-xl border border-[#1e2d45] bg-[#111827] p-5 flex flex-col gap-3", className)}>
            <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400 font-medium">{label}</span>
                {Icon && (
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", accentMap[accent])}>
                        <Icon className="w-4 h-4" />
                    </div>
                )}
            </div>
            <div className="flex items-end gap-2 flex-wrap">
                <span className="text-2xl font-bold text-white tabular-nums">{value}</span>
                {suffix && <span className="text-xs text-slate-500 mb-0.5">{suffix}</span>}
                {trend && (
                    <span className={cn("text-sm font-medium mb-0.5", trendColor)}>
                        {trend.value > 0 ? "+" : ""}{trend.value}% {trend.label}
                    </span>
                )}
            </div>
        </div>
    );
}
