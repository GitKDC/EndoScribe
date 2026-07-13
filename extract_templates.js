const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const db = new sqlite3.Database("/Users/kartikchaudhari/Library/Application Support/endoscopy-electron/database/endoscopy.db");

db.all("SELECT name, category, sections FROM templates", [], (err, rows) => {
  if (err) {
    console.error(err);
    return;
  }
  let sql = "-- Seed 37 Clinic Templates\n";
  sql += "INSERT OR IGNORE INTO templates (name, category, sections) VALUES\n";
  
  const values = rows.map(r => {
    const name = r.name.replace(/'/g, "''");
    const cat = r.category.replace(/'/g, "''");
    const sec = r.sections.replace(/'/g, "''");
    return `('${name}', '${cat}', '${sec}')`;
  });
  
  sql += values.join(",\n") + ";\n";
  fs.writeFileSync("templates_insert.sql", sql);
  console.log("Wrote to templates_insert.sql");
});
