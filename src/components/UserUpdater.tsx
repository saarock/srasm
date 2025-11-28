import React, { useEffect } from "react";
import { useSRASM } from "../srsm/StateSore";
import { useMultipleState } from "../hooks/userMultipleState";
import { initialState, type MyState } from "../srsm/userState";
import useReadGlobalState from "../hooks/useReadGlobalState";

const UserUpdater: React.FC = () => {
// Individual slices
const { state: user, setState: setUser } = useSRASM("User");

const { App, count, isAuthenticated, key, lol, Blog } = useMultipleState<MyState>([
"App", "User", "count", "isAuthenticated", "key", "lol", "Blog"
]);

const {setState} = useSRASM("isAuthenticated");




const { state: appState, setState: setApp } = App;
const { state: countState, setState: setCount } = count;
const { state: authState, setState: setAuth } = isAuthenticated;
const { state: keyState, setState: setKey } = key;
const { state: lolState, setState: setLol } = lol;
const { state: blogState, setState: setBlog } = Blog;



// Initialize App slice
useEffect(() => {
setApp(prev => ({ ...prev, j: 45, number: 12 }));
}, []);

const globalState = useReadGlobalState<MyState>(initialState);

return (
<div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
<h2 style={{ marginBottom: 20 }}>Advanced Slice State Tester</h2>


  {/* Buttons for all slices */}
  <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
    {/* User slice */}
    <button
      style={{ padding: 8, background: "#f97316", color: "white", border: "none", borderRadius: 6 }}
      onClick={() => setUser({ name: "Alice" })}
    >
      Set User Name: Alice
    </button>
    <button
      style={{ padding: 8, background: "#f97316", color: "white", border: "none", borderRadius: 6 }}
      onClick={() => setUser({ name: "Bob", email: "bob@example.com" })}
    >
      Set User Name & Email: Bob
    </button>
    <button
      style={{ padding: 8, background: "#f97316", color: "white", border: "none", borderRadius: 6 }}
      onClick={() => setUser(prev => ({ ...prev, email: "updated@example.com" }))}
    >
      Callback Update User Email
    </button>

    {/* App slice */}
    <button
      style={{ padding: 8, background: "#3b82f6", color: "white", border: "none", borderRadius: 6 }}
      onClick={() => setApp(prev => ({ ...prev, number: Number(prev?.number ?? 0) + 10 }))}
    >
      Increment App Number by 10
    </button>
    <button
      style={{ padding: 8, background: "#3b82f6", color: "white", border: "none", borderRadius: 6 }}
      onClick={() => setApp({ j: 0, number: 0 })}
    >
      Reset App Slice
    </button>

    {/* Count slice */}
    <button
      style={{ padding: 8, background: "#10b981", color: "white", border: "none", borderRadius: 6 }}
      onClick={() => setCount(prev => (prev ?? 0) + 1)}
    >
      Increment Count
    </button>
    <button
      style={{ padding: 8, background: "#10b981", color: "white", border: "none", borderRadius: 6 }}
      onClick={() => setCount(0)}
    >
      Reset Count
    </button>

    {/* Auth slice */}
    <button
      style={{ padding: 8, background: "#8b5cf6", color: "white", border: "none", borderRadius: 6 }}
      onClick={() => setAuth(true)}
    >
      Set Authenticated
    </button>
    <button
      style={{ padding: 8, background: "#8b5cf6", color: "white", border: "none", borderRadius: 6 }}
      onClick={() => setAuth(false)}
    >
      Set Unauthenticated
    </button>

    {/* Key & Lol slices */}
    <button
      style={{ padding: 8, background: "#ec4899", color: "white", border: "none", borderRadius: 6 }}
      onClick={() => setKey("myKey")}
    >
      Set Key
    </button>
    <button
      style={{ padding: 8, background: "#ec4899", color: "white", border: "none", borderRadius: 6 }}
      onClick={() => setLol({ naem: "😂" })}
    >
      Set Lol
    </button>

    {/* Blog slice */}
    <button
      style={{ padding: 8, background: "#facc15", color: "black", border: "none", borderRadius: 6 }}
      onClick={() => setBlog({ title: "New Blog", des: "Updated description" })}
    >
      Set Blog
    </button>
    <button
      style={{ padding: 8, background: "#facc15", color: "black", border: "none", borderRadius: 6 }}
      onClick={() => setBlog(prev => ({ ...prev, des: (prev.des ?? "") + " [Edited]" }))}
    >
      Append to Blog Description
    </button>
  </div>

  {/* Display slices */}
  <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
    <div style={{ flex: 1, minWidth: 250, padding: 10, border: "1px solid #ccc", borderRadius: 6 }}>
      <h4>User Slice</h4>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>

    <div style={{ flex: 1, minWidth: 250, padding: 10, border: "1px solid #ccc", borderRadius: 6 }}>
      <h4>App Slice</h4>
      <pre>{JSON.stringify(appState, null, 2)}</pre>
    </div>

    <div style={{ flex: 1, minWidth: 150, padding: 10, border: "1px solid #ccc", borderRadius: 6 }}>
      <h4>Count Slice</h4>
      <pre>{JSON.stringify(countState, null, 2)}</pre>
    </div>

    <div style={{ flex: 1, minWidth: 150, padding: 10, border: "1px solid #ccc", borderRadius: 6 }}>
      <h4>Auth Slice</h4>
      <pre>{JSON.stringify(authState, null, 2)}</pre>
    </div>

    <div style={{ flex: 1, minWidth: 150, padding: 10, border: "1px solid #ccc", borderRadius: 6 }}>
      <h4>Key Slice</h4>
      <pre>{JSON.stringify(keyState, null, 2)}</pre>
    </div>

    <div style={{ flex: 1, minWidth: 150, padding: 10, border: "1px solid #ccc", borderRadius: 6 }}>
      <h4>Lol Slice</h4>
      <pre>{JSON.stringify(lolState, null, 2)}</pre>
    </div>

    <div style={{ flex: 1, minWidth: 250, padding: 10, border: "1px solid #ccc", borderRadius: 6 }}>
      <h4>Blog Slice</h4>
      <pre>{JSON.stringify(blogState, null, 2)}</pre>
    </div>
  </div>
</div>


);
};

export default UserUpdater;
