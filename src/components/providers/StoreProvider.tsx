"use client";

import { SubmissionsProvider } from "@/store/submissions-store";
import { OnboardingProvider } from "@/store/onboarding-store";
import { UserProfileProvider } from "@/store/user-store";
import type { ReactNode } from "react";

/** Thin client wrapper so layout.tsx stays a Server Component. */
export function StoreProvider({ children }: { children: ReactNode }) {
    return (
        <UserProfileProvider>
            <OnboardingProvider>
                <SubmissionsProvider>{children}</SubmissionsProvider>
            </OnboardingProvider>
        </UserProfileProvider>
    );
}
