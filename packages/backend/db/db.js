const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");
const { getDatabasePath } = require("../utils/appPaths");

const dbPath = getDatabasePath();

// --- Legacy Migration Check ---
const { getBaseUserDataPath } = require("../utils/config");
const legacyDbPath = path.join(getBaseUserDataPath(), "endoscopy.db");
if (fs.existsSync(legacyDbPath)) {
  if (!fs.existsSync(dbPath) || fs.statSync(dbPath).size < 100 * 1024) {
    console.log("🚚 Migrating legacy database to new database folder...");
    
    // Copy main DB
    fs.copyFileSync(legacyDbPath, dbPath);
    fs.renameSync(legacyDbPath, legacyDbPath + ".bak");

    // Copy WAL
    const legacyWalPath = legacyDbPath + "-wal";
    const newWalPath = dbPath + "-wal";
    if (fs.existsSync(legacyWalPath)) {
      fs.copyFileSync(legacyWalPath, newWalPath);
      fs.renameSync(legacyWalPath, legacyWalPath + ".bak");
    }

    // Copy SHM
    const legacyShmPath = legacyDbPath + "-shm";
    const newShmPath = dbPath + "-shm";
    if (fs.existsSync(legacyShmPath)) {
      fs.copyFileSync(legacyShmPath, newShmPath);
      fs.renameSync(legacyShmPath, legacyShmPath + ".bak");
    }
  }
}
// ------------------------------

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
db.run("PRAGMA journal_mode = WAL"); 

const migrationPath = path.join(__dirname, "migration.sql");
if (fs.existsSync(migrationPath)) {
  const migration = fs.readFileSync(migrationPath, "utf-8");
  db.exec(migration, (err) => {
    if (err) {
      console.error("❌ Migration error:", err.message);
    } else {
      console.log("✅ Migrations completed");
      
      // Auto-migrate new columns
      db.run("ALTER TABLE reports ADD COLUMN patient_phone TEXT", (err) => {
        if (!err) console.log("✅ Added patient_phone column to reports");
      });
      db.run("ALTER TABLE reports ADD COLUMN referral_doctor_phone TEXT", (err) => {
        if (!err) console.log("✅ Added referral_doctor_phone column to reports");
      });
      // Run safe column additions just in case
      db.run("ALTER TABLE reports ADD COLUMN patient_id INTEGER REFERENCES patients(id)", () => {});
      db.run("ALTER TABLE reports ADD COLUMN referral_doctor_id INTEGER REFERENCES referral_doctors(id)", () => {});
      db.run("ALTER TABLE patients ADD COLUMN city TEXT", () => {});
      db.run("ALTER TABLE patients ADD COLUMN procedure_type TEXT", () => {});
      
      // Cloud sync columns
      const tables = ['reports', 'patients', 'images', 'referral_doctors', 'doctors', 'templates'];
      tables.forEach(table => {
        db.run(`ALTER TABLE ${table} ADD COLUMN sync_status TEXT DEFAULT 'local'`, () => {});
        db.run(`ALTER TABLE ${table} ADD COLUMN device_id TEXT`, () => {});
        db.run(`ALTER TABLE ${table} ADD COLUMN last_synced_at DATETIME`, () => {});
      });
    }
  });
} else {
  console.warn("⚠️ Migration file not found at:", migrationPath);
}

module.exports = db;