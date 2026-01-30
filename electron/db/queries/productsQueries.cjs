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

// Get Investment
async function getInvestment() {
  try {
    const db = await getDB();
    const sql = `SELECT * FROM v_investment`;

    const query = db.exec(sql);

    if (query.length === 0) {
      return { success: true, result: [] };
    }

    const data = mapResultToObjects(query);
    return { success: true, result: data };
  } catch (error) {
    console.error("Error getting investment:", error);
    return { success: false, error: error.message };
  }
}

// Get Category Options
async function getCategoryOptions() {
  try {
    const db = await getDB();
    const sql = `SELECT * FROM v_category_options`;

    const query = db.exec(sql);

    if (query.length === 0) {
      return { success: true, result: [] };
    }

    const data = mapResultToObjects(query);
    return { success: true, result: data };
  } catch (error) {
    console.error("Error getting category options:", error);
    return { success: false, error: error.message };
  }
}

// Get Products List
async function getProductsList(idCategory, limit, offset) {
  try {
    const db = await getDB();
    const filterParam = idCategory || null;
    const params = [filterParam, limit, offset];
    const categoryCondition = idCategory
      ? "WHERE p.category_id = ?"
      : "WHERE ? IS NULL";
    const sql = `
      SELECT 
        p.id, 
        p.code_sku, 
        p.name AS product, 
        p.description, 
        c.name AS category, 
        c.color AS ccolor, 
        p.unit_price,
        p.stock 
      FROM product p
      INNER JOIN category c ON p.category_id = c.id
      ${categoryCondition}
      ORDER BY p.stock DESC
      LIMIT ? OFFSET ?;
    `;

    const sqlCount = `
      SELECT COUNT(*) as total 
      FROM product p
      INNER JOIN category c ON p.category_id = c.id
      ${categoryCondition};
    `;

    const query = db.exec(sql, params);
    const queryCount = db.exec(sqlCount, filterParam);

    if (query.length === 0) {
      return { success: true, result: [] };
    }

    const totalCount = queryCount.length > 0 ? queryCount[0].values[0][0] : 0;

    const data = mapResultToObjects(query);
    return { success: true, result: data, totalCount: totalCount };
  } catch (error) {
    console.error("Error getting products list:", error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  getActiveProductsCategory,
  getInvestment,
  getCategoryOptions,
  getProductsList,
};
