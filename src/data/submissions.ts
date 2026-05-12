import type { Submission } from "@/types";

export const submissions: Submission[] = [
    {
        id: "sub-001",
        challengeId: "fe-003",
        challengeTitle: "Fix Accessibility Issues in a Landing Page",
        track: "Front-End Developer",
        submittedAt: "2026-04-28T14:30:00Z",
        projectTitle: "Accessibility Audit & Fix — Bloom Wellness Landing Page",
        liveLink: "https://bloom-a11y-fix.vercel.app",
        repoLink: "https://github.com/alexcarter/bloom-a11y-fix",
        explanation:
            "I audited the landing page using Lighthouse, axe DevTools, and manual keyboard testing. Found 7 distinct issues ranging from missing alt text to non-focusable CTA buttons. The most critical fix was replacing div-based buttons with proper button elements and adding role/aria attributes throughout.",
        problemStatement:
            "The landing page had critical accessibility failures that made it unusable for keyboard-only users and screen reader users. Missing landmarks, poor contrast, and non-semantic HTML were the core problems.",
        designDecisions:
            "I chose to fix rather than redesign — preserving the visual style while correcting the underlying structure. Added skip-to-content links, fixed heading hierarchy, and ensured all interactive elements met WCAG 2.1 AA contrast ratios.",
        improvements:
            "With more time I would add automated accessibility testing to the CI pipeline and conduct a real user test with a screen reader user. I would also improve the focus visible styles which currently rely on the browser default.",
        aiDisclosure: "brainstorm",
        aiDescription:
            "I used ChatGPT to help me understand the proper ARIA attributes for a card component. I verified the implementation against the ARIA Authoring Practices documentation before applying it.",
        processSteps: [
            {
                id: "ps-001-1",
                title: "Initial Lighthouse Audit",
                description: "Ran Lighthouse and got a score of 43 on accessibility. Exported the full issue list.",
                timestamp: "2026-04-28T09:00:00Z",
            },
            {
                id: "ps-001-2",
                title: "Manual Keyboard Testing",
                description: "Tabbed through the entire page. Found 3 elements that couldn't receive focus.",
                timestamp: "2026-04-28T09:45:00Z",
            },
            {
                id: "ps-001-3",
                title: "Fixed Semantic HTML",
                description: "Replaced all button-like divs with real button and a elements. Fixed heading hierarchy.",
                timestamp: "2026-04-28T11:00:00Z",
            },
            {
                id: "ps-001-4",
                title: "Added ARIA & Alt Text",
                description: "Added alt attributes to all images, aria-label to icon buttons, and landmark roles.",
                timestamp: "2026-04-28T12:30:00Z",
            },
            {
                id: "ps-001-5",
                title: "Final Audit & Verification",
                description: "Re-ran Lighthouse. Score improved to 97. Verified with VoiceOver on macOS.",
                timestamp: "2026-04-28T14:00:00Z",
            },
        ],
        score: 92,
        skills: ["Accessibility", "HTML", "ARIA", "Keyboard Navigation", "Auditing"],
    },
    {
        id: "sub-002",
        challengeId: "fe-002",
        challengeTitle: "Create a Responsive Dashboard Card System",
        track: "Front-End Developer",
        submittedAt: "2026-04-15T11:00:00Z",
        projectTitle: "Modular Metric Card System — Slate Dashboard",
        liveLink: "https://slate-cards.vercel.app",
        repoLink: "https://github.com/alexcarter/slate-cards",
        explanation:
            "Built a fully componentized card system using CSS Grid and CSS custom properties. Each card accepts a data object and renders consistently. The grid collapses to a single column on mobile.",
        problemStatement:
            "The team needed a reusable, extensible card system for an analytics dashboard that would work across different data types without bespoke styling for each card.",
        designDecisions:
            "Used CSS Grid with auto-fill and minmax for responsive layout without media query breakpoints. Used CSS custom properties on each card component so themes can be applied externally. Made the trend indicator (up/down/neutral) driven by a single numeric prop.",
        improvements:
            "I would add a skeleton loading state and animated count-up on initial render. The card could also accept a graph sparkline as an optional slot.",
        aiDisclosure: "suggestions",
        aiDescription:
            "Used GitHub Copilot for autocompleting repetitive CSS property declarations. Reviewed every suggestion before accepting. The component architecture was designed entirely by me.",
        processSteps: [
            {
                id: "ps-002-1",
                title: "Sketched card variants",
                description: "Drew 3 card layout options. Chose the density that worked best for data-heavy dashboards.",
                timestamp: "2026-04-15T08:00:00Z",
            },
            {
                id: "ps-002-2",
                title: "Built base card component",
                description: "Created the card HTML structure and applied base styles with dark theme.",
                timestamp: "2026-04-15T08:45:00Z",
            },
            {
                id: "ps-002-3",
                title: "Implemented responsive grid",
                description: "Used auto-fill grid layout. Tested at 320px, 768px, and 1440px widths.",
                timestamp: "2026-04-15T10:00:00Z",
            },
        ],
        score: 88,
        skills: ["CSS Grid", "Component Design", "Responsive Layout", "Visual Design", "Code Reusability"],
    },
];
