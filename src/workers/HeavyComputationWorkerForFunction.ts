// worker.ts
self.onmessage = (event) => {
  const { state, payload } = event.data;

  // Recreate the function from string
  const payloadFn = new Function('state', `return (${payload})(state);`);

  const nextState = payloadFn(state);

  // Instead of returning, send result back to main thread
  self.postMessage(nextState);
};
