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

  const getSliceListeners = (k: SliceKey) => {
    let set = sliceListeners.get(k);
    if (!set) {
      set = new Set();
      sliceListeners.set(k, set);
    }
    return set;
  };

  const subscribeSlice = (key: SliceKey, listener: () => void) => {
    const set = getSliceListeners(key);
    set.add(listener);
    return () => set.delete(listener);
  };

  const emitSlice = (key: SliceKey) => {
    getSliceListeners(key).forEach((l) => l());
  };

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
