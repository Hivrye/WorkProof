/**
 * types.ts — Proofolio Supabase Database type map.
 *
 * Generated manually to match the schema in supabase/migrations/001_initial_schema.sql.
 * Pass `Database` to createClient<Database>() for full type-safety on all .from() calls.
 *
 * Utility helpers at the bottom:
 *   Tables<'profiles'>         → Row type
 *   Insertable<'submissions'>  → Insert type
 *   Updateable<'profiles'>     → Update type
 *   Enums<'difficulty'>        → enum union type
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    username: string
                    name: string
                    target_role: string
                    bio: string | null
                    skills: string[]
                    portfolio_link: string | null
                    github_link: string | null
                    linkedin_link: string | null
                    avatar_url: string | null
                    track_id: string
                    level: string
                    is_public: boolean
                    ai_transparency_preference: Database["public"]["Enums"]["ai_disclosure_level"]
                    location: string | null
                    availability: string | null
                    open_to_remote: boolean
                    experience_level: string
                    goal: string
                    onboarding_completed: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    username: string
                    name: string
                    target_role?: string
                    bio?: string | null
                    skills?: string[]
                    portfolio_link?: string | null
                    github_link?: string | null
                    linkedin_link?: string | null
                    avatar_url?: string | null
                    track_id?: string
                    level?: string
                    is_public?: boolean
                    ai_transparency_preference?: Database["public"]["Enums"]["ai_disclosure_level"]
                    location?: string | null
                    availability?: string | null
                    open_to_remote?: boolean
                    experience_level?: string
                    goal?: string
                    onboarding_completed?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    username?: string
                    name?: string
                    target_role?: string
                    bio?: string | null
                    skills?: string[]
                    portfolio_link?: string | null
                    github_link?: string | null
                    linkedin_link?: string | null
                    avatar_url?: string | null
                    track_id?: string
                    level?: string
                    is_public?: boolean
                    ai_transparency_preference?: Database["public"]["Enums"]["ai_disclosure_level"]
                    location?: string | null
                    availability?: string | null
                    open_to_remote?: boolean
                    experience_level?: string
                    goal?: string
                    onboarding_completed?: boolean
                    updated_at?: string
                }
                Relationships: []
            }
            organizations: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    type: string
                    logo_url: string | null
                    website: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    type?: string
                    logo_url?: string | null
                    website?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    type?: string
                    logo_url?: string | null
                    website?: string | null
                }
                Relationships: []
            }
            organization_members: {
                Row: {
                    id: string
                    org_id: string
                    user_id: string
                    role: Database["public"]["Enums"]["org_member_role"]
                    joined_at: string
                }
                Insert: {
                    id?: string
                    org_id: string
                    user_id: string
                    role?: Database["public"]["Enums"]["org_member_role"]
                    joined_at?: string
                }
                Update: {
                    id?: string
                    org_id?: string
                    user_id?: string
                    role?: Database["public"]["Enums"]["org_member_role"]
                }
                Relationships: [
                    {
                        foreignKeyName: "organization_members_org_id_fkey"
                        columns: ["org_id"]
                        referencedRelation: "organizations"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "organization_members_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            tracks: {
                Row: {
                    id: string
                    name: string
                    description: string
                    icon: string
                    challenge_count: number
                    estimated_weeks: number
                    skill_categories: string[]
                    color: string
                    created_at: string
                }
                Insert: {
                    id: string
                    name: string
                    description?: string
                    icon?: string
                    challenge_count?: number
                    estimated_weeks?: number
                    skill_categories?: string[]
                    color?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    description?: string
                    icon?: string
                    challenge_count?: number
                    estimated_weeks?: number
                    skill_categories?: string[]
                    color?: string
                }
                Relationships: []
            }
            challenges: {
                Row: {
                    id: string
                    title: string
                    track_id: string | null
                    track: string
                    difficulty: Database["public"]["Enums"]["difficulty"]
                    estimated_time: string
                    description: string
                    scenario: string
                    task_brief: string
                    deliverables: string[]
                    skills_tested: string[]
                    evaluation_criteria: Json
                    resources: Json
                    ai_disclosure_required: boolean
                    proof_value: number
                    tags: string[]
                    is_published: boolean
                    created_at: string
                }
                Insert: {
                    id: string
                    title: string
                    track_id?: string | null
                    track: string
                    difficulty?: Database["public"]["Enums"]["difficulty"]
                    estimated_time?: string
                    description?: string
                    scenario?: string
                    task_brief?: string
                    deliverables?: string[]
                    skills_tested?: string[]
                    evaluation_criteria?: Json
                    resources?: Json
                    ai_disclosure_required?: boolean
                    proof_value?: number
                    tags?: string[]
                    is_published?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    track_id?: string | null
                    track?: string
                    difficulty?: Database["public"]["Enums"]["difficulty"]
                    estimated_time?: string
                    description?: string
                    scenario?: string
                    task_brief?: string
                    deliverables?: string[]
                    skills_tested?: string[]
                    evaluation_criteria?: Json
                    resources?: Json
                    ai_disclosure_required?: boolean
                    proof_value?: number
                    tags?: string[]
                    is_published?: boolean
                }
                Relationships: [
                    {
                        foreignKeyName: "challenges_track_id_fkey"
                        columns: ["track_id"]
                        referencedRelation: "tracks"
                        referencedColumns: ["id"]
                    }
                ]
            }
            submissions: {
                Row: {
                    id: string
                    user_id: string
                    challenge_id: string | null
                    challenge_title: string
                    track: string
                    project_title: string
                    live_link: string | null
                    repo_link: string | null
                    explanation: string
                    problem_statement: string
                    design_decisions: string
                    improvements: string
                    ai_disclosure: Database["public"]["Enums"]["ai_disclosure_level"]
                    ai_description: string | null
                    score: number
                    skills: string[]
                    submitted_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    challenge_id?: string | null
                    challenge_title: string
                    track: string
                    project_title: string
                    live_link?: string | null
                    repo_link?: string | null
                    explanation?: string
                    problem_statement?: string
                    design_decisions?: string
                    improvements?: string
                    ai_disclosure?: Database["public"]["Enums"]["ai_disclosure_level"]
                    ai_description?: string | null
                    score?: number
                    skills?: string[]
                    submitted_at?: string
                }
                Update: {
                    id?: string
                    challenge_title?: string
                    track?: string
                    project_title?: string
                    live_link?: string | null
                    repo_link?: string | null
                    explanation?: string
                    problem_statement?: string
                    design_decisions?: string
                    improvements?: string
                    ai_disclosure?: Database["public"]["Enums"]["ai_disclosure_level"]
                    ai_description?: string | null
                    score?: number
                    skills?: string[]
                }
                Relationships: [
                    {
                        foreignKeyName: "submissions_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            submission_process_steps: {
                Row: {
                    id: string
                    submission_id: string
                    title: string
                    description: string
                    step_order: number
                    recorded_at: string
                }
                Insert: {
                    id?: string
                    submission_id: string
                    title: string
                    description?: string
                    step_order?: number
                    recorded_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string
                    step_order?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "submission_process_steps_submission_id_fkey"
                        columns: ["submission_id"]
                        referencedRelation: "submissions"
                        referencedColumns: ["id"]
                    }
                ]
            }
            proof_scores: {
                Row: {
                    id: string
                    user_id: string
                    total: number
                    max_total: number
                    work_quality: number
                    process_clarity: number
                    skill_coverage: number
                    ai_transparency: number
                    consistency: number
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    total?: number
                    max_total?: number
                    work_quality?: number
                    process_clarity?: number
                    skill_coverage?: number
                    ai_transparency?: number
                    consistency?: number
                    updated_at?: string
                }
                Update: {
                    id?: string
                    total?: number
                    max_total?: number
                    work_quality?: number
                    process_clarity?: number
                    skill_coverage?: number
                    ai_transparency?: number
                    consistency?: number
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "proof_scores_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            activity_events: {
                Row: {
                    id: string
                    user_id: string
                    type: Database["public"]["Enums"]["activity_event_type"]
                    title: string
                    description: string | null
                    metadata: Json | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    type: Database["public"]["Enums"]["activity_event_type"]
                    title: string
                    description?: string | null
                    metadata?: Json | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    type?: Database["public"]["Enums"]["activity_event_type"]
                    title?: string
                    description?: string | null
                    metadata?: Json | null
                }
                Relationships: [
                    {
                        foreignKeyName: "activity_events_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            employer_reviews: {
                Row: {
                    id: string
                    employer_id: string
                    candidate_id: string
                    status: Database["public"]["Enums"]["employer_review_status"]
                    notes: string | null
                    viewed_at: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    employer_id: string
                    candidate_id: string
                    status?: Database["public"]["Enums"]["employer_review_status"]
                    notes?: string | null
                    viewed_at?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    status?: Database["public"]["Enums"]["employer_review_status"]
                    notes?: string | null
                    viewed_at?: string | null
                }
                Relationships: []
            }
            saved_challenges: {
                Row: {
                    id: string
                    user_id: string
                    challenge_id: string
                    saved_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    challenge_id: string
                    saved_at?: string
                }
                Update: {
                    id?: string
                    saved_at?: string
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            difficulty: "beginner" | "intermediate" | "advanced"
            challenge_status: "not_started" | "in_progress" | "completed" | "abandoned"
            ai_disclosure_level: "none" | "brainstorm" | "suggestions" | "heavy" | "explained"
            activity_event_type: "submission" | "feedback" | "badge" | "profile" | "challenge" | "employer_view"
            employer_review_status: "pending" | "viewed" | "contacted" | "passed"
            org_member_role: "admin" | "instructor" | "student" | "employer"
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

// ─── Convenience helpers ──────────────────────────────────────────────────────

/** Row type for a given table. */
export type Tables<T extends keyof Database["public"]["Tables"]> =
    Database["public"]["Tables"][T]["Row"]

/** Insert type for a given table. */
export type Insertable<T extends keyof Database["public"]["Tables"]> =
    Database["public"]["Tables"][T]["Insert"]

/** Update type for a given table. */
export type Updateable<T extends keyof Database["public"]["Tables"]> =
    Database["public"]["Tables"][T]["Update"]

/** Enum union type. */
export type Enums<T extends keyof Database["public"]["Enums"]> =
    Database["public"]["Enums"][T]
