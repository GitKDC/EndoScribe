import React, { useState } from "react";

interface Section {
  title: string;
  content: string;
  highlight?: boolean;
  isHeading?: boolean;
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

  templates: {
    id: number;
    name: string;
    category: string;
    sections: Section[];
  }[];

  onPatientNameChange: (v: string) => void;
  onPatientAgeChange: (v: string) => void;
  onReportDateChange: (v: string) => void;
  onReportTypeChange: (v: string) => void;

  onTemplateSelect: (templateId: number) => void;
  setPrefix: (v: string) => void;
}

const ReportForm: React.FC<ReportFormProps> = ({
  patientName,
  patientAge,
  reportDate,
  reportType,
  doctorName,
  prefix,
  sections,
  setSections,
  templates,
  onPatientNameChange,
  onPatientAgeChange,
  onReportDateChange,
  onReportTypeChange,
  onTemplateSelect,
  setPrefix,
}) => {
  const [activeField, setActiveField] = useState<string | null>(null);
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("M");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");

  // New-field inputs for adding a custom section
  const [newFieldTitle, setNewFieldTitle] = useState("");

  // ─── Style helpers ────────────────────────────────────────────────────────
  const inputStyle = (name: string): React.CSSProperties => ({
    padding: "10px 12px",
    border: `1.5px solid ${activeField === name ? "#0d6efd" : "#ced4da"}`,
    borderRadius: "7px",
    fontSize: "14px",
    width: "100%",
    boxSizing: "border-box",
    fontFamily: "inherit",
    transition: "border-color 0.18s ease, box-shadow 0.18s ease",
    boxShadow:
      activeField === name ? "0 0 0 3px rgba(13,110,253,0.15)" : "none",
    outline: "none",
    backgroundColor: "white",
  });

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "5px",
    color: "#495057",
    letterSpacing: "0.2px",
  };

  const sectionStyle: React.CSSProperties = {
    padding: "18px",
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    border: "1px solid #e9ecef",
    transition: "box-shadow 0.2s ease",
  };

  const headerStyle: React.CSSProperties = {
    margin: "0 0 14px 0",
    color: "#1a3a52",
    fontSize: "15px",
    fontWeight: "700",
    borderBottom: "2px solid #f1f3f5",
    paddingBottom: "8px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  };

  const focus = (name: string) => () => setActiveField(name);
  const blur = () => setActiveField(null);

  // Filter templates by current report type only
  const filteredTemplates = templates.filter((t) => t.category === reportType);

  // Update a section's content by its real index
  const updateSection = (index: number, value: string) => {
    const updated = [...sections];
    updated[index] = { ...updated[index], content: value };
    setSections(updated);
  };

  // Update a heading section's title (e.g. rename "DILATATION")
  const updateHeadingTitle = (index: number, value: string) => {
    const updated = [...sections];
    updated[index] = { ...updated[index], title: value };
    setSections(updated);
  };

  // Delete a section by index
  const deleteSection = (index: number) => {
    setSections((prev) => prev.filter((_, i) => i !== index));
  };

  // Add a new custom section just before the last highlight (Impression) section.
  // If no highlight section exists, append at end.
  const addCustomSection = () => {
    const title = newFieldTitle.trim();
    if (!title) return;

    const newSection: Section = { title, content: "" };

    setSections((prev) => {
      let insertAt = prev.length; // default: append at end
      for (let i = prev.length - 1; i >= 0; i--) {
        if (prev[i].highlight) {
          insertAt = i;
          break;
        }
      }
      const copy = [...prev];
      copy.splice(insertAt, 0, newSection);
      return copy;
    });

    setNewFieldTitle("");
  };

  const applyFormat = (
    index: number,
    textarea: HTMLTextAreaElement,
    type: "bold" | "italic"
  ) => {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start === end) return; // nothing selected

    const selectedText = textarea.value.substring(start, end);

    let formatted = selectedText;

    if (type === "bold") {
      formatted = `**${selectedText}**`;
    } else {
      formatted = `*${selectedText}*`;
    }

    const updated = [...sections];
    updated[index].content =
      textarea.value.substring(0, start) +
      formatted +
      textarea.value.substring(end);

    setSections(updated);
  };


  const formatBtn: React.CSSProperties = {
    padding: "2px 6px",
    border: "1px solid #ccc",
    background: "#f8f9fa",
    cursor: "pointer",
    fontWeight: "bold",
    borderRadius: "4px",
  };

  const removeBtn: React.CSSProperties = {
    padding: "2px 8px",
    border: "1px solid #dee2e6",
    borderRadius: "5px",
    cursor: "pointer",
    color: "#dc3545",
  };
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

      {/* ── Patient Info ───────────────────────────────────────────────── */}
      <div style={sectionStyle}>
        <h4 style={headerStyle}><span>👤</span> Patient Information</h4>

        <div style={{ display: "flex", gap: "12px", marginBottom: "14px" }}>

          <div style={{ flex: 2 }}>
            <label style={labelStyle}>Patient Name</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <select
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                style={{ ...inputStyle("prefix"), width: "90px" }}
              >
                <option value="Mr">Mr</option>
                <option value="Mrs">Mrs</option>
                <option value="Ms">Ms</option>
              </select>
              <input
                type="text"
                value={patientName}
                onChange={(e) => onPatientNameChange(e.target.value)}
                placeholder="Patient Name"
                style={{ ...inputStyle("patientName"), flex: 1 }}
              />
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Age / Gender</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="number"
                value={age}
                onChange={(e) => {
                  const val = e.target.value;
                  setAge(val);
                  if (val) onPatientAgeChange(`${val}Yrs/${gender}`);
                }}
                placeholder="Age"
                style={{ ...inputStyle("age"), flex: 1 }}
              />
              <select
                value={gender}
                onChange={(e) => {
                  const g = e.target.value;
                  setGender(g);
                  if (age) onPatientAgeChange(`${age}Yrs/${g}`);
                }}
                style={{ ...inputStyle("gender"), width: "80px" }}
              >
                <option value="M">M</option>
                <option value="F">F</option>
              </select>
            </div>
          </div>

        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Date</label>
            <input
              type="date"
              value={reportDate}
              onChange={(e) => onReportDateChange(e.target.value)}
              onFocus={focus("reportDate")}
              onBlur={blur}
              style={inputStyle("reportDate")}
            />
          </div>

          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Doctor Name</label>
            <input
              type="text"
              value="Dr Hrushikesh P. Chaudhari"
              disabled
              style={{
                ...inputStyle("doctorName"),
                backgroundColor: "#f1f3f5",
                color: "#495057",
                cursor: "not-allowed",
                fontWeight: "600",
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Report Details & Template ──────────────────────────────────── */}
      <div style={sectionStyle}>
        <h4 style={headerStyle}><span>📄</span> Report Details</h4>

        <div style={{ marginBottom: "14px" }}>
          <label style={labelStyle}>Report Title</label>
          <select
            value={reportType}
            onChange={(e) => {
              onReportTypeChange(e.target.value);
              setSelectedTemplateId("");
            }}
            style={inputStyle("reportType")}
          >
            <option value="UGI">UGI (Upper GI Endoscopy)</option>
            <option value="COLONOSCOPY">Colonoscopy</option>
            <option value="SIGMOIDOSCOPY">Sigmoidoscopy</option>
            <option value="ERCP">ERCP</option>
            <option value="ENTEROSCOPY">Enteroscopy</option>
            <option value="VLS">VLS Scopy</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>Load Template</label>
          <select
            value={selectedTemplateId}
            onChange={(e) => {
              const id = Number(e.target.value);
              setSelectedTemplateId(e.target.value);
              if (!id) return;
              onTemplateSelect(id);
            }}
            onFocus={focus("template")}
            onBlur={blur}
            style={{
              ...inputStyle("template"),
              border: `1.5px solid ${
                activeField === "template" ? "#0d6efd" : "#007bff"
              }`,
              cursor: "pointer",
              fontWeight: "500",
              color: "#1a3a52",
              appearance: "auto",
            }}
          >
            <option value="">— Select Template —</option>
            {filteredTemplates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Clinical Findings ─────────────────────────────────────────── */}
      <div style={sectionStyle}>
        <h4 style={headerStyle}><span>🔬</span> Clinical Findings</h4>

        {sections.map((section, index) => {
          // ── Heading sections (e.g. "DILATATION" / "POST DILATATION") ──
          // Rendered as a labelled divider, not a textarea — they're
          // structural markers in the report, with no body content.
          if (section.isHeading) {
            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  margin: "14px 0 10px 0",
                }}
              >
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => updateHeadingTitle(index, e.target.value)}
                  onFocus={focus(`heading-${index}`)}
                  onBlur={blur}
                  style={{
                    ...inputStyle(`heading-${index}`),
                    flex: 1,
                    fontWeight: "800",
                    textTransform: "uppercase",
                    color: "#c0392b",
                    border: `1.5px solid ${
                      activeField === `heading-${index}` ? "#0d6efd" : "#f5c6cb"
                    }`,
                    backgroundColor: "#fff7f7",
                  }}
                />
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    color: "#adb5bd",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Section
                </span>
                <button
                  onClick={() => deleteSection(index)}
                  title="Remove this section heading"
                  style={{
                    background: "none",
                    border: "1px solid #dee2e6",
                    borderRadius: "5px",
                    cursor: "pointer",
                    padding: "4px 8px",
                    fontSize: "13px",
                    color: "#dc3545",
                    lineHeight: 1.4,
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.background =
                      "#fff0f0")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.background =
                      "none")
                  }
                >
                  ✕
                </button>
              </div>
            );
          }

          const isHighlight = !!section.highlight;
          const fieldKey = `section-${index}`;
          const isActive = activeField === fieldKey;

          return (
            <div
              key={index}
              style={{
                marginBottom: "12px",
                position: "relative",
              }}
            >
              {/* Label row: title + delete button (for non-highlight custom fields) */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "5px",
                }}
              >
                <label style={{ ...labelStyle, marginBottom: 0 }}>
                  {section.title}
                  {isHighlight && (
                    <span style={{ color: "#c0392b", marginLeft: "6px" }}>
                      (Important)
                    </span>
                  )}
                </label>

                 <div style={{ display: "flex", gap: "6px" }}>
                    {/* BOLD BUTTON */}
                    <button
                      type="button"
                      onClick={() => {
                        const textarea = document.getElementById(
                          `textarea-${index}`
                        ) as HTMLTextAreaElement;
                        if (textarea) applyFormat(index, textarea, "bold");
                      }}
                      style={formatBtn}
                    >
                      B
                    </button>

                    {/* ITALIC BUTTON */}
                    <button
                      type="button"
                      onClick={() => {
                        const textarea = document.getElementById(
                          `textarea-${index}`
                        ) as HTMLTextAreaElement;
                        if (textarea) applyFormat(index, textarea, "italic");
                      }}
                      style={formatBtn}
                    >
                      I
                    </button>

                {/* Show delete button only for non-highlight sections */}
                {!isHighlight && (
                  <button
                    onClick={() => deleteSection(index)}
                    title="Remove this field"
                    style={{
                      background: "none",
                      border: "1px solid #dee2e6",
                      borderRadius: "5px",
                      cursor: "pointer",
                      padding: "2px 8px",
                      fontSize: "13px",
                      color: "#dc3545",
                      lineHeight: 1.4,
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.background =
                        "#fff0f0")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.background =
                        "none")
                    }
                  >
                    ✕ Remove
                  </button>
                )}
                </div>
              </div>

              <textarea
                id={`textarea-${index}`}
                value={section.content}
                onChange={(e) => updateSection(index, e.target.value)}
                onFocus={focus(fieldKey)}
                onBlur={blur}
                rows={isHighlight ? 4 : 3}
                onKeyDown={(e) => {
                  if (e.ctrlKey && e.key === "b") {
                    e.preventDefault();
                    applyFormat(index, e.currentTarget, "bold");
                  }
                  if (e.ctrlKey && e.key === "i") {
                    e.preventDefault();
                    applyFormat(index, e.currentTarget, "italic");
                  }
                }}
                style={{
                  ...inputStyle(fieldKey),
                  resize: "vertical",
                  lineHeight: 1.5,
                  border: isHighlight
                    ? `1.5px solid ${isActive ? "#c0392b" : "#f5c6cb"}`
                    : `1.5px solid ${isActive ? "#0d6efd" : "#ced4da"}`,
                  boxShadow:
                    isHighlight && isActive
                      ? "0 0 0 3px rgba(220,53,69,0.12)"
                      : isActive
                      ? "0 0 0 3px rgba(13,110,253,0.15)"
                      : "none",
                }}
              />
            </div>
          );
        })}

        {/* ── Add Custom Field ──────────────────────────────────────────── */}
        <div
          style={{
            marginTop: "16px",
            padding: "14px",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            border: "1.5px dashed #adb5bd",
          }}
        >
          <p
            style={{
              margin: "0 0 10px 0",
              fontSize: "12px",
              fontWeight: "600",
              color: "#6c757d",
              textTransform: "uppercase",
              letterSpacing: "0.4px",
            }}
          >
            ➕ Add Custom Field (inserted before Impression)
          </p>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              value={newFieldTitle}
              onChange={(e) => setNewFieldTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addCustomSection();
              }}
              placeholder="Field name, e.g. Colon, Biopsy Site…"
              onFocus={focus("newFieldTitle")}
              onBlur={blur}
              style={{
                ...inputStyle("newFieldTitle"),
                flex: 1,
              }}
            />
            <button
              onClick={addCustomSection}
              disabled={!newFieldTitle.trim()}
              style={{
                padding: "10px 18px",
                backgroundColor: newFieldTitle.trim() ? "#0d6efd" : "#ced4da",
                color: "white",
                border: "none",
                borderRadius: "7px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: newFieldTitle.trim() ? "pointer" : "not-allowed",
                whiteSpace: "nowrap",
                transition: "background 0.15s",
              }}
            >
              Add Field
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportForm;