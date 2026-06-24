const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");
const os = require("os");

function getCliDataPath() {
  if (process.platform === "darwin") {
    return path.join(os.homedir(), "Library", "Application Support", "endoscopy-electron");
  } else if (process.platform === "win32") {
    return path.join(os.homedir(), "AppData", "Roaming", "endoscopy-electron");
  } else {
    return path.join(os.homedir(), ".config", "endoscopy-electron");
  }
}

const userDataPath = getCliDataPath();

if (!fs.existsSync(userDataPath)) {
  fs.mkdirSync(userDataPath, { recursive: true });
  console.log("📁 Created:", userDataPath);
}

const dbPath = path.join(userDataPath, "endoscopy.db");
const migrationPath = path.join(__dirname, "db", "migration.sql");
const FORCE_RESEED = process.argv.includes("--force");

console.log("✅ Platform:", process.platform);
console.log("✅ Data path:", userDataPath);
console.log("✅ DB path:", dbPath);
