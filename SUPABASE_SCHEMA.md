# WorkProof — Supabase Schema Plan

> **Status:** Design only. No real Supabase project required yet.
> TypeScript interfaces live in `src/types/database.ts`.
> Client placeholder and helper functions live in `src/lib/supabase.ts`.

---

## Activation Checklist

- [ ] Run `npm install @supabase/supabase-js`
- [ ] Create a Supabase project at [supabase.com](https://supabase.com)
- [ ] Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`
- [ ] Run the migration SQL below against your project (via Supabase Dashboard > SQL Editor)
- [ ] Enable Row Level Security (RLS) on every table (already included in SQL)
- [ ] Configure Auth providers (Email, optionally GitHub OAuth)
- [ ] Uncomment the real `createClient` call in `src/lib/supabase.ts`
- [ ] Replace `storage.get / storage.set` calls in stores with Supabase queries

---

## Architecture Overview

```
auth.users (Supabase managed)
    │
    ├── public.users          — app-level user metadata, 1-to-1 with auth.users
    │       │
    │       ├── public.profiles          — public-facing CV / profile
    │       ├── public.submissions       — challenge work submitted
    │       ├── public.proof_scores      — computed aggregate score (1-to-1)
    │       ├── public.activity_events   — immutable audit trail
    │       └── public.employer_reviews  — employers viewing / rating candidates
    │
    ├── public.organizations  — employer / company accounts
    │       │
    │       └── public.employer_reviews  — reviews created by org members
    │
    ├── public.tracks         — skill track definitions (content, admin-managed)
    │       │
    │       └── public.challenges        — individual challenge definitions
    │               │
    │               └── public.submissions  — user attempts
    │
    └── public.employer_reviews  — cross-references users + organizations + submissions
```

---

## Tables

### `public.users`

Shadow table of `auth.users`. Created automatically by a database trigger the moment a user signs up.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK, references `auth.users(id)` ON DELETE CASCADE |
| `email` | `text` | NOT NULL, unique — synced from auth.users |
| `created_at` | `timestamptz` | DEFAULT `now()` |
| `updated_at` | `timestamptz` | DEFAULT `now()`, updated by trigger |

**RLS:**
- `SELECT`: user can read own row; service role reads all
- `UPDATE`: user can update own row

**Trigger:** `on_auth_user_created` — after insert on `auth.users` → insert into `public.users` AND create a default `public.profiles` row.

---

### `public.profiles`

Public-facing candidate profile. 1-to-1 with `users`. The `username` is the URL slug used at `/profile/[username]`.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK = `users.id`, NOT a separate sequence |
| `username` | `text` | NOT NULL, UNIQUE — URL slug, e.g. `alex-carter` |
| `name` | `text` | NOT NULL |
| `target_role` | `text` | e.g. `"Frontend Engineer"` |
| `bio` | `text` | nullable |
| `skills` | `text[]` | ordered array of skill labels |
| `portfolio_link` | `text` | nullable |
| `github_link` | `text` | nullable |
| `linkedin_link` | `text` | nullable |
| `avatar_url` | `text` | nullable — Supabase Storage URL |
| `is_public` | `boolean` | DEFAULT `false` — controls public visibility |
| `ai_transparency_preference` | `text` | enum: `none \| brainstorm \| suggestions \| heavy \| explained` |
| `location` | `text` | nullable |
| `availability` | `text` | nullable, e.g. `"Immediately available"` |
| `open_to_remote` | `boolean` | DEFAULT `false` |
| `selected_track_id` | `text` | nullable, references `tracks(id)` |
| `created_at` | `timestamptz` | DEFAULT `now()` |
| `updated_at` | `timestamptz` | updated by trigger |

**RLS:**
- `SELECT`: anyone can read rows where `is_public = true`; user can read own row regardless
- `UPDATE`: user can update own row only
- `INSERT`: only via trigger (users cannot self-insert)

**Connects to:**
- `GET /profile/[username]` → `profiles WHERE username = ? AND is_public = true`
- `settings/page.tsx` → `profiles WHERE id = auth.uid()`

---

### `public.organizations`

Employer / company accounts. One employer user can belong to multiple organizations (via a junction table, future work).

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK, generated |
| `name` | `text` | NOT NULL |
| `slug` | `text` | NOT NULL, UNIQUE — URL-safe identifier |
| `website` | `text` | nullable |
| `logo_url` | `text` | nullable — Supabase Storage URL |
| `description` | `text` | nullable |
| `verified` | `boolean` | DEFAULT `false` — manually set by WorkProof team |
| `created_at` | `timestamptz` | DEFAULT `now()` |
| `updated_at` | `timestamptz` | updated by trigger |

**RLS:**
- `SELECT`: anyone can read verified organizations; admins read all
- `INSERT / UPDATE`: only service role or organization admin role (future)

**Connects to:**
- `employer_reviews.organization_id` — track which organization made the review
- Future: `organization_members` junction table for multi-user org accounts

---

### `public.tracks`

Skill track definitions (Frontend, Backend, Product, Data, etc.). Content-managed; candidates pick one track.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `text` | PK, human-readable slug — e.g. `track_frontend` |
| `name` | `text` | NOT NULL — e.g. `"Frontend Engineering"` |
| `description` | `text` | NOT NULL |
| `icon` | `text` | lucide-react icon name |
| `challenge_count` | `int4` | denormalized — updated by trigger on challenges insert/delete |
| `estimated_weeks` | `int4` | NOT NULL |
| `skill_categories` | `text[]` | e.g. `["Accessibility", "Performance", "CSS"]` |
| `color` | `text` | Tailwind color label, e.g. `"blue"` |
| `is_active` | `boolean` | DEFAULT `true` — inactive tracks hidden from UI |
| `created_at` | `timestamptz` | DEFAULT `now()` |

**RLS:**
- `SELECT`: anyone can read active tracks
- `INSERT / UPDATE / DELETE`: service role only

**Connects to:**
- `profiles.selected_track_id`
- `challenges.track_id`
- `/tracks` listing page (future)

---

### `public.challenges`

Individual challenge definitions. Content managed by WorkProof team. Candidates complete these to build their Proof Score.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `text` | PK, human-readable slug — e.g. `ch_accessibility_audit` |
| `track_id` | `text` | NOT NULL, references `tracks(id)` |
| `title` | `text` | NOT NULL |
| `description` | `text` | NOT NULL |
| `scenario` | `text` | Real-world context framing the challenge |
| `task_brief` | `text` | Specific instructions |
| `deliverables` | `jsonb` | `string[]` — list of required outputs |
| `skills_tested` | `text[]` | e.g. `["Accessibility", "React"]` |
| `evaluation_criteria` | `jsonb` | `{ name, description, weight }[]` — weights sum to 1 |
| `resources` | `jsonb` | `{ title, url, type }[]` |
| `difficulty` | `text` | enum: `beginner \| intermediate \| advanced` |
| `estimated_time` | `text` | human-readable, e.g. `"60–90 min"` |
| `proof_value` | `int4` | DEFAULT `10` — points added to proof score |
| `ai_disclosure_required` | `boolean` | DEFAULT `true` |
| `tags` | `text[]` | e.g. `["accessibility", "wcag", "audit"]` |
| `is_active` | `boolean` | DEFAULT `true` |
| `created_at` | `timestamptz` | DEFAULT `now()` |
| `updated_at` | `timestamptz` | updated by trigger |

**RLS:**
- `SELECT`: anyone can read active challenges
- `INSERT / UPDATE / DELETE`: service role only

**Connects to:**
- `submissions.challenge_id`
- `/challenges/[id]` challenge detail page
- Dashboard challenge list

---

### `public.submissions`

A user's work on a specific challenge. One row per `(user_id, challenge_id)` pair — re-attempts overwrite via upsert.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK |
| `user_id` | `uuid` | NOT NULL, references `users(id)` ON DELETE CASCADE |
| `challenge_id` | `text` | NOT NULL, references `challenges(id)` |
| `status` | `text` | enum: `not_started \| in_progress \| completed \| abandoned` |
| `score` | `int4` | nullable — 0–100; null until graded |
| `live_link` | `text` | nullable |
| `repo_link` | `text` | nullable |
| `project_title` | `text` | NOT NULL |
| `explanation` | `text` | What the candidate built and why |
| `problem_statement` | `text` | How they understood the problem |
| `design_decisions` | `text` | Key tradeoffs made |
| `improvements` | `text` | What they'd do differently |
| `ai_disclosure` | `text` | enum: `none \| brainstorm \| suggestions \| heavy \| explained` |
| `ai_description` | `text` | nullable — candidate's own words on AI usage |
| `process_steps` | `jsonb` | `{ id, title, description, timestamp }[]` |
| `completion_time_minutes` | `int4` | nullable |
| `submitted_at` | `timestamptz` | nullable — null while in_progress |
| `created_at` | `timestamptz` | DEFAULT `now()` |
| `updated_at` | `timestamptz` | updated by trigger |

**Constraints:**
- `UNIQUE (user_id, challenge_id)` — one submission per candidate per challenge

**RLS:**
- `SELECT`: user can read own rows; employers can read rows of public profiles
- `INSERT / UPDATE`: user can modify own rows only; score updates require service role
- `DELETE`: user can delete own in-progress rows; completed rows are soft-deleted only

**Connects to:**
- `proof_scores` — score recomputed after every submission update
- `activity_events` — auto-created event on status change (via trigger)
- `employer_reviews.submission_id` — employer pinpoints specific work
- `/profile/[username]` — displays completed submissions

---

### `public.proof_scores`

Aggregate score for a user. Computed server-side after each graded submission. 1-to-1 with users.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK |
| `user_id` | `uuid` | NOT NULL, references `users(id)`, UNIQUE |
| `total` | `numeric(5,2)` | Weighted composite score 0–100 |
| `max_total` | `numeric(5,2)` | Maximum achievable given current challenges |
| `work_quality` | `numeric(5,2)` | Average challenge score 0–100 |
| `process_clarity` | `numeric(5,2)` | Process log completeness 0–100 |
| `skill_coverage` | `numeric(5,2)` | Breadth across skill categories 0–100 |
| `ai_transparency` | `numeric(5,2)` | Disclosure consistency 0–100 |
| `consistency` | `numeric(5,2)` | Recency-weighted regularity 0–100 |
| `challenge_count` | `int4` | Total completed challenges |
| `computed_at` | `timestamptz` | When this row was last recalculated |
| `created_at` | `timestamptz` | DEFAULT `now()` |
| `updated_at` | `timestamptz` | updated by trigger |

**RLS:**
- `SELECT`: anyone can read rows where the linked `profiles.is_public = true`; user reads own row
- `INSERT / UPDATE`: service role only (computed by Edge Function or server action)

**Score computation formula:**
```
total = (work_quality × 0.35)
      + (process_clarity × 0.25)
      + (skill_coverage × 0.20)
      + (ai_transparency × 0.10)
      + (consistency × 0.10)
```

**Connects to:**
- `/profile/[username]` — hero stat strip
- Dashboard sidebar score breakdown
- Employer search / filter (future)

---

### `public.activity_events`

Immutable append-only audit trail of user actions. Used to power the activity feed on the dashboard and the public timeline on the profile page.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK |
| `user_id` | `uuid` | NOT NULL, references `users(id)` ON DELETE CASCADE |
| `type` | `text` | enum: `submission \| feedback \| badge \| profile \| challenge \| employer_view` |
| `title` | `text` | NOT NULL — short human-readable title |
| `description` | `text` | NOT NULL — longer description |
| `metadata` | `jsonb` | nullable — arbitrary key/value pairs (e.g. `{ score: 92, challenge_id: "..." }`) |
| `created_at` | `timestamptz` | DEFAULT `now()` — immutable once set |

**Constraints:**
- No `updated_at` — rows are never updated
- No `DELETE` permission for users — only service role can delete (data retention policy)

**RLS:**
- `SELECT`: user can read own events; employers can read events of public profiles
- `INSERT`: user can insert own events; service role inserts automated events
- `UPDATE / DELETE`: service role only

**Connects to:**
- Dashboard `ActivityFeed` component
- `/profile/[username]` — public timeline (filtered to non-sensitive event types)
- Employer profile view triggers an `employer_view` event on the candidate's feed

---

### `public.employer_reviews`

Tracks employer interactions with candidate profiles. Created when an employer views, rates, or takes action on a candidate.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK |
| `employer_user_id` | `uuid` | NOT NULL, references `users(id)` — the employer |
| `candidate_user_id` | `uuid` | NOT NULL, references `users(id)` — the candidate |
| `organization_id` | `uuid` | nullable, references `organizations(id)` |
| `submission_id` | `uuid` | nullable, references `submissions(id)` |
| `rating` | `int2` | nullable — 1–5 stars; null until rated |
| `notes` | `text` | nullable — private employer notes (NOT visible to candidate) |
| `status` | `text` | enum: `pending \| viewed \| contacted \| passed` |
| `viewed_at` | `timestamptz` | nullable — when employer first viewed the profile |
| `created_at` | `timestamptz` | DEFAULT `now()` |
| `updated_at` | `timestamptz` | updated by trigger |

**Constraints:**
- `UNIQUE (employer_user_id, candidate_user_id)` — one review record per employer/candidate pair (updated on re-view)

**RLS:**
- `SELECT`: employer can read own rows; candidate can read rows where `candidate_user_id = auth.uid()`
- `INSERT`: employer can insert own rows
- `UPDATE`: employer can update own rows (status, rating, notes); service role can update all

**Connects to:**
- `activity_events` — auto-inserts an `employer_view` event for the candidate (via trigger)
- Future: `/dashboard/employer-views` — candidate sees who viewed their profile (without revealing employer identity unless contacted)

---

## Key Relationships Summary

| From | Column | To | Cardinality |
|------|--------|----|-------------|
| `users` | `id` | `auth.users(id)` | 1-to-1 |
| `profiles` | `id` | `users(id)` | 1-to-1 |
| `profiles` | `selected_track_id` | `tracks(id)` | many-to-1 |
| `challenges` | `track_id` | `tracks(id)` | many-to-1 |
| `submissions` | `user_id` | `users(id)` | many-to-1 |
| `submissions` | `challenge_id` | `challenges(id)` | many-to-1 |
| `proof_scores` | `user_id` | `users(id)` | 1-to-1 |
| `activity_events` | `user_id` | `users(id)` | many-to-1 |
| `employer_reviews` | `employer_user_id` | `users(id)` | many-to-1 |
| `employer_reviews` | `candidate_user_id` | `users(id)` | many-to-1 |
| `employer_reviews` | `organization_id` | `organizations(id)` | many-to-1 (nullable) |
| `employer_reviews` | `submission_id` | `submissions(id)` | many-to-1 (nullable) |

---

## Triggers to Implement

| Trigger Name | On | Action |
|--------------|----|--------|
| `on_auth_user_created` | `AFTER INSERT ON auth.users` | Insert into `public.users` + create default `public.profiles` row |
| `update_updated_at` | `BEFORE UPDATE ON <each table>` | Set `updated_at = now()` |
| `on_submission_completed` | `AFTER UPDATE ON submissions` (status → completed) | Recompute `proof_scores`; insert `activity_events` row |
| `sync_track_challenge_count` | `AFTER INSERT/DELETE ON challenges` | Update `tracks.challenge_count` |
| `on_employer_review_created` | `AFTER INSERT ON employer_reviews` | Insert `employer_view` activity event for candidate |

---

## Enums to Create

```sql
CREATE TYPE difficulty AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE challenge_status AS ENUM ('not_started', 'in_progress', 'completed', 'abandoned');
CREATE TYPE ai_disclosure_level AS ENUM ('none', 'brainstorm', 'suggestions', 'heavy', 'explained');
CREATE TYPE activity_event_type AS ENUM ('submission', 'feedback', 'badge', 'profile', 'challenge', 'employer_view');
CREATE TYPE employer_review_status AS ENUM ('pending', 'viewed', 'contacted', 'passed');
```

---

## Row Level Security Policy Notes

All tables must have `ALTER TABLE <name> ENABLE ROW LEVEL SECURITY;` applied.

Default deny: no access unless explicitly granted by a policy. Key policies:

```sql
-- profiles: public read for public profiles
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (is_public = true OR auth.uid() = id);

-- submissions: candidates read own; employers read public candidates
CREATE POLICY "Candidates read own submissions"
ON public.submissions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Employers read submissions of public profiles"
ON public.submissions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = submissions.user_id
    AND profiles.is_public = true
  )
);

-- proof_scores: public read for public profiles
CREATE POLICY "Public proof scores are viewable"
ON public.proof_scores FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = proof_scores.user_id
    AND profiles.is_public = true
  )
  OR auth.uid() = user_id
);
```

---

## Storage Buckets (Supabase Storage)

| Bucket | Public | Purpose |
|--------|--------|---------|
| `avatars` | Yes | Profile avatar images — `avatars/{user_id}.{ext}` |
| `org-logos` | Yes | Organization logo images |
| `exports` | No | Generated PDF exports — pre-signed URLs, 1hr TTL |

---

## Migration Path from localStorage

| localStorage key | Supabase table | Column(s) |
|------------------|---------------|-----------|
| `workproof:user-profile:v1` | `profiles` | all profile columns |
| `workproof:onboarding:v1` | `profiles` | `selected_track_id` + `ai_transparency_preference` |
| `workproof:submissions:v1` | `submissions` | all submission columns |
| `workproof:dashboard-progress:v1` | `submissions` | `status` per `challenge_id` |

Replace each `storage.get(STORAGE_KEYS.X)` call in the corresponding store with the Supabase query shown in `src/lib/supabase.ts`.
