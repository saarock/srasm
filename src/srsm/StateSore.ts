import { createStateStore } from "../context";

import { initialState, type BlogState } from "./userState";

export const { SRASMProvider, useSRASM } = createStateStore<{ blog: BlogState }>({ blog: initialState });
