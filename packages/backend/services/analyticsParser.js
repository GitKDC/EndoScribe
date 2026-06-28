const db = require("../db/db");

/**
 * Parses report sections, detects diseases and their anatomical locations,
 * and saves the structured data to report_diseases table.
 */
async function parseReportDiseases(reportId, patientId, sections) {
  if (!sections || !Array.isArray(sections)) return;

  try {
    // 1. Load dictionaries
    const diseases = await new Promise((res, rej) => {
      db.all("SELECT * FROM disease_dictionary", (err, rows) => {
        if (err) return rej(err);
        res(rows.map(r => ({ ...r, keywords: JSON.parse(r.keywords || "[]") })));
      });
    });

    const organs = await new Promise((res, rej) => {
      db.all("SELECT * FROM organ_dictionary", (err, rows) => {
        if (err) return rej(err);
        res(rows.map(r => ({ ...r, keywords: JSON.parse(r.keywords || "[]") })));
      });
    });

    const detected = [];

    // Helper to find organ in text
    const findOrgan = (text) => {
      const lower = text.toLowerCase();
      for (const organ of organs) {
        if (organ.keywords.some(kw => lower.includes(kw.toLowerCase()))) {
          return organ.name;
        }
      }
      return null;
    };

    // 2. Parse sections
    for (const section of sections) {
      const title = section.title || "";
      const content = section.content || "";
      if (!content.trim()) continue;

      // Detect implicit organ from section title (e.g. "Stomach")
      const contextOrgan = findOrgan(title);

      const sentences = content.split(/(?:\.|\n)+/); // Split by dot or newline

      for (const sentence of sentences) {
        const lowerSentence = sentence.toLowerCase();

        for (const disease of diseases) {
          // Check if disease keywords exist in this sentence
          if (disease.keywords.some(kw => lowerSentence.includes(kw.toLowerCase()))) {
            // Find specific organ in this sentence, fallback to section title organ, fallback to general
            let organName = findOrgan(sentence) || contextOrgan || "General/GI Tract";
            
            // Prevent duplicates in the same report
            const exists = detected.some(d => d.disease === disease.name && d.organ === organName);
            if (!exists) {
              detected.push({ disease: disease.name, organ: organName });
            }
          }
        }
      }
    }

    // 3. Clear old records for this report (in case of update)
    await new Promise((res, rej) => {
      db.run("DELETE FROM report_diseases WHERE report_id = ?", [reportId], (err) => {
        if (err) return rej(err);
        res();
      });
    });

    // 4. Insert new records
    if (detected.length > 0) {
      const stmt = db.prepare("INSERT INTO report_diseases (report_id, patient_id, disease_name, organ_name) VALUES (?, ?, ?, ?)");
      for (const d of detected) {
        stmt.run(reportId, patientId, d.disease, d.organ);
      }
      stmt.finalize();
    }

    console.log(`✅ Analytics Parser: Found ${detected.length} diseases in report ${reportId}`);

  } catch (err) {
    console.error("❌ Analytics Parser error:", err);
  }
}

module.exports = {
  parseReportDiseases
};
