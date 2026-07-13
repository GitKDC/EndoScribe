"use client";
import React, { useState, useEffect } from "react";
import { FiMessageSquare, FiSave, FiCheckCircle } from "react-icons/fi";
import { Button } from "../../../components/ui/Button";

const THEME = {
  navy: "#1a3a52",
  teal: "#0d9488",
  border: "#e2e8f0",
  bg: "#f4f7f6",
  text: "#1e293b",
  muted: "#64748b",
};

export default function WhatsAppSettingsPage() {
  const [token, setToken] = useState("");
  const [phoneId, setPhoneId] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [doctorTemplateName, setDoctorTemplateName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      if ((window as any).api) {
        const _token = await (window as any).api.getSetting("whatsapp_access_token");
        const _phoneId = await (window as any).api.getSetting("whatsapp_phone_number_id");
        const _template = await (window as any).api.getSetting("whatsapp_template_name");
        const _docTemplate = await (window as any).api.getSetting("whatsapp_doctor_template_name");
        
        if (_token) setToken(_token);
        if (_phoneId) setPhoneId(_phoneId);
        if (_template) setTemplateName(_template);
        if (_docTemplate) setDoctorTemplateName(_docTemplate);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await (window as any).api.setSetting("whatsapp_access_token", token.trim());
      await (window as any).api.setSetting("whatsapp_phone_number_id", phoneId.trim());
      await (window as any).api.setSetting("whatsapp_template_name", templateName.trim());
      await (window as any).api.setSetting("whatsapp_doctor_template_name", doctorTemplateName.trim());
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save WhatsApp settings", err);
      alert("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
        <div style={{ 
          background: "#dcfce7", color: "#16a34a", padding: "12px", 
          borderRadius: "12px", display: "flex", alignItems: "center" 
        }}>
          <FiMessageSquare size={24} />
        </div>
        <div>
          <h1 style={{ color: THEME.navy, fontSize: "28px", fontWeight: "700", margin: 0 }}>
            WhatsApp Integration
          </h1>
          <p style={{ color: THEME.muted, margin: "4px 0 0", fontSize: "14px" }}>
            Configure Meta Cloud API credentials to enable automated report delivery.
          </p>
        </div>
      </div>

      <div style={{ background: "white", padding: "32px", borderRadius: "16px", border: `1px solid ${THEME.border}`, boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: THEME.text }}>
              Meta Access Token
            </label>
            <p style={{ fontSize: "13px", color: THEME.muted, marginBottom: "8px", lineHeight: "1.4" }}>
              The permanent access token generated from your Meta App Dashboard. It allows EndoScribe to send messages on your behalf.
            </p>
            <input 
              type="password" 
              value={token} 
              onChange={e => setToken(e.target.value)}
              placeholder="EAAI..."
              style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: `1.5px solid ${THEME.border}`, boxSizing: "border-box", fontSize: "14px", outline: "none", transition: "border-color 0.2s" }}
              onFocus={(e) => e.target.style.borderColor = THEME.teal}
              onBlur={(e) => e.target.style.borderColor = THEME.border}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: THEME.text }}>
              Phone Number ID
            </label>
            <p style={{ fontSize: "13px", color: THEME.muted, marginBottom: "8px", lineHeight: "1.4" }}>
              The unique Phone Number ID assigned to your WhatsApp Business Account.
            </p>
            <input 
              type="text" 
              value={phoneId} 
              onChange={e => setPhoneId(e.target.value)}
              placeholder="e.g. 10123456789"
              style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: `1.5px solid ${THEME.border}`, boxSizing: "border-box", fontSize: "14px", outline: "none", transition: "border-color 0.2s" }}
              onFocus={(e) => e.target.style.borderColor = THEME.teal}
              onBlur={(e) => e.target.style.borderColor = THEME.border}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: THEME.text }}>
              Message Template Name
            </label>
            <p style={{ fontSize: "13px", color: THEME.muted, marginBottom: "8px", lineHeight: "1.4" }}>
              The exact name of the approved template in your Meta Dashboard (e.g., <code>report_ready</code>).
            </p>
            <input 
              type="text" 
              value={templateName} 
              onChange={e => setTemplateName(e.target.value)}
              placeholder="report_ready"
              style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: `1.5px solid ${THEME.border}`, boxSizing: "border-box", fontSize: "14px", outline: "none", transition: "border-color 0.2s" }}
              onFocus={(e) => e.target.style.borderColor = THEME.teal}
              onBlur={(e) => e.target.style.borderColor = THEME.border}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: THEME.text }}>
              Doctor Template Name (Optional)
            </label>
            <p style={{ fontSize: "13px", color: THEME.muted, marginBottom: "8px", lineHeight: "1.4" }}>
              A separate template name for sending to referring doctors. If left blank, it uses the standard message template.
            </p>
            <input 
              type="text" 
              value={doctorTemplateName} 
              onChange={e => setDoctorTemplateName(e.target.value)}
              placeholder="e.g., doctor_report_ready"
              style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: `1.5px solid ${THEME.border}`, boxSizing: "border-box", fontSize: "14px", outline: "none", transition: "border-color 0.2s" }}
              onFocus={(e) => e.target.style.borderColor = THEME.teal}
              onBlur={(e) => e.target.style.borderColor = THEME.border}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "16px", marginTop: "16px", paddingTop: "24px", borderTop: `1px solid ${THEME.border}` }}>
            {saveSuccess && (
              <div style={{ color: "#16a34a", fontSize: "14px", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
                <FiCheckCircle /> Settings saved successfully
              </div>
            )}
            <Button variant="primary" icon={<FiSave />} type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Configuration"}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}
