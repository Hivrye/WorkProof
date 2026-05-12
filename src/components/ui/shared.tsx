import { cn } from "@/lib/utils";

interface SectionHeadingProps {
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
    className?: string;
}

export function SectionHeading({ title, subtitle, action, className }: SectionHeadingProps) {
    return (
        <div className={cn("flex items-start justify-between gap-4 mb-6", className)}>
            <div>
                <h2 className="text-lg font-semibold text-white">{title}</h2>
                {subtitle && <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>}
            </div>
            {action && <div className="shrink-0">{action}</div>}
        </div>
    );
}

interface CTAButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost";
    size?: "sm" | "md" | "lg";
    children: React.ReactNode;
}

export function CTAButton({ variant = "primary", size = "md", children, className, ...props }: CTAButtonProps) {
    const variantClass = {
        primary: "bg-blue-600 hover:bg-blue-700 text-white border border-blue-500/30",
        secondary: "bg-white/8 hover:bg-white/12 text-white border border-[#1e2d45]",
        ghost: "bg-transparent hover:bg-white/5 text-slate-300 border border-transparent hover:border-[#1e2d45]",
    }[variant];

    const sizeClass = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base",
    }[size];

    return (
        <button
            className={cn(
                "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed",
                variantClass,
                sizeClass,
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}

interface EmptyStateProps {
    title: string;
    description: string;
    icon?: React.ReactNode;
    action?: React.ReactNode;
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            {icon && <div className="mb-4 text-slate-600">{icon}</div>}
            <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed mb-6">{description}</p>
            {action && action}
        </div>
    );
}
