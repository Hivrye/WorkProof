"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Lock, AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [done, setDone] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }
        if (password !== confirm) {
            setError("Passwords don't match.");
            return;
        }

        if (!isSupabaseConfigured()) {
            setDone(true);
            return;
        }

        startTransition(async () => {
            const supabase = createClient();
            const { error } = await supabase.auth.updateUser({ password });

            if (error) {
                setError(error.message);
                return;
            }

            setDone(true);
        });
    }

    if (done) {
        return (
            <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center px-4">
                <div className="w-full max-w-md text-center">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">Password updated</h2>
                    <p className="text-slate-400 mb-8">
                        Your new password is set. You can now access your dashboard.
                    </p>
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors text-sm"
                    >
                        Go to Dashboard
                    </button>
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
                    <h1 className="text-2xl font-bold text-white mb-1">Choose a new password</h1>
                    <p className="text-slate-400 text-sm mb-8">
                        Pick something strong. You can always change it again in{" "}
                        <Link href="/settings" className="text-blue-400 hover:text-blue-300 font-medium">
                            Settings
                        </Link>
                        .
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
                                New password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    minLength={8}
                                    autoComplete="new-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#0b0f1a] border border-[#1e2d45] rounded-lg pl-9 pr-10 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/60 transition-all text-sm"
                                    placeholder="8+ characters"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                Confirm new password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    minLength={8}
                                    autoComplete="new-password"
                                    value={confirm}
                                    onChange={(e) => setConfirm(e.target.value)}
                                    className="w-full bg-[#0b0f1a] border border-[#1e2d45] rounded-lg pl-9 pr-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/60 transition-all text-sm"
                                    placeholder="Repeat password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold rounded-lg transition-colors text-sm mt-2"
                        >
                            {isPending ? "Updating password…" : "Set new password"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
