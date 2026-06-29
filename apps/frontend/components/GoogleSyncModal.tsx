import React, { useState, useEffect } from "react";
import { Button } from "./ui/Button";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function GoogleSyncModal({ onClose, onSuccess }: Props) {
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingConfig, setFetchingConfig] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const loadCreds = async () => {
      try {
        const creds = await (window as any).api.getGoogleCredentials();
        if (creds.clientId) setClientId(creds.clientId);
        if (creds.clientSecret) setClientSecret(creds.clientSecret);
      } catch (err) {
        console.error(err);
      } finally {
        setFetchingConfig(false);
      }
    };
    loadCreds();
  }, []);

  const handleSync = async () => {
    if (!clientId || !clientSecret) {
      setError("Please provide both Client ID and Client Secret.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      // Save credentials first
      await (window as any).api.setGoogleCredentials({ clientId, clientSecret });
      
      // Perform sync
      const result = await (window as any).api.syncGoogleContacts();
      setSuccess(`Successfully synced ${result.added} new doctors (out of ${result.totalFetched} contacts).`);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 3000);
    } catch (err: any) {
      setError(err.message || "An error occurred during sync.");
    } finally {
      setLoading(false);
    }
  };

  const inp = {
    width: "100%", padding: "10px 12px", borderRadius: "8px",
    border: "1px solid #ccc", fontSize: "14px", fontFamily: "inherit",
    boxSizing: "border-box" as any, marginBottom: "16px"
  };
  const lbl = {
    display: "block", marginBottom: "6px", fontSize: "13px",
    fontWeight: 600, color: "#1a3a52"
  };

  if (fetchingConfig) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
      zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{
        background: "white", width: "450px", borderRadius: "12px",
        overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
      }}>
        <div style={{
          padding: "16px 20px", background: "#f4f7f6", borderBottom: "1px solid #ddd",
          display: "flex", justifyContent: "space-between", alignItems: "center"
        }}>
          <h3 style={{ margin: 0, color: "#1a3a52" }}>Sync Google Contacts</h3>
          <button onClick={onClose} style={{
            background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#666"
          }}>×</button>
        </div>

        <div style={{ padding: "24px" }}>
          {error && <div style={{ background: "#fef2f2", color: "#dc2626", padding: "10px", borderRadius: "6px", marginBottom: "16px", fontSize: "13px" }}>{error}</div>}
          {success && <div style={{ background: "#f0fdfa", color: "#0d9488", padding: "10px", borderRadius: "6px", marginBottom: "16px", fontSize: "13px" }}>{success}</div>}

          <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "20px", lineHeight: 1.5 }}>
            To sync contacts, please provide your Google OAuth 2.0 Desktop Application credentials.
            You can create these in the Google Cloud Console.
          </p>

          <label style={lbl}>Client ID</label>
          <input value={clientId} onChange={e => setClientId(e.target.value)} style={inp} placeholder="Enter Client ID" />

          <label style={lbl}>Client Secret</label>
          <input type="password" value={clientSecret} onChange={e => setClientSecret(e.target.value)} style={inp} placeholder="Enter Client Secret" />

          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "8px" }}>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button variant="primary" onClick={handleSync} disabled={loading}>
              {loading ? "Syncing (Check Browser)..." : "Start Sync"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
