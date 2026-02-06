import { createStateStore } from "./context";

type Todo = { userId: number; id: number; title: string; completed: boolean };
type User = { id: number; name: string; email: string; username: string };

export const { useSRASM, useSRASMAsync, __srsmDebug } = createStateStore({
  // sync slices
  theme: { mode: "dark" as "dark" | "light" },
  counter: 0,
  auth: { user: null as null | { id: number; name: string }, token: "" },
  

  // async slices
  todos: [] as Todo[],
  users: [] as User[],
  todoStats: { total: 0, completed: 0, pending: 0 } as {
    total: number;
    completed: number;
    pending: number;
  },
});
