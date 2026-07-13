const crypto = require("crypto");

// THIS IS YOUR MASTER SECRET. DO NOT LOSE THIS OR SHARE IT.
// If this changes, all previously generated licenses will become invalid.
const MASTER_SECRET = "ENDOSCRIBE_SECURE_2026_xYz987!";

function generateLicense(machineId) {
  if (!machineId) {
    console.error("❌ Error: You must provide a Machine ID.");
    console.log("Usage: node generate-license.js <machine-id>");
    process.exit(1);
  }

  // Generate a SHA-256 hash using the machine ID and the master secret
  const hash = crypto
    .createHmac("sha256", MASTER_SECRET)
    .update(machineId)
    .digest("hex")
    .toUpperCase(); // Make it uppercase for a professional look

  // Format it like a standard software key: XXXX-XXXX-XXXX-XXXX
  const formattedKey = `${hash.substring(0, 8)}-${hash.substring(8, 16)}-${hash.substring(16, 24)}-${hash.substring(24, 32)}`;

  console.log("==========================================");
  console.log("✅ ENDOSCRIBE LICENSE GENERATOR");
  console.log("==========================================");
  console.log(`Machine ID : ${machineId}`);
  console.log(`License Key: ${formattedKey}`);
  console.log("==========================================");
  console.log("Give this exact License Key to the hospital.");
}

// Get the machine ID from the command line arguments
const arg = process.argv[2];
generateLicense(arg);
