import React, { useEffect, useState } from "react";
import { useMultipleState } from "../hooks/userMultipleState";
import { initialState, type MyState } from "../srsm/userState";
import useReadGlobalState from "../hooks/useReadGlobalState";
import A from "./A";
import { SRASMAi } from "../api/AiApi";

// --- UI Components ---

const SectionHeader: React.FC<{ title: string; icon?: string }> = ({ title, icon }) => (
  
  <div style={styles.sectionHeader}>
    {icon && <span style={{ marginRight: 8 }}>{icon}</span>}
    <h3 style={styles.sectionTitle}>{title}</h3>
  </div>
);

const SliceButton: React.FC<{
  label: string;
  color: string;
  onClick: () => void;
  variant?: "solid" | "outline";
}> = ({ label, color, onClick, variant = "solid" }) => {
  const [hover, setHover] = useState(false);
  
  // console.table({a:3, b:5})
  const baseStyle = variant === "solid" 
    ? { ...styles.button, background: color, color: "white", border: `1px solid ${color}` }
    : { ...styles.button, background: "transparent", color: color, border: `1px solid ${color}` };

  const hoverStyle = hover ? { transform: "translateY(-2px)", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" } : {};

  return (
    <button
      style={{ ...baseStyle, ...hoverStyle }}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {label}
    </button>
  );
};

const SliceDisplay: React.FC<{ title: string; data: any; accentColor: string }> = ({
  title,
  data,
  accentColor,
}) => (
  <div style={{ ...styles.card, borderTop: `4px solid ${accentColor}` }}>
    <div style={styles.cardHeader}>
      <span style={{ ...styles.badge, background: `${accentColor}20`, color: accentColor }}>
        {title}
      </span>
      <span style={styles.timestamp}>Live</span>
    </div>
    <div style={styles.codeBlock}>
      <pre style={styles.pre}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  </div>
);

// --- Main Component ---

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

  useEffect(() => {
    setApp((prev: MyState["App"]) => ({ ...prev, j: 100, number: 0 }));
  }, [setApp]);

  useEffect(() => {
    setCount((prev: MyState["count"]) => (prev ? prev + 1 : 0));
  }, [appState]); // Be careful: triggering setCount on appState change can cause cascades

  // --- SOLVING THE RE-RENDER ISSUE ---
  const [s, seS] = useState({ a: 2 });

  // useEffect(() => {
  //      (async () => {
  //  const explanation = await SRASMAi.explainError(
  //           "Hello",
  //           "asdg"
  //         );
  //         console.log(explanation);
          
  //      })();
  // }, []);

  
  const handleSmartClick = () => {
    seS((prev) => {
      // Logic: If the new value is identical to the old value, 
      // return 'prev' (the exact reference). React will skip the re-render.
      const newValue = 2; 
      if (prev.a === newValue) {
        // console.log("Value is same, skipping render");
        return prev; 
      }
      return { ...prev, a: newValue };
    });
  };

  const globalState = useReadGlobalState<MyState>(initialState);

  const appendBlogDescription = () => {
    setBlog((prev) => {
      if (!prev.des?.includes("[Edited]")) {
        return { ...prev, des: (prev.des ?? "") + " [Edited]" };
      }
      return prev;
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.innerContainer}>
        
        {/* Header Section */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>State Dashboard</h1>
            <p style={styles.subtitle}>Advanced Slice State Management System</p>
          </div>
          <div style={styles.statusBadge}>System Active</div>
        </div>

        {/* Re-render Test Section */}
        <div style={styles.controlPanel}>
          <SectionHeader title="Performance Testing" icon="⚡" />
          <div style={styles.row}>
             <p style={{fontSize: '0.9rem', color: '#666', marginRight: 10}}>
               Local State: <strong>{JSON.stringify(s)}</strong>
             </p>
             <SliceButton 
                label="Smart Set (Prevents Re-render)" 
                color="#64748b" 
                onClick={handleSmartClick} 
             />
          </div>
        </div>

        {/* Controls Grid */}
        <div style={styles.gridContainer}>
          
          {/* Group: User Management */}
          <div style={styles.controlGroup}>
            <SectionHeader title="User Management" icon="👤" />
            <div style={styles.buttonGrid}>
              <SliceButton label="Set: Alice" color="#f97316" onClick={() => setUser({ name: "Alice" })} />
              <SliceButton label="Set: Bob & Mail" color="#ea580c" onClick={() => setUser({ name: "Bob", email: "bob@example.com" })} />
              <SliceButton label="Update Email" color="#c2410c" onClick={() => setUser((prev) => ({ ...prev, email: "new@ex.com" }))} variant="outline" />
            </div>
          </div>

          {/* Group: Application Logic */}
          <div style={styles.controlGroup}>
            <SectionHeader title="Application Logic" icon="⚙️" />
            <div style={styles.buttonGrid}>
              <SliceButton label="App Number +10" color="#3b82f6" onClick={() => setApp((prev) => ({ ...prev, number: Number(prev?.number) + 10 }))} />
              <SliceButton label="Reset App" color="#2563eb" onClick={() => setApp({ j: 0, number: 0 })} variant="outline" />
              <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                 <span style={{fontSize: '0.85rem', color: '#555'}}>Sub-comp:</span> <A />
              </div>
            </div>
          </div>

          {/* Group: Counters & Flags */}
          <div style={styles.controlGroup}>
             <SectionHeader title="Counters & Flags" icon="🚩" />
             <div style={styles.buttonGrid}>
                <SliceButton label="Count ++" color="#10b981" onClick={() => setCount((prev) => (prev ?? 0) + 1)} />
                <SliceButton label="Reset Count" color="#059669" onClick={() => setCount(0)} variant="outline" />
                <SliceButton label="Auth: True" color="#8b5cf6" onClick={() => setAuth(true)} />
                <SliceButton label="Auth: False" color="#7c3aed" onClick={() => setAuth(false)} variant="outline" />
             </div>
          </div>

          {/* Group: Content & Misc */}
          <div style={styles.controlGroup}>
            <SectionHeader title="Content & Misc" icon="📝" />
            <div style={styles.buttonGrid}>
              <SliceButton label="Set Key" color="#ec4899" onClick={() => setKey("myKey")} />
              <SliceButton label="Set Lol" color="#db2777" onClick={() => setLol({ naem: "😂" })} />
              <SliceButton label="New Blog" color="#eab308" onClick={() => setBlog({ title: "New Blog", des: "Desc" })} />
              <SliceButton label="Append Edit" color="#ca8a04" onClick={appendBlogDescription} variant="outline" />
            </div>
          </div>
        </div>

        {/* Data Visualization */}
        <h3 style={{...styles.sectionTitle, marginTop: 40, marginBottom: 20}}>Live State Snapshots</h3>
        <div style={styles.monitorGrid}>
          <SliceDisplay title="User" data={userState} accentColor="#f97316" />
          <SliceDisplay title="App" data={appState} accentColor="#3b82f6" />
          <SliceDisplay title="Blog" data={blogState} accentColor="#eab308" />
          <SliceDisplay title="Count" data={countState} accentColor="#10b981" />
          <SliceDisplay title="Auth" data={authState} accentColor="#8b5cf6" />
          <SliceDisplay title="Key" data={keyState} accentColor="#ec4899" />
          <SliceDisplay title="Lol" data={lolState} accentColor="#ec4899" />
        </div>
      </div>
    </div>
  );
};

export default UserUpdater;

// --- CSS-in-JS Styles ---

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f3f4f6",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    padding: "40px 20px",
  },
  innerContainer: {
    maxWidth: 1200,
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
    background: "white",
    padding: "24px 32px",
    borderRadius: 16,
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
  },
  title: {
    margin: 0,
    fontSize: "1.8rem",
    fontWeight: 700,
    color: "#111827",
  },
  subtitle: {
    margin: "4px 0 0 0",
    color: "#6b7280",
    fontSize: "0.95rem",
  },
  statusBadge: {
    background: "#dcfce7",
    color: "#166534",
    padding: "6px 12px",
    borderRadius: 99,
    fontSize: "0.85rem",
    fontWeight: 600,
    border: "1px solid #bbf7d0",
  },
  controlPanel: {
    background: "white",
    padding: 24,
    borderRadius: 12,
    marginBottom: 24,
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: 16,
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: 8,
  },
  sectionTitle: {
    margin: 0,
    fontSize: "1rem",
    fontWeight: 600,
    color: "#374151",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 24,
    marginBottom: 40,
  },
  controlGroup: {
    background: "white",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    transition: "transform 0.2s",
  },
  buttonGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
  },
  button: {
    padding: "8px 14px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: 600,
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  monitorGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: 20,
  },
  card: {
    background: "white",
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
    display: "flex",
    flexDirection: "column",
  },
  cardHeader: {
    padding: "12px 16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #f3f4f6",
  },
  badge: {
    fontSize: "0.75rem",
    fontWeight: 700,
    padding: "4px 8px",
    borderRadius: 6,
    textTransform: "uppercase",
  },
  timestamp: {
    fontSize: "0.7rem",
    color: "#9ca3af",
  },
  codeBlock: {
    padding: 16,
    background: "#1e293b",
    flex: 1,
  },
  pre: {
    margin: 0,
    color: "#e2e8f0",
    fontSize: "0.8rem",
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    overflowX: "auto",
    whiteSpace: "pre-wrap",
  },
  row: {
    display: 'flex',
    alignItems: 'center',
  }
};