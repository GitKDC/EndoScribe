import React from "react";

interface ImageData {
  id: string;
  url: string;
  label: string;
  nbiLabel?: string;
}

interface ReportPreviewProps {
  patientName: string;
  patientAge: string;
  reportDate: string;
  reportType: string;
  esophagus: string;
  stomach: string;
  duodenum: string;
  impression: string;
  doctorName: string;
  images: ImageData[];
}

const ReportPreview: React.FC<ReportPreviewProps> = ({
  patientName,
  patientAge,
  reportDate,
  reportType,
  esophagus,
  stomach,
  duodenum,
  impression,
  doctorName,
  images,
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

  const totalLen =
    (esophagus?.length  || 0) +
    (stomach?.length    || 0) +
    (duodenum?.length   || 0) +
    (impression?.length || 0);

  const bodyFont = totalLen > 700 ? "13px" : totalLen > 450 ? "14px" : "15px";
  const lineH    = totalLen > 700 ? 1.4   : totalLen > 450 ? 1.45  : 1.5;
  const paraGap  = totalLen > 700 ? "8px" : "11px";

  // Images 1-4 → right column stacked
  // Images 5-6 → below text in left column (same layout as reference image 2)
  const rightImages  = images.slice(0, 4);
  const bottomImages = images.slice(4, 6);

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
      {/*
        The entire body is ONE flex row: left column + right column.
        Left column holds: patient row, title, clinical text, bottom images.
        Right column holds: images 1-4, starting from the very top (level with date).
        This lets the right images reach all the way up to the date line.
      */}
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
                ? `${patientName}${patientAge ? `  ${patientAge}` : ""}`
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
              {reportType || "UPPER GI ENDOSCOPY"}
            </h2>
          </div>

          {/* Clinical text */}
          <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
            {esophagus && (
              <p style={{ margin: `0 0 ${paraGap} 0` }}>
                <strong>Esophagus:-</strong> {esophagus}
              </p>
            )}
            {stomach && (
              <p style={{ margin: `0 0 ${paraGap} 0` }}>
                <strong>Stomach:-</strong> {stomach}
              </p>
            )}
            {duodenum && (
              <>
                <p style={{ margin: `0 0 ${paraGap} 0` }}>
                  <strong>Duodenal Cap:-</strong> {duodenum}
                </p>
                <p style={{ margin: `0 0 ${paraGap} 0` }}>
                  <strong>II<sup>nd</sup> Part of Duodenum:-</strong> {duodenum}
                </p>
              </>
            )}
            {impression && (
              <div style={{ marginTop: "12px" }}>
                <p style={{ margin: "0 0 5px 0", fontWeight: "bold" }}>
                  Impression:-
                </p>
                <p style={{ margin: 0, fontWeight: "bold", whiteSpace: "pre-line" }}>
                  {impression}
                </p>
              </div>
            )}
          </div>

          {/* Images 5-6: side by side below text */}
          {bottomImages.length > 0 && (
            <div
              style={{
                flexShrink: 0,
                display: "flex",
                gap: "8px",
                marginTop: "10px",
                height: "155px",
                marginBottom: "20px",
              }}
            >
              {bottomImages.map((img) => (
                <div
                  key={img.id}
                  style={{
                    flex: 1,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={img.url}
                    alt={img.label}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                  <NbiLabel label={img.nbiLabel} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT: images 1-4 — starts from top of body, level with date ── */}
        {rightImages.length > 0 && (
          <div
            style={{
              flex: "0 0 40%",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              overflow: "hidden",
              marginBottom: "40px"
            }}
          >
            {/* Date shown at top of right column, aligned with left's patient row */}
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

            {/* Images fill remaining right column height */}
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
                  style={{
                    width: "80%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                <NbiLabel label={img.nbiLabel} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <div
        style={{
          flexShrink: 0,
          padding: "10px 24px",
          borderTop: "1.5px solid #ccc",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <p style={{ margin: 0, fontSize: "13px", fontWeight: "bold" }}>
            {doctorName || "Dr Hrushikesh P. Chaudhari"}
          </p>
          <p style={{ margin: "2px 0 0 0", fontSize: "13px", fontWeight: "bold" }}>
            DNB (Gen. Med.), DNB (Gastro.)
          </p>
          <p style={{ margin: "2px 0 0 0", fontSize: "13px", fontWeight: "bold" }}>
            Consultant Gastroenterologist &amp; Therapeutic Endoscopist
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <img
            src="/images/weo.png"
            alt="WEO"
            style={{ height: "38px", display: "block", marginLeft: "auto" }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <p style={{ fontSize: "11px", color: "#2a7a2a", margin: "3px 0 0 0", fontWeight: "600" }}>
            Recognized by World Endoscopy Organization
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportPreview;