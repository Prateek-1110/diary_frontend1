import { useEffect, useState } from "react";

const WARMUP_SECONDS = 50;

export default function ServerWarmupDialog({ visible }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!visible) { setElapsed(0); return; }
    const id = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(id);
  }, [visible]);

  if (!visible) return null;

  const pct = Math.min((elapsed / WARMUP_SECONDS) * 100, 100);
  const remaining = Math.max(WARMUP_SECONDS - elapsed, 0);

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999
    }}>
      <div style={{
        background: "var(--color-background-primary, #fff)",
        borderRadius: 16, border: "0.5px solid #e0e0e0",
        padding: "2rem", width: "100%", maxWidth: 360, margin: "0 1rem"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 20, height: 20, borderRadius: "50%",
            border: "2px solid #ddd", borderTopColor: "#7F77DD",
            animation: "spin 0.9s linear infinite", flexShrink: 0
          }} />
          <p style={{ margin: 0, fontWeight: 500, fontSize: 15 }}>Server is waking up...</p>
        </div>
        <p style={{ fontSize: 13, color: "#666", margin: "0 0 16px", lineHeight: 1.6 }}>
          The server sleeps after 15 min of inactivity. It takes up to{" "}
          <strong>50 seconds</strong> to restart. Hold on!
        </p>
        <div style={{
          background: "#f0f0f0", borderRadius: 999, height: 6,
          overflow: "hidden", marginBottom: 8
        }}>
          <div style={{
            height: "100%", width: `${pct}%`,
            background: "#7F77DD", borderRadius: 999,
            transition: "width 0.8s linear"
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12, color: "#999" }}>Estimated wait</span>
          <span style={{ fontSize: 13, fontWeight: 500 }}>
            {remaining > 0 ? `${remaining}s remaining` : "Almost there..."}
          </span>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}