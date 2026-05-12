import { MapPin, Shield, Share2, ExternalLink, CheckCircle2 } from "lucide-react";
import type { User } from "@/types";

interface ProfileHeaderProps {
    user: User;
    isEmployerView?: boolean;
}

export function ProfileHeader({ user, isEmployerView = false }: ProfileHeaderProps) {
    return (
        <div className="rounded-xl border border-[#1e2d45] bg-[#111827] p-6">
            <div className="flex flex-col sm:flex-row items-start gap-6">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-2xl font-bold shrink-0">
                    {user.avatarInitials}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                            <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                            <p className="text-blue-400 font-medium mt-0.5">{user.targetRole}</p>
                            <div className="flex items-center gap-4 mt-2">
                                <span className="flex items-center gap-1 text-sm text-slate-400">
                                    <MapPin className="w-3.5 h-3.5" />
                                    {user.location}
                                </span>
                                <span className="flex items-center gap-1 text-sm text-slate-400">
                                    <Shield className="w-3.5 h-3.5 text-blue-400" />
                                    {user.level}
                                </span>
                                {user.availability && (
                                    <span className="flex items-center gap-1 text-sm text-emerald-400">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        {user.availability}
                                    </span>
                                )}
                            </div>
                        </div>

                        {!isEmployerView && (
                            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors">
                                <Share2 className="w-4 h-4" />
                                Share Profile
                            </button>
                        )}
                    </div>

                    <p className="text-slate-400 text-sm leading-relaxed mt-3 max-w-2xl">{user.bio}</p>

                    {/* Links */}
                    <div className="flex items-center gap-4 mt-4 flex-wrap">
                        {user.portfolioLink && (
                            <a
                                href={user.portfolioLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-blue-400 transition-colors"
                            >
                                <ExternalLink className="w-3.5 h-3.5" />
                                Portfolio
                            </a>
                        )}
                        {user.githubLink && (
                            <a
                                href={user.githubLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-blue-400 transition-colors"
                            >
                                <ExternalLink className="w-3.5 h-3.5" />
                                GitHub
                            </a>
                        )}
                        {user.linkedinLink && (
                            <a
                                href={user.linkedinLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-blue-400 transition-colors"
                            >
                                <ExternalLink className="w-3.5 h-3.5" />
                                LinkedIn
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
