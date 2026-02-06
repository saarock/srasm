import React, { useCallback } from "react";
import {
  checkTheInitialState,
  deepEqual,
  tryRegisterSRASMDevtools,
} from "../utils";
import { useSyncExternalStoreWithSelector } from "use-sync-external-store/with-selector";
import type {
  GetOptions,
  GetRefetchFn,
  MutateFn,
  MutationOptions,
  QueryMeta,
  ReturnByOptions,
  UseSRASMAsyncOptions,
} from "@/types";
import { checkTheHookName } from "@/utils/checkTheHookName";
/**
 * Creates a state store with the given initial state slices.
 * The state store is used by the `useSRASM` hook to provide a strongly-typed
 * way of accessing and updating the state.
 *
 * @param {Slices} initialSlices The initial state slices to be used by the state store.
 * @return {{ SRASMProvider: React.FC<{ children: React.ReactNode; relevantCode?: { fileName: string; code: string }[] | undefined; additionalSlices?: any[] | undefined }>; useSRASM: <K extends SliceKey, Selected = Slices[K]>(slice: K, selector?: (s: Slices[K]) => Selected, options?: { useDeepEqualCheck?: boolean; isEqual?: (a: Selected, b: Selected) => boolean; }) => useSRASMReturn }}
 * The returned object contains the `SRASMProvider` context provider component and the `useSRASM` hook.
 * The `SRASMProvider` component should be used to wrap your application, providing the necessary state and error handling to SRASM components.
 * The `useSRASM` hook can be used by your React components to access and update the state.
 */
export function createStateStore<Slices extends Record<string, any>>(
  initialSlices: Slices,
) {
  checkTheInitialState(initialSlices);

  type SliceKey = keyof Slices;

  let storeState: Slices = { ...initialSlices };

  // Cache resolved data by id (GET) or by tag-key (POST if you want later)
  const asyncDataCache = new Map<string, any>();

  // Deduplicate concurrent fetches (A & B mount at the same time)
  const asyncPromiseCache = new Map<string, Promise<any>>();

  // slice -> set of listeners
  const sliceListeners = new Map<SliceKey, Set<() => void>>();

  // cacheKey -> refetch function (so we can refetch queries on invalidation)
  const queryMetaMap = new Map<string, QueryMeta>();

  // tag -> set of cacheKeys that "provide" this tag
  const tagToQueryKeys = new Map<string, Set<string>>();

  // helper
  const addTagMapping = (tag: string, key: string) => {
    let set = tagToQueryKeys.get(tag);
    if (!set) {
      set = new Set();
      tagToQueryKeys.set(tag, set);
    }
    set.add(key);
  };

  // Future use
  // const removeTagMapping = (tag: string, key: string) => {
  //   const set = tagToQueryKeys.get(tag);
  //   if (!set) return;
  //   set.delete(key);
  //   if (set.size === 0) tagToQueryKeys.delete(tag);
  // };

  const getOrCreatePromise = (key: string, fn: () => Promise<any>) => {
    let p = asyncPromiseCache.get(key);
    if (!p) {
      p = fn().finally(() => asyncPromiseCache.delete(key));
      asyncPromiseCache.set(key, p);
    }
    return p;
  };

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
    useDeepEqualCheck: boolean,
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
        // arrays must be replaced, not object-merged
        if (Array.isArray(current) || Array.isArray(payload)) {
          next = payload;
        } else {
          next = { ...(current as any), ...(payload as any) };
        }
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
    },
  ) {
    const selected = useSyncExternalStoreWithSelector(
      (listener) => subscribeSlice(slice, listener),
      () => storeState[slice],
      () => initialSlices[slice],
      selector ?? ((s: Selected) => s as Selected),
      options?.isEqual ?? Object.is,
    );

    type SliceUpdater<S> = Partial<S> | ((prev: S) => Partial<S>);

    const setState = useCallback(
      (payload: SliceUpdater<Slices[K]>) =>
        updateSlice(slice, payload, !!options?.useDeepEqualCheck),
      [slice, options?.useDeepEqualCheck],
    );

    return { state: selected, setState };
  }

  /**
   * Utility: stable join for deps
   */
  function joinTags(tags: string[]) {
    return tags.slice().sort().join("|");
  }

  // GET overload
  function useSRASMAsync<K extends SliceKey, TBody>(
    slice: K,
    fetcher: (body?: TBody) => Promise<Slices[K]>,
    options: GetOptions,
  ): { data: Slices[K]; loading: boolean; error: any; refetch: GetRefetchFn };

  // MUTATION overload
  function useSRASMAsync<K extends SliceKey, TBody, THookName extends string>(
    slice: K,
    fetcher: (body?: TBody) => Promise<Slices[K]>,
    options: MutationOptions<THookName>,
  ): { data: Slices[K]; loading: boolean; error: any } & Record<
    THookName,
    MutateFn<TBody>
  >;

  /**
   * useSRASMAsync is a higher-order hook that combines the functionality of useSRASM with an async data fetching mechanism.
   * It can be used to fetch data from an API or a database, and it will automatically cache the data and manage the loading state.
   * It also provides a refetch function that can be used to manually re-run the async data fetcher.
   *
   * @param {string} slice - The slice name.
   * @param {(body?: TBody) => Promise<Slices[K]>} fetcher - The async data fetcher function.
   * @param {GetOptions | MutationOptions<THookName>} options - The options object.
   * @returns {ReturnByOptions<Slices[K], TBody, THookName, TOpts>} - The return object, which includes the data, loading, error, and refetch properties.
   */
  function useSRASMAsync<
    K extends SliceKey,
    TBody,
    THookName extends string = string,
    TOpts extends UseSRASMAsyncOptions<THookName> =
      UseSRASMAsyncOptions<THookName>,
  >(
    slice: K,
    fetcher: (body?: TBody) => Promise<Slices[K]>,
    options: TOpts,
  ): ReturnByOptions<Slices[K], TBody, THookName, TOpts> {
    const { state, setState } = useSRASM(slice);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<any>(null);

    const method = options.method ?? "GET";

    const skip = options.skip ?? false;

    // Get the hook name give by the developer to create a unique hook name only for the mutation requests
    const hookName = (options as MutationOptions).hookName as THookName;

    if (method !== "GET") {
      checkTheHookName(hookName);
    }

    // GET cache key is id; POST cache key can be something stable if you want (not required)
    const cacheKey =
      method === "GET"
        ? (() => {
            const key = (options as GetOptions).key?.toString();
            if (!key || !key.trim()) {
              throw new Error(
                `[SRASM] GET requests must provide options.key (stable cache key). Example: key: "users:list?page=1"`,
              );
            }
            return `q:${String(slice)}:${key}`;
          })()
        : `m:${String(slice)}:${hookName}`;

    const providesTags =
      method === "GET" ? ((options as GetOptions).providesTags ?? []) : [];

    const invalidatesTags =
      method !== "GET"
        ? ((options as MutationOptions).invalidatesTags ?? [])
        : [];

    const refetch = React.useCallback(
      async (body?: TBody) => {
        if (skip) return;
        try {
          setLoading(true);
          setError(null);

          // normal fetch
          const data =
            method === "GET"
              ? await getOrCreatePromise(cacheKey, () => fetcher())
              : await fetcher(body);

          // cache & store state
          asyncDataCache.set(cacheKey, data);
          setState(data);

          // mark fresh for GET
          if (method === "GET") {
            const meta = queryMetaMap.get(cacheKey);
            if (meta) queryMetaMap.set(cacheKey, { ...meta, stale: false });
          }

          // if this is a POST mutation, invalidate tags after success
          if (method !== "GET" && invalidatesTags.length) {
            const uniqueKeys = new Set<string>();

            for (const tag of invalidatesTags) {
              const keys = tagToQueryKeys.get(tag);
              if (!keys) continue;
              for (const key of keys) uniqueKeys.add(key);
            }

            for (const key of uniqueKeys) {
              const meta = queryMetaMap.get(key);

              if (meta?.subscribers && meta.subscribers > 0 && meta.refetch) {
                meta.refetch();
              } else {
                queryMetaMap.set(key, {
                  stale: true,
                  subscribers: meta?.subscribers ?? 0,
                  refetch: meta?.refetch,
                });
              }
            }
          }
        } catch (e) {
          setError(e);
        } finally {
          setLoading(false);
        }
      },
      [
        skip,
        fetcher,
        setState,
        cacheKey,
        method,
        invalidatesTags,
        joinTags(invalidatesTags),
      ],
    );

    // Register GET queries as "providers" of tags + expose their refetcher
    React.useEffect(() => {
      if (skip) return;
      if (method !== "GET") return;

      // get or init meta
      const prev = queryMetaMap.get(cacheKey) ?? {
        stale: false,
        refetch: undefined as undefined | (() => void),
        subscribers: 0,
      };

      // mount/subscribe
      const meta = {
        ...prev,
        refetch: () => void refetch(),
        subscribers: prev.subscribers + 1,
      };

      queryMetaMap.set(cacheKey, meta);

      // map tags -> cacheKey
      for (const tag of providesTags) addTagMapping(tag, cacheKey);

      // if invalidated while unmounted, refetch on mount
      if (meta.stale) {
        void refetch();
        queryMetaMap.set(cacheKey, { ...meta, stale: false });
      }

      return () => {
        // unmount/unsubscribe
        const curr = queryMetaMap.get(cacheKey);
        if (curr) {
          const nextSubs = Math.max(0, curr.subscribers - 1);

          if (nextSubs === 0) {
            // no active component: keep meta, but remove live refetcher
            queryMetaMap.set(cacheKey, {
              ...curr,
              subscribers: 0,
              refetch: undefined,
            });
          } else {
            queryMetaMap.set(cacheKey, { ...curr, subscribers: nextSubs });
          }
        }
      };
    }, [skip, method, cacheKey, joinTags(providesTags), refetch]);

    /**
     * Initial GET fetch + cache + in-flight dedupe
     */
    React.useEffect(() => {
      if (skip) return;
      if (method !== "GET") return;

      let cancelled = false;

      const run = async () => {
        try {
          setLoading(true);
          setError(null);

          // cache hit
          if (asyncDataCache.has(cacheKey)) {
            setState(asyncDataCache.get(cacheKey));
            return;
          }

          // in-flight dedupe
          let p = asyncPromiseCache.get(cacheKey);
          if (!p) {
            p = fetcher();
            asyncPromiseCache.set(cacheKey, p);
          }

          const data = await p;
          asyncPromiseCache.delete(cacheKey);

          if (cancelled) return;

          asyncDataCache.set(cacheKey, data);
          setState(data);

          // mark fresh
          const meta = queryMetaMap.get(cacheKey);
          if (meta) queryMetaMap.set(cacheKey, { ...meta, stale: false });
        } catch (e) {
          if (!cancelled) setError(e);
        } finally {
          if (!cancelled) setLoading(false);
        }
      };

      void run();

      return () => {
        cancelled = true;
      };
    }, [skip, method, cacheKey, fetcher, setState]);

    /**
     * Return type should be based on the method
     */
    let mutationReturnKeysAndalues:
      | { refetch: GetRefetchFn }
      | Record<THookName, MutateFn<TBody>>;

    if (method !== "GET") {
      mutationReturnKeysAndalues = {
        [hookName as THookName]: refetch,
      } as Record<THookName, MutateFn<TBody>>;
    } else {
      mutationReturnKeysAndalues = { refetch };
    }

    return {
      data: state as Slices[K],
      loading,
      error,
      ...mutationReturnKeysAndalues,
    } as ReturnByOptions<Slices[K], TBody, THookName, TOpts>;
  }

  /**
   * Optional: helpers for debugging / devtools
   */
  function __srsmDebug() {
    return {
      asyncDataCache,
      asyncPromiseCache,
      queryMetaMap,
      tagToQueryKeys,
    };
  }

  /**
   * @note Can be need at the future
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
  const SRASMProvider = ({ children }: { children: React.ReactNode }) => {
    return children as React.ReactElement<{ children: React.ReactNode }>;
  };
  // ---- Store API (single instance) ----
  const storeAPI = {
    getState: () => storeState,

    // Subscribe to ALL slices
    subscribe: (listener: () => void) => {
      const unsubs = (Object.keys(storeState) as SliceKey[]).map((k) =>
        subscribeSlice(k, listener),
      );
      return () => unsubs.forEach((u) => u());
    },

    // THIS is the ONLY setter that should mutate state
    setState: (key: SliceKey, payload: any, useDeepEqualCheck = false) => {
      updateSlice(key, payload, useDeepEqualCheck);
    },
  };

  // Register store for Chrome extension
  tryRegisterSRASMDevtools("default", storeAPI);

  return { SRASMProvider, useSRASM, useSRASMAsync, __srsmDebug };
}
