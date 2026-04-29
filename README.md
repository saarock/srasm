# srasm

[![npm version](https://img.shields.io/npm/v/srasm.svg)](https://www.npmjs.com/package/srasm)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**srasm** is a lightweight, ultra-fast state management library for React designed for modern applications. It combines the simplicity of local state with the power of global stores, built-in caching, and intelligent tag-based invalidation.

## Why srasm?

- 🚀 **Performance First**: Built with `useSyncExternalStore` for teardown-free, tearing-free updates.
- 📦 **Zero Dependencies**: (almost) — focused on being as lean as possible.
- 💾 **Automatic Caching**: Built-in deduplication and caching for asynchronous queries.
- 🏷️ **Tag Invalidation**: Effortlessly keep your data fresh with a powerful tag-based system.
- 🎯 **Type Safe**: Fully written in TypeScript with excellent developer experience.

---

## Installation

```bash
npm install srasm
```

---

## Quick Start

### 1. Initialize your store

Define your initial state slices. `srasm` will infer types automatically.

```typescript
// store.ts
import { createStateStore } from 'srasm';

export const { useSRASM, useSRASMAsync } = createStateStore({
  counter: 0,
  user: { name: 'Guest', loggedIn: false },
  todos: [] as any[],
});
```

### 2. Wrap your application

```tsx
// main.tsx
import { SRASMProvider } from './store';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <SRASMProvider>
    <App />
  </SRASMProvider>
);
```

### 3. Use Synchronous State

```tsx
function Counter() {
  const { state, setState } = useSRASM('counter');

  return (
    <button onClick={() => setState(state + 1)}>
      Count is {state}
    </button>
  );
}
```

---

## Advanced Usage: Asynchronous State

`srasm` handles async operations with a powerful `useSRASMAsync` hook that supports caching and tag invalidation.

### Fetching Data (GET)

```tsx
const { data, loading, error, refetch } = useSRASMAsync(
  'todos',
  async () => {
    const res = await fetch('/api/todos');
    return res.json();
  },
  {
    method: 'GET',
    key: 'todos_list', // Required for caching
    providesTags: ['todos_tag'], // Tags this query provides
  }
);
```

### Mutations (POST/PUT/DELETE)

Mutations can automatically invalidate queries by their tags, triggering an automatic refetch.

```tsx
const { createTodo, loading } = useSRASMAsync(
  'todos',
  async (newTodo) => {
    const res = await fetch('/api/todos', {
      method: 'POST',
      body: JSON.stringify(newTodo),
    });
    return res.json();
  },
  {
    method: 'POST',
    hookName: 'createTodo', // Custom name for the returned function
    invalidatesTags: ['todos_tag'], // Automatically refetches 'todos' query
  }
);

// Use it in your component
const handleAdd = () => createTodo({ title: 'New Task' });
```

---

## API Reference

### `createStateStore(initialState)`
Initializes the store with the provided state slices. Returns hooks and providers.

### `useSRASM(sliceName, selector?, options?)`
- `sliceName`: The key of the state slice.
- `selector`: (Optional) Function to pick specific parts of the slice.
- `options`: `{ useDeepEqualCheck: boolean }`.

### `useSRASMAsync(sliceName, fetcher, options)`
- **GET Options**:
  - `key`: string (Required for caching).
  - `providesTags`: string[].
  - `skip`: boolean.
- **Mutation Options**:
  - `method`: 'POST' | 'PUT' | 'DELETE' | 'PATCH'.
  - `hookName`: The name of the function returned (e.g., `createTodo`).
  - `invalidatesTags`: string[].

---

## License

MIT © [srasm](https://github.com/srasm/srasm)
