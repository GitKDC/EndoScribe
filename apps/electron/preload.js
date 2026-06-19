const { contextBridge, ipcRenderer } = require("electron");

console.log("✅ Preload script loaded");

contextBridge.exposeInMainWorld("api", {
  // ─── TEMPLATE APIs ─────────────────────────────
  getTemplates: async () => {
    try {
      console.log("📤 getTemplates()");
      const res = await ipcRenderer.invoke("get-templates");
      console.log("📥 Templates:", res);
      return res;
    } catch (err) {
      console.error("❌ getTemplates error:", err);
      throw err;
    }
  },

  getTemplate: async (id) => {
    try {
      console.log(`📤 getTemplate(${id})`);
      const res = await ipcRenderer.invoke("get-template", id);
      console.log("📥 Template:", res);
      return res;
    } catch (err) {
      console.error("❌ getTemplate error:", err);
      throw err;
    }
  },

  createTemplate: async (data) => {
    try {
      console.log("📤 createTemplate", data);
      return await ipcRenderer.invoke("create-template", data);
    } catch (err) {
      console.error("❌ createTemplate error:", err);
      throw err;
    }
  },

  updateTemplate: async (id, data) => {
    try {
      console.log("📤 updateTemplate", id, data);
      return await ipcRenderer.invoke("update-template", id, data);
    } catch (err) {
      console.error("❌ updateTemplate error:", err);
      throw err;
    }
  },

  deleteTemplate: async (id) => {
    try {
      console.log("📤 deleteTemplate", id);
      return await ipcRenderer.invoke("delete-template", id);
    } catch (err) {
      console.error("❌ deleteTemplate error:", err);
      throw err;
    }
  },

  // ─── DOCTOR APIs ────────────────────────────────
  getDoctors: async () => {
    try {
      console.log("📤 getDoctors()");
      const res = await ipcRenderer.invoke("get-doctors");
      console.log("📥 Doctors:", res);
      return res;
    } catch (err) {
      console.error("❌ getDoctors error:", err);
      throw err;
    }
  },

  getDoctor: async (id) => {
    try {
      console.log(`📤 getDoctor(${id})`);
      return await ipcRenderer.invoke("get-doctor", id);
    } catch (err) {
      console.error("❌ getDoctor error:", err);
      throw err;
    }
  },

  createDoctor: async (data) => {
    try {
      console.log("📤 createDoctor", data);
      return await ipcRenderer.invoke("create-doctor", data);
    } catch (err) {
      console.error("❌ createDoctor error:", err);
      throw err;
    }
  },

  updateDoctor: async (id, data) => {
    try {
      console.log("📤 updateDoctor", id, data);
      return await ipcRenderer.invoke("update-doctor", id, data);
    } catch (err) {
      console.error("❌ updateDoctor error:", err);
      throw err;
    }
  },

  deleteDoctor: async (id) => {
    try {
      console.log("📤 deleteDoctor", id);
      return await ipcRenderer.invoke("delete-doctor", id);
    } catch (err) {
      console.error("❌ deleteDoctor error:", err);
      throw err;
    }
  },

  // ─── REPORT API ────────────────────────────────
  generateReport: async (data) => {
    try {
      console.log("📤 generateReport", data);
      const res = await ipcRenderer.invoke("generate-report", data);
      console.log("📥 Report:", res);
      return res;
    } catch (err) {
      console.error("❌ generateReport error:", err);
      throw err;
    }
  },

  // ─── HELPER ───────────────────────────────────
  isElectron: () => true,
});

console.log("✅ API bridge ready");