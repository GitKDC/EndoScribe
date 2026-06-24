const { ipcMain } = require("electron");
const db = require("../db/db");
const { getTemplate } = require("../repositories/templateRepo");
const { generateReport } = require("../services/reportService");
const {
  saveReport,
  getAllReports,
  getReport,
  getSetting,
  setSetting,
} = require("../repositories/reportRepo");

const registerReportHandlers = () => {

  // ── Generate (in-memory, returns sections for preview) ───────────────────
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

  // ── Save report to DB (called just before PDF export) ────────────────────
  ipcMain.handle("save-report", async (_, data) => {
    try {
      console.log("📨 IPC HIT: save-report", data?.patientName);
      const result = await saveReport(data);
      console.log("✅ Report saved:", result.reportNumber);
      return result; // { id, reportNumber }
    } catch (error) {
      console.error("❌ Error saving report:", error);
      throw error;
    }
  });

  // ── Get all reports (for Reports list page) ───────────────────────────────
  ipcMain.handle("get-all-reports", async (_, filters) => {
    try {
      const reports = await getAllReports(filters || {});
      return reports;
    } catch (error) {
      console.error("❌ Error fetching reports:", error);
      throw error;
    }
  });

  // ── Get single report ─────────────────────────────────────────────────────
  ipcMain.handle("get-report", async (_, id) => {
    try {
      const report = await getReport(id);
      return report;
    } catch (error) {
      console.error("❌ Error fetching report:", error);
      throw error;
    }
  });

  // ── Settings CRUD ─────────────────────────────────────────────────────────
  ipcMain.handle("get-setting", async (_, key) => getSetting(key));
  ipcMain.handle("set-setting", async (_, key, value) => setSetting(key, value));
};

module.exports = { registerReportHandlers };