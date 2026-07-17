const db = require("../db/db");
const crypto = require("crypto");

const hashPassword = (password, salt) => {
  return crypto.scryptSync(password, salt, 64).toString("hex");
};

const userRepo = {
  getUsersCount: () => {
    return new Promise((resolve, reject) => {
      db.get("SELECT COUNT(*) as count FROM users", [], (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });
  },

  getAllUsers: () => {
    return new Promise((resolve, reject) => {
      db.all("SELECT id, username, role, created_at FROM users ORDER BY created_at ASC", [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  createUser: (username, password, role = "user") => {
    return new Promise((resolve, reject) => {
      // 16 bytes salt
      const salt = crypto.randomBytes(16).toString("hex");
      const hash = hashPassword(password, salt);

      db.run(
        "INSERT INTO users (username, password_hash, salt, role) VALUES (?, ?, ?, ?)",
        [username, hash, salt, role],
        function (err) {
          if (err) {
            // E.g. UNIQUE constraint failed
            reject(err);
          } else {
            resolve({ id: this.lastID, username, role });
          }
        }
      );
    });
  },

  verifyUser: (username, password) => {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
        if (err) return reject(err);
        if (!user) return resolve(null); // User not found

        const hash = hashPassword(password, user.salt);
        if (hash === user.password_hash) {
          resolve({ id: user.id, username: user.username, role: user.role });
        } else {
          resolve(null); // Invalid password
        }
      });
    });
  },

  deleteUser: (id) => {
    return new Promise((resolve, reject) => {
      db.run("DELETE FROM users WHERE id = ?", [id], function (err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      });
    });
  },

  // ─── RECOVERY ────────────────────────────────────────────────────────────

  generateRecoveryKey: () => {
    return new Promise((resolve, reject) => {
      // Format: XXXX-XXXX-XXXX-XXXX
      const rawKey = crypto.randomBytes(8).toString("hex").toUpperCase();
      const formattedKey = rawKey.match(/.{1,4}/g).join("-");
      
      const salt = crypto.randomBytes(16).toString("hex");
      const hash = hashPassword(formattedKey, salt);

      // Save both the hash and salt to the settings table
      db.serialize(() => {
        db.run("INSERT OR REPLACE INTO settings (key, value) VALUES ('recovery_key_hash', ?)", [hash]);
        db.run("INSERT OR REPLACE INTO settings (key, value) VALUES ('recovery_key_salt', ?)", [salt], (err) => {
          if (err) reject(err);
          else resolve(formattedKey); // We return the plain key ONLY once to show the user
        });
      });
    });
  },

  verifyRecoveryKey: (key) => {
    return new Promise((resolve, reject) => {
      db.all("SELECT key, value FROM settings WHERE key IN ('recovery_key_hash', 'recovery_key_salt')", [], (err, rows) => {
        if (err) return reject(err);
        
        let hashEntry = rows.find(r => r.key === "recovery_key_hash")?.value;
        let saltEntry = rows.find(r => r.key === "recovery_key_salt")?.value;

        if (!hashEntry || !saltEntry) {
          return resolve(false); // No recovery key was ever generated
        }

        const cleanedKey = key.trim().toUpperCase();
        const computedHash = hashPassword(cleanedKey, saltEntry);
        
        if (computedHash === hashEntry) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  },

  resetAdminPassword: (newPassword) => {
    return new Promise((resolve, reject) => {
      // Find the admin user (or any primary user). For simplicity, we update the user with role 'admin'
      db.get("SELECT id FROM users WHERE role = 'admin' ORDER BY id ASC LIMIT 1", [], (err, user) => {
        if (err) return reject(err);
        if (!user) return reject(new Error("No admin user found to reset"));

        const salt = crypto.randomBytes(16).toString("hex");
        const hash = hashPassword(newPassword, salt);

        db.run("UPDATE users SET password_hash = ?, salt = ? WHERE id = ?", [hash, salt, user.id], function(err) {
          if (err) reject(err);
          else resolve({ success: true, changes: this.changes });
        });
      });
    });
  }
};

module.exports = userRepo;
