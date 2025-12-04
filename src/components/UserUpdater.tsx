import React from "react";
import { useMultipleState } from "../hooks/userMultipleState";

// --- UI Components ---
const SectionHeader: React.FC<{ title: string; icon?: string }> = ({ title, icon }) => (
  <div style={styles.sectionHeader}>
    {icon && <span style={{ marginRight: 8 }}>{icon}</span>}
    <h3 style={styles.sectionTitle}>{title}</h3>
  </div>
);



const SliceDisplay: React.FC<{ title: string; data: any; accentColor: string }> = ({ title, data, accentColor }) => (
  <div style={{ ...styles.card, borderTop: `4px solid ${accentColor}` }}>
    <div style={styles.cardHeader}>
      <span style={{ ...styles.badge, background: `${accentColor}20`, color: accentColor }}>{title}</span>
      <span style={styles.timestamp}>Live</span>
    </div>
    <div style={styles.codeBlock}>
      <pre style={styles.pre}>{JSON.stringify(data, null, 2)}</pre>
    </div>
  </div>
);

// --- Main Component ---
const UserUpdater: React.FC = () => {
  const { Blog } = useMultipleState(["Blog"]);
  const { state: blogState } = Blog;




  return (
    <div style={styles.container}>
      <div style={styles.innerContainer}>
        <div style={styles.controlPanel}>
          <SectionHeader title="Blog Management" icon="📝" />
          <div style={styles.buttonGrid}>
  
          </div>
        </div>

        <h3 style={{ ...styles.sectionTitle, marginTop: 40, marginBottom: 20 }}>Live Blog Snapshot</h3>
        <div style={styles.monitorGrid}>
          <SliceDisplay title="Blog" data={blogState} accentColor="#eab308" />
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
    maxWidth: 800,
    margin: "0 auto",
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
    gridTemplateColumns: "1fr",
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
};
