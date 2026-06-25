const db = require("../db/db");

const referralRepo = {
  // Create a new referral doctor
  createReferral: (data) => {
    return new Promise((resolve, reject) => {
      const { name, phone, clinic_name, city } = data;
      const query = `
        INSERT INTO referral_doctors (name, phone, clinic_name, city)
        VALUES (?, ?, ?, ?)
      `;
      db.run(query, [name, phone, clinic_name, city], function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID, ...data });
      });
    });
  },

  // Get referral doctors with optional search and pagination
  searchReferrals: (filters = {}) => {
    return new Promise((resolve, reject) => {
      const search = filters.search || "";
      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const offset = (page - 1) * limit;

      let baseQuery = `FROM referral_doctors r`;
      let countParams = [];

      if (search) {
        baseQuery += ` WHERE r.name LIKE ? OR r.phone LIKE ? OR r.clinic_name LIKE ? OR r.city LIKE ?`;
        countParams.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
      }

      const countQuery = `SELECT COUNT(*) as total ${baseQuery}`;

      db.get(countQuery, countParams, (err, countResult) => {
        if (err) return reject(err);
        const total = countResult.total;

        const dataQuery = `
          SELECT 
            r.id, r.name, r.phone, r.clinic_name, r.city, r.created_at,
            (SELECT COUNT(*) FROM reports rep WHERE rep.referral_doctor_id = r.id) as referred_count
          ${baseQuery}
          ORDER BY r.updated_at DESC
          LIMIT ? OFFSET ?
        `;

        db.all(dataQuery, [...countParams, limit, offset], (err, rows) => {
          if (err) return reject(err);
          resolve({ data: rows, total });
        });
      });
    });
  },

  // Get a specific referral doctor
  getReferral: (id) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM referral_doctors WHERE id = ?`;
      db.get(query, [id], (err, doctor) => {
        if (err) return reject(err);
        resolve(doctor);
      });
    });
  },

  // Update a referral doctor
  updateReferral: (id, data) => {
    return new Promise((resolve, reject) => {
      const { name, phone, clinic_name, city } = data;
      const query = `
        UPDATE referral_doctors
        SET name = ?, phone = ?, clinic_name = ?, city = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      db.run(query, [name, phone, clinic_name, city, id], function (err) {
        if (err) return reject(err);
        resolve({ changes: this.changes });
      });
    });
  },

  // Delete a referral doctor
  deleteReferral: (id) => {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM referral_doctors WHERE id = ?`;
      db.run(query, [id], function (err) {
        if (err) return reject(err);
        resolve({ changes: this.changes });
      });
    });
  }
};

module.exports = referralRepo;
