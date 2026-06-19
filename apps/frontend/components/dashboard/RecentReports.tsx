"use client";
import { useEffect, useState } from "react";

export default function RecentReports() {
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    // TODO: load from DB later
    setReports([]);
  }, []);

  return (
    <div>
      <h3>Recent Reports</h3>

      {reports.length === 0 && <p>No reports yet</p>}
    </div>
  );
}