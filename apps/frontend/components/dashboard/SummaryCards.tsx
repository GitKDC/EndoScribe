"use client";
import { useEffect, useState } from "react";

export default function SummaryCards() {
  const [stats, setStats] = useState({
    reports: 0,
    templates: 0,
  });

  useEffect(() => {
    const load = async () => {
      const templates = await window.api.getTemplates();
      setStats({
        reports: 0, // later from DB
        templates: templates.length,
      });
    };
    load();
  }, []);

  return (
    <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
      <Card title="Total Reports" value={stats.reports} />
      <Card title="Templates" value={stats.templates} />
    </div>
  );
}

function Card({ title, value }: any) {
  return (
    <div style={{
      padding: "20px",
      border: "1px solid #ddd",
      borderRadius: "10px",
      minWidth: "150px"
    }}>
      <div>{title}</div>
      <h2>{value}</h2>
    </div>
  );
}