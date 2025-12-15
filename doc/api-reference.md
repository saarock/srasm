# API Reference

This section details the core API of SRASM.

## `createStateStore<Slices>(initialSlices)`

The entry point for creating your SRASM store.

### Parameters

- `initialSlices` (`Slices`): An object where keys are slice names and values are the initial state objects for those slices.

### Returns

Returns an object containing the provider and the hook, typed specifically for your store.

- `SRASMProvider`: The context provider component.
- `useSRASM`: The strongly-typed hook for accessing state.

### Example

```typescript
const { SRASMProvider, useSRASM } = createStateStore({
  auth: { user: null, token: "" },
  theme: { mode: "dark" },
});
```

---

## `<SRASMProvider />`

A React context provider that initializes the store and makes it available to the component tree.

### Props

- `children` (`React.ReactNode`): The components to be rendered within the provider.
- `relevantCode` (optional): Used for the AI Error Boundary feature.
- `additionalSlices` (optional): Array of extra state objects to be tracked by the error boundary.

### Usage

```tsx
<SRASMProvider>
  <App />
</SRASMProvider>
```

---

## `useSRASM(slice, selector?, options?)`

The primary hook for consuming and updating state.

### Signature

```typescript
function useSRASM<K extends keyof Slices, Selected>(
  slice: K,
  selector?: (state: Slices[K]) => Selected,
  options?: {
    useDeepEqualCheck?: boolean;
    isEqual?: (a: Selected, b: Selected) => boolean;
  }
): {
  state: Selected;
  setState: (payload: Partial<Slices[K]> | ((prev: Slices[K]) => Partial<Slices[K]>)) => void;
}
```

### Parameters

1. **`slice`** (`K`): The key of the slice you want to access (e.g., `"auth"`, `"counter"`).
2. **`selector`** (optional): A function to transform or pick specific parts of the slice state.
   - If omitted, returns the entire slice state.
   - **Performance Tip**: Always use a selector to subscribe only to the data you need. This prevents unnecessary re-renders.
3. **`options`** (optional):
   - `useDeepEqualCheck` (`boolean`): If `true`, performs a deep comparison before updating state. Useful for complex objects.
   - `isEqual` (`function`): Custom equality function for the selector. Defaults to `Object.is`.

### Returns

- **`state`**: The selected state value.
- **`setState`**: A function to update the slice state.

### `setState` Usage

`setState` accepts either a partial state object or a functional update.

**1. Object Update (Merge):**

```typescript
// Updates 'name', keeps other properties
setState({ name: "Alice" });
```

**2. Functional Update:**

```typescript
// Access previous state to calculate new state
setState((prev) => ({ count: prev.count + 1 }));
```

---

## Helpers

### `deepEqual(objA, objB)`

A utility function used internally (and available for export) to perform deep comparison of objects. It checks for structural equality.
