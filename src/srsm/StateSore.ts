import { createStateStore } from "../context/createStateStore";

import { initialState, type MyState } from "./userState";

export const { SRSMProvider, useSRASM } = createStateStore<MyState>(initialState);
