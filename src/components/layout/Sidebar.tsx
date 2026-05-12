"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Layers,
    Zap,
    Send,
    User,
    Eye,
    Settings,
    ChevronRight,
    Shield,
    CreditCard,
    GraduationCap,
    X,
    LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockUser } from "@/data/user";
import { useCurrentProfile } from "@/lib/supabase/hooks";

const mainNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/tracks", label: "Career Tracks", icon: Layers },
    { href: "/challenges", label: "Challenges", icon: Zap },
    { href: "/submit", label: "Submit Work", icon: Send },
    { href: "/profile", label: "My Proof Profile", icon: User },
];

const secondaryNavItems = [
    { href: "/employer-view", label: "Preview as Employer", icon: Eye },
    { href: "/bootcamp", label: "Bootcamp Dashboard", icon: GraduationCap },
    { href: "/pricing", label: "Pricing", icon: CreditCard },
    { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const pathname = usePathname();
    // Use real profile if authenticated; fall back to mockUser for demo mode.
    const { profile } = useCurrentProfile();
    const displayName = profile?.name ?? mockUser.name;
    const displayUsername = profile?.username ?? mockUser.username;
    const displayInitials = (profile?.name ?? mockUser.name)
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase();

    return (
        <>
            {/* Mobile backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={cn(
                "fixed left-0 top-0 h-full w-64 flex flex-col z-40 border-r border-[#1a2540] bg-[#0d1424]",
                "transform transition-transform duration-200 ease-in-out",
                isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            )}>
                {/* Logo */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-[#1a2540]">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600">
                            <Shield className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-white text-lg tracking-tight">WorkProof</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="md:hidden text-slate-400 hover:text-white transition-colors"
                        aria-label="Close menu"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                    {mainNavItems.map(({ href, label, icon: Icon }) => {
                        const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group",
                                    isActive
                                        ? "bg-blue-600/15 text-blue-400 border border-blue-500/20"
                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300")} />
                                <span className="flex-1">{label}</span>
                                {isActive && <ChevronRight className="w-3 h-3 text-blue-400/60" />}
                            </Link>
                        );
                    })}

                    <div className="pt-4 pb-2 px-3">
                        <p className="text-xs text-slate-600 font-medium uppercase tracking-wider">Share & Tools</p>
                    </div>

                    {secondaryNavItems.map(({ href, label, icon: Icon }) => {
                        const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group",
                                    isActive
                                        ? "bg-blue-600/15 text-blue-400 border border-blue-500/20"
                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300")} />
                                <span className="flex-1">{label}</span>
                                {isActive && <ChevronRight className="w-3 h-3 text-blue-400/60" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* User card */}
                <div className="p-4 border-t border-[#1a2540]">
                    <Link href={`/profile/${displayUsername}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group mb-1">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {displayInitials}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-white truncate">{displayName}</p>
                            <p className="text-xs text-slate-500 truncate">{profile?.target_role ?? mockUser.targetRole}</p>
                        </div>
                        <Shield className="w-3.5 h-3.5 text-blue-500/50 shrink-0" />
                    </Link>
                    {/* Sign out */}
                    <form action="/auth/signout" method="POST">
                        <button
                            type="submit"
                            className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-xs text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            Sign out
                        </button>
                    </form>
                </div>
            </aside>
        </>
    );
}
