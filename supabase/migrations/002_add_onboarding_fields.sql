-- =============================================================================
-- WorkProof — Migration 002: Add onboarding fields to profiles
-- =============================================================================
-- Adds three columns to public.profiles that the onboarding flow writes to:
--   experience_level  — maps to ExperienceLevel type in the frontend
--   goal              — maps to OnboardingGoal type in the frontend
--   onboarding_completed — false while setup is in progress or was skipped
--
-- Safe to run multiple times (uses IF NOT EXISTS / column-exists guards).
-- =============================================================================

do $$
begin
    -- experience_level
    if not exists (
        select 1 from information_schema.columns
        where table_schema = 'public'
          and table_name   = 'profiles'
          and column_name  = 'experience_level'
    ) then
        alter table public.profiles
            add column experience_level text not null default 'no-experience';
    end if;

    -- goal
    if not exists (
        select 1 from information_schema.columns
        where table_schema = 'public'
          and table_name   = 'profiles'
          and column_name  = 'goal'
    ) then
        alter table public.profiles
            add column goal text not null default 'get-hired';
    end if;

    -- onboarding_completed
    if not exists (
        select 1 from information_schema.columns
        where table_schema = 'public'
          and table_name   = 'profiles'
          and column_name  = 'onboarding_completed'
    ) then
        alter table public.profiles
            add column onboarding_completed boolean not null default false;
    end if;
end $$;
