"use client";
import { useEffect, useState } from "react";

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    // TODO: fetch from DB
  }, []);

  return (
    <div>
      <h2>Patient Reports</h2>

      <input placeholder="Search patient..." />

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => (
            <tr key={r.id}>
              <td>{r.patient_name}</td>
              <td>{r.date}</td>
              <td>{r.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}