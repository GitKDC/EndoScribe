const { app, BrowserWindow } = require("electron");
const path = require("path");

// GPU & Display fixes for Linux
app.commandLine.appendSwitch("no-sandbox");
app.commandLine.appendSwitch("disable-gpu");
app.commandLine.appendSwitch("disable-gpu-compositing");
app.commandLine.appendSwitch("disable-dev-shm-usage");
app.disableHardwareAcceleration();

// Import DB and handlers AFTER app is ready
let db;
let registerReportHandlers;

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

  // Open DevTools in development
  if (process.env.DEBUG) {
    win.webContents.openDevTools();
  }

  win.webContents.on("did-start-loading", () => {
    console.log("⏳ Page started loading...");
  });

  win.webContents.on("did-finish-load", () => {
    console.log("✅ Page loaded successfully");
  });

  win.webContents.on("did-fail-load", (event, errorCode, errorDescription) => {
    console.error(`❌ Page failed to load (${errorCode}): ${errorDescription}`);
  });

  win.webContents.on("crashed", () => {
    console.error("❌ Renderer process crashed");
    win.reload();
  });

  try {
    // Try localhost first, fallback to IP
    const url = process.env.NEXT_URL || "http://localhost:3000";
    console.log(`🔵 Loading URL: ${url}`);
    await win.loadURL(url);
    console.log("✅ URL loaded successfully");
  } catch (err) {
    console.error("❌ Failed to load URL:", err);
    // Retry after 2 seconds
    setTimeout(() => {
      createWindow();
    }, 2000);
  }
}

async function initializeApp() {
  try {
    // Initialize database
    console.log("🔵 Initializing database...");
    db = require("../../packages/backend/db/db");

    // Register IPC handlers
    console.log("🔵 Registering IPC handlers...");
    registerReportHandlers = require("../../packages/backend/ipc/reportHandlers");
    registerReportHandlers.registerReportHandlers();

    console.log("✅ App initialized successfully");
  } catch (error) {
    console.error("❌ Initialization error:", error);
    process.exit(1);
  }
}

app.whenReady().then(async () => {
  console.log("🚀 App is ready");
  
  await initializeApp();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    console.log("👋 Closing app");
    app.quit();
  }
});

// Handle any uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
});