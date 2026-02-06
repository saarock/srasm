export function checkTheInitialState(initialState: any) {
  if (!initialState) {
    throw new Error("SRASM : initialState is required");
  }

  if (typeof initialState !== "object") {
    throw new Error("SRASM : initialState must be an object");
  }

  if (Array.isArray(initialState)) {
    throw new Error("SRASM : initialState cannot be an array");
  }

  if (initialState === null) {
    throw new Error("SRASM : initialState cannot be null");
  }

  if (initialState === undefined) {
    throw new Error("SRASM : initialState cannot be undefined");
  }

  if (Object.keys(initialState).length === 0) {
    throw new Error("SRASM : initialState cannot be an empty object");
  }
}
