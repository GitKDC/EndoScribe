const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const { app } = require("electron");

// 🔥 Correct OS-safe storage location
const userDataPath = app.getPath("userData");

// Create folder if not exists
if (!fs.existsSync(userDataPath)) {
  fs.mkdirSync(userDataPath, { recursive: true });
}

const dbPath = path.join(userDataPath, "endoscopy.db");

const imagesPath = path.join(userDataPath, "images");

if (!fs.existsSync(imagesPath)) {
  fs.mkdirSync(imagesPath, { recursive: true });
}

console.log("📁 Images folder:", imagesPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ DB connection error:", err);
    process.exit(1);
  } else {
    console.log("✅ DB connected at:", dbPath);
  }
});

// Enable foreign keys
db.run("PRAGMA foreign_keys = ON");

// Run migrations
const migrationPath = path.join(__dirname, "migration.sql");
if (fs.existsSync(migrationPath)) {
  const migration = fs.readFileSync(migrationPath, "utf-8");
  db.exec(migration, (err) => {
    if (err) {
      console.error("❌ Migration error:", err);
    } else {
      console.log("✅ Base Migrations completed");
    }
    
    // Fallback: Run alter tables individually because sqlite stops db.exec on first error (e.g., column already exists)
    db.run("ALTER TABLE reports ADD COLUMN patient_id INTEGER REFERENCES patients(id);", (e) => {});
    db.run("ALTER TABLE reports ADD COLUMN referral_doctor_id INTEGER REFERENCES referral_doctors(id);", (e) => {});
    db.run("ALTER TABLE referral_doctors ADD COLUMN city TEXT;", (e) => {
      console.log("✅ DB schema checks completed");
      const { seedTemplates } = require("./seedTemplates");
      seedTemplates(db);
    });
  });
} else {
  console.warn("⚠️ Migration file not found at:", migrationPath);
  const { seedTemplates } = require("./seedTemplates");
  seedTemplates(db);
}

module.exports = db;