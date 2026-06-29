import React from "react";

interface TableProps {
  headers: string[];
  children: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({ headers, children }) => {
  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #e2e8f0", backgroundColor: "#f8fafc" }}>
            {headers.map((header, index) => (
              <th key={index} style={{ padding: "16px 24px", color: "#475569", fontWeight: "600", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {children}
        </tbody>
      </table>
    </div>
  );
};

export const TableRow: React.FC<{ children: React.ReactNode; onClick?: () => void; style?: React.CSSProperties }> = ({ children, onClick, style }) => {
  return (
    <tr 
      onClick={onClick}
      style={{ 
        borderBottom: "1px solid #e2e8f0", 
        cursor: onClick ? "pointer" : "default",
        transition: "background-color 0.2s",
        ...style
      }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = onClick ? "#f1f5f9" : "transparent"}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
    >
      {children}
    </tr>
  );
};

export const TableCell: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; colSpan?: number }> = ({ children, style, colSpan }) => {
  return (
    <td colSpan={colSpan} style={{ padding: "16px 24px", fontSize: "14px", color: "#334155", ...style }}>
      {children}
    </td>
  );
};
