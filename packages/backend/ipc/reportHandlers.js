const { ipcMain } = require("electron");
const db = require("../db/db");
const { getTemplates, getTemplate } = require("../repositories/templateRepo");
const { generateReport } = require("../services/reportService");

const registerReportHandlers = () => {
  // Get all templates
  ipcMain.handle("get-templates", async () => {
    try {
      console.log("📨 IPC HIT: get-templates");
      const templates = await getTemplates(db);
      console.log(`✅ Returned ${templates.length} templates`);
      return templates;
    } catch (error) {
      console.error("❌ Error fetching templates:", error);
      throw error;
    }
  });

  // Get single template by ID
  ipcMain.handle("get-template", async (_, id) => {
    try {
      console.log(`📨 IPC HIT: get-template (id: ${id})`);
      const template = await getTemplate(id, db);
      console.log(`✅ Returned template: ${template?.name}`);
      return template;
    } catch (error) {
      console.error("❌ Error fetching template:", error);
      throw error;
    }
  });

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