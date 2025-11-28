import React, { useEffect } from "react";
import { useSRASM } from "../srsm/StateSore";
import { useMultipleState } from "../hooks/userMultipleState";
import { initialState, type MyState } from "../srsm/userState";
import useReadGlobalState from "../hooks/useReadGlobalState";

const UserUpdater: React.FC = () => {
  const { state: user, setState: setUser } = useSRASM("User");
  const { App, count, isAuthenticated, key, lol } = useMultipleState<MyState>([
    "App",
    "User",
    "count",
    "isAuthenticated",
    "key",
    "lol",
  ]);

  const {} = useSRASM("App");

  // const {} = useMultipleState<MyState>()

  const { setState: setApp, state: appState } = App;

  useEffect(() => {
    setApp(prev => ({...prev, j: 45}));
  }, [])

  const state = useReadGlobalState<MyState>(initialState);



  return (
    <div>
      <h3>Update User</h3>
      <button onClick={() => setUser({ name: "Alice" })}>Set Name Alice</button>
      <button
        onClick={() => setUser({ name: "Bob", email: "bob@example.com" })}
      >
        set Name Bob
      </button>
      <button onClick={() => setApp({ j: 45, number: 56 })}>
        Set Name & Email
      </button>
      <p>Current User: {JSON.stringify(user)}</p>
      <p>Current User: {JSON.stringify(user)}</p>
    </div>
  );
};

export default UserUpdater;
