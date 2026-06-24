"use client";
import { useEffect, useState } from "react";

const THEME = {
  navy:    "#1a3a52",
  teal:    "#0d9488",
  tealBg:  "#ccfbf1",
  border:  "#e2e8f0",
  bg:      "#f4f7f6",
  white:   "#ffffff",
  text:    "#1e293b",
  muted:   "#64748b",
  danger:  "#dc2626",
  dangerBg:"#fef2f2",
};

type Section = { title: string; content: string; highlight?: boolean; isHeading?: boolean };
type Template = { id: number; name: string; category: string; sections: Section[] };

const CATEGORIES = ["UGI", "VLS", "SIGMOIDOSCOPY", "COLONOSCOPY", "ERCP", "ENTEROSCOPY"];

const catColor = (cat: string) => {
  const m: Record<string, { bg: string; fg: string }> = {
    UGI:          { bg: "#ccfbf1", fg: "#0d9488" },
    VLS:          { bg: "#ede9fe", fg: "#7c3aed" },
    SIGMOIDOSCOPY:{ bg: "#fef3c7", fg: "#b45309" },
    COLONOSCOPY:  { bg: "#dbeafe", fg: "#2563eb" },
    ERCP:         { bg: "#fee2e2", fg: "#dc2626" },
    ENTEROSCOPY:  { bg: "#fce7f3", fg: "#be185d" },
  };
  return m[cat] || { bg: "#f1f5f9", fg: "#475569" };
};

export default function TemplatePage() {
  const [templates, setTemplates]   = useState<Template[]>([]);
  const [search, setSearch]         = useState("");
  const [filterCat, setFilterCat]   = useState("ALL");
  const [showModal, setShowModal]   = useState(false);
  const [editTarget, setEditTarget] = useState<Template | null>(null);
  const [delConfirm, setDelConfirm] = useState<number | null>(null);
  const [toast, setToast]           = useState<{ msg: string; ok: boolean } | null>(null);

  // ── form state ────────────────────────────────────────────
  const [fName, setFName]       = useState("");
  const [fCat, setFCat]         = useState("UGI");
  const [fSections, setFSections] = useState<Section[]>([
    { title: "Esophagus",  content: "" },
    { title: "Stomach",    content: "" },
    { title: "Duodenal Cap", content: "" },
    { title: "IInd Part of Duodenum", content: "" },
    { title: "Impression", content: "", highlight: true },
  ]);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const load = async () => {
    if (!(window as any).api) return;
    const data = await (window as any).api.getTemplates();
    setTemplates(data);
  };

  useEffect(() => { load(); }, []);

  // ── Open modal ────────────────────────────────────────────
  const openCreate = () => {
    setEditTarget(null);
    setFName(""); setFCat("UGI");
    setFSections([
      { title: "Esophagus",  content: "" },
      { title: "Stomach",    content: "" },
      { title: "Duodenal Cap", content: "" },
      { title: "IInd Part of Duodenum", content: "" },
      { title: "Impression", content: "", highlight: true },
    ]);
    setShowModal(true);
  };

  const openEdit = (t: Template) => {
    setEditTarget(t);
    setFName(t.name); setFCat(t.category);
    setFSections(t.sections.map(s => ({ ...s })));
    setShowModal(true);
  };

  // ── Section helpers ───────────────────────────────────────
  const updateSectionTitle   = (i: number, v: string) => setFSections(p => p.map((s, idx) => idx === i ? { ...s, title: v } : s));
  const updateSectionContent = (i: number, v: string) => setFSections(p => p.map((s, idx) => idx === i ? { ...s, content: v } : s));
  const toggleHighlight      = (i: number)            => setFSections(p => p.map((s, idx) => idx === i ? { ...s, highlight: !s.highlight } : s));
  const removeSection        = (i: number)            => setFSections(p => p.filter((_, idx) => idx !== i));
  const addSection           = ()                     => setFSections(p => [...p, { title: "", content: "" }]);
  const moveSection          = (i: number, dir: -1 | 1) => {
    const copy = [...fSections];
    const to = i + dir;
    if (to < 0 || to >= copy.length) return;
    [copy[i], copy[to]] = [copy[to], copy[i]];
    setFSections(copy);
  };

  // ── Save ──────────────────────────────────────────────────
  const save = async () => {
    if (!fName.trim()) return showToast("Template name is required", false);
    const payload = { name: fName.trim(), category: fCat, sections: fSections };
    try {
      if (editTarget) {
        await (window as any).api.updateTemplate(editTarget.id, payload);
        showToast("Template updated ✓");
      } else {
        await (window as any).api.createTemplate(payload);
        showToast("Template created ✓");
      }
      setShowModal(false);
      load();
    } catch (err) {
      showToast("Save failed", false);
    }
  };

  const confirmDelete = async (id: number) => {
    try {
      await (window as any).api.deleteTemplate(id);
      setDelConfirm(null);
      showToast("Template deleted");
      load();
    } catch { showToast("Delete failed", false); }
  };

  const filtered = templates.filter(t =>
    (filterCat === "ALL" || t.category === filterCat) &&
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const inp: React.CSSProperties = {
    padding: "9px 12px", border: `1.5px solid ${THEME.border}`,
    borderRadius: "7px", fontSize: "13px", fontFamily: "inherit",
    outline: "none", width: "100%", boxSizing: "border-box", background: THEME.white,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .tpl-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.10) !important; transform: translateY(-1px); }
        .tpl-card { transition: box-shadow 0.18s, transform 0.18s; }
        input:focus, textarea:focus, select:focus { border-color: #0d9488 !important; box-shadow: 0 0 0 3px rgba(13,148,136,0.15) !important; }
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

      <div style={{ flex: 1, overflowY: "auto", background: THEME.bg, fontFamily: "'Inter', sans-serif", color: THEME.text }}>

        {/* ── Header ──────────────────────────────────────────── */}
        <div style={{
          padding: "32px 32px 10px 32px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <h2 style={{ color: "#1a3a52", fontSize: "28px", fontWeight: "800", margin: 0 }}>Template Manager</h2>
            <p style={{ margin: "4px 0 0", fontSize: "14px", color: THEME.muted, fontWeight: "500" }}>
              {templates.length} templates across {CATEGORIES.length} procedure types
            </p>
          </div>
          <button onClick={openCreate} style={{
            padding: "10px 22px", background: THEME.teal, color: "white",
            border: "none", borderRadius: "8px", fontSize: "14px",
            fontWeight: "600", cursor: "pointer", fontFamily: "inherit",
            boxShadow: "0 4px 12px rgba(13,148,136,0.35)",
            transition: "transform 0.1s"
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          >
            + New Template
          </button>
        </div>

        <div style={{ padding: "10px 32px 24px 32px", display: "flex", flexDirection: "column", gap: "24px" }}>

          {/* ── Filters ─────────────────────────────────────── */}
          <div style={{ 
            display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap",
            background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
          }}>
            <input
              placeholder="🔍 Search templates…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ ...inp, width: "240px" }}
            />
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {["ALL", ...CATEGORIES].map(c => {
                const active = filterCat === c;
                const cc = catColor(c);
                return (
                  <button key={c} onClick={() => setFilterCat(c)} style={{
                    padding: "6px 14px", borderRadius: "20px", fontSize: "12px",
                    fontWeight: "600", cursor: "pointer", fontFamily: "inherit",
                    border: active ? "none" : `1.5px solid ${THEME.border}`,
                    background: active ? (c === "ALL" ? THEME.navy : cc.bg) : THEME.white,
                    color:      active ? (c === "ALL" ? "white"   : cc.fg) : THEME.muted,
                  }}>
                    {c}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Grid ─────────────────────────────────────────── */}
          {filtered.length === 0 ? (
            <div style={{
              textAlign: "center", padding: "60px", color: THEME.muted,
              background: THEME.white, borderRadius: "14px", border: `1px solid ${THEME.border}`,
            }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>🗂️</div>
              <div style={{ fontSize: "15px", fontWeight: "600", marginBottom: "6px" }}>No templates found</div>
              <div style={{ fontSize: "13px" }}>Try changing the filter or creating a new template.</div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
              {filtered.map(t => {
                const cc = catColor(t.category);
                return (
                  <div key={t.id} className="tpl-card" style={{
                    background: THEME.white, borderRadius: "12px",
                    border: `1px solid ${THEME.border}`,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                    padding: "18px 20px",
                  }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "12px" }}>
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: "700", color: THEME.text, marginBottom: "6px" }}>
                          {t.name}
                        </div>
                        <span style={{
                          fontSize: "11px", fontWeight: "600", padding: "3px 9px",
                          borderRadius: "20px", background: cc.bg, color: cc.fg,
                        }}>
                          {t.category}
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button onClick={() => openEdit(t)} style={{
                          padding: "5px 11px", border: `1px solid ${THEME.border}`,
                          borderRadius: "6px", background: "white", cursor: "pointer",
                          fontSize: "12px", fontWeight: "600", color: THEME.navy, fontFamily: "inherit",
                        }}>Edit</button>
                        <button onClick={() => setDelConfirm(t.id)} style={{
                          padding: "5px 11px", border: `1px solid #fecaca`,
                          borderRadius: "6px", background: THEME.dangerBg, cursor: "pointer",
                          fontSize: "12px", fontWeight: "600", color: THEME.danger, fontFamily: "inherit",
                        }}>Delete</button>
                      </div>
                    </div>

                    <div style={{ fontSize: "12px", color: THEME.muted }}>
                      {t.sections.length} section{t.sections.length !== 1 ? "s" : ""}:&nbsp;
                      {t.sections.filter(s => !s.isHeading).slice(0, 3).map(s => s.title).join(", ")}
                      {t.sections.length > 3 ? "…" : ""}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Delete confirm ─────────────────────────────────── */}
      {delConfirm !== null && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
          zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            background: THEME.white, borderRadius: "14px", padding: "28px 32px",
            fontFamily: "Inter, sans-serif", maxWidth: "380px", width: "90%",
            boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          }}>
            <div style={{ fontSize: "32px", textAlign: "center", marginBottom: "12px" }}>🗑️</div>
            <h3 style={{ margin: "0 0 8px", textAlign: "center", color: THEME.text }}>Delete Template?</h3>
            <p style={{ margin: "0 0 20px", textAlign: "center", color: THEME.muted, fontSize: "13px" }}>
              This cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setDelConfirm(null)} style={{
                flex: 1, padding: "10px", border: `1.5px solid ${THEME.border}`,
                borderRadius: "8px", cursor: "pointer", fontFamily: "inherit",
                fontSize: "14px", fontWeight: "600", background: "white", color: THEME.text,
              }}>Cancel</button>
              <button onClick={() => confirmDelete(delConfirm)} style={{
                flex: 1, padding: "10px", border: "none",
                borderRadius: "8px", cursor: "pointer", fontFamily: "inherit",
                fontSize: "14px", fontWeight: "600", background: THEME.danger, color: "white",
              }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Create / Edit Modal ────────────────────────────── */}
      {showModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
          zIndex: 1000, display: "flex", alignItems: "flex-start",
          justifyContent: "center", overflowY: "auto", padding: "24px",
        }}>
          <div style={{
            background: THEME.white, borderRadius: "16px",
            width: "100%", maxWidth: "680px",
            boxShadow: "0 24px 64px rgba(0,0,0,0.3)",
            fontFamily: "Inter, sans-serif",
            marginTop: "auto", marginBottom: "auto",
          }}>
            {/* Modal header */}
            <div style={{
              background: THEME.white,
              color: THEME.navy, padding: "20px 24px",
              borderRadius: "16px 16px 0 0", borderBottom: `1px solid ${THEME.border}`,
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <h2 style={{ margin: 0, fontSize: "17px", fontWeight: "700" }}>
                {editTarget ? "✏️ Edit Template" : "➕ New Template"}
              </h2>
              <button onClick={() => setShowModal(false)} style={{
                background: "transparent", border: "none",
                color: THEME.muted, width: "30px", height: "30px",
                borderRadius: "50%", cursor: "pointer", fontSize: "22px",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>×</button>
            </div>

            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "18px" }}>

              {/* Name + Category */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: THEME.muted, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Template Name *
                  </label>
                  <input
                    value={fName}
                    onChange={e => setFName(e.target.value)}
                    placeholder="e.g. Barrett's Esophagus"
                    style={inp}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: THEME.muted, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Category
                  </label>
                  <select value={fCat} onChange={e => setFCat(e.target.value)} style={{ ...inp, width: "160px" }}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Sections */}
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: THEME.muted, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Sections
                  </label>
                  <button onClick={addSection} style={{
                    fontSize: "12px", color: THEME.teal, background: THEME.tealBg,
                    border: "none", borderRadius: "6px", cursor: "pointer",
                    padding: "4px 12px", fontWeight: "600", fontFamily: "inherit",
                  }}>+ Add Section</button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "400px", overflowY: "auto", paddingRight: "4px" }}>
                  {fSections.map((s, i) => (
                    <div key={i} style={{
                      border: `1.5px solid ${s.highlight ? "#fca5a5" : THEME.border}`,
                      borderRadius: "10px",
                      padding: "12px",
                      background: s.highlight ? "#fff7f7" : "#fafafa",
                    }}>
                      <div style={{ display: "flex", gap: "8px", marginBottom: "8px", alignItems: "center" }}>
                        {/* move buttons */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                          <button onClick={() => moveSection(i, -1)} disabled={i === 0}
                            style={{ padding: "1px 5px", fontSize: "10px", cursor: "pointer", border: `1px solid ${THEME.border}`, borderRadius: "3px", background: "white", color: THEME.muted, opacity: i === 0 ? 0.3 : 1 }}>▲</button>
                          <button onClick={() => moveSection(i, 1)} disabled={i === fSections.length - 1}
                            style={{ padding: "1px 5px", fontSize: "10px", cursor: "pointer", border: `1px solid ${THEME.border}`, borderRadius: "3px", background: "white", color: THEME.muted, opacity: i === fSections.length - 1 ? 0.3 : 1 }}>▼</button>
                        </div>
                        <input
                          value={s.title}
                          onChange={e => updateSectionTitle(i, e.target.value)}
                          placeholder="Field name"
                          style={{ ...inp, flex: 1, fontWeight: "600" }}
                        />
                        <button
                          onClick={() => toggleHighlight(i)}
                          title="Toggle important / Impression"
                          style={{
                            padding: "5px 10px", border: `1.5px solid ${s.highlight ? "#fca5a5" : THEME.border}`,
                            borderRadius: "6px", cursor: "pointer", fontSize: "11px",
                            fontWeight: "600", background: s.highlight ? "#fee2e2" : "white",
                            color: s.highlight ? THEME.danger : THEME.muted, fontFamily: "inherit",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {s.highlight ? "★ Key" : "☆ Key"}
                        </button>
                        <button onClick={() => removeSection(i)} style={{
                          padding: "5px 9px", border: `1px solid #fecaca`,
                          borderRadius: "6px", cursor: "pointer", background: THEME.dangerBg,
                          color: THEME.danger, fontSize: "13px",
                        }}>✕</button>
                      </div>
                      <textarea
                        value={s.content}
                        onChange={e => updateSectionContent(i, e.target.value)}
                        placeholder="Default content (leave empty if doctor fills it each time)"
                        rows={2}
                        style={{ ...inp, resize: "vertical", lineHeight: 1.5 }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", paddingTop: "4px" }}>
                <button onClick={() => setShowModal(false)} style={{
                  padding: "10px 22px", border: `1.5px solid ${THEME.border}`,
                  borderRadius: "8px", cursor: "pointer", fontFamily: "inherit",
                  fontSize: "14px", fontWeight: "600", background: "white", color: THEME.text,
                }}>Cancel</button>
                <button onClick={save} style={{
                  padding: "10px 28px", border: "none",
                  borderRadius: "8px", cursor: "pointer", fontFamily: "inherit",
                  fontSize: "14px", fontWeight: "600",
                  background: THEME.teal, color: "white",
                  boxShadow: "0 4px 12px rgba(13,148,136,0.3)",
                }}>
                  {editTarget ? "Save Changes" : "Create Template"}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}