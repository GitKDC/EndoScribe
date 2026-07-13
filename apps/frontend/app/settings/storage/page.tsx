"use client";
import React, { useEffect, useState } from "react";
import { FiFolder, FiHardDrive, FiShield, FiRefreshCw, FiDatabase, FiCloud, FiTrash2, FiAlertTriangle } from "react-icons/fi";
import { Button } from "@/components/ui/Button";

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
  const [backingUp, setBackingUp] = useState(false);

  // Deletion Modal States
  const [deleteStep, setDeleteStep] = useState(0); // 0=hidden, 1=summary, 2=backup, 3=password, 4=type DELETE, 5=deleting, 6=done
  const [deleteSummary, setDeleteSummary] = useState<any>(null);
  const [adminPassword, setAdminPassword] = useState("");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

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

  const handleBackup = async () => {
    if (!(window as any).api) return;
    setBackingUp(true);
    try {
      const res = await (window as any).api.createBackup();
      if (res && res.success) {
        alert(`Backup saved successfully to ${res.path}\nSize: ${formatBytes(res.bytes)}`);
      }
    } catch (e) {
      alert("Error creating backup: " + (e as Error).message);
    }
    setBackingUp(false);
  };

  const startDeletionFlow = async () => {
    if (!(window as any).api) return;
    setDeleteStep(1);
    try {
      const summary = await (window as any).api.getOldDataSummary();
      setDeleteSummary(summary);
    } catch (e) {
      alert("Failed to get summary");
      setDeleteStep(0);
    }
  };

  const performDeleteBackup = async () => {
    if (!(window as any).api) return;
    setBackingUp(true);
    try {
      const res = await (window as any).api.createBackup();
      if (res && res.success) {
        setDeleteStep(3);
      }
    } catch (e) {
      alert("Error creating backup: " + (e as Error).message);
    }
    setBackingUp(false);
  };

  const verifyPassword = async () => {
    if (!(window as any).api) return;
    const isValid = await (window as any).api.verifyAdminPassword(adminPassword);
    if (isValid) {
      setDeleteStep(4);
    } else {
      alert("Invalid password");
    }
  };

  const finalizeDeletion = async () => {
    if (deleteConfirmText !== "DELETE") {
      alert("You must type DELETE exactly.");
      return;
    }
    setDeleteStep(5);
    try {
      const res = await (window as any).api.deleteOldData();
      if (res && res.success) {
        setDeleteStep(6);
        loadData();
      }
    } catch (e) {
      alert("Error deleting data: " + (e as Error).message);
      setDeleteStep(0);
    }
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
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      
      <div style={{ marginBottom: "28px" }}>
        <p style={{ margin: "0", color: THEME.muted, fontSize: "14.5px" }}>
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
            <Button 
              variant="secondary"
              onClick={() => handleSelectFolder(key)}
              icon={<FiFolder />}
            >
              Browse
            </Button>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Maintenance Actions */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: "16px", fontWeight: "700", color: THEME.navy, marginTop: 0, marginBottom: "20px" }}>Data Maintenance</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <Button 
              variant="secondary"
              onClick={handleVerify}
              disabled={saving}
              icon={<FiShield />}
              style={{ width: "100%" }}
            >
              Verify Storage Integrity
            </Button>
            <Button 
              variant="secondary"
              onClick={handleOptimize}
              disabled={saving}
              icon={<FiRefreshCw />}
              style={{ width: "100%" }}
            >
              Optimize Database (Vacuum)
            </Button>
            <Button 
              variant="danger"
              onClick={startDeletionFlow}
              disabled={saving}
              icon={<FiTrash2 />}
              style={{ width: "100%" }}
            >
              Delete Data Older Than 3 Years
            </Button>
          </div>
        </div>

        {/* Cloud & Backup (Future Prep) */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: "16px", fontWeight: "700", color: THEME.navy, marginTop: 0, marginBottom: "20px" }}>Cloud Sync & Backups</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <Button 
              variant="primary"
              onClick={handleBackup}
              disabled={backingUp}
              icon={<FiCloud />}
              style={{ width: "100%" }}
            >
              {backingUp ? "Creating Backup..." : "Create Local Backup (ZIP)"}
            </Button>
            <div style={{ padding: "16px", background: THEME.bg, borderRadius: "8px", border: `1px dashed ${THEME.border}`, textAlign: "center", color: THEME.muted, fontSize: "13px" }}>
              <div style={{ fontWeight: "600", color: THEME.navy, marginBottom: "4px" }}>Cloud Synchronization</div>
              <div>Multi-device cloud syncing is currently disabled. Contact support to enable hospital network syncing.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Deletion Modal */}
      {deleteStep > 0 && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "white", borderRadius: "16px", padding: "32px", width: "90%", maxWidth: "440px", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
            <div style={{ textAlign: "center", marginBottom: "24px", color: THEME.danger, fontSize: "48px" }}>
              <FiAlertTriangle />
            </div>
            
            {deleteStep === 1 && (
              <>
                <h3 style={{ marginTop: 0, fontSize: "20px", color: THEME.navy, textAlign: "center" }}>Review Deletion Summary</h3>
                <p style={{ color: THEME.muted, fontSize: "14px", textAlign: "center" }}>You are about to permanently delete all reports and data older than 3 years.</p>
                <div style={{ background: THEME.bg, padding: "16px", borderRadius: "8px", margin: "20px 0" }}>
                  <div style={{ fontSize: "14px", color: THEME.text }}><strong>Reports to delete:</strong> {deleteSummary?.count ?? '...'}</div>
                  <div style={{ fontSize: "14px", color: THEME.text, marginTop: "8px" }}><strong>Cutoff date:</strong> {deleteSummary?.date ? new Date(deleteSummary.date).toLocaleDateString() : '...'}</div>
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <Button variant="ghost" onClick={() => setDeleteStep(0)} style={{ flex: 1 }}>Cancel</Button>
                  <Button variant="danger" onClick={() => setDeleteStep(2)} style={{ flex: 1 }}>Proceed</Button>
                </div>
              </>
            )}

            {deleteStep === 2 && (
              <>
                <h3 style={{ marginTop: 0, fontSize: "20px", color: THEME.navy, textAlign: "center" }}>Backup Required</h3>
                <p style={{ color: THEME.muted, fontSize: "14px", textAlign: "center", marginBottom: "24px" }}>Before permanent deletion, you must create a backup of your current database.</p>
                <div style={{ display: "flex", gap: "12px" }}>
                  <Button variant="ghost" onClick={() => setDeleteStep(0)} style={{ flex: 1 }}>Cancel</Button>
                  <Button variant="primary" onClick={performDeleteBackup} disabled={backingUp} style={{ flex: 1 }}>
                    {backingUp ? "Creating..." : "Create Backup"}
                  </Button>
                </div>
              </>
            )}

            {deleteStep === 3 && (
              <>
                <h3 style={{ marginTop: 0, fontSize: "20px", color: THEME.navy, textAlign: "center" }}>Admin Authentication</h3>
                <p style={{ color: THEME.muted, fontSize: "14px", textAlign: "center", marginBottom: "20px" }}>Please enter the master/admin password to continue.</p>
                <input 
                  type="password" 
                  value={adminPassword} 
                  onChange={e => setAdminPassword(e.target.value)} 
                  placeholder="Password" 
                  style={{ width: "100%", padding: "12px", borderRadius: "8px", border: `1.5px solid ${THEME.border}`, marginBottom: "24px", boxSizing: "border-box" }}
                />
                <div style={{ display: "flex", gap: "12px" }}>
                  <Button variant="ghost" onClick={() => setDeleteStep(0)} style={{ flex: 1 }}>Cancel</Button>
                  <Button variant="primary" onClick={verifyPassword} style={{ flex: 1 }}>Verify</Button>
                </div>
              </>
            )}

            {deleteStep === 4 && (
              <>
                <h3 style={{ marginTop: 0, fontSize: "20px", color: THEME.danger, textAlign: "center" }}>Final Confirmation</h3>
                <p style={{ color: THEME.muted, fontSize: "14px", textAlign: "center", marginBottom: "20px" }}>Type <strong>DELETE</strong> below to confirm permanent deletion. This action cannot be undone.</p>
                <input 
                  type="text" 
                  value={deleteConfirmText} 
                  onChange={e => setDeleteConfirmText(e.target.value)} 
                  placeholder="Type DELETE" 
                  style={{ width: "100%", padding: "12px", borderRadius: "8px", border: `1.5px solid ${THEME.danger}`, marginBottom: "24px", boxSizing: "border-box", textAlign: "center", fontWeight: "700" }}
                />
                <div style={{ display: "flex", gap: "12px" }}>
                  <Button variant="ghost" onClick={() => setDeleteStep(0)} style={{ flex: 1 }}>Cancel</Button>
                  <Button variant="danger" onClick={finalizeDeletion} style={{ flex: 1 }}>Permanently Delete</Button>
                </div>
              </>
            )}

            {deleteStep === 5 && (
              <div style={{ textAlign: "center" }}>
                <h3 style={{ marginTop: 0, fontSize: "20px", color: THEME.navy }}>Deleting Data...</h3>
                <p style={{ color: THEME.muted, fontSize: "14px" }}>Please wait while old data is being removed.</p>
              </div>
            )}

            {deleteStep === 6 && (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "48px", color: THEME.teal, marginBottom: "16px" }}>✓</div>
                <h3 style={{ marginTop: 0, fontSize: "20px", color: THEME.navy }}>Deletion Complete</h3>
                <p style={{ color: THEME.muted, fontSize: "14px", marginBottom: "24px" }}>The selected data has been permanently deleted.</p>
                <Button variant="primary" onClick={() => setDeleteStep(0)}>Close</Button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
