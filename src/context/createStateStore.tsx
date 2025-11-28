import React, { createContext, useReducer, useContext, useMemo } from "react";

const code = `
  self.onmessage = (e) => {
    postMessage(e.data * 3);
  }
`;

const blob = new Blob([code], { type: "application/javascript" });
const SRASMWorker = new Worker(URL.createObjectURL(blob));
// App.tsx
const aiWorker = new Worker(
  new URL("../workers/AiWorker.ts", import.meta.url),
  { type: "module" }
);

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
  const slices: Partial<Slices> = {};

  // -------------------- Individual Slice Contexts -------------------- //
  for (const key of Object.keys(initialSlices)) {
    const SliceContext = createContext<{
      state: any;
      setState: (payload: any) => void;
    } | null>(null);

    sliceContexts[key] = SliceContext;

    const reducer = (state: any, action: any) => {
      // alert(action.payload)
      if (action.type === "SET_STATE") return { ...state, ...action.payload };
      return state;
    };

    function SliceProvider({
      children,
      sliceKey,
    }: {
      children: React.ReactNode;
      sliceKey: SliceKey;
    }) {
      const [state, dispatch] = useReducer(reducer, initialSlices[key]);

      const setState = (
        payload: Partial<any> | ((prev: any) => Partial<any>)
      ) => {
        slices[sliceKey] = slices[sliceKey] || initialSlices[sliceKey];
        const prev = slices[sliceKey];

        const next =
          typeof payload === "function"
            ? { ...prev, ...payload(prev) }
            : { ...prev, ...payload };

        slices[sliceKey] = next; // update global s
        // console.log(next);
        
        // Send to AI worker to predict heavy slice
        // aiWorker.postMessage({ slice: key, payload });
        dispatch({ type: "SET_STATE", payload: next });

        // aiWorker.onmessage = (e) => {
        // const { isHeavy, payload } = e.data;

        // if (isHeavy) {
        //   // Send to SRASMWorker for heavy computation
        //   SRASMWorker.postMessage({ slice: key, payload });

        //   // Listen for the result from SRASMWorker
        //   SRASMWorker.onmessage = (e) => {
        //     const newState = e.data;
        //     console.log("haha ");
        //     console.log(newState);

        //     // Update the slice state
        //     // alert()
        //     dispatch({ type: "SET_STATE", payload: newState });
        //   };
        // } else {
        //   // Light slice → normal dispatch
        //   dispatch({ type: "SET_STATE", payload });
        // }
        // };
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
