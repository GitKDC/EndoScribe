import React from "react";

interface ImageData {
  id: string;
  url: string;
  label: string;
  nbiLabel?: string;
  brightness?: number;
  contrast?: number;
}

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
}

interface ReportPreviewProps {
  patientName: string;
  patientAge: string;
  reportDate: string;
  reportType: string;
  sections: Section[];
  doctorName: string;
  images: ImageData[];
  prefix: string;
  // 🔥 NEW: doctors to render in the footer, in order
  selectedDoctors?: Doctor[];
}

// Maps internal report type codes to the display title shown on the report
const REPORT_TITLE_MAP: Record<string, string> = {
  UGI: "UPPER GI ENDOSCOPY",
  VLS: "VLS SCOPY",
  SIGMOIDOSCOPY: "SIGMOIDOSCOPY",
  COLONOSCOPY: "COLONOSCOPY",
};

// Fallback doctors used only if none are selected/passed — keeps old
// behaviour intact so existing reports never render an empty footer.
const FALLBACK_DOCTORS: Doctor[] = [
  {
    id: -1,
    name: "Dr Hrushikesh P. Chaudhari",
    qualifications: "DNB (Gen. Med.), DNB (Gastro.)",
    designation: "Consultant Gastroenterologist & Therapeutic Endoscopist",
  },
  {
    id: -2,
    name: "Dr Vaibhav Lamdhade",
    qualifications: "DNB (Gen. Med.), DNB (Gastro.)",
    designation: "Consultant Gastroenterologist & Therapeutic Endoscopist",
  },
];

const ReportPreview: React.FC<ReportPreviewProps> = ({
  patientName,
  patientAge,
  reportDate,
  reportType,
  sections,
  doctorName,
  images,
  prefix,
  selectedDoctors,
}) => {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return [
      String(d.getDate()).padStart(2, "0"),
      String(d.getMonth() + 1).padStart(2, "0"),
      d.getFullYear(),
    ].join("/");
  };

  // Only sections with actual content (or marked headings) are rendered
  const visibleSections = sections.filter(
    (s) => s.isHeading || (s.content && s.content.trim() !== "")
  );

  const totalLen = visibleSections.reduce(
    (sum, s) => sum + (s.content?.length || 0),
    0
  );

  const bodyFont = totalLen > 700 ? "13px" : totalLen > 450 ? "14px" : "15px";
  const lineH    = totalLen > 700 ? 1.4   : totalLen > 450 ? 1.45  : 1.5;
  const paraGap  = totalLen > 700 ? "8px" : "11px";

  // Images 1-4 → right column stacked
  // Images 5-6 → below text in left column
  const rightImages  = images.slice(0, 4);
  const bottomImages = images.slice(4, 6);

  const displayTitle = REPORT_TITLE_MAP[reportType] || reportType || "UPPER GI ENDOSCOPY";

  // Builds the CSS filter string for a given image's brightness/contrast.
  const filterFor = (img: ImageData) =>
    `brightness(${(img.brightness ?? 100) / 100}) contrast(${(img.contrast ?? 100) / 100})`;

  const NbiLabel = ({ label }: { label?: string }) =>
    label ? (
      <span
        style={{
          position: "absolute",
          top: "5px",
          left: "5px",
          backgroundColor: "rgba(255,200,0,0.88)",
          color: "#111",
          fontSize: "10px",
          fontWeight: "bold",
          padding: "2px 5px",
          borderRadius: "2px",
          lineHeight: 1.4,
          zIndex: 1,
        }}
      >
        {label}
      </span>
    ) : null;

  // 🔥 NEW: which doctors actually render in the footer — falls back to
  // the original hardcoded two doctors if nothing was selected, so this
  // change is fully backward compatible.
  const footerDoctors =
    selectedDoctors && selectedDoctors.length > 0 ? selectedDoctors : FALLBACK_DOCTORS;

  return (
    /*
     * height: "1123px" (not minHeight) forces the report to exactly one A4 page.
     * overflow: hidden ensures nothing bleeds beyond A4 bounds.
     * This is what guarantees the footer is ALWAYS on the same page in the PDF.
     */
    <div
      id="report-content"
      style={{
        backgroundColor: "white",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#111",
        width: "794px",
        height: "1123px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div style={{ flexShrink: 0 }}>
        <img
          src="/images/header.png"
          alt="Hospital Header"
          style={{ width: "100%", height: "auto", display: "block" }}
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.style.display = "none";
            const fb = img.nextElementSibling as HTMLElement | null;
            if (fb) fb.style.display = "flex";
          }}
        />
        <div
          style={{
            display: "none",
            height: "100px",
            backgroundColor: "#1a3a52",
            color: "white",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            fontWeight: "bold",
          }}
        >
          Shobha Hospital &amp; Superspeciality Gastroenterology Centre
        </div>
      </div>

      {/* ── BODY — fills all space between header and footer ────────────── */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          gap: "16px",
          padding: "12px 24px 0 24px",
          overflow: "hidden",
        }}
      >
        {/* ── LEFT: patient row + title + text + bottom images ────────── */}
        <div
          style={{
            flex: "1 1 57%",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            fontSize: bodyFont,
            lineHeight: lineH,
          }}
        >
          {/* Patient row */}
          <div
            style={{
              flexShrink: 0,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
              paddingBottom: "6px",
              borderBottom: "1.5px solid #ddd",
            }}
          >
            <p style={{ margin: 0, fontSize: "15px", fontWeight: "700" }}>
              {patientName
                ? `${prefix} ${patientName} - ${patientAge}`
                : "Patient Name"}
            </p>
          </div>

          {/* Report title */}
          <div style={{ flexShrink: 0, marginBottom: "10px" }}>
            <h2
              style={{
                margin: 0,
                fontSize: "15px",
                fontWeight: "900",
                textTransform: "uppercase",
                display: "inline-block",
                border: "1.5px solid #333",
                padding: "3px 12px",
                letterSpacing: "0.5px",
              }}
            >
              {displayTitle}
            </h2>
          </div>

          {/* Clinical text */}
          <div style={{ flex: 1, overflow: "hidden" }}>
            {visibleSections.map((section, index) =>
              section.isHeading ? (
                <div
                  key={index}
                  style={{
                    display: "block",
                    width: "fit-content",
                    border: "1.5px solid #c0392b",
                    color: "#c0392b",
                    fontWeight: "900",
                    textTransform: "uppercase",
                    fontSize: bodyFont,
                    letterSpacing: "0.5px",
                    padding: "3px 28px 3px 10px",
                    margin: "4px 0 8px 0",
                    position: "relative",
                  }}
                >
                  {section.title}
                  <span
                    style={{
                      position: "absolute",
                      right: "6px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "11px",
                    }}
                  >
                    ▶
                  </span>
                </div>
              ) : (
                <p
                  key={index}
                  style={{
                    marginBottom: "10px",
                    color:
                      section.title.toLowerCase() === "impression"
                        ? "#111"
                        : section.highlight
                        ? "#c0392b"
                        : "#111",
                    fontWeight: section.highlight ? "bold" : "normal",
                  }}
                >
                  <strong>{section.title}:- </strong>
                  <span
                    style={{ whiteSpace: "pre-line" }}
                    dangerouslySetInnerHTML={{
                      __html: section.content
                        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                        .replace(/\*(.*?)\*/g, "<em>$1</em>")
                    }}
                  />
                </p>
              )
            )}
          </div>

          {/* Images 5-6 */}
          {bottomImages.length > 0 && (
            <div
              style={{
                flexShrink: 0,
                display: "flex",
                gap: "8px",
                marginTop: "auto",
                marginBottom: "16px",
                height: "150px",
              }}
            >
              {bottomImages.map((img, idx) => (
                <div
                  key={img.id}
                  style={{
                    flex: "0 0 calc(50% - 4px)",
                    maxWidth: "calc(50% - 4px)",
                    position: "relative",
                    overflow: "hidden",
                    marginLeft: bottomImages.length === 1 && idx === 0 ? "auto" : undefined,
                  }}
                >
                  <img
                    src={img.url}
                    alt={img.label}
                    data-brightness={img.brightness ?? 100}
                    data-contrast={img.contrast ?? 100}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                      filter: filterFor(img),
                    }}
                  />
                  <NbiLabel label={img.nbiLabel} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT: images 1-4 ─────────────────────────────────────── */}
        {rightImages.length > 0 && (
          <div
            style={{
              flex: "0 0 40%",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              overflow: "hidden",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                flexShrink: 0,
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                marginBottom: "8px",
                paddingBottom: "6px",
                borderBottom: "1.5px solid #ddd",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "15px",
                  fontWeight: "700",
                  border: "1px solid #999",
                  padding: "2px 10px",
                }}
              >
                {formatDate(reportDate)}
              </p>
            </div>

            {rightImages.map((img) => (
              <div
                key={img.id}
                style={{
                  flex: 1,
                  minHeight: 0,
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <img
                  src={img.url}
                  alt={img.label}
                  data-brightness={img.brightness ?? 100}
                  data-contrast={img.contrast ?? 100}
                  style={{
                    width: "80%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    filter: filterFor(img),
                  }}
                />
                <NbiLabel label={img.nbiLabel} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      {/*
        Doctor columns are now generated from footerDoctors (driven by the
        multi-select in ReportForm). The exact same markup/styles as before
        are reused per-doctor, so visual output is unchanged whether there
        are 1, 2, or more doctors selected.
      */}
      <div
        style={{
          flexShrink: 0,
          padding: "8px 20px",
          borderTop: "1px solid #ccc",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* LEFT: Doctors */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            fontSize: "11.5px",
            lineHeight: 1.3,
          }}
        >
          {footerDoctors.map((doc) => (
            <div key={doc.id}>
              <p style={{ margin: 0, fontWeight: "600" }}>{doc.name}</p>
              {doc.qualifications && (
                <p style={{ margin: 0 }}>{doc.qualifications}</p>
              )}
              {doc.designation && (
                <p style={{ margin: 0 }}>{doc.designation}</p>
              )}
            </div>
          ))}
        </div>

        {/* RIGHT: WEO */}
        <div style={{ textAlign: "right" }}>
          <img
            src="/images/weo.png"
            alt="WEO"
            style={{ height: "32px", display: "block", marginLeft: "auto" }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <p
            style={{
              fontSize: "10px",
              color: "#2a7a2a",
              margin: "2px 0 0 0",
              fontWeight: "600",
            }}
          >
            Recognized by World Endoscopy Organization
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportPreview;