const { contextBridge, ipcRenderer } = require("electron");

console.log("✅ Preload script loaded");

// Expose safe APIs to renderer process
contextBridge.exposeInMainWorld("api", {
  // Get all templates
  getTemplates: async () => {
    try {
      console.log("📤 Calling getTemplates...");
      const result = await ipcRenderer.invoke("get-templates");
      console.log("📥 Received templates:", result);
      return result;
    } catch (error) {
      console.error("❌ getTemplates error:", error);
      throw error;
    }
  },

  // Get single template by ID
  getTemplate: async (id) => {
    try {
      console.log(`📤 Calling getTemplate(${id})...`);
      const result = await ipcRenderer.invoke("get-template", id);
      console.log("📥 Received template:", result);
      return result;
    } catch (error) {
      console.error("❌ getTemplate error:", error);
      throw error;
    }
  },

  // Generate report
  generateReport: async (data) => {
    try {
      console.log("📤 Calling generateReport...", data);
      const result = await ipcRenderer.invoke("generate-report", data);
      console.log("📥 Report generated:", result);
      return result;
    } catch (error) {
      console.error("❌ generateReport error:", error);
      throw error;
    }
  },

  // Check if running in Electron
  isElectron: () => true,
});

console.log("✅ API bridge created");