// ─────────────────────────────────────────────────────────────────────────────
// ANALYTICS REPOSITORY
// ─────────────────────────────────────────────────────────────────────────────

const getAnalytics = (db) => {
  return new Promise((resolve, reject) => {
    const result = {};

    // Helper: run a single query and return rows/row
    const query  = (sql, params = []) =>
      new Promise((res, rej) =>
        db.all(sql, params, (e, rows) => (e ? rej(e) : res(rows)))
      );
    const get    = (sql, params = []) =>
      new Promise((res, rej) =>
        db.get(sql, params, (e, row) => (e ? rej(e) : res(row)))
      );

    const today     = new Date().toISOString().split("T")[0];
    const monthStart = today.slice(0, 7) + "-01";

    // Generate the last 14 calendar dates as YYYY-MM-DD strings
    const last14 = Array.from({ length: 14 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (13 - i));
      return d.toISOString().split("T")[0];
    });

    Promise.all([
      get("SELECT COUNT(*) as cnt FROM reports"),
      get("SELECT COUNT(*) as cnt FROM reports WHERE report_date = ?", [today]),
      get("SELECT COUNT(*) as cnt FROM reports WHERE report_date >= ?", [monthStart]),
      get("SELECT COUNT(DISTINCT patient_name) as cnt FROM reports"),
      query(
        `SELECT report_date as date, COUNT(*) as count
         FROM reports
         WHERE report_date >= date('now','-13 days')
         GROUP BY report_date
         ORDER BY report_date ASC`
      ),
      query(
        `SELECT report_type as type, COUNT(*) as count
         FROM reports
         GROUP BY report_type
         ORDER BY count DESC`
      ),
      query(
        `SELECT t.name, t.category, COUNT(r.id) as used
         FROM templates t
         LEFT JOIN reports r ON r.template_id = t.id
         GROUP BY t.id
         ORDER BY used DESC
         LIMIT 5`
      ),
    ])
      .then(([total, todayRow, monthRow, patients, byDay, byType, topTemplates]) => {
        // Fill missing days with 0
        const dayMap = {};
        byDay.forEach((r) => { dayMap[r.date] = r.count; });
        const reportsByDay = last14.map((date) => ({
          date,
          count: dayMap[date] || 0,
        }));

        resolve({
          totalReports:      total?.cnt      || 0,
          todayReports:      todayRow?.cnt   || 0,
          monthReports:      monthRow?.cnt   || 0,
          totalPatients:     patients?.cnt   || 0,
          reportsByDay,
          reportsByType:     byType,
          mostUsedTemplates: topTemplates,
        });
      })
      .catch((err) => {
        console.error("❌ Analytics query failed:", err);
        reject(err);
      });
  });
};

module.exports = { getAnalytics };
