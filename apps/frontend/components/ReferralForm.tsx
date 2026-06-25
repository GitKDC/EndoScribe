import React, { useState } from "react";

interface ReferralFormProps {
  initialData?: any;
  onClose: () => void;
  onSave: () => void;
}

export default function ReferralForm({ initialData, onClose, onSave }: ReferralFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [clinicName, setClinicName] = useState(initialData?.clinic_name || "");
  const [city, setCity] = useState(initialData?.city || "");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert("Name is required");
    
    // Optional: add strict validation if required by business logic
    if (phone.trim() && !/^\d{10}$/.test(phone.trim())) {
      return alert("Phone number must be exactly 10 digits");
    }
    
    setSaving(true);
    try {
      const data = { name, phone, clinic_name: clinicName, city };
      if (initialData?.id) {
        await (window as any).api.updateReferral(initialData.id, data);
      } else {
        await (window as any).api.createReferral(data);
      }
      onSave();
    } catch (err) {
      console.error(err);
      alert("Failed to save referral doctor");
    } finally {
      setSaving(false);
    }
  };

  const inp = {
    width: "100%", padding: "10px 12px", borderRadius: "8px",
    border: "1px solid #ccc", fontSize: "14px", fontFamily: "inherit",
    boxSizing: "border-box" as any
  };
  const lbl = {
    display: "block", marginBottom: "6px", fontSize: "13px",
    fontWeight: 600, color: "#1a3a52", textTransform: "uppercase" as any, letterSpacing: "0.5px"
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
      zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{
        background: "white", width: "400px", borderRadius: "12px",
        overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
      }}>
        <div style={{
          padding: "16px 20px", background: "#f4f7f6", borderBottom: "1px solid #ddd",
          display: "flex", justifyContent: "space-between", alignItems: "center"
        }}>
          <h3 style={{ margin: 0, color: "#1a3a52" }}>
            {initialData ? "Edit Referral Doctor" : "New Referral Doctor"}
          </h3>
          <button onClick={onClose} style={{
            background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#666"
          }}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "24px" }}>
          <div style={{ marginBottom: "16px" }}>
            <label style={lbl}>Doctor Name *</label>
            <input value={name} onChange={e => setName(e.target.value)} required style={inp} placeholder="e.g. Dr. Rajesh Kumar" />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={lbl}>WhatsApp Number (10 digits)</label>
            <input value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} style={inp} placeholder="e.g. 9876543210" />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={lbl}>Clinic / Hospital Name</label>
            <input value={clinicName} onChange={e => setClinicName(e.target.value)} style={inp} placeholder="e.g. City Care Clinic" />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={lbl}>City</label>
            <input value={city} onChange={e => setCity(e.target.value)} style={inp} placeholder="e.g. Mumbai" />
          </div>

          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
            <button type="button" onClick={onClose} style={{
              padding: "10px 16px", borderRadius: "8px", border: "1px solid #ccc",
              background: "white", cursor: "pointer", fontWeight: 600
            }}>Cancel</button>
            <button type="submit" disabled={saving} style={{
              padding: "10px 24px", borderRadius: "8px", border: "none",
              background: "#0d9488", color: "white", cursor: saving ? "wait" : "pointer", fontWeight: 600
            }}>
              {saving ? "Saving..." : "Save Doctor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
