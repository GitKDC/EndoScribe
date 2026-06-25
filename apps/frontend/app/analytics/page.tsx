"use client";
import React, { useEffect, useState } from "react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from "recharts";
import { FiActivity, FiPieChart, FiBarChart2, FiCalendar, FiUsers, FiMapPin, FiHeart } from "react-icons/fi";

const THEME = {
  navy:    "#1a3a52",
  navyDark:"#0f2a3f",
  teal:    "#0d9488",
  tealLight:"#ccfbf1",
  tealBg:  "#f0fdfa",
  bg:      "#f0f4f8",
  border:  "#e2e8f0",
  text:    "#1e293b",
  muted:   "#64748b",
};

const COLORS = ["#0d9488", "#2563eb", "#ea580c", "#7c3aed", "#b45309", "#dc2626"];

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if ((window as any).api) {
      (window as any).api.getAnalytics()
        .then((res: any) => {
          setData(res);
          setLoading(false);
        })
        .catch(console.error);
    }
  }, []);

  if (loading) {
    return <div style={{ padding: "40px", fontFamily: "Inter", color: THEME.navy }}>Loading Analytics Engine...</div>;
  }

  const cardStyle = {
    background: "#fff",
    border: `1px solid ${THEME.border}`,
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
  };

  const titleStyle = {
    margin: "0 0 20px 0",
    fontSize: "16px",
    fontWeight: "700",
    color: THEME.navy,
    display: "flex",
    alignItems: "center",
    gap: "8px"
  };

  return (
    <div style={{ padding: "32px 40px", background: THEME.bg, minHeight: "100%", fontFamily: "'Inter', sans-serif" }}>
      
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ margin: 0, fontSize: "28px", fontWeight: "800", color: THEME.navyDark }}>
          Advanced Clinical Analytics
        </h1>
        <p style={{ margin: "6px 0 0", color: THEME.muted, fontSize: "14.5px" }}>
          AI-driven insights extracted directly from your endoscopy reports database.
        </p>
      </div>

      {/* Basic Metrics Overview */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "24px" }}>
        {[
          { label: "Reports This Month", val: data.monthReports, icon: <FiActivity /> },
          { label: "Today's Reports", val: data.todayReports, icon: <FiCalendar /> },
          { label: "Total Reports Generated", val: data.totalReports, icon: <FiBarChart2 /> },
          { label: "Total Patients Treated", val: data.totalPatients, icon: <FiUsers /> },
        ].map((m, i) => (
          <div key={i} style={{ ...cardStyle, padding: "20px", display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: THEME.tealLight, color: THEME.teal, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
              {m.icon}
            </div>
            <div>
              <div style={{ fontSize: "24px", fontWeight: "800", color: THEME.navyDark }}>{m.val}</div>
              <div style={{ fontSize: "12.5px", color: THEME.muted, fontWeight: "600" }}>{m.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Top Row: Trend & Procedures */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px", marginBottom: "24px" }}>
        <div style={cardStyle}>
          <h2 style={titleStyle}><FiActivity /> 30-Day Report Trend</h2>
          <div style={{ height: "300px", width: "100%" }}>
            <ResponsiveContainer>
              <LineChart data={data.reportsByDay}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{fontSize: 12, fill: THEME.muted}} tickFormatter={(t) => t.slice(5)} />
                <YAxis allowDecimals={false} tick={{fontSize: 12, fill: THEME.muted}} />
                <RechartsTooltip contentStyle={{borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)"}} />
                <Line type="monotone" dataKey="count" stroke={THEME.teal} strokeWidth={3} dot={{r: 4, fill: THEME.teal}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={cardStyle}>
          <h2 style={titleStyle}><FiPieChart /> Procedure Breakdown</h2>
          <div style={{ height: "300px", width: "100%" }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={data.reportsByType} innerRadius={70} outerRadius={100} paddingAngle={4} dataKey="value">
                  {data.reportsByType.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)"}} />
                <Legend iconType="circle" wrapperStyle={{fontSize: "13px"}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Middle Row: Day of Week & Diagnoses */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
        <div style={cardStyle}>
          <h2 style={titleStyle}><FiCalendar /> Reports by Day of Week</h2>
          <div style={{ height: "260px", width: "100%" }}>
            <ResponsiveContainer>
              <BarChart data={data.reportsByDayOfWeek}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{fontSize: 12, fill: THEME.muted}} />
                <YAxis allowDecimals={false} tick={{fontSize: 12, fill: THEME.muted}} />
                <RechartsTooltip cursor={{fill: "#f8fafc"}} contentStyle={{borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)"}} />
                <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={cardStyle}>
          <h2 style={titleStyle}><FiBarChart2 /> Top Clinical Impressions</h2>
          <div style={{ height: "260px", width: "100%" }}>
            <ResponsiveContainer>
              <BarChart data={data.topImpressions} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" allowDecimals={false} tick={{fontSize: 12, fill: THEME.muted}} />
                <YAxis type="category" dataKey="name" tick={{fontSize: 12, fill: THEME.navy, fontWeight: "600"}} width={80} />
                <RechartsTooltip cursor={{fill: "#f8fafc"}} contentStyle={{borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)"}} />
                <Bar dataKey="value" fill="#ea580c" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Advanced Analytics Section */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px", paddingBottom: "40px" }}>
        
        {/* Age vs Conditions */}
        <div style={cardStyle}>
          <h2 style={titleStyle}><FiHeart /> Conditions by Age Demographic</h2>
          <p style={{ fontSize: "13px", color: THEME.muted, marginBottom: "20px" }}>
            A text-based NLP analysis extracting conditions directly from patient reports grouped by their age bracket.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
            {Object.keys(data.ageAnalytics).map((ageGroup) => (
              <div key={ageGroup} style={{ background: THEME.bg, padding: "16px", borderRadius: "10px", border: `1px solid ${THEME.border}` }}>
                <div style={{ fontSize: "13px", fontWeight: "700", color: THEME.navy, marginBottom: "12px", borderBottom: `1px solid ${THEME.border}`, paddingBottom: "8px" }}>
                  Age {ageGroup} <span style={{ color: THEME.muted, fontWeight: "500", fontSize: "11px", float: "right" }}>{data.ageAnalytics[ageGroup].total} patients</span>
                </div>
                {Object.keys(data.ageAnalytics[ageGroup].conditions).length === 0 ? (
                  <div style={{ fontSize: "12px", color: THEME.muted }}>No critical conditions detected.</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {Object.entries(data.ageAnalytics[ageGroup].conditions)
                      .sort((a: any, b: any) => b[1] - a[1])
                      .slice(0, 4)
                      .map(([condition, count]: any) => (
                      <div key={condition} style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px" }}>
                        <span style={{ color: THEME.text, fontWeight: "600" }}>{condition}</span>
                        <span style={{ color: THEME.teal, fontWeight: "700", background: THEME.tealLight, padding: "1px 6px", borderRadius: "10px" }}>{count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Special Procedures & Cities */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          <div style={cardStyle}>
            <h2 style={titleStyle}><FiActivity /> Special Procedures</h2>
            <div style={{ display: "flex", gap: "16px" }}>
              <div style={{ flex: 1, background: THEME.bg, padding: "16px", borderRadius: "8px", textAlign: "center" }}>
                <div style={{ fontSize: "28px", fontWeight: "800", color: "#7c3aed" }}>{data.specialProcedures.ercp}</div>
                <div style={{ fontSize: "12px", fontWeight: "600", color: THEME.muted, marginTop: "4px" }}>ERCPs</div>
              </div>
              <div style={{ flex: 1, background: THEME.bg, padding: "16px", borderRadius: "8px", textAlign: "center" }}>
                <div style={{ fontSize: "28px", fontWeight: "800", color: "#b45309" }}>{data.specialProcedures.enteroscopy}</div>
                <div style={{ fontSize: "12px", fontWeight: "600", color: THEME.muted, marginTop: "4px" }}>Enteroscopies</div>
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <h2 style={titleStyle}><FiMapPin /> Patient Demographics (City)</h2>
            {data.reportsByCity.length === 0 ? (
              <div style={{ fontSize: "13px", color: THEME.muted }}>No city data found from referral doctors.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {data.reportsByCity.slice(0, 5).map((city: any, i: number) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: THEME.text }}>{city.name}</span>
                    <span style={{ fontSize: "13px", fontWeight: "700", color: THEME.navy }}>{city.value} referrals</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}