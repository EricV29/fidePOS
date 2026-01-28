const { getDB, saveDB, mapResultToObjects } = require("../database.cjs");
const bcrypt = require("bcrypt");
const AUTH_CODES = require("../../../constants/authCodes.json");

// Get Payments by Debt
async function getPaymentsDebt(idSale) {
  try {
    const db = await getDB();
    const params = [idSale];
    const sql = `SELECT id, created_at, amount, note FROM payment WHERE sale_id = ? ORDER BY created_at DESC;`;

    const query = db.exec(sql, params);

    if (query.length === 0) {
      return { success: true, result: [] };
    }

    const data = mapResultToObjects(query);
    return { success: true, result: data };
  } catch (error) {
    console.error("Error getting payments debt:", error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  getPaymentsDebt,
};
