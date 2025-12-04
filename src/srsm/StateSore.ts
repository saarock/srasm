import { createStateStore } from "../context/createStateStore";

import { initialState, type BlogState } from "./userState";

export const { SRASMProvider, useSRASM } = createStateStore<{ blog: BlogState }>({ blog: initialState });
