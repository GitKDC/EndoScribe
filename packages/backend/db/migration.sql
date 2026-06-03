CREATE TABLE IF NOT EXISTS templates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  category TEXT,
  esophagus TEXT,
  stomach TEXT,
  duodenum TEXT,
  impression TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_name TEXT,
  age INTEGER,
  gender TEXT,
  template_id INTEGER,
  esophagus TEXT,
  stomach TEXT,
  duodenum TEXT,
  impression TEXT,
  pdf_path TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  report_id INTEGER,
  file_path TEXT,
  position INTEGER
);