import React from "react";

interface ReportFooterProps {
  hospitalName?: string;
  recognizedBy?: string;
}

export const ReportFooter: React.FC<ReportFooterProps> = ({
  hospitalName = "Shobha Hospital & Superspeciality Gastroenterology Centre",
  recognizedBy = "Recognized by World Endoscopy Organization",
}) => {
  return (
    <div
      style={{
        backgroundColor: "#f5f5f5",
        padding: "20px 30px",
        marginTop: 0,
        borderTop: "3px solid #9fce38",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: 12,
      }}
    >
      <div>
        <p style={{ margin: "5px 0", color: "#666", fontWeight: "bold" }}>🏥 {hospitalName}</p>
      </div>
      <div style={{ textAlign: "right", color: "#28a745", fontWeight: "bold" }}>
        <p style={{ margin: 0 }}>✓ {recognizedBy}</p>
      </div>
    </div>
  );
};

export default ReportFooter;