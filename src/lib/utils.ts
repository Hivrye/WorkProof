import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatScore(score: number): string {
    return score.toLocaleString();
}

export function getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
        case "Beginner":
            return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
        case "Intermediate":
            return "text-amber-400 bg-amber-400/10 border-amber-400/20";
        case "Advanced":
            return "text-red-400 bg-red-400/10 border-red-400/20";
        default:
            return "text-slate-400 bg-slate-400/10 border-slate-400/20";
    }
}

export function getStatusColor(status: string): string {
    switch (status) {
        case "completed":
            return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
        case "in-progress":
            return "text-blue-400 bg-blue-400/10 border-blue-400/20";
        case "not-started":
            return "text-slate-400 bg-slate-400/10 border-slate-400/20";
        default:
            return "text-slate-400 bg-slate-400/10 border-slate-400/20";
    }
}
