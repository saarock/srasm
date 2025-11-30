import { SRASMAi } from "../api/AiApi";

// AiWorker.ts
self.onmessage = async (event) => {
  const { errorMessage, slice } = event.data;

  (async () => {
    const explanation = await SRASMAi.explainError(
      errorMessage instanceof Error ? errorMessage.message : "Error on state",
      slice
    );
    console.warn("AI Explanation:", explanation);
  })();

  // find the error from here

  // Inline code, no imports
  // const explanation = `AI explanation placeholder for: ${errorMessage}`;

  // self.postMessage({ explanation });

  self.close();
};
