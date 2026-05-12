import {
    CheckCircle2,
    MessageSquare,
    Award,
    User,
    Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ActivityItem } from "@/types";

const typeConfig = {
    submission: { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    feedback: { icon: MessageSquare, color: "text-blue-400", bg: "bg-blue-400/10" },
    badge: { icon: Award, color: "text-amber-400", bg: "bg-amber-400/10" },
    profile: { icon: User, color: "text-violet-400", bg: "bg-violet-400/10" },
    challenge: { icon: Zap, color: "text-cyan-400", bg: "bg-cyan-400/10" },
};

function formatRelativeTime(isoString: string): string {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
}

interface ActivityTimelineProps {
    items: ActivityItem[];
    limit?: number;
}

export function ActivityTimeline({ items, limit }: ActivityTimelineProps) {
    const displayItems = limit ? items.slice(0, limit) : items;

    return (
        <div className="space-y-0">
            {displayItems.map((item, index) => {
                const config = typeConfig[item.type];
                const Icon = config.icon;
                const isLast = index === displayItems.length - 1;

                return (
                    <div key={item.id} className="flex gap-4">
                        {/* Timeline line */}
                        <div className="flex flex-col items-center">
                            <div
                                className={cn(
                                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 z-10",
                                    config.bg,
                                    config.color
                                )}
                            >
                                <Icon className="w-4 h-4" />
                            </div>
                            {!isLast && <div className="w-px flex-1 bg-[#1e2d45] mt-1 mb-1" />}
                        </div>

                        {/* Content */}
                        <div className={cn("flex-1 pb-5", isLast ? "pb-0" : "")}>
                            <p className="text-sm font-medium text-white leading-snug">{item.title}</p>
                            <p className="text-sm text-slate-400 mt-0.5 leading-relaxed">{item.description}</p>
                            <p className="text-xs text-slate-600 mt-1">{formatRelativeTime(item.timestamp)}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
