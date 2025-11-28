interface User {
  name: string | null;
  email: string | null;
}

export interface MyState {
  key: string | null;
  lol: {
    naem: string | null
  }
,  App: { number: number | null; j: number | null } | null;
  count: number | null;
  isAuthenticated: boolean;
  User: null | User;
  Blog: {
    title: string | null,
    des: string | null

  }
}

export const initialState: MyState = {
  key: null,
  App: null,
  count: null,
    lol: {
    naem: null
  },
  isAuthenticated: false,
  User: {
    email: null,
    name: null,
  },
  Blog : {
    title: null,
    des: null
  }
};

export interface MyAnotherState {
  name: string | null;
}

export const anther: MyAnotherState = {
  name: null,
};
