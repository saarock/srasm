import React, { createContext, useReducer, useContext, useMemo } from "react";

/**
 * Factory function to create a fully-typed state management store.
 * Supports multiple independent slices of state.
 *
 * @template Slices - The shape of your state slices. [Slices === State]
 * @param initialSlices - Initial state for each slice.
 * @returns { SRSMProvider, useSlice } - Provider component and hook to consume slices.
 */
export function createStateStore<Slices extends Record<string, any>>(
  initialSlices: Slices
) {
  type SliceKey = keyof Slices;

  const sliceContexts: Record<string, any> = {};
  const sliceProviders: any[] = [];

  // -------------------- Individual Slice Contexts -------------------- //
  for (const key of Object.keys(initialSlices)) {
    const SliceContext = createContext<{
      state: any;
      setState: (payload: any) => void;
    } | null>(null);

    sliceContexts[key] = SliceContext;

    const reducer = (state: any, action: any) => {
      if (action.type === "SET_STATE") {
        // If both current state and payload are objects, merge
        if (
          typeof state === "object" &&
          state !== null &&
          typeof action.payload === "object" &&
          action.payload !== null
        ) {
          return { ...state, ...action.payload };
        } else {
          // Otherwise, just replace the state (for primitives)
          return action.payload;
        }
      }
      return state;
    };

    function SliceProvider({
      children,
    }: {
      children: React.ReactNode;
      sliceKey: SliceKey;
    }) {
      const [state, dispatch] = useReducer(reducer, initialSlices[key]);

      const setState = (
        payload: Partial<any> | ((prev: any) => Partial<any>)
      ) => {
        // alert(payload);
        const prev = state;

        const next =
          typeof payload === "function"
            ? payload(prev) // if payload is a function, call it with prev
            : typeof payload === "object" && payload !== null
            ? { ...payload } // if payload is an object, shallow copy
            : payload; // if primitive (string, number, boolean), just use it

        dispatch({ type: "SET_STATE", payload: next });
      };

      const memoValue = useMemo(() => ({ state, setState }), [state]);

      return (
        <SliceContext.Provider value={memoValue}>
          {children}
        </SliceContext.Provider>
      );
    }

    sliceProviders.push(SliceProvider);
  }

  // -------------------- Composed Provider -------------------- //
  const SRSMProvider = ({ children }: { children: React.ReactNode }) => {
    const wrappedSlices = sliceProviders.reduceRight(
      (acc, Provider) => <Provider>{acc}</Provider>,
      children
    );
    return wrappedSlices;
  };

  // -------------------- useSlice Hook -------------------- //
  function useSRASM<K extends SliceKey>(slice: K) {
    const ctx = useContext(sliceContexts[slice as string]);
    if (!ctx) throw new Error(`Slice '${String(slice)}' not found`);

    type Updater =
      | Partial<Slices[K]>
      | ((prev: Slices[K]) => Partial<Slices[K]>);

    return ctx as {
      state: Slices[K];
      setState: (payload: Updater) => void;
    };
  }

  return { SRSMProvider, useSRASM };
}
