const { contextBridge, ipcRenderer } = require("electron");

console.log("✅ Preload script loaded");

contextBridge.exposeInMainWorld("api", {
  // ─── TEMPLATE APIs ──────────────────────────────────────────────────────
  getTemplates:   async ()       => ipcRenderer.invoke("get-templates"),
  getTemplate:    async (id)     => ipcRenderer.invoke("get-template", id),
  createTemplate: async (data)   => ipcRenderer.invoke("create-template", data),
  updateTemplate: async (id, d)  => ipcRenderer.invoke("update-template", id, d),
  deleteTemplate: async (id)     => ipcRenderer.invoke("delete-template", id),

  // ─── DOCTOR APIs ────────────────────────────────────────────────────────
  getDoctors:   async ()       => ipcRenderer.invoke("get-doctors"),
  getDoctor:    async (id)     => ipcRenderer.invoke("get-doctor", id),
  createDoctor: async (data)   => ipcRenderer.invoke("create-doctor", data),
  updateDoctor: async (id, d)  => ipcRenderer.invoke("update-doctor", id, d),
  deleteDoctor: async (id)     => ipcRenderer.invoke("delete-doctor", id),
  // ─── PATIENT APIs ─────────────────────────────────────────────────────────
  getPatients:   async (query)  => ipcRenderer.invoke("get-patients", query),
  getPatient:    async (id)     => ipcRenderer.invoke("get-patient", id),
  createPatient: async (data)   => ipcRenderer.invoke("create-patient", data),
  updatePatient: async (id, d)  => ipcRenderer.invoke("update-patient", { id, ...d }),
  deletePatient: async (id)     => ipcRenderer.invoke("delete-patient", id),

  // ─── REFERRAL APIs ────────────────────────────────────────────────────────
  getReferrals:   async (filters) => ipcRenderer.invoke("get-referrals", filters),
  getReferral:    async (id)     => ipcRenderer.invoke("get-referral", id),
  createReferral: async (data)   => ipcRenderer.invoke("create-referral", data),
  updateReferral: async (id, d)  => ipcRenderer.invoke("update-referral", { id, ...d }),
  deleteReferral: async (id)     => ipcRenderer.invoke("delete-referral", id),

  // ─── REPORT APIs ────────────────────────────────────────────────────────
  // Generate (returns sections for live preview — does NOT save to DB)
  generateReport: async (data) => ipcRenderer.invoke("generate-report", data),
  saveImage: async (data) => ipcRenderer.invoke("save-image", data),
  // Save to DB right before PDF export — returns { id, reportNumber }
  saveReport:    async (data)  => ipcRenderer.invoke("save-report", data),

  // Reports list / detail
  getAllReports: async (filters) => ipcRenderer.invoke("get-all-reports", filters),
  getReport:    async (id)     => ipcRenderer.invoke("get-report", id),

  // ─── SETTINGS ────────────────────────────────────────────────────────────
  getSetting: async (key)         => ipcRenderer.invoke("get-setting", key),
  setSetting: async (key, value)  => ipcRenderer.invoke("set-setting", key, value),

  // ─── BACKUP APIs ─────────────────────────────────────────────────────────
  // Manual backup → opens save-file dialog, zips db + images
  createBackup: async () => ipcRenderer.invoke("create-backup"),

  // Called on app launch to auto-backup if 30+ days since last
  checkAutoBackup: async () => ipcRenderer.invoke("check-auto-backup"),

  // Returns { freeGB, totalGB, lowSpace }
  checkDiskSpace: async () => ipcRenderer.invoke("check-disk-space"),

  // ─── MISC ────────────────────────────────────────────────────────────────
  getAppDataPath: () => ipcRenderer.invoke("get-app-data-path"),
  isElectron:     () => true,
});

console.log("✅ API bridge ready");