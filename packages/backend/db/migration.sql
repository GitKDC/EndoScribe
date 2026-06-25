CREATE TABLE IF NOT EXISTS patients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT,
  age INTEGER,
  gender TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS templates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  category TEXT,
  sections TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  report_number TEXT UNIQUE,
  patient_prefix TEXT DEFAULT 'Mr.',
  patient_name TEXT,
  age INTEGER,
  gender TEXT,
  doctor_id INTEGER,
  template_id INTEGER,
  report_type TEXT,
  sections TEXT,
  pdf_path TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id)
);

CREATE TABLE IF NOT EXISTS images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  report_id INTEGER,
  file_path TEXT,
  position INTEGER
);

CREATE TABLE IF NOT EXISTS doctors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  qualifications TEXT,
  designation TEXT,
  is_default INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Settings: key-value store for app config
CREATE TABLE IF NOT EXISTS referral_doctors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT,
  clinic_name TEXT,
  city TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  default_sections TEXT,
  color_bg TEXT DEFAULT '#f1f5f9',
  color_fg TEXT DEFAULT '#475569'
);

-- Seed Categories if empty
INSERT OR IGNORE INTO categories (name, color_bg, color_fg, default_sections) VALUES 
('UGI', '#ccfbf1', '#0d9488', '[{"title":"Esophagus","content":""},{"title":"Stomach","content":""},{"title":"Duodenal Cap","content":""},{"title":"IInd Part of Duodenum","content":""},{"title":"Impression","content":"","highlight":true}]'),
('VLS', '#ede9fe', '#7c3aed', '[{"title":"Vocal Cords","content":""},{"title":"Impression","content":"","highlight":true}]'),
('SIGMOIDOSCOPY', '#fef3c7', '#b45309', '[{"title":"Rectum","content":""},{"title":"Sigmoid Colon","content":""},{"title":"Impression","content":"","highlight":true}]'),
('COLONOSCOPY', '#dbeafe', '#2563eb', '[{"title":"Rectum","content":""},{"title":"Colon","content":""},{"title":"Caecum","content":""},{"title":"Impression","content":"","highlight":true}]'),
('ERCP', '#fee2e2', '#dc2626', '[{"title":"Papilla","content":""},{"title":"CBD","content":""},{"title":"Impression","content":"","highlight":true}]'),
('ENTEROSCOPY', '#fce7f3', '#be185d', '[{"title":"Jejunum","content":""},{"title":"Impression","content":"","highlight":true}]');

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT
);

-- Default settings (INSERT OR IGNORE = don't overwrite if already set)
INSERT OR IGNORE INTO settings (key, value) VALUES ('report_prefix', 'SH');
INSERT OR IGNORE INTO settings (key, value) VALUES ('last_backup_date', NULL);
INSERT OR IGNORE INTO settings (key, value) VALUES ('auto_backup_enabled', '1');

-- Add new columns to existing reports table if upgrading
-- (ALTER TABLE fails silently in older SQLite if column exists)
ALTER TABLE reports ADD COLUMN patient_id INTEGER REFERENCES patients(id);
ALTER TABLE reports ADD COLUMN referral_doctor_id INTEGER REFERENCES referral_doctors(id);