const db = require("../db/db");

const getAllCategories = () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM categories ORDER BY id ASC", (err, rows) => {
      if (err) reject(err);
      else {
        // Parse JSON sections
        const formatted = rows.map(r => ({
          ...r,
          default_sections: r.default_sections ? JSON.parse(r.default_sections) : []
        }));
        resolve(formatted);
      }
    });
  });
};

const createCategory = (data) => {
  return new Promise((resolve, reject) => {
    const { name, color_bg, color_fg, default_sections } = data;
    const jsonSections = JSON.stringify(default_sections || []);
    db.run(
      `INSERT INTO categories (name, color_bg, color_fg, default_sections) VALUES (?, ?, ?, ?)`,
      [name, color_bg || '#f1f5f9', color_fg || '#475569', jsonSections],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, ...data });
      }
    );
  });
};

const updateCategory = (id, data) => {
  return new Promise((resolve, reject) => {
    const { name, color_bg, color_fg, default_sections } = data;
    const jsonSections = JSON.stringify(default_sections || []);
    db.run(
      `UPDATE categories SET name = ?, color_bg = ?, color_fg = ?, default_sections = ? WHERE id = ?`,
      [name, color_bg, color_fg, jsonSections, id],
      function (err) {
        if (err) reject(err);
        else resolve({ success: true, changes: this.changes });
      }
    );
  });
};

const deleteCategory = (id) => {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM categories WHERE id = ?`, [id], function (err) {
      if (err) reject(err);
      else resolve({ success: true, changes: this.changes });
    });
  });
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
