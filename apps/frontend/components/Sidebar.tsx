"use client";
import { useRouter, usePathname } from "next/navigation";

import { 
  FiHome, 
  FiEdit, 
  FiUsers, 
  FiHeart, 
  FiFileText, 
  FiFolder, 
  FiActivity 
} from "react-icons/fi";

const NAV = [
  { name: "Dashboard",   path: "/",               icon: <FiHome /> },
  { name: "New Report",  path: "/create-report",  icon: <FiEdit /> },
  { name: "Patients",    path: "/patients",       icon: <FiUsers /> },
  { name: "Referrals",   path: "/referrals",      icon: <FiHeart /> },
  { name: "Reports",     path: "/reports",         icon: <FiFileText /> },
  { name: "Templates",   path: "/templates",       icon: <FiFolder /> },
  { name: "Analytics",   path: "/analytics",       icon: <FiActivity /> },
];

export default function Sidebar() {
  const router   = useRouter();
  const pathname = usePathname();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .sidebar-nav-item { transition: background 0.18s, color 0.18s, padding-left 0.18s; }
        .sidebar-nav-item:hover { background: rgba(255,255,255,0.10) !important; padding-left: 20px !important; }
      `}</style>

      <div style={{
        width: "240px",
        minWidth: "240px",
        height: "100vh",
        background: "linear-gradient(180deg, #0f2a3f 0%, #1a3a52 60%, #1e4a66 100%)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Inter', sans-serif",
        boxShadow: "4px 0 20px rgba(0,0,0,0.25)",
        zIndex: 100,
      }}>

        {/* ── Logo + Hospital Name ─────────────────────────────── */}
        <div style={{
          padding: "20px 18px 18px 18px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}>
          <img
            src="/images/logo.png"
            alt="Shobha Hospital Logo"
            style={{ width: "44px", height: "44px", objectFit: "contain", flexShrink: 0 }}
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.style.display = "none";
              (img.nextElementSibling as HTMLElement).style.display = "flex";
            }}
          />
          {/* Fallback circle if logo missing */}
          <div style={{
            display: "none",
            width: "44px", height: "44px", borderRadius: "50%",
            background: "linear-gradient(135deg, #0d9488, #2a7a2a)",
            alignItems: "center", justifyContent: "center",
            fontSize: "20px", flexShrink: 0,
          }}><FiHeart size={22} color="#fff" /></div>

          <div>
            <div style={{ fontSize: "16px", fontWeight: "700", lineHeight: 1.2, color: "#e0f2fe", letterSpacing: "0.2px" }}>
              Shobha Hospital
            </div>
            <div style={{ fontSize: "13px", color: "#7dd3fc", lineHeight: 1.3, marginTop: "2px" }}>
              & Superspeciality Gastroenterology Centre
            </div>
          </div>
        </div>

        <div style={{ marginTop: "16px" }} />

        {/* ── Navigation ──────────────────────────────────────── */}
        <nav style={{ flex: 1, padding: "0 10px" }}>
          {NAV.map((item) => {
            const active = pathname === item.path;
            return (
              <div
                key={item.path}
                className="sidebar-nav-item"
                onClick={() => router.push(item.path)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "11px 14px",
                  borderRadius: "8px",
                  marginBottom: "4px",
                  cursor: "pointer",
                  background: active
                    ? "linear-gradient(90deg, rgba(13,148,136,0.35), rgba(13,148,136,0.15))"
                    : "transparent",
                  borderLeft: active ? "3px solid #0d9488" : "3px solid transparent",
                  fontWeight: active ? "600" : "400",
                  fontSize: "14px",
                  color: active ? "#ffffff" : "rgba(255,255,255,0.72)",
                  letterSpacing: "0.1px",
                }}
              >
                <span style={{ fontSize: "16px", width: "20px", textAlign: "center" }}>
                  {item.icon}
                </span>
                {item.name}
              </div>
            );
          })}
        </nav>

        {/* ── Footer ──────────────────────────────────────────── */}
        <div style={{
          padding: "14px 18px",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          fontSize: "11px",
          color: "rgba(255, 255, 255, 0.91)",
          lineHeight: 1.5,
        }}>
          <div style={{ fontWeight: "600", color: "rgba(255, 255, 255, 0.87)", marginBottom: "2px" }}>
            Dr Hrushikesh P. Chaudhari
          </div>
          Consultant Gastroenterologist
        </div>
      </div>
    </>
  );
}