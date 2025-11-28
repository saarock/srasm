// aiWorker.ts

import { SRASMAi } from "../api/AiApi";


// Listen for messages from main thread
self.onmessage = async (e) => {
  const { slice, payload } = e.data;

  const isHeavy = await SRASMAi.predictHeavySlice(slice, payload);

  // Send prediction back to main thread
  self.postMessage({ slice, isHeavy, payload });
};
