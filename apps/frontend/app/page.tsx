"use client";

import { useEffect, useState, useCallback } from "react";
import ReportForm from "@/components/ReportForm";
import ImageUploader from "@/components/ImageUploader";
import ReportPreview from "@/components/ReportPreview";
import { generatePDF, printReport, exportAsImage } from "@/utils/reportGenerator";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
type Template = {
  id: number;
  name: string;
  category: string;
  esophagus: string;
  stomach: string;
  duodenum: string;
  impression: string;
};

type ImageData = {
  id: string;
  url: string;
  label: string;
};

type ActionState = "idle" | "loading" | "success" | "error";
type ToastMessage = { id: number; text: string; type: "success" | "error" };

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const getCurrentDateForInput = (): string => {
  const today = new Date();
  return [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");
};

// ─────────────────────────────────────────────────────────────────────────────
// FALLBACK TEMPLATES (when Electron API is unavailable)
// ─────────────────────────────────────────────────────────────────────────────
const FALLBACK_TEMPLATES: Template[] = [
  {
    id: 1,
    name: "Normal Study",
    category: "normal",
    esophagus: "Normal",
    stomach: "Normal",
    duodenum: "Normal",
    impression: "Normal study",
  },
  {
    id: 2,
    name: "Varices Grade I",
    category: "varices",
    esophagus: "Small columns of varices with Red wale sign",
    stomach: "Erythematous mucosa",
    duodenum: "Normal",
    impression: "Grade I varices",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// HOME
// ─────────────────────────────────────────────────────────────────────────────
export default function Home() {
  // ── Template loading ────────────────────────────────────────────────────────
  const [templates, setTemplates]   = useState<Template[]>([]);
  const [loading, setLoading]       = useState(true);
  const [loadError, setLoadError]   = useState<string | null>(null);

  // ── Report fields ───────────────────────────────────────────────────────────
  const [patientName, setPatientName] = useState("");
  const [patientAge,  setPatientAge]  = useState("");
  const [reportDate,  setReportDate]  = useState(getCurrentDateForInput());
  const [reportType,  setReportType]  = useState("UPPER GI ENDOSCOPY");
  const [esophagus,   setEsophagus]   = useState("");
  const [stomach,     setStomach]     = useState("");
  const [duodenum,    setDuodenum]    = useState("");
  const [impression,  setImpression]  = useState("");
  const [doctorName,  setDoctorName]  = useState("Dr Your Name");
  const [images,      setImages]      = useState<ImageData[]>([]);

  // ── UI state ─────────────────────────────────────────────────────────────────
  const [printState,  setPrintState]  = useState<ActionState>("idle");
  const [pdfState,    setPdfState]    = useState<ActionState>("idle");
  const [imgState,    setImgState]    = useState<ActionState>("idle");
  const [toasts,      setToasts]      = useState<ToastMessage[]>([]);
  const [mounted,     setMounted]     = useState(false);

  // Mount animation
  useEffect(() => { setMounted(true); }, []);

  // ── Toast system ─────────────────────────────────────────────────────────────
  const addToast = useCallback((text: string, type: "success" | "error") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  // ── Load templates ───────────────────────────────────────────────────────────
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setLoading(true);
        setLoadError(null);
        if (!(window as any).api) {
          setTemplates(FALLBACK_TEMPLATES);
          return;
        }
        const data = await (window as any).api.getTemplates();
        if (!data || data.length === 0) throw new Error("No templates found");
        setTemplates(data);
      } catch (err) {
        setLoadError(err instanceof Error ? err.message : "Failed to load templates");
        setTemplates(FALLBACK_TEMPLATES); // always fall back so UI isn't blocked
      } finally {
        setLoading(false);
      }
    };
    loadTemplates();
  }, []);

  // ── Template selection ───────────────────────────────────────────────────────
  const handleTemplateSelect = async (id: number) => {
    try {
      let template: Template | undefined;
      if (!(window as any).api) {
        template = templates.find((t) => t.id === id);
      } else {
        template = await (window as any).api.getTemplate(id);
      }
      if (template) {
        setEsophagus(template.esophagus || "");
        setStomach(template.stomach     || "");
        setDuodenum(template.duodenum   || "");
        setImpression(template.impression || "");
      }
    } catch (err) {
      console.error("Template load error:", err);
    }
  };

  // ── Image handlers ───────────────────────────────────────────────────────────
  const handleImagesAdded      = (newImgs: ImageData[]) => setImages((p) => [...p, ...newImgs]);
  const handleImageRemoved     = (id: string) => setImages((p) => p.filter((i) => i.id !== id));
  const handleImageLabelChanged = (id: string, label: string) =>
    setImages((p) => p.map((i) => (i.id === id ? { ...i, label } : i)));

  // ── Reset ────────────────────────────────────────────────────────────────────
  const handleReset = () => {
    setPatientName("");
    setPatientAge("");
    setReportDate(getCurrentDateForInput());
    setReportType("UPPER GI ENDOSCOPY");
    setEsophagus("");
    setStomach("");
    setDuodenum("");
    setImpression("");
    setImages([]);
    addToast("Form cleared", "success");
  };

  // ── Action button wrapper ─────────────────────────────────────────────────────
  const runAction = async (
    setState: (s: ActionState) => void,
    fn: () => Promise<void>,
    successMsg: string,
    errorMsg: string
  ) => {
    setState("loading");
    try {
      await fn();
      setState("success");
      addToast(successMsg, "success");
    } catch (err) {
      setState("error");
      addToast(
        `${errorMsg}: ${err instanceof Error ? err.message : String(err)}`,
        "error"
      );
      console.error(err);
    } finally {
      setTimeout(() => setState("idle"), 2000);
    }
  };

  const handlePrint       = () => runAction(setPrintState, printReport,                    "Sent to printer ✓",     "Print failed");
  const handleDownloadPDF = () => runAction(setPdfState,   () => generatePDF(reportDate),  "PDF downloaded ✓",      "PDF failed");
  const handleExportImage = () => runAction(setImgState,   () => exportAsImage(reportDate),"Image exported ✓",      "Export failed");

  // ─────────────────────────────────────────────────────────────────────────────
  // STYLES
  // ─────────────────────────────────────────────────────────────────────────────
  const btnBase: React.CSSProperties = {
    padding: "13px",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    transition: "transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    letterSpacing: "0.3px",
  };

  const btnHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
    (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 18px rgba(0,0,0,0.2)";
  };
  const btnLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
    (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 2px 6px rgba(0,0,0,0.15)";
  };

  const getLabel = (state: ActionState, idle: string, loading: string, success: string) => {
    if (state === "loading") return <><Spinner />{loading}</>;
    if (state === "success") return <>{"\u2713"} {success}</>;
    return <>{idle}</>;
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // LOADING SCREEN
  // ─────────────────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        minHeight: "100vh", backgroundColor: "#eef2f5", flexDirection: "column", gap: "16px"
      }}>
        <div style={{
          width: "44px", height: "44px", border: "4px solid #dee2e6",
          borderTop: "4px solid #1a3a52", borderRadius: "50%",
          animation: "spin 0.8s linear infinite"
        }} />
        <h2 style={{ color: "#1a3a52", fontWeight: 600, margin: 0 }}>Loading templates…</h2>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // MAIN RENDER
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Global animations ─────────────────────────────────────────────── */}
      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeIn  { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-18px); } to { opacity: 1; transform: none; } }
        @keyframes toastIn { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: none; } }
        @keyframes toastOut { to { opacity: 0; transform: translateX(40px); } }
        input:focus, textarea:focus, select:focus {
          outline: none !important;
          border-color: #0d6efd !important;
          box-shadow: 0 0 0 3px rgba(13,110,253,0.18) !important;
        }
      `}</style>

      {/* ── Toast stack ───────────────────────────────────────────────────── */}
      <div style={{ position: "fixed", top: "16px", right: "16px", zIndex: 9999, display: "flex", flexDirection: "column", gap: "8px" }}>
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              padding: "10px 18px",
              borderRadius: "8px",
              backgroundColor: t.type === "success" ? "#198754" : "#dc3545",
              color: "white",
              fontSize: "14px",
              fontWeight: 500,
              boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
              animation: "toastIn 0.3s ease",
              minWidth: "220px",
              maxWidth: "320px",
            }}
          >
            {t.type === "success" ? "✓ " : "✕ "}{t.text}
          </div>
        ))}
      </div>

      <div style={{ backgroundColor: "#eef2f5", height: "100vh", overflow: "hidden", animation: mounted ? "fadeIn 0.4s ease" : "none" }}>
        <div style={{ display: "flex", height: "100%" }}>

          {/* ── LEFT PANEL ─────────────────────────────────────────────────── */}
          <div
            style={{
              width: "35%",
              minWidth: "400px",
              padding: "24px",
              backgroundColor: "#f8f9fa",
              overflowY: "auto",
              borderRight: "1px solid #dee2e6",
              boxShadow: "4px 0 14px rgba(0,0,0,0.06)",
              zIndex: 10,
              animation: mounted ? "slideIn 0.35s ease" : "none",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "22px" }}>
              <span style={{ fontSize: "24px" }}>📝</span>
              <h2 style={{ color: "#1a3a52", margin: 0, fontSize: "20px", fontWeight: "700" }}>
                Report Generator
              </h2>
            </div>

            {/* Error banner (dismissible) */}
            {loadError && (
              <div style={{
                padding: "10px 14px", backgroundColor: "#fff3cd", color: "#856404",
                borderRadius: "8px", marginBottom: "16px", border: "1px solid #ffc107",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                fontSize: "13px", animation: "fadeIn 0.3s ease",
              }}>
                <span>⚠️ {loadError} — using default templates.</span>
                <button
                  onClick={() => setLoadError(null)}
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "#856404", padding: "0 4px" }}
                >
                  ×
                </button>
              </div>
            )}

            {/* Form */}
            <ReportForm
              patientName={patientName}
              patientAge={patientAge}
              reportDate={reportDate}
              reportType={reportType}
              esophagus={esophagus}
              stomach={stomach}
              duodenum={duodenum}
              impression={impression}
              doctorName={doctorName}
              templates={templates}
              onPatientNameChange={setPatientName}
              onPatientAgeChange={setPatientAge}
              onReportDateChange={setReportDate}
              onReportTypeChange={setReportType}
              onEsophagusChange={setEsophagus}
              onStomachChange={setStomach}
              onDuodenumChange={setDuodenum}
              onImpressionChange={setImpression}
              onDoctorNameChange={setDoctorName}
              onTemplateSelect={handleTemplateSelect}
            />

            {/* Image uploader */}
            <div style={{ marginTop: "18px" }}>
              <ImageUploader
                images={images}
                onImagesAdded={handleImagesAdded}
                onImageRemoved={handleImageRemoved}
                onImageLabelChanged={handleImageLabelChanged}
                maxImages={12}
              />
            </div>

            {/* ── Action buttons ─────────────────────────────────────────── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "28px" }}>
              <button
                onClick={handlePrint}
                disabled={printState === "loading"}
                onMouseEnter={btnHover} onMouseLeave={btnLeave}
                style={{ ...btnBase, backgroundColor: printState === "success" ? "#157347" : "#0d6efd", opacity: printState === "loading" ? 0.75 : 1 }}
              >
                {getLabel(printState, "🖨️ Print", "Printing…", "Printed")}
              </button>

              <button
                onClick={handleDownloadPDF}
                disabled={pdfState === "loading"}
                onMouseEnter={btnHover} onMouseLeave={btnLeave}
                style={{ ...btnBase, backgroundColor: pdfState === "success" ? "#157347" : "#198754", opacity: pdfState === "loading" ? 0.75 : 1 }}
              >
                {getLabel(pdfState, "📥 PDF", "Generating…", "Saved")}
              </button>

              <button
                onClick={handleExportImage}
                disabled={imgState === "loading"}
                onMouseEnter={btnHover} onMouseLeave={btnLeave}
                style={{ ...btnBase, backgroundColor: "#0dcaf0", color: "#000", opacity: imgState === "loading" ? 0.75 : 1 }}
              >
                {getLabel(imgState, "🖼️ Image", "Exporting…", "Exported")}
              </button>

              <button
                onClick={handleReset}
                onMouseEnter={btnHover} onMouseLeave={btnLeave}
                style={{ ...btnBase, backgroundColor: "#6c757d" }}
              >
                🔄 Reset
              </button>
            </div>
          </div>

          {/* ── RIGHT PANEL – A4 preview ──────────────────────────────────── */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              backgroundColor: "#dbe0e5",
              padding: "40px",
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                width: "210mm",
                minHeight: "297mm",
                backgroundColor: "white",
                boxShadow: "0 12px 36px rgba(0,0,0,0.18)",
                borderRadius: "2px",
                margin: "0 auto",
                transition: "box-shadow 0.2s ease",
              }}
            >
              <ReportPreview
                patientName={patientName}
                patientAge={patientAge}
                reportDate={reportDate}
                reportType={reportType}
                esophagus={esophagus}
                stomach={stomach}
                duodenum={duodenum}
                impression={impression}
                doctorName={doctorName}
                images={images}
              />
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// INLINE SPINNER COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const Spinner = () => (
  <span
    style={{
      display: "inline-block",
      width: "14px",
      height: "14px",
      border: "2px solid rgba(255,255,255,0.35)",
      borderTop: "2px solid white",
      borderRadius: "50%",
      animation: "spin 0.7s linear infinite",
      flexShrink: 0,
    }}
  />
);