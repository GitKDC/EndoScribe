const { ipcMain } = require("electron");
const { sendWhatsAppReport } = require("../utils/whatsappAPI");

const registerWhatsappHandlers = () => {
  ipcMain.handle("whatsapp:sendReport", async (event, pdfPath, toPhoneNumber, isDoctor, reportData) => {
    try {
      console.log(`📨 IPC HIT: whatsapp:sendReport to ${toPhoneNumber}`);
      const result = await sendWhatsAppReport(pdfPath, toPhoneNumber, isDoctor, reportData);
      console.log("✅ WhatsApp message sent successfully:", result);
      return result;
    } catch (error) {
      console.error("❌ Error sending WhatsApp message:", error);
      return { success: false, message: error.message };
    }
  });
};

module.exports = { registerWhatsappHandlers };
