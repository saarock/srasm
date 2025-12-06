// index.tsx (entry point)
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";


import initialStateCode from "./srsm/index.ts?raw";
import UserUpdater from "./components/UserUpdater.tsx?raw";
import { SRASMProvider } from "./srsm/index.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SRASMProvider
      useDeepEqualCheck={true}
      relevantCode={[
        {
          fileName: "src/srsm.ts",
          code: initialStateCode,
        },
        {
          fileName: "./components/UserUpdater.tsx",
          code: UserUpdater,
        },
      ]}
    >
      <App />
    </SRASMProvider>
  </StrictMode>
);
