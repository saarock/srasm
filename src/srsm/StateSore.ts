// StateStore.ts (or StateProvider.tsx)
import { createStateStore } from "../context/createStateStore";
import { initialState, type MyState } from "../srsm/userState";

export const { StateProvider, StateContext } =
  createStateStore<MyState>(initialState);
