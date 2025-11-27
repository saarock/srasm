// index.tsx (entry point)
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { StateProvider } from "./srsm/StateSore.ts";
import A from "./components/A.tsx";




createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StateProvider>
      <App />
      <A/>
    </StateProvider>
  </StrictMode>
);
