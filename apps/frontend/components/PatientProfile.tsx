import React from "react";
import { format } from "date-fns";

interface PatientProfileProps {
  patient: any;
  onClose: () => void;
  onViewReport: (reportId: number) => void;
}

export default function PatientProfile({ patient, onClose, onViewReport }: PatientProfileProps) {
  if (!patient) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
      zIndex: 1000, display: "flex", justifyContent: "flex-end"
    }}>
      <div style={{
        background: "#f4f7f6", width: "500px", height: "100%",
        boxShadow: "-10px 0 40px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column",
        animation: "slideIn 0.3s ease-out"
      }}>
        <style>{`
          @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        `}</style>
        
        <div style={{
          padding: "24px 32px", background: "white", borderBottom: "1px solid #ddd",
          display: "flex", justifyContent: "space-between", alignItems: "flex-start"
        }}>
          <div>
            <h2 style={{ margin: 0, color: "#1a3a52", fontSize: "24px", fontWeight: 800 }}>
              {patient.name}
            </h2>
            <div style={{ color: "#64748b", fontSize: "14px", marginTop: "8px", display: "flex", gap: "12px" }}>
              <span>📞 {patient.phone || "N/A"}</span>
              <span>•</span>
              <span>👤 {patient.age ? `${patient.age} Yrs` : "N/A"} / {patient.gender}</span>
            </div>
            <div style={{ color: "#64748b", fontSize: "14px", marginTop: "4px", display: "flex", gap: "12px" }}>
              {patient.city && (
                <><span>🏠 {patient.city}</span><span>•</span></>
              )}
              {patient.procedure_type && (
                <span>⚕️ {patient.procedure_type}</span>
              )}
            </div>
          </div>
          <button onClick={onClose} style={{
            background: "none", border: "none", fontSize: "24px", cursor: "pointer", color: "#666"
          }}>×</button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "32px" }}>
          <h4 style={{ margin: "0 0 20px 0", color: "#1a3a52", fontSize: "16px", textTransform: "uppercase", letterSpacing: "1px" }}>
            Report History ({patient.reports?.length || 0})
          </h4>

          {!patient.reports || patient.reports.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#64748b", background: "white", borderRadius: "12px", border: "1px solid #ddd" }}>
              No reports found for this patient.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {patient.reports.map((r: any) => (
                <div key={r.id} style={{
                  background: "white", borderRadius: "12px", padding: "16px",
                  border: "1px solid #ddd", boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                  display: "flex", justifyContent: "space-between", alignItems: "center"
                }}>
                  <div>
                    <div style={{ fontSize: "15px", fontWeight: 700, color: "#1a3a52", marginBottom: "4px" }}>
                      {r.report_type}
                    </div>
                    <div style={{ fontSize: "13px", color: "#64748b" }}>
                      Ref: {r.report_number} • {format(new Date(r.created_at), "dd MMM yyyy")}
                    </div>
                  </div>
                  <button onClick={() => onViewReport(r.id)} style={{
                    padding: "8px 16px", background: "#f0fdf4", color: "#166534",
                    border: "1px solid #bbf7d0", borderRadius: "8px", cursor: "pointer",
                    fontSize: "13px", fontWeight: 600, transition: "transform 0.1s"
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
