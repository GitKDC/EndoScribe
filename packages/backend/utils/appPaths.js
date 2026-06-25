const path = require("path");
const os = require("os");

function getUserDataPath() {
  // ✅ In Electron: always use app.getPath("userData") — it's the correct Mac path
  if (process.versions && process.versions.electron) {
    const { app } = require("electron");
    // app must be ready before calling getPath
    if (app.isReady()) {
      return app.getPath("userData");
    }
  }

  // ✅ CLI fallback (for seedTemplates.js run via node directly)
  switch (process.platform) {
    case "darwin":
      return path.join(os.homedir(), "Library", "Application Support", "endoscopy-electron");
    case "win32":
      return path.join(os.homedir(), "AppData", "Roaming", "endoscopy-electron");
    default:
      return path.join(os.homedir(), ".config", "endoscopy-electron");
  }
}

module.exports = { getUserDataPath };