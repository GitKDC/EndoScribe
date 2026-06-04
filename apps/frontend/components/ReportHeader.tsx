import React from "react";

interface ReportHeaderProps {
  hospitalName?: string;
  address?: string;
  phone?: string;
  logo?: string;
}

export const ReportHeader: React.FC<ReportHeaderProps> = ({
  hospitalName = "Shobha Hospital & Superspeciality Gastroenterology Centre",
  address = "Dr. Hrushikesh Chaudhari, DNB. (Gastro)",
  phone = "(08312) 2251535, 2251488",
  logo = "🏥",
}) => {
  return (
    <div
      style={{
        backgroundColor: "#1a3a52",
        color: "white",
        padding: "20px 30px",
        marginBottom: 0,
        borderBottom: "6px solid #9fce38",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
        <div style={{ fontSize: 40 }}>{logo}</div>
        <div>
          <h2 style={{ margin: "0 0 5px 0", fontSize: 18, fontWeight: "bold" }}>
            {hospitalName}
          </h2>
          <p style={{ margin: "2px 0", fontSize: 12 }}>{address}</p>
          <p style={{ margin: "2px 0", fontSize: 12 }}>📞 {phone}</p>
        </div>
      </div>
      <div style={{ textAlign: "right", fontSize: 12 }}>
        <p style={{ margin: 0 }}>Recognized by World Endoscopy Organization</p>
      </div>
    </div>
  );
};

export default ReportHeader;