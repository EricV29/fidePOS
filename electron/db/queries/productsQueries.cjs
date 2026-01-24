const { getDB, saveDB, mapResultToObjects } = require("../database.cjs");
const bcrypt = require("bcrypt");
const AUTH_CODES = require("../../../constants/authCodes.json");

// Get Active Products by Category
async function getActiveProductsCategory() {
  try {
    const db = await getDB();
    const sql = `SELECT * FROM v_active_products_by_category`;

    const query = db.exec(sql);

    if (query.length === 0) {
      return { success: true, result: [] };
    }

    const data = mapResultToObjects(query);
    return { success: true, result: data };
  } catch (error) {
    console.error("Error getting active products by category:", error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  getActiveProductsCategory,
  //getInvestment,
};
