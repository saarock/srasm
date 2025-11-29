import { deepEqual } from "../utils/deepEqual";
import React, {
  createContext,
  useReducer,
  useContext,
  useMemo,
  useCallback,
} from "react";

/**
 * Error wroker helps to find the best error from the ai
 */
const errorWorker = new Worker(
  new URL("../workers/ErrorWorker.ts", import.meta.url),
  {
    type: "module",
  }
);

// const heavyComputation = new Worker(
//   new URL("../workers/ErrorWorker.ts", import.meta.url),
//   {
//     type: "module",
//   }
// );

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

    const reducer = (state: any, action: any, useDeepEqualCheck?: boolean) => {
      if (action.type === "SET_STATE") {
        const payload = action.payload;

        if (typeof payload === "function") {
          const nextState = payload(state);

          // alert(useDeepEqualCheck)
          // Skip update if same
          if (Object.is(state, nextState)) return state;
          if (useDeepEqualCheck && deepEqual(state, nextState)) return state;

          state = nextState;
          return nextState;
        }
        if (
          typeof state === "object" &&
          state !== null &&
          typeof payload === "object" &&
          payload !== null
        ) {
          // If payload is an object / primitive
          if (Object.is(state, payload)) return state;
          if (useDeepEqualCheck && deepEqual(state, payload)) return state;

          return { ...state, ...payload }; // merge objects
        }
        // If payload is an object / primitive
        if (Object.is(state, payload)) return state;
        if (useDeepEqualCheck && deepEqual(state, payload)) return state;

        return payload; // primitives
      }
      return state;
    };

    function SliceProvider({
      children,
      useDeepEqualCheck = false, // Default is false
    }: {
      children: React.ReactNode;
      sliceKey: SliceKey;
      useDeepEqualCheck?: boolean;
    }) {
      // alert(useDeepEqualCheck);
      const [state, dispatch] = useReducer(
        (state, action) => reducer(state, action, useDeepEqualCheck),
        initialSlices[key]
      );

      const setState = useCallback(
        (payload: Partial<any> | ((prev: any) => Partial<any>)) => {
          dispatch({ type: "SET_STATE", payload });
        },
        []
      );

      const memoValue = useMemo(() => ({ state, setState }), [state, setState]);

      return (
        <SliceContext.Provider value={memoValue}>
          {children}
        </SliceContext.Provider>
      );
    }

    sliceProviders.push(SliceProvider);
  }

  // -------------------- Composed Provider -------------------- //
  const SRSMProvider = ({
    children,
    useDeepEqualCheck = false /** default is false */,
  }: {
    children: React.ReactNode;
    useDeepEqualCheck?: boolean;
  }) => {
    const wrappedSlices = sliceProviders.reduceRight(
      (acc, Provider) => (
        <Provider useDeepEqualCheck={useDeepEqualCheck}>{acc}</Provider>
      ),
      children
    );
    return wrappedSlices;
  };

  // -------------------- useSlice Hook -------------------- //
  function useSRASM<K extends SliceKey>(slice: K) {
    // try {
    // errorWorker.postMessage({
    //   errorMessage: "error",
    //   slice: slice,
    // });

    // console.log("yes");
    // slice as string
    const ctx = useContext(sliceContexts[slice as string]);
    if (!ctx) throw new Error(`Slice '${String(slice)}' not found`);

    type Updater =
      | Partial<Slices[K]>
      | ((prev: Slices[K]) => Partial<Slices[K]>);

    return ctx as {
      state: Slices[K];
      setState: (payload: Updater) => void;
    };
    // } catch (error) {
    //   // (async () => {
    //   //   const explanation = await SRASMAi.explainError(
    //   //     error instanceof Error ? error.message : "Unknown error",
    //   //     slice
    //   //   );
    //   //   console.warn("AI Explanation:", explanation);
    //   // })();
    // }
  }

  return { SRSMProvider, useSRASM };
}
