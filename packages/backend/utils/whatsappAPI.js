const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const { getSetting } = require('../repositories/reportRepo');

async function sendWhatsAppReport(pdfPath, toPhoneNumber, isDoctor = false, reportData = {}) {
  try {
    const { patientName = "Patient", age = "", gender = "", reportType = "Medical" } = reportData;

    // 1. Fetch settings
    const token = await getSetting("whatsapp_access_token");
    const phoneId = await getSetting("whatsapp_phone_number_id");
    let templateName = await getSetting("whatsapp_template_name") || "report_ready"; // Fallback name
    
    if (isDoctor) {
      const doctorTemplate = await getSetting("whatsapp_doctor_template_name");
      if (doctorTemplate) {
        templateName = doctorTemplate;
      }
    }

    if (!token || !phoneId) {
      throw new Error("WhatsApp API credentials are not configured in settings.");
    }

    if (!fs.existsSync(pdfPath)) {
      throw new Error(`PDF file not found at path: ${pdfPath}`);
    }

    // Format phone number (remove +, spaces, dashes, etc.)
    let cleanPhone = toPhoneNumber.replace(/\D/g, '');
    
    // Auto-prepend Indian country code if missing (10 digits)
    if (cleanPhone.length === 10) {
      cleanPhone = '91' + cleanPhone;
    }

    if (!cleanPhone || cleanPhone.length < 11) {
      throw new Error("Invalid phone number. Must include country code.");
    }

    // 2. Upload the PDF to Meta's servers
    const formData = new FormData();
    formData.append('file', fs.createReadStream(pdfPath));
    formData.append('type', 'application/pdf');
    formData.append('messaging_product', 'whatsapp');

    const uploadResponse = await axios.post(
      `https://graph.facebook.com/v19.0/${phoneId}/media`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          ...formData.getHeaders()
        }
      }
    );

    const mediaId = uploadResponse.data.id;
    if (!mediaId) {
      throw new Error("Failed to get media ID from WhatsApp API");
    }

    // Prepare body parameters dynamically
    let bodyParameters = [];
    if (isDoctor) {
      bodyParameters = [
        { type: "text", parameter_name: "patient_name", text: patientName || "Patient" },
        { type: "text", parameter_name: "patient_age", text: String(age) || " " },
        { type: "text", parameter_name: "patient_gender", text: gender || " " },
        { type: "text", parameter_name: "report_name", text: reportType || "Medical" }
      ];
    } else {
      bodyParameters = [
        { type: "text", parameter_name: "report_name", text: reportType || "Medical" } 
      ];
    }

    // 3. Send the template message with the attached media
    const messagePayload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: cleanPhone,
      type: "template",
      template: {
        name: templateName,
        language: {
          code: "en" 
        },
        components: [
          {
            type: "header",
            parameters: [
              {
                type: "document",
                document: {
                  id: mediaId,
                  filename: `Report_${patientName.replace(/\s+/g, '_')}.pdf`
                }
              }
            ]
          },
          {
            type: "body",
            parameters: bodyParameters
          }
        ]
      }
    };

    const sendResponse = await axios.post(
      `https://graph.facebook.com/v19.0/${phoneId}/messages`,
      messagePayload,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return { success: true, messageId: sendResponse.data.messages[0].id };

  } catch (error) {
    console.error("WhatsApp API Error:");
    if (error.response) {
      console.error(JSON.stringify(error.response.data, null, 2));
      throw new Error(error.response.data.error?.message || "WhatsApp API Error");
    } else {
      console.error(error.message);
      throw error;
    }
  }
}

module.exports = {
  sendWhatsAppReport
};
