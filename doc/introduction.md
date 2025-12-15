# Welcome to SRASM

**Saarock React AI State Management (SRASM)** is a modern, lightweight, and atomic state management library designed for React applications. It leverages the power of `useSyncExternalStore` to provide optimal performance, minimal re-renders, and seamless integration with AI-powered features.

## Why SRASM?

In the evolving landscape of React state management, SRASM stands out by offering:

- **Atomic Slices**: Break your state into independent, manageable chunks called "slices".
- **Performance First**: Built on top of React's `useSyncExternalStore`, ensuring consistent concurrent rendering and zero tearing.
- **Selective Subscriptions**: Components only re-render when the specific data they select changes.
- **AI-Native**: Built-in hooks and workers for AI-driven error debugging and chat interfaces.
- **Type Safety**: First-class TypeScript support for a robust development experience.

## Quick Start

Get up and running with SRASM in seconds.

### 1. Define Your State

Create your initial state slices.

```typescript
// store.ts
import { createStateStore } from "./srasm"; // Path to your SRASM library

interface CounterSlice {
  count: number;
}

interface UserSlice {
  name: string;
}

const counterState: CounterSlice = { count: 0 };
const userState: UserSlice = { name: "Guest" };

export const { SRASMProvider, useSRASM } = createStateStore({
  counter: counterState,
  user: userState,
});
```

### 2. Wrap Your App

Provide the store to your application using the generated `SRASMProvider`.

```tsx
// App.tsx
import { SRASMProvider } from "./store";

function App() {
  return (
    <SRASMProvider>
      <MainComponent />
    </SRASMProvider>
  );
}
```

### 3. Use the Hook

Access specific slices and update them with ease.

```tsx
// Counter.tsx
import { useSRASM } from "./store";

export function Counter() {
  // Select only the 'count' property. This component ONLY re-renders when 'count' changes.
  const { state: count, setState } = useSRASM("counter", (s) => s.count);

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setState((prev) => ({ ...prev, count: prev.count + 1 }))}>
        Increment
      </button>
    </div>
  );
}
```

## Core Philosophy

SRASM encourages a **slice-based architecture**. Instead of a single monolithic state object, you define distinct domains (slices) of your application state (e.g., `auth`, `posts`, `ui`). This makes your codebase easier to reason about, test, and scale.

Ready to dive deeper? Check out the [API Reference](./api-reference.md).
