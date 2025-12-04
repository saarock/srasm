// in React component or hook
import { useEffect } from "react";


export const useAiWorkerListener = (error: unknown, slice: string) => {


  useEffect(() => {
    if (!error) return;
    const worker = new Worker(
      new URL("../workers/ErrorWorker.ts", import.meta.url)
    );

    worker.postMessage({
      errorMessage: "error on SRASM SLICE",
      slice: slice,
    });

    console.log("haha");
    console.log(error);

    worker.postMessage({ errorMessage: error, slice });

    return () => {
      worker.terminate();
    };
  }, [error, slice]);
};
