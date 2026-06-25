"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import ReferralForm from "../../components/ReferralForm";

export default function ReferralsPage() {
  const [referrals, setReferrals] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;
  const totalPages = Math.ceil(total / limit) || 1;

  // Modals state
  const [showForm, setShowForm] = useState(false);
  const [editReferral, setEditReferral] = useState<any>(null);

  const fetchReferrals = async () => {
    if (!(window as any).api) return;
    setLoading(true);
    try {
      const res = await (window as any).api.getReferrals({ search, page, limit });
      if (Array.isArray(res)) {
        setReferrals(res);
        setTotal(res.length);
      } else {
        setReferrals(res.data || []);
        setTotal(res.total || 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    const t = setTimeout(() => {
      fetchReferrals();
    }, 300);
    return () => clearTimeout(t);
  }, [search, page]);

  return (
    <div style={{ padding: "32px", fontFamily: "'Inter', sans-serif", backgroundColor: "#f4f7f6", minHeight: "100vh", position: "relative" }}>
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h2 style={{ color: "#1a3a52", fontSize: "28px", fontWeight: "800", margin: 0 }}>Referral Doctors</h2>
          <p style={{ color: "#64748b", margin: "4px 0 0 0", fontSize: "14px" }}>Manage referral doctors for automated WhatsApp messaging</p>
        </div>
        <button 
          onClick={() => { setEditReferral(null); setShowForm(true); }}
          style={{
            padding: "10px 20px", background: "#0d9488", color: "white",
            border: "none", borderRadius: "8px", cursor: "pointer",
            fontWeight: "600", fontSize: "14px", transition: "transform 0.1s"
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >
          + Add Doctor
        </button>
      </div>

      {/* FILTER BAR */}
      <div style={{ 
        display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap",
        background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.03)", marginBottom: "24px"
      }}>
        <input 
          type="text" 
          placeholder="🔍 Search by name, clinic, or phone..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1, minWidth: "250px", padding: "10px 14px",
            border: "1px solid #ccc", borderRadius: "8px", fontSize: "14px", outline: "none"
          }} 
        />
      </div>

      {/* TABLE */}
      <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.03)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
              <th style={{ padding: "16px 24px", color: "#475569", fontSize: "12px", fontWeight: "700", textTransform: "uppercase" }}>Name</th>
              <th style={{ padding: "16px 24px", color: "#475569", fontSize: "12px", fontWeight: "700", textTransform: "uppercase" }}>Phone</th>
              <th style={{ padding: "16px 24px", color: "#475569", fontSize: "12px", fontWeight: "700", textTransform: "uppercase" }}>Clinic/Hospital</th>
              <th style={{ padding: "16px 24px", color: "#475569", fontSize: "12px", fontWeight: "700", textTransform: "uppercase" }}>City</th>
              <th style={{ padding: "16px 24px", color: "#475569", fontSize: "12px", fontWeight: "700", textTransform: "uppercase" }}>Referrals</th>
              <th style={{ padding: "16px 24px", color: "#475569", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>Loading doctors...</td></tr>
            ) : referrals.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>No referral doctors found</td></tr>
            ) : (
              referrals.map(r => (
                <tr key={r.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "16px 24px", fontWeight: "600", color: "#1e293b" }}>{r.name}</td>
                  <td style={{ padding: "16px 24px", color: "#64748b" }}>{r.phone || "-"}</td>
                  <td style={{ padding: "16px 24px", color: "#64748b" }}>{r.clinic_name || "-"}</td>
                  <td style={{ padding: "16px 24px", color: "#64748b" }}>{r.city || "-"}</td>
                  <td style={{ padding: "16px 24px", fontWeight: "600", color: "#0d9488" }}>{r.referred_count || 0}</td>
                  <td style={{ padding: "16px 24px", textAlign: "center", display: "flex", justifyContent: "center", gap: "8px" }}>
                    <button 
                      onClick={() => { setEditReferral(r); setShowForm(true); }}
                      style={{ padding: "6px 12px", fontSize: "12px", fontWeight: "600", cursor: "pointer", background: "white", border: "1px solid #ccc", borderRadius: "6px" }}
                    >Edit</button>
                    <button 
                      onClick={async () => {
                        if (confirm("Delete this doctor?")) {
                          await (window as any).api.deleteReferral(r.id);
                          fetchReferrals();
                        }
                      }}
                      style={{ padding: "6px 12px", fontSize: "12px", fontWeight: "600", cursor: "pointer", background: "#fee2e2", color: "#ef4444", border: "1px solid #fecaca", borderRadius: "6px" }}
                    >Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {!loading && total > 0 && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "24px", background: "white", padding: "16px 24px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
          <span style={{ fontSize: "14px", color: "#64748b", fontWeight: "500" }}>
            Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} doctors
          </span>
          <div style={{ display: "flex", gap: "8px" }}>
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              style={{ padding: "8px 16px", borderRadius: "6px", border: "1px solid #cbd5e1", background: page === 1 ? "#f8fafc" : "white", color: page === 1 ? "#94a3b8" : "#334155", cursor: page === 1 ? "not-allowed" : "pointer", fontWeight: "600", fontSize: "13px" }}
            >
              Previous
            </button>
            <span style={{ display: "flex", alignItems: "center", padding: "0 12px", fontSize: "14px", fontWeight: "600", color: "#334155" }}>
              Page {page} of {totalPages}
            </span>
            <button 
              disabled={page === totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              style={{ padding: "8px 16px", borderRadius: "6px", border: "1px solid #cbd5e1", background: page === totalPages ? "#f8fafc" : "white", color: page === totalPages ? "#94a3b8" : "#334155", cursor: page === totalPages ? "not-allowed" : "pointer", fontWeight: "600", fontSize: "13px" }}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* MODALS */}
      {showForm && (
        <ReferralForm 
          initialData={editReferral} 
          onClose={() => setShowForm(false)} 
          onSave={() => { setShowForm(false); fetchReferrals(); }} 
        />
      )}
    </div>
  );
}
