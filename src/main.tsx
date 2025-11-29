// index.tsx (entry point)
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { SRSMProvider } from "./srsm/StateSore.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SRSMProvider useDeepEqualCheck={true}>
      <App />
      {/* <A /> */}
    </SRSMProvider>
  </StrictMode>
);
