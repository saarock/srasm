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
