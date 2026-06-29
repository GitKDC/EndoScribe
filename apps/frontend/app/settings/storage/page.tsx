"use client";
import React, { useEffect, useState } from "react";
import { FiFolder, FiHardDrive, FiShield, FiRefreshCw, FiDatabase, FiCloud } from "react-icons/fi";

const THEME = {
  navy: "#1a3a52",
  navyDark: "#0f2a3f",
  teal: "#0d9488",
  tealLight: "#ccfbf1",
  tealBg: "#f0fdfa",
  bg: "#f0f4f8",
  border: "#e2e8f0",
  text: "#1e293b",
  muted: "#64748b",
  white: "#ffffff",
  danger: "#dc2626",
  dangerBg: "#fef2f2"
};

export default function StorageSettingsPage() {
  const [config, setConfig] = useState<any>(null);
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    if ((window as any).api) {
      try {
        const conf = await (window as any).api.getAppConfig();
        const hlth = await (window as any).api.getStorageHealth();
        setConfig(conf);
        setHealth(hlth);
      } catch (err) {
        console.error("Failed to load storage data", err);
      }
    }
    setLoading(false);
  };

  const handleSelectFolder = async (key: string) => {
    if (!(window as any).api) return;
    const newPath = await (window as any).api.selectFolder();
    if (newPath) {
      const newConfig = { ...config, storagePaths: { ...config.storagePaths, [key]: newPath } };
      setConfig(newConfig);
      await (window as any).api.setAppConfig({ storagePaths: newConfig.storagePaths });
      loadData();
    }
  };

  const handleOptimize = async () => {
    if (!(window as any).api) return;
    setSaving(true);
    try {
      await (window as any).api.optimizeDb();
      alert("Database optimized successfully!");
      loadData();
    } catch (e) {
      alert("Error optimizing database");
    }
    setSaving(false);
  };

  const handleVerify = async () => {
    if (!(window as any).api) return;
    setSaving(true);
    try {
      const res = await (window as any).api.verifyStorage();
      alert(`Storage Verification: ${res.status}`);
    } catch (e) {
      alert("Verification failed");
    }
    setSaving(false);
  };

  if (loading) {
    return <div style={{ padding: "40px", fontFamily: "Inter", color: THEME.navy }}>Loading Storage Data...</div>;
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const cardStyle = {
    background: THEME.white,
    border: `1px solid ${THEME.border}`,
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    marginBottom: "24px"
  };

  return (
    <div style={{ padding: "32px 40px", background: THEME.bg, minHeight: "100%", fontFamily: "'Inter', sans-serif" }}>
      
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ margin: 0, fontSize: "28px", fontWeight: "800", color: THEME.navyDark }}>
          Data & Storage Settings
        </h1>
        <p style={{ margin: "6px 0 0", color: THEME.muted, fontSize: "14.5px" }}>
          Manage your application's data pathways, verify integrity, and secure patient information.
        </p>
      </div>

      {/* Storage Health Widget */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginBottom: "24px" }}>
        <div style={{ ...cardStyle, marginBottom: 0, display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "10px", background: THEME.tealBg, color: THEME.teal, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>
            <FiDatabase />
          </div>
          <div>
            <div style={{ fontSize: "24px", fontWeight: "800", color: THEME.navyDark }}>{health ? formatBytes(health.totalBytes) : "..."}</div>
            <div style={{ fontSize: "13px", color: THEME.muted, fontWeight: "600" }}>Total Storage Used</div>
          </div>
        </div>
        <div style={{ ...cardStyle, marginBottom: 0, display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "10px", background: "#f8fafc", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>
            <FiHardDrive />
          </div>
          <div>
            <div style={{ fontSize: "24px", fontWeight: "800", color: THEME.navyDark }}>{health?.freeGB || "..."} GB</div>
            <div style={{ fontSize: "13px", color: THEME.muted, fontWeight: "600" }}>Free Disk Space</div>
          </div>
        </div>
        <div style={{ ...cardStyle, marginBottom: 0, display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "10px", background: "#f0fdf4", color: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>
            <FiShield />
          </div>
          <div>
            <div style={{ fontSize: "24px", fontWeight: "800", color: THEME.navyDark }}>{health?.status || "..."}</div>
            <div style={{ fontSize: "13px", color: THEME.muted, fontWeight: "600" }}>System Status</div>
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: "16px", fontWeight: "700", color: THEME.navy, marginTop: 0, marginBottom: "16px" }}>Storage Breakdown</h2>
        <div style={{ display: "flex", gap: "24px" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "13px", color: THEME.muted }}>Database</div>
            <div style={{ fontSize: "16px", fontWeight: "600", color: THEME.text }}>{health ? formatBytes(health.databaseBytes) : "..."}</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "13px", color: THEME.muted }}>Patient Images</div>
            <div style={{ fontSize: "16px", fontWeight: "600", color: THEME.text }}>{health ? formatBytes(health.imagesBytes) : "..."}</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "13px", color: THEME.muted }}>PDF Reports</div>
            <div style={{ fontSize: "16px", fontWeight: "600", color: THEME.text }}>{health ? formatBytes(health.reportsBytes) : "..."}</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "13px", color: THEME.muted }}>Backups</div>
            <div style={{ fontSize: "16px", fontWeight: "600", color: THEME.text }}>{health ? formatBytes(health.backupsBytes) : "..."}</div>
          </div>
        </div>
      </div>

      {/* Storage Locations */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: "16px", fontWeight: "700", color: THEME.navy, marginTop: 0, marginBottom: "20px" }}>Storage Locations</h2>
        
        {['database', 'images', 'reports', 'backups', 'exports'].map((key) => (
          <div key={key} style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "120px", fontSize: "14px", fontWeight: "600", color: THEME.text, textTransform: "capitalize" }}>{key}</div>
            <div style={{ flex: 1, padding: "10px 16px", background: THEME.bg, borderRadius: "8px", border: `1px solid ${THEME.border}`, fontSize: "13px", color: THEME.muted, wordBreak: "break-all" }}>
              {config?.storagePaths[key]}
            </div>
            <button 
              onClick={() => handleSelectFolder(key)}
              style={{ padding: "8px 16px", background: THEME.white, border: `1px solid ${THEME.border}`, borderRadius: "8px", fontSize: "13px", fontWeight: "600", color: THEME.navy, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
            >
              <FiFolder /> Browse
            </button>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Maintenance Actions */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: "16px", fontWeight: "700", color: THEME.navy, marginTop: 0, marginBottom: "20px" }}>Data Maintenance</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <button 
              onClick={handleVerify}
              disabled={saving}
              style={{ width: "100%", padding: "12px", background: THEME.white, border: `1px solid ${THEME.border}`, borderRadius: "8px", fontSize: "14px", fontWeight: "600", color: THEME.navy, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
            >
              <FiShield /> Verify Storage Integrity
            </button>
            <button 
              onClick={handleOptimize}
              disabled={saving}
              style={{ width: "100%", padding: "12px", background: THEME.white, border: `1px solid ${THEME.border}`, borderRadius: "8px", fontSize: "14px", fontWeight: "600", color: THEME.navy, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
            >
              <FiRefreshCw /> Optimize Database (Vacuum)
            </button>
          </div>
        </div>

        {/* Cloud & Backup (Future Prep) */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: "16px", fontWeight: "700", color: THEME.navy, marginTop: 0, marginBottom: "20px" }}>Cloud Sync & Backups</h2>
          <div style={{ padding: "16px", background: THEME.bg, borderRadius: "8px", border: `1px dashed ${THEME.border}`, textAlign: "center", color: THEME.muted, fontSize: "14px" }}>
            <FiCloud size={32} style={{ marginBottom: "12px", color: THEME.teal }} />
            <div style={{ fontWeight: "600", color: THEME.navy, marginBottom: "4px" }}>Cloud Synchronization</div>
            <div>Multi-device cloud syncing is currently disabled. Contact support to enable hospital network syncing.</div>
          </div>
        </div>
      </div>

    </div>
  );
}
