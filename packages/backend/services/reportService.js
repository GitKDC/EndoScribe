const { getTemplate } = require("../repositories/templateRepo");

const generateReport = async (data, db) => {
  try {
    const { templateId, esophagus, stomach, duodenum, impression } = data;

    // Fetch template if ID provided
    let template = null;
    if (templateId) {
      template = await getTemplate(templateId, db);
      if (!template) {
        throw new Error("Template not found");
      }
    }

    // Generate report with fallback to template or provided data
    const report = {
      esophagus: esophagus || template?.esophagus || "",
      stomach: stomach || template?.stomach || "",
      duodenum: duodenum || template?.duodenum || "",
      impression: impression || template?.impression || "",
      generatedAt: new Date().toISOString(),
    };

    console.log("✅ Report generated:", {
      templateId,
      hasEsophagus: !!report.esophagus,
      hasStomach: !!report.stomach,
      hasDuodenum: !!report.duodenum,
      hasImpression: !!report.impression,
    });

    return report;
  } catch (error) {
    console.error("❌ Error in generateReport:", error);
    throw error;
  }
};

module.exports = { generateReport };