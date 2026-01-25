const { getDB, saveDB, mapResultToObjects } = require("../database.cjs");
const bcrypt = require("bcrypt");
const AUTH_CODES = require("../../../constants/authCodes.json");

// Get Top 5 Sales by Category
async function getTopSalesCategory(startDate, endDate) {
  try {
    const db = await getDB();
    endDate = endDate.trim() !== "" ? endDate : startDate;
    const dateCondition = "date(s.created_at) BETWEEN ? AND ?";
    const params = [startDate, endDate];
    const sql = `
        SELECT c.name AS category, sum(sd.quantity) AS sales 
        FROM category c
        INNER JOIN product p ON p.category_id = c.id
        INNER JOIN sale_detail sd ON p.id = sd.product_id
        INNER JOIN sale s ON sd.sale_id = s.id 
        WHERE sd.status_id = 4 AND ${dateCondition}
        GROUP BY c.name
        ORDER BY sales DESC
        LIMIT 5;
    `;

    const query = db.exec(sql, params);

    if (query.length === 0) {
      return { success: true, result: [] };
    }

    const data = mapResultToObjects(query);
    return { success: true, result: data };
  } catch (error) {
    console.error("Error getting top 5 sales category:", error);
    return { success: false, error: error.message };
  }
}

// Get Revenue
async function getRevenue() {
  try {
    const db = await getDB();
    const sql = `SELECT * FROM v_revenue`;

    const query = db.exec(sql);

    if (query.length === 0) {
      return { success: true, result: [] };
    }

    const data = mapResultToObjects(query);
    return { success: true, result: data };
  } catch (error) {
    console.error("Error getting revenue:", error);
    return { success: false, error: error.message };
  }
}

// Get Recent Sales
async function getRecentSales() {
  try {
    const db = await getDB();
    const sql = `SELECT * FROM v_recent_sales_products`;

    const query = db.exec(sql);

    if (query.length === 0) {
      return { success: true, result: [] };
    }

    const data = mapResultToObjects(query);
    return { success: true, result: data };
  } catch (error) {
    console.error("Error getting recent sales:", error);
    return { success: false, error: error.message };
  }
}

// Get Recent Sales
async function getSaleData(id) {
  try {
    const db = await getDB();
    const params = [id];
    const sqlSaleGeneral = `
      SELECT s.id, s.sale_num, st.description AS status, s.created_at, c.name AS customer, s.total_amount, s.discount, s.paid_amount   
      FROM sale s
      INNER JOIN status st ON s.status_id = st.id
      LEFT JOIN customer c ON s.customer_id = c.id 
      WHERE s.id = ?;
    `;

    const querySaleGeneral = db.exec(sqlSaleGeneral, params);

    if (querySaleGeneral.length === 0) {
      return { success: true, result: [] };
    }

    const sqlSaleDetail = `
      SELECT sd.id, p.name, sd.quantity, p.code_sku, sd.cost_price AS unit_price, (sd.quantity * sd.cost_price) AS subtotal     
      FROM sale_detail sd 
      INNER JOIN product p ON sd.product_id = p.id 
      WHERE sd.sale_id = ?;
    `;

    const querySaleDetail = db.exec(sqlSaleDetail, params);

    if (querySaleDetail.length === 0) {
      return { success: true, result: [] };
    }

    const dataSaleGeneral = mapResultToObjects(querySaleGeneral);
    const dataSaleDetail = mapResultToObjects(querySaleDetail);
    const data = { ...dataSaleGeneral[0], products: dataSaleDetail };

    return { success: true, result: data };
  } catch (error) {
    console.error("Error getting data sale:", error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  getTopSalesCategory,
  getRevenue,
  getRecentSales,
  getSaleData,
};
