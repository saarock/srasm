import { ErrorBoundary } from "../components/ErrorBoundry";
import { deepEqual } from "../utils";
import React, {
  createContext,
  useReducer,
  useContext,
  useMemo,
  useCallback,
} from "react";

/**
 * Creates a state store with individual slice contexts.
 * @param {Object} initialSlices - Initial state of all slices.
 * @returns {Object} - An object containing the SRASMProvider and useSRASM hook.
 * @example
 * const store = createStateStore({
 *   userSlice: { user: null },
 *   productSlice: { products: [] },
 * });
 *
 * const UserUpdater = () => {
 *   const { state, setState } = useSRASM("userSlice");
 *   // ...
 * };
 *
 * const ProductUpdater = () => {
 *   const { state, setState } = useSRASM("productSlice");
 *   // ...
 * };
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

    /**
     * Reducer function for individual slice contexts.
     * @param {any} state - Current state of the slice.
     * @param {any} action - Action to update the slice state.
     * @param {boolean} [useDeepEqualCheck=false] - If true, will check if the next state is deeply equal to the current state and skip the update if they are equal.
     * @returns {any} - The updated state of the slice.
     */
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

    /**
     * Provides a context for individual slices.
     * @param {React.ReactNode} children - React components that should have access to the slice context.
     * @param {SliceKey} sliceKey - The key of the slice to provide.
     * @param {boolean} [useDeepEqualCheck=false] - If true, will check if the next state is deeply equal to the current state and skip the update if they are equal.
     * @param {any} [initialStateOverride=undefined] - An optional override of the initial state of the slice.
     * @returns {JSX.Element} - A JSX element wrapping the children with the slice context provider.
     */
    function SliceProvider({
      children,
      useDeepEqualCheck = false, // Default is false
      initialStateOverride,
    }: {
      children: React.ReactNode;
      sliceKey: SliceKey;
      useDeepEqualCheck?: boolean;
      initialStateOverride?: any;
    }) {
      const [state, dispatch] = useReducer(
        (state, action) => reducer(state, action, useDeepEqualCheck),
        initialStateOverride !== undefined
          ? initialStateOverride
          : initialSlices[key]
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

    sliceProviders.push({ Provider: SliceProvider, key });
  }

  /**
   * SRASMProvider component that wraps the children with the slice context providers.
   *
   * @param children - React.ReactNode - Children to be wrapped with the slice context providers.
   * @param useDeepEqualCheck - boolean - Default is false. If true, then the state is compared using deep equal.
   * @param relevantCode - { fileName: string; code: string } - Relevant code block for the error boundary component.
   * @returns {JSX.Element} - A JSX element wrapping the children with the slice context providers.
   */
  const SRASMProvider = ({
    children,
    useDeepEqualCheck = false /** default is false */,
    relevantCode,
  }: {
    children: React.ReactNode;
    useDeepEqualCheck?: boolean;
    relevantCode?: { fileName: string; code: string }[];
  }) => {
    const wrappedSlices = sliceProviders.reduceRight(
      (acc, { Provider, key }) => (
        <Provider useDeepEqualCheck={useDeepEqualCheck} sliceKey={key}>
          {acc}
        </Provider>
      ),
      children
    );

    return (
      <ErrorBoundary
        relevantCode={relevantCode}
        // sliceName="userSlice"
        additionalSlices={[initialSlices]}
      >
        {wrappedSlices}
      </ErrorBoundary>
    );
  };

  /**
   * Hook to access the state and dispatch of a given slice.
   * Will throw an error if the slice is not found.
   * @param slice - The key of the slice to access.
   * @returns {state: Slices[K], setState: (payload: Updater) => void} - The state and dispatch of the slice.
   * @throws {Error} - If the slice is not found.
   */
  function useSRASM<K extends SliceKey>(slice: K) {
    try {
      const ctx = useContext(sliceContexts[slice as string]);
      if (!ctx) throw new Error(`Slice '${String(slice)}' not found`);
      type Updater =
        | Partial<Slices[K]>
        | ((prev: Slices[K]) => Partial<Slices[K]>);

      return ctx as {
        state: Slices[K];
        setState: (payload: Updater) => void;
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : JSON.stringify(error)?.trim().length > 0
          ? JSON.stringify(error)
          : "useSRASM hook error: please check how you used the library. If you cannot solve, go to the SRASM AI.";

      throw Object.assign(new Error(errorMessage), {
        slice: slice,
        slices: initialSlices,
      });
    }
  }

  return { SRASMProvider, useSRASM };
}
