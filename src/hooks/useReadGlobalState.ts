import { useSRASM } from "../srsm/StateSore";

export default function useReadGlobalState<TSlices extends Record<string, any>>(
  slices: TSlices
) {
  const result: Record<string, any> = {};

  for (let keys of Object.keys(slices)) {
    const { state } = useSRASM(keys as any) as {
      state: any;
      setState: (payload: any) => void;
    };

    result[keys] = { state };
  }

  return {rootState: result as { [K in keyof TSlices]: TSlices[K]}}
}
