const { getDB, saveDB, mapResultToObjects } = require("../database.cjs");
const bcrypt = require("bcrypt");
const AUTH_CODES = require("../../../constants/authCodes.json");

// Get Debt Detail
async function getDetailDebt(idSale) {
  try {
    const db = await getDB();
    const params = [idSale];
    const sql = `
        SELECT 
            s.id AS idSale, 
            s.total_amount AS debt_amount, 
            s.paid_amount AS debt_paid,
            (s.total_amount - s.paid_amount) AS debt_pending 
        FROM sale_detail sd 
        INNER JOIN sale s ON sd.sale_id = s.id
        INNER JOIN product p ON sd.product_id = p.id
        INNER JOIN customer cu ON s.customer_id = cu.id
        WHERE sd.status_id = 5 AND s.id = ?
        GROUP BY s.id;
    ;`;

    const query = db.exec(sql, params);

    if (query.length === 0) {
      return { success: true, result: [] };
    }

    const data = mapResultToObjects(query);
    return { success: true, result: data };
  } catch (error) {
    console.error("Error getting debt detail:", error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  getDetailDebt,
};
