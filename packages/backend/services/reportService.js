const { getTemplate } = require("../repositories/templateRepo");

const generateReport = async (data, db) => {
  try {
    const { templateId } = data;

    let template = null;

    if (templateId) {
      template = await getTemplate(templateId, db);
      if (!template) throw new Error("Template not found");
    }

    // 🔥 NEW: dynamic sections support
    let sections = [];

    if (template?.sections) {
      sections = template.sections;
    } else {
      // fallback for old templates
      sections = [
        { title: "Esophagus", content: template?.esophagus || "" },
        { title: "Stomach", content: template?.stomach || "" },
        { title: "Duodenum", content: template?.duodenum || "" },
        { title: "Impression", content: template?.impression || "", highlight: true }
      ];
    }

    const report = {
      sections,
      generatedAt: new Date().toISOString(),
    };

    console.log("✅ Report generated:", {
      templateId,
      sectionCount: sections.length,
    });

    return report;

  } catch (error) {
    console.error("❌ Error in generateReport:", error);
    throw error;
  }
};

module.exports = { generateReport };