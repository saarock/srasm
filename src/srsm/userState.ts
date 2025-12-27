// Blog Post Interface
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  authorId: string;
  date: string;
  category: string;
  categoryId: string;
  tags: string[];
  featuredImage: string;
  readTime: number;
  likes: number;
  views: number;
}

// Category Interface
export interface Category {
  id: string;
  name: string;
  description: string;
  postCount: number;
  color: string;
}

// Author Interface
export interface Author {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  role: string;
  socialLinks: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}

// Comment Interface
export interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  date: string;
  likes: number;
}

// Main Blog State
export interface BlogState {
  posts: BlogPost[];
  categories: Category[];
  authors: Author[];
  comments: Comment[];
  selectedPostId: string | null;
  selectedCategoryId: string | null;
  searchQuery: string;
  viewMode: 'grid' | 'list';
}

export interface User {
  id: string;
  name: string;
  email: string;
}

// --- DEMO SLICES ---
export interface DemoSliceA {
  count: number;
  lastUpdated: string;
}

export interface DemoSliceB {
  text: string;
  color: string;
}

export const demoSliceA: DemoSliceA = {
  count: 0,
  lastUpdated: new Date().toISOString(),
};

export const demoSliceB: DemoSliceB = {
  text: "Initial Text",
  color: "#00E6E6",
};
// -------------------

// Initial State with Sample Data
export const initialState: BlogState = {
  posts: [
    {
      id: '1',
      title: 'Getting Started with React State Management',
      content: `# Introduction to State Management

State management is a crucial aspect of building modern React applications. As your application grows, managing state becomes increasingly complex. In this comprehensive guide, we'll explore different approaches to state management and when to use each one.

## Why State Management Matters

When building React applications, you'll quickly encounter scenarios where multiple components need to share and update the same data. Without proper state management, you might find yourself:

- Passing props through many levels of components (prop drilling)
- Duplicating state across multiple components
- Struggling to keep your UI in sync with your data

## Different Approaches

### 1. Local Component State
The simplest form of state management using useState hook. Perfect for component-specific data that doesn't need to be shared.

### 2. Context API
React's built-in solution for sharing state across components without prop drilling. Great for theme, authentication, and other global settings.

### 3. State Management Libraries
Libraries like Redux, MobX, and Zustand provide more powerful features for complex applications with extensive state requirements.

## Best Practices

1. **Keep state as local as possible** - Only lift state up when necessary
2. **Use the right tool for the job** - Don't overcomplicate with global state when local state suffices
3. **Normalize your state** - Avoid deeply nested structures
4. **Separate UI state from server state** - Consider using libraries like React Query for server data

## Conclusion

Choosing the right state management solution depends on your application's complexity and requirements. Start simple and add complexity only when needed.`,
      excerpt: 'Learn the fundamentals of state management in React applications and discover when to use different approaches.',
      author: 'Sarah Johnson',
      authorId: '1',
      date: '2024-12-01',
      category: 'React',
      categoryId: '1',
      tags: ['React', 'State Management', 'JavaScript', 'Frontend'],
      featuredImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
      readTime: 8,
      likes: 124,
      views: 1523,
    },
    {
    id: "2",
    title: "React Query vs Redux: Choosing the Right Data Strategy",
    content: `# React Query vs Redux

Not all state is the same. **UI state** (modals, tabs, filters) behaves differently from **server state** (API data).

## When React Query shines
- Caching + deduping requests
- Background refetching
- Pagination & infinite queries
- Mutations with optimistic updates

## When Redux still makes sense
- Complex client-only workflows
- Cross-page UI state that must persist
- Heavy “event-driven” app logic

## Practical rule
- **Server data** → React Query (or TanStack Query)
- **Global UI state** → Context / Redux / Zustand
- **Local UI state** → useState

## Conclusion
Use the simplest tool that matches the “type” of state you’re managing.`,
    excerpt:
      "Learn how to decide between React Query and Redux by separating UI state from server state.",
    author: "Michael Chen",
    authorId: "2",
    date: "2024-12-03",
    category: "React",
    categoryId: "1",
    tags: ["React", "React Query", "Redux", "State Management"],
    featuredImage:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
    readTime: 7,
    likes: 142,
    views: 1930,
  },
  {
    id: "3",
    title: "React Hooks You Should Master (Beyond useState)",
    content: `# Hooks Beyond useState

## 1) useEffect (carefully)
Use it for **side effects**, not for computing derived values.

## 2) useMemo
Memoize expensive computations. Avoid overusing it.

## 3) useCallback
Stabilize function references passed into memoized components.

## 4) useRef
Store mutable values without re-rendering. Great for timers, DOM refs.

## 5) useReducer
For multi-step state transitions and predictable updates.

## Summary
Pick hooks based on the problem: effects, memoization, refs, or state machines.`,
    excerpt:
      "A practical guide to the React hooks that matter most when apps start growing.",
    author: "Sarah Johnson",
    authorId: "1",
    date: "2024-12-04",
    category: "React",
    categoryId: "1",
    tags: ["React", "Hooks", "useEffect", "useReducer"],
    featuredImage:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800",
    readTime: 6,
    likes: 121,
    views: 1642,
  },
  {
    id: "4",
    title: "TypeScript: Designing Better Types with Unions and Narrowing",
    content: `# Better Types with Unions

## Discriminated unions
Use a shared field (like \`type\`) to model variants.

\`\`\`ts
type Result =
  | { type: "ok"; data: string }
  | { type: "error"; message: string };

function handle(r: Result) {
  if (r.type === "ok") return r.data;
  return r.message;
}
\`\`\`

## Narrowing tips
- \`in\` operator
- \`typeof\`
- custom type guards

## Conclusion
Model real-world shapes with unions, then let TS guide your code safely.`,
    excerpt:
      "Stop fighting TypeScript—use unions and narrowing to model real app data cleanly.",
    author: "Michael Chen",
    authorId: "2",
    date: "2024-12-05",
    category: "TypeScript",
    categoryId: "2",
    tags: ["TypeScript", "Unions", "Type Guards", "Best Practices"],
    featuredImage:
      "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800",
    readTime: 7,
    likes: 106,
    views: 1398,
  },
  {
    id: "9",
    title: "TypeScript Utility Types You’ll Actually Use",
    content: `# Utility Types That Pay Off

## Must-know
- \`Partial<T>\` for draft forms
- \`Pick<T, K>\` for view models
- \`Omit<T, K>\` for excluding fields
- \`Record<K, V>\` for maps
- \`ReturnType<F>\` for deriving types from functions

## Example
\`\`\`ts
type User = { id: string; name: string; email: string; role: "admin" | "user" };
type UserPreview = Pick<User, "id" | "name">;
\`\`\`

## Conclusion
Utility types reduce duplication and keep types consistent.`,
    excerpt:
      "A short list of TypeScript utility types that improve code quality immediately.",
    author: "Michael Chen",
    authorId: "2",
    date: "2024-12-06",
    category: "TypeScript",
    categoryId: "2",
    tags: ["TypeScript", "Utility Types", "Patterns"],
    featuredImage:
      "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800",
    readTime: 5,
    likes: 93,
    views: 1210,
  },
  {
    id: "10",
    title: "CSS Spacing Systems: Why Your UI Feels “Off”",
    content: `# Spacing Systems

Random spacing makes layouts feel inconsistent.

## Use a scale
Example: 4px base scale → 4, 8, 12, 16, 24, 32, 48…

## Common mistakes
- Mixing arbitrary values everywhere
- Inconsistent line height
- No vertical rhythm

## Quick win
Pick a spacing scale and stick to it across paddings, margins, gaps, and typography.`,
    excerpt:
      "If your UI looks messy, spacing is usually the reason. Fix it with a simple scale.",
    author: "Emma Davis",
    authorId: "3",
    date: "2024-11-12",
    category: "CSS",
    categoryId: "3",
    tags: ["CSS", "UI", "Spacing", "Design Systems"],
    featuredImage:
      "https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=800",
    readTime: 4,
    likes: 168,
    views: 2405,
  },
  {
    id: "7",
    title: "Responsive Typography with clamp()",
    content: `# Responsive Type with clamp()

\`clamp(min, preferred, max)\` lets text scale smoothly without media queries.

\`\`\`css
h1 {
  font-size: clamp(1.8rem, 3vw + 1rem, 3rem);
}
\`\`\`

## Why it helps
- Smooth scaling across devices
- Less breakpoint management
- Better reading experience

## Tip
Combine \`clamp()\` with good line-height for readability.`,
    excerpt:
      "Make text scale beautifully on every screen using CSS clamp().",
    author: "Emma Davis",
    authorId: "3",
    date: "2024-11-18",
    category: "CSS",
    categoryId: "3",
    tags: ["CSS", "Typography", "Responsive Design"],
    featuredImage:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800",
    readTime: 5,
    likes: 134,
    views: 1980,
  },
  {
    id: "8",
    title: "Web Performance 101: Core Web Vitals Explained",
    content: `# Core Web Vitals

## LCP (Largest Contentful Paint)
How fast main content loads.

## INP (Interaction to Next Paint)
How responsive the page feels to user actions.

## CLS (Cumulative Layout Shift)
How stable the layout is while loading.

## Practical fixes
- Optimize images (sizes, formats, lazy-load)
- Reduce JS on first load
- Reserve space for media and ads
- Use CDN caching

## Conclusion
Measure first, then fix the biggest bottleneck.`,
    excerpt:
      "Understand LCP, INP, and CLS—and the practical fixes that move the needle.",
    author: "Sarah Johnson",
    authorId: "1",
    date: "2024-11-10",
    category: "Web Development",
    categoryId: "4",
    tags: ["Performance", "Core Web Vitals", "Web Development"],
    featuredImage:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800",
    readTime: 7,
    likes: 176,
    views: 2660,
  },
  {
    id: "9",
    title: "Authentication Basics: Sessions vs JWT (Without the Confusion)",
    content: `# Sessions vs JWT

## Sessions
- Server stores session data
- Client stores session id (cookie)
- Easy revocation

## JWT
- Token holds claims
- Great for APIs and distributed systems
- Revocation is harder (use short TTL + refresh tokens)

## Common advice
- Web apps: cookie sessions or cookie-based JWT
- Mobile/API: JWT + refresh flow

## Conclusion
Pick based on deployment + threat model, not hype.`,
    excerpt:
      "A clear explanation of sessions vs JWT and how to choose for modern apps.",
    author: "Michael Chen",
    authorId: "2",
    date: "2024-11-14",
    category: "Web Development",
    categoryId: "4",
    tags: ["Auth", "JWT", "Sessions", "Security"],
    featuredImage:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800",
    readTime: 8,
    likes: 201,
    views: 3155,
  },
  {
    id: "14",
    title: "React Router Patterns: Layouts, Nested Routes, and Guards",
    content: `# Router Patterns

## Nested routes
Use nested routes for dashboards and shared layouts.

## Layout routes
A top-level layout can render nav + outlet.

## Route guards
Prefer guard components that redirect if not authenticated.

## Tips
- Keep route config readable
- Avoid deeply nested components without purpose
- Use loaders (if supported) for data prefetch`,
    excerpt:
      "Build clean route structures with layouts, nested routes, and auth guards.",
    author: "Sarah Johnson",
    authorId: "1",
    date: "2024-12-07",
    category: "React",
    categoryId: "1",
    tags: ["React", "Routing", "React Router", "Architecture"],
    featuredImage:
      "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=800",
    readTime: 6,
    likes: 117,
    views: 1733,
  },
  {
    id: "15",
    title: "React Forms: When to Use Controlled vs Uncontrolled Inputs",
    content: `# Controlled vs Uncontrolled

## Controlled
React state is the source of truth.
- Great validation + dynamic UI
- More re-renders

## Uncontrolled
DOM holds the value, access via refs.
- Less state boilerplate
- Harder advanced validation

## Rule
- Simple forms: uncontrolled is fine
- Complex forms: controlled + form library`,
    excerpt:
      "A simple way to decide how to build forms in React without pain.",
    author: "Michael Chen",
    authorId: "2",
    date: "2024-12-08",
    category: "React",
    categoryId: "1",
    tags: ["React", "Forms", "UX", "Validation"],
    featuredImage:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
    readTime: 5,
    likes: 109,
    views: 1589,
  },
  {
    id: "16",
    title: "TypeScript in React: Typing Props the Clean Way",
    content: `# Typing Props in React

## Prefer explicit prop types
\`\`\`ts
type ButtonProps = {
  variant?: "primary" | "ghost";
  onClick: () => void;
  children: React.ReactNode;
};
\`\`\`

## Avoid over-typing
Let inference work for simple components.

## Common patterns
- \`React.ComponentProps<"button">\`
- union for variants
- generics for reusable lists`,
    excerpt:
      "Write React components with TypeScript that stay flexible and safe.",
    author: "Sarah Johnson",
    authorId: "1",
    date: "2024-12-09",
    category: "TypeScript",
    categoryId: "2",
    tags: ["TypeScript", "React", "Props", "Patterns"],
    featuredImage:
      "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=800",
    readTime: 6,
    likes: 97,
    views: 1366,
  },
  {
    id: "17",
    title: "CSS Container Queries: Responsive Components, Not Pages",
    content: `# Container Queries

Media queries respond to the viewport.
Container queries respond to the component’s container.

## Example idea
A card can change layout when its container is wide enough—perfect for sidebars.

## Why it matters
- More reusable components
- Less breakpoint coupling
- Better design systems`,
    excerpt:
      "Build truly reusable responsive components using CSS container queries.",
    author: "Emma Davis",
    authorId: "3",
    date: "2024-11-22",
    category: "CSS",
    categoryId: "3",
    tags: ["CSS", "Responsive", "Container Queries"],
    featuredImage:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=800",
    readTime: 5,
    likes: 155,
    views: 2149,
  },
  {
    id: "18",
    title: "Accessible Buttons and Links: The Rules People Miss",
    content: `# Buttons vs Links

## Use a link when
It navigates.

## Use a button when
It performs an action.

## Common issues
- Clickable divs
- Missing focus states
- No aria-label for icon-only buttons

## Checklist
- Keyboard reachable
- Visible focus
- Proper semantics
- Clear accessible name`,
    excerpt:
      "Buttons and links are often misused—here’s how to get accessibility right.",
    author: "Sarah Johnson",
    authorId: "1",
    date: "2024-11-24",
    category: "Web Development",
    categoryId: "4",
    tags: ["Accessibility", "HTML", "UX", "WCAG"],
    featuredImage:
      "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800",
    readTime: 6,
    likes: 188,
    views: 2750,
  },
  {
    id: "19",
    title: "React Component Architecture: Presentational vs Container Components",
    content: `# Architecture Pattern

## Presentational components
- Focus on UI
- Receive props
- Easy to reuse and test

## Container components
- Handle data fetching
- Manage state
- Pass props down

## Why it helps
- Cleaner separation of concerns
- Better maintainability in bigger apps`,
    excerpt:
      "A simple architecture pattern that keeps React codebases clean as they grow.",
    author: "Michael Chen",
    authorId: "2",
    date: "2024-12-10",
    category: "React",
    categoryId: "1",
    tags: ["React", "Architecture", "Components"],
    featuredImage:
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800",
    readTime: 6,
    likes: 113,
    views: 1604,
  },
  {
    id: "20",
    title: "TypeScript Error Messages: How to Read Them Faster",
    content: `# Reading TS Errors

## Start from the first mismatch
TypeScript often shows a long chain. The first mismatch is usually the root cause.

## Look for these signals
- “Type X is not assignable to type Y”
- missing property vs wrong type
- union mismatch

## Tip
Hover types, inspect inferred generics, and break down complex types into aliases.`,
    excerpt:
      "Stop fearing TypeScript errors—learn the patterns that make them easy to fix.",
    author: "Michael Chen",
    authorId: "2",
    date: "2024-12-11",
    category: "TypeScript",
    categoryId: "2",
    tags: ["TypeScript", "Debugging", "DX"],
    featuredImage:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800",
    readTime: 5,
    likes: 88,
    views: 1184,
  },
  {
    id: "21",
    title: "CSS Shadows That Don’t Look Cheap",
    content: `# Better Shadows

## Common problem
A single heavy shadow looks fake.

## Better approach
Layer subtle shadows:
- small tight shadow
- soft large shadow

## Tips
- Keep opacity low
- Increase blur more than spread
- Match your design system scale`,
    excerpt:
      "Create modern, realistic UI depth with layered shadows and consistent rules.",
    author: "Emma Davis",
    authorId: "3",
    date: "2024-11-26",
    category: "CSS",
    categoryId: "3",
    tags: ["CSS", "UI", "Design"],
    featuredImage:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
    readTime: 4,
    likes: 140,
    views: 2055,
  },
  {
    id: "22",
    title: "API Pagination Patterns: Offset vs Cursor",
    content: `# Pagination

## Offset pagination
- Simple (\`page=2\`)
- Can be inconsistent when data changes

## Cursor pagination
- Uses a cursor token
- Stable and scalable
- Best for infinite scroll

## Recommendation
If your feed changes frequently, prefer cursor pagination.`,
    excerpt:
      "Understand the tradeoffs between offset and cursor pagination for real apps.",
    author: "Sarah Johnson",
    authorId: "1",
    date: "2024-11-28",
    category: "Web Development",
    categoryId: "4",
    tags: ["API", "Pagination", "Backend", "Web Development"],
    featuredImage:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
    readTime: 6,
    likes: 123,
    views: 1840,
  },
  {
    id: "23",
    title: "React Lists: Keys, Rendering, and Performance Pitfalls",
    content: `# Lists Done Right

## Use stable keys
Never use array index if items can reorder.

## Avoid heavy renders
- Virtualize long lists
- Memoize row components

## Keep rendering predictable
Compute derived list data outside render when expensive.`,
    excerpt:
      "Fix common React list mistakes that cause bugs, flicker, and slow UIs.",
    author: "Sarah Johnson",
    authorId: "1",
    date: "2024-12-12",
    category: "React",
    categoryId: "1",
    tags: ["React", "Performance", "Lists", "Keys"],
    featuredImage:
      "https://images.unsplash.com/photo-1556155092-490a1ba16284?w=800",
    readTime: 6,
    likes: 131,
    views: 1792,
  },
  {
    id: "24",
    title: "TypeScript Generics: A Practical Introduction",
    content: `# Generics (Without Pain)

Generics make functions reusable while keeping types safe.

\`\`\`ts
function wrap<T>(value: T) {
  return { value };
}
const a = wrap(123); // T inferred as number
\`\`\`

## Where you’ll use them
- API helpers
- reusable table/list components
- hooks like \`useFetch<T>()\`

## Tip
Start simple, let inference do most of the work.`,
    excerpt:
      "A beginner-friendly guide to generics you’ll actually use in real projects.",
    author: "Michael Chen",
    authorId: "2",
    date: "2024-12-13",
    category: "TypeScript",
    categoryId: "2",
    tags: ["TypeScript", "Generics", "Patterns"],
    featuredImage:
      "https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?w=800",
    readTime: 7,
    likes: 112,
    views: 1477,
  },
  {
    id: "25",
    title: "CSS Animations: Micro-interactions That Improve UX",
    content: `# Micro-interactions

## Good micro-interactions
- confirm actions (saved)
- show progress (loading)
- guide attention (subtle highlight)

## Keep it smooth
- animate transform/opacity
- keep durations short
- respect reduced-motion preferences`,
    excerpt:
      "Use small animations to make your UI feel polished without being distracting.",
    author: "Emma Davis",
    authorId: "3",
    date: "2024-12-01",
    category: "CSS",
    categoryId: "3",
    tags: ["CSS", "Animations", "UX"],
    featuredImage:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800",
    readTime: 5,
    likes: 149,
    views: 2091,
  },
  {
    id: "26",
    title: "Securing Frontend Apps: Common Mistakes and Fixes",
    content: `# Frontend Security Basics

## Mistakes
- Storing tokens in localStorage without considering XSS
- Rendering untrusted HTML
- Leaking secrets in frontend builds

## Fixes
- Use HttpOnly cookies when possible
- Sanitize user-generated content
- Keep secrets server-side

## Conclusion
Frontend security is mostly about reducing attack surface and making XSS harder.`,
    excerpt:
      "Practical frontend security tips: XSS, token storage, and what never to ship in the client.",
    author: "Sarah Johnson",
    authorId: "1",
    date: "2024-10-29",
    category: "Web Development",
    categoryId: "4",
    tags: ["Security", "XSS", "Web Development"],
    featuredImage:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800",
    readTime: 7,
    likes: 210,
    views: 3302,
  },
  {
    id: "27",
    title: "React Error Boundaries: Handling UI Failures Gracefully",
    content: `# Error Boundaries

Error boundaries prevent a crash from taking down the entire UI.

## Use cases
- third-party widgets
- complex dashboards
- experimental features

## UX tip
Show a helpful fallback:
- what happened
- how to retry
- how to contact support`,
    excerpt:
      "Stop full-page white screens—use error boundaries and friendly fallbacks.",
    author: "Michael Chen",
    authorId: "2",
    date: "2024-12-14",
    category: "React",
    categoryId: "1",
    tags: ["React", "Error Handling", "UX"],
    featuredImage:
      "https://images.unsplash.com/photo-1526378722445-899a3e40f1d9?w=800",
    readTime: 5,
    likes: 104,
    views: 1503,
  },
  {
    id: "28",
    title: "TypeScript + API Contracts: Keeping Frontend and Backend in Sync",
    content: `# API Contracts

## Problem
Frontend expects fields that backend changes silently.

## Better options
- Shared types (monorepo)
- OpenAPI generation
- Runtime validation (zod) + inferred types

## Best practice
Validate at the boundary (API layer), then keep app code trusting typed data.`,
    excerpt:
      "Avoid breaking changes by building a real contract between frontend and backend.",
    author: "Sarah Johnson",
    authorId: "1",
    date: "2024-11-30",
    category: "TypeScript",
    categoryId: "2",
    tags: ["TypeScript", "API", "OpenAPI", "Zod"],
    featuredImage:
      "https://images.unsplash.com/photo-1555952494-efd681c7e3f9?w=800",
    readTime: 8,
    likes: 119,
    views: 1711,
  },
  {
    id: "29",
    title: "CSS Debugging: How to Fix Layout Bugs Faster",
    content: `# CSS Debugging Workflow

## Step 1: Inspect
Use DevTools to check computed styles.

## Step 2: Reduce
Disable styles until the bug disappears.

## Step 3: Identify the cause
Look for:
- overflow constraints
- flex/grid sizing
- unexpected margins
- positioned ancestors

## Step 4: Lock it in
Add regression tests via visual snapshots when possible.`,
    excerpt:
      "A repeatable workflow for fixing CSS bugs without guessing.",
    author: "Emma Davis",
    authorId: "3",
    date: "2024-11-08",
    category: "CSS",
    categoryId: "3",
    tags: ["CSS", "Debugging", "DevTools"],
    featuredImage:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=800",
    readTime: 6,
    likes: 127,
    views: 1877,
  },
  {
    id: "30",
    title: "Building a Design System: Tokens, Components, and Governance",
    content: `# Design Systems

## Start with tokens
- colors
- spacing
- typography
- radii
- shadows

## Components next
Build core components first: Button, Input, Card, Modal.

## Governance
- contribution rules
- versioning
- documentation

## Conclusion
A design system is a product—treat it like one.`,
    excerpt:
      "Learn the steps to create a scalable design system your team will actually use.",
    author: "Emma Davis",
    authorId: "3",
    date: "2024-10-20",
    category: "Web Development",
    categoryId: "4",
    tags: ["Design System", "UI", "Web Development"],
    featuredImage:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
    readTime: 9,
    likes: 190,
    views: 2890,
  },
  {
    id: "31",
    title: "React Testing Basics: What to Test (and What Not To)",
    content: `# Testing in React

## Test user behavior
- clicking
- typing
- navigation
- async loading states

## Avoid testing implementation details
Don’t test internal state variables or component internals unless necessary.

## Good test pyramid
- unit tests for utilities
- component tests for behavior
- a few end-to-end tests for critical flows`,
    excerpt:
      "Write tests that survive refactors by focusing on user behavior—not internals.",
    author: "Sarah Johnson",
    authorId: "1",
    date: "2024-12-15",
    category: "React",
    categoryId: "1",
    tags: ["React", "Testing", "Quality"],
    featuredImage:
      "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=800",
    readTime: 7,
    likes: 116,
    views: 1658,
  },
  {
    id: "32",
    title: "TypeScript Strict Mode: The Upgrade That Pays Back",
    content: `# Strict Mode

Strict mode catches the bugs you’d otherwise ship.

## Enable gradually
- start with \`strictNullChecks\`
- fix the worst areas
- tighten rules over time

## Biggest win
You stop guessing about undefined and optional fields.`,
    excerpt:
      "Why TypeScript strict mode is worth the initial effort—and how to adopt it safely.",
    author: "Michael Chen",
    authorId: "2",
    date: "2024-11-02",
    category: "TypeScript",
    categoryId: "2",
    tags: ["TypeScript", "Strict Mode", "Best Practices"],
    featuredImage:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800",
    readTime: 6,
    likes: 101,
    views: 1333,
  },
  {
    id: "33",
    title: "CSS Layout Gotchas: min-width, flex, and overflow",
    content: `# Layout Gotchas

## The classic flex bug
A flex child can overflow because \`min-width\` defaults to \`auto\`.

## Fix
\`\`\`css
.flex-child {
  min-width: 0;
}
\`\`\`

## Why it matters
It prevents unwanted horizontal scroll and text overflow issues.`,
    excerpt:
      "Solve the ‘why is my flex item overflowing?’ bug with one small CSS rule.",
    author: "Emma Davis",
    authorId: "3",
    date: "2024-10-26",
    category: "CSS",
    categoryId: "3",
    tags: ["CSS", "Flexbox", "Layout", "Overflow"],
    featuredImage:
      "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800",
    readTime: 4,
    likes: 143,
    views: 2016,
  },
  {
    id: "34",
    title: "HTTP Basics Every Frontend Dev Should Know",
    content: `# HTTP Basics

## Methods
- GET: read
- POST: create
- PUT/PATCH: update
- DELETE: remove

## Status codes
- 200/201 success
- 304 cache
- 400 validation errors
- 401/403 auth issues
- 500 server errors

## Headers that matter
- Cache-Control
- Content-Type
- Authorization

## Conclusion
Understanding HTTP makes debugging 10x faster.`,
    excerpt:
      "A fast, practical refresher on HTTP methods, status codes, and headers.",
    author: "Sarah Johnson",
    authorId: "1",
    date: "2024-10-10",
    category: "Web Development",
    categoryId: "4",
    tags: ["HTTP", "Web Development", "APIs"],
    featuredImage:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
    readTime: 6,
    likes: 159,
    views: 2488,
  },
  {
    id: "35",
    title: "React + Accessibility: Building Keyboard-Friendly UIs",
    content: `# Keyboard-Friendly UI

## Core rules
- Every interactive element must be reachable via Tab
- Focus should be visible
- Modals must trap focus
- Escape should close dialogs (when appropriate)

## Practical tips
- Use semantic elements first
- Add ARIA only when needed
- Test with keyboard-only navigation`,
    excerpt:
      "Make your React UI usable without a mouse by following a simple keyboard accessibility checklist.",
    author: "Sarah Johnson",
    authorId: "1",
    date: "2024-12-16",
    category: "Web Development",
    categoryId: "4",
    tags: ["Accessibility", "React", "Keyboard", "UX"],
    featuredImage:
      "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800",
    readTime: 7,
    likes: 198,
    views: 3012,
  },
    {
      id: '2',
      title: 'TypeScript Best Practices for 2024',
      content: `# TypeScript Best Practices

TypeScript has become the de facto standard for building large-scale JavaScript applications. Here are the best practices you should follow in 2024.

## Type Safety First

Always prefer explicit types over 'any'. While 'any' might seem convenient, it defeats the purpose of using TypeScript.

\`\`\`typescript
// Bad
function processData(data: any) {
  return data.value;
}

// Good
interface Data {
  value: string;
}

function processData(data: Data): string {
  return data.value;
}
\`\`\`

## Use Strict Mode

Enable strict mode in your tsconfig.json to catch more potential errors:

\`\`\`json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
\`\`\`

## Leverage Type Inference

TypeScript's type inference is powerful. Let it work for you:

\`\`\`typescript
// TypeScript can infer the return type
function add(a: number, b: number) {
  return a + b; // inferred as number
}
\`\`\`

## Use Utility Types

TypeScript provides many built-in utility types:

- Partial<T> - Makes all properties optional
- Required<T> - Makes all properties required
- Pick<T, K> - Creates a type with specific properties
- Omit<T, K> - Creates a type without specific properties

## Conclusion

Following these best practices will help you write more maintainable and type-safe code.`,
      excerpt: 'Discover the essential TypeScript best practices that will make your code more robust and maintainable.',
      author: 'Michael Chen',
      authorId: '2',
      date: '2024-11-28',
      category: 'TypeScript',
      categoryId: '2',
      tags: ['TypeScript', 'Best Practices', 'JavaScript'],
      featuredImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
      readTime: 6,
      likes: 98,
      views: 1245,
    },
    {
      id: '3',
      title: 'Modern CSS: Grid vs Flexbox',
      content: `# CSS Grid vs Flexbox: When to Use Each

Both CSS Grid and Flexbox are powerful layout tools, but they excel in different scenarios. Let's explore when to use each one.

## Flexbox: One-Dimensional Layouts

Flexbox is perfect for laying out items in a single direction - either horizontally or vertically.

### Best Use Cases:
- Navigation bars
- Card layouts in a row
- Centering content
- Distributing space between items

\`\`\`css
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
\`\`\`

## CSS Grid: Two-Dimensional Layouts

CSS Grid excels at creating complex two-dimensional layouts with rows and columns.

### Best Use Cases:
- Page layouts
- Image galleries
- Dashboard layouts
- Magazine-style layouts

\`\`\`css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}
\`\`\`

## Can They Work Together?

Absolutely! Grid for the overall page structure, Flexbox for component internals.

## Conclusion

Use Flexbox for one-dimensional layouts and Grid for two-dimensional layouts. Often, you'll use both in the same project!`,
      excerpt: 'Understanding the differences between CSS Grid and Flexbox will help you choose the right tool for your layouts.',
      author: 'Emma Davis',
      authorId: '3',
      date: '2024-11-25',
      category: 'CSS',
      categoryId: '3',
      tags: ['CSS', 'Grid', 'Flexbox', 'Layout'],
      featuredImage: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800',
      readTime: 5,
      likes: 156,
      views: 2103,
    },
    {
      id: '4',
      title: 'Building Accessible Web Applications',
      content: `# Web Accessibility: A Developer's Guide

Creating accessible web applications isn't just good practice—it's essential for reaching all users.

## Why Accessibility Matters

- **15% of the world's population** has some form of disability
- Accessibility improves UX for everyone
- It's often a legal requirement
- Better SEO and performance

## Key Principles (WCAG)

### 1. Perceivable
Information must be presentable to users in ways they can perceive.

- Provide text alternatives for images
- Offer captions for videos
- Ensure sufficient color contrast

### 2. Operable
Users must be able to operate the interface.

- Make all functionality keyboard accessible
- Give users enough time to read content
- Don't design content that causes seizures

### 3. Understandable
Information and operation must be understandable.

- Make text readable
- Make content appear and operate predictably
- Help users avoid and correct mistakes

### 4. Robust
Content must be robust enough for various technologies.

## Practical Tips

\`\`\`html
<!-- Use semantic HTML -->
<nav>
  <ul>
    <li><a href="/">Home</a></li>
  </ul>
</nav>

<!-- Add ARIA labels when needed -->
<button aria-label="Close dialog">×</button>

<!-- Ensure proper heading hierarchy -->
<h1>Main Title</h1>
<h2>Section Title</h2>
<h3>Subsection</h3>
\`\`\`

## Testing Tools

- WAVE Browser Extension
- axe DevTools
- Lighthouse in Chrome DevTools
- Screen readers (NVDA, JAWS, VoiceOver)

## Conclusion

Accessibility should be built in from the start, not added as an afterthought.`,
      excerpt: 'Learn how to build web applications that are accessible to all users, including those with disabilities.',
      author: 'Sarah Johnson',
      authorId: '1',
      date: '2024-11-20',
      category: 'Web Development',
      categoryId: '4',
      tags: ['Accessibility', 'WCAG', 'Web Development', 'UX'],
      featuredImage: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800',
      readTime: 7,
      likes: 203,
      views: 2847,
    },
    {
      id: '5',
      title: 'Performance Optimization in React',
      content: `# React Performance Optimization

Performance is crucial for user experience. Let's explore techniques to make your React apps blazing fast.

## Common Performance Issues

1. **Unnecessary re-renders**
2. **Large bundle sizes**
3. **Unoptimized images**
4. **Blocking the main thread**

## Optimization Techniques

### 1. Use React.memo

Prevent unnecessary re-renders of functional components:

\`\`\`typescript
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* expensive rendering */}</div>;
});
\`\`\`

### 2. useMemo and useCallback

Memoize expensive calculations and functions:

\`\`\`typescript
const memoizedValue = useMemo(() => {
  return expensiveCalculation(a, b);
});

const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
\`\`\`

### 3. Code Splitting

Split your code into smaller chunks:

\`\`\`typescript
const LazyComponent = React.lazy(() => import('./LazyComponent'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <LazyComponent />
    </Suspense>
  );
}
\`\`\`

### 4. Virtual Scrolling

For long lists, use virtual scrolling libraries like react-window.

## Measuring Performance

Use React DevTools Profiler to identify performance bottlenecks.

## Conclusion

Start with these optimizations and measure their impact. Don't optimize prematurely!`,
      excerpt: 'Discover proven techniques to optimize your React applications for better performance and user experience.',
      author: 'Michael Chen',
      authorId: '2',
      date: '2024-11-15',
      category: 'React',
      categoryId: '1',
      tags: ['React', 'Performance', 'Optimization'],
      featuredImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
      readTime: 9,
      likes: 187,
      views: 2456,
    },
    {
      id: '6',
      title: 'Building Scalable React Components with Compound Pattern',
      content: `# Compound Component Pattern

The compound pattern lets components communicate implicitly through context, making them more flexible and scalable.

## What makes it compound?
Multiple components work together as a unit. Think of \`<select>\` with \`<option>\`.

## Real example
\`\`\`tsx
<Dialog>
  <Dialog.Header title="Confirm" />
  <Dialog.Content>Are you sure?</Dialog.Content>
  <Dialog.Footer>
    <Button onClick={onConfirm}>Yes</Button>
  </Dialog.Footer>
</Dialog>
\`\`\`

## Benefits
- Flexible layout
- Clear intent
- Easy to extend
- Child components share implicit state

## When to use
Complex UI patterns that need customization without prop explosion.`,
      excerpt: 'Master the compound component pattern to build flexible, reusable React components.',
      author: 'Sarah Johnson',
      authorId: '1',
      date: '2024-12-10',
      category: 'React',
      categoryId: '1',
      tags: ['React', 'Patterns', 'Components', 'Architecture'],
      featuredImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
      readTime: 7,
      likes: 145,
      views: 1842,
    },
    {
      id: '7',
      title: 'Advanced TypeScript: Conditional Types and Inference',
      content: `# Conditional Types & Inference

## Conditional types
Let type definitions branch based on conditions.

\`\`\`ts
type IsString<T> = T extends string ? true : false;
type A = IsString<"hello">; // true
type B = IsString<42>; // false
\`\`\`

## Type inference
Use \`infer\` to extract types from complex patterns.

\`\`\`ts
type ReturnTypeOf<T> = T extends (...args: any) => infer R ? R : never;
\`\`\`

## Use cases
- Deriving types from functions or arrays
- Building type-safe APIs
- Generic utility types

## Pro tip
Use conditional types carefully—they can make code harder to follow if overused.`,
      excerpt: 'Unlock advanced TypeScript features to build type-safe, maintainable applications.',
      author: 'Michael Chen',
      authorId: '2',
      date: '2024-12-11',
      category: 'TypeScript',
      categoryId: '2',
      tags: ['TypeScript', 'Advanced', 'Inference', 'Generics'],
      featuredImage: 'https://images.unsplash.com/photo-1516876437184-593fda40c7ce?w=800',
      readTime: 8,
      likes: 156,
      views: 1956,
    },
    {
      id: '8',
      title: 'CSS Grid Mastery: From Basics to Advanced Layouts',
      content: `# CSS Grid Deep Dive

## Grid basics
\`\`\`css
.container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 1rem;
}
\`\`\`

## Advanced features
- Named grid areas
- Auto-placement
- Subgrid (newer browsers)
- Repeat and minmax

## Common pattern: holy grail layout
\`\`\`css
grid-template-areas:
  "header header header"
  "sidebar content sidebar"
  "footer footer footer";
\`\`\`

## When to choose Grid vs Flexbox
- Grid: 2D layouts, page structure
- Flexbox: 1D alignment, component spacing

## Real-world tip
Combine Grid for layout + Flexbox for component internals.`,
      excerpt: 'Master CSS Grid to build complex, responsive layouts without struggling.',
      author: 'Emma Davis',
      authorId: '3',
      date: '2024-12-12',
      category: 'CSS',
      categoryId: '3',
      tags: ['CSS', 'Grid', 'Layout', 'Advanced'],
      featuredImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
      readTime: 8,
      likes: 198,
      views: 2634,
    },
    {
      id: '9',
      title: 'Database Query Optimization: From N+1 to Lightning Fast',
      content: `# Optimizing Database Queries

## The N+1 problem
Fetching a list and then making one query per item is slow.

## Solutions
- Batch queries
- Join tables
- Use prefetch/eager loading

## Example with ORMs
\`\`\`js
// Bad: N+1
const posts = await Post.find();
for (const post of posts) {
  const author = await Author.findById(post.authorId); // N queries!
}

// Good: eager loading
const posts = await Post.find().populate('author');
\`\`\`

## Other tips
- Index frequently queried columns
- Use pagination
- Cache results
- Profile queries first

## Conclusion
Measure, identify bottlenecks, then apply the right optimization.`,
      excerpt: 'Learn practical techniques to speed up database queries and improve app performance.',
      author: 'Michael Chen',
      authorId: '2',
      date: '2024-12-13',
      category: 'Web Development',
      categoryId: '4',
      tags: ['Database', 'Performance', 'SQL', 'Optimization'],
      featuredImage: 'https://images.unsplash.com/photo-1527014176819-7ce41b50057b?w=800',
      readTime: 7,
      likes: 167,
      views: 2121,
    },
    {
      id: '10',
      title: 'Building Real-time Apps with WebSockets',
      content: `# WebSockets for Real-time Features

## HTTP polling vs WebSockets
- Polling: client asks repeatedly (wasteful)
- WebSocket: persistent bidirectional connection

## When to use WebSockets
- Chat applications
- Live notifications
- Collaborative editing
- Gaming

## Simple example
\`\`\`js
const socket = new WebSocket('ws://server.com');
socket.onmessage = (e) => console.log(e.data);
socket.send(JSON.stringify({type: 'message', text: 'hi'}));
\`\`\`

## Best practices
- Handle disconnections gracefully
- Add heartbeat/ping-pong
- Use rooms/channels for filtering
- Scale with message queues

## Trade-offs
- More complex than HTTP
- Server must maintain connections
- Requires proper infrastructure`,
      excerpt: 'Build real-time features using WebSockets and handle scale gracefully.',
      author: 'Sarah Johnson',
      authorId: '1',
      date: '2024-12-14',
      category: 'Web Development',
      categoryId: '4',
      tags: ['WebSockets', 'Real-time', 'Node.js', 'Architecture'],
      featuredImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
      readTime: 8,
      likes: 189,
      views: 2742,
    },
    {
      id: '11',
      title: 'React Error Boundaries: Handling Errors Gracefully',
      content: `# Error Boundaries

Error boundaries catch JavaScript errors and show a fallback UI instead of crashing.

## How they work
\`\`\`tsx
class ErrorBoundary extends React.Component {
  componentDidCatch(error, info) {
    console.log(error);
  }
  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong</h1>;
    }
    return this.props.children;
  }
}
\`\`\`

## What they catch
- Render errors
- Lifecycle method errors
- Constructor errors

## What they don't catch
- Event handler errors (use try-catch)
- Async code (use .catch())
- Server-side rendering

## Best practice
Wrap different sections to limit the impact of errors.`,
      excerpt: 'Use error boundaries to gracefully handle React errors and improve UX.',
      author: 'Michael Chen',
      authorId: '2',
      date: '2024-12-15',
      category: 'React',
      categoryId: '1',
      tags: ['React', 'Error Handling', 'UX', 'Best Practices'],
      featuredImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
      readTime: 6,
      likes: 128,
      views: 1654,
    },
    {
      id: '12',
      title: 'Accessibility in React: Making Apps for Everyone',
      content: `# React Accessibility (a11y)

Accessibility isn't an afterthought—it's fundamental to good design.

## Common issues
- Missing \`alt\` text on images
- Poor color contrast
- Keyboard navigation broken
- Screen readers unsupported

## Quick wins
\`\`\`tsx
<img alt="User profile" src="..." />
<button aria-label="Close menu" onClick={handleClose} />
<input type="search" placeholder="Search..." />
\`\`\`

## Semantic HTML
- Use \`<button>\` not \`<div onClick>\`
- Use \`<h1>, <h2>, ...\` hierarchy
- Use \`<label>\` with inputs

## Testing tools
- axe DevTools
- WAVE
- Lighthouse

## Conclusion
Accessible sites work better for everyone, not just disabled users.`,
      excerpt: 'Learn accessibility best practices to build inclusive React applications.',
      author: 'Emma Davis',
      authorId: '3',
      date: '2024-12-16',
      category: 'React',
      categoryId: '1',
      tags: ['Accessibility', 'a11y', 'React', 'Best Practices'],
      featuredImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
      readTime: 7,
      likes: 142,
      views: 1873,
    },
    {
      id: '13',
      title: 'TypeScript Generics Explained: Build Flexible Types',
      content: `# TypeScript Generics

Generics let you write reusable code that works with many types.

## Basic example
\`\`\`ts
function getFirstItem<T>(arr: T[]): T {
  return arr[0];
}
\`\`\`

## Constraints
Limit what types are accepted.

\`\`\`ts
function logLength<T extends { length: number }>(x: T) {
  console.log(x.length);
}
\`\`\`

## Multiple type params
\`\`\`ts
function combine<T, U>(x: T, y: U): [T, U] {
  return [x, y];
}
\`\`\`

## When to use
- Reusable utilities
- Container types (Array, Promise)
- Data structures

## Pro tip
Use generics to avoid \`any\` and keep type safety.`,
      excerpt: 'Master TypeScript generics to write flexible, reusable, type-safe code.',
      author: 'Michael Chen',
      authorId: '2',
      date: '2024-12-17',
      category: 'TypeScript',
      categoryId: '2',
      tags: ['TypeScript', 'Generics', 'Patterns', 'Advanced'],
      featuredImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
      readTime: 7,
      likes: 134,
      views: 1745,
    },
    {
      id: '14',
      title: 'CSS Preprocessors: Sass/SCSS vs PostCSS',
      content: `# Preprocessors: Sass vs PostCSS

## Sass/SCSS
Full programming language for CSS.
- Variables, nesting, mixins
- Shorter code, less repetition
- Compiled to CSS

## PostCSS
Tool to transform CSS with plugins.
- Autoprefixer, Tailwind, PurgeCSS
- More flexible and modular
- Can be combined with Sass

## Comparison
- Sass: great for large projects with lots of duplication
- PostCSS: better for modern tooling and plugins

## Modern approach
Use Tailwind (PostCSS-based) for utility-first design, or Sass for component-focused styles.

## My recommendation
Start with Tailwind, add Sass if you need deeper nesting.`,
      excerpt: 'Understand CSS preprocessors and choose the right tool for your project.',
      author: 'Emma Davis',
      authorId: '3',
      date: '2024-12-18',
      category: 'CSS',
      categoryId: '3',
      tags: ['CSS', 'Sass', 'PostCSS', 'Preprocessing'],
      featuredImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
      readTime: 6,
      likes: 98,
      views: 1289,
    },
    {
      id: '15',
      title: 'API Design Best Practices: REST vs GraphQL',
      content: `# API Design: REST vs GraphQL

## REST
- Simple, widely understood
- Resources as endpoints: /users, /posts
- Over-fetching and under-fetching issues

## GraphQL
- Single endpoint
- Query exactly what you need
- Great for mobile (less bandwidth)
- Steeper learning curve

## REST best practices
- Versioning (/v1, /v2)
- Consistent naming
- Proper HTTP methods
- Clear error codes

## GraphQL best practices
- Schema-first design
- Prevent deep nesting with depth limiting
- Implement rate limiting
- Cache strategically

## When to choose
- REST: simple CRUD APIs, team familiar with REST
- GraphQL: complex queries, mobile-first, varying client needs

## Hybrid approach
Use REST for public APIs, GraphQL for internal clients.`,
      excerpt: 'Learn REST and GraphQL design principles to build better APIs.',
      author: 'Sarah Johnson',
      authorId: '1',
      date: '2024-12-19',
      category: 'Web Development',
      categoryId: '4',
      tags: ['API', 'REST', 'GraphQL', 'Architecture'],
      featuredImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
      readTime: 9,
      likes: 176,
      views: 2334,
    },
    {
      id: '16',
      title: 'React Custom Hooks: Reuse Stateful Logic',
      content: `# Custom Hooks

Extract component logic into reusable functions.

## Simple example
\`\`\`tsx
function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue);
  return {
    value,
    onChange: (e) => setValue(e.target.value),
    reset: () => setValue(initialValue)
  };
}

function LoginForm() {
  const email = useFormInput('');
  const password = useFormInput('');
  return <input {...email} />;
}
\`\`\`

## Rules of hooks
- Only call at top level
- Only in React functions/components

## Common hooks
- useLocalStorage
- useFetch
- useDebounce
- useAsync

## Benefits
- Cleaner components
- Reusable logic
- Easier testing

## Pro tip
Use \`eslint-plugin-react-hooks\` to catch violations.`,
      excerpt: 'Build custom React hooks to extract and reuse component logic.',
      author: 'Michael Chen',
      authorId: '2',
      date: '2024-12-20',
      category: 'React',
      categoryId: '1',
      tags: ['React', 'Hooks', 'Patterns', 'Reusability'],
      featuredImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
      readTime: 7,
      likes: 161,
      views: 2087,
    },
    {
      id: '17',
      title: 'Debugging TypeScript: Common Pitfalls and Solutions',
      content: `# Debugging TypeScript

## Common issues

### any leaking everywhere
- Use \`strict: true\` in tsconfig
- Avoid \`any\` unless absolutely necessary
- Use \`unknown\` instead

### Type not narrowing correctly
\`\`\`ts
if (typeof x === 'string') {
  // x is now string
}
\`\`\`

### Module not found
- Check import paths
- Verify \`tsconfig.json\` paths config
- Check package.json exports

### Inferring the wrong type
- Use explicit annotations for clarity
- Check type inference with hover

## Tools
- VSCode IntelliSense
- TypeScript Playground
- Type assertions for testing

## Strategy
1. Enable strict mode
2. Address compiler errors first
3. Add tests to catch runtime bugs
4. Use type guards for runtime checks`,
      excerpt: 'Learn how to debug TypeScript issues and write cleaner type definitions.',
      author: 'Sarah Johnson',
      authorId: '1',
      date: '2024-12-21',
      category: 'TypeScript',
      categoryId: '2',
      tags: ['TypeScript', 'Debugging', 'Best Practices'],
      featuredImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
      readTime: 7,
      likes: 119,
      views: 1534,
    },
    {
      id: '18',
      title: 'CSS Animations: Performance and Best Practices',
      content: `# CSS Animations

## Hardware acceleration
Use \`transform\` and \`opacity\` for smooth 60fps animations.

## Bad
\`\`\`css
.box {
  animation: slide 1s;
}
@keyframes slide {
  from { left: 0; } /* repaints! */
  to { left: 100px; }
}
\`\`\`

## Good
\`\`\`css
@keyframes slide {
  from { transform: translateX(0); }
  to { transform: translateX(100px); }
}
\`\`\`

## Properties to animate
- Fast: transform, opacity
- Slow: left, top, width, height (causes reflow)

## Browser DevTools
- Performance tab shows paint and rendering
- Check frame rate

## When to use JavaScript
- Complex interactive animations
- Event-driven transitions
- Real-time calculations

## Best practice
Start with CSS, use JS only when needed.`,
      excerpt: 'Create smooth, performant animations using CSS best practices.',
      author: 'Emma Davis',
      authorId: '3',
      date: '2024-12-22',
      category: 'CSS',
      categoryId: '3',
      tags: ['CSS', 'Animations', 'Performance'],
      featuredImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
      readTime: 6,
      likes: 145,
      views: 1876,
    },
    {
      id: '19',
      title: 'Logging and Monitoring in Production',
      content: `# Production Logging

## Structured logging
Log as JSON objects, not plain strings.

\`\`\`json
{
  "timestamp": "2024-12-22T10:30:00Z",
  "level": "error",
  "userId": "user123",
  "action": "checkout",
  "message": "Payment failed"
}
\`\`\`

## Log levels
- DEBUG: development only
- INFO: important events
- WARN: unexpected but handled
- ERROR: failures that need attention

## Tools
- Winston, Pino (Node.js logging)
- Datadog, New Relic (APM)
- Sentry (error tracking)

## Best practices
- Don't log sensitive data
- Include request IDs for tracing
- Set appropriate retention
- Use sampling for high-volume logs

## Performance
- Async logging
- Batching
- Don't log in hot code paths`,
      excerpt: 'Implement effective logging and monitoring to keep production apps healthy.',
      author: 'Michael Chen',
      authorId: '2',
      date: '2024-12-23',
      category: 'Web Development',
      categoryId: '4',
      tags: ['Logging', 'Monitoring', 'DevOps', 'Production'],
      featuredImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
      readTime: 8,
      likes: 134,
      views: 1742,
    },
    {
      id: '20',
      title: 'React Suspense: Loading States Done Right',
      content: `# React Suspense

Suspense lets you declare loading states before data is ready.

## Basic idea
\`\`\`tsx
<Suspense fallback={<Spinner />}>
  <LazyComponent />
</Suspense>
\`\`\`

## Use cases
- Code splitting with lazy()
- Data fetching frameworks
- Showing skeleton screens

## Example with lazy loading
\`\`\`tsx
const AdminPanel = lazy(() => import('./AdminPanel'));

<Suspense fallback={<div>Loading...</div>}>
  <AdminPanel />
</Suspense>
\`\`\`

## Suspense boundaries
Nest multiple boundaries for granular control.

## With frameworks
Next.js, Remix support Suspense for data fetching.

## Current limitations
- Works for imports + some libraries
- Still stabilizing for general data fetching

## Future
Suspense will be the standard for async operations.`,
      excerpt: 'Use React Suspense to handle async operations and loading states elegantly.',
      author: 'Sarah Johnson',
      authorId: '1',
      date: '2024-12-24',
      category: 'React',
      categoryId: '1',
      tags: ['React', 'Suspense', 'Loading', 'Async'],
      featuredImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
      readTime: 6,
      likes: 151,
      views: 1945,
    },
    {
      id: '21',
      title: 'TypeScript Module Augmentation and Declaration Merging',
      content: `# Module Augmentation & Declaration Merging

Extend third-party types without forking the code.

## Declaration merging
\`\`\`ts
interface User {
  name: string;
}

interface User {
  email: string;
}

// Result
const user: User = { name: 'John', email: 'john@example.com' };
\`\`\`

## Module augmentation
Extend library types:

\`\`\`ts
declare module 'express' {
  interface Request {
    userId?: string;
  }
}

app.get('/', (req: Request) => {
  console.log(req.userId); // works!
});
\`\`\`

## Common use cases
- Adding custom properties to window
- Extending library interfaces
- Vendor-specific type patches

## Pros & cons
- Pro: no forking needed
- Con: can be confusing
- Use sparingly and document well`,
      excerpt: 'Extend third-party types safely using module augmentation and declaration merging.',
      author: 'Michael Chen',
      authorId: '2',
      date: '2024-12-25',
      category: 'TypeScript',
      categoryId: '2',
      tags: ['TypeScript', 'Advanced', 'Modules', 'Types'],
      featuredImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
      readTime: 6,
      likes: 108,
      views: 1412,
    },
    {
      id: '22',
      title: 'Flexbox vs Grid: When to Use Each',
      content: `# Flexbox vs Grid: Complete Guide

## Flexbox (1D layout)
- Single row or column
- Great for components
- Simpler learning curve

## Grid (2D layout)
- Rows and columns simultaneously
- Better for page layouts
- More powerful

## Practical examples

### Use Flexbox
- Navigation bars
- Button groups
- Component spacing
- Alignment

### Use Grid
- Page layouts (header, sidebar, content, footer)
- Card grids
- Dashboard panels
- Complex layouts

## Can you combine them?
Yes! Use Grid for overall page structure, Flexbox for component internals.

\`\`\`css
.page {
  display: grid;
  grid-template-areas: "header" "content" "footer";
}

.nav {
  display: flex;
  justify-content: space-between;
}
\`\`\`

## Learning path
1. Master Flexbox first (easier)
2. Learn Grid concepts
3. Combine them strategically`,
      excerpt: 'Understand the differences between Flexbox and Grid and use each effectively.',
      author: 'Emma Davis',
      authorId: '3',
      date: '2024-12-26',
      category: 'CSS',
      categoryId: '3',
      tags: ['CSS', 'Flexbox', 'Grid', 'Layout'],
      featuredImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
      readTime: 7,
      likes: 187,
      views: 2456,
    },
    {
      id: '23',
      title: 'Testing React Components: Unit Tests and Integration Tests',
      content: `# Testing React Components

## Types of tests
- Unit: component in isolation
- Integration: multiple components together
- E2E: full user flows

## Tools
- Jest: test runner
- React Testing Library: testing utilities
- Cypress/Playwright: E2E

## Example unit test
\`\`\`tsx
import { render, screen } from '@testing-library/react';
import Button from './Button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
\`\`\`

## Best practices
- Test behavior, not implementation
- Use semantic queries (getByRole, getByLabelText)
- Avoid testing internals
- Keep tests simple

## Coverage
- Aim for 80%+ coverage
- Quality > quantity
- Focus on important paths`,
      excerpt: 'Write effective tests for React components using Jest and Testing Library.',
      author: 'Sarah Johnson',
      authorId: '1',
      date: '2024-12-27',
      category: 'React',
      categoryId: '1',
      tags: ['React', 'Testing', 'Jest', 'Unit Testing'],
      featuredImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
      readTime: 8,
      likes: 172,
      views: 2143,
    },
    {
      id: '24',
      title: 'Building Design Systems with Storybook',
      content: `# Design Systems & Storybook

Storybook is a tool for building and documenting component libraries.

## Why Storybook?
- Isolated component development
- Live documentation
- Design system consistency
- Component discovery

## Basic setup
\`\`\`bash
npx sb init
npm run storybook
\`\`\`

## Writing stories
\`\`\`tsx
import Button from './Button';

export default { component: Button };

export const Primary = { args: { variant: 'primary', children: 'Click' } };
export const Disabled = { args: { disabled: true, children: 'Disabled' } };
\`\`\`

## Advanced features
- Controls for interactive props
- Actions for event logging
- Viewport testing
- Visual regression

## Design system
- Document component API
- Show variations
- Provide copy-paste examples
- Link to guidelines

## Teams
Shared reference for designers and developers.`,
      excerpt: 'Use Storybook to build and document reusable component libraries effectively.',
      author: 'Emma Davis',
      authorId: '3',
      date: '2024-12-28',
      category: 'React',
      categoryId: '1',
      tags: ['React', 'Storybook', 'Design Systems', 'Components'],
      featuredImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
      readTime: 7,
      likes: 139,
      views: 1867,
    },
    {
      id: '25',
      title: 'Environment Variables and Secrets Management',
      content: `# Managing Secrets and Config

## Environment variables
Store config outside code: API keys, database URLs, etc.

\`\`\`bash
# .env.local
REACT_APP_API_URL=https://api.example.com
DATABASE_PASSWORD=secret123
\`\`\`

## Never commit secrets
Add \`.env.local\` to \`.gitignore\`.

## Tools
- dotenv: load .env files
- Vercel/Netlify: built-in env management
- Vault: for production secrets
- Secrets Manager (AWS, Azure)

## Best practices
- Different secrets per environment
- Rotate regularly
- Use least privilege
- Audit access logs

## In React
- Use REACT_APP_ prefix for client-side
- Never expose secrets to client
- Fetch sensitive data from backend

## CI/CD
- Inject secrets at deploy time
- Use GitHub Secrets, etc.
- Avoid hardcoding anywhere

## Security checklist
- Never log secrets
- Use HTTPS everywhere
- Restrict access
- Monitor usage`,
      excerpt: 'Properly manage environment variables and secrets to keep your app secure.',
      author: 'Michael Chen',
      authorId: '2',
      date: '2024-12-29',
      category: 'Web Development',
      categoryId: '4',
      tags: ['Security', 'DevOps', 'Environment', 'Best Practices'],
      featuredImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
      readTime: 7,
      likes: 156,
      views: 1998,
    },
  ],
  categories: [
    {
      id: '1',
      name: 'React',
      description: 'Articles about React and modern frontend development',
      postCount: 2,
      color: '#00E6E6',
    },
    {
      id: '2',
      name: 'TypeScript',
      description: 'TypeScript tips, tricks, and best practices',
      postCount: 1,
      color: '#3178C6',
    },
    {
      id: '3',
      name: 'CSS',
      description: 'Modern CSS techniques and layouts',
      postCount: 1,
      color: '#FF6B6B',
    },
    {
      id: '4',
      name: 'Web Development',
      description: 'General web development topics',
      postCount: 1,
      color: '#51CF66',
    },
  ],
  authors: [
    {
      id: '1',
      name: 'Sarah Johnson',
      bio: 'Senior Frontend Developer with 8+ years of experience. Passionate about React, TypeScript, and building accessible web applications.',
      avatar: 'https://i.pravatar.cc/150?img=1',
      role: 'Senior Frontend Developer',
      socialLinks: {
        twitter: 'https://twitter.com/sarahj',
        github: 'https://github.com/sarahj',
        linkedin: 'https://linkedin.com/in/sarahj',
      },
    },
    {
      id: '2',
      name: 'Michael Chen',
      bio: 'Full-stack developer and tech blogger. Loves exploring new technologies and sharing knowledge with the community.',
      avatar: 'https://i.pravatar.cc/150?img=12',
      role: 'Full Stack Developer',
      socialLinks: {
        twitter: 'https://twitter.com/mchen',
        github: 'https://github.com/mchen',
      },
    },
    {
      id: '3',
      name: 'Emma Davis',
      bio: 'UI/UX Designer and CSS enthusiast. Specializes in creating beautiful, responsive web interfaces.',
      avatar: 'https://i.pravatar.cc/150?img=5',
      role: 'UI/UX Designer',
      socialLinks: {
        twitter: 'https://twitter.com/emmad',
        linkedin: 'https://linkedin.com/in/emmad',
      },
    },
  ],
  comments: [
    {
      id: '1',
      postId: '1',
      author: 'John Doe',
      content: 'Great article! This really helped me understand state management better.',
      date: '2024-12-02',
      likes: 5,
    },
    {
      id: '2',
      postId: '1',
      author: 'Jane Smith',
      content: 'Would love to see more examples with Redux Toolkit!',
      date: '2024-12-02',
      likes: 3,
    },
    {
      id: '3',
      postId: '2',
      author: 'Alex Brown',
      content: 'TypeScript has been a game-changer for our team. Thanks for sharing these tips!',
      date: '2024-11-29',
      likes: 8,
    },
    
  ],
  selectedPostId: null,
  selectedCategoryId: null,
  searchQuery: '',
  viewMode: 'grid',
};
