
import { describe, it, expect,  } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { createStateStore } from './createStateStore';

describe('createStateStore', () => {
    it('should initialize with default state', () => {
        const { useSRASM } = createStateStore({ counter: 0 });
        const { result } = renderHook(() => useSRASM('counter'));

        expect(result.current.state).toBe(0);
    });

    it('should update state using setState with a value', () => {
        const { useSRASM } = createStateStore({ counter: 0 });
        const { result } = renderHook(() => useSRASM('counter'));

        act(() => {
            result.current.setState(5);
        });

        expect(result.current.state).toBe(5);
    });

    it('should update state using setState with a function', () => {
        const { useSRASM } = createStateStore({ counter: 0 });
        const { result } = renderHook(() => useSRASM('counter'));

        act(() => {
            result.current.setState((prev) => prev + 1);
        });

        expect(result.current.state).toBe(1);
    });

    it('should support selectors', () => {
        const { useSRASM } = createStateStore({ user: { name: 'Alice', age: 25 } });
        const { result } = renderHook(() => useSRASM('user', (s) => s.name));

        expect(result.current.state).toBe('Alice');
    });

    it('should only re-render when selected state changes', () => {
        const { useSRASM } = createStateStore({ user: { name: 'Alice', age: 25 } });

        // We'll track render count
        let renderCount = 0;
        const { result } = renderHook(() => {
            renderCount++;
            return useSRASM('user', (s) => s.name);
        });

        expect(result.current.state).toBe('Alice');
        expect(renderCount).toBe(1);

        // Update part of state that is NOT selected
        act(() => {
            // We need a way to update the state from outside specifically to test this isolation,
            // but since our API exposes setState via the hook, we can use a separate hook or the same one.
            // Let's use the setState from the result to update 'age', which shouldn't affect 'name'.
            // However, useSRASM returns a setState that updates the *whole slice*.
            // So we update the whole user object but keep name the same.
            result.current.setState((prev) => ({ ...prev, age: 26 }));
        });

        expect(result.current.state).toBe('Alice');
        // It might re-render because the selector runs on the new state. 
        // If the selected value is the same (referentially or by value), useSyncExternalStore should avoid re-render.
        // 'Alice' === 'Alice', so it should NOT re-render the component component using the hook.
        // However, strictly speaking renderHook captures one render.
        // Let's check if the result value is stable.
        expect(renderCount).toBe(1);
    });

    it('should use deep equality check if enabled', () => {
        const { useSRASM } = createStateStore({ config: { theme: 'dark', verified: true } });
        const { result } = renderHook(() => useSRASM('config', undefined, { useDeepEqualCheck: true }));

        const initialObj = result.current.state;

        act(() => {
            // Set state to a NEW object but with IDENTICAL content
            result.current.setState({ theme: 'dark', verified: true });
        });

        // Should be the same exact object reference if deep check worked and prevented update?
        // Actually, `createStateStore` logic: 
        // if payload equals current (deeply), it returns early.
        // So the store state remains the *original* object reference.
        expect(result.current.state).toBe(initialObj);
    });

    it('should separate slices independently', () => {
        const { useSRASM } = createStateStore({
            sliceA: 'A',
            sliceB: 'B'
        });

        const hookA = renderHook(() => useSRASM('sliceA'));
        const hookB = renderHook(() => useSRASM('sliceB'));

        expect(hookA.result.current.state).toBe('A');
        expect(hookB.result.current.state).toBe('B');

        act(() => {
            hookA.result.current.setState('A-updated');
        });

        expect(hookA.result.current.state).toBe('A-updated');
        expect(hookB.result.current.state).toBe('B');
    });
});
