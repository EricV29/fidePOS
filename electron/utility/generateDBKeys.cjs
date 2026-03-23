const crypto = require("crypto");

async function generateDBSecurity() {
  const db_password = crypto.randomBytes(32).toString("base64");
  const db_salt = crypto.randomBytes(16).toString("hex");

  console.log("🔑 CREATE KEYS");

  return {
    db_password,
    db_salt,
  };
}

module.exports = {
  generateDBSecurity,
};
