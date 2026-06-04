import React, { useState } from "react";

interface ReportFormProps {
  patientName: string;
  patientAge: string;
  reportDate: string;
  reportType: string;
  esophagus: string;
  stomach: string;
  duodenum: string;
  impression: string;
  doctorName: string;
  prefix: string;
  templates: {
    id: number;
    name: string;
    category: string;
    esophagus: string;
    stomach: string;
    duodenum: string;
    impression: string;
  }[];
  onPatientNameChange: (v: string) => void;
  onPatientAgeChange: (v: string) => void;
  onReportDateChange: (v: string) => void;
  onReportTypeChange: (v: string) => void;
  onEsophagusChange: (v: string) => void;
  onStomachChange: (v: string) => void;
  onDuodenumChange: (v: string) => void;
  onImpressionChange: (v: string) => void;
  onDoctorNameChange: (v: string) => void;
  onTemplateSelect: (templateId: number) => void;
  setPrefix: (v: string) => void;
}

const ReportForm: React.FC<ReportFormProps> = ({
  patientName, patientAge, reportDate, reportType,
  esophagus, stomach, duodenum, impression, doctorName,
  templates,prefix,
  onPatientNameChange, onPatientAgeChange, onReportDateChange,
  onReportTypeChange, onEsophagusChange, onStomachChange,
  onDuodenumChange, onImpressionChange, onDoctorNameChange,
  onTemplateSelect,setPrefix
}) => {
  const [activeField, setActiveField] = useState<string | null>(null);

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
    boxShadow: activeField === name ? "0 0 0 3px rgba(13,110,253,0.15)" : "none",
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
  const blur  = () => setActiveField(null);

  const [age, setAge] = useState("");
  const [gender, setGender] = useState("M");

  const updateAgeGender = (a: string, g: string) => {
    const formatted = a ? `${a}Yrs/${g}` : "";
    onPatientAgeChange(formatted);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

      {/* ── Patient Info ───────────────────────────────────────────────── */}
      <div style={sectionStyle}>
        <h4 style={headerStyle}><span>👤</span> Patient Information</h4>

        {/* Row 1: Name + Age/Gender */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "14px" }}>

          {/* Patient Name with Prefix */}
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

          {/* Age + Gender */}
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

        {/* Row 2: Date + Doctor */}
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
                fontWeight: "600"
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
          <input
            type="text"
            value={reportType}
            onChange={(e) => onReportTypeChange(e.target.value)}
            onFocus={focus("reportType")} onBlur={blur}
            placeholder="e.g., UPPER GI ENDOSCOPY"
            style={inputStyle("reportType")}
          />
        </div>

        <div>
          <label style={labelStyle}>Load Template</label>
          <select
            onChange={(e) => {
              if (e.target.value) onTemplateSelect(Number(e.target.value));
              e.target.value = ""; // reset so same template can be re-selected
            }}
            onFocus={focus("template")} onBlur={blur}
            style={{
              ...inputStyle("template"),
              border: `1.5px solid ${activeField === "template" ? "#0d6efd" : "#007bff"}`,
              cursor: "pointer",
              fontWeight: "500",
              color: "#1a3a52",
              appearance: "auto",
            }}
          >
            <option value="">— Select Template —</option>
            {templates.map((t) => (
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

        {(
          [
            { key: "esophagus", label: "Esophagus",  value: esophagus,  onChange: onEsophagusChange,  placeholder: "Describe esophagus findings…" },
            { key: "stomach",   label: "Stomach",    value: stomach,    onChange: onStomachChange,    placeholder: "Describe stomach findings…" },
            { key: "duodenum",  label: "Duodenum",   value: duodenum,   onChange: onDuodenumChange,   placeholder: "Describe duodenum findings…" },
          ] as const
        ).map(({ key, label, value, onChange, placeholder }) => (
          <div key={key} style={{ marginBottom: "13px" }}>
            <label style={labelStyle}>{label}:</label>
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onFocus={focus(key)} onBlur={blur}
              placeholder={placeholder}
              rows={3}
              style={{ ...inputStyle(key), resize: "vertical", lineHeight: 1.5 }}
            />
          </div>
        ))}

        {/* Impression */}
        <div>
          <label style={{ ...labelStyle, color: "#c0392b" }}>Impression:</label>
          <textarea
            value={impression}
            onChange={(e) => onImpressionChange(e.target.value)}
            onFocus={focus("impression")} onBlur={blur}
            placeholder="Clinical impression and diagnosis…"
            rows={4}
            style={{
              ...inputStyle("impression"),
              resize: "vertical",
              backgroundColor: activeField === "impression" ? "#fff9f9" : "#fffaf0",
              borderColor: activeField === "impression" ? "#c0392b" : "#f5c6cb",
              boxShadow: activeField === "impression" ? "0 0 0 3px rgba(220,53,69,0.12)" : "none",
              lineHeight: 1.5,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ReportForm;