-- =============================================================================
-- WorkProof — Initial Database Schema
-- Migration: 001_initial_schema.sql
--
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor → New query),
-- or apply via the Supabase CLI:
--   supabase db push
--
-- IMPORTANT: Execute the full file in one transaction.
-- All tables use UUID primary keys (via gen_random_uuid() — built-in to Supabase).
-- RLS is enabled on every table. Service-role bypasses RLS; anon/authenticated
-- users are governed by the policies below.
-- =============================================================================

-- ─── Extensions ──────────────────────────────────────────────────────────────
-- gen_random_uuid() is available in PostgreSQL 13+ without this, but we
-- keep it explicit for clarity and compatibility.
create extension if not exists "pgcrypto";

-- ─── Enums ───────────────────────────────────────────────────────────────────

create type public.difficulty as enum (
    'beginner',
    'intermediate',
    'advanced'
);

create type public.challenge_status as enum (
    'not_started',
    'in_progress',
    'completed',
    'abandoned'
);

create type public.ai_disclosure_level as enum (
    'none',
    'brainstorm',
    'suggestions',
    'heavy',
    'explained'
);

create type public.activity_event_type as enum (
    'submission',
    'feedback',
    'badge',
    'profile',
    'challenge',
    'employer_view'
);

create type public.employer_review_status as enum (
    'pending',
    'viewed',
    'contacted',
    'passed'
);

create type public.org_member_role as enum (
    'admin',
    'instructor',
    'student',
    'employer'
);

-- =============================================================================
-- TABLES
-- =============================================================================

-- ─── profiles ─────────────────────────────────────────────────────────────────
-- 1-to-1 with auth.users. Auto-created by the handle_new_user trigger.
-- This is both the private user record and the public proof profile.

create table public.profiles (
    id              uuid        primary key references auth.users(id) on delete cascade,
    username        text        not null unique,
    name            text        not null default '',
    target_role     text        not null default '',
    bio             text,
    skills          text[]      not null default '{}',
    portfolio_link  text,
    github_link     text,
    linkedin_link   text,
    avatar_url      text,
    track_id        text        not null default 'frontend',
    level           text        not null default 'Emerging Talent',
    is_public       boolean     not null default true,
    ai_transparency_preference  public.ai_disclosure_level  not null default 'suggestions',
    location        text,
    availability    text        default 'Open to opportunities',
    open_to_remote  boolean     not null default true,
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now(),

    constraint profiles_username_check check (username ~ '^[a-z0-9][a-z0-9\-]{1,48}[a-z0-9]$')
);

comment on table public.profiles is
    'Public-facing proof profile. 1-to-1 with auth.users, created by trigger on signup.';

-- ─── organizations ────────────────────────────────────────────────────────────
-- Bootcamps and employers that manage cohorts or review candidates.

create table public.organizations (
    id          uuid    primary key default gen_random_uuid(),
    name        text    not null,
    slug        text    not null unique,
    type        text    not null default 'bootcamp',   -- 'bootcamp' | 'employer'
    logo_url    text,
    website     text,
    created_at  timestamptz not null default now(),

    constraint organizations_type_check check (type in ('bootcamp', 'employer')),
    constraint organizations_slug_check check (slug ~ '^[a-z0-9][a-z0-9\-]{1,48}[a-z0-9]$')
);

-- ─── organization_members ─────────────────────────────────────────────────────

create table public.organization_members (
    id          uuid    primary key default gen_random_uuid(),
    org_id      uuid    not null references public.organizations(id) on delete cascade,
    user_id     uuid    not null references auth.users(id) on delete cascade,
    role        public.org_member_role not null default 'student',
    joined_at   timestamptz not null default now(),

    unique (org_id, user_id)
);

-- ─── tracks ───────────────────────────────────────────────────────────────────
-- Career tracks. IDs are human-readable slugs (e.g. 'frontend', 'ux-design').
-- Seeded from supabase/seed.sql — not user-generated.

create table public.tracks (
    id                  text    primary key,     -- e.g. 'frontend'
    name                text    not null,
    description         text    not null default '',
    icon                text    not null default 'Layers',
    challenge_count     int     not null default 0,
    estimated_weeks     int     not null default 8,
    skill_categories    text[]  not null default '{}',
    color               text    not null default 'blue',
    created_at          timestamptz not null default now()
);

-- ─── challenges ───────────────────────────────────────────────────────────────
-- Challenge content. IDs are human-readable (e.g. 'fe-001').
-- Seeded from supabase/seed.sql.

create table public.challenges (
    id                      text    primary key,   -- e.g. 'fe-001'
    title                   text    not null,
    track_id                text    references public.tracks(id) on delete set null,
    track                   text    not null,
    difficulty              public.difficulty   not null default 'beginner',
    estimated_time          text    not null default '2–4 hours',
    description             text    not null default '',
    scenario                text    not null default '',
    task_brief              text    not null default '',
    deliverables            text[]  not null default '{}',
    skills_tested           text[]  not null default '{}',
    evaluation_criteria     jsonb   not null default '[]',
    resources               jsonb   not null default '[]',
    ai_disclosure_required  boolean not null default false,
    proof_value             int     not null default 100,
    tags                    text[]  not null default '{}',
    is_published            boolean not null default true,
    created_at              timestamptz not null default now()
);

-- ─── submissions ──────────────────────────────────────────────────────────────
-- A user's completed work submission for a challenge.

create table public.submissions (
    id                  uuid    primary key default gen_random_uuid(),
    user_id             uuid    not null references auth.users(id) on delete cascade,
    challenge_id        text    references public.challenges(id) on delete set null,
    challenge_title     text    not null,
    track               text    not null,
    project_title       text    not null,
    live_link           text,
    repo_link           text,
    explanation         text    not null default '',
    problem_statement   text    not null default '',
    design_decisions    text    not null default '',
    improvements        text    not null default '',
    ai_disclosure       public.ai_disclosure_level  not null default 'none',
    ai_description      text,
    score               int     not null default 0 check (score >= 0 and score <= 100),
    skills              text[]  not null default '{}',
    submitted_at        timestamptz not null default now()
);

comment on column public.submissions.score is
    'Client-computed proof score 0–100. Future: replace with server-side RPC scoring.';

-- ─── submission_process_steps ─────────────────────────────────────────────────
-- Ordered process notes attached to a submission.

create table public.submission_process_steps (
    id              uuid    primary key default gen_random_uuid(),
    submission_id   uuid    not null references public.submissions(id) on delete cascade,
    title           text    not null,
    description     text    not null default '',
    step_order      int     not null default 0,
    recorded_at     timestamptz not null default now()
);

-- ─── proof_scores ─────────────────────────────────────────────────────────────
-- Aggregated proof score per user. 1-to-1 with auth.users.
-- Auto-created alongside the profile by the handle_new_user trigger.

create table public.proof_scores (
    id              uuid    primary key default gen_random_uuid(),
    user_id         uuid    not null unique references auth.users(id) on delete cascade,
    total           int     not null default 0,
    max_total       int     not null default 1000,
    work_quality    int     not null default 0,
    process_clarity int     not null default 0,
    skill_coverage  int     not null default 0,
    ai_transparency int     not null default 0,
    consistency     int     not null default 0,
    updated_at      timestamptz not null default now()
);

-- ─── activity_events ──────────────────────────────────────────────────────────
-- Audit log / activity feed for each user.

create table public.activity_events (
    id          uuid    primary key default gen_random_uuid(),
    user_id     uuid    not null references auth.users(id) on delete cascade,
    type        public.activity_event_type  not null,
    title       text    not null,
    description text,
    metadata    jsonb,
    created_at  timestamptz not null default now()
);

-- ─── employer_reviews ─────────────────────────────────────────────────────────
-- Tracks which employers have viewed / contacted which candidates.

create table public.employer_reviews (
    id              uuid    primary key default gen_random_uuid(),
    employer_id     uuid    not null references auth.users(id) on delete cascade,
    candidate_id    uuid    not null references auth.users(id) on delete cascade,
    status          public.employer_review_status   not null default 'pending',
    notes           text,
    viewed_at       timestamptz,
    created_at      timestamptz not null default now(),

    unique (employer_id, candidate_id)
);

-- ─── saved_challenges ─────────────────────────────────────────────────────────

create table public.saved_challenges (
    id              uuid    primary key default gen_random_uuid(),
    user_id         uuid    not null references auth.users(id) on delete cascade,
    challenge_id    text    not null references public.challenges(id) on delete cascade,
    saved_at        timestamptz not null default now(),

    unique (user_id, challenge_id)
);

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- ── Auto-provision profile + proof_score on signup ───────────────────────────

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer                     -- runs as postgres superuser
set search_path = public             -- avoids search_path injection
as $$
declare
    base_username text;
    final_username text;
    counter       int := 0;
begin
    -- Derive a username from metadata → email prefix, then dedup.
    base_username := coalesce(
        new.raw_user_meta_data->>'username',
        lower(regexp_replace(split_part(new.email, '@', 1), '[^a-z0-9]', '-', 'g'))
    );
    -- Minimum length guard
    base_username := case when length(base_username) < 3 then base_username || '-user' else base_username end;
    -- Truncate to 40 chars so there's room for a numeric suffix
    base_username := left(base_username, 40);

    final_username := base_username;

    -- Ensure uniqueness
    while exists (select 1 from public.profiles where username = final_username) loop
        counter := counter + 1;
        final_username := base_username || '-' || counter;
    end loop;

    insert into public.profiles (id, username, name, target_role)
    values (
        new.id,
        final_username,
        coalesce(new.raw_user_meta_data->>'name', final_username),
        coalesce(new.raw_user_meta_data->>'target_role', '')
    );

    insert into public.proof_scores (user_id)
    values (new.id);

    return new;
end;
$$;

create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

-- ── updated_at auto-stamp ────────────────────────────────────────────────────

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

create trigger profiles_set_updated_at
    before update on public.profiles
    for each row execute procedure public.set_updated_at();

create trigger proof_scores_set_updated_at
    before update on public.proof_scores
    for each row execute procedure public.set_updated_at();

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

alter table public.profiles             enable row level security;
alter table public.organizations        enable row level security;
alter table public.organization_members enable row level security;
alter table public.tracks               enable row level security;
alter table public.challenges           enable row level security;
alter table public.submissions          enable row level security;
alter table public.submission_process_steps enable row level security;
alter table public.proof_scores         enable row level security;
alter table public.activity_events      enable row level security;
alter table public.employer_reviews     enable row level security;
alter table public.saved_challenges     enable row level security;

-- ─── profiles ────────────────────────────────────────────────────────────────

-- Anyone (including anonymous) can read public profiles.
create policy "profiles_select_public"
    on public.profiles for select
    using (is_public = true);

-- Authenticated users can always read their own profile (even if private).
create policy "profiles_select_own"
    on public.profiles for select
    using (auth.uid() = id);

-- Users may only insert their own profile row
-- (the trigger handles this, but this policy lets client code do it too if needed).
create policy "profiles_insert_own"
    on public.profiles for insert
    with check (auth.uid() = id);

-- Users may update their own profile.
create policy "profiles_update_own"
    on public.profiles for update
    using (auth.uid() = id);

-- ─── tracks ──────────────────────────────────────────────────────────────────
-- Track content is publicly readable; only service_role can insert/update.

create policy "tracks_select_all"
    on public.tracks for select
    using (true);

-- ─── challenges ──────────────────────────────────────────────────────────────

create policy "challenges_select_published"
    on public.challenges for select
    using (is_published = true);

-- ─── submissions ─────────────────────────────────────────────────────────────

create policy "submissions_select_own"
    on public.submissions for select
    using (auth.uid() = user_id);

create policy "submissions_select_public_profile"
    on public.submissions for select
    using (
        exists (
            select 1 from public.profiles
            where profiles.id = submissions.user_id
              and profiles.is_public = true
        )
    );

create policy "submissions_insert_own"
    on public.submissions for insert
    with check (auth.uid() = user_id);

-- ─── submission_process_steps ────────────────────────────────────────────────

create policy "steps_select_own"
    on public.submission_process_steps for select
    using (
        exists (
            select 1 from public.submissions s
            where s.id = submission_process_steps.submission_id
              and s.user_id = auth.uid()
        )
    );

create policy "steps_select_public_profile"
    on public.submission_process_steps for select
    using (
        exists (
            select 1 from public.submissions s
            join public.profiles p on p.id = s.user_id
            where s.id = submission_process_steps.submission_id
              and p.is_public = true
        )
    );

create policy "steps_insert_own"
    on public.submission_process_steps for insert
    with check (
        exists (
            select 1 from public.submissions s
            where s.id = submission_process_steps.submission_id
              and s.user_id = auth.uid()
        )
    );

-- ─── proof_scores ────────────────────────────────────────────────────────────

create policy "proof_scores_select_own"
    on public.proof_scores for select
    using (auth.uid() = user_id);

create policy "proof_scores_select_public_profile"
    on public.proof_scores for select
    using (
        exists (
            select 1 from public.profiles
            where profiles.id = proof_scores.user_id
              and profiles.is_public = true
        )
    );

create policy "proof_scores_update_own"
    on public.proof_scores for update
    using (auth.uid() = user_id);

-- ─── activity_events ─────────────────────────────────────────────────────────

create policy "activity_select_own"
    on public.activity_events for select
    using (auth.uid() = user_id);

create policy "activity_insert_own"
    on public.activity_events for insert
    with check (auth.uid() = user_id);

-- ─── employer_reviews ────────────────────────────────────────────────────────

-- Employers can manage reviews they created.
create policy "employer_reviews_all_employer"
    on public.employer_reviews for all
    using (auth.uid() = employer_id);

-- Candidates can see reviews of themselves.
create policy "employer_reviews_select_candidate"
    on public.employer_reviews for select
    using (auth.uid() = candidate_id);

-- ─── saved_challenges ────────────────────────────────────────────────────────

create policy "saved_challenges_all_own"
    on public.saved_challenges for all
    using (auth.uid() = user_id);

-- ─── organizations ───────────────────────────────────────────────────────────

create policy "organizations_select_members"
    on public.organizations for select
    using (
        exists (
            select 1 from public.organization_members
            where organization_members.org_id = organizations.id
              and organization_members.user_id = auth.uid()
        )
    );

-- ─── organization_members ────────────────────────────────────────────────────

create policy "org_members_select_same_org"
    on public.organization_members for select
    using (
        exists (
            select 1 from public.organization_members m
            where m.org_id = organization_members.org_id
              and m.user_id = auth.uid()
        )
    );

-- =============================================================================
-- INDEXES
-- =============================================================================

-- Speed up profile lookups by username (used in /profile/[username] route).
create index idx_profiles_username on public.profiles (username);

-- Speed up submission queries per user.
create index idx_submissions_user_id         on public.submissions (user_id);
create index idx_submissions_challenge_id    on public.submissions (challenge_id);
create index idx_submissions_submitted_at    on public.submissions (submitted_at desc);

-- Activity feed ordering.
create index idx_activity_user_created on public.activity_events (user_id, created_at desc);

-- Challenge filtering by track.
create index idx_challenges_track_id on public.challenges (track_id);

-- Saved challenges lookup.
create index idx_saved_challenges_user_id on public.saved_challenges (user_id);
