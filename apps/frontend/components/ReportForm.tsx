import React, { useEffect, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { SlCalender } from "react-icons/sl";

const THEME = {
  navy:    "#1a3a52",
  teal:    "#0d9488",
  tealBg:  "#f0fdfa",
  border:  "#e2e8f0",
  bg:      "#f8fafc",
  white:   "#ffffff",
  text:    "#1e293b",
  muted:   "#64748b",
  danger:  "#dc2626",
  dangerBg:"#fff0f0",
  highlight:"#fef2f2",
  highlightBorder: "#fca5a5",
};

interface Section {
  title: string;
  content: string;
  highlight?: boolean;
  isHeading?: boolean;
}

interface Doctor {
  id: number;
  name: string;
  qualifications?: string;
  designation?: string;
  is_default?: number;
  display_order?: number;
}

interface ReportFormProps {
  patientName: string;
  patientAge: string;
  reportDate: string;
  reportType: string;
  doctorName: string;
  prefix: string;
  sections: Section[];
  setSections: React.Dispatch<React.SetStateAction<Section[]>>;
  templates: { id: number; name: string; category: string; sections: Section[] }[];
  selectedDoctorIds: number[];
  setSelectedDoctorIds: React.Dispatch<React.SetStateAction<number[]>>;
  onPatientNameChange: (v: string) => void;
  onPatientAgeChange:  (v: string) => void;
  onReportDateChange:  (v: string) => void;
  onReportTypeChange:  (v: string) => void;
  onTemplateSelect:    (templateId: number) => void;
  setPrefix:           (v: string) => void;
}

const ReportForm: React.FC<ReportFormProps> = ({
  patientName, patientAge, reportDate, reportType, prefix,
  sections, setSections, templates,
  selectedDoctorIds, setSelectedDoctorIds,
  onPatientNameChange, onPatientAgeChange, onReportDateChange,
  onReportTypeChange, onTemplateSelect, setPrefix,
}) => {
  const [activeField, setActiveField] = useState<string | null>(null);
  const [age, setAge]     = useState("");
  const [gender, setGender] = useState("M");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [newFieldTitle, setNewFieldTitle] = useState("");
  const [doctors, setDoctors]   = useState<Doctor[]>([]);
  const [docMenuOpen, setDocMenuOpen] = useState(false);

  // ref for the trigger element — used to measure where to place the dropdown
  const triggerRef = useRef<HTMLDivElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    const loadDoctors = async () => {
      if (!(window as any).api) return;
      try {
        const data = await (window as any).api.getDoctors();
        setDoctors(data || []);
        if (selectedDoctorIds.length === 0) {
          const defaults = (data || []).filter((d: Doctor) => d.is_default).map((d: Doctor) => d.id);
          if (defaults.length) setSelectedDoctorIds(defaults);
        }
      } catch (err) {
        console.error("Failed to load doctors:", err);
      }
    };
    loadDoctors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recalculate dropdown position every time it opens
  useEffect(() => {
    if (!docMenuOpen || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const dropH = Math.min(220, doctors.length * 58 + 8);

    if (spaceBelow >= dropH + 8) {
      // open downward
      setDropdownStyle({
        position: "fixed",
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
        maxHeight: "220px",
        overflowY: "auto",
        background: THEME.white,
        border: `1.5px solid ${THEME.border}`,
        borderRadius: "8px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.14)",
      });
    } else {
      // open upward
      setDropdownStyle({
        position: "fixed",
        bottom: window.innerHeight - rect.top + 4,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
        maxHeight: "220px",
        overflowY: "auto",
        background: THEME.white,
        border: `1.5px solid ${THEME.border}`,
        borderRadius: "8px",
        boxShadow: "0 -8px 24px rgba(0,0,0,0.14)",
      });
    }
  }, [docMenuOpen, doctors.length]);

  const focus = (name: string) => () => setActiveField(name);
  const blur  = () => setActiveField(null);

  const inp = (name: string): React.CSSProperties => ({
    padding: "12px 14px",
    border: `1.5px solid ${activeField === name ? THEME.teal : THEME.border}`,
    borderRadius: "8px",
    fontSize: "14px",
    width: "100%",
    boxSizing: "border-box",
    fontFamily: "'Inter', sans-serif",
    outline: "none",
    background: THEME.white,
    color: THEME.text,
    transition: "border-color 0.15s, box-shadow 0.15s",
    boxShadow: activeField === name ? "0 0 0 3px rgba(13,148,136,0.15)" : "none",
  });

  const lbl: React.CSSProperties = {
    display: "block",
    fontSize: "11px",
    fontWeight: "600",
    marginBottom: "5px",
    color: THEME.muted,
    textTransform: "uppercase",
    letterSpacing: "0.4px",
    fontFamily: "'Inter', sans-serif",
  };

  const card: React.CSSProperties = {
    padding: "24px 26px",
    background: THEME.white,
    borderRadius: "14px",
    border: `1px solid ${THEME.border}`,
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  };

  const cardHdr: React.CSSProperties = {
    margin: "0 0 14px 0",
    fontSize: "11px",
    fontWeight: "700",
    color: THEME.navy,
    display: "flex",
    alignItems: "center",
    gap: "7px",
    paddingBottom: "10px",
    borderBottom: `1.5px solid ${THEME.border}`,
    fontFamily: "'Inter', sans-serif",
    textTransform: "uppercase",
    letterSpacing: "0.6px",
  };

  const icon = (emoji: string, bg: string) => (
    <span style={{
      width: "22px", height: "22px", borderRadius: "6px",
      background: bg, display: "inline-flex",
      alignItems: "center", justifyContent: "center", fontSize: "12px",
    }}>{emoji}</span>
  );

  const filteredTemplates = templates.filter(t => t.category === reportType);

  const updateSection      = (i: number, v: string) => setSections(p => p.map((s, idx) => idx === i ? { ...s, content: v } : s));
  const updateHeadingTitle = (i: number, v: string) => setSections(p => p.map((s, idx) => idx === i ? { ...s, title: v } : s));
  const deleteSection      = (i: number) => setSections(p => p.filter((_, idx) => idx !== i));

  const addCustomSection = () => {
    const title = newFieldTitle.trim();
    if (!title) return;
    setSections(prev => {
      let insertAt = prev.length;
      for (let i = prev.length - 1; i >= 0; i--) { if (prev[i].highlight) { insertAt = i; break; } }
      const copy = [...prev];
      copy.splice(insertAt, 0, { title, content: "" });
      return copy;
    });
    setNewFieldTitle("");
  };

  const applyFormat = (i: number, ta: HTMLTextAreaElement, type: "bold" | "italic") => {
    const { selectionStart: s, selectionEnd: e, value } = ta;
    if (s === e) return;
    const w = type === "bold" ? "**" : "*";
    const nc = value.slice(0, s) + w + value.slice(s, e) + w + value.slice(e);
    setSections(p => p.map((sec, idx) => idx === i ? { ...sec, content: nc } : sec));
  };

  const toggleDoctor = (id: number) => {
    setSelectedDoctorIds(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const selectedDoctors = doctors.filter(d => selectedDoctorIds.includes(d.id));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .rfmt:hover { background: #e2e8f0 !important; }
        .rrem:hover { background: #fee2e2 !important; }
        .doc-opt:hover { background: #f0fdfa !important; }
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
        select, input[type="date"] {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
        }
        input[type="date"]::-webkit-calendar-picker-indicator {
          opacity: 0;
          position: absolute;
          right: 0;
          top: 0;
          width: 32px;
          height: 100%;
          cursor: pointer;
        }
      `}</style>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontFamily: "'Inter', sans-serif" }}>

        {/* ── Patient Info ─────────────────────────────── */}
        <div style={card}>
          <h4 style={cardHdr}>{icon("👤", THEME.teal + "18")} Patient Information</h4>

          <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
            <div style={{ flex: 2 }}>
              <label style={lbl}>Patient Name</label>
              <div style={{ display: "flex", gap: "6px" }}>
                <div style={{ position: "relative", display: "flex", alignItems: "center", width: "76px", flexShrink: 0 }}>
                  <select value={prefix} onChange={e => setPrefix(e.target.value)}
                    style={{ ...inp("pfx"), width: "100%", paddingRight: "26px", cursor: "pointer" }}>
                    <option>Mr.</option><option>Mrs.</option><option>Master.</option><option>Miss.</option>
                  </select>
                  <div style={{ position: "absolute", right: "8px", pointerEvents: "none", color: THEME.teal, display: "flex" }}><IoIosArrowDown size={14} /></div>
                </div>
                <input type="text" value={patientName} onChange={e => onPatientNameChange(e.target.value)}
                  placeholder="Full name" onFocus={focus("pn")} onBlur={blur}
                  style={{ ...inp("pn"), flex: 1 }} />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <label style={lbl}>Age / Gender</label>
              <div style={{ display: "flex", gap: "6px" }}>
                <input type="number" value={age}
                  onChange={e => { setAge(e.target.value); if (e.target.value) onPatientAgeChange(`${e.target.value}Yrs/${gender}`); }}
                  placeholder="Age" onFocus={focus("age")} onBlur={blur}
                  style={{ ...inp("age"), flex: 1 }} />
                <div style={{ position: "relative", display: "flex", alignItems: "center", width: "66px", flexShrink: 0 }}>
                  <select value={gender}
                    onChange={e => { setGender(e.target.value); if (age) onPatientAgeChange(`${age}Yrs/${e.target.value}`); }}
                    style={{ ...inp("gen"), width: "100%", paddingRight: "24px", cursor: "pointer" }}>
                    <option value="M">M</option><option value="F">F</option>
                  </select>
                  <div style={{ position: "absolute", right: "8px", pointerEvents: "none", color: THEME.teal, display: "flex" }}><IoIosArrowDown size={14} /></div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ flex: 1 }}>
              <label style={lbl}>Date</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <input type="date" value={reportDate} onChange={e => onReportDateChange(e.target.value)}
                  onFocus={focus("dt")} onBlur={blur} style={{ ...inp("dt"), paddingRight: "32px", cursor: "pointer" }} />
                <div style={{ position: "absolute", right: "12px", pointerEvents: "none", color: THEME.teal, display: "flex" }}><SlCalender size={15} /></div>
              </div>
            </div>

            {/* ── Doctor multi-select — uses fixed positioning to avoid overflow ── */}
            <div style={{ flex: 1 }}>
              <label style={lbl}>Doctor(s)</label>
              <div
                ref={triggerRef}
                onClick={() => setDocMenuOpen(o => !o)}
                style={{
                  ...inp("doc"),
                  cursor: "pointer",
                  borderColor: docMenuOpen ? THEME.teal : THEME.border,
                  boxShadow: docMenuOpen ? "0 0 0 3px rgba(13,148,136,0.15)" : "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  height: "44px",      // fixed height — never grows
                  overflow: "hidden",
                  userSelect: "none",
                  padding: "0 10px",
                }}
              >
                <span style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  minWidth: 0,
                  flex: 1,
                  fontSize: "13px",
                  color: selectedDoctors.length ? THEME.text : THEME.muted,
                  fontWeight: selectedDoctors.length ? 500 : 400,
                }}>
                  {selectedDoctors.length === 0
                    ? "Select doctor(s)…"
                    : selectedDoctors.length === 1
                    ? selectedDoctors[0].name
                    : `${selectedDoctors[0].name.replace(/^Dr\.?\s*/i, "Dr ")} +${selectedDoctors.length - 1}`}
                </span>
                <span style={{ color: THEME.teal, display: "flex", flexShrink: 0, transform: docMenuOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                  <IoIosArrowDown size={16} />
                </span>
              </div>

              {/* Dropdown rendered via portal-like fixed positioning */}
              {docMenuOpen && (
                <>
                  {/* backdrop */}
                  <div
                    onClick={() => setDocMenuOpen(false)}
                    style={{ position: "fixed", inset: 0, zIndex: 9998 }}
                  />
                  <div style={dropdownStyle}>
                    {doctors.length === 0 && (
                      <div style={{ padding: "12px", fontSize: "12px", color: THEME.muted, textAlign: "center" }}>
                        No doctors yet. Add from Dashboard.
                      </div>
                    )}
                    {doctors.map(d => {
                      const checked = selectedDoctorIds.includes(d.id);
                      return (
                        <label key={d.id} className="doc-opt" style={{
                          display: "flex", alignItems: "flex-start", gap: "8px",
                          padding: "9px 12px", cursor: "pointer",
                          borderBottom: `1px solid ${THEME.border}`,
                        }}>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleDoctor(d.id)}
                            style={{ marginTop: "3px", cursor: "pointer", accentColor: THEME.teal }}
                          />
                          <div>
                            <div style={{ fontSize: "12.5px", fontWeight: "600", color: THEME.text }}>{d.name}</div>
                            {d.designation && (
                              <div style={{ fontSize: "11px", color: THEME.muted, marginTop: "1px" }}>{d.designation}</div>
                            )}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── Report Details ────────────────────────── */}
        <div style={card}>
          <h4 style={cardHdr}>{icon("📄", "#7c3aed18")} Report Details</h4>

          <div style={{ marginBottom: "12px" }}>
            <label style={lbl}>Procedure Type</label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <select value={reportType}
                onChange={e => { onReportTypeChange(e.target.value); setSelectedTemplateId(""); }}
                onFocus={focus("rt")} onBlur={blur} style={{ ...inp("rt"), paddingRight: "32px", cursor: "pointer" }}>
                <option value="UGI">UGI (Upper GI Endoscopy)</option>
                <option value="COLONOSCOPY">Colonoscopy</option>
                <option value="SIGMOIDOSCOPY">Sigmoidoscopy</option>
                <option value="ERCP">ERCP</option>
                <option value="ENTEROSCOPY">Enteroscopy</option>
                <option value="VLS">VLS Scopy</option>
              </select>
              <div style={{ position: "absolute", right: "12px", pointerEvents: "none", color: THEME.teal, display: "flex" }}><IoIosArrowDown size={16} /></div>
            </div>
          </div>

          <div>
            <label style={lbl}>Load Template</label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <select value={selectedTemplateId}
                onChange={e => { const id = Number(e.target.value); setSelectedTemplateId(e.target.value); if (id) onTemplateSelect(id); }}
                onFocus={focus("tpl")} onBlur={blur}
                style={{
                  ...inp("tpl"),
                  borderColor: activeField === "tpl" ? THEME.teal : THEME.teal + "55",
                  fontWeight: "500", color: THEME.navy,
                  paddingRight: "32px", cursor: "pointer"
                }}>
                <option value="">— Select Template —</option>
                {filteredTemplates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              <div style={{ position: "absolute", right: "12px", pointerEvents: "none", color: THEME.teal, display: "flex" }}><IoIosArrowDown size={16} /></div>
            </div>
          </div>
        </div>

        {/* ── Clinical Findings ─────────────────────── */}
        <div style={card}>
          <h4 style={cardHdr}>{icon("🔬", "#b4530918")} Clinical Findings</h4>

          {sections.map((section, i) => {
            if (section.isHeading) {
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", margin: "12px 0 8px" }}>
                  <input type="text" value={section.title} onChange={e => updateHeadingTitle(i, e.target.value)}
                    onFocus={focus(`h${i}`)} onBlur={blur}
                    style={{
                      ...inp(`h${i}`), flex: 1, fontWeight: "800",
                      textTransform: "uppercase", color: THEME.danger,
                      borderColor: THEME.highlightBorder, background: THEME.highlight,
                    }} />
                  <span style={{ fontSize: "10px", color: THEME.muted, whiteSpace: "nowrap", fontWeight: "600" }}>SECTION</span>
                  <button onClick={() => deleteSection(i)} style={{
                    padding: "4px 8px", border: `1px solid ${THEME.border}`,
                    borderRadius: "5px", cursor: "pointer", color: THEME.danger, background: "white", fontSize: "12px",
                  }}>✕</button>
                </div>
              );
            }

            const isHL = !!section.highlight;
            const fk   = `s${i}`;
            const act  = activeField === fk;

            return (
              <div key={i} style={{ marginBottom: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "5px" }}>
                  <label style={{ ...lbl, marginBottom: 0 }}>
                    {section.title}
                    {isHL && <span style={{ color: THEME.danger, marginLeft: "6px", textTransform: "none", letterSpacing: 0, fontWeight: "600" }}> · Key</span>}
                  </label>

                  <div style={{ display: "flex", gap: "4px" }}>
                    {(["bold", "italic"] as const).map(fmt => (
                      <button key={fmt} className="rfmt" type="button"
                        onClick={() => { const ta = document.getElementById(`ta${i}`) as HTMLTextAreaElement; if (ta) applyFormat(i, ta, fmt); }}
                        style={{
                          padding: "2px 7px", border: `1px solid ${THEME.border}`,
                          borderRadius: "5px", cursor: "pointer", fontSize: "12px",
                          fontWeight: fmt === "bold" ? "700" : "400",
                          fontStyle: fmt === "italic" ? "italic" : "normal",
                          background: "white", color: THEME.muted, fontFamily: "inherit",
                          transition: "background 0.12s",
                        }}>{fmt === "bold" ? "B" : "I"}</button>
                    ))}
                    {!isHL && (
                      <button className="rrem" onClick={() => deleteSection(i)} style={{
                        padding: "2px 8px", border: `1px solid ${THEME.border}`,
                        borderRadius: "5px", cursor: "pointer", fontSize: "11px",
                        fontWeight: "600", color: THEME.danger, background: "white",
                        transition: "background 0.12s", fontFamily: "inherit",
                      }}>✕ Remove</button>
                    )}
                  </div>
                </div>

                <textarea id={`ta${i}`} value={section.content}
                  onChange={e => updateSection(i, e.target.value)}
                  onFocus={focus(fk)} onBlur={blur}
                  rows={isHL ? 4 : 3}
                  onKeyDown={e => {
                    if (e.ctrlKey && e.key === "b") { e.preventDefault(); applyFormat(i, e.currentTarget, "bold"); }
                    if (e.ctrlKey && e.key === "i") { e.preventDefault(); applyFormat(i, e.currentTarget, "italic"); }
                  }}
                  style={{
                    ...inp(fk), resize: "vertical", lineHeight: 1.55,
                    borderColor: isHL ? (act ? THEME.danger : THEME.highlightBorder) : (act ? THEME.teal : THEME.border),
                    background: isHL ? THEME.highlight : THEME.white,
                    boxShadow: act ? (isHL ? "0 0 0 3px rgba(220,53,69,0.12)" : "0 0 0 3px rgba(13,148,136,0.15)") : "none",
                  }} />
              </div>
            );
          })}

          {/* Add custom field */}
          <div style={{
            marginTop: "14px", padding: "12px 14px",
            background: THEME.tealBg, borderRadius: "9px",
            border: `1.5px dashed ${THEME.teal}55`,
          }}>
            <p style={{ margin: "0 0 8px", fontSize: "11px", fontWeight: "600", color: THEME.teal, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              ➕ Add Custom Field
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              <input type="text" value={newFieldTitle}
                onChange={e => setNewFieldTitle(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") addCustomSection(); }}
                placeholder="Field name, e.g. Colon, Biopsy Site…"
                onFocus={focus("nf")} onBlur={blur}
                style={{ ...inp("nf"), flex: 1 }} />
              <button onClick={addCustomSection} disabled={!newFieldTitle.trim()} style={{
                padding: "9px 16px",
                background: newFieldTitle.trim() ? THEME.teal : THEME.border,
                color: "white", border: "none", borderRadius: "7px",
                fontSize: "13px", fontWeight: "600",
                cursor: newFieldTitle.trim() ? "pointer" : "not-allowed",
                whiteSpace: "nowrap", fontFamily: "inherit",
              }}>Add Field</button>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default ReportForm;