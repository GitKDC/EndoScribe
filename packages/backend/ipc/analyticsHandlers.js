// ─────────────────────────────────────────────────────────────────────────────
// ANALYTICS IPC HANDLER
// ─────────────────────────────────────────────────────────────────────────────
const { ipcMain } = require("electron");
const db = require("../db/db");
const { getAnalytics } = require("../repositories/analyticsRepo");

const registerAnalyticsHandlers = () => {
  ipcMain.handle("get-analytics", async () => {
    try {
      console.log("📨 IPC HIT: get-analytics");
      const data = await getAnalytics(db);
      return data;
    } catch (error) {
      console.error("❌ Error in get-analytics:", error);
      throw error;
    }
  });
};

module.exports = { registerAnalyticsHandlers };