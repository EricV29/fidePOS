const { getDB, saveDB, mapResultToObjects } = require("../database.cjs");
const bcrypt = require("bcrypt");
const AUTH_CODES = require("../../../constants/authCodes.json");
const { success } = require("zod");
const { CircleStop } = require("lucide-react");

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

// Get Sale Data
async function getSaleData(idSale) {
  try {
    const db = await getDB();
    const params = [idSale];
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

// Get Next Number Sale
async function getNextNumberSale() {
  try {
    const db = await getDB();
    const sql = `SELECT COALESCE(MAX(sale_num), 0) + 1 AS next_sale FROM sale;`;

    const query = db.exec(sql);

    if (query.length === 0) {
      return { success: true, result: [] };
    }

    const data = mapResultToObjects(query);
    return { success: true, result: data };
  } catch (error) {
    console.error("Error getting next number sale:", error);
    return { success: false, error: error.message };
  }
}

// Create New Sale
async function createNewSale(data) {
  const db = await getDB();
  try {
    const {
      nextNumberSale,
      customerId,
      products,
      subtotal,
      paid_amount,
      userId,
      discount,
      total,
      credit,
    } = data;

    db.exec("BEGIN TRANSACTION;");

    // Verify product stock
    for (const item of products) {
      const sqlStock = db.exec("SELECT stock FROM product WHERE id = ?;", [
        item.id,
      ]);
      const currentStock = sqlStock[0]?.values[0][0] || 0;

      if (currentStock < item.quantity) {
        db.exec("ROLLBACK;");
        return {
          success: false,
          error: AUTH_CODES.INSUFFICIENT_STOCK,
          result: item.id,
        };
      }
    }

    // Insert sale
    const statusSale = credit ? 5 : 4;
    const idCustomer = customerId ? customerId : null;
    const paidAmount = paid_amount ? paid_amount : 0;

    db.exec(
      "INSERT INTO sale (sale_num, total_amount, paid_amount, discount, customer_id, status_id, user_id) VALUES (?, ?, ?, ?, ?, ?, ?);",
      [
        nextNumberSale,
        total,
        paidAmount,
        discount,
        idCustomer,
        statusSale,
        userId,
      ],
    );

    // Get id sale
    const lastId = db.exec("SELECT last_insert_rowid();")[0].values[0][0];

    // Insert sale detail and update stock
    for (const product of products) {
      // Get cost product
      const queryCostProduct = db.exec(
        "SELECT cost_price FROM product WHERE id = ?;",
        [product.id],
      );

      const costPrice = queryCostProduct[0]?.values[0][0] ?? 0;
      const subtPrice = product.quantity * product.unit_price;
      const statusProduct = product.credit ? 5 : 4;

      const querySaleDeatil = db.exec(
        "INSERT INTO sale_detail (sale_id, product_id, quantity, cost_price, subt_price, status_id) VALUES (?, ?, ?, ?, ?, ?);",
        [
          lastId,
          product.id,
          product.quantity,
          costPrice,
          subtPrice,
          statusProduct,
        ],
      );

      // Update stock of product
      const queryUpdateStock = db.exec(
        "UPDATE product SET stock = stock - ? WHERE id = ?;",
        [product.quantity, product.id],
      );

      //! Update status of product
      // const queryUpdateStatusProduct = db.exec(
      //   "UPDATE product SET status_id = 0 WHERE id = ? AND stock <= 0;",
      //   [product.id],
      // );
    }

    if (credit) {
      // Update status customer
      const queryUpdateCustomer = db.exec(
        "UPDATE customer SET status_id = 3 WHERE id = ?;",
        [idCustomer],
      );

      // Insert pauyment
      const queryPayment = db.exec(
        "INSERT INTO payment(amount, note, sale_id) VALUES(?, ?, ?);",
        [paidAmount, "", lastId],
      );
    }

    db.exec("COMMIT;");
    await saveDB(db);
    return { success: true, result: AUTH_CODES.CREATE_NEW_SALE };
  } catch (error) {
    if (db) db.exec("ROLLBACK;");
    console.error("Error creating new sale:", error);
    return { success: false, error: error.message };
  }
}

// Get Number Sales
async function getNumberSales() {
  try {
    const db = await getDB();
    const sql = `SELECT * FROM v_number_sales`;

    const query = db.exec(sql);

    if (query.length === 0) {
      return { success: true, result: [] };
    }

    const data = mapResultToObjects(query);
    return { success: true, result: data };
  } catch (error) {
    console.error("Error getting number sales:", error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  getTopSalesCategory,
  getRevenue,
  getRecentSales,
  getSaleData,
  getNextNumberSale,
  createNewSale,
  getNumberSales,
};
