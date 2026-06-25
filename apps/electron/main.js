const { app, BrowserWindow } = require("electron");
const path = require("path");

// Mac M-series: NO GPU flags needed — Apple Silicon handles this natively
// Only add platform-specific flags when needed
if (process.platform === "linux") {
  app.commandLine.appendSwitch("no-sandbox");
  app.commandLine.appendSwitch("disable-gpu-compositing");
  app.commandLine.appendSwitch("disable-dev-shm-usage");
  app.disableHardwareAcceleration();
}

let db;
let win;

async function createWindow() {
  console.log("🔵 Creating Electron window...");
  win = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      enableRemoteModule: false,
    },
  });

  if (process.env.DEBUG) {
    win.webContents.openDevTools();
  }

  win.webContents.on("did-start-loading", () => console.log("⏳ Page started loading..."));
  win.webContents.on("did-finish-load",   () => console.log("✅ Page loaded successfully"));
  win.webContents.on("did-fail-load", (event, errorCode, errorDescription) => {
    console.error(`Page failed to load (${errorCode}): ${errorDescription}`);
  });
  // crashed' is deprecated — use render-process-gone
  win.webContents.on("render-process-gone", (event, details) => {
    console.error("Renderer process gone:", details.reason);
    if (details.reason !== "clean-exit") win.reload();
  });

  try {
    const url = process.env.NEXT_URL || "http://localhost:3000";
    console.log(`Loading URL: ${url}`);
    await win.loadURL(url);
    console.log("URL loaded successfully");
  } catch (err) {
    console.error("Failed to load URL:", err);
    setTimeout(() => createWindow(), 2000);
  }
}

async function initializeApp() {
  try {
    console.log("🔵 Initializing database...");
    db = require("../../packages/backend/db/db");

    console.log("🔵 Registering IPC handlers...");
    require("../../packages/backend/ipc/reportHandlers").registerReportHandlers();
    require("../../packages/backend/ipc/imageHandlers").registerImageHandlers();
    require("../../packages/backend/ipc/templateHandlers").registerTemplateHandlers();
    require("../../packages/backend/ipc/backupHandlers").registerBackupHandlers();
    require("../../packages/backend/ipc/doctorsHandlers").registerDoctorHandlers();
    require("../../packages/backend/ipc/patientHandlers").registerPatientHandlers();
    require("../../packages/backend/ipc/referralHandlers").registerReferralHandlers();
    require("../../packages/backend/ipc/dashboardHandlers").registerDashboardHandlers();
    require("../../packages/backend/ipc/analyticsHandlers").registerAnalyticsHandlers();
    require("../../packages/backend/ipc/categoryHandlers").registerCategoryHandlers();

    console.log("App initialized successfully");
  } catch (error) {
    console.error("Initialization error:", error);
    process.exit(1);
  }
}

app.whenReady().then(async () => {
  console.log("🚀 App is ready");
  await initializeApp();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    console.log("👋 Closing app");
    app.quit();
  }
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});