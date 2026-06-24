const db = require("../db/db");
const fs = require("fs");

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
  let {
    patientId,
    patientPrefix = "Mr.",
    patientName,
    patientPhone,
    age,
    gender,
    doctorId,
    templateId,
    reportType,
    sections,
    images = [] 
  } = data;

  const reportNumber = await generateReportNumber();

  // 🔥 Auto-create patient if not provided
  if (!patientId && patientName) {
    try {
      await new Promise((res, rej) => {
        db.run(
          "INSERT INTO patients (name, phone, age, gender) VALUES (?, ?, ?, ?)",
          [patientName, patientPhone || null, age || null, gender || "M"],
          function (err) {
            if (err) return rej(err);
            patientId = this.lastID;
            res();
          }
        );
      });
    } catch (err) {
      console.error("Failed to auto-create patient:", err);
    }
  }

  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO reports
       (report_number, patient_prefix, patient_name, age, gender,
        doctor_id, template_id, report_type, sections, patient_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        patientId || null,
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

// ─── Get all reports (list view with pagination & filters) ─────────────────────
const getAllReports = (filters = {}) => {
  return new Promise((resolve, reject) => {
    const { page = 1, limit = 10, search = "", startDate, endDate, procedure, doctorId } = filters;
    
    let baseQuery = `
      FROM reports r
      LEFT JOIN doctors d ON r.doctor_id = d.id
      WHERE 1=1
    `;
    let countParams = [];
    
    if (search) {
      baseQuery += ` AND r.patient_name LIKE ?`;
      countParams.push(`%${search}%`);
    }
    if (startDate && endDate) {
      baseQuery += ` AND date(r.created_at) BETWEEN date(?) AND date(?)`;
      countParams.push(startDate, endDate);
    }
    if (procedure && procedure !== "All") {
      baseQuery += ` AND r.report_type = ?`;
      countParams.push(procedure);
    }
    if (doctorId && doctorId !== "All") {
      baseQuery += ` AND r.doctor_id = ?`;
      countParams.push(doctorId);
    }
    
    // First, get total count
    db.get(`SELECT COUNT(*) as total ${baseQuery}`, countParams, (err, countRow) => {
      if (err) return reject(err);
      
      const totalItems = countRow.total || 0;
      const totalPages = Math.ceil(totalItems / limit);
      
      const offset = (page - 1) * limit;
      let dataQuery = `
        SELECT r.id, r.report_number, r.patient_prefix, r.patient_name,
               r.age, r.gender, r.report_type, r.created_at,
               d.name AS doctor_name
        ${baseQuery}
        ORDER BY r.created_at DESC
        LIMIT ? OFFSET ?
      `;
      const dataParams = [...countParams, limit, offset];
      
      db.all(dataQuery, dataParams, (err, rows) => {
        if (err) return reject(err);
        resolve({
          data: rows || [],
          totalItems,
          totalPages,
          currentPage: page
        });
      });
    });
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
