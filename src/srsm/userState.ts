interface User {
  name: string | null;
  email: string | null;
}

export interface MyState {
  key: string | null;
  App: { number: number | null; j: number | null } | null;
  count: number | null;
  isAuthenticated: boolean;
  User: null | User;
}

export const initialState: MyState = {
  key: null,
  App: null,
  count: null,
  isAuthenticated: false,
  User: {
    email: null,
    name: null,
  },
};
