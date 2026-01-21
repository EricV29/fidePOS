const dns = require("dns");
const AUTH_CODES = require("../../constants/authCodes.json");

async function hasRealInternet() {
  return new Promise((resolve) => {
    dns.lookup("google.com", (err) => {
      if (err) {
        resolve({
          success: false,
          error: AUTH_CODES.HAS_NOT_INTERNET,
        });
      } else {
        resolve({
          success: true,
        });
      }
    });
  });
}

module.exports = { hasRealInternet };
