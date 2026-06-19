CREATE TABLE IF NOT EXISTS templates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  category TEXT,
  sections TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_name TEXT,
  age INTEGER,
  gender TEXT,
  template_id INTEGER,

  sections TEXT,  

  pdf_path TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
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