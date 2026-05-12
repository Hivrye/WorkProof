-- =============================================================================
-- WorkProof — Seed Data
-- supabase/seed.sql
--
-- Populates tracks and challenges so the app has real content from day one.
-- Run AFTER the migration:
--   supabase db reset   (applies migrations then seed automatically)
--   — or —
--   paste into Supabase SQL Editor after running the migration.
--
-- This data mirrors the mock data in src/data/tracks.ts and src/data/challenges.ts.
-- Add new tracks/challenges here as the platform grows.
-- =============================================================================

-- ─── Tracks ──────────────────────────────────────────────────────────────────

insert into public.tracks (id, name, description, icon, challenge_count, estimated_weeks, skill_categories, color)
values
    (
        'frontend',
        'Front-End Developer',
        'Build responsive, accessible interfaces that users actually love. Prove your skills across HTML, CSS, JavaScript, and modern frameworks.',
        'Code2', 12, 6,
        array['HTML/CSS', 'JavaScript', 'React', 'Accessibility', 'Performance'],
        'blue'
    ),
    (
        'ui-design',
        'UI Designer',
        'Create polished, user-centered interfaces from wireframes to high-fidelity prototypes. Master visual hierarchy and interaction design.',
        'Palette', 9, 5,
        array['Visual Design', 'Figma', 'Typography', 'Color Theory', 'Prototyping'],
        'violet'
    ),
    (
        'data-analyst',
        'Data Analyst',
        'Turn raw data into actionable insight. Prove you can clean datasets, identify trends, and communicate findings clearly.',
        'BarChart3', 10, 5,
        array['SQL', 'Python', 'Visualization', 'Statistics', 'Communication'],
        'cyan'
    ),
    (
        'customer-support',
        'Customer Support Specialist',
        'De-escalate, empathize, and resolve. Demonstrate your ability to handle difficult situations with professionalism and clarity.',
        'Headphones', 8, 3,
        array['Written Communication', 'Empathy', 'Problem Solving', 'CRM', 'De-escalation'],
        'emerald'
    ),
    (
        'social-media',
        'Social Media Manager',
        'Craft content strategies, write punchy captions, and build brand voice across platforms. Show you can grow and engage an audience.',
        'Megaphone', 8, 4,
        array['Content Strategy', 'Copywriting', 'Analytics', 'Brand Voice', 'Scheduling'],
        'pink'
    ),
    (
        'video-editor',
        'Video Editor',
        'Edit raw footage into compelling content. Demonstrate pacing, storytelling, and technical post-production skills.',
        'Film', 6, 4,
        array['Editing', 'Color Grading', 'Motion Graphics', 'Storytelling', 'Audio'],
        'orange'
    ),
    (
        'sales-dev',
        'Sales Development Rep',
        'Write cold outreach that actually lands. Prove you can qualify leads, handle objections, and move prospects through a pipeline.',
        'TrendingUp', 7, 3,
        array['Prospecting', 'Cold Email', 'Objection Handling', 'CRM', 'Communication'],
        'amber'
    )
on conflict (id) do update set
    name             = excluded.name,
    description      = excluded.description,
    icon             = excluded.icon,
    challenge_count  = excluded.challenge_count,
    estimated_weeks  = excluded.estimated_weeks,
    skill_categories = excluded.skill_categories,
    color            = excluded.color;

-- ─── Front-End Challenges ─────────────────────────────────────────────────────

insert into public.challenges (
    id, title, track_id, track, difficulty, estimated_time,
    description, scenario, task_brief,
    deliverables, skills_tested, evaluation_criteria, resources,
    ai_disclosure_required, proof_value, tags
)
values
    (
        'fe-001',
        'Build a SaaS Pricing Section',
        'frontend', 'Front-End Developer', 'intermediate', '2–4 hours',
        'Design and build a responsive three-tier pricing section that helps users clearly compare plans and take action.',
        'A early-stage SaaS startup needs a pricing section for their landing page. The design team has provided a rough layout but no code. The section needs to work across devices, meet accessibility standards, and highlight a recommended plan visually.',
        'Create a responsive pricing section with three subscription tiers. The middle tier should be visually emphasized as the recommended option. Include clear CTAs, feature comparison, and a mobile-first layout.',
        array[
            'Live preview link (CodePen, StackBlitz, or deployed URL)',
            'GitHub repository or code link',
            'Written explanation of design decisions (150–300 words)',
            'Accessibility notes',
            'AI usage disclosure'
        ],
        array['HTML/CSS structure', 'Responsive design', 'UI hierarchy', 'Accessibility', 'Component thinking'],
        '[
            {"name":"Layout Quality","description":"Cards are well-structured, aligned, and visually clear","weight":20},
            {"name":"Responsiveness","description":"Works correctly on mobile, tablet, and desktop","weight":20},
            {"name":"Accessibility","description":"Color contrast, semantic HTML, keyboard navigable","weight":20},
            {"name":"Code Clarity","description":"Clean, readable, and organized code","weight":20},
            {"name":"Explanation Quality","description":"Thoughtful written walkthrough of decisions made","weight":20}
        ]'::jsonb,
        '[
            {"title":"MDN Flexbox Guide","url":"https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox","type":"reference"},
            {"title":"WebAIM Contrast Checker","url":"https://webaim.org/resources/contrastchecker/","type":"tool"},
            {"title":"Pricing UI Examples","url":"https://ui.shadcn.com/blocks","type":"reference"}
        ]'::jsonb,
        true, 180,
        array['CSS', 'Responsive', 'UI', 'Accessibility']
    ),
    (
        'fe-002',
        'Create a Responsive Dashboard Card System',
        'frontend', 'Front-End Developer', 'intermediate', '3–5 hours',
        'Build a modular card system for a SaaS analytics dashboard using reusable components and a responsive grid layout.',
        'A startup analytics platform needs a dashboard card system that shows key metrics. The system needs to be modular, visually consistent, and easy to extend.',
        'Build a grid of dashboard stat cards. Each card should show a metric name, a value, a percentage change indicator (positive or negative), and a trend icon.',
        array[
            'Live preview link',
            'GitHub repository link',
            'Explanation of component architecture decisions',
            'AI usage disclosure'
        ],
        array['Component architecture', 'CSS Grid', 'Responsive layout', 'Visual design', 'Code reusability'],
        '[
            {"name":"Component Design","description":"Cards are modular, reusable, and self-contained","weight":25},
            {"name":"Visual Quality","description":"Cards look polished and professional","weight":25},
            {"name":"Responsiveness","description":"Grid adapts correctly across screen sizes","weight":25},
            {"name":"Code Quality","description":"Code is clean, commented where needed, easy to extend","weight":25}
        ]'::jsonb,
        '[{"title":"CSS Grid Guide","url":"https://css-tricks.com/snippets/css/complete-guide-grid/","type":"reference"}]'::jsonb,
        true, 200,
        array['CSS Grid', 'Components', 'Dashboard', 'UI']
    ),
    (
        'fe-003',
        'Fix Accessibility Issues in a Landing Page',
        'frontend', 'Front-End Developer', 'beginner', '1–2 hours',
        'Audit a provided landing page for accessibility issues and submit a corrected version with documented fixes.',
        'A client''s landing page has received complaints from users who use screen readers or keyboard navigation. You have been brought in to audit the page and fix what you find.',
        'Review a provided HTML page for accessibility problems. Document every issue you find with a description and severity level. Then fix the issues and explain what you changed and why.',
        array[
            'Accessibility audit document listing issues with severity',
            'Fixed code',
            'Written explanation of changes',
            'AI usage disclosure'
        ],
        array['Accessibility auditing', 'Semantic HTML', 'ARIA attributes', 'Keyboard navigation', 'Color contrast'],
        '[
            {"name":"Issue Coverage","description":"Found and addressed the key accessibility failures","weight":30},
            {"name":"Fix Quality","description":"Fixes actually solve the issues correctly","weight":35},
            {"name":"Explanation","description":"Clearly explains what was wrong and why each fix matters","weight":35}
        ]'::jsonb,
        '[
            {"title":"WCAG 2.1 Overview","url":"https://www.w3.org/WAI/WCAG21/quickref/","type":"reference"},
            {"title":"Lighthouse Accessibility","url":"https://developer.chrome.com/docs/lighthouse/accessibility/","type":"tool"}
        ]'::jsonb,
        false, 120,
        array['Accessibility', 'WCAG', 'HTML', 'Audit']
    ),
    (
        'fe-004',
        'Build a Searchable FAQ Component',
        'frontend', 'Front-End Developer', 'beginner', '2–3 hours',
        'Build an interactive FAQ component with real-time search filtering and smooth accordion expand/collapse animations.',
        'A SaaS company wants to reduce support tickets by adding a searchable FAQ section to their help page. Users should be able to type a question and see matching results instantly.',
        'Create a FAQ component with at least 8 realistic question/answer pairs. Add a search input that filters results in real-time. Use smooth CSS transitions for the accordion expand/collapse.',
        array[
            'Live preview link',
            'Code link',
            'Brief written explanation',
            'AI usage disclosure'
        ],
        array['JavaScript filtering', 'DOM manipulation', 'CSS animations', 'Semantic HTML', 'UX patterns'],
        '[
            {"name":"Search Functionality","description":"Search filters correctly and updates in real time","weight":30},
            {"name":"Animations","description":"Accordion transitions are smooth and well-timed","weight":20},
            {"name":"Accessibility","description":"Works with keyboard, has proper ARIA roles","weight":25},
            {"name":"Code Quality","description":"Clean and easy to read","weight":25}
        ]'::jsonb,
        '[]'::jsonb,
        true, 100,
        array['JavaScript', 'UX', 'Animation', 'Search']
    )
on conflict (id) do update set
    title                  = excluded.title,
    track_id               = excluded.track_id,
    track                  = excluded.track,
    difficulty             = excluded.difficulty,
    estimated_time         = excluded.estimated_time,
    description            = excluded.description,
    scenario               = excluded.scenario,
    task_brief             = excluded.task_brief,
    deliverables           = excluded.deliverables,
    skills_tested          = excluded.skills_tested,
    evaluation_criteria    = excluded.evaluation_criteria,
    resources              = excluded.resources,
    ai_disclosure_required = excluded.ai_disclosure_required,
    proof_value            = excluded.proof_value,
    tags                   = excluded.tags;
