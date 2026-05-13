"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Shield, Mail, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [sent, setSent] = useState(false);
    const [isPending, startTransition] = useTransition();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (!isSupabaseConfigured()) {
            setSent(true);
            return;
        }

        startTransition(async () => {
            const supabase = createClient();
            const origin = window.location.origin;
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${origin}/auth/callback?next=/auth/reset-password`,
            });

            if (error) {
                setError(error.message);
                return;
            }

            setSent(true);
        });
    }

    if (sent) {
        return (
            <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center px-4">
                <div className="w-full max-w-md text-center">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">Check your inbox</h2>
                    <p className="text-slate-400 mb-2">
                        If an account exists for{" "}
                        <span className="text-white font-medium">{email}</span>, we&apos;ve sent a
                        password reset link.
                    </p>
                    <p className="text-slate-500 text-sm mb-8">
                        The link expires in 1 hour. Check your spam folder if you don&apos;t see it.
                    </p>
                    <Link
                        href="/auth/login"
                        className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to sign in
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="flex items-center gap-2 mb-8 justify-center">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-white text-xl tracking-tight">Proofolio</span>
                </div>

                <div className="rounded-2xl border border-[#1a2540] bg-[#0d1424] p-8">
                    <h1 className="text-2xl font-bold text-white mb-1">Reset your password</h1>
                    <p className="text-slate-400 text-sm mb-8">
                        Enter the email on your account and we&apos;ll send a reset link.
                        Remember it?{" "}
                        <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 font-medium">
                            Sign in instead
                        </Link>
                    </p>

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
                                    autoFocus
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#0b0f1a] border border-[#1e2d45] rounded-lg pl-9 pr-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/60 transition-all text-sm"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold rounded-lg transition-colors text-sm mt-2"
                        >
                            {isPending ? "Sending reset link…" : "Send reset link"}
                        </button>
                    </form>
                </div>

                <p className="text-center mt-6">
                    <Link
                        href="/auth/login"
                        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-400 transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Back to sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
