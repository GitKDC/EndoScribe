const fs = require("fs");
const path = require("path");
const { readConfig, getBaseUserDataPath } = require("./config");

function ensureDirectory(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

function getUserDataPath() {
  return getBaseUserDataPath();
}

function getStoragePaths() {
  const config = readConfig();
  return config.storagePaths;
}

function getDatabasePath() {
  const p = getStoragePaths().database;
  ensureDirectory(p);
  return path.join(p, "endoscribe_secure.db");
}

function getImagesBasePath() {
  const p = getStoragePaths().images;
  return ensureDirectory(p);
}

function getReportsBasePath() {
  const p = getStoragePaths().reports;
  return ensureDirectory(p);
}

function getBackupsBasePath() {
  const p = getStoragePaths().backups;
  return ensureDirectory(p);
}

function getExportsBasePath() {
  const p = getStoragePaths().exports;
  return ensureDirectory(p);
}

// Generate path like /images/2026/June
function getMonthlyImagesPath(dateObj = new Date()) {
  const year = dateObj.getFullYear().toString();
  const month = dateObj.toLocaleString('default', { month: 'long' });
  const base = getImagesBasePath();
  return ensureDirectory(path.join(base, year, month));
}

function getMonthlyReportsPath(dateObj = new Date()) {
  const year = dateObj.getFullYear().toString();
  const month = dateObj.toLocaleString('default', { month: 'long' });
  const base = getReportsBasePath();
  return ensureDirectory(path.join(base, year, month));
}

module.exports = {
  getUserDataPath,
  getStoragePaths,
  getDatabasePath,
  getImagesBasePath,
  getReportsBasePath,
  getBackupsBasePath,
  getExportsBasePath,
  getMonthlyImagesPath,
  getMonthlyReportsPath
};