// Core domain types for Proofolio

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";
export type ChallengeStatus = "not-started" | "in-progress" | "completed";
export type AIDisclosureLevel =
    | "none"
    | "brainstorm"
    | "suggestions"
    | "heavy"
    | "explained";

export interface Track {
    id: string;
    name: string;
    description: string;
    icon: string;
    challengeCount: number;
    estimatedWeeks: number;
    skillCategories: string[];
    color: string;
}

export interface Challenge {
    id: string;
    title: string;
    trackId: string;
    track: string;
    difficulty: Difficulty;
    estimatedTime: string;
    description: string;
    scenario: string;
    taskBrief: string;
    deliverables: string[];
    skillsTested: string[];
    evaluationCriteria: EvalCriterion[];
    resources: Resource[];
    aiDisclosureRequired: boolean;
    status: ChallengeStatus;
    score?: number;
    proofValue: number;
    submissions?: Submission[];
    tags: string[];
}

export interface EvalCriterion {
    name: string;
    description: string;
    weight: number;
}

export interface Resource {
    title: string;
    url: string;
    type: "article" | "video" | "tool" | "reference";
}

export interface Submission {
    id: string;
    challengeId: string;
    challengeTitle: string;
    track: string;
    submittedAt: string;
    liveLink?: string;
    repoLink?: string;
    projectTitle: string;
    explanation: string;
    problemStatement: string;
    designDecisions: string;
    improvements: string;
    aiDisclosure: AIDisclosureLevel;
    aiDescription?: string;
    processSteps: ProcessStep[];
    score: number;
    skills: string[];
}

export interface ProcessStep {
    id: string;
    title: string;
    description: string;
    timestamp: string;
}

export interface SkillScore {
    name: string;
    score: number;
    maxScore: number;
}

export interface ProofScore {
    total: number;
    maxTotal: number;
    workQuality: number;
    processClarity: number;
    skillCoverage: number;
    aiTransparency: number;
    consistency: number;
}

export interface User {
    id: string;
    name: string;
    username: string;
    targetRole: string;
    location: string;
    bio: string;
    avatarInitials: string;
    trackId: string;
    track: string;
    level: string;
    profileCompletion: number;
    completedChallenges: number;
    inProgressChallenges: number;
    profileViews: number;
    weeklyProfileViews?: number;
    avgScore?: number;
    endorsements?: number;
    proofScore: ProofScore;
    skills: SkillScore[];
    portfolioLink: string;
    githubLink: string;
    linkedinLink: string;
    isPublic: boolean;
    aiTransparencyPreference: string;
    joinedAt: string;
    availability?: string;
    openToRemote?: boolean;
}

export interface ActivityItem {
    id: string;
    type: "submission" | "feedback" | "badge" | "profile" | "challenge";
    title: string;
    description: string;
    timestamp: string;
    metadata?: Record<string, string | number>;
}

export type ExperienceLevel =
    | "no-experience"
    | "some-projects"
    | "1-2-years"
    | "3-plus-years";

export type OnboardingGoal =
    | "get-hired"
    | "build-portfolio"
    | "switch-careers"
    | "practice";

export interface OnboardingProfile {
    /** Track ID, e.g. "frontend" */
    roleId: string;
    /** Human-readable role name, e.g. "Front-End Developer" */
    roleName: string;
    experienceLevel: ExperienceLevel;
    goal: OnboardingGoal;
    showAiOnProfile: boolean;
    firstChallengeId: string;
    completedAt: string;
}
