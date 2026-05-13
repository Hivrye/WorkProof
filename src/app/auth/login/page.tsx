"use client";

import { useState, useTransition, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Shield, Mail, Lock, AlertCircle } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const searchParams = useSearchParams();
    const next = searchParams.get("next") ?? "/dashboard";

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (!isSupabaseConfigured()) {
            // Dev shortcut: Supabase not wired up yet — go straight to the dashboard.
            router.push(next);
            return;
        }

        startTransition(async () => {
            const supabase = createClient();
            const { error } = await supabase.auth.signInWithPassword({ email, password });

            if (error) {
                setError(error.message);
                return;
            }

            router.push(next);
            router.refresh();
        });
    }

    return (
        <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="flex items-center gap-2 mb-8 justify-center">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-white text-xl tracking-tight">WorkProofolio</span>
                </div>

                <div className="rounded-2xl border border-[#1a2540] bg-[#0d1424] p-8">
                    <h1 className="text-2xl font-bold text-white mb-1">Sign in to WorkProofolio</h1>
                    <p className="text-slate-400 text-sm mb-8">
                        Don&apos;t have an account?{" "}
                        <Link href="/auth/signup" className="text-blue-400 hover:text-blue-300 font-medium">
                            Create one free
                        </Link>
                    </p>

                    {!isSupabaseConfigured() && (
                        <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 mb-6">
                            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <p className="text-sm text-amber-300">
                                Supabase is not configured — entering any credentials will skip directly to the demo.
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 mb-6">
                            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                            <p className="text-sm text-red-400">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                Email address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="email"
                                    required
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#0b0f1a] border border-[#1e2d45] rounded-lg pl-9 pr-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/60 transition-all text-sm"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="text-sm font-medium text-slate-300">
                                    Password
                                </label>
                                <Link
                                    href="/auth/forgot-password"
                                    className="text-xs text-slate-500 hover:text-blue-400 transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#0b0f1a] border border-[#1e2d45] rounded-lg pl-9 pr-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/60 transition-all text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold rounded-lg transition-colors text-sm mt-2"
                        >
                            {isPending ? "Signing in…" : "Sign in"}
                        </button>
                    </form>

                    <p className="text-center text-xs text-slate-600 mt-5">
                        New to WorkProofolio?{" "}
                        <Link href="/auth/signup" className="text-blue-400 hover:text-blue-300 font-medium">
                            Create a free account
                        </Link>
                    </p>
                </div>

                <p className="text-center text-xs text-slate-600 mt-6">
                    By signing in you agree to WorkProofolio&apos;s{" "}
                    <Link href="/trust" className="text-slate-500 hover:text-slate-400">
                        Trust & Ethics Policy
                    </Link>
                    .
                </p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense>
            <LoginForm />
        </Suspense>
    );
}
