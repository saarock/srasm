import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

import { SRASMProvider } from "./srsm/index.ts";
import SRASMRealTimeSliceSplitDebugger from "./components/SRASMRealTimeSliceSplitDebugger";

// ✅ raw strings (default imports)
import initialStateCode from "./srsm/index.ts?raw";
import userUpdaterCode from "./components/UserUpdater/index.tsx?raw";
import storeCode from "./srsm/index.ts?raw";
import typesCode from "./types/index.ts?raw";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SRASMProvider
      relevantCode={[
        { fileName: "src/srsm/index.ts", code: initialStateCode },
        { fileName: "src/components/UserUpdater.tsx", code: userUpdaterCode },
      ]}
    >
      <App />

      {/* ✅ new debugger API */}
      <SRASMRealTimeSliceSplitDebugger
        files={[
          { filePath: "src/srsm/index.ts", codes: storeCode },
          { filePath: "src/types/index.ts", codes: typesCode },
        ]}
      />

    </SRASMProvider>
  </StrictMode>
);
