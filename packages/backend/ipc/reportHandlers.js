const { ipcMain } = require("electron");
const db = require("../db/db");
const { getTemplates, getTemplate } = require("../repositories/templateRepo");
const { generateReport } = require("../services/reportService");

const registerReportHandlers = () => {

  // Generate report
  ipcMain.handle("generate-report", async (_, data) => {
    try {
      console.log("📨 IPC HIT: generate-report");
      const report = await generateReport(data, db);
      console.log("✅ Report generated successfully");
      return report;
    } catch (error) {
      console.error("❌ Error generating report:", error);
      throw error;
    }
  });
};

module.exports = { registerReportHandlers };