import React, { useCallback} from "react";
import { ErrorBoundary } from "../components/ErrorBoundry";
import { deepEqual } from "../utils";
import { useSyncExternalStoreWithSelector } from "use-sync-external-store/with-selector";
export function createStateStore<Slices extends Record<string, any>>(
  initialSlices: Slices
) {
  type SliceKey = keyof Slices;

  let storeState: Slices = { ...initialSlices };

  const sliceListeners = new Map<SliceKey, Set<() => void>>();

/**
 * Returns a set of listeners for the given slice key.
 * If no listeners are registered for the key, a new set is created and stored.
 * @param {SliceKey} k
 * @returns {Set<() => void>}
 */
  const getSliceListeners = (k: SliceKey) => {
    let set = sliceListeners.get(k);
    if (!set) {
      set = new Set();
      sliceListeners.set(k, set);
    }
    return set;
  };

/**
 * Subscribes to the slice with the given key, adding the given
 * listener to the set of listeners for that slice.
 *
 * Returns a function that can be used to unsubscribe the given
 * listener from the slice.
 *
 * @param {SliceKey} key The key of the slice to subscribe to.
 * @param {() => void} listener The listener to add to the slice.
 * @returns {() => void} A function to unsubscribe the listener from the slice.
 */
  const subscribeSlice = (key: SliceKey, listener: () => void) => {
    const set = getSliceListeners(key);
    set.add(listener);
    return () => set.delete(listener);
  };

/**
 * Emits the slice with the given key, calling all listeners
 * that are currently subscribed to that slice.
 *
 * This is used internally by the `useSRASM` hook to notify
 * components when the slice they are subscribed to changes.
 *
 * @param {SliceKey} key The key of the slice to emit.
 */
  const emitSlice = (key: SliceKey) => {
    getSliceListeners(key).forEach((l) => l());
  };

/**
 * Updates the slice with the given key, using the given payload to
 * determine the new value of the slice. If the payload is a function,
 * it will be called with the current value of the slice as its argument.
 *
 * If the payload is not a function, it will be used as the new value
 * of the slice. If the current and new values are equal (using a
 * deep equality check if useDeepEqualCheck is true), the slice will
 * not be updated.
 *
 * @param {SliceKey} key The key of the slice to update.
 * @param {any} payload The payload to use to update the slice.
 * @param {boolean} useDeepEqualCheck Whether to use a deep equality
 *   check when comparing the current and new values of the slice.
 */
  const updateSlice = (
    key: SliceKey,
    payload: any,
    useDeepEqualCheck: boolean
  ) => {
    const current = storeState[key];
    let next = current;

    if (typeof payload === "function") {
      next = payload(current);
      if (Object.is(current, next)) return;
      if (useDeepEqualCheck && deepEqual(current, next)) return;
    } else {
      if (
        typeof current === "object" &&
        current !== null &&
        typeof payload === "object" &&
        payload !== null
      ) {
        next = { ...(current as any), ...(payload as any) };
        if (useDeepEqualCheck && deepEqual(current, next)) return;
      } else {
        if (Object.is(current, payload)) return;
        if (useDeepEqualCheck && deepEqual(current, payload)) return;
        next = payload;
      }
    }

    if (!Object.is(storeState[key], next)) {
      storeState = { ...storeState, [key]: next };
      emitSlice(key);
    }
  };


/**
 * Hook to use a slice of the global state.
 * @param {SliceKey} slice The key of the slice to use.
 * @param {((s: Slices[K]) => Selected) | undefined} selector
 *   A function to select the desired value from the slice.
 * @param {useSRASMOptions} options Options for the hook.
 * @returns {useSRASMReturn} An object with the selected state and a
 *   function to update the state.
 *
 * The `useSRASM` hook allows you to use a slice of the global state
 * in your React components. It takes a slice key as its first argument and
 * an optional selector function as its second argument. The selector function
 * is called with the slice state as its argument and should return the desired value
 * from the slice state.
 *
 * The hook returns an object with two properties: `state` and `setState`. The
 * `state` property contains the selected value from the slice state, and the
 * `setState` property is a function that can be used to update the slice state.
 *
 * The `options` object can be used to customize the behavior of the hook. It
 * accepts two properties: `useDeepEqualCheck` and `isEqual`. The
 * `useDeepEqualCheck` property is a boolean that indicates whether to use a deep
 * equality check when comparing the current and new values of the slice state.
 * The `isEqual` property is a function that is used to compare the current and
 * new values of the slice state. If not provided, the hook will use the `Object.is`
 * function to compare the values.
 */
  function useSRASM<K extends SliceKey, Selected = Slices[K]>(
    slice: K,
    selector?: (s: Slices[K]) => Selected,
    options?: {
      useDeepEqualCheck?: boolean;
      isEqual?: (a: Selected, b: Selected) => boolean;
    }
  ) {
    const selected = useSyncExternalStoreWithSelector(
      (listener) => subscribeSlice(slice, listener),
      () => storeState[slice],
      () => initialSlices[slice],
      selector ?? ((s: Slices[K]) => s as any),
      options?.isEqual ?? Object.is
    );

    type SliceUpdater<S> = Partial<S> | ((prev: S) => Partial<S>);

    const setState = useCallback(
      (payload: SliceUpdater<Slices[K]>) =>
        updateSlice(slice, payload, !!options?.useDeepEqualCheck),
      [slice, options?.useDeepEqualCheck]
    );

    return { state: selected, setState };
  }

/**
 * A context provider that wraps your application and provides
 * the necessary state and error handling to SRASM components.
 *
 * @param {React.ReactNode} children The components to be rendered within
 *   the provider.
 * @param {({ fileName: string; code: string }[] | undefined} relevantCode
 *   An optional array of objects containing the file name and code of the
 *   relevant code snippets to be used for AI error debugging.
 * @param {any[] | undefined} additionalSlices An optional array of
 *   additional slices to be passed to the AI error debugging system.
 */
  const SRASMProvider = ({
    children,
    relevantCode,
    additionalSlices,
  }: {
    children: React.ReactNode;
    relevantCode?: { fileName: string; code: string }[];
    additionalSlices?: any[];
  }) => {
    return (
      <ErrorBoundary
        relevantCode={relevantCode}
        additionalSlices={[storeState, ...(additionalSlices ?? [])]}
      >
        {children}
      </ErrorBoundary>
    );
  };

  return { SRASMProvider, useSRASM };
}
