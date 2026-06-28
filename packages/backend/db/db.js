const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");
const { getUserDataPath } = require("../utils/appPaths"); // ✅ one import

const userDataPath = getUserDataPath();

// Ensure folders exist
if (!fs.existsSync(userDataPath)) {
  fs.mkdirSync(userDataPath, { recursive: true });
}

const dbPath = path.join(userDataPath, "endoscopy.db");
const imagesPath = path.join(userDataPath, "images");

if (!fs.existsSync(imagesPath)) {
  fs.mkdirSync(imagesPath, { recursive: true });
}

console.log("📁 Data folder:", userDataPath);
console.log("📁 DB path:", dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ DB connection error:", err.message);
    process.exit(1);
  } else {
    console.log("✅ DB connected at:", dbPath);
  }
});

db.run("PRAGMA foreign_keys = ON");
db.run("PRAGMA journal_mode = WAL"); // ✅ Better performance, safer writes on Mac

const migrationPath = path.join(__dirname, "migration.sql");
if (fs.existsSync(migrationPath)) {
  const migration = fs.readFileSync(migrationPath, "utf-8");
  db.exec(migration, (err) => {
    if (err) {
      console.error("❌ Migration error:", err.message);
    } else {
      console.log("✅ Migrations completed");
      
      // Run safe column additions
      db.run("ALTER TABLE reports ADD COLUMN patient_id INTEGER REFERENCES patients(id)", () => {});
      db.run("ALTER TABLE reports ADD COLUMN referral_doctor_id INTEGER REFERENCES referral_doctors(id)", () => {});
      db.run("ALTER TABLE patients ADD COLUMN city TEXT", () => {});
    }
  });
} else {
  console.warn("⚠️ Migration file not found at:", migrationPath);
}

module.exports = db;