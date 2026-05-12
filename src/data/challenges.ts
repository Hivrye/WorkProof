import type { Challenge } from "@/types";

export const challenges: Challenge[] = [
    // Front-End Developer
    {
        id: "fe-001",
        title: "Build a SaaS Pricing Section",
        trackId: "frontend",
        track: "Front-End Developer",
        difficulty: "Intermediate",
        estimatedTime: "2–4 hours",
        description:
            "Design and build a responsive three-tier pricing section that helps users clearly compare plans and take action.",
        scenario:
            "A early-stage SaaS startup needs a pricing section for their landing page. The design team has provided a rough layout but no code. The section needs to work across devices, meet accessibility standards, and highlight a recommended plan visually.",
        taskBrief:
            "Create a responsive pricing section with three subscription tiers. The middle tier should be visually emphasized as the recommended option. Include clear CTAs, feature comparison, and a mobile-first layout. You will submit a live preview link, your code, and a written explanation of your decisions.",
        deliverables: [
            "Live preview link (CodePen, StackBlitz, or deployed URL)",
            "GitHub repository or code link",
            "Written explanation of design decisions (150–300 words)",
            "Accessibility notes",
            "AI usage disclosure",
        ],
        skillsTested: ["HTML/CSS structure", "Responsive design", "UI hierarchy", "Accessibility", "Component thinking"],
        evaluationCriteria: [
            { name: "Layout Quality", description: "Cards are well-structured, aligned, and visually clear", weight: 20 },
            { name: "Responsiveness", description: "Works correctly on mobile, tablet, and desktop", weight: 20 },
            { name: "Accessibility", description: "Color contrast, semantic HTML, keyboard navigable", weight: 20 },
            { name: "Code Clarity", description: "Clean, readable, and organized code", weight: 20 },
            { name: "Explanation Quality", description: "Thoughtful written walkthrough of decisions made", weight: 20 },
        ],
        resources: [
            { title: "MDN Flexbox Guide", url: "https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox", type: "reference" },
            { title: "WebAIM Contrast Checker", url: "https://webaim.org/resources/contrastchecker/", type: "tool" },
            { title: "Pricing UI Examples", url: "https://ui.shadcn.com/blocks", type: "reference" },
        ],
        aiDisclosureRequired: true,
        status: "in-progress",
        score: undefined,
        proofValue: 180,
        tags: ["CSS", "Responsive", "UI", "Accessibility"],
    },
    {
        id: "fe-002",
        title: "Create a Responsive Dashboard Card System",
        trackId: "frontend",
        track: "Front-End Developer",
        difficulty: "Intermediate",
        estimatedTime: "3–5 hours",
        description:
            "Build a modular card system for a SaaS analytics dashboard using reusable components and a responsive grid layout.",
        scenario:
            "A startup analytics platform needs a dashboard card system that shows key metrics. The system needs to be modular, visually consistent, and easy to extend. Cards should display numbers, trends, and labels.",
        taskBrief:
            "Build a grid of dashboard stat cards. Each card should show a metric name, a value, a percentage change indicator (positive or negative), and a trend icon. The grid should be responsive and all components reusable.",
        deliverables: [
            "Live preview link",
            "GitHub repository link",
            "Explanation of component architecture decisions",
            "AI usage disclosure",
        ],
        skillsTested: ["Component architecture", "CSS Grid", "Responsive layout", "Visual design", "Code reusability"],
        evaluationCriteria: [
            { name: "Component Design", description: "Cards are modular, reusable, and self-contained", weight: 25 },
            { name: "Visual Quality", description: "Cards look polished and professional", weight: 25 },
            { name: "Responsiveness", description: "Grid adapts correctly across screen sizes", weight: 25 },
            { name: "Code Quality", description: "Code is clean, commented where needed, easy to extend", weight: 25 },
        ],
        resources: [
            { title: "CSS Grid Guide", url: "https://css-tricks.com/snippets/css/complete-guide-grid/", type: "reference" },
        ],
        aiDisclosureRequired: true,
        status: "completed",
        score: 88,
        proofValue: 200,
        tags: ["CSS Grid", "Components", "Dashboard", "UI"],
    },
    {
        id: "fe-003",
        title: "Fix Accessibility Issues in a Landing Page",
        trackId: "frontend",
        track: "Front-End Developer",
        difficulty: "Beginner",
        estimatedTime: "1–2 hours",
        description:
            "Audit a provided landing page for accessibility issues and submit a corrected version with documented fixes.",
        scenario:
            "A client's landing page has received complaints from users who use screen readers or keyboard navigation. You have been brought in to audit the page and fix what you find.",
        taskBrief:
            "Review a provided HTML page for accessibility problems. Document every issue you find with a description and severity level. Then fix the issues and explain what you changed and why.",
        deliverables: [
            "Accessibility audit document listing issues with severity",
            "Fixed code",
            "Written explanation of changes",
            "AI usage disclosure",
        ],
        skillsTested: ["Accessibility auditing", "Semantic HTML", "ARIA attributes", "Keyboard navigation", "Color contrast"],
        evaluationCriteria: [
            { name: "Issue Coverage", description: "Found and addressed the key accessibility failures", weight: 30 },
            { name: "Fix Quality", description: "Fixes actually solve the issues correctly", weight: 35 },
            { name: "Explanation", description: "Clearly explains what was wrong and why each fix matters", weight: 35 },
        ],
        resources: [
            { title: "WCAG 2.1 Overview", url: "https://www.w3.org/WAI/WCAG21/quickref/", type: "reference" },
            { title: "Lighthouse Accessibility", url: "https://developer.chrome.com/docs/lighthouse/accessibility/", type: "tool" },
        ],
        aiDisclosureRequired: false,
        status: "completed",
        score: 92,
        proofValue: 120,
        tags: ["Accessibility", "WCAG", "HTML", "Audit"],
    },
    {
        id: "fe-004",
        title: "Build a Searchable FAQ Component",
        trackId: "frontend",
        track: "Front-End Developer",
        difficulty: "Beginner",
        estimatedTime: "2–3 hours",
        description:
            "Build an interactive FAQ component with real-time search filtering and smooth accordion expand/collapse animations.",
        scenario:
            "A SaaS company wants to reduce support tickets by adding a searchable FAQ section to their help page. Users should be able to type a question and see matching results instantly.",
        taskBrief:
            "Create a FAQ component with at least 8 realistic question/answer pairs. Add a search input that filters results in real-time. Use smooth CSS transitions for the accordion expand/collapse. Make it keyboard accessible.",
        deliverables: [
            "Live preview link",
            "Code link",
            "Brief written explanation",
            "AI usage disclosure",
        ],
        skillsTested: ["JavaScript filtering", "DOM manipulation", "CSS animations", "Semantic HTML", "UX patterns"],
        evaluationCriteria: [
            { name: "Search Functionality", description: "Search filters correctly and updates in real time", weight: 30 },
            { name: "Animations", description: "Accordion transitions are smooth and well-timed", weight: 20 },
            { name: "Accessibility", description: "Works with keyboard, has proper ARIA roles", weight: 25 },
            { name: "Code Quality", description: "Clean and easy to read", weight: 25 },
        ],
        resources: [],
        aiDisclosureRequired: true,
        status: "not-started",
        proofValue: 100,
        tags: ["JavaScript", "UX", "Animation", "Search"],
    },
    // UI Designer
    {
        id: "uid-001",
        title: "Redesign a Checkout Flow",
        trackId: "ui-design",
        track: "UI Designer",
        difficulty: "Intermediate",
        estimatedTime: "4–6 hours",
        description:
            "Redesign a provided broken checkout flow to reduce friction, improve clarity, and increase conversion intent.",
        scenario:
            "An e-commerce client has shared a checkout flow with high drop-off rates at step 2. User interviews suggest the layout is confusing and trust signals are missing. You need to redesign it.",
        taskBrief:
            "Review the provided checkout flow screenshots and redesign the 3-step checkout experience. Focus on reducing cognitive load, adding trust signals, improving form UX, and making the progress clear. Deliver annotated mockups and a written rationale.",
        deliverables: [
            "High-fidelity mockups (Figma, Framer, or similar)",
            "Annotated design explaining decisions",
            "Before/after comparison",
            "AI usage disclosure",
        ],
        skillsTested: ["UX analysis", "Visual design", "Form design", "Trust signals", "Conversion optimization"],
        evaluationCriteria: [
            { name: "Problem Identification", description: "Correctly diagnoses the UX problems in the original", weight: 20 },
            { name: "Visual Quality", description: "New design is polished and professional", weight: 30 },
            { name: "Annotation Quality", description: "Decisions are clearly explained and justified", weight: 25 },
            { name: "UX Improvement", description: "Redesign meaningfully improves the flow", weight: 25 },
        ],
        resources: [],
        aiDisclosureRequired: true,
        status: "not-started",
        proofValue: 220,
        tags: ["UX", "Checkout", "Conversion", "Forms"],
    },
    {
        id: "uid-002",
        title: "Create a Mobile Onboarding Flow",
        trackId: "ui-design",
        track: "UI Designer",
        difficulty: "Intermediate",
        estimatedTime: "3–5 hours",
        description:
            "Design a 4–6 screen mobile onboarding flow for a productivity app that helps new users understand the core value quickly.",
        scenario:
            "A mobile productivity app is seeing poor Day 1 retention. Users say they don't understand what the app does or where to start. You've been hired to design a better onboarding flow.",
        taskBrief:
            "Design a mobile onboarding experience of 4–6 screens that introduces the app's core value, collects minimal setup preferences, and guides users to their first meaningful action. Focus on clarity, delight, and minimal friction.",
        deliverables: [
            "High-fidelity mobile screens",
            "Design rationale document",
            "AI usage disclosure",
        ],
        skillsTested: ["Mobile design", "Onboarding UX", "Visual hierarchy", "Copywriting", "User journey"],
        evaluationCriteria: [
            { name: "Clarity", description: "Each screen has a single clear purpose", weight: 25 },
            { name: "Visual Design", description: "Screens are polished and consistent", weight: 30 },
            { name: "Flow Logic", description: "The sequence makes sense for a new user", weight: 25 },
            { name: "Copy Quality", description: "In-screen text is concise and motivating", weight: 20 },
        ],
        resources: [],
        aiDisclosureRequired: true,
        status: "not-started",
        proofValue: 200,
        tags: ["Mobile", "Onboarding", "UX", "Retention"],
    },
    {
        id: "uid-003",
        title: "Design a Creator Portfolio Homepage",
        trackId: "ui-design",
        track: "UI Designer",
        difficulty: "Advanced",
        estimatedTime: "5–8 hours",
        description:
            "Design a bold, differentiated portfolio homepage for a creative professional that stands out and converts visitors into opportunities.",
        scenario:
            "A freelance illustrator wants a homepage that feels as creative as their work. They have a strong visual identity but no web presence. They want it to feel premium and personal while clearly showing what they do.",
        taskBrief:
            "Design a full homepage layout that includes a hero, a portfolio preview section, a brief about section, and a contact CTA. The design should feel unique — not like a generic template.",
        deliverables: [
            "Full homepage mockup (desktop + mobile)",
            "Design system snippet (colors, type scale, spacing)",
            "Written design decisions",
            "AI usage disclosure",
        ],
        skillsTested: ["Creative direction", "Layout design", "Visual identity", "Typography", "Design storytelling"],
        evaluationCriteria: [
            { name: "Visual Distinction", description: "Design feels original and memorable", weight: 30 },
            { name: "Layout & Hierarchy", description: "Content is organized and easy to scan", weight: 25 },
            { name: "Desktop + Mobile", description: "Both viewport designs are complete and intentional", weight: 25 },
            { name: "Rationale", description: "Written decisions show strong design thinking", weight: 20 },
        ],
        resources: [],
        aiDisclosureRequired: true,
        status: "not-started",
        proofValue: 280,
        tags: ["Portfolio", "Creative Direction", "Branding", "Homepage"],
    },
    // Data Analyst
    {
        id: "da-001",
        title: "Analyze Monthly Sales Data",
        trackId: "data-analyst",
        track: "Data Analyst",
        difficulty: "Beginner",
        estimatedTime: "2–4 hours",
        description:
            "Explore a provided monthly sales dataset, identify key trends, and write an executive summary with supporting visualizations.",
        scenario:
            "A retail brand has shared 12 months of sales data across 4 product categories. Leadership wants a clear summary of what happened, what drove performance, and where to focus next quarter.",
        taskBrief:
            "Analyze the provided sales dataset. Identify the top-performing categories, the worst month, growth trends, and any anomalies. Present your findings in a structured report with at least 3 supporting charts.",
        deliverables: [
            "Analysis report (PDF or doc)",
            "Charts/visualizations (minimum 3)",
            "1-page executive summary",
            "AI usage disclosure",
        ],
        skillsTested: ["Data cleaning", "Trend analysis", "Visualization", "Executive communication", "Pattern recognition"],
        evaluationCriteria: [
            { name: "Accuracy", description: "Findings are correct and well-supported by the data", weight: 30 },
            { name: "Visualization Quality", description: "Charts are clear, labeled, and appropriate", weight: 25 },
            { name: "Executive Summary", description: "Summary is concise, direct, and actionable", weight: 25 },
            { name: "Insight Depth", description: "Goes beyond surface-level to find meaningful patterns", weight: 20 },
        ],
        resources: [],
        aiDisclosureRequired: true,
        status: "not-started",
        proofValue: 150,
        tags: ["Sales", "Trends", "Visualization", "Excel/Python"],
    },
    {
        id: "da-002",
        title: "Create a Customer Churn Summary",
        trackId: "data-analyst",
        track: "Data Analyst",
        difficulty: "Intermediate",
        estimatedTime: "3–5 hours",
        description:
            "Analyze a churn dataset, identify the top predictors of cancellation, and deliver a recommendation report to a fictional product team.",
        scenario:
            "A SaaS company is losing ~15% of customers per month. Their data team has shared a dataset of churned and retained customers including usage metrics, plan type, and tenure. They need a clear analysis of why people leave.",
        taskBrief:
            "Analyze the churn dataset and find the top 3–5 factors associated with customer cancellation. Build a visual summary and write a recommendation document for the product team explaining what to address first.",
        deliverables: [
            "Analysis file (notebook, spreadsheet, or report)",
            "Visualization deck",
            "Written recommendations",
            "AI usage disclosure",
        ],
        skillsTested: ["Cohort analysis", "Correlation analysis", "Business communication", "Data storytelling", "Recommendations"],
        evaluationCriteria: [
            { name: "Analytical Rigor", description: "Analysis is methodical and evidence-based", weight: 30 },
            { name: "Visual Communication", description: "Charts tell a clear story without needing explanation", weight: 25 },
            { name: "Recommendations", description: "Actionable, prioritized, and justified", weight: 30 },
            { name: "Clarity of Writing", description: "Report is readable for a non-technical audience", weight: 15 },
        ],
        resources: [],
        aiDisclosureRequired: true,
        status: "not-started",
        proofValue: 200,
        tags: ["Churn", "SaaS", "Cohort Analysis", "Recommendations"],
    },
    // Customer Support
    {
        id: "cs-001",
        title: "Respond to 10 Difficult Support Tickets",
        trackId: "customer-support",
        track: "Customer Support Specialist",
        difficulty: "Beginner",
        estimatedTime: "1–2 hours",
        description:
            "Review 10 real support ticket scenarios and write a professional, empathetic response to each one.",
        scenario:
            "You are joining a SaaS company's support team. On your first day, you have 10 open tickets ranging from billing confusion to technical frustration to outright complaints. Your job is to handle each one with empathy, clarity, and a resolution path.",
        taskBrief:
            "Write a full support response to each of the 10 provided ticket scenarios. Responses should be warm but professional, clearly address the issue, and where possible offer a next step or resolution.",
        deliverables: [
            "10 written support responses",
            "Brief explanation of your tone and approach",
            "AI usage disclosure",
        ],
        skillsTested: ["Written empathy", "Clarity", "Resolution thinking", "Tone matching", "Documentation"],
        evaluationCriteria: [
            { name: "Empathy", description: "Responses feel human, not scripted", weight: 25 },
            { name: "Clarity", description: "Issue is acknowledged and next steps are clear", weight: 25 },
            { name: "Resolution Quality", description: "Where possible, a path to resolution is provided", weight: 25 },
            { name: "Tone Consistency", description: "Tone is appropriate and consistent across all 10", weight: 25 },
        ],
        resources: [],
        aiDisclosureRequired: true,
        status: "not-started",
        proofValue: 120,
        tags: ["Tickets", "Empathy", "Writing", "Resolution"],
    },
    // Social Media
    {
        id: "sm-001",
        title: "Create a 7-Day Launch Content Plan",
        trackId: "social-media",
        track: "Social Media Manager",
        difficulty: "Intermediate",
        estimatedTime: "3–5 hours",
        description:
            "Develop a complete 7-day content calendar for a product launch across Instagram, LinkedIn, and X (Twitter).",
        scenario:
            "A DTC brand is launching a new productivity journal in 7 days. They have no content plan. You have been brought in last minute to build one that can be executed immediately.",
        taskBrief:
            "Create a day-by-day content plan for a 7-day launch window across 3 platforms. Each day should include 1–2 posts per platform with caption, content format (image, video, carousel, etc.), hook, CTA, and hashtag strategy. Include a brief strategy overview at the start.",
        deliverables: [
            "7-day content calendar (spreadsheet or doc)",
            "Full captions for each post",
            "Strategy rationale document",
            "AI usage disclosure",
        ],
        skillsTested: ["Content strategy", "Platform knowledge", "Copywriting", "Campaign thinking", "Audience understanding"],
        evaluationCriteria: [
            { name: "Strategy Clarity", description: "Approach has a clear arc and intent", weight: 25 },
            { name: "Caption Quality", description: "Captions are sharp, brand-appropriate, and varied", weight: 30 },
            { name: "Platform Awareness", description: "Content is adapted for each platform, not copy-pasted", weight: 25 },
            { name: "Campaign Cohesion", description: "Posts build on each other across the 7 days", weight: 20 },
        ],
        resources: [],
        aiDisclosureRequired: true,
        status: "not-started",
        proofValue: 180,
        tags: ["Content Calendar", "Launch", "Instagram", "LinkedIn"],
    },
    // Video Editor
    {
        id: "ve-001",
        title: "Turn Raw Clips Into a 30-Second Ad",
        trackId: "video-editor",
        track: "Video Editor",
        difficulty: "Intermediate",
        estimatedTime: "4–6 hours",
        description:
            "Edit a provided set of raw footage clips into a punchy, 30-second product advertisement ready for social media.",
        scenario:
            "A startup selling eco-friendly water bottles shot raw footage during a product launch event. They have clips of the product, people using it, and lifestyle shots. They need a 30-second ad ready for Instagram and YouTube.",
        taskBrief:
            "Edit the provided raw clips into a 30-second ad. The edit should have a clear narrative arc, punchy pacing, appropriate music (royalty-free), color grading, and a text call-to-action at the end. Export in 1080p.",
        deliverables: [
            "Final video file (MP4, 1080p)",
            "Project file or screenshots of timeline",
            "Written description of pacing and creative decisions",
            "AI usage disclosure",
        ],
        skillsTested: ["Video editing", "Pacing", "Storytelling", "Color grading", "Audio mixing"],
        evaluationCriteria: [
            { name: "Pacing", description: "Cuts feel intentional and keep energy throughout", weight: 25 },
            { name: "Storytelling", description: "The 30 seconds has a clear beginning, middle, end", weight: 25 },
            { name: "Technical Quality", description: "Color, audio, and resolution are polished", weight: 25 },
            { name: "Creative Decisions", description: "Choices are explained and show editorial thinking", weight: 25 },
        ],
        resources: [],
        aiDisclosureRequired: true,
        status: "not-started",
        proofValue: 220,
        tags: ["Ad", "30-Second", "Social Media", "Editing"],
    },
    // QA Tester
    {
        id: "qa-001",
        title: "Write Bug Reports for a Broken Checkout",
        trackId: "qa-tester",
        track: "QA Tester",
        difficulty: "Beginner",
        estimatedTime: "2–3 hours",
        description:
            "Test a provided broken checkout flow and write professional bug reports for every issue you find.",
        scenario:
            "The dev team has deployed a new checkout flow to staging and it is clearly broken. Before it goes to production, you need to find every reproducible bug and document it with enough detail for engineers to fix it without questions.",
        taskBrief:
            "Test the provided staging URL for the checkout flow. Find all bugs, errors, and UX failures. Write a formal bug report for each one, including steps to reproduce, expected behavior, actual behavior, severity level, and screenshots or descriptions.",
        deliverables: [
            "Bug report document with all issues",
            "Severity prioritization",
            "Test coverage summary",
            "AI usage disclosure",
        ],
        skillsTested: ["Bug identification", "Report writing", "Severity classification", "Reproducibility", "Test coverage"],
        evaluationCriteria: [
            { name: "Bug Coverage", description: "Found the major and minor bugs in the flow", weight: 30 },
            { name: "Report Clarity", description: "Reports are specific enough to action without clarification", weight: 30 },
            { name: "Severity Judgment", description: "Issues are correctly prioritized", weight: 20 },
            { name: "Completeness", description: "Each report has all required fields", weight: 20 },
        ],
        resources: [],
        aiDisclosureRequired: false,
        status: "not-started",
        proofValue: 140,
        tags: ["Bug Reports", "Testing", "Checkout", "QA"],
    },
    {
        id: "qa-002",
        title: "Create a Test Plan for a Login Flow",
        trackId: "qa-tester",
        track: "QA Tester",
        difficulty: "Intermediate",
        estimatedTime: "2–4 hours",
        description:
            "Write a comprehensive test plan for a user authentication flow including standard login, OAuth, and password recovery.",
        scenario:
            "A startup is shipping a new authentication system next sprint. Before it goes to development, the QA team needs a solid test plan covering all scenarios, edge cases, and failure states.",
        taskBrief:
            "Write a complete test plan for a login flow. Cover happy paths, error paths, edge cases, security considerations, and accessibility. Organize test cases clearly with IDs, descriptions, preconditions, steps, expected results, and priority.",
        deliverables: [
            "Test plan document",
            "Full test case list",
            "Priority matrix",
            "AI usage disclosure",
        ],
        skillsTested: ["Test planning", "Edge case thinking", "Security awareness", "Documentation", "Analytical thinking"],
        evaluationCriteria: [
            { name: "Coverage", description: "Happy path, error states, and edge cases are all represented", weight: 30 },
            { name: "Structure", description: "Test cases are organized, labeled, and easy to execute", weight: 25 },
            { name: "Security Thinking", description: "Considers authentication vulnerabilities and edge cases", weight: 25 },
            { name: "Clarity", description: "Anyone could pick this up and execute the tests", weight: 20 },
        ],
        resources: [],
        aiDisclosureRequired: true,
        status: "not-started",
        proofValue: 160,
        tags: ["Test Plan", "Authentication", "Security", "Documentation"],
    },
];
