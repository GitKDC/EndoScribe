import React from "react";

interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ children, style }) => {
  return (
    <div style={{
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
      border: "1px solid #e2e8f0",
      ...style
    }}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => {
  return (
    <div style={{
      padding: "20px 24px",
      borderBottom: "1px solid #e2e8f0",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      ...style
    }}>
      {children}
    </div>
  );
};

export const CardBody: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => {
  return (
    <div style={{
      padding: "24px",
      ...style
    }}>
      {children}
    </div>
  );
};
