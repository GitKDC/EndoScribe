"use client";
import React, { useEffect, useState } from "react";
import ReportPreview from "../../components/ReportPreview";
import { IoMdEye, IoIosArrowDown } from "react-icons/io";
import { SlCalender } from "react-icons/sl";
import { MdPrint, MdPictureAsPdf, MdDownload } from "react-icons/md";
import { generatePDF } from "../../utils/reportGenerator";

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [procedure, setProcedure] = useState("All");
  const [doctorId, setDoctorId] = useState("All");

  const [doctors, setDoctors] = useState<any[]>([]);

  // View modal state
  const [selectedReport, setSelectedReport] = useState<any>(null);

  // Download state
  const [downloadingReport, setDownloadingReport] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchReports = async () => {
    if (!(window as any).api) return;
    setLoading(true);
    try {
      const res = await (window as any).api.getAllReports({
        page,
        limit: 10,
        search,
        startDate,
        endDate,
        procedure,
        doctorId
      });
      setReports(res.data || []);
      setTotalItems(res.totalItems || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, [page, search, startDate, endDate, procedure, doctorId]);

  useEffect(() => {
    const fetchDoctors = async () => {
      if (!(window as any).api) return;
      const res = await (window as any).api.getDoctors();
      setDoctors(res || []);
    };
    fetchDoctors();
  }, []);

  const handleView = async (id: number) => {
    if (!(window as any).api) return;
    const data = await (window as any).api.getReport(id);
    setSelectedReport(data);
  };

  const handleDownloadPDF = async (id: number) => {
    if (!(window as any).api) return;
    setIsGenerating(true);
    const data = await (window as any).api.getReport(id);
    setDownloadingReport(data);
  };

  useEffect(() => {
    if (downloadingReport && isGenerating) {
      // Need a short delay to allow React to mount the off-screen ReportPreview and images to load
      setTimeout(async () => {
        try {
          await generatePDF(
            downloadingReport.created_at,
            downloadingReport.patient_name,
            `${downloadingReport.age} Yrs / ${downloadingReport.gender}`,
            downloadingReport.report_type
          );
        } catch (err) {
          console.error("PDF generation failed", err);
          alert("Failed to generate PDF");
        } finally {
          setIsGenerating(false);
          setDownloadingReport(null);
        }
      }, 500); // 500ms delay for DOM to settle
    }
  }, [downloadingReport, isGenerating]);

  return (
    <div style={{ padding: "32px", fontFamily: "'Inter', sans-serif", backgroundColor: "#f4f7f6", minHeight: "100vh" }}>
      <h2 style={{ color: "#1a3a52", fontSize: "28px", fontWeight: "800", marginBottom: "24px" }}>Patient Reports</h2>

      {/* FILTERS */}
      <div style={{
        display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap",
        background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
      }}>
        <input 
          placeholder="Search patient..." 
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          style={{ padding: "10px 14px", border: "1px solid #ddd", borderRadius: "8px", flex: 1, minWidth: "220px", fontSize: "14px", outline: "none" }}
        />
        
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "14px", fontWeight: "600", color: "#555" }}>Date:</span>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
              style={{ padding: "10px 14px", paddingRight: "32px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", outline: "none", appearance: "none", WebkitAppearance: "none", cursor: "pointer" }}
            />
            <div style={{ position: "absolute", right: "10px", pointerEvents: "none", color: "#0d9488", display: "flex" }}><SlCalender size={14} /></div>
          </div>
          <span style={{ fontSize: "14px", color: "#888" }}>to</span>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
              style={{ padding: "10px 14px", paddingRight: "32px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", outline: "none", appearance: "none", WebkitAppearance: "none", cursor: "pointer" }}
            />
            <div style={{ position: "absolute", right: "10px", pointerEvents: "none", color: "#0d9488", display: "flex" }}><SlCalender size={14} /></div>
          </div>
        </div>

        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <select 
            value={procedure} 
            onChange={(e) => { setProcedure(e.target.value); setPage(1); }}
            style={{ padding: "10px 14px", paddingRight: "32px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", outline: "none", cursor: "pointer", backgroundColor: "white", appearance: "none", WebkitAppearance: "none" }}
          >
            <option value="All">All Procedures</option>
            <option value="UGI">Upper GI Endo</option>
            <option value="COLONOSCOPY">Colonoscopy</option>
            <option value="SIGMOIDOSCOPY">Sigmoidoscopy</option>
            <option value="ERCP">ERCP</option>
            <option value="ENTEROSCOPY">Enteroscopy</option>
            <option value="VLS">VLS Scopy</option>
          </select>
          <div style={{ position: "absolute", right: "10px", pointerEvents: "none", color: "#0d9488", display: "flex" }}><IoIosArrowDown size={14} /></div>
        </div>

        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <select 
            value={doctorId} 
            onChange={(e) => { setDoctorId(e.target.value); setPage(1); }}
            style={{ padding: "10px 14px", paddingRight: "32px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", outline: "none", cursor: "pointer", backgroundColor: "white", appearance: "none", WebkitAppearance: "none" }}
          >
            <option value="All">All Doctors</option>
            {doctors.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          <div style={{ position: "absolute", right: "10px", pointerEvents: "none", color: "#0d9488", display: "flex" }}><IoIosArrowDown size={14} /></div>
        </div>
      </div>

      {/* TABLE */}
      <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.03)", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #eaeaea", color: "#777", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              <th style={{ padding: "18px 24px", fontWeight: "700" }}>Report No</th>
              <th style={{ padding: "18px 24px", fontWeight: "700" }}>Patient</th>
              <th style={{ padding: "18px 24px", fontWeight: "700" }}>Procedure</th>
              <th style={{ padding: "18px 24px", fontWeight: "700" }}>Doctor</th>
              <th style={{ padding: "18px 24px", fontWeight: "700" }}>Date</th>
              <th style={{ padding: "18px 24px", fontWeight: "700", textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "#666", fontSize: "15px" }}>Loading reports...</td></tr>
            ) : reports.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "#666", fontSize: "15px" }}>No reports found matching your criteria.</td></tr>
            ) : (
              reports.map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid #f0f0f0", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#fafafa"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                  <td style={{ padding: "16px 24px", fontSize: "14px", fontWeight: "600", color: "#333" }}>{r.report_number || "-"}</td>
                  <td style={{ padding: "16px 24px", fontSize: "15px", color: "#111", fontWeight: "500" }}>{r.patient_prefix} {r.patient_name}</td>
                  <td style={{ padding: "16px 24px", fontSize: "14px", color: "#007bff", fontWeight: "600" }}>{r.report_type}</td>
                  <td style={{ padding: "16px 24px", fontSize: "14px", color: "#555" }}>{r.doctor_name || "-"}</td>
                  <td style={{ padding: "16px 24px", fontSize: "14px", color: "#555", fontWeight: "500" }}>
                    {new Date(r.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td style={{ padding: "16px 24px", textAlign: "center" }}>
                    <button 
                      onClick={() => handleView(r.id)} 
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#0d9488", transition: "transform 0.1s", marginRight: "12px" }} 
                      title="View Report"
                      onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
                      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                    >
                      <IoMdEye size={22} />
                    </button>
                    <button 
                      onClick={() => handleDownloadPDF(r.id)} 
                      disabled={isGenerating}
                      style={{ background: "none", border: "none", cursor: isGenerating ? "wait" : "pointer", color: "#0369a1", transition: "transform 0.1s", opacity: isGenerating ? 0.5 : 1 }} 
                      title="Download PDF"
                      onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
                      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                    >
                      <MdDownload size={22} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {reports.length > 0 && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "24px", padding: "0 8px" }}>
          <span style={{ fontSize: "14px", color: "#666", fontWeight: "500" }}>
            Showing <strong style={{ color: "#111" }}>{(page - 1) * 10 + 1}</strong> to <strong style={{ color: "#111" }}>{Math.min(page * 10, totalItems)}</strong> of <strong style={{ color: "#111" }}>{totalItems}</strong> entries
          </span>
          <div style={{ display: "flex", gap: "10px" }}>
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              style={{ 
                padding: "8px 18px", border: "1px solid #ddd", background: "white", borderRadius: "6px", 
                cursor: page === 1 ? "not-allowed" : "pointer", opacity: page === 1 ? 0.5 : 1,
                fontSize: "14px", fontWeight: "600", color: "#333", boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
              }}
            >
              Previous
            </button>
            <button 
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage(p => p + 1)}
              style={{ 
                padding: "8px 18px", border: "1px solid #ddd", background: "white", borderRadius: "6px", 
                cursor: (page === totalPages || totalPages === 0) ? "not-allowed" : "pointer", 
                opacity: (page === totalPages || totalPages === 0) ? 0.5 : 1,
                fontSize: "14px", fontWeight: "600", color: "#333", boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* MODAL FOR REPORT VIEW */}
      {selectedReport && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)", zIndex: 9999, 
          display: "flex", justifyContent: "center", alignItems: "center"
        }}>
          <div style={{
            background: "#f4f7f6", borderRadius: "12px", height: "95vh", overflowY: "auto",
            display: "flex", flexDirection: "column", alignItems: "center", width: "95vw", maxWidth: "950px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
          }}>
            {/* Modal Header */}
            <div style={{ 
              width: "100%", boxSizing: "border-box", display: "flex", justifyContent: "space-between", alignItems: "center", 
              padding: "20px 40px", background: "white", borderBottom: "1px solid #ddd", position: "sticky", top: 0, zIndex: 10
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <h3 style={{ margin: 0, color: "#1a3a52", fontSize: "20px", fontWeight: "800" }}>Report Preview</h3>
                <span style={{ background: "#e0f2fe", color: "#0369a1", padding: "4px 10px", borderRadius: "20px", fontSize: "13px", fontWeight: "700" }}>
                  {selectedReport.report_number}
                </span>
              </div>
              <button 
                onClick={() => setSelectedReport(null)} 
                style={{ 
                  background: "#ef4444", color: "white", border: "none", padding: "8px 16px", 
                  borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "14px",
                  boxShadow: "0 2px 4px rgba(239, 68, 68, 0.3)"
                }}
              >
                Close Preview
              </button>
            </div>

            {/* Modal Body (A4 Report) */}
            <div style={{ padding: "30px", width: "100%", display: "flex", justifyContent: "center" }}>
              <div style={{ zoom: 0.85, boxShadow: "0 10px 30px rgba(0,0,0,0.15)", borderRadius: "2px", overflow: "hidden" }}>
                <ReportPreview
                  patientName={selectedReport.patient_name}
                  patientAge={`${selectedReport.age} Yrs / ${selectedReport.gender}`}
                  reportDate={selectedReport.created_at}
                  reportType={selectedReport.report_type}
                  sections={selectedReport.sections || []}
                  doctorName={selectedReport.doctor_name || ""}
                  images={selectedReport.images?.map((img: any) => ({
                    id: String(img.id),
                    url: img.url || `file://${img.file_path}`,
                    label: "Image",
                    brightness: 100,
                    contrast: 100,
                  })) || []}
                  prefix={selectedReport.patient_prefix}
                  reportNumber={selectedReport.report_number}
                  selectedDoctors={selectedReport.doctor_name ? [{
                    id: selectedReport.doctor_id,
                    name: selectedReport.doctor_name,
                    qualifications: selectedReport.qualifications,
                    designation: selectedReport.designation
                  }] : undefined}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OFF-SCREEN REPORT PREVIEW FOR PDF GENERATION */}
      {downloadingReport && (
        <div style={{ position: "fixed", top: "-9999px", left: "-9999px", opacity: 0, pointerEvents: "none" }}>
          <ReportPreview
            patientName={downloadingReport.patient_name}
            patientAge={`${downloadingReport.age} Yrs / ${downloadingReport.gender}`}
            reportDate={downloadingReport.created_at}
            reportType={downloadingReport.report_type}
            sections={downloadingReport.sections || []}
            doctorName={downloadingReport.doctor_name || ""}
            images={downloadingReport.images?.map((img: any) => ({
              id: String(img.id),
              url: img.url || `file://${img.file_path}`,
              label: "Image",
              brightness: 100,
              contrast: 100,
            })) || []}
            prefix={downloadingReport.patient_prefix}
            reportNumber={downloadingReport.report_number}
            selectedDoctors={downloadingReport.doctor_name ? [{
              id: downloadingReport.doctor_id,
              name: downloadingReport.doctor_name,
              qualifications: downloadingReport.qualifications,
              designation: downloadingReport.designation
            }] : undefined}
          />
        </div>
      )}
    </div>
  );
}