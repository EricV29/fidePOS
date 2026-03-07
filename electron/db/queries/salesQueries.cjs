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
async function getRevenue(filters) {
  const db = await getDB();

  try {
    const start = filters?.startDate || "";
    const end = filters?.endDate || "";
    let sql = "";
    let whereClause = "";

    if (filters) {
      whereClause = `WHERE sd.status_id = 4 AND s.created_at BETWEEN '${start} 00:00:00' AND '${end} 23:59:59'`;

      sql = `
      SELECT 
        SUM((sd.subt_price - sd.cost_price) * sd.quantity) AS revenue
      FROM sale_detail sd
      INNER JOIN sale s ON sd.sale_id = s.id 
      ${whereClause};
      `;
    } else {
      sql = `SELECT * FROM v_revenue`;
    }

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

// Get Sales Number
async function getSalesNumberAmount(filters) {
  const db = await getDB();

  try {
    const start = filters?.startDate || "";
    const end = filters?.endDate || "";
    let sqlNumber = "";
    let sqlAmount = "";
    let whereClauseNumber = "";
    let whereClauseAmount = "";

    if (filters) {
      whereClauseNumber = `WHERE status_id = 4 AND created_at BETWEEN '${start} 00:00:00' AND '${end} 23:59:59'`;
      whereClauseAmount = `WHERE sd.status_id = 4 AND s.created_at BETWEEN '${start} 00:00:00' AND '${end} 23:59:59'`;

      sqlNumber = `
      SELECT 
        COUNT(id) AS salesNumber
      FROM sale
      ${whereClauseNumber};`;

      sqlAmount = `
      SELECT 
        SUM(sd.subt_price) salesAmount
      FROM sale_detail sd
      INNER JOIN sale s ON sd.sale_id = s.id
      ${whereClauseAmount};`;
    } else {
      sqlNumber = `SELECT * FROM v_sales_number;`;
      sqlAmount = `SELECT * FROM v_sales_amount;`;
    }

    const queryNumber = db.exec(sqlNumber);
    const queryAmount = db.exec(sqlAmount);

    if (queryNumber.length === 0 || queryAmount.length === 0) {
      return { success: true, result: [] };
    }

    const dataNumber = mapResultToObjects(queryNumber);
    const dataAmount = mapResultToObjects(queryAmount);

    return { success: true, result: { dataNumber, dataAmount } };
  } catch (error) {
    console.error("Error getting sales number:", error);
    return { success: false, error: error.message };
  }
}

// Get Pending Sales Amount
async function getPendingSalesAmount(filters) {
  const db = await getDB();

  try {
    const start = filters?.startDate || "";
    const end = filters?.endDate || "";
    let sql = "";
    let whereClause = "";

    if (filters) {
      whereClause = `WHERE status_id = 5 AND created_at BETWEEN '${start} 00:00:00' AND '${end} 23:59:59'`;

      sql = `
      SELECT 
        SUM(total_amount - paid_amount) AS pendingSalesAmount
      FROM sale
      ${whereClause};
      `;
    } else {
      sql = `SELECT * FROM v_pending_sales_amount`;
    }

    const query = db.exec(sql);

    if (query.length === 0) {
      return { success: true, result: [] };
    }

    const data = mapResultToObjects(query);
    return { success: true, result: data };
  } catch (error) {
    console.error("Error getting pending sales amount:", error);
    return { success: false, error: error.message };
  }
}

// Get Discounts Amount
async function getDiscountsAmount() {
  try {
    const db = await getDB();
    const sql = `SELECT * FROM v_discounts_amount`;

    const query = db.exec(sql);

    if (query.length === 0) {
      return { success: true, result: [] };
    }

    const data = mapResultToObjects(query);
    return { success: true, result: data };
  } catch (error) {
    console.error("Error getting discounts amount:", error);
    return { success: false, error: error.message };
  }
}

// Get Paid VS Pending Number
async function getPaidVSPendingNumber() {
  try {
    const db = await getDB();
    const sql = `SELECT * FROM v_paid_vs_pending_number`;

    const query = db.exec(sql);

    if (query.length === 0) {
      return { success: true, result: [] };
    }

    const data = mapResultToObjects(query);
    return { success: true, result: data };
  } catch (error) {
    console.error("Error getting paid vs pending number:", error);
    return { success: false, error: error.message };
  }
}

// Get History Sales Table
async function getHistorySales(limit, offset) {
  try {
    const db = await getDB();
    const params = [limit, offset];
    const sql = `
      SELECT 
	      s.id,
	      s.sale_num,
	      c.name,
	      c.last_name,
	      GROUP_CONCAT(p.name, ', ') AS products,
	      s.total_amount,
	      s.paid_amount,
	      (s.total_amount - s.paid_amount) AS pending_amount,
	      s.discount,
	      st.description as status,
	      s.user_id,
	      s.created_at,
	      s.deleted_at
      FROM sale s
      FULL JOIN customer c ON s.customer_id = c.id
      INNER JOIN status st ON s.status_id = st.id
      LEFT JOIN sale_detail sd ON s.id = sd.sale_id
      INNER JOIN product p ON sd.product_id = p.id 
      GROUP BY s.id
      ORDER BY s.created_at DESC
      LIMIT ? OFFSET ?;
    `;

    const sqlCount = `SELECT COUNT(*) as total FROM sale;`;

    const query = db.exec(sql, params);
    const queryCount = db.exec(sqlCount);

    const totalCount = queryCount.length > 0 ? queryCount[0].values[0][0] : 0;

    if (query.length === 0) {
      return { success: true, result: [] };
    }

    const data = mapResultToObjects(query);
    return { success: true, result: data, totalCount: totalCount };
  } catch (error) {
    console.error("Error getting histoty sales:", error);
    return { success: false, error: error.message };
  }
}

// Get Filter Search Table History Sales
async function getFilterSearchHistorySales(data) {
  try {
    const db = await getDB();
    const { column, text } = data;
    const allowedColumns = [
      "customer",
      "products",
      "sale_num",
      "total_amount",
      "paid_amount",
      "pending_amount",
      "discount",
      "status",
      "created_at",
      "deleted_at",
    ];

    let whereClause = "";
    let targetColumn = allowedColumns.includes(column) ? column : "sale_num";

    if (targetColumn === "customer") {
      targetColumn = "c.name";
      whereClause = `WHERE ${targetColumn} LIKE ?`;
    } else if (targetColumn === "products") {
      targetColumn = "p.name";
      whereClause = `WHERE s.id IN (SELECT sub_sd.sale_id FROM sale_detail sub_sd INNER JOIN product sub_p ON sub_sd.product_id = sub_p.id WHERE sub_p.name LIKE ?)`;
    } else if (targetColumn === "products") {
      targetColumn = "st.description";
    } else if (targetColumn === "pending_amount") {
      targetColumn = "pending_amount";
      whereClause = `WHERE ${targetColumn} LIKE ?`;
    } else if (targetColumn === "status") {
      targetColumn = "status";
      whereClause = `WHERE ${targetColumn} LIKE ?`;
    } else {
      whereClause = `WHERE s.${targetColumn} LIKE ?`;
    }

    const sql = `
      SELECT 
	      s.id,
	      s.sale_num,
	      c.name,
	      c.last_name,
	      GROUP_CONCAT(p.name, ', ') AS products,
	      s.total_amount,
	      s.paid_amount,
	      (s.total_amount - s.paid_amount) AS pending_amount,
	      s.discount,
	      st.description as status,
	      s.user_id,
	      s.created_at,
	      s.deleted_at
      FROM sale s
      LEFT JOIN customer c ON s.customer_id = c.id
      INNER JOIN status st ON s.status_id = st.id
      LEFT JOIN sale_detail sd ON s.id = sd.sale_id
      LEFT JOIN product p ON sd.product_id = p.id 
      ${whereClause}
      GROUP BY s.id
      ORDER BY s.created_at DESC;
    `;

    const searchTerm = `%${text}%`;

    const stmt = db.prepare(sql);
    stmt.bind([searchTerm]);

    const rows = [];
    while (stmt.step()) {
      rows.push(stmt.getAsObject());
    }
    stmt.free();

    return { success: true, result: rows };
  } catch (error) {
    console.error("Error getting filter search table history sales:", error);
    return { success: false, error: error.message };
  }
}

// Get All History Sales
async function getAllHistorySales(filters) {
  const db = await getDB();
  try {
    const start = filters?.startDate || "";
    const end = filters?.endDate || "";
    let sql = "";
    let whereClause = "";

    if (filters) {
      whereClause = `WHERE s.created_at BETWEEN '${start} 00:00:00' AND '${end} 23:59:59'`;

      sql = `
        SELECT 
          s.id,
          s.sale_num,
          c.name,
          c.last_name,
          GROUP_CONCAT(p.name, ', ') AS products,
          s.total_amount,
          s.paid_amount,
          (s.total_amount - s.paid_amount) AS pending_amount,
          s.discount,
          st.description as status,
          s.user_id,
          s.created_at,
          s.deleted_at 
        FROM sale s
        LEFT JOIN customer c ON s.customer_id = c.id
        INNER JOIN status st ON s.status_id = st.id
        LEFT JOIN sale_detail sd ON s.id = sd.sale_id
        LEFT JOIN product p ON sd.product_id = p.id 
        ${whereClause}
        GROUP BY s.id
        ORDER BY s.created_at DESC;
      `;
    } else {
      sql = `SELECT * FROM v_all_history_sales`;
    }

    const query = await db.exec(sql);

    if (query.length === 0) {
      return { success: true, result: [] };
    }

    const products = mapResultToObjects(query);
    return { success: true, result: products };
  } catch (error) {
    console.error("Error getting all history sales:", error);
    return { success: false, error: error.message };
  }
}

// Get Sales by Category
async function getSalesByCategory(filters) {
  const db = await getDB();

  try {
    const start = filters?.startDate || "";
    const end = filters?.endDate || "";
    const params = [start, end];
    const sql = `
      SELECT 
        c.name AS category,
        IFNULL(SUM(sd.quantity), 0) AS sales 
      FROM category c
      LEFT JOIN product p ON c.id = p.category_id
      LEFT JOIN sale_detail sd ON p.id = sd.product_id 
        AND sd.status_id = 4 
      LEFT JOIN sale s ON sd.sale_id = s.id 
        AND s.created_at BETWEEN ? AND ?
        AND s.deleted_at IS NULL
      GROUP BY c.name
      ORDER BY sales DESC;
      `;

    const query = db.exec(sql, params);

    if (query.length === 0) {
      return { success: true, result: [] };
    }

    const data = mapResultToObjects(query);
    return { success: true, result: data };
  } catch (error) {
    console.error("Error getting sales by category:", error);
    return { success: false, error: error.message };
  }
}

// Get Top Selling Products
async function getTopSellingProducts(filters) {
  const db = await getDB();
  try {
    const start = filters?.startDate || "";
    const end = filters?.endDate || "";
    const params = [start, end];
    const sql = `
      SELECT 
        p.name AS product,
        SUM(sd.quantity) AS sales
      FROM sale_detail sd
      INNER JOIN product p ON sd.product_id = p.id
      INNER JOIN sale s ON sd.sale_id = s.id 
      WHERE sd.status_id = 4 AND s.created_at BETWEEN ? AND ?
      GROUP BY sd.product_id
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
    console.error("Error getting top 5 selling products:", error);
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
  getSalesNumberAmount,
  getPendingSalesAmount,
  getDiscountsAmount,
  getPaidVSPendingNumber,
  getHistorySales,
  getFilterSearchHistorySales,
  getAllHistorySales,
  getSalesByCategory,
  getTopSellingProducts,
};
