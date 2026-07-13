const { ipcMain } = require("electron");
const { machineIdSync } = require("node-machine-id");
const crypto = require("crypto");
const { getSetting, setSetting } = require("../repositories/reportRepo");

const MASTER_SECRET = "ENDOSCRIBE_SECURE_2026_xYz987!";

const registerLicenseHandlers = () => {
  ipcMain.handle("license:verify", async () => {
    try {
      const hwid = machineIdSync(true); // true = original machine ID (unhashed)
      const savedLicense = await getSetting("software_license_key");

      if (!savedLicense) {
        return { valid: false, hwid, reason: "No license key found." };
      }

      // Generate the expected hash for this specific machine
      const expectedHash = crypto
        .createHmac("sha256", MASTER_SECRET)
        .update(hwid)
        .digest("hex")
        .toUpperCase();
      
      const expectedKey = `${expectedHash.substring(0, 8)}-${expectedHash.substring(8, 16)}-${expectedHash.substring(16, 24)}-${expectedHash.substring(24, 32)}`;

      if (savedLicense === expectedKey) {
        return { valid: true, hwid };
      } else {
        return { valid: false, hwid, reason: "License key is invalid for this machine." };
      }
    } catch (error) {
      console.error("Error verifying license:", error);
      return { valid: false, hwid: "ERROR", reason: error.message };
    }
  });

  ipcMain.handle("license:save", async (event, newLicenseKey) => {
    try {
      if (!newLicenseKey) {
        return { success: false, message: "Please provide a valid license key." };
      }

      // We save it to the DB. The next verify call will check if it's correct.
      await setSetting("software_license_key", newLicenseKey.trim().toUpperCase());
      
      // Instantly verify it to return success state to the UI
      const hwid = machineIdSync(true);
      const expectedHash = crypto
        .createHmac("sha256", MASTER_SECRET)
        .update(hwid)
        .digest("hex")
        .toUpperCase();
      
      const expectedKey = `${expectedHash.substring(0, 8)}-${expectedHash.substring(8, 16)}-${expectedHash.substring(16, 24)}-${expectedHash.substring(24, 32)}`;

      if (newLicenseKey.trim().toUpperCase() === expectedKey) {
        return { success: true, message: "License successfully verified and saved!" };
      } else {
        // We saved it, but it's wrong. Let's clear it so they can try again.
        await setSetting("software_license_key", "");
        return { success: false, message: "Invalid license key for this machine." };
      }

    } catch (error) {
      console.error("Error saving license:", error);
      return { success: false, message: error.message };
    }
  });
};

module.exports = { registerLicenseHandlers };
