"use client";
import React, { useEffect, useState } from "react";
import { FiClock } from "react-icons/fi";

export default function Header() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = time ? time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : "";
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: "short", day: "numeric", month: "short", year: "numeric" };
  const dateStr = time ? time.toLocaleDateString("en-US", dateOptions) : "";

  return (
    <div style={{
      padding: "16px 24px",
      background: "#1a3a52", // THEME.navy
      color: "#ffffff",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontFamily: "'Inter', sans-serif",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      zIndex: 10
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <span style={{ fontSize: "16px", fontWeight: "700", letterSpacing: "0.5px" }}>
          EndoScribe
        </span>
        {time && (
          <span style={{ 
            fontSize: "12px", 
            fontWeight: "600", 
            color: "#ccfbf1", // THEME.tealLight
            background: "rgba(13,148,136,0.2)",
            padding: "4px 10px",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}>
            <FiClock /> {timeStr} | {dateStr}
          </span>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{ 
          width: "32px", height: "32px", borderRadius: "50%", 
          background: "#0d9488", display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: "700", fontSize: "14px"
        }}>
          HC
        </span>
        <span style={{ fontSize: "14px", fontWeight: "600" }}>
          Dr. Hrushikesh Chaudhari
        </span>
      </div>
    </div>
  );
}