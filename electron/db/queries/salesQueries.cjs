const { getDB, saveDB, queryAll, queryOne } = require("../database.cjs");
const AUTH_CODES = require("../../../constants/authCodes.json");

//* CREATE ----------

// Create New Sale
async function createNewSale(data) {
  try {
    const db = await getDB();
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

      db.exec(
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
      db.exec("UPDATE product SET stock = stock - ? WHERE id = ?;", [
        product.quantity,
        product.id,
      ]);

      //! Update status of product
      // const queryUpdateStatusProduct = db.exec(
      //   "UPDATE product SET status_id = 0 WHERE id = ? AND stock <= 0;",
      //   [product.id],
      // );
    }

    if (credit) {
      // Update status customer
      db.exec("UPDATE customer SET status_id = 3 WHERE id = ?;", [idCustomer]);

      // Insert pauyment
      db.exec("INSERT INTO payment(amount, note, sale_id) VALUES(?, ?, ?);", [
        paidAmount,
        "",
        lastId,
      ]);
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

// Add Payment Debt
async function addPaymentDebt(data) {
  try {
    const db = await getDB();
    const { idSale, payment_amount, note } = data;

    // Search Debt Sale
    const debtFound = await queryAll(
      "SELECT total_amount, paid_amount FROM sale WHERE id = ? AND status_id = 5;",
      [idSale],
    );

    if (debtFound.length === 0) {
      return { success: false, error: AUTH_CODES.DEBT_NOT_FOUND };
    }

    db.run("BEGIN TRANSACTION;");

    try {
      // Insert New Payment
      db.run("INSERT INTO payment(amount, note, sale_id) VALUES(?, ?, ?);", [
        payment_amount,
        note,
        idSale,
      ]);

      // Update Debt Sale Amount and Status
      db.run(
        "UPDATE sale SET paid_amount = paid_amount + ?, status_id = CASE WHEN (paid_amount + ?) >= total_amount THEN 4 ELSE 5 END WHERE id = ?;",
        [payment_amount, payment_amount, idSale],
      );

      db.run("COMMIT;");
    } catch (dbError) {
      db.run("ROLLBACK;");
      throw dbError;
    }

    await saveDB(db);
    return { success: true, result: AUTH_CODES.DEBT_PAYMENT_SUCCESS };
  } catch (error) {
    console.error("❌ Error inserting payment debt:", error);
    return { success: false, error: error.message };
  }
}

//* READ ----------

// Get Top 5 Sales by Category
async function getTopSalesCategory(filters) {
  try {
    const start = filters?.startDate || "";
    const end = filters?.endDate || "";

    const topSales = await queryAll(
      `
        SELECT c.name AS category, sum(sd.quantity) AS sales 
        FROM category c
        INNER JOIN product p ON p.category_id = c.id
        INNER JOIN sale_detail sd ON p.id = sd.product_id
        INNER JOIN sale s ON sd.sale_id = s.id 
        WHERE sd.status_id = 4 AND date(s.created_at) BETWEEN ? AND ?
        GROUP BY c.name
        ORDER BY sales DESC
        LIMIT 5;`,
      [start, end],
    );

    if (topSales.length === 0) {
      return { success: true, result: [] };
    }

    return { success: true, result: topSales };
  } catch (error) {
    console.error("❌ Error getting top 5 sales category:", error);
    return { success: false, error: error.message };
  }
}

// Get Revenue
async function getRevenue(filters) {
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

    const revenue = await queryAll(sql);

    if (revenue.length === 0) {
      return { success: true, result: [] };
    }

    return { success: true, result: revenue };
  } catch (error) {
    console.error("❌ Error getting revenue:", error);
    return { success: false, error: error.message };
  }
}

// Get Recent Sales
async function getRecentSales() {
  try {
    const sql = `SELECT * FROM v_recent_sales_products`;

    const recentSalesProducts = await queryAll(sql);

    if (recentSalesProducts.length === 0) {
      return { success: true, result: [] };
    }

    return { success: true, result: recentSalesProducts };
  } catch (error) {
    console.error("Error getting recent sales:", error);
    return { success: false, error: error.message };
  }
}

// Get Sale Data
async function getSaleData(idSale) {
  try {
    const querySaleGeneral = await queryAll(
      `
      SELECT s.id, s.sale_num, st.description AS status, s.created_at, c.name AS customer, s.total_amount, s.discount, s.paid_amount   
      FROM sale s
      INNER JOIN status st ON s.status_id = st.id
      LEFT JOIN customer c ON s.customer_id = c.id 
      WHERE s.id = ?;
    `,
      [idSale],
    );

    if (querySaleGeneral.length === 0) {
      return { success: true, result: [] };
    }

    const sqlSaleDetail = await queryAll(
      `
      SELECT sd.id, p.name, sd.quantity, p.code_sku, sd.cost_price AS unit_price, (sd.quantity * sd.cost_price) AS subtotal     
      FROM sale_detail sd 
      INNER JOIN product p ON sd.product_id = p.id 
      WHERE sd.sale_id = ?;
    `,
      [idSale],
    );

    if (sqlSaleDetail.length === 0) {
      return { success: true, result: [] };
    }

    const data = { ...querySaleGeneral[0], products: sqlSaleDetail };

    return { success: true, result: data };
  } catch (error) {
    console.error("❌ Error getting data sale:", error);
    return { success: false, error: error.message };
  }
}

// Get Next Number Sale
async function getNextNumberSale() {
  try {
    const nextSale = await queryOne(
      `SELECT COALESCE(MAX(sale_num), 0) + 1 AS next_sale FROM sale;`,
    );

    if (nextSale.length === 0) {
      return { success: true, result: [] };
    }

    return { success: true, result: nextSale };
  } catch (error) {
    console.error("❌ Error getting next number sale:", error);
    return { success: false, error: error.message };
  }
}

// Get Sales Number
async function getSalesNumberAmount(filters) {
  try {
    const start = filters?.startDate || "";
    const end = filters?.endDate || "";
    let salesNumber = "";
    let salesAmount = "";
    let whereClauseNumber = "";
    let whereClauseAmount = "";

    if (filters) {
      whereClauseNumber = `WHERE status_id = 4 AND created_at BETWEEN '${start} 00:00:00' AND '${end} 23:59:59'`;
      whereClauseAmount = `WHERE sd.status_id = 4 AND s.created_at BETWEEN '${start} 00:00:00' AND '${end} 23:59:59'`;

      salesNumber = await queryAll(`
      SELECT 
        COUNT(id) AS salesNumber
      FROM sale
      ${whereClauseNumber};`);

      salesAmount = await queryAll(`
      SELECT 
        SUM(sd.subt_price) salesAmount
      FROM sale_detail sd
      INNER JOIN sale s ON sd.sale_id = s.id
      ${whereClauseAmount};`);
    } else {
      salesNumber = await queryAll(`SELECT * FROM v_sales_number;`);
      salesAmount = await queryAll(`SELECT * FROM v_sales_amount;`);
    }

    if (salesNumber.length === 0 || salesAmount.length === 0) {
      return { success: true, result: [] };
    }

    return { success: true, result: { salesNumber, salesAmount } };
  } catch (error) {
    console.error("❌ Error getting sales number:", error);
    return { success: false, error: error.message };
  }
}

// Get Pending Sales Amount
async function getPendingSalesAmount(filters) {
  try {
    const start = filters?.startDate || "";
    const end = filters?.endDate || "";
    let pendingSalesAmount = "";
    let whereClause = "";

    if (filters) {
      whereClause = `WHERE status_id = 5 AND created_at BETWEEN '${start} 00:00:00' AND '${end} 23:59:59'`;

      pendingSalesAmount = await queryAll(`
      SELECT 
        SUM(total_amount - paid_amount) AS pendingSalesAmount
      FROM sale
      ${whereClause};
      `);
    } else {
      pendingSalesAmount = await queryAll(
        `SELECT * FROM v_pending_sales_amount`,
      );
    }

    if (pendingSalesAmount.length === 0) {
      return { success: true, result: [] };
    }

    return { success: true, result: pendingSalesAmount };
  } catch (error) {
    console.error("Error getting pending sales amount:", error);
    return { success: false, error: error.message };
  }
}

// Get Discounts Amount
async function getDiscountsAmount() {
  try {
    const discountsAmount = await queryAll(`SELECT * FROM v_discounts_amount`);

    if (discountsAmount.length === 0) {
      return { success: true, result: [] };
    }

    return { success: true, result: discountsAmount };
  } catch (error) {
    console.error("❌ Error getting discounts amount:", error);
    return { success: false, error: error.message };
  }
}

// Get Paid VS Pending Number
async function getPaidVSPendingNumber() {
  try {
    const paidVSPendingAmount = await queryAll(
      `SELECT * FROM v_paid_vs_pending_number`,
    );

    if (paidVSPendingAmount.length === 0) {
      return { success: true, result: [] };
    }

    return { success: true, result: paidVSPendingAmount };
  } catch (error) {
    console.error("❌ Error getting paid vs pending number:", error);
    return { success: false, error: error.message };
  }
}

// Get History Sales Table
async function getHistorySales(limit, offset) {
  try {
    const historySales = await queryAll(
      `
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
    `,
      [limit, offset],
    );

    const totalCount = await queryOne(`SELECT COUNT(*) as total FROM sale;`);

    if (historySales.length === 0) {
      return { success: true, result: [] };
    }

    return { success: true, result: historySales, totalCount: totalCount };
  } catch (error) {
    console.error("❌ Error getting histoty sales:", error);
    return { success: false, error: error.message };
  }
}

// Get Filter Search Table History Sales
async function getFilterSearchHistorySales(data) {
  try {
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
    const rows = await queryAll(sql, [searchTerm]);

    return { success: true, result: rows };
  } catch (error) {
    console.error("❌ Error getting filter search table history sales:", error);
    return { success: false, error: error.message };
  }
}

// Get All History Sales
async function getAllHistorySales(filters) {
  try {
    const start = filters?.startDate || "";
    const end = filters?.endDate || "";
    let historySales = "";
    let whereClause = "";

    if (filters) {
      whereClause = `WHERE s.created_at BETWEEN '${start} 00:00:00' AND '${end} 23:59:59'`;

      historySales = await queryAll(`
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
      `);
    } else {
      historySales = await queryAll(`SELECT * FROM v_all_history_sales`);
    }

    if (historySales.length === 0) {
      return { success: true, result: [] };
    }

    return { success: true, result: historySales };
  } catch (error) {
    console.error("❌ Error getting all history sales:", error);
    return { success: false, error: error.message };
  }
}

// Get Sales by Category
async function getSalesByCategory(filters) {
  try {
    const start = filters?.startDate || "";
    const end = filters?.endDate || "";
    const salesByCategory = await queryAll(
      `
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
      `,
      [start, end],
    );

    if (salesByCategory.length === 0) {
      return { success: true, result: [] };
    }

    return { success: true, result: salesByCategory };
  } catch (error) {
    console.error("❌ Error getting sales by category:", error);
    return { success: false, error: error.message };
  }
}

// Get Top Selling Products
async function getTopSellingProducts(filters) {
  try {
    const start = filters?.startDate || "";
    const end = filters?.endDate || "";
    const topSellingProducts = await queryAll(
      `
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
    `,
      [start, end],
    );

    if (topSellingProducts.length === 0) {
      return { success: true, result: [] };
    }

    return { success: true, result: topSellingProducts };
  } catch (error) {
    console.error("❌ Error getting top 5 selling products:", error);
    return { success: false, error: error.message };
  }
}

// Get Total Debts Over Time
async function getTotalDebtsOverTime(year) {
  try {
    const totalDebtsOverTime = await queryAll(
      `
      WITH RECURSIVE all_months(month_num) AS (
          SELECT 1
          UNION ALL
          SELECT month_num + 1 FROM all_months WHERE month_num < 12
      )
      SELECT 
          CASE m.month_num
              WHEN 1 THEN 'January' WHEN 2 THEN 'February' WHEN 3 THEN 'March'
              WHEN 4 THEN 'April' WHEN 5 THEN 'May' WHEN 6 THEN 'June'
              WHEN 7 THEN 'July' WHEN 8 THEN 'August' WHEN 9 THEN 'September'
              WHEN 10 THEN 'October' WHEN 11 THEN 'November' WHEN 12 THEN 'December'
          END AS month,
          COUNT(s.id) AS debts
      FROM all_months m
      LEFT JOIN sale s ON CAST(strftime('%m', s.created_at) AS INTEGER) = m.month_num
          AND strftime('%Y', s.created_at) = ?
          AND s.status_id = 5
      GROUP BY m.month_num
      ORDER BY m.month_num ASC;
    `,
      [year],
    );

    if (totalDebtsOverTime.length === 0) {
      return { success: true, result: [] };
    }

    return { success: true, result: totalDebtsOverTime };
  } catch (error) {
    console.error("❌ Error getting total debts over time:", error);
    return { success: false, error: error.message };
  }
}

// Get Payments by Debt
async function getPaymentsDebt(idSale) {
  try {
    const paymentsDebt = await queryAll(
      `SELECT id, created_at, amount, note FROM payment WHERE sale_id = ? ORDER BY created_at DESC;`,
      [idSale],
    );

    if (paymentsDebt.length === 0) {
      return { success: true, result: [] };
    }

    return { success: true, result: paymentsDebt };
  } catch (error) {
    console.error("❌ Error getting payments debt:", error);
    return { success: false, error: error.message };
  }
}

//* UPDATE ----------
//* DELETE ----------

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
  getTotalDebtsOverTime,
  getPaymentsDebt,
  addPaymentDebt,
};
