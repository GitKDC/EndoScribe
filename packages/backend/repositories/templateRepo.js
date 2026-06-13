const getTemplates = (db) => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM templates ORDER BY created_at DESC", [], (err, rows) => {
      if (err) {
        console.error("❌ DB Error in getTemplates:", err);
        reject(new Error("Failed to fetch templates: " + err.message));
      } else {
        const templates = (rows || []).map((row) => {
          return {
            ...row,
            sections: row.sections ? JSON.parse(row.sections) : null, // 🔥 NEW
          };
        });

        console.log(`✅ Database returned ${templates.length} templates`);
        resolve(templates);
      }
    });
  });
};

const getTemplate = (id, db) => {
  return new Promise((resolve, reject) => {
    if (!id) {
      reject(new Error("Template ID is required"));
      return;
    }

    db.get("SELECT * FROM templates WHERE id = ?", [id], (err, row) => {
      if (err) {
        console.error("❌ DB Error in getTemplate:", err);
        reject(new Error("Failed to fetch template: " + err.message));
      } else if (!row) {
        reject(new Error("Template not found"));
      } else {
        console.log(`✅ Database returned template: ${row.name}`);

        // 🔥 NEW: parse sections if exists
        row.sections = row.sections ? JSON.parse(row.sections) : null;

        resolve(row);
      }
    });
  });
};

// 🔥 UPDATED: supports both OLD + NEW
const createTemplate = (data, db) => {
  return new Promise((resolve, reject) => {
    const { name, category, sections } = data;

    if (!name || !category) {
      reject(new Error("Name and category are required"));
      return;
    }

    const stmt = db.prepare(
      "INSERT INTO templates (name, category, sections) VALUES (?, ?, ?)"
    );

    stmt.run(
      [name, category, JSON.stringify(sections || [])],
      function (err) {
        if (err) {
          console.error("❌ DB Error in createTemplate:", err);
          reject(new Error("Failed to create template: " + err.message));
        } else {
          console.log(`✅ Template created with ID: ${this.lastID}`);
          resolve({ id: this.lastID, ...data });
        }
      }
    );
  });
};

module.exports = { getTemplates, getTemplate, createTemplate };