"use client";

import React, { useEffect, useState } from "react";
import { FiSearch, FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { Card } from "@/components/ui/Card";
import { Table, TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { format } from "date-fns";
import ReferralForm from "../../components/ReferralForm";
import GoogleSyncModal from "../../components/GoogleSyncModal";
import { FiRefreshCw } from "react-icons/fi";

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
  const [showSyncModal, setShowSyncModal] = useState(false);
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
        <div style={{ display: "flex", gap: "12px" }}>
          <Button 
            variant="secondary"
            icon={<FiRefreshCw />}
            onClick={() => setShowSyncModal(true)}
          >
            Sync Google Contacts
          </Button>
          <Button 
            icon={<FiPlus />}
            onClick={() => { setEditReferral(null); setShowForm(true); }}
          >
            Add Doctor
          </Button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div style={{ 
        display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap",
        background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.03)", marginBottom: "24px"
      }}>
        <div style={{ position: "relative", flex: 1, minWidth: "250px" }}>
          <FiSearch style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} size={18} />
          <input 
            type="text" 
            placeholder="Search by name, clinic, or phone..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%", padding: "10px 14px 10px 40px",
              border: "1px solid #ccc", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box"
            }} 
          />
        </div>
      </div>

      {/* TABLE */}
      <Card style={{ overflowX: "auto" }}>
        <Table headers={["Name", "Phone", "Clinic/Hospital", "City", "Referrals", "Actions"]}>
            {loading ? (
              <TableRow><TableCell colSpan={6} style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>Loading doctors...</TableCell></TableRow>
            ) : referrals.length === 0 ? (
              <TableRow><TableCell colSpan={6} style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>No referral doctors found</TableCell></TableRow>
            ) : (
              referrals.map(r => (
                <TableRow key={r.id}>
                  <TableCell style={{ fontWeight: "600", color: "#1e293b" }}>{r.name}</TableCell>
                  <TableCell>{r.phone || "-"}</TableCell>
                  <TableCell>{r.clinic_name || "-"}</TableCell>
                  <TableCell>{r.city || "-"}</TableCell>
                  <TableCell style={{ fontWeight: "600", color: "#0d9488" }}>{r.referred_count || 0}</TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    <div style={{ display: "flex", gap: "8px", marginLeft: "-8px" }}>
                      <Button 
                        variant="icon" size="sm" icon={<FiEdit2 size={16} />}
                        onClick={() => { setEditReferral(r); setShowForm(true); }}
                      />
                      <Button 
                        variant="icon-danger" size="sm" icon={<FiTrash2 size={16} />}
                        onClick={async () => {
                          if (confirm("Delete this doctor?")) {
                            await (window as any).api.deleteReferral(r.id);
                            fetchReferrals();
                          }
                        }}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
        </Table>
      </Card>

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
          onSave={() => {
            setShowForm(false);
            fetchReferrals();
          }} 
        />
      )}

      {showSyncModal && (
        <GoogleSyncModal
          onClose={() => setShowSyncModal(false)}
          onSuccess={() => fetchReferrals()}
        />
      )}
    </div>
  );
}
