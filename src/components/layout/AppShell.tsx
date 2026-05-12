"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";

interface AppShellProps {
    children: React.ReactNode;
    title?: string;
}

export function AppShell({ children, title }: AppShellProps) {
    const [mobileOpen, setMobileOpen] = useState(false);
    return (
        <div className="min-h-screen bg-[#0b0f1a] flex">
            <Sidebar isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
                <TopNav title={title} onMenuOpen={() => setMobileOpen(true)} />
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
