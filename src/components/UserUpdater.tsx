import React, { useEffect, useState } from "react";
import { useSRASM } from "../srsm/StateSore";
import { useMultipleState } from "../hooks/userMultipleState";
import { initialState, type MyState } from "../srsm/userState";
import useReadGlobalState from "../hooks/useReadGlobalState";

// Generic Button component for cleaner UI
const SliceButton: React.FC<{
  label: string;
  color: string;
  onClick: () => void;
}> = ({ label, color, onClick }) => (
  <button
    style={{
      padding: 10,
      background: color,
      color: "white",
      border: "none",
      borderRadius: 6,
      cursor: "pointer",
      fontWeight: 500,
      transition: "all 0.2s",
    }}
    onClick={onClick}
  >
    {label}
  </button>
);

// Component to display slice states nicely
const SliceDisplay: React.FC<{ title: string; data: any; width?: number }> = ({
  title,
  data,
  width = 250,
}) => (
  <div
    style={{
      flex: 1,
      minWidth: width,
      padding: 12,
      border: "1px solid #ccc",
      borderRadius: 8,
      background: "#f9f9f9",
      fontFamily: "monospace",
    }}
  >
    <h4 style={{ marginBottom: 8 }}>{title}</h4>
    <pre style={{ margin: 0, overflowX: "auto" }}>
      {JSON.stringify(data, null, 2)}
    </pre>
  </div>
);

const UserUpdater: React.FC = () => {
  // Multiple slices
  const { App, count, isAuthenticated, key, lol, Blog, User } =
    useMultipleState<MyState>([
      "App",
      "User",
      "count",
      "isAuthenticated",
      "key",
      "lol",
      "Blog",
    ]);

  const { state: appState, setState: setApp } = App;
  const { state: countState, setState: setCount } = count;
  const { state: authState, setState: setAuth } = isAuthenticated;
  const { state: keyState, setState: setKey } = key;
  const { state: lolState, setState: setLol } = lol;
  const { state: blogState, setState: setBlog } = Blog;
  const { state: userState, setState: setUser } = User;

  // Example: Initialize App slice on mount
  useEffect(() => {
    setApp((prev) => ({ ...prev, j: 45, number: 12 }));
  }, [setApp]);

  useEffect(() => {
    alert("changs")
  }, [appState])

  const globalState = useReadGlobalState<MyState>(initialState);

  // Controlled append for Blog to prevent repeated "[Edited]"
  const appendBlogDescription = () => {
    setBlog((prev) => {
      if (!prev.des?.includes("[Edited]")) {
        return { ...prev, des: (prev.des ?? "") + " [Edited]" };
      }
      return prev;
    });
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 20 }}>Advanced Slice State Tester</h2>

      {/* Buttons */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <SliceButton
          label="Set User: Alice"
          color="#f97316"
          onClick={() => setUser({ name: "Alice" })}
        />
        <SliceButton
          label="Set User: Bob & Email"
          color="#f97316"
          onClick={() => setUser({ name: "Bob", email: "bob@example.com" })}
        />
        <SliceButton
          label="Update Email"
          color="#f97316"
          onClick={() =>
            setUser((prev) => ({ ...prev, email: "updated@example.com" }))
          }
        />

        <SliceButton
          label="Increment App Number +10"
          color="#3b82f6"
          onClick={() =>
            setApp((prev) => ({
              ...prev,
              number: Number(prev?.number ?? 0) + 10,
            }))
          }
        />
        <SliceButton
          label="Reset App"
          color="#3b82f6"
          onClick={() => setApp({ j: 0, number: 0 })}
        />

        <SliceButton
          label="Increment Count"
          color="#10b981"
          onClick={() => setCount((prev) => (prev ?? 0) + 1)}
        />
        <SliceButton
          label="Reset Count"
          color="#10b981"
          onClick={() => setCount(0)}
        />

        <SliceButton
          label="Set Auth True"
          color="#8b5cf6"
          onClick={() => setAuth(true)}
        />
        <SliceButton
          label="Set Auth False"
          color="#8b5cf6"
          onClick={() => setAuth(false)}
        />

        <SliceButton
          label="Set Key"
          color="#ec4899"
          onClick={() => setKey("myKey")}
        />
        <SliceButton
          label="Set Lol"
          color="#ec4899"
          onClick={() => setLol({ naem: "😂" })}
        />

        <SliceButton
          label="Set Blog"
          color="#facc15"
          onClick={() =>
            setBlog({ title: "New Blog", des: "Updated description" })
          }
        />
        <SliceButton
          label="Append Blog"
          color="#facc15"
          onClick={appendBlogDescription}
        />
      </div>

      {/* Display states */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <SliceDisplay title="User Slice" data={userState} />
        <SliceDisplay title="App Slice" data={appState} />
        <SliceDisplay title="Count Slice" data={countState} width={150} />
        <SliceDisplay title="Auth Slice" data={authState} width={150} />
        <SliceDisplay title="Key Slice" data={keyState} width={150} />
        <SliceDisplay title="Lol Slice" data={lolState} width={150} />
        <SliceDisplay title="Blog Slice" data={blogState} width={250} />
      </div>

      {/* <div style={{ marginTop: 20 }}>
    <h4>Global State</h4>
    <pre style={{ fontFamily: "monospace", background: "#f1f1f1", padding: 12 }}>
      {JSON.stringify(globalState, null, 2)}
    </pre>
  </div> */}
    </div>
  );
};

export default UserUpdater;
