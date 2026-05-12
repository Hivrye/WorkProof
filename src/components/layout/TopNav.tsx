"use client";

import { Bell, Search, Menu } from "lucide-react";
import Link from "next/link";
import { useAuth, useCurrentProfile } from "@/lib/supabase/hooks";
import { mockUser } from "@/data/user";

interface TopNavProps {
    title?: string;
    onMenuOpen?: () => void;
}

export function TopNav({ title, onMenuOpen }: TopNavProps) {
    const { user } = useAuth();
    const { profile } = useCurrentProfile();

    const displayName = profile?.name ?? (user?.user_metadata?.name as string | undefined) ?? mockUser.name;
    const displayUsername = profile?.username ?? mockUser.username;
    const initials = displayName
        .split(" ")
        .slice(0, 2)
        .map((w: string) => w[0])
        .join("")
        .toUpperCase();
    return (
        <header className="h-16 border-b border-[#1a2540] bg-[#0b0f1a]/80 backdrop-blur-sm flex items-center px-6 gap-4 sticky top-0 z-30">
            <button
                onClick={onMenuOpen}
                className="md:hidden text-slate-400 hover:text-white transition-colors shrink-0"
                aria-label="Open menu"
            >
                <Menu className="w-5 h-5" />
            </button>

            {title && (
                <h1 className="text-white font-semibold text-lg hidden md:block">{title}</h1>
            )}

            {/* Search */}
            <div className="flex-1 max-w-md ml-auto md:ml-0">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search challenges, tracks..."
                        className="w-full bg-white/5 border border-[#1a2540] rounded-lg pl-9 pr-4 py-2 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 ml-auto md:ml-0">
                {/* Notifications */}
                <button className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors text-slate-400 hover:text-white">
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full" />
                </button>

                {/* Avatar */}
                <Link href={`/profile/${displayUsername}`}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:opacity-90 transition-opacity">
                        {initials}
                    </div>
                </Link>
            </div>
        </header>
    );
}
