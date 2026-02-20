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

// Get Products List New Sale
async function getProductsList(idCategory, limit, offset) {
  try {
    const db = await getDB();

    const whereClause = idCategory
      ? "WHERE p.category_id = ? AND p.status_id = 1"
      : "WHERE p.status_id = 1";
    const countParams = idCategory ? [idCategory] : [];
    const params = idCategory ? [idCategory, limit, offset] : [limit, offset];
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
      ${whereClause}
      ORDER BY p.stock DESC
      LIMIT ? OFFSET ?;
    `;

    const sqlCount = `
      SELECT COUNT(*) as total 
      FROM product p
      INNER JOIN category c ON p.category_id = c.id
      ${whereClause};
    `;

    const query = db.exec(sql, params);
    const queryCount = db.exec(sqlCount, countParams);

    const totalCount = queryCount.length > 0 ? queryCount[0].values[0][0] : 0;

    if (query.length === 0) {
      return { success: true, result: [] };
    }

    const data = mapResultToObjects(query);
    return { success: true, result: data, totalCount: totalCount };
  } catch (error) {
    console.error("Error getting products list:", error);
    return { success: false, error: error.message };
  }
}

// Get Filter Search Table
async function getFilterSearch(data) {
  try {
    const db = await getDB();
    const { column, text } = data;
    const allowedColumns = [
      "code_sku",
      "product",
      "description",
      "category",
      "unit_price",
    ];

    let targetColumn = allowedColumns.includes(column) ? column : "code_sku";

    if (targetColumn === "product") targetColumn = "p.name";
    else if (targetColumn === "category") targetColumn = "c.name";
    else if (targetColumn === "unit_price") targetColumn = "p.unit_price";
    else targetColumn = `p.${targetColumn}`;

    const sql = `
      SELECT 
        p.id, 
        p.code_sku, 
        p.name AS product, 
        p.description, 
        c.name AS category, 
        c.color AS ccolor, 
        p.unit_price,
        p.stock,
        p.status_id As status 
      FROM product p
      INNER JOIN category c ON p.category_id = c.id
      WHERE ${targetColumn} LIKE ? 
      AND status = 1
      ORDER BY p.stock DESC;
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
    console.error("Error getting filter search table:", error);
    return { success: false, error: error.message };
  }
}

// Get Search CodeSKU Table
async function getSearchCodeSKU(codesku) {
  try {
    const db = await getDB();

    const sql = `
      SELECT 
        p.id, 
        p.code_sku, 
        p.name AS product, 
        p.description, 
        c.name AS category, 
        c.color AS ccolor, 
        p.unit_price,
        p.stock,
        p.status_id As status 
      FROM product p
      INNER JOIN category c ON p.category_id = c.id
      WHERE p.code_sku LIKE ?
      AND status = 1
      ORDER BY p.stock DESC;
    `;

    const stmt = db.prepare(sql);
    stmt.bind([codesku]);

    const rows = [];
    while (stmt.step()) {
      rows.push(stmt.getAsObject());
    }
    stmt.free();

    return { success: true, result: rows };
  } catch (error) {
    console.error("Error getting filter search table:", error);
    return { success: false, error: error.message };
  }
}

// Get Iventory Value
async function getInventoryValue() {
  try {
    const db = await getDB();

    const sql = `SELECT * FROM v_inventory_value`;

    const query = db.exec(sql);

    if (query.length === 0) {
      return { success: true, result: [] };
    }

    const data = mapResultToObjects(query);
    return { success: true, result: data };
  } catch (error) {
    console.error("Error getting inventory value:", error);
    return { success: false, error: error.message };
  }
}

// Get Products Stock (Active/Inactive)
async function getProductsStock() {
  try {
    const db = await getDB();

    const sql = `SELECT * FROM v_products_stock`;

    const query = db.exec(sql);

    if (query.length === 0) {
      return { success: true, result: [] };
    }

    const data = mapResultToObjects(query);
    return { success: true, result: data };
  } catch (error) {
    console.error("Error getting products stock:", error);
    return { success: false, error: error.message };
  }
}

// Get Products List Products
async function getProducts(limit, offset) {
  try {
    const db = await getDB();
    const params = [limit, offset];
    const sql = `
      SELECT 
        p.id, 
        p.code_sku, 
        p.name AS product, 
        p.description, 
        c.name AS category, 
        c.color AS ccolor,
        p.cost_price,
        p.unit_price,
        p.stock,
        s.description AS status, 
        p.created_at,
        p.deleted_at 
      FROM product p
      INNER JOIN category c ON p.category_id = c.id
      INNER JOIN status s ON p.status_id  = s.id 
      ORDER BY p.stock DESC
      LIMIT ? OFFSET ?;
    `;

    const sqlCount = `
      SELECT COUNT(*) as total 
      FROM product p
      INNER JOIN category c ON p.category_id = c.id
    `;

    const query = db.exec(sql, params);
    const queryCount = db.exec(sqlCount);

    const totalCount = queryCount.length > 0 ? queryCount[0].values[0][0] : 0;

    if (query.length === 0) {
      return { success: true, result: [] };
    }

    const data = mapResultToObjects(query);
    return { success: true, result: data, totalCount: totalCount };
  } catch (error) {
    console.error("Error getting products:", error);
    return { success: false, error: error.message };
  }
}

// Get Filter Search Table Products
async function getFilterSearchProducts(data) {
  try {
    const db = await getDB();
    const { column, text } = data;

    const allowedColumns = [
      "code_sku",
      "product",
      "description",
      "category",
      "cost_price",
      "unit_price",
      "stock",
      "status",
      "created_at",
      "deleted_at",
    ];

    let targetColumn = allowedColumns.includes(column) ? column : "code_sku";

    if (targetColumn === "product") targetColumn = "p.name";
    else if (targetColumn === "category") targetColumn = "c.name";
    else if (targetColumn === "unit_price") targetColumn = "p.unit_price";
    else if (targetColumn === "status") targetColumn = "s.description";
    else targetColumn = `p.${targetColumn}`;

    const sql = `
      SELECT 
        p.id, 
        p.code_sku, 
        p.name AS product, 
        p.description, 
        c.name AS category, 
        c.color AS ccolor,
        p.cost_price,
        p.unit_price,
        p.stock,
        s.description AS status, 
        p.created_at,
        p.deleted_at 
      FROM product p
      INNER JOIN category c ON p.category_id = c.id
      INNER JOIN status s ON p.status_id  = s.id 
      WHERE ${targetColumn} LIKE ? 
      AND p.status_id IN (1, 0)
      ORDER BY p.stock DESC;
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
    console.error("Error getting filter search products:", error);
    return { success: false, error: error.message };
  }
}

// Delete Product
async function deleteProduct(id) {
  try {
    const db = await getDB();

    // Search Product
    const query = db.exec("SELECT id, status_id FROM product WHERE id = ?;", [
      id,
    ]);

    const users = mapResultToObjects(query);
    const userFound = users[0];

    // Product?
    if (!userFound) {
      return { success: false, error: AUTH_CODES.PRODUCT_INACTIVE };
    }

    // Status?
    if (userFound.status_id === 0) {
      return { success: false, error: AUTH_CODES.PRODUCT_INACTIVE };
    }

    db.run(
      "UPDATE product SET deleted_at = CURRENT_TIMESTAMP, status_id = 0 WHERE id = ?",
      [id],
    );

    saveDB(db);
    return { success: true, result: AUTH_CODES.DELETE_PRODUCT };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  getActiveProductsCategory,
  getInvestment,
  getCategoryOptions,
  getProductsList,
  getFilterSearch,
  getSearchCodeSKU,
  getInventoryValue,
  getProductsStock,
  getProducts,
  getFilterSearchProducts,
  deleteProduct,
};
