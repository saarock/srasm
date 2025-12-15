# SRASM Best Practices

To get the most out of SRASM, follow these guidelines. They will help you keep your application performant, maintainable, and bug-free.

## 1. Select Only What You Need

The most important performance feature of SRASM is the `selector` function in `useSRASM`.

**❌ BAD:** Subscribing to the entire slice.
```typescript
const { state } = useSRASM("bigSlice");
// This re-renders whenever ANYTHING in 'bigSlice' changes.
```

**✅ GOOD:** Selecting specific properties.
```typescript
const { state: userName } = useSRASM("bigSlice", (s) => s.user.name);
// This ONLY re-renders when 'user.name' changes.
```

Always be granular with your selectors. This leverages `useSyncExternalStore` to prevent wasted render cycles.

## 2. Normalize Your State

Avoid deeply nested state objects. Deep nesting makes updating state ("immutable updates") difficult and error-prone.

**❌ BAD:** Deep nesting.
```typescript
interface BlogState {
  posts: {
    byId: {
      [id: string]: {
        comments: {
          byId: { ... }
        }
      }
    }
  }
}
```

**✅ GOOD:** Flat, normalized slices.
```typescript
// Define separate slices or flat structures
interface PostsSlice {
  byId: Record<string, Post>;
  allIds: string[];
}
interface CommentsSlice {
  byId: Record<string, Comment>;
}
```

## 3. Immutable Updates

SRASM relies on reference equality to detect changes. You **MUST** update state immutably.

**❌ BAD:** Mutating state directly.
```typescript
setState((prev) => {
  prev.count++; // 🚨 Mutation! React won't see this change.
  return prev;
});
```

**✅ GOOD:** Returning a new object.
```typescript
setState((prev) => ({
  ...prev,
  count: prev.count + 1
}));
```

## 4. Initializing State

Always ensure your `initialSlices` passed to `createStateStore` match your TypeScript interfaces exactly. `undefined` values in initial state can lead to runtime errors when destructuring.

## 5. Using `options.isEqual`

For complex selectors where you return a new object every time (e.g., mapping an array), the default reference check will fail (cause re-renders). Use `deepEqual` or a custom comparator.

```typescript
const { state } = useSRASM(
  "todos",
  (s) => s.list.map(t => t.id), // Returns a new array instance on every run!
  {
    useDeepEqualCheck: true // Fixes the issue by checking content, not reference.
  }
);
```
