const fs = require("fs");
const path = require("path");
const { app, safeStorage } = require("electron");

function haveEmailKeys() {
  try {
    const userDataPath = app.getPath("userData");
    const configPath = path.join(userDataPath, "config.bin");

    // File Exists?
    if (!fs.existsSync(configPath)) return false;

    // Read and Decrypt
    const encryptedBuffer = fs.readFileSync(configPath);
    const decryptedString = safeStorage.decryptString(encryptedBuffer);
    const config = JSON.parse(decryptedString);

    // Verify Content
    if (
      config.email_user &&
      config.email_pass &&
      config.email_user.trim() !== "" &&
      config.email_pass.trim() !== ""
    ) {
      return {
        success: true,
        email_user: config.email_user,
        email_pass: config.email_pass,
      };
    }

    return false;
  } catch (error) {
    console.error("❌ Error get email keys:", error.message);
    return false;
  }
}

module.exports = { haveEmailKeys };
