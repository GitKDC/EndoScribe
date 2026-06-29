"use client";
import React, { useEffect, useState } from "react";
import ReportPreview from "../../components/ReportPreview";
import { IoMdEye, IoIosArrowDown } from "react-icons/io";
import { SlCalender } from "react-icons/sl";
import { FiSearch } from "react-icons/fi";
import { MdPrint, MdPictureAsPdf, MdDownload } from "react-icons/md";
import { generatePDF } from "../../utils/reportGenerator";
import { buildEndoUrl } from "../../utils/buildEndoUrl";
import { Card } from "../../components/ui/Card";
import { Table, TableRow, TableCell } from "../../components/ui/Table";
import { Button } from "../../components/ui/Button";

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
  const [generatingId, setGeneratingId] = useState<number | null>(null);

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

  const handleExportCSV = async () => {
    if (!(window as any).api) return;
    try {
      const result = await (window as any).api.exportReportsCSV({
        search,
        startDate,
        endDate,
        procedure,
        doctorId
      });
      if (result.success) {
        alert("Reports exported successfully to " + result.filePath);
      } else if (result.message !== "Canceled") {
        alert("Export failed: " + result.message);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to export reports");
    }
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
    setGeneratingId(id);
    const data = await (window as any).api.getReport(id);
    setDownloadingReport(data);
  };

  useEffect(() => {
    if (downloadingReport && generatingId !== null) {
      // Need a short delay to allow React to mount the off-screen ReportPreview and images to load
      setTimeout(async () => {
        try {
          const result = await generatePDF(
            downloadingReport.created_at,
            downloadingReport.patient_name,
            `${downloadingReport.age} Yrs / ${downloadingReport.gender}`,
            downloadingReport.report_type,
            downloadingReport.report_number,
            true // downloadToDownloads flag
          );
          if (result && result.absolutePath) {
            // We can optionally show an alert, or since it downloads to browser default, we can omit it.
          }
        } catch (err) {
          console.error("PDF generation failed", err);
          alert("Failed to generate PDF");
        } finally {
          setGeneratingId(null);
          setDownloadingReport(null);
        }
      }, 500); // 500ms delay for DOM to settle
    }
  }, [downloadingReport, generatingId]);

  // 🔥 FIX: previously `img.url || endo://${img.file_path}` concatenated the
  // raw absolute path directly into a URL string. Any space or special
  // character in the path (e.g. macOS "Application Support") broke the
  // browser's URL parsing silently and the image just never loaded.
  // buildEndoUrl() percent-encodes the path first so it round-trips
  // correctly through the endo:// protocol handler in main.js.
  const mapImagesForPreview = (images: any[]) =>
    (images || []).map((img: any) => ({
      id: String(img.id),
      url: img.url || buildEndoUrl(img.file_path),
      label: "Image",
      nbiLabel: img.nbi_label || undefined,
      brightness: img.brightness ?? 70,
      contrast: img.contrast ?? 70,
    }));

  return (
    <div style={{ padding: "32px", fontFamily: "'Inter', sans-serif", backgroundColor: "#f4f7f6", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2 style={{ color: "#1a3a52", fontSize: "28px", fontWeight: "800", margin: 0 }}>Patient Reports</h2>
        <Button 
          variant="secondary"
          icon={<MdDownload size={18} />}
          onClick={handleExportCSV}
        >
          Export CSV
        </Button>
      </div>

      {/* FILTERS */}
      <div style={{
        display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap",
        background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
      }}>
        <div style={{ position: "relative", flex: 1, minWidth: "220px" }}>
          <FiSearch style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} size={18} />
          <input 
            placeholder="Search patient..." 
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{ width: "100%", padding: "10px 14px 10px 40px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
          />
        </div>
        
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
      <Card style={{ overflowX: "auto" }}>
        <Table headers={["Report No", "Patient", "Procedure", "Doctor", "Date", "Actions"]}>
            {loading ? (
              <TableRow><TableCell colSpan={6} style={{ padding: "40px", textAlign: "center", color: "#666", fontSize: "15px" }}>Loading reports...</TableCell></TableRow>
            ) : reports.length === 0 ? (
              <TableRow><TableCell colSpan={6} style={{ padding: "40px", textAlign: "center", color: "#666", fontSize: "15px" }}>No reports found matching your criteria.</TableCell></TableRow>
            ) : (
              reports.map((r) => (
                <TableRow key={r.id}>
                  <TableCell style={{ fontWeight: "600", color: "#333" }}>{r.report_number || "-"}</TableCell>
                  <TableCell style={{ fontWeight: "500", color: "#111" }}>{r.patient_prefix} {r.patient_name}</TableCell>
                  <TableCell style={{ color: "#007bff", fontWeight: "600" }}>{r.report_type}</TableCell>
                  <TableCell>{r.doctor_name || "-"}</TableCell>
                  <TableCell style={{ fontWeight: "500" }}>
                    {new Date(r.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </TableCell>
                  <TableCell>
                    <div style={{ display: "flex", gap: "8px", marginLeft: "-8px" }}>
                      <Button variant="icon" size="sm" icon={<IoMdEye size={18} />} onClick={() => handleView(r.id)} />
                      <Button 
                        variant="icon" 
                        size="sm" 
                        icon={<MdDownload size={18} />} 
                        onClick={() => handleDownloadPDF(r.id)} 
                        disabled={generatingId === r.id} 
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
        </Table>
      </Card>

      {/* PAGINATION */}
      {reports.length > 0 && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "24px", padding: "0 8px" }}>
          <span style={{ fontSize: "14px", color: "#666", fontWeight: "500" }}>
            Showing <strong style={{ color: "#111" }}>{(page - 1) * 10 + 1}</strong> to <strong style={{ color: "#111" }}>{Math.min(page * 10, totalItems)}</strong> of <strong style={{ color: "#111" }}>{totalItems}</strong> entries
          </span>
          <div style={{ display: "flex", gap: "8px" }}>
            <Button 
              variant="secondary"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button 
              variant="secondary"
              size="sm"
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </Button>
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
                  images={mapImagesForPreview(selectedReport.images)}
                  prefix={selectedReport.patient_prefix}
                  reportNumber={selectedReport.report_number}
                  selectedDoctors={selectedReport.selected_doctors}
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
            images={mapImagesForPreview(downloadingReport.images)}
            prefix={downloadingReport.patient_prefix}
            reportNumber={downloadingReport.report_number}
            selectedDoctors={downloadingReport.selected_doctors}
          />
        </div>
      )}
    </div>
  );
}