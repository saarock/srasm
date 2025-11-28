import { useSRASM } from "../srsm/StateSore";

/**
 * Custom hook to access multiple slices dynamically with proper typing.
 * @template TSlices - An object mapping slice names to their types.
 * @param sliceNames - Array of slice names to access.
 */
export function useMultipleState<TSlices extends Record<string, any>>(
  sliceNames: (keyof TSlices)[]
) {
  type Updater<T> = Partial<T> | ((prev: T) => Partial<T>);

  type Result = {
    [K in keyof TSlices]: {
      state: TSlices[K];
      setState: (payload: Updater<TSlices[K]>) => void;
    };
  };

  const result = {} as Result;

  sliceNames.forEach((sliceName) => {
    const { state, setState } = useSRASM(sliceName as any) as {
      state: any;
      setState: (payload: Updater<any>) => void;
    };
    result[sliceName as keyof TSlices] = { state, setState };
  });

  return result;
}
