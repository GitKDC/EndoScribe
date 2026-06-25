const db = require("../db/db");

const getAnalytics = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const get = (sql, params = []) => new Promise((res, rej) => db.get(sql, params, (e, row) => e ? rej(e) : res(row)));
      const query = (sql, params = []) => new Promise((res, rej) => db.all(sql, params, (e, rows) => e ? rej(e) : res(rows)));

      const today = new Date().toISOString().split("T")[0];
      const monthStart = today.slice(0, 7) + "-01";

      const [
        totalRes, todayRes, monthRes, patientsRes,
        dayTrend, typeBreakdown, dowData,
        cityData, allReports
      ] = await Promise.all([
        get("SELECT COUNT(*) as cnt FROM reports"),
        get("SELECT COUNT(*) as cnt FROM reports WHERE date(created_at) = date('now', 'localtime')"),
        get("SELECT COUNT(*) as cnt FROM reports WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now', 'localtime')"),
        get("SELECT COUNT(*) as cnt FROM patients"),
        query(`SELECT date(created_at) as date, COUNT(*) as count FROM reports WHERE created_at >= date('now', '-30 days') GROUP BY date(created_at) ORDER BY date`),
        query(`SELECT report_type as name, COUNT(*) as value FROM reports GROUP BY report_type`),
        query(`SELECT cast(strftime('%w', created_at) as integer) as day, COUNT(*) as count FROM reports GROUP BY day`),
        query(`SELECT rd.city, COUNT(r.id) as value FROM reports r JOIN referral_doctors rd ON r.referral_doctor_id = rd.id WHERE rd.city IS NOT NULL AND rd.city != '' GROUP BY rd.city ORDER BY value DESC`),
        query(`SELECT age, sections, report_type FROM reports`)
      ]);

      // Fill last 30 days missing with 0
      const last30 = Array.from({ length: 30 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (29 - i));
        return d.toISOString().split("T")[0];
      });
      const dayMap = {};
      dayTrend.forEach(r => dayMap[r.date] = r.count);
      const reportsByDay = last30.map(date => ({ date, count: dayMap[date] || 0 }));

      // Map day of week (0 = Sunday, 1 = Monday)
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const reportsByDayOfWeek = days.map((day, i) => {
        const found = dowData.find(d => d.day === i);
        return { name: day, count: found ? found.count : 0 };
      });

      // Advanced Analytics via Node.js parsing (safer than SQLite JSON/LIKE combinations)
      const keywords = ["Polyp", "Colitis", "Carcinoma", "Bleeding", "Ulcer", "Erythema", "Gastritis"];
      const keywordCounts = {};
      keywords.forEach(k => keywordCounts[k] = 0);

      let ercpCount = 0;
      let enteroscopyCount = 0;

      const ageGroups = {
        "0-20": { total: 0, conditions: {} },
        "21-40": { total: 0, conditions: {} },
        "41-60": { total: 0, conditions: {} },
        "61+": { total: 0, conditions: {} }
      };

      allReports.forEach(row => {
        const text = (row.sections || "").toLowerCase() + " " + (row.report_type || "").toLowerCase();
        
        // Count top impressions
        keywords.forEach(k => {
          if (text.includes(k.toLowerCase())) {
            keywordCounts[k]++;
            
            // Correlate with age
            if (row.age) {
              let group = "61+";
              if (row.age <= 20) group = "0-20";
              else if (row.age <= 40) group = "21-40";
              else if (row.age <= 60) group = "41-60";

              if (!ageGroups[group].conditions[k]) ageGroups[group].conditions[k] = 0;
              ageGroups[group].conditions[k]++;
            }
          }
        });

        if (row.age) {
          let group = "61+";
          if (row.age <= 20) group = "0-20";
          else if (row.age <= 40) group = "21-40";
          else if (row.age <= 60) group = "41-60";
          ageGroups[group].total++;
        }

        if (text.includes("ercp")) ercpCount++;
        if (text.includes("enteroscopy")) enteroscopyCount++;
      });

      const topImpressions = Object.keys(keywordCounts)
        .map(k => ({ name: k, value: keywordCounts[k] }))
        .sort((a, b) => b.value - a.value);

      resolve({
        totalReports: totalRes?.cnt || 0,
        todayReports: todayRes?.cnt || 0,
        monthReports: monthRes?.cnt || 0,
        totalPatients: patientsRes?.cnt || 0,
        reportsByDay,
        reportsByType: typeBreakdown,
        reportsByDayOfWeek,
        reportsByCity: cityData.map(c => ({ name: c.city, value: c.value })),
        topImpressions,
        specialProcedures: { ercp: ercpCount, enteroscopy: enteroscopyCount },
        ageAnalytics: ageGroups
      });

    } catch (err) {
      console.error("❌ Analytics error:", err);
      reject(err);
    }
  });
};

module.exports = { getAnalytics };
