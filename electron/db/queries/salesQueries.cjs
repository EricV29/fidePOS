const { getInstance, saveDB } = require("../database.cjs");
const bcrypt = require("bcrypt");
const AUTH_CODES = require("../../../constants/authCodes.json");

//* Mapping results
function mapResultToObjects(result) {
  if (!result[0]) return [];

  const columns = result[0].columns;
  const values = result[0].values;

  return values.map((row) => {
    const obj = {};
    row.forEach((val, i) => {
      obj[columns[i]] = val;
    });
    return obj;
  });
}

// Get Top 5 Sales by Category
async function getTopSalesCategory() {
  try {
    const db = await getInstance();
    const query = db.exec(
      "SELECT u.id, u.name, u.last_name, u.email, u.phone, u.img, r.description AS role, s.description AS status, u.created_at, u.deleted_at FROM user AS u INNER JOIN role AS r ON u.role_id = r.id INNER JOIN status AS s ON u.status_id = s.id;",
    );

    if (query.length === 0) {
      return { success: true, result: [] };
    }

    const users = mapResultToObjects(query);

    return { success: true, result: users };
  } catch (error) {
    console.error("Error getting users:", error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  getTopSalesCategory,
  //getRevenue,
  //getRecentSales,
};
