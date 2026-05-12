import Link from "next/link";
import { ArrowRight, Clock, BookOpen, BadgeCheck } from "lucide-react";
import {
    Code2, Palette, BarChart3, Headphones, Megaphone, Film,
    TrendingUp, ClipboardList, CalendarCheck, Box, ShieldCheck, Layers
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Track } from "@/types";

const iconMap: Record<string, React.ElementType> = {
    Code2, Palette, BarChart3, Headphones, Megaphone, Film,
    TrendingUp, ClipboardList, CalendarCheck, Box, ShieldCheck, Layers,
};

const colorMap: Record<string, string> = {
    blue: "from-blue-500/20 to-blue-600/5 border-blue-500/20 text-blue-400",
    violet: "from-violet-500/20 to-violet-600/5 border-violet-500/20 text-violet-400",
    cyan: "from-cyan-500/20 to-cyan-600/5 border-cyan-500/20 text-cyan-400",
    emerald: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/20 text-emerald-400",
    pink: "from-pink-500/20 to-pink-600/5 border-pink-500/20 text-pink-400",
    orange: "from-orange-500/20 to-orange-600/5 border-orange-500/20 text-orange-400",
    amber: "from-amber-500/20 to-amber-600/5 border-amber-500/20 text-amber-400",
    indigo: "from-indigo-500/20 to-indigo-600/5 border-indigo-500/20 text-indigo-400",
    teal: "from-teal-500/20 to-teal-600/5 border-teal-500/20 text-teal-400",
    purple: "from-purple-500/20 to-purple-600/5 border-purple-500/20 text-purple-400",
    red: "from-red-500/20 to-red-600/5 border-red-500/20 text-red-400",
    fuchsia: "from-fuchsia-500/20 to-fuchsia-600/5 border-fuchsia-500/20 text-fuchsia-400",
};

interface TrackCardProps {
    track: Track;
    isActive?: boolean;
}

export function TrackCard({ track, isActive = false }: TrackCardProps) {
    const Icon = iconMap[track.icon] ?? Code2;
    const colorClass = colorMap[track.color] ?? colorMap.blue;
    const [gradientPart, borderPart, textPart] = colorClass.split(" ");

    return (
        <div className={cn(
            "rounded-xl border bg-[#111827] p-6 flex flex-col gap-4 transition-all duration-200 group",
            isActive ? "border-blue-500/40 ring-1 ring-blue-500/20" : "border-[#1e2d45] hover:border-blue-500/30"
        )}>
            {/* Icon + active badge */}
            <div className="flex items-start justify-between">
                <div
                    className={cn(
                        "w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br border",
                        gradientPart,
                        borderPart,
                        textPart
                    )}
                >
                    <Icon className="w-5 h-5" />
                </div>
                {isActive && (
                    <span className="flex items-center gap-1 text-xs text-blue-400 bg-blue-400/10 border border-blue-400/20 px-2 py-0.5 rounded-full font-medium">
                        <BadgeCheck className="w-3 h-3" /> Active
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="flex-1">
                <h3 className="font-semibold text-white text-base mb-1 group-hover:text-blue-300 transition-colors">
                    {track.name}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">{track.description}</p>
            </div>

            {/* Meta */}
            <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    {track.challengeCount} challenges
                </span>
                <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    ~{track.estimatedWeeks}w
                </span>
            </div>

            {/* Skill tags */}
            <div className="flex flex-wrap gap-1.5">
                {track.skillCategories.slice(0, 3).map((skill) => (
                    <span key={skill} className="px-2 py-0.5 rounded-md text-xs bg-white/5 text-slate-400 border border-white/5">
                        {skill}
                    </span>
                ))}
                {track.skillCategories.length > 3 && (
                    <span className="px-2 py-0.5 rounded-md text-xs bg-white/5 text-slate-500">
                        +{track.skillCategories.length - 3}
                    </span>
                )}
            </div>

            {/* CTA */}
            <Link
                href={`/challenges?track=${track.id}`}
                className="flex items-center justify-between pt-4 border-t border-[#1e2d45] text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors group/link"
            >
                <span>View Challenges</span>
                <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
            </Link>
        </div>
    );
}
