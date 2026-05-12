"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { ChallengeCard } from "@/components/cards/ChallengeCard";
import { challenges } from "@/data/challenges";
import { tracks } from "@/data/tracks";
import {
    Search, SlidersHorizontal, X, ChevronDown, LayoutGrid, List,
    CheckCircle2, Circle, PlayCircle, Clock, Zap,
} from "lucide-react";
import { cn, getDifficultyColor } from "@/lib/utils";
import type { Difficulty, ChallengeStatus } from "@/types";

// ─── Constants ────────────────────────────────────────────────────────────────

const DIFFICULTIES: Difficulty[] = ["Beginner", "Intermediate", "Advanced"];

const TIME_BUCKETS = [
    { label: "< 2 hours", min: 0, max: 2 },
    { label: "2–4 hours", min: 2, max: 4 },
    { label: "4–6 hours", min: 4, max: 6 },
    { label: "6+ hours", min: 6, max: Infinity },
] as const;

const SORT_OPTIONS = [
    { id: "recommended", label: "Recommended" },
    { id: "newest", label: "Newest" },
    { id: "shortest", label: "Shortest first" },
    { id: "hardest", label: "Hardest first" },
    { id: "most-points", label: "Most proof pts" },
] as const;

type SortId = (typeof SORT_OPTIONS)[number]["id"];
type TimeBucketMax = (typeof TIME_BUCKETS)[number]["max"];

const DIFFICULTY_ORDER: Record<Difficulty, number> = {
    Beginner: 0,
    Intermediate: 1,
    Advanced: 2,
};

function recommendedScore(status: ChallengeStatus, proofValue: number): number {
    if (status === "in-progress") return 1000 + proofValue;
    if (status === "not-started") return proofValue;
    return -1;
}

function extractMinHours(t: string): number {
    const m = t.match(/(\d+)/);
    return m ? parseInt(m[1], 10) : 0;
}

const ALL_SKILLS = Array.from(
    new Set(challenges.flatMap((c) => c.skillsTested))
).sort();

// ─── Page (wrapped in Suspense for useSearchParams) ──────────────────────────

export default function ChallengesPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0b0f1a]" />}>
            <ChallengesContent />
        </Suspense>
    );
}

function ChallengesContent() {
    const searchParams = useSearchParams();

    const [query, setQuery] = useState("");
    const [selectedTrack, setSelectedTrack] = useState(searchParams.get("track") ?? "all");
    const [selectedDifficulties, setSelectedDifficulties] = useState<Set<Difficulty>>(new Set());
    const [selectedTimeBucket, setSelectedTimeBucket] = useState<TimeBucketMax | null>(null);
    const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set());
    const [selectedSort, setSelectedSort] = useState<SortId>("recommended");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [filterOpen, setFilterOpen] = useState(false);

    useEffect(() => {
        const t = searchParams.get("track");
        if (t) setSelectedTrack(t);
    }, [searchParams]);

    const activeFilterCount =
        (selectedTrack !== "all" ? 1 : 0) +
        selectedDifficulties.size +
        (selectedTimeBucket !== null ? 1 : 0) +
        selectedSkills.size;

    function clearAll() {
        setQuery("");
        setSelectedTrack("all");
        setSelectedDifficulties(new Set());
        setSelectedTimeBucket(null);
        setSelectedSkills(new Set());
    }

    function toggleDifficulty(d: Difficulty) {
        setSelectedDifficulties((prev) => {
            const n = new Set(prev);
            n.has(d) ? n.delete(d) : n.add(d);
            return n;
        });
    }

    function toggleSkill(s: string) {
        setSelectedSkills((prev) => {
            const n = new Set(prev);
            n.has(s) ? n.delete(s) : n.add(s);
            return n;
        });
    }

    const filtered = useMemo(() => {
        let result = challenges.filter((c) => {
            if (query) {
                const q = query.toLowerCase();
                if (
                    !c.title.toLowerCase().includes(q) &&
                    !c.description.toLowerCase().includes(q) &&
                    !c.track.toLowerCase().includes(q) &&
                    !c.skillsTested.some((s) => s.toLowerCase().includes(q)) &&
                    !c.tags.some((t) => t.toLowerCase().includes(q))
                ) return false;
            }
            if (selectedTrack !== "all" && c.trackId !== selectedTrack) return false;
            if (selectedDifficulties.size > 0 && !selectedDifficulties.has(c.difficulty)) return false;
            if (selectedTimeBucket !== null) {
                const h = extractMinHours(c.estimatedTime);
                const bucket = TIME_BUCKETS.find((b) => b.max === selectedTimeBucket)!;
                if (h < bucket.min || (bucket.max !== Infinity && h >= bucket.max)) return false;
                if (bucket.max === Infinity && h < bucket.min) return false;
            }
            if (selectedSkills.size > 0 && !c.skillsTested.some((s) => selectedSkills.has(s))) return false;
            return true;
        });

        return [...result].sort((a, b) => {
            switch (selectedSort) {
                case "recommended": return recommendedScore(b.status, b.proofValue) - recommendedScore(a.status, a.proofValue);
                case "newest": return b.id.localeCompare(a.id);
                case "shortest": return extractMinHours(a.estimatedTime) - extractMinHours(b.estimatedTime);
                case "hardest": return DIFFICULTY_ORDER[b.difficulty] - DIFFICULTY_ORDER[a.difficulty];
                case "most-points": return b.proofValue - a.proofValue;
                default: return 0;
            }
        });
    }, [query, selectedTrack, selectedDifficulties, selectedTimeBucket, selectedSkills, selectedSort]);

    const completedCount = challenges.filter((c) => c.status === "completed").length;
    const inProgressCount = challenges.filter((c) => c.status === "in-progress").length;
    const selectedTrackName = tracks.find((t) => t.id === selectedTrack)?.name;

    return (
        <AppShell title="Challenges">
            {/* Header */}
            <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">All Challenges</h2>
                    <p className="text-sm text-slate-400 mt-1">
                        {challenges.length} real-world challenges across {tracks.length} career tracks
                        {completedCount > 0 && <> &middot; <span className="text-emerald-400">{completedCount} completed</span></>}
                        {inProgressCount > 0 && <> &middot; <span className="text-blue-400">{inProgressCount} in progress</span></>}
                    </p>
                </div>
                {/* View toggle */}
                <div className="flex items-center gap-1 p-1 rounded-lg bg-[#111827] border border-[#1e2d45]">
                    <button onClick={() => setViewMode("grid")} title="Grid view"
                        className={cn("p-1.5 rounded-md transition-colors", viewMode === "grid" ? "bg-blue-600 text-white" : "text-slate-500 hover:text-white")}>
                        <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button onClick={() => setViewMode("list")} title="List view"
                        className={cn("p-1.5 rounded-md transition-colors", viewMode === "list" ? "bg-blue-600 text-white" : "text-slate-500 hover:text-white")}>
                        <List className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Search + sort bar */}
            <div className="flex items-center gap-3 mb-5 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search by title, skill, or tag..."
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

                <button
                    onClick={() => setFilterOpen((v) => !v)}
                    className={cn(
                        "flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all",
                        filterOpen || activeFilterCount > 0
                            ? "border-blue-500/50 bg-blue-500/10 text-blue-400"
                            : "border-[#1e2d45] bg-[#111827] text-slate-400 hover:text-white hover:border-white/20"
                    )}
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                    {activeFilterCount > 0 && (
                        <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                            {activeFilterCount}
                        </span>
                    )}
                </button>

                <div className="relative">
                    <select
                        value={selectedSort}
                        onChange={(e) => setSelectedSort(e.target.value as SortId)}
                        className="appearance-none bg-[#111827] border border-[#1e2d45] text-slate-300 text-sm rounded-xl px-3.5 py-2.5 pr-8 focus:outline-none focus:border-blue-500/50 transition-colors cursor-pointer"
                    >
                        {SORT_OPTIONS.map((o) => (
                            <option key={o.id} value={o.id}>{o.label}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                </div>

                {(activeFilterCount > 0 || query) && (
                    <button onClick={clearAll} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-white transition-colors">
                        <X className="w-3.5 h-3.5" /> Clear all
                    </button>
                )}
            </div>

            {/* Expandable filter panel */}
            {filterOpen && (
                <div className="mb-6 rounded-xl border border-[#1e2d45] bg-[#0f1623] p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Track */}
                    <FilterSection title="Track">
                        <FilterPill label="All Tracks" active={selectedTrack === "all"} onClick={() => setSelectedTrack("all")} />
                        {tracks.map((t) => (
                            <FilterPill key={t.id} label={t.name} active={selectedTrack === t.id} onClick={() => setSelectedTrack(t.id)} />
                        ))}
                    </FilterSection>

                    {/* Difficulty */}
                    <FilterSection title="Difficulty">
                        {DIFFICULTIES.map((d) => (
                            <FilterCheckbox
                                key={d} label={d}
                                checked={selectedDifficulties.has(d)}
                                dotColor={d === "Beginner" ? "bg-emerald-400" : d === "Intermediate" ? "bg-amber-400" : "bg-red-400"}
                                onChange={() => toggleDifficulty(d)}
                            />
                        ))}
                    </FilterSection>

                    {/* Time */}
                    <FilterSection title="Time Estimate">
                        {TIME_BUCKETS.map((b) => (
                            <FilterPill
                                key={b.label} label={b.label}
                                active={selectedTimeBucket === b.max}
                                onClick={() => setSelectedTimeBucket(selectedTimeBucket === b.max ? null : b.max)}
                            />
                        ))}
                    </FilterSection>

                    {/* Skills */}
                    <FilterSection title="Skills">
                        <div className="max-h-52 overflow-y-auto space-y-0.5 pr-1">
                            {ALL_SKILLS.map((s) => (
                                <FilterCheckbox key={s} label={s} checked={selectedSkills.has(s)} onChange={() => toggleSkill(s)} />
                            ))}
                        </div>
                    </FilterSection>
                </div>
            )}

            {/* Active filter chips */}
            {activeFilterCount > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                    {selectedTrack !== "all" && (
                        <ActiveChip label={selectedTrackName ?? selectedTrack} onRemove={() => setSelectedTrack("all")} />
                    )}
                    {Array.from(selectedDifficulties).map((d) => (
                        <ActiveChip key={d} label={d} onRemove={() => toggleDifficulty(d)} />
                    ))}
                    {selectedTimeBucket !== null && (
                        <ActiveChip
                            label={TIME_BUCKETS.find((b) => b.max === selectedTimeBucket)?.label ?? ""}
                            onRemove={() => setSelectedTimeBucket(null)}
                        />
                    )}
                    {Array.from(selectedSkills).map((s) => (
                        <ActiveChip key={s} label={s} onRemove={() => toggleSkill(s)} />
                    ))}
                </div>
            )}

            {/* Results */}
            {filtered.length === 0 ? (
                <div className="text-center py-16 rounded-xl border border-[#1e2d45] bg-[#111827]">
                    <Search className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                    <p className="text-white font-medium mb-1">No challenges found</p>
                    <p className="text-sm text-slate-400 mb-4">
                        {query ? `No results for "${query}" — try different keywords.` : "Try removing some filters."}
                    </p>
                    <button onClick={clearAll} className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                        Clear all filters
                    </button>
                </div>
            ) : (
                <>
                    <p className="text-xs text-slate-500 mb-4">
                        {filtered.length} challenge{filtered.length !== 1 ? "s" : ""}
                        {(activeFilterCount > 0 || query) ? " matching your filters" : ""}
                    </p>
                    {viewMode === "grid" ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filtered.map((c) => <ChallengeCard key={c.id} challenge={c} />)}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filtered.map((c) => <ChallengeListRow key={c.id} challenge={c} />)}
                        </div>
                    )}
                </>
            )}
        </AppShell>
    );
}

// ─── Filter sub-components ────────────────────────────────────────────────────

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">{title}</p>
            <div className="space-y-1">{children}</div>
        </div>
    );
}

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
        <button onClick={onClick} className={cn(
            "w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all",
            active
                ? "bg-blue-600/20 text-blue-300 border border-blue-500/40"
                : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
        )}>
            {label}
        </button>
    );
}

function FilterCheckbox({
    label, checked, dotColor, onChange,
}: {
    label: string; checked: boolean; dotColor?: string; onChange: () => void;
}) {
    return (
        <button onClick={onChange} className={cn(
            "w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs transition-all",
            checked ? "text-white" : "text-slate-400 hover:text-white hover:bg-white/5"
        )}>
            <div className={cn(
                "w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all",
                checked ? "bg-blue-600 border-blue-500" : "border-[#2a3a55]"
            )}>
                {checked && (
                    <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
                        <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )}
            </div>
            {dotColor && <span className={cn("w-2 h-2 rounded-full shrink-0", dotColor)} />}
            <span className="truncate">{label}</span>
        </button>
    );
}

function ActiveChip({ label, onRemove }: { label: string; onRemove: () => void }) {
    return (
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-medium">
            {label}
            <button onClick={onRemove} className="text-blue-400 hover:text-white transition-colors"><X className="w-3 h-3" /></button>
        </span>
    );
}

// ─── List-view row ────────────────────────────────────────────────────────────

function ChallengeListRow({ challenge }: { challenge: (typeof challenges)[number] }) {
    const ctaLabel =
        challenge.status === "completed" ? "View Proof" :
            challenge.status === "in-progress" ? "Continue" : "Start";

    const ctaClass =
        challenge.status === "completed" ? "bg-emerald-700/50 text-emerald-200 hover:bg-emerald-700" :
            challenge.status === "in-progress" ? "bg-amber-600 text-white hover:bg-amber-500" :
                "bg-blue-600 text-white hover:bg-blue-500";

    const StatusIcon =
        challenge.status === "completed" ? CheckCircle2 :
            challenge.status === "in-progress" ? PlayCircle : Circle;

    return (
        <div className={cn(
            "flex items-center gap-4 rounded-xl border bg-[#111827] p-4 hover:border-blue-500/30 transition-all group",
            challenge.status === "completed" ? "border-emerald-500/20" :
                challenge.status === "in-progress" ? "border-blue-500/30" : "border-[#1e2d45]"
        )}>
            {/* Status icon */}
            <StatusIcon className={cn(
                "w-4 h-4 shrink-0",
                challenge.status === "completed" ? "text-emerald-400" :
                    challenge.status === "in-progress" ? "text-blue-400" : "text-slate-600"
            )} />

            {/* Title + track */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white leading-snug group-hover:text-blue-300 transition-colors truncate">
                    {challenge.title}
                </p>
                <p className="text-xs text-slate-500 mt-0.5 truncate">{challenge.track}</p>
            </div>

            {/* Skills */}
            <div className="hidden md:flex items-center gap-1.5 shrink-0">
                {challenge.skillsTested.slice(0, 2).map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded-md text-xs bg-white/5 text-slate-400 border border-white/5">{s}</span>
                ))}
            </div>

            {/* Meta */}
            <div className="hidden lg:flex items-center gap-4 text-xs shrink-0">
                <span className="flex items-center gap-1 text-slate-500">
                    <Clock className="w-3 h-3" />{challenge.estimatedTime}
                </span>
                <span className="flex items-center gap-1 text-violet-400 font-medium">
                    <Zap className="w-3 h-3" />{challenge.proofValue} pts
                </span>
                <span className={cn("px-2 py-0.5 rounded-md border text-xs font-medium", getDifficultyColor(challenge.difficulty))}>
                    {challenge.difficulty}
                </span>
            </div>

            {/* CTA */}
            <a href={`/challenges/${challenge.id}`}
                className={cn("shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all", ctaClass)}>
                {ctaLabel}
            </a>
        </div>
    );
}
