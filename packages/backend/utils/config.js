const fs = require("fs");
const path = require("path");
const os = require("os");

function getBaseUserDataPath() {
  if (process.versions && process.versions.electron) {
    const { app } = require("electron");
    if (app.isReady()) {
      return app.getPath("userData");
    }
  }

  // CLI fallback
  switch (process.platform) {
    case "darwin":
      return path.join(os.homedir(), "Library", "Application Support", "endoscopy-electron");
    case "win32":
      return path.join(os.homedir(), "AppData", "Roaming", "endoscopy-electron");
    default:
      return path.join(os.homedir(), ".config", "endoscopy-electron");
  }
}

const configDir = path.join(getBaseUserDataPath(), "config");
const configPath = path.join(configDir, "settings.json");

function ensureConfigDir() {
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
}

const DEFAULT_CONFIG = {
  isFirstLaunch: true,
  storagePaths: {
    base: getBaseUserDataPath(),
    database: path.join(getBaseUserDataPath(), "database"),
    images: path.join(getBaseUserDataPath(), "images"),
    reports: path.join(getBaseUserDataPath(), "reports"),
    backups: path.join(getBaseUserDataPath(), "backups"),
    exports: path.join(getBaseUserDataPath(), "exports")
  },
  backupSettings: {
    frequency: "never", // daily, weekly, monthly, never
    keepLast: 5,
    lastBackup: null,
    nextBackup: null
  },
  cleanupRules: {
    reportsOlderThanYears: 3
  },
  cloudSync: {
    enabled: false,
    provider: "none"
  }
};

function readConfig() {
  ensureConfigDir();
  if (!fs.existsSync(configPath)) {
    writeConfig(DEFAULT_CONFIG);
    return DEFAULT_CONFIG;
  }
  try {
    const data = fs.readFileSync(configPath, "utf-8");
    return { ...DEFAULT_CONFIG, ...JSON.parse(data) };
  } catch (e) {
    console.error("Failed to read settings.json", e);
    return DEFAULT_CONFIG;
  }
}

function writeConfig(data) {
  ensureConfigDir();
  fs.writeFileSync(configPath, JSON.stringify(data, null, 2));
}

function updateConfig(updates) {
  const current = readConfig();
  const merged = { ...current, ...updates };
  writeConfig(merged);
  return merged;
}

module.exports = {
  getBaseUserDataPath,
  readConfig,
  writeConfig,
  updateConfig,
  DEFAULT_CONFIG
};
