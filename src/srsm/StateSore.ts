import { createStateStore } from "../context";
import { initialState, type BlogState, demoSliceA, demoSliceB, type DemoSliceA, type DemoSliceB } from "./userState";

// Define the root store shape
export type RootState = {
  blog: BlogState;
  demoA: DemoSliceA;
  demoB: DemoSliceB;
};

// Create the store with explicit slice keys
export const { SRASMProvider, useSRASM } = createStateStore<RootState>({
  blog: initialState,
  demoA: demoSliceA,
  demoB: demoSliceB,
});
