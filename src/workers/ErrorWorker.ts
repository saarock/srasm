// AiWorker.ts
self.onmessage = async (event) => {
  const { errorMessage, slice } = event.data;

  console.log(slice);

  // This for loop is to check that main tread stop or not
  // for (let i =0; i<1000000000000000000; i++) {
  //   console.log(i);
  // }

  // find the error from here

  // Inline code, no imports
  const explanation = `AI explanation placeholder for: ${errorMessage}`;

  self.postMessage({ explanation });

  self.close();
};
