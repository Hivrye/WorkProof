/**
 * database.ts — TypeScript interfaces for every WorkProof Supabase table.
 *
 * These types mirror the schema described in SUPABASE_SCHEMA.md.
 * When @supabase/supabase-js is installed, pass `Database` as the generic to
 * `createClient<Database>()` so every `.from()` call becomes fully type-safe.
 *
 * Convention:
 *   - `Row`    — shape returned by SELECT queries (all columns present)
 *   - `Insert` — shape required for INSERT (omits auto-generated columns)
 *   - `Update` — shape for UPDATE (all columns optional)
 */

// ─── Shared primitives ────────────────────────────────────────────────────────

export type UUID = string;
export type ISOTimestamp = string; // e.g. "2025-01-28T14:30:00Z"
export type Difficulty = "beginner" | "intermediate" | "advanced";
export type ChallengeStatus = "not_started" | "in_progress" | "completed" | "abandoned";
export type AIDisclosureLevel = "none" | "brainstorm" | "suggestions" | "heavy" | "explained";
export type ActivityEventType = "submission" | "feedback" | "badge" | "profile" | "challenge" | "employer_view";
export type EmployerReviewStatus = "pending" | "viewed" | "contacted" | "passed";
export type ResourceType = "article" | "video" | "tool" | "reference";

// ─── JSONB column shapes ──────────────────────────────────────────────────────

export interface EvaluationCriterion {
    name: string;
    description: string;
    weight: number; // 0–1, weights should sum to 1
}

export interface ChallengeResource {
    title: string;
    url: string;
    type: ResourceType;
}

export interface ProcessStep {
    id: string;
    title: string;
    description: string;
    timestamp: ISOTimestamp;
}

// ─── users ────────────────────────────────────────────────────────────────────
//  Shadow table of auth.users. Created by an after-insert trigger.
//  Purpose: Extends Supabase Auth with app-level metadata.
//  RLS: Users can read/update own row. Service role can read all.

export interface UsersRow {
    id: UUID;                     // references auth.users(id) ON DELETE CASCADE
    email: string;                // synced from auth.users
    created_at: ISOTimestamp;
    updated_at: ISOTimestamp;
}

export interface UsersInsert {
    id: UUID;
    email: string;
}

export type UsersUpdate = Partial<Pick<UsersRow, "email" | "updated_at">>;

// ─── profiles ─────────────────────────────────────────────────────────────────
//  Public-facing candidate profile. 1-to-1 with users.
//  RLS: Anyone can read rows where is_public = true.
//       Authenticated user can read/update own row.

export interface ProfilesRow {
    id: UUID;                          // = users.id (NOT a separate PK)
    username: string;                  // unique URL slug, e.g. "alex-carter"
    name: string;
    target_role: string;               // e.g. "Frontend Engineer"
    bio: string | null;
    skills: string[];                  // ordered array of skill labels
    portfolio_link: string | null;
    github_link: string | null;
    linkedin_link: string | null;
    avatar_url: string | null;
    is_public: boolean;
    ai_transparency_preference: AIDisclosureLevel | null;
    location: string | null;
    availability: string | null;       // e.g. "Immediately available"
    open_to_remote: boolean;
    selected_track_id: string | null;  // references tracks(id)
    created_at: ISOTimestamp;
    updated_at: ISOTimestamp;
}

export interface ProfilesInsert {
    id: UUID;
    username: string;
    name: string;
    target_role?: string;
    bio?: string | null;
    skills?: string[];
    portfolio_link?: string | null;
    github_link?: string | null;
    linkedin_link?: string | null;
    avatar_url?: string | null;
    is_public?: boolean;
    ai_transparency_preference?: AIDisclosureLevel | null;
    location?: string | null;
    availability?: string | null;
    open_to_remote?: boolean;
    selected_track_id?: string | null;
}

export type ProfilesUpdate = Partial<Omit<ProfilesInsert, "id">>;

// ─── organizations ────────────────────────────────────────────────────────────
//  Employer / company accounts. Linked to employer users.
//  RLS: Anyone can read verified organizations. Org admins can update own row.

export interface OrganizationsRow {
    id: UUID;
    name: string;
    slug: string;                // unique, URL-safe, e.g. "acme-corp"
    website: string | null;
    logo_url: string | null;
    description: string | null;
    verified: boolean;           // manually verified by WorkProof team
    created_at: ISOTimestamp;
    updated_at: ISOTimestamp;
}

export interface OrganizationsInsert {
    name: string;
    slug: string;
    website?: string | null;
    logo_url?: string | null;
    description?: string | null;
    verified?: boolean;
}

export type OrganizationsUpdate = Partial<Omit<OrganizationsInsert, "slug">>;

// ─── tracks ───────────────────────────────────────────────────────────────────
//  Skill tracks (Frontend, Backend, etc.). Typically managed by admins.
//  RLS: Anyone can read active tracks. Only service role can insert/update.

export interface TracksRow {
    id: string;                   // e.g. "track_frontend" (human-readable slug)
    name: string;
    description: string;
    icon: string;                 // lucide-react icon name
    challenge_count: number;      // denormalized for speed; kept in sync by trigger
    estimated_weeks: number;
    skill_categories: string[];
    color: string;                // Tailwind color token, e.g. "blue"
    is_active: boolean;
    created_at: ISOTimestamp;
}

export interface TracksInsert {
    id: string;
    name: string;
    description: string;
    icon: string;
    estimated_weeks: number;
    skill_categories?: string[];
    color?: string;
    is_active?: boolean;
}

export type TracksUpdate = Partial<Omit<TracksInsert, "id">>;

// ─── challenges ───────────────────────────────────────────────────────────────
//  Individual challenge definitions. Managed by WorkProof as content.
//  RLS: Anyone can read active challenges. Only service role can insert/update.

export interface ChallengesRow {
    id: string;                            // e.g. "ch_accessibility_audit"
    track_id: string;                      // references tracks(id)
    title: string;
    description: string;
    scenario: string;
    task_brief: string;
    deliverables: string[];
    skills_tested: string[];
    evaluation_criteria: EvaluationCriterion[];
    resources: ChallengeResource[];
    difficulty: Difficulty;
    estimated_time: string;                // human-readable e.g. "60–90 min"
    proof_value: number;                   // points added to proof score on completion
    ai_disclosure_required: boolean;
    tags: string[];
    is_active: boolean;
    created_at: ISOTimestamp;
    updated_at: ISOTimestamp;
}

export interface ChallengesInsert {
    id: string;
    track_id: string;
    title: string;
    description: string;
    scenario: string;
    task_brief: string;
    deliverables?: string[];
    skills_tested?: string[];
    evaluation_criteria?: EvaluationCriterion[];
    resources?: ChallengeResource[];
    difficulty: Difficulty;
    estimated_time: string;
    proof_value?: number;
    ai_disclosure_required?: boolean;
    tags?: string[];
    is_active?: boolean;
}

export type ChallengesUpdate = Partial<Omit<ChallengesInsert, "id">>;

// ─── submissions ──────────────────────────────────────────────────────────────
//  A user's attempt at a challenge. One submission per user per challenge
//  enforced by a unique constraint; re-attempts overwrite via upsert.
//  RLS: Users can CRUD own rows.
//       Employers can read rows where the profile is_public = true.

export interface SubmissionsRow {
    id: UUID;
    user_id: UUID;                         // references users(id)
    challenge_id: string;                  // references challenges(id)
    status: ChallengeStatus;
    score: number | null;                  // 0–100; null until graded
    live_link: string | null;
    repo_link: string | null;
    project_title: string;
    explanation: string;
    problem_statement: string;
    design_decisions: string;
    improvements: string;
    ai_disclosure: AIDisclosureLevel;
    ai_description: string | null;
    process_steps: ProcessStep[];          // JSONB ordered array
    completion_time_minutes: number | null;
    submitted_at: ISOTimestamp | null;     // null while status = in_progress
    created_at: ISOTimestamp;
    updated_at: ISOTimestamp;
}

export interface SubmissionsInsert {
    user_id: UUID;
    challenge_id: string;
    status?: ChallengeStatus;
    score?: number | null;
    live_link?: string | null;
    repo_link?: string | null;
    project_title?: string;
    explanation?: string;
    problem_statement?: string;
    design_decisions?: string;
    improvements?: string;
    ai_disclosure?: AIDisclosureLevel;
    ai_description?: string | null;
    process_steps?: ProcessStep[];
    completion_time_minutes?: number | null;
    submitted_at?: ISOTimestamp | null;
}

export type SubmissionsUpdate = Partial<Omit<SubmissionsInsert, "user_id" | "challenge_id">>;

// ─── proof_scores ─────────────────────────────────────────────────────────────
//  Computed aggregate score per user. Updated by a server-side function after
//  each submission is graded (or via Supabase Edge Function on a schedule).
//  RLS: Anyone can read rows where the linked profile is_public = true.
//       Only service role can insert/update.

export interface ProofScoresRow {
    id: UUID;
    user_id: UUID;               // references users(id); UNIQUE
    total: number;               // computed weighted total (0–100)
    max_total: number;           // maximum achievable score given current challenges
    work_quality: number;        // average challenge score (0–100)
    process_clarity: number;     // quality and completeness of process logs (0–100)
    skill_coverage: number;      // breadth across skill categories (0–100)
    ai_transparency: number;     // consistency of AI disclosure (0–100)
    consistency: number;         // recency-weighted regularity metric (0–100)
    challenge_count: number;     // total completed challenges
    computed_at: ISOTimestamp;
    created_at: ISOTimestamp;
    updated_at: ISOTimestamp;
}

export interface ProofScoresInsert {
    user_id: UUID;
    total?: number;
    max_total?: number;
    work_quality?: number;
    process_clarity?: number;
    skill_coverage?: number;
    ai_transparency?: number;
    consistency?: number;
    challenge_count?: number;
    computed_at?: ISOTimestamp;
}

export type ProofScoresUpdate = Partial<Omit<ProofScoresInsert, "user_id">>;

// ─── activity_events ──────────────────────────────────────────────────────────
//  Immutable audit trail of user actions. Append-only (no UPDATE/DELETE for users).
//  RLS: Users can insert and read own events. Employers can read events of public profiles.

export interface ActivityEventsRow {
    id: UUID;
    user_id: UUID;                // references users(id)
    type: ActivityEventType;
    title: string;
    description: string;
    metadata: Record<string, string | number | boolean | null> | null; // JSONB
    created_at: ISOTimestamp;
}

export interface ActivityEventsInsert {
    user_id: UUID;
    type: ActivityEventType;
    title: string;
    description: string;
    metadata?: Record<string, string | number | boolean | null> | null;
}

// No update type — activity events are immutable.

// ─── employer_reviews ─────────────────────────────────────────────────────────
//  Tracks when an employer views or acts on a candidate profile.
//  RLS: Employers can insert own rows. Candidates can read reviews of own profile.
//       Organizations can read reviews created by their members.

export interface EmployerReviewsRow {
    id: UUID;
    employer_user_id: UUID;           // references users(id) — the employer
    candidate_user_id: UUID;          // references users(id) — the candidate
    organization_id: UUID | null;     // references organizations(id)
    submission_id: UUID | null;       // references submissions(id) — specific work reviewed
    rating: number | null;            // 1–5 stars; null until explicitly rated
    notes: string | null;             // private employer notes, not visible to candidate
    status: EmployerReviewStatus;
    viewed_at: ISOTimestamp | null;   // set when employer first views the profile
    created_at: ISOTimestamp;
    updated_at: ISOTimestamp;
}

export interface EmployerReviewsInsert {
    employer_user_id: UUID;
    candidate_user_id: UUID;
    organization_id?: UUID | null;
    submission_id?: UUID | null;
    rating?: number | null;
    notes?: string | null;
    status?: EmployerReviewStatus;
    viewed_at?: ISOTimestamp | null;
}

export type EmployerReviewsUpdate = Partial<Pick<EmployerReviewsRow,
    "rating" | "notes" | "status" | "viewed_at" | "updated_at"
>>;

// ─── Database root type ───────────────────────────────────────────────────────
//  Pass this as the generic to `createClient<Database>()` for full type safety.
//  Schema matches Supabase's generated type convention.

export interface Database {
    public: {
        Tables: {
            users: {
                Row: UsersRow;
                Insert: UsersInsert;
                Update: UsersUpdate;
            };
            profiles: {
                Row: ProfilesRow;
                Insert: ProfilesInsert;
                Update: ProfilesUpdate;
            };
            organizations: {
                Row: OrganizationsRow;
                Insert: OrganizationsInsert;
                Update: OrganizationsUpdate;
            };
            tracks: {
                Row: TracksRow;
                Insert: TracksInsert;
                Update: TracksUpdate;
            };
            challenges: {
                Row: ChallengesRow;
                Insert: ChallengesInsert;
                Update: ChallengesUpdate;
            };
            submissions: {
                Row: SubmissionsRow;
                Insert: SubmissionsInsert;
                Update: SubmissionsUpdate;
            };
            proof_scores: {
                Row: ProofScoresRow;
                Insert: ProofScoresInsert;
                Update: ProofScoresUpdate;
            };
            activity_events: {
                Row: ActivityEventsRow;
                Insert: ActivityEventsInsert;
                Update: never; // immutable
            };
            employer_reviews: {
                Row: EmployerReviewsRow;
                Insert: EmployerReviewsInsert;
                Update: EmployerReviewsUpdate;
            };
        };
        Views: Record<string, never>;
        Functions: Record<string, never>;
        Enums: {
            difficulty: Difficulty;
            challenge_status: ChallengeStatus;
            ai_disclosure_level: AIDisclosureLevel;
            activity_event_type: ActivityEventType;
            employer_review_status: EmployerReviewStatus;
        };
    };
}
