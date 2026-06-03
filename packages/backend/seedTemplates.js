const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

// Ensure data directory exists
const dataDir = path.join(__dirname, "../data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "endoscopy_report_template.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ DB connection error:", err);
    process.exit(1);
  } else {
    console.log("✅ DB connected");
  }
});

// Run migrations first
const migrationPath = path.join(__dirname, "migration.sql");
if (fs.existsSync(migrationPath)) {
  const migration = fs.readFileSync(migrationPath, "utf-8");
  db.exec(migration, (err) => {
    if (err) {
      console.error("❌ Migration error:", err);
      process.exit(1);
    } else {
      console.log("✅ Migrations completed");
      seedTemplates();
    }
  });
} else {
  console.error("❌ Migration file not found");
  process.exit(1);
}

function seedTemplates() {
  const templates = [
    {
      name: "Varices - Grade I",
      category: "varices",
      esophagus: "Small columns of varices",
      stomach: "Erythematous mucosa",
      duodenum: "Normal",
      impression: "Grade I varices",
    },
    {
      name: "Varices - Grade II",
      category: "varices",
      esophagus: "Medium columns of varices with red color signs",
      stomach: "Erythematous edematous mucosa",
      duodenum: "Normal",
      impression: "Grade II varices with red color signs",
    },
    {
      name: "Gastritis",
      category: "gastritis",
      esophagus: "Normal",
      stomach: "Erythematous edematous mucosa with multiple erosions",
      duodenum: "Normal",
      impression: "Erosive gastritis",
    },
    {
      name: "Normal Study",
      category: "normal",
      esophagus: "Normal",
      stomach: "Normal",
      duodenum: "Normal",
      impression: "Normal study",
    },
    {
      name: "Peptic Ulcer Disease",
      category: "ulcer",
      esophagus: "Normal",
      stomach: "Ulcer with clean base at lesser curve",
      duodenum: "Normal",
      impression: "Gastric ulcer",
    },
    {
      name: "Barrett's Esophagus",
      category: "barrett",
      esophagus: "Salmon-colored mucosa extending above GE junction",
      stomach: "Normal",
      duodenum: "Normal",
      impression: "Barrett's esophagus",
    },
  ];

  // Check if templates already exist
  db.get("SELECT COUNT(*) as count FROM templates", [], (err, result) => {
    if (err) {
      console.error("❌ Error checking templates:", err);
      db.close();
      process.exit(1);
    }

    if (result.count > 0) {
      console.log(`⚠️ Database already has ${result.count} templates, skipping seed`);
      db.close();
      process.exit(0);
    }

    // Insert templates
    const stmt = db.prepare(
      "INSERT INTO templates (name, category, esophagus, stomach, duodenum, impression) VALUES (?, ?, ?, ?, ?, ?)"
    );

    let inserted = 0;
    templates.forEach((template) => {
      stmt.run(
        [
          template.name,
          template.category,
          template.esophagus,
          template.stomach,
          template.duodenum,
          template.impression,
        ],
        (err) => {
          if (err) {
            console.error(`❌ Error inserting template ${template.name}:`, err);
          } else {
            inserted++;
            console.log(`✅ Inserted: ${template.name}`);
          }

          if (inserted === templates.length) {
            console.log(`\n🎉 Successfully seeded ${inserted} templates!`);
            db.close();
            process.exit(0);
          }
        }
      );
    });
  });
}