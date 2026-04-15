const {
  getDB,
  saveDB,
  mapResultToObjects,
  queryAll,
  queryOne,
} = require("../database.cjs");
const AUTH_CODES = require("../../../constants/authCodes.json");

//* CREATE ----------

// Add Product
async function addProduct(data) {
  const db = await getDB();

  try {
    const {
      code_sku,
      product,
      description,
      category,
      stock,
      cost_price,
      unit_price,
    } = data;

    db.exec("BEGIN TRANSACTION;");

    let nextCode = code_sku;

    if (!code_sku || code_sku === "") {
      // Search Next Code SKU
      const queryCode = db.exec(
        `SELECT (code_sku + 1) AS code FROM product ORDER BY id DESC LIMIT 1;`,
      );

      if (queryCode.length === 0 || queryCode[0].values.length === 0) {
        nextCode = 1;
      } else {
        nextCode = queryCode[0].values[0][0];
      }
    } else {
      // Search Product
      const query = db.exec(
        "SELECT id FROM product WHERE code_sku = ? AND status_id = 1;",
        [code_sku],
      );

      const productFound = mapResultToObjects(query);

      if (productFound.length > 0) {
        return { success: false, error: AUTH_CODES.CODE_SKU_USED };
      }
    }

    // Insert Product
    db.run(
      `INSERT INTO product (code_sku, name, description, category_id, cost_price, unit_price, stock, status_id) VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
      [nextCode, product, description, category, cost_price, unit_price, stock],
    );

    // Get id product
    const lastId = db.exec("SELECT last_insert_rowid();")[0].values[0][0];

    // Insert entrie
    db.run(
      `INSERT INTO entries (product_id, quantity, cost_price) VALUES (?, ?, ?);`,
      [lastId, stock, cost_price],
    );

    db.exec("COMMIT;");
    await saveDB(db);
    return { success: true, result: AUTH_CODES.ADD_PRODUCT };
  } catch (error) {
    if (db) db.exec("ROLLBACK;");
    console.error("Error inserting product:", error);
    return { success: false, error: error.message };
  }
}

// Add Products Import
async function addProductsImport(data) {
  const db = await getDB();

  try {
    db.exec("BEGIN TRANSACTION;");

    // Get Next Code SKU
    const lastCodeQuery = db.exec(
      `SELECT CAST(code_sku AS INTEGER) AS last_code FROM product WHERE code_sku GLOB '[0-9]*' ORDER BY id DESC LIMIT 1;`,
    );

    let currentAutoCode = 1;
    if (lastCodeQuery.length > 0 && lastCodeQuery[0].values.length > 0) {
      currentAutoCode = parseInt(lastCodeQuery[0].values[0][0]) + 1;
    }

    for (let i = 0; i < data.length; i++) {
      let codeSku = data[i].code_sku;
      let stock = data[i].stock || 0;
      let description = data[i].description || "---";
      let nextCode;

      if (codeSku) {
        // Search Code SKU of new product
        const queryCode = db.exec(
          `SELECT id FROM product WHERE code_sku = ?;`,
          [codeSku],
        );

        if (queryCode.length > 0) {
          if (db) db.exec("ROLLBACK;");
          return {
            success: false,
            error: AUTH_CODES.CODE_SKU_USED,
            result: codeSku,
          };
        }

        nextCode = codeSku;
      } else {
        nextCode = String(currentAutoCode);
        currentAutoCode++;
      }

      // Insert Product
      db.run(
        `INSERT INTO product (code_sku, name, description, category_id, cost_price, unit_price, stock, status_id) VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
        [
          nextCode,
          data[i].product,
          description,
          data[i].category_id,
          data[i].cost_price,
          data[i].unit_price,
          stock,
        ],
      );

      // Get id product
      const lastId = db.exec("SELECT last_insert_rowid();")[0].values[0][0];

      if (stock > 0) {
        // Insert entrie
        db.run(
          `INSERT INTO entries (product_id, quantity, cost_price) VALUES (?, ?, ?);`,
          [lastId, stock, data[i].cost_price],
        );
      }
    }

    db.exec("COMMIT;");
    await saveDB(db);
    return { success: true, result: AUTH_CODES.ADD_PRODUCT };
  } catch (error) {
    if (db) db.exec("ROLLBACK;");
    console.error("Error inserting products import:", error);
    return { success: false, error: error.message };
  }
}

//* READ ----------

// Get Active Products by Category
async function getActiveProductsCategory() {
  try {
    const productsByCategory = await queryAll(
      `SELECT * FROM v_active_products_by_category`,
    );

    if (productsByCategory.length === 0) {
      return { success: true, result: [] };
    }

    return { success: true, result: productsByCategory };
  } catch (error) {
    console.error("❌ Error getting active products by category:", error);
    return { success: false, error: error.message };
  }
}

// Get Investment
async function getInvestment(filters) {
  try {
    const start = filters?.startDate || "";
    const end = filters?.endDate || "";
    let investment = "";
    let whereClause = "";

    if (filters) {
      whereClause = `WHERE created_at BETWEEN '${start} 00:00:00' AND '${end} 23:59:59'`;

      investment = await queryAll(`
      SELECT 
        SUM(cost_price) AS investment
      FROM entries
      ${whereClause};
      `);
    } else {
      investment = await queryAll(`SELECT * FROM v_investment`);
    }

    if (investment.length === 0) {
      return { success: true, result: [] };
    }

    return { success: true, result: investment };
  } catch (error) {
    console.error("❌ Error getting investment:", error);
    return { success: false, error: error.message };
  }
}

// Get Category Options
async function getCategoryOptions() {
  try {
    const categories = await queryAll(`SELECT * FROM v_category_options`);

    if (categories.length === 0) {
      return { success: true, result: [] };
    }

    return { success: true, result: categories };
  } catch (error) {
    console.error("❌ Error getting category options:", error);
    return { success: false, error: error.message };
  }
}

// Get Products List New Sale
async function getProductsList(idCategory, limit, offset) {
  try {
    const whereClause = idCategory
      ? "WHERE p.category_id = ? AND p.status_id = 1"
      : "WHERE p.status_id = 1";
    const countParams = idCategory ? [idCategory] : [];
    const params = idCategory ? [idCategory, limit, offset] : [limit, offset];
    const products = await queryAll(
      `
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
    `,
      params,
    );

    const totalCount = await queryOne(
      `
      SELECT COUNT(*) as total 
      FROM product p
      INNER JOIN category c ON p.category_id = c.id
      ${whereClause};
    `,
      countParams,
    );

    if (products.length === 0) {
      return { success: true, result: [] };
    }

    return { success: true, result: products, totalCount: totalCount };
  } catch (error) {
    console.error("❌ Error getting products list:", error);
    return { success: false, error: error.message };
  }
}

// Get Filter Search Table Products
async function getFilterSearch(data) {
  try {
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

    const rows = await queryAll(sql, [searchTerm]);

    return { success: true, result: rows };
  } catch (error) {
    console.error("❌ Error getting filter search table:", error);
    return { success: false, error: error.message };
  }
}

// Get Search CodeSKU Table
async function getSearchCodeSKU(codesku) {
  try {
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

    const rows = await queryAll(sql, [codesku]);

    return { success: true, result: rows };
  } catch (error) {
    console.error("❌ Error getting filter search table:", error);
    return { success: false, error: error.message };
  }
}

// Get Iventory Value
async function getInventoryValue(filters) {
  try {
    const start = filters?.startDate || "";
    const end = filters?.endDate || "";
    let inventoryValue = "";
    let whereClause = "";

    if (filters) {
      whereClause = `WHERE s.created_at BETWEEN '${start} 00:00:00' AND '${end} 23:59:59'`;

      inventoryValue = await queryAll(`
      SELECT 
        SUM((p.stock + IFNULL(ventas_posteriores.cantidad_recuperada, 0)) * p.cost_price) AS inventory_value
      FROM product p
      LEFT JOIN (
        SELECT sd.product_id, SUM(sd.quantity) AS cantidad_recuperada
        FROM sale_detail sd
        JOIN sale s ON sd.sale_id = s.id
        ${whereClause}
        GROUP BY sd.product_id
      ) AS ventas_posteriores ON p.id = ventas_posteriores.product_id;
      `);
    } else {
      inventoryValue = await queryAll(`SELECT * FROM v_inventory_value`);
    }

    if (inventoryValue.length === 0) {
      return { success: true, result: [] };
    }

    return { success: true, result: inventoryValue };
  } catch (error) {
    console.error("❌ Error getting inventory value:", error);
    return { success: false, error: error.message };
  }
}

// Get Products Stock (Active/Inactive)
async function getProductsStock() {
  try {
    const prducts = await queryOne(`SELECT * FROM v_products_stock`);

    if (prducts.length === 0) {
      return { success: true, result: [] };
    }

    return { success: true, result: prducts };
  } catch (error) {
    console.error("❌ Error getting products stock:", error);
    return { success: false, error: error.message };
  }
}

// Get Products List Products
async function getProducts(limit, offset) {
  try {
    const products = await queryAll(
      `
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
        ((p.unit_price - p.cost_price) * p.stock) AS profit,
        s.description AS status, 
        p.created_at,
        p.deleted_at 
      FROM product p
      INNER JOIN category c ON p.category_id = c.id
      INNER JOIN status s ON p.status_id  = s.id 
      ORDER BY p.stock DESC
      LIMIT ? OFFSET ?;
    `,
      [limit, offset],
    );

    const totalCount = await queryOne(`
      SELECT COUNT(*) as total 
      FROM product p
      INNER JOIN category c ON p.category_id = c.id
    `);

    if (products.length === 0) {
      return { success: true, result: [] };
    }

    return { success: true, result: products, totalCount: totalCount };
  } catch (error) {
    console.error("❌ Error getting products:", error);
    return { success: false, error: error.message };
  }
}

// Get Filter Search Products
async function getFilterSearchProducts(data) {
  try {
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
        ((p.unit_price - p.cost_price) * p.stock) AS profit,
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

    const rows = await queryAll(sql, [searchTerm]);

    return { success: true, result: rows };
  } catch (error) {
    console.error("❌ Error getting filter search products:", error);
    return { success: false, error: error.message };
  }
}

// Get All Products
async function getAllProducts(filters) {
  try {
    const start = filters?.startDate || "";
    const end = filters?.endDate || "";
    let products = "";
    let whereClause = "";

    if (filters) {
      whereClause = `WHERE p.created_at BETWEEN '${start} 00:00:00' AND '${end} 23:59:59'`;

      products = await queryAll(`
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
          ((p.unit_price - p.cost_price) * p.stock) AS profit,
          s.description AS status, 
          p.created_at,
          p.deleted_at  
        FROM product p
        INNER JOIN category c ON p.category_id = c.id
        INNER JOIN status s ON p.status_id  = s.id
        ${whereClause}
        ORDER BY p.created_at DESC;
      `);
    } else {
      products = await queryAll(`SELECT * FROM v_all_products`);
    }

    if (products.length === 0) {
      return { success: true, result: [] };
    }

    return { success: true, result: products };
  } catch (error) {
    console.error("❌ Error getting all products:", error);
    return { success: false, error: error.message };
  }
}

// Get Products Status
async function getProductsStatus(filters) {
  try {
    const end = filters?.endDate || "";
    const start = filters?.startDate || "";
    const products = await queryOne(
      `
      SELECT 
        SUM(CASE WHEN status_id = 1 THEN 1 ELSE 0 END) AS Active,
        SUM(CASE WHEN status_id = 0 THEN 1 ELSE 0 END) AS Inactive
      FROM product
      WHERE created_at BETWEEN ? AND ?;
      `,
      [start, end],
    );

    if (products.length === 0) {
      return { success: true, result: [] };
    }

    return { success: true, result: products };
  } catch (error) {
    console.error("❌ Error getting products status:", error);
    return { success: false, error: error.message };
  }
}

// Get Products by Category
async function getProductsByCategory(filters) {
  try {
    const start = filters?.startDate || "";
    const end = filters?.endDate || "";

    const products = await queryAll(
      `
      SELECT 
        c.name AS category,
        COUNT(p.id) AS products
      FROM category c
      LEFT JOIN product p ON c.id = p.category_id 
        AND p.status_id = 1 
        AND p.created_at BETWEEN ? AND ?
      GROUP BY c.id, c.name
      ORDER BY products DESC;
    `,
      [`${start} 00:00:00`, `${end} 23:59:59`],
    );

    if (products.length === 0) {
      return { success: true, result: [] };
    }

    return { success: true, result: products };
  } catch (error) {
    console.error("❌ Error getting products by category:", error);
    return { success: false, error: error.message };
  }
}

//* UPDATE ----------

// Edit Product
async function editProduct(data) {
  const db = await getDB();
  const {
    id,
    code_sku,
    product,
    description,
    category,
    stock,
    cost_price,
    unit_price,
    editStock,
  } = data;

  try {
    // Search Product
    const query = db.exec(
      "SELECT id, status_id, stock FROM product WHERE id = ?;",
      [id],
    );

    const result = mapResultToObjects(query);
    const productFound = result[0];

    // Product?
    if (!productFound) {
      return { success: false, error: AUTH_CODES.PRODUCT_NOT_FOUND };
    }

    db.exec("BEGIN TRANSACTION;");

    db.run(
      "UPDATE product SET name = ?, description = ?, category_id = ?, stock = ?, cost_price = ?, unit_price = ? WHERE id = ?;",
      [product, description, category, stock, cost_price, unit_price, id],
    );

    let newStockEntrie = Number(productFound.stock);
    if (Number(stock) !== Number(productFound.stock)) {
      newStockEntrie = Number(stock) - Number(productFound.stock);
    }

    if (editStock === "entry") {
      // Updatade status product
      db.run(
        "UPDATE product SET status_id = 1, deleted_at = null WHERE id = ?;",
        [id],
      );

      // Insert entrie
      db.run(
        `INSERT INTO entries (product_id, quantity, cost_price) VALUES (?, ?, ?);`,
        [id, newStockEntrie, cost_price],
      );
    } else if (editStock === "error") {
      // Status?
      if (productFound.status_id === 0) {
        db.exec("ROLLBACK;");
        return { success: false, error: AUTH_CODES.PRODUCT_INACTIVE };
      }

      // Update entrie
      db.run(
        `UPDATE entries 
          SET quantity = ?, cost_price = ? 
          WHERE rowid = (
            SELECT rowid FROM entries 
            WHERE product_id = ? 
            ORDER BY created_at DESC 
            LIMIT 1
        );`,
        [stock, cost_price, id],
      );
    }

    db.exec("COMMIT;");
    await saveDB(db);
    return { success: true, result: AUTH_CODES.EDIT_PRODUCT };
  } catch (error) {
    if (db) db.exec("ROLLBACK;");
    console.error("Error editing product:", error);
    return { success: false, error: error.message };
  }
}

//* DELETE ----------

// Delete Product
async function deleteProduct(data) {
  const db = await getDB();
  const { id, reason } = data;

  try {
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

    db.exec("BEGIN TRANSACTION;");

    if (reason === "error") {
      const movementsProduct = db.run(
        "SELECT id FROM sale_detail WHERE product_id = ?;",
        [id],
      );
      const result = mapResultToObjects(movementsProduct);
      if (result.length > 0) {
        db.exec("ROLLBACK;");
        return { success: false, error: AUTH_CODES.USED_PRODUCT };
      } else {
        db.run("DELETE FROM entries WHERE product_id = ?;", [id]);
        db.run(
          "UPDATE product SET deleted_at = CURRENT_TIMESTAMP, cost_price = 0, unit_price = 0, stock = 0, status_id = 0 WHERE id = ?;",
          [id],
        );
      }
    } else if (reason === "loss") {
      db.run(
        "UPDATE product SET deleted_at = CURRENT_TIMESTAMP, cost_price = 0, unit_price = 0, stock = 0, status_id = 0 WHERE id = ?;",
        [id],
      );
    }

    db.exec("COMMIT;");
    await saveDB(db);
    return { success: true, result: AUTH_CODES.DELETE_PRODUCT };
  } catch (error) {
    if (db) db.exec("ROLLBACK;");
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
  addProduct,
  editProduct,
  addProductsImport,
  getAllProducts,
  getProductsStatus,
  getProductsByCategory,
};
