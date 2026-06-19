// ─────────────────────────────────────────────────────────────
// TEMPLATE REPOSITORY (CLEAN + FULL CRUD)
// ─────────────────────────────────────────────────────────────

// ── GET ALL TEMPLATES ─────────────────────────────────────────
const getTemplates = (db) => {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM templates ORDER BY created_at DESC",
      [],
      (err, rows) => {
        if (err) {
          console.error("❌ DB Error in getTemplates:", err);
          return reject(new Error("Failed to fetch templates: " + err.message));
        }

        const templates = (rows || []).map((row) => {
          try {
            return {
              ...row,
              sections: row.sections ? JSON.parse(row.sections) : [],
            };
          } catch {
            return { ...row, sections: [] };
          }
        });

        console.log(`✅ Database returned ${templates.length} templates`);
        resolve(templates);
      }
    );
  });
};

// ── GET SINGLE TEMPLATE ───────────────────────────────────────
const getTemplate = (id, db) => {
  return new Promise((resolve, reject) => {
    if (!id) return reject(new Error("Template ID is required"));

    db.get(
      "SELECT * FROM templates WHERE id = ?",
      [id],
      (err, row) => {
        if (err) {
          console.error("❌ DB Error in getTemplate:", err);
          return reject(new Error("Failed to fetch template: " + err.message));
        }

        if (!row) return reject(new Error("Template not found"));

        try {
          row.sections = row.sections ? JSON.parse(row.sections) : [];
        } catch {
          row.sections = [];
        }

        console.log(`✅ Database returned template: ${row.name}`);
        resolve(row);
      }
    );
  });
};

// ── CREATE TEMPLATE ───────────────────────────────────────────
const createTemplate = (data, db) => {
  return new Promise((resolve, reject) => {
    const { name, category, sections } = data;

    if (!name || !category) {
      return reject(new Error("Name and category are required"));
    }

    db.run(
      "INSERT INTO templates (name, category, sections) VALUES (?, ?, ?)",
      [name, category, JSON.stringify(sections || [])],
      function (err) {
        if (err) {
          console.error("❌ DB Error in createTemplate:", err);
          return reject(err);
        }

        console.log(`✅ Template created with ID: ${this.lastID}`);
        resolve({ id: this.lastID, ...data });
      }
    );
  });
};

// ── UPDATE TEMPLATE ───────────────────────────────────────────
const updateTemplate = (id, data, db) => {
  return new Promise((resolve, reject) => {
    const { name, category, sections } = data;

    db.run(
      "UPDATE templates SET name=?, category=?, sections=? WHERE id=?",
      [name, category, JSON.stringify(sections || []), id],
      function (err) {
        if (err) {
          console.error("❌ DB Error in updateTemplate:", err);
          return reject(err);
        }

        console.log(`✅ Template updated: ${id}`);
        resolve({ success: true });
      }
    );
  });
};

// ── DELETE TEMPLATE ───────────────────────────────────────────
const deleteTemplate = (id, db) => {
  return new Promise((resolve, reject) => {
    db.run(
      "DELETE FROM templates WHERE id=?",
      [id],
      function (err) {
        if (err) {
          console.error("❌ DB Error in deleteTemplate:", err);
          return reject(err);
        }

        console.log(`🗑️ Template deleted: ${id}`);
        resolve({ success: true });
      }
    );
  });
};

// ── EXPORTS ───────────────────────────────────────────────────
module.exports = {
  getTemplates,
  getTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
};