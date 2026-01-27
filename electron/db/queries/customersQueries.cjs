const { getDB, saveDB, mapResultToObjects } = require("../database.cjs");
const bcrypt = require("bcrypt");
const AUTH_CODES = require("../../../constants/authCodes.json");

// Get Accounts Receivable
async function getAccountsReceivable() {
  try {
    const db = await getDB();
    const sql = `SELECT * FROM v_accounts_receivable`;

    const query = db.exec(sql);

    if (query.length === 0) {
      return { success: true, result: [] };
    }

    const data = mapResultToObjects(query);
    return { success: true, result: data };
  } catch (error) {
    console.error("Error getting accounts receivable:", error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  getAccountsReceivable,
};
