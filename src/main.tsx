// index.tsx (entry point)
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { SRASMProvider } from "./srsm.ts";

import initialStateCode from "./srsm.ts?raw";
import UserUpdater from "./components/UserUpdater.tsx?raw";

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
