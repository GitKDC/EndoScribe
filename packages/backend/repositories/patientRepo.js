const db = require("../db/db");

const patientRepo = {
  // Create a new patient
  createPatient: (data) => {
    return new Promise((resolve, reject) => {
      const { name, phone, age, gender } = data;
      const query = `
        INSERT INTO patients (name, phone, age, gender)
        VALUES (?, ?, ?, ?)
      `;
      db.run(query, [name, phone, age, gender], function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID, ...data });
      });
    });
  },

  // Get patients with optional search, including report count and last visit
  searchPatients: (searchQuery = "") => {
    return new Promise((resolve, reject) => {
      let query = `
        SELECT 
          p.id, p.name, p.phone, p.age, p.gender, p.created_at,
          COUNT(r.id) as report_count,
          MAX(r.created_at) as last_visit
        FROM patients p
        LEFT JOIN reports r ON p.id = r.patient_id
      `;
      
      const params = [];
      if (searchQuery) {
        query += ` WHERE p.name LIKE ? OR p.phone LIKE ?`;
        params.push(`%${searchQuery}%`, `%${searchQuery}%`);
      }
      
      query += ` GROUP BY p.id ORDER BY p.updated_at DESC`;

      db.all(query, params, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },

  // Get a specific patient, along with their reports
  getPatient: (id) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM patients WHERE id = ?`;
      db.get(query, [id], (err, patient) => {
        if (err) return reject(err);
        if (!patient) return resolve(null);

        // Fetch their reports
        const reportQuery = `
          SELECT id, report_number, report_type, created_at, doctor_id
          FROM reports
          WHERE patient_id = ?
          ORDER BY created_at DESC
        `;
        db.all(reportQuery, [id], (err2, reports) => {
          if (err2) return reject(err2);
          patient.reports = reports;
          resolve(patient);
        });
      });
    });
  },

  // Update a patient
  updatePatient: (id, data) => {
    return new Promise((resolve, reject) => {
      const { name, phone, age, gender } = data;
      const query = `
        UPDATE patients
        SET name = ?, phone = ?, age = ?, gender = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      db.run(query, [name, phone, age, gender, id], function (err) {
        if (err) return reject(err);
        resolve({ changes: this.changes });
      });
    });
  },

  // Delete a patient
  deletePatient: (id) => {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM patients WHERE id = ?`;
      db.run(query, [id], function (err) {
        if (err) return reject(err);
        resolve({ changes: this.changes });
      });
    });
  }
};

module.exports = patientRepo;
