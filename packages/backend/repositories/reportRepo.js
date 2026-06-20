const db = require("../db/db");

// ─── Get a setting value ─────────────────────────────────────────────────────
const getSetting = (key) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT value FROM settings WHERE key = ?", [key], (err, row) => {
      if (err) return reject(err);
      resolve(row ? row.value : null);
    });
  });
};

// ─── Set a setting value ─────────────────────────────────────────────────────
const setSetting = (key, value) => {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)",
      [key, value],
      (err) => {
        if (err) return reject(err);
        resolve();
      }
    );
  });
};

// ─── Generate a unique report number  e.g.  SH-2026-047 ──────────────────────
const generateReportNumber = async () => {
  const prefix = (await getSetting("report_prefix")) || "SH";
  const year = new Date().getFullYear();

  return new Promise((resolve, reject) => {
    db.get(
      "SELECT COUNT(*) as cnt FROM reports WHERE strftime('%Y', created_at) = ?",
      [String(year)],
      (err, row) => {
        if (err) return reject(err);
        const num = String((row?.cnt || 0) + 1).padStart(3, "0");
        resolve(`${prefix}-${year}-${num}`);
      }
    );
  });
};

// ─── Save a report to the DB ─────────────────────────────────────────────────
const saveReport = async (data) => {
  const {
    patientPrefix = "Mr.",
    patientName,
    age,
    gender,
    doctorId,
    templateId,
    reportType,
    sections,
    images = [] 
  } = data;

  const reportNumber = await generateReportNumber();

  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO reports
       (report_number, patient_prefix, patient_name, age, gender,
        doctor_id, template_id, report_type, sections)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        reportNumber,
        patientPrefix,
        patientName,
        age,
        gender,
        doctorId || null,
        templateId || null,
        reportType || "UPPER GI ENDOSCOPY",
        JSON.stringify(sections || []),
      ],
      function (err) {
        if (err) return reject(err);

        const reportId = this.lastID;

        // SAVE IMAGES
        const stmt = db.prepare(
          "INSERT INTO images (report_id, file_path, position) VALUES (?, ?, ?)"
        );

        images.forEach((img, index) => {
          console.log("📸 Image incoming:", img);

          if (img && img.filePath && img.filePath.trim() !== "") {
            stmt.run(reportId, img.filePath, index);
          } else {
            console.warn("Skipping image (no filePath):", img);
          }
        });

        stmt.finalize();

        resolve({ id: reportId, reportNumber });
      }
    );
  });
};

// ─── Get all reports (list view) ─────────────────────────────────────────────
const getAllReports = () => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT r.id, r.report_number, r.patient_prefix, r.patient_name,
              r.age, r.gender, r.report_type, r.created_at,
              d.name AS doctor_name
       FROM reports r
       LEFT JOIN doctors d ON r.doctor_id = d.id
       ORDER BY r.created_at DESC`,
      [],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows || []);
      }
    );
  });
};

// ─── Get single report by ID ──────────────────────────────────────────────────
const getReport = (id) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT r.*, d.name AS doctor_name, d.qualifications, d.designation
       FROM reports r
       LEFT JOIN doctors d ON r.doctor_id = d.id
       WHERE r.id = ?`,
      [id],
      (err, row) => {
        if (err) return reject(err);
        if (!row) return resolve(null);
        // parse JSON sections
        row.sections = row.sections ? JSON.parse(row.sections) : [];

        db.all(
          "SELECT * FROM images WHERE report_id = ? ORDER BY position",
          [id],
          (err2, images) => {
            if (err2) return reject(err2);

            row.images = images;
            resolve(row);
          }
        );
      }
    );
  });
};

module.exports = { saveReport, getAllReports, getReport, generateReportNumber, getSetting, setSetting };
