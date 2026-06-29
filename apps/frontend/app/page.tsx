"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  FiEdit, FiSave, FiFileText, FiCalendar, 
  FiUsers, FiFolder, FiHardDrive, FiActivity,
  FiUserPlus, FiEdit2, FiTrash2
} from "react-icons/fi";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const THEME = {
  navy:    "#1a3a52",
  navyDark:"#0f2a3f",
  teal:    "#0d9488",
  tealLight:"#ccfbf1",
  tealBg:  "#f0fdfa",
  green:   "#2a7a2a",
  white:   "#ffffff",
  bg:      "#f0f4f8",
  border:  "#e2e8f0",
  text:    "#1e293b",
  muted:   "#64748b",
  danger:  "#dc2626",
  dangerBg:"#fef2f2",
};

type Template = { id: number; name: string; category: string };
type Doctor = {
  id: number;
  name: string;
  qualifications?: string;
  designation?: string;
  is_default?: number;
  display_order?: number;
};

export default function Dashboard() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [time, setTime]           = useState(new Date());

  const [stats, setStats] = useState({
    todayReports: 0,
    thisMonthReports: 0,
    totalPatients: 0,
    storageUsedMB: 0
  });

  // 🔥 NEW: doctors state
  const [doctors, setDoctors]       = useState<Doctor[]>([]);
  const [showDocModal, setShowDocModal] = useState(false);
  const [editDoc, setEditDoc]       = useState<Doctor | null>(null);
  const [delDocId, setDelDocId]     = useState<number | null>(null);
  const [toast, setToast]           = useState<{ msg: string; ok: boolean } | null>(null);

  // form state for doctor modal
  const [fName, setFName]   = useState("");
  const [fQual, setFQual]   = useState("");
  const [fDesig, setFDesig] = useState("");
  const [fDefault, setFDefault] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if ((window as any).api) {
      (window as any).api.getAppConfig().then((c: any) => {
        if (c.isFirstLaunch) {
          router.replace("/setup");
        } else {
          (window as any).api.getTemplates().then(setTemplates).catch(console.error);
          (window as any).api.getCategories().then(setCategories).catch(console.error);
          (window as any).api.getDashboardStats().then(setStats).catch(console.error);
          loadDoctors();
        }
      });
    }
  }, []);

  const loadDoctors = async () => {
    if (!(window as any).api) return;
    try {
      const docs = await (window as any).api.getDoctors();
      setDoctors(docs);
    } catch (err) {
      console.error("Failed to load doctors:", err);
    }
  };

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const timeStr = time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: "short", day: "numeric", month: "long", year: "numeric" };
  const dateStr = time.toLocaleDateString("en-US", dateOptions);
  
  const greeting = () => {
    const h = time.getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // Quick links dynamically built from first 4 categories
  const QUICK = categories.slice(0, 4).map(c => ({
    label: c.name + " Report",
    cat: c.name,
    icon: <FiActivity />,
    color: c.color_fg || THEME.teal
  }));

  const card: React.CSSProperties = {
    background: THEME.white,
    borderRadius: "14px",
    border: `1px solid ${THEME.border}`,
    boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
    overflow: "hidden",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .dash-quick:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.12) !important; }
        .dash-quick { transition: transform 0.18s, box-shadow 0.18s; }
        .tpl-row:hover { background: #f8fafc !important; }
        input:focus, textarea:focus { border-color: #0d9488 !important; box-shadow: 0 0 0 3px rgba(13,148,136,0.15) !important; }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: "16px", right: "16px", zIndex: 9999,
          padding: "11px 20px", borderRadius: "8px",
          background: toast.ok ? THEME.teal : THEME.danger,
          color: "white", fontFamily: "Inter, sans-serif",
          fontSize: "13px", fontWeight: "500",
          boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
        }}>
          {toast.ok ? "✓ " : "✕ "}{toast.msg}
        </div>
      )}

      <div style={{
        flex: 1,
        overflowY: "auto",
        background: THEME.bg,
        fontFamily: "'Inter', sans-serif",
        color: THEME.text,
      }}>

        {/* ── Hero banner ──────────────────────────────────────── */}
        <div style={{
          background: `linear-gradient(135deg, ${THEME.navyDark} 0%, ${THEME.navy} 55%, #1e5a6e 100%)`,
          padding: "32px 36px 28px",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", right: "-40px", top: "-40px",
            width: "220px", height: "220px", borderRadius: "50%",
            background: "rgba(13,148,136,0.18)",
          }} />
          <div style={{
            position: "absolute", right: "60px", bottom: "-60px",
            width: "160px", height: "160px", borderRadius: "50%",
            background: "rgba(13,148,136,0.10)",
          }} />

          <div style={{ position: "relative" }}>
            <h1 style={{ margin: 0, fontSize: "28px", fontWeight: "800", letterSpacing: "-0.3px" }}>
              {greeting()}, Dr. Chaudhari
            </h1>
            <p style={{ margin: "8px 0 20px", color: "rgba(255,255,255,0.7)", fontSize: "14px" }}>
              Shobha Hospital &amp; Superspeciality Gastroenterology Centre
            </p>
           <div style={{ display: "flex", gap: "16px" }}>
               <button
              onClick={() => router.push("/create-report")}
              style={{
                padding: "11px 24px",
                background: THEME.teal,
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 4px 14px rgba(13,148,136,0.4)",
              }}
            >
              <FiEdit /> New Report
            </button>

            <button
              onClick={async () => {
                try {
                  const res = await (window as any).api.createBackup();
                  if (res?.success) {
                    alert("Backup saved:\n" + res.path);
                  }
                } catch {
                  alert("Backup failed");
                }
              }}
              style={{
                padding: "11px 24px",
                background: THEME.teal,
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 4px 14px rgba(13,148,136,0.4)",
              }}>
              <FiSave /> Backup Now
            </button>
           </div>
          </div>
        </div>

        <div style={{ padding: "28px 36px", display: "flex", flexDirection: "column", gap: "24px" }}>

          {/* ── Stat cards ───────────────────────────────────── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px" }}>
            {[
              { label: "Today's Reports",  value: stats.todayReports,       icon: <FiFileText size={22} />, color: THEME.teal },
              { label: "This Month",       value: stats.thisMonthReports,   icon: <FiCalendar size={22} />, color: "#2563eb" },
              { label: "Total Patients",   value: stats.totalPatients,      icon: <FiUsers size={22} />, color: "#ea580c" },
              { label: "Total Templates",  value: templates.length,         icon: <FiFolder size={22} />, color: "#7c3aed" },
              { label: "Storage Used",     value: `${stats.storageUsedMB} MB`, icon: <FiHardDrive size={22} />, color: THEME.muted },
            ].map((s) => (
              <div key={s.label} style={{
                ...card,
                padding: "20px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}>
                <div style={{
                  width: "48px", height: "48px", borderRadius: "12px",
                  background: s.color + "18",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "22px", flexShrink: 0,
                }}>
                  {s.icon}
                </div>
                <div>
                  <div style={{ fontSize: "24px", fontWeight: "800", color: s.color, lineHeight: 1 }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: "12px", color: THEME.muted, marginTop: "6px", fontWeight: "600" }}>
                    {s.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Quick start + template list ───────────────────── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "20px" }}>

            {/* Quick actions */}
            <div style={{ ...card, padding: "22px" }}>
              <h3 style={{ margin: "0 0 16px", fontSize: "15px", fontWeight: "700", color: THEME.navy, display: "flex", alignItems: "center" }}>
                <FiActivity style={{ marginRight: "8px" }} /> Quick Start
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {QUICK.map((q) => (
                  <button
                    key={q.cat}
                    className="dash-quick"
                    onClick={() => router.push(`/create-report?type=${q.cat}`)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "13px 16px",
                      background: "white",
                      border: `1.5px solid ${THEME.border}`,
                      borderRadius: "10px",
                      cursor: "pointer",
                      textAlign: "left",
                      width: "100%",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    }}
                  >
                    <span style={{
                      width: "36px", height: "36px", borderRadius: "8px",
                      background: q.color + "18",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "18px", flexShrink: 0,
                    }}>
                      {q.icon}
                    </span>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: "600", color: THEME.text }}>
                        {q.label}
                      </div>
                      <div style={{ fontSize: "11px", color: THEME.muted }}>
                        Create new report
                      </div>
                    </div>
                    <span style={{ marginLeft: "auto", color: THEME.muted, fontSize: "16px" }}>›</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Template list */}
            <div style={{ ...card, padding: "22px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "700", color: THEME.navy, display: "flex", alignItems: "center" }}>
                  <FiFolder style={{ marginRight: "8px" }} /> Templates
                </h3>
                <button
                  onClick={() => router.push("/templates")}
                  style={{
                    fontSize: "12px", color: THEME.teal, background: "none",
                    border: "none", cursor: "pointer", fontWeight: "600", fontFamily: "inherit",
                  }}
                >
                  Manage all →
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {templates.slice(0, 8).map((t, i) => (
                  <div
                    key={t.id}
                    className="tpl-row"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      borderBottom: i < templates.slice(0, 8).length - 1 ? `1px solid ${THEME.border}` : "none",
                    }}
                    onClick={() => router.push("/templates")}
                  >
                    <div style={{ fontSize: "13px", fontWeight: "500", color: THEME.text }}>
                      {t.name}
                    </div>
                    <span style={{
                      fontSize: "11px", fontWeight: "600", padding: "2px 8px",
                      borderRadius: "20px",
                      background: t.category === "UGI" ? "#ccfbf1" : t.category === "VLS" ? "#ede9fe" : "#fef3c7",
                      color:      t.category === "UGI" ? "#0d9488"  : t.category === "VLS" ? "#7c3aed"  : "#b45309",
                    }}>
                      {t.category}
                    </span>
                  </div>
                ))}
                {templates.length === 0 && (
                  <div style={{ textAlign: "center", padding: "32px", color: THEME.muted, fontSize: "13px" }}>
                    No templates yet. <span
                      style={{ color: THEME.teal, cursor: "pointer", fontWeight: "600" }}
                      onClick={() => router.push("/templates")}
                    >Add one →</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Info strip ───────────────────────────────────── */}
          <div style={{
            ...card,
            padding: "18px 24px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            background: `linear-gradient(90deg, ${THEME.tealLight}, #f0fdf4)`,
            border: `1px solid #99f6e4`,
          }}>
            <span style={{ fontSize: "24px" }}>💡</span>
            <div>
              <div style={{ fontSize: "13px", fontWeight: "600", color: THEME.navy }}>
                Tip: Use templates to speed up report generation
              </div>
              <div style={{ fontSize: "12px", color: THEME.muted, marginTop: "2px" }}>
                Load a template in the New Report screen, then customise clinical findings before printing or exporting.
              </div>
            </div>
            <button
              onClick={() => router.push("/create-report")}
              style={{
                marginLeft: "auto", flexShrink: 0,
                padding: "9px 18px",
                background: THEME.teal, color: "white",
                border: "none", borderRadius: "7px",
                fontSize: "13px", fontWeight: "600",
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              Try now
            </button>
          </div>
        </div>
      </div>
    </>
  );
}