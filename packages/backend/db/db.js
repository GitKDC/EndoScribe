const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

// Ensure data directory exists
const dataDir = path.join(__dirname, "../../data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "endoscopy_report_template.db");

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
      console.log("✅ Migrations completed");
    }
  });
} else {
  console.warn("⚠️ Migration file not found at:", migrationPath);
}

module.exports = db;