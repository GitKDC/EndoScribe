const { ipcMain, app } = require("electron");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { getUserDataPath } = require("../utils/appPaths");

function registerImageHandlers() {
  console.log("📸 Image handler registered");

  ipcMain.handle("save-image", async (_, { base64, name }) => {

    try {
      console.log("📸 save-image called");
      const imagesDir = path.join(getUserDataPath(), "images");

      if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true });
      }

      const ext = name?.split(".").pop()?.toLowerCase();

      const safeExt = ["jpg", "jpeg", "png", "webp"].includes(ext)
        ? ext
        : "jpg";
      const fileName = `${uuidv4()}.${safeExt}`;
      const filePath = path.join(imagesDir, fileName);

      const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");

      fs.writeFileSync(filePath, base64Data, "base64");

      console.log("✅ Image saved:", filePath);

      return {
        success: true,
        filePath,
      };
    } catch (err) {
      console.error("❌ Image save failed:", err);
      throw err;
    }
  });
}

module.exports = { registerImageHandlers }; // ✅ THIS IS THE FIX