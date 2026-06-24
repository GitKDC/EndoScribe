"use client";
import React, { useEffect, useState } from "react";
import PatientForm from "../../components/PatientForm";
import PatientProfile from "../../components/PatientProfile";
import ReportPreview from "../../components/ReportPreview";

export default function PatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showForm, setShowForm] = useState(false);
  const [editPatient, setEditPatient] = useState<any>(null);
  
  const [showProfile, setShowProfile] = useState<any>(null);
  const [viewReport, setViewReport] = useState<any>(null);

  const format = (date: Date, formatString: string) => {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "-";
    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("en-GB", { month: "short" });
    const year = String(date.getFullYear());
    if (formatString === "dd MMM yyyy") {
      return `${day} ${month} ${year}`;
    }
    return date.toISOString();
  };

  const fetchPatients = async () => {
    if (!(window as any).api) return;
    setLoading(true);
    try {
      const data = await (window as any).api.getPatients(search);
      setPatients(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // debounce search
    const t = setTimeout(() => {
      fetchPatients();
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const handleOpenProfile = async (id: number) => {
    const p = await (window as any).api.getPatient(id);
    setShowProfile(p);
  };

  const handleViewReport = async (reportId: number) => {
    const data = await (window as any).api.getReport(reportId);
    setViewReport(data);
  };

  return (
    <div style={{ padding: "32px", fontFamily: "'Inter', sans-serif", backgroundColor: "#f4f7f6", minHeight: "100vh", position: "relative" }}>
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h2 style={{ color: "#1a3a52", fontSize: "28px", fontWeight: "800", margin: 0 }}>Patients</h2>
          <p style={{ color: "#64748b", margin: "4px 0 0 0", fontSize: "14px" }}>Manage patient directory and their reports history</p>
        </div>
        <button 
          onClick={() => { setEditPatient(null); setShowForm(true); }}
          style={{
            padding: "10px 20px", background: "#0d9488", color: "white",
            border: "none", borderRadius: "8px", cursor: "pointer",
            fontWeight: "600", fontSize: "14px", transition: "transform 0.1s"
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >
          + Add Patient
        </button>
      </div>

      {/* FILTER BAR */}
      <div style={{ 
        display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap",
        background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.03)", marginBottom: "24px"
      }}>
        <input 
          type="text" 
          placeholder="🔍 Search by name or phone..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1, minWidth: "250px", padding: "10px 14px",
            border: "1px solid #ccc", borderRadius: "8px", fontSize: "14px", outline: "none"
          }} 
        />
      </div>

      {/* TABLE */}
      <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.03)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
              <th style={{ padding: "16px 24px", color: "#475569", fontSize: "12px", fontWeight: "700", textTransform: "uppercase" }}>Name</th>
              <th style={{ padding: "16px 24px", color: "#475569", fontSize: "12px", fontWeight: "700", textTransform: "uppercase" }}>Phone</th>
              <th style={{ padding: "16px 24px", color: "#475569", fontSize: "12px", fontWeight: "700", textTransform: "uppercase" }}>Age/Gender</th>
              <th style={{ padding: "16px 24px", color: "#475569", fontSize: "12px", fontWeight: "700", textTransform: "uppercase" }}>Reports</th>
              <th style={{ padding: "16px 24px", color: "#475569", fontSize: "12px", fontWeight: "700", textTransform: "uppercase" }}>Last Visit</th>
              <th style={{ padding: "16px 24px", color: "#475569", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>Loading patients...</td></tr>
            ) : patients.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>No patients found</td></tr>
            ) : (
              patients.map(p => (
                <tr key={p.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "16px 24px", fontWeight: "600", color: "#1e293b" }}>{p.name}</td>
                  <td style={{ padding: "16px 24px", color: "#64748b" }}>{p.phone || "-"}</td>
                  <td style={{ padding: "16px 24px", color: "#64748b" }}>{p.age ? `${p.age} / ${p.gender}` : p.gender}</td>
                  <td style={{ padding: "16px 24px", fontWeight: "600", color: "#0d9488" }}>{p.report_count}</td>
                  <td style={{ padding: "16px 24px", color: "#64748b" }}>
                    {p.last_visit ? format(new Date(p.last_visit), "dd MMM yyyy") : "-"}
                  </td>
                  <td style={{ padding: "16px 24px", textAlign: "center", display: "flex", justifyContent: "center", gap: "8px" }}>
                    <button 
                      onClick={() => handleOpenProfile(p.id)}
                      style={{ padding: "6px 12px", fontSize: "12px", fontWeight: "600", cursor: "pointer", background: "white", border: "1px solid #ccc", borderRadius: "6px" }}
                    >Profile</button>
                    <button 
                      onClick={() => { setEditPatient(p); setShowForm(true); }}
                      style={{ padding: "6px 12px", fontSize: "12px", fontWeight: "600", cursor: "pointer", background: "white", border: "1px solid #ccc", borderRadius: "6px" }}
                    >Edit</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODALS */}
      {showForm && (
        <PatientForm 
          initialData={editPatient} 
          onClose={() => setShowForm(false)} 
          onSave={() => { setShowForm(false); fetchPatients(); }} 
        />
      )}

      {showProfile && (
        <PatientProfile 
          patient={showProfile} 
          onClose={() => setShowProfile(null)} 
          onViewReport={handleViewReport} 
        />
      )}

      {/* VIEW REPORT MODAL (reusing structure from Reports page) */}
      {viewReport && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.6)", zIndex: 2000, display: "flex", justifyContent: "center", alignItems: "flex-start", overflowY: "auto", padding: "40px 0" }}>
          <div style={{ backgroundColor: "#e8eaed", width: "95vw", maxWidth: "950px", borderRadius: "12px", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 24px 64px rgba(0,0,0,0.4)" }}>
            <div style={{ width: "100%", boxSizing: "border-box", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", background: "white", borderBottom: "1px solid #ddd", position: "sticky", top: 0, zIndex: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <h3 style={{ margin: 0, color: "#1a3a52", fontSize: "20px", fontWeight: "800" }}>Report Preview</h3>
                <span style={{ background: "#e0f2fe", color: "#0369a1", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700" }}>{viewReport.report_number}</span>
              </div>
              <button onClick={() => setViewReport(null)} style={{ padding: "8px 16px", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "14px" }}>Close Preview</button>
            </div>
            <div style={{ padding: "40px", display: "flex", justifyContent: "center" }}>
              <div style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.15)", background: "white" }}>
                <ReportPreview
                  patientName={viewReport.patient_name}
                  patientAge={`${viewReport.age} Yrs / ${viewReport.gender}`}
                  reportDate={viewReport.created_at}
                  reportType={viewReport.report_type}
                  sections={viewReport.sections || []}
                  doctorName={viewReport.doctor_name || ""}
                  images={viewReport.images?.map((img: any) => ({
                    id: String(img.id), url: img.url || `file://${img.file_path}`, label: "Image"
                  })) || []}
                  prefix={viewReport.patient_prefix}
                  reportNumber={viewReport.report_number}
                  selectedDoctors={viewReport.doctor_name ? [{ id: viewReport.doctor_id, name: viewReport.doctor_name, qualifications: viewReport.qualifications, designation: viewReport.designation }] : undefined}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
