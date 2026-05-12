"use client";

import { useState, useEffect } from "react";
import NextLink from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { mockUser } from "@/data/user";
import { useUserProfile } from "@/store/user-store";
import { Save, Globe, EyeOff, Shield, User, Link as LinkIcon, Bell, CheckCircle2 } from "lucide-react";

type Visibility = "public" | "private";
type AIPreference = "none" | "brainstorm" | "suggestions" | "heavy" | "explained";

const aiPreferenceOptions: { value: AIPreference; label: string; description: string }[] = [
    { value: "none", label: "No AI Used", description: "I prefer to solve challenges without any AI assistance" },
    { value: "brainstorm", label: "Brainstorming Only", description: "I use AI only for initial idea generation" },
    { value: "suggestions", label: "Suggestions & Review", description: "I use AI for suggestions and reviewing my work" },
    { value: "heavy", label: "Heavy AI Collaboration", description: "AI is a significant part of my workflow" },
    { value: "explained", label: "AI-Explained", description: "I use AI extensively and explain every usage" },
];

export default function SettingsPage() {
    const { profile, saveProfile } = useUserProfile();

    const [name, setName] = useState(mockUser.name);
    const [targetRole, setTargetRole] = useState(mockUser.targetRole);
    const [bio, setBio] = useState(mockUser.bio);
    const [portfolioLink, setPortfolioLink] = useState(mockUser.portfolioLink ?? "");
    const [githubLink, setGithubLink] = useState(mockUser.githubLink ?? "");
    const [linkedinLink, setLinkedinLink] = useState(mockUser.linkedinLink ?? "");
    const [skills, setSkills] = useState(mockUser.skills.map((s) => s.name).join(", "));
    const [visibility, setVisibility] = useState<Visibility>("public");
    const [aiPreference, setAIPreference] = useState<AIPreference>("suggestions");
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [saved, setSaved] = useState(false);

    // Sync form fields once the store has hydrated from localStorage.
    useEffect(() => {
        setName(profile.name);
        setTargetRole(profile.targetRole);
        setBio(profile.bio);
        setPortfolioLink(profile.portfolioLink);
        setGithubLink(profile.githubLink);
        setLinkedinLink(profile.linkedinLink);
        setSkills(profile.skills);
        setVisibility(profile.isPublic ? "public" : "private");
        setAIPreference((profile.aiTransparencyPreference as AIPreference) ?? "suggestions");
        setEmailNotifications(profile.emailNotifications);
    }, [profile]);

    const handleSave = () => {
        saveProfile({
            name,
            targetRole,
            bio,
            skills,
            portfolioLink,
            githubLink,
            linkedinLink,
            isPublic: visibility === "public",
            aiTransparencyPreference: aiPreference,
            emailNotifications,
            selectedTrackId: profile.selectedTrackId,
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <AppShell title="Settings">
            <div className="max-w-2xl space-y-8">
                {/* Saved feedback */}
                {saved && (
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <p className="text-sm text-emerald-300">Settings saved successfully.</p>
                    </div>
                )}

                {/* Profile Settings */}
                <section>
                    <div className="flex items-center gap-2 mb-5">
                        <User className="w-4 h-4 text-slate-400" />
                        <h2 className="text-base font-semibold text-white">Profile Information</h2>
                    </div>
                    <div className="rounded-xl border border-[#1e2d45] bg-[#111827] p-6 space-y-5">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1.5" htmlFor="name">
                                    Full Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full h-10 rounded-lg bg-[#0b0f1a] border border-[#1e2d45] px-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1.5" htmlFor="targetRole">
                                    Target Role
                                </label>
                                <input
                                    id="targetRole"
                                    type="text"
                                    value={targetRole}
                                    onChange={(e) => setTargetRole(e.target.value)}
                                    className="w-full h-10 rounded-lg bg-[#0b0f1a] border border-[#1e2d45] px-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                                    placeholder="e.g. Senior Frontend Developer"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-1.5" htmlFor="bio">
                                Bio
                            </label>
                            <textarea
                                id="bio"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                rows={4}
                                className="w-full rounded-lg bg-[#0b0f1a] border border-[#1e2d45] px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition resize-none"
                                placeholder="Tell employers about yourself..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-1.5" htmlFor="skills">
                                Skills{" "}
                                <span className="text-slate-600 text-xs font-normal">(comma-separated)</span>
                            </label>
                            <input
                                id="skills"
                                type="text"
                                value={skills}
                                onChange={(e) => setSkills(e.target.value)}
                                className="w-full h-10 rounded-lg bg-[#0b0f1a] border border-[#1e2d45] px-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                                placeholder="React, TypeScript, CSS, Accessibility..."
                            />
                        </div>
                    </div>
                </section>

                {/* Links */}
                <section>
                    <div className="flex items-center gap-2 mb-5">
                        <LinkIcon className="w-4 h-4 text-slate-400" />
                        <h2 className="text-base font-semibold text-white">Links</h2>
                    </div>
                    <div className="rounded-xl border border-[#1e2d45] bg-[#111827] p-6 space-y-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-1.5" htmlFor="portfolio">
                                Portfolio
                            </label>
                            <input
                                id="portfolio"
                                type="url"
                                value={portfolioLink}
                                onChange={(e) => setPortfolioLink(e.target.value)}
                                className="w-full h-10 rounded-lg bg-[#0b0f1a] border border-[#1e2d45] px-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                                placeholder="https://yourportfolio.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-1.5" htmlFor="github">
                                GitHub
                            </label>
                            <input
                                id="github"
                                type="url"
                                value={githubLink}
                                onChange={(e) => setGithubLink(e.target.value)}
                                className="w-full h-10 rounded-lg bg-[#0b0f1a] border border-[#1e2d45] px-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                                placeholder="https://github.com/username"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-1.5" htmlFor="linkedin">
                                LinkedIn
                            </label>
                            <input
                                id="linkedin"
                                type="url"
                                value={linkedinLink}
                                onChange={(e) => setLinkedinLink(e.target.value)}
                                className="w-full h-10 rounded-lg bg-[#0b0f1a] border border-[#1e2d45] px-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                                placeholder="https://linkedin.com/in/username"
                            />
                        </div>
                    </div>
                </section>

                {/* Visibility */}
                <section>
                    <div className="flex items-center gap-2 mb-5">
                        <Globe className="w-4 h-4 text-slate-400" />
                        <h2 className="text-base font-semibold text-white">Profile Visibility</h2>
                    </div>
                    <div className="rounded-xl border border-[#1e2d45] bg-[#111827] p-6 space-y-3">
                        <label className="flex items-start gap-3 cursor-pointer group">
                            <input
                                type="radio"
                                name="visibility"
                                value="public"
                                checked={visibility === "public"}
                                onChange={() => setVisibility("public")}
                                className="mt-0.5 accent-blue-500"
                            />
                            <div>
                                <div className="text-sm text-white font-medium flex items-center gap-1.5">
                                    <Globe className="w-3.5 h-3.5 text-emerald-400" /> Public
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5">Your profile and proof submissions are visible to employers and anyone with the link.</p>
                            </div>
                        </label>
                        <label className="flex items-start gap-3 cursor-pointer group">
                            <input
                                type="radio"
                                name="visibility"
                                value="private"
                                checked={visibility === "private"}
                                onChange={() => setVisibility("private")}
                                className="mt-0.5 accent-blue-500"
                            />
                            <div>
                                <div className="text-sm text-white font-medium flex items-center gap-1.5">
                                    <EyeOff className="w-3.5 h-3.5 text-slate-400" /> Private
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5">Only you can see your profile. Employer view links will be disabled.</p>
                            </div>
                        </label>
                    </div>
                </section>

                {/* AI Transparency */}
                <section>
                    <div className="flex items-center gap-2 mb-5">
                        <Shield className="w-4 h-4 text-violet-400" />
                        <h2 className="text-base font-semibold text-white">Default AI Transparency</h2>
                    </div>
                    <div className="rounded-xl border border-[#1e2d45] bg-[#111827] p-6 space-y-3">
                        <p className="text-sm text-slate-400 mb-4">
                            Set your default AI usage preference. This will be pre-selected when submitting challenges.
                        </p>
                        {aiPreferenceOptions.map((option) => (
                            <label key={option.value} className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="aiPreference"
                                    value={option.value}
                                    checked={aiPreference === option.value}
                                    onChange={() => setAIPreference(option.value)}
                                    className="mt-0.5 accent-violet-500"
                                />
                                <div>
                                    <div className="text-sm text-white">{option.label}</div>
                                    <p className="text-xs text-slate-500 mt-0.5">{option.description}</p>
                                </div>
                            </label>
                        ))}
                    </div>
                </section>

                {/* Notifications */}
                <section>
                    <div className="flex items-center gap-2 mb-5">
                        <Bell className="w-4 h-4 text-slate-400" />
                        <h2 className="text-base font-semibold text-white">Notifications</h2>
                    </div>
                    <div className="rounded-xl border border-[#1e2d45] bg-[#111827] p-6">
                        <label className="flex items-center justify-between cursor-pointer">
                            <div>
                                <div className="text-sm text-white">Email Notifications</div>
                                <p className="text-xs text-slate-500 mt-0.5">Receive emails when your submissions are reviewed or scored.</p>
                            </div>
                            <button
                                onClick={() => setEmailNotifications((v) => !v)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${emailNotifications ? "bg-blue-500" : "bg-[#1e2d45]"}`}
                                aria-pressed={emailNotifications}
                                role="switch"
                                aria-label="Toggle email notifications"
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${emailNotifications ? "translate-x-6" : "translate-x-1"}`}
                                />
                            </button>
                        </label>
                    </div>
                </section>

                {/* Trust & Ethics link */}
                <div className="rounded-xl border border-[#1e2d45] bg-[#111827] p-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Shield className="w-4 h-4 text-blue-400 shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-white">Trust &amp; Ethics</p>
                            <p className="text-xs text-slate-500 mt-0.5">How WorkProof handles AI disclosure, data ownership, and verification fairness.</p>
                        </div>
                    </div>
                    <NextLink
                        href="/trust"
                        className="shrink-0 text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
                    >
                        Read our commitments →
                    </NextLink>
                </div>

                {/* Save button */}
                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    >
                        <Save className="w-4 h-4" />
                        Save Changes
                    </button>
                </div>
            </div>
        </AppShell>
    );
}
