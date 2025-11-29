import React from "react";
import useReadGlobalState from "../hooks/useReadGlobalState";
import { initialState, type MyState } from "../srsm/userState";
import EnhancedStateViewer from "./EnhancedStateViewer";

const UserDisplay: React.FC = () => {
  const state = useReadGlobalState<MyState>(initialState);
  return (
    <main
      className="min-h-screen"
      style={{
        backgroundColor: "#0d1117",
        backgroundImage: `
          radial-gradient(circle at 20% 50%, rgba(79, 192, 213, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(121, 192, 255, 0.05) 0%, transparent 50%)
        `,
      }}
    >
      {/* Viewer Component */}
      <div className="mb-8">
        <EnhancedStateViewer
          data={state}
          title="Application State"
          description="Explore the full state tree with multiple view options and search capabilities"
        />
      </div>
    </main>
  );
};

export default UserDisplay;
