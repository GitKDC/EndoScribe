🏥 EndoScribe — Intelligent Endoscopy Report Generator

EndoScribe is a desktop application designed to automate clinical endoscopy report generation. It enables doctors to generate structured, image-integrated reports quickly using predefined templates, reducing manual effort and improving consistency.

🚀 Features
📄 Template-based report generation (Esophagus, Stomach, Duodenum, Impression)
🖼️ Multi-image upload with labeling and structured layout
🧠 Smart template selection to minimize manual edits
📥 PDF export using jsPDF + html2canvas
🖨️ Direct print support for clinical workflows
⚡ Offline-first architecture (no internet dependency)
🗂️ SQLite-based local storage for templates and reports
🛠️ Tech Stack
Frontend: Next.js (TypeScript)
Desktop App: Electron
Backend (Local): Node.js
Database: SQLite
PDF Generation: jsPDF + html2canvas
🧠 Architecture
Electron (Main Process)
        ↓
Preload (Secure IPC Bridge)
        ↓
Next.js Frontend (Renderer)
        ↓
Backend Services (SQLite + Template Engine)
🎯 Problem Solved

Traditional clinical report creation is:

repetitive
time-consuming
error-prone

EndoScribe reduces report generation time by:
👉 60–70% using template-driven automation

🚧 Status

🔄 Ongoing Project
Currently working on:

Multi-page PDF layout optimization
Cloud sync for research data
Advanced template intelligence
🔮 Future Enhancements
AI-assisted template suggestion
Report analytics dashboard
Cloud backup & sharing
Role-based access (multi-user)
