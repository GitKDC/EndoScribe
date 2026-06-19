// ─────────────────────────────────────────────────────────────
// DOCTOR REPOSITORY (FULL CRUD)
// ─────────────────────────────────────────────────────────────

// ── GET ALL DOCTORS ───────────────────────────────────────────
const getDoctors = (db) => {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM doctors ORDER BY display_order ASC, id ASC",
      [],
      (err, rows) => {
        if (err) {
          console.error("❌ DB Error in getDoctors:", err);
          return reject(new Error("Failed to fetch doctors: " + err.message));
        }
        console.log(`✅ Database returned ${rows.length} doctors`);
        resolve(rows || []);
      }
    );
  });
};

// ── GET SINGLE DOCTOR ─────────────────────────────────────────
const getDoctor = (id, db) => {
  return new Promise((resolve, reject) => {
    if (!id) return reject(new Error("Doctor ID is required"));

    db.get("SELECT * FROM doctors WHERE id = ?", [id], (err, row) => {
      if (err) {
        console.error("❌ DB Error in getDoctor:", err);
        return reject(new Error("Failed to fetch doctor: " + err.message));
      }
      if (!row) return reject(new Error("Doctor not found"));
      resolve(row);
    });
  });
};

// ── CREATE DOCTOR ─────────────────────────────────────────────
const createDoctor = (data, db) => {
  return new Promise((resolve, reject) => {
    const { name, qualifications, designation, is_default, display_order } = data;

    if (!name || !name.trim()) {
      return reject(new Error("Doctor name is required"));
    }

    db.run(
      `INSERT INTO doctors (name, qualifications, designation, is_default, display_order)
       VALUES (?, ?, ?, ?, ?)`,
      [
        name.trim(),
        qualifications || "",
        designation || "",
        is_default ? 1 : 0,
        display_order ?? 0,
      ],
      function (err) {
        if (err) {
          console.error(" DB Error in createDoctor:", err);
          return reject(err);
        }
        console.log(`Doctor created with ID: ${this.lastID}`);
        resolve({ id: this.lastID, ...data });
      }
    );
  });
};

// ── UPDATE DOCTOR ─────────────────────────────────────────────
const updateDoctor = (id, data, db) => {
  return new Promise((resolve, reject) => {
    const { name, qualifications, designation, is_default, display_order } = data;

    db.run(
      `UPDATE doctors
       SET name = ?, qualifications = ?, designation = ?, is_default = ?, display_order = ?
       WHERE id = ?`,
      [
        name,
        qualifications || "",
        designation || "",
        is_default ? 1 : 0,
        display_order ?? 0,
        id,
      ],
      function (err) {
        if (err) {
          console.error("DB Error in updateDoctor:", err);
          return reject(err);
        }
        console.log(`Doctor updated: ${id}`);
        resolve({ success: true });
      }
    );
  });
};

// ── DELETE DOCTOR ─────────────────────────────────────────────
const deleteDoctor = (id, db) => {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM doctors WHERE id = ?", [id], function (err) {
      if (err) {
        console.error("DB Error in deleteDoctor:", err);
        return reject(err);
      }
      console.log(`🗑️ Doctor deleted: ${id}`);
      resolve({ success: true });
    });
  });
};

// ── SEED DEFAULT DOCTORS (idempotent — only runs if table is empty) ──
const seedDefaultDoctors = (db) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT COUNT(*) as count FROM doctors", [], (err, result) => {
      if (err) return reject(err);
      if (result.count > 0) return resolve({ seeded: false });

      const defaults = [
        {
          name: "Dr Hrushikesh P. Chaudhari",
          qualifications: "DNB (Gen. Med.), DNB (Gastro.)",
          designation: "Consultant Gastroenterologist & Therapeutic Endoscopist",
          is_default: 1,
          display_order: 1,
        },
        {
          name: "Dr Vaibhav Lamdhade",
          qualifications: "DNB (Gen. Med.), DNB (Gastro.)",
          designation: "Consultant Gastroenterologist & Therapeutic Endoscopist",
          is_default: 1,
          display_order: 2,
        },
      ];

      const stmt = db.prepare(
        `INSERT INTO doctors (name, qualifications, designation, is_default, display_order)
         VALUES (?, ?, ?, ?, ?)`
      );

      defaults.forEach((d) => {
        stmt.run([d.name, d.qualifications, d.designation, d.is_default, d.display_order]);
      });

      stmt.finalize((err) => {
        if (err) return reject(err);
        console.log("✅ Seeded default doctors");
        resolve({ seeded: true });
      });
    });
  });
};

module.exports = {
  getDoctors,
  getDoctor,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  seedDefaultDoctors,
};