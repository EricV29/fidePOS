const AUTH_CODES = require("../../constants/authCodes.json");

async function contactDevs(data) {
  // Email sending disabled - will be implemented with cloud service later
  console.log("📧 Contact Devs - Email sending not yet implemented");
  return { success: false, error: "Email sending not yet implemented" };
}

module.exports = { contactDevs };
