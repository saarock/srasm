import React, { createContext, useReducer } from "react";

// This function creates a state store for any type of state you pass in
// Returns a context and a provider that we can use in our app
export function createStateStore<TState>(initialState: TState) {
  const SET_STATE = "SET_STATE"; // our action type for updating state

  // Type for actions sent to the reducer
  type Action = {
    type: typeof SET_STATE;
    payload: Partial<TState>; // we can update only some keys if we want
  };

  // Reducer handles the state updates
  const reducer = (state: TState, action: Action): TState => {
    switch (action.type) {
      case SET_STATE:
        // merge new values with existing state
        return { ...state, ...action.payload };
      default:
        // if action type is unknown, just return current state
        return state;
    }
  };

  // Create a context so any component can access state and setStates
  const StateContext = createContext<{
    state: TState;
    setStates: (payload: Partial<TState>) => void;
  }>({
    state: initialState, // default initial state
    setStates: () => {}, // default no-op
  });

  // The provider component to wrap around our app
  function StateProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    // setStates is what components will call to update state
    const setStates = (payload: Partial<TState>) => {
      dispatch({ type: SET_STATE, payload });
    };

    // provide state and updater function to all children
    return (
      <StateContext.Provider value={{ state, setStates }}>
        {children}
      </StateContext.Provider>
    );
  }

  // return context and provider so we can use them in our app
  return { StateContext, StateProvider };
}
