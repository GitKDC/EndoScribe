const crypto = require("crypto");

const MASTER_SECRET = "ENDOSCRIBE_SECURE_2026_xYz987!";

function generateKey(hwid) {
  if (!hwid) {
    console.error("Please provide a Hardware ID (HWID).");
    console.log("Usage: node keygen.js <HWID>");
    process.exit(1);
  }

  const hash = crypto
    .createHmac("sha256", MASTER_SECRET)
    .update(hwid.trim())
    .digest("hex")
    .toUpperCase();

  const key = `${hash.substring(0, 8)}-${hash.substring(8, 16)}-${hash.substring(16, 24)}-${hash.substring(24, 32)}`;
  
  console.log(`\n🔑 Generated License Key for HWID: ${hwid}`);
  console.log(`--------------------------------------------------`);
  console.log(`License Key: ${key}\n`);
}

const args = process.argv.slice(2);
const hwid = args[0];

generateKey(hwid);
