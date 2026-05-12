"use client";

import { useState, useMemo } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { TrackCard } from "@/components/cards/TrackCard";
import { tracks } from "@/data/tracks";
import { challenges } from "@/data/challenges";
import { mockUser } from "@/data/user";
import { SectionHeading } from "@/components/ui/shared";
import { Search, BadgeCheck, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

const WEEK_BUCKETS = [
    { label: "≤ 3 weeks", max: 3 },
    { label: "4–5 weeks", min: 4, max: 5 },
    { label: "6+ weeks", min: 6, max: Infinity },
] as const;

export default function TracksPage() {
    const [query, setQuery] = useState("");
    const [weekBucket, setWeekBucket] = useState<number | null>(null);

    // Build per-track challenge stats
    const trackStats = useMemo(() => {
        const map: Record<string, { completed: number; inProgress: number }> = {};
        for (const c of challenges) {
            if (!map[c.trackId]) map[c.trackId] = { completed: 0, inProgress: 0 };
            if (c.status === "completed") map[c.trackId].completed++;
            if (c.status === "in-progress") map[c.trackId].inProgress++;
        }
        return map;
    }, []);

    const filtered = useMemo(() => {
        return tracks.filter((t) => {
            if (query) {
                const q = query.toLowerCase();
                if (
                    !t.name.toLowerCase().includes(q) &&
                    !t.description.toLowerCase().includes(q) &&
                    !t.skillCategories.some((s) => s.toLowerCase().includes(q))
                ) return false;
            }
            if (weekBucket !== null) {
                const bucket = WEEK_BUCKETS.find((b) => b.max === weekBucket);
                if (bucket) {
                    const min = "min" in bucket ? bucket.min : 0;
                    if (t.estimatedWeeks < min) return false;
                    if (bucket.max !== Infinity && t.estimatedWeeks > bucket.max) return false;
                    if (bucket.max === Infinity && t.estimatedWeeks < min) return false;
                }
            }
            return true;
        });
    }, [query, weekBucket]);

    const currentTrack = tracks.find((t) => t.id === mockUser.trackId);
    const currentInFiltered = filtered.find((t) => t.id === mockUser.trackId);
    const otherTracks = filtered.filter((t) => t.id !== mockUser.trackId);

    const activeFilters = (weekBucket !== null ? 1 : 0);

    return (
        <AppShell title="Career Tracks">
            <div className="mb-8">
                <SectionHeading
                    title="Career Tracks"
                    subtitle="Each track is a curated path of real-world challenges, skills, and proof opportunities for a specific role."
                />

                {/* Search + filter row */}
                <div className="flex items-center gap-3 flex-wrap">
                    <div className="relative flex-1 min-w-[200px] max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search by role or skill..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full bg-[#111827] border border-[#1e2d45] rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
                        />
                        {query && (
                            <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    {/* Time filter */}
                    <div className="relative">
                        <select
                            value={weekBucket ?? ""}
                            onChange={(e) => setWeekBucket(e.target.value ? Number(e.target.value) : null)}
                            className={cn(
                                "appearance-none border text-sm rounded-xl px-3.5 py-2.5 pr-8 focus:outline-none transition-colors cursor-pointer",
                                weekBucket !== null
                                    ? "bg-blue-500/10 border-blue-500/40 text-blue-300"
                                    : "bg-[#111827] border-[#1e2d45] text-slate-400 hover:text-white"
                            )}
                        >
                            <option value="">All durations</option>
                            {WEEK_BUCKETS.map((b) => (
                                <option key={b.label} value={b.max === Infinity ? 6 : b.max}>{b.label}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                    </div>

                    {(query || activeFilters > 0) && (
                        <button
                            onClick={() => { setQuery(""); setWeekBucket(null); }}
                            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-white transition-colors"
                        >
                            <X className="w-3.5 h-3.5" /> Clear
                        </button>
                    )}
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className="text-center py-16 rounded-xl border border-[#1e2d45] bg-[#111827]">
                    <p className="text-white font-medium mb-1">No tracks match &ldquo;{query}&rdquo;</p>
                    <p className="text-sm text-slate-400">Try a different search — role name or skill area both work.</p>
                </div>
            ) : (
                <>
                    {/* Current track callout */}
                    {currentTrack && currentInFiltered && !query && (
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-3">
                                <BadgeCheck className="w-4 h-4 text-blue-400" />
                                <p className="text-sm font-medium text-white">Your current track</p>
                                {(trackStats[currentTrack.id]?.completed ?? 0) > 0 && (
                                    <span className="text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">
                                        {trackStats[currentTrack.id].completed} completed
                                    </span>
                                )}
                                {(trackStats[currentTrack.id]?.inProgress ?? 0) > 0 && (
                                    <span className="text-xs text-blue-400 bg-blue-400/10 border border-blue-400/20 px-2 py-0.5 rounded-full">
                                        {trackStats[currentTrack.id].inProgress} in progress
                                    </span>
                                )}
                            </div>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8">
                                <TrackCard track={currentTrack} isActive />
                            </div>
                            <p className="text-sm text-slate-500 mb-4">
                                {otherTracks.length} other track{otherTracks.length !== 1 ? "s" : ""}
                            </p>
                        </div>
                    )}

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {(query || !currentInFiltered ? filtered : otherTracks).map((track) => (
                            <TrackCard key={track.id} track={track} />
                        ))}
                    </div>
                </>
            )}
        </AppShell>
    );
}
