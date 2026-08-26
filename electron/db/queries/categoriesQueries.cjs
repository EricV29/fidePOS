const {
  getDB,
  saveDB,
  mapResultToObjects,
  queryAll,
  queryOne,
  runQuery,
} = require("../database.cjs");
const AUTH_CODES = require("../../../constants/authCodes.json");

//* CREATE ----------

// Add Category
async function addCategory(data) {
  try {
    const db = await getDB();
    const { name, description, color } = data;

    // Search Category
    const categoryFound = await queryAll(
      "SELECT name FROM category WHERE LOWER(name) = LOWER(?) AND status_id = 1;",
      [name],
    );

    if (categoryFound.length > 0) {
      return { success: false, error: AUTH_CODES.CATEGORY_USED };
    }

    db.run("BEGIN TRANSACTION;");

    try {
      // Insert New Category
      db.run(
        "INSERT INTO category(name, description, color, status_id) VALUES(?, ?, ?, ?);",
        [name, description, color, 1],
      );

      db.run("COMMIT;");
    } catch (dbError) {
      db.run("ROLLBACK;");
      throw dbError;
    }

    await saveDB(db);
    return { success: true, result: AUTH_CODES.ADD_CATEGORY };
  } catch (error) {
    console.error("❌ Error inserting category:", error);
    return { success: false, error: error.message };
  }
}

//* READ ----------

// Get Categories for select
async function getCategoriesSelect() {
  try {
    const categories = await queryAll(
      "SELECT * FROM v_categories_active_select;",
    );

    if (categories.length === 0) {
      return { success: true, result: [] };
    }

    return { success: true, result: categories };
  } catch (error) {
    console.error("❌ Error getting categories:", error);
    return { success: false, error: error.message };
  }
}

// Get Categories
async function getCategories(limit, offset) {
  try {
    const categories = await queryAll(
      `
      SELECT 
        c.id,
        c.name,
        c.description, 
        c.color,
        s.description AS status,
        c.created_at,
        c.deleted_at 
      FROM category c
      INNER JOIN status s ON c.status_id = s.id 
      ORDER BY c.created_at DESC
      LIMIT ? OFFSET ?;
    `,
      [limit, offset],
    );

    const totalCount = await queryOne(
      `SELECT COUNT(*) as total FROM category;`,
    );

    if (categories.length === 0) {
      return { success: true, result: [] };
    }

    return { success: true, result: categories, totalCount: totalCount };
  } catch (error) {
    console.error("❌ Error getting categories:", error);
    return { success: false, error: error.message };
  }
}

// Get Filter Search Table Categproes
async function getFilterSearchCategories(data) {
  try {
    const { column, text } = data;
    const allowedColumns = [
      "name",
      "description",
      "status",
      "created_at",
      "deleted_at",
    ];

    let targetColumn = allowedColumns.includes(column) ? column : "name";

    if (targetColumn === "status") targetColumn = "s.description";
    else targetColumn = `c.${targetColumn}`;

    const sql = `
      SELECT 
        c.id,
        c.name,
        c.description, 
        c.color,
        s.description AS status,
        c.created_at,
        c.deleted_at 
      FROM category c
      INNER JOIN status s ON c.status_id = s.id 
      WHERE ${targetColumn} LIKE ? 
      ORDER BY c.created_at DESC;
    `;

    const searchTerm = `%${text}%`;

    const rows = await queryAll(sql, [searchTerm]);

    return { success: true, result: rows };
  } catch (error) {
    console.error("❌ Error getting filter search table categories:", error);
    return { success: false, error: error.message };
  }
}

//* UPDATE ----------

// Edit Category
async function editCategory(data) {
  try {
    const { id, name, description, color } = data;

    // Search Category
    const categoryFound = await queryAll(
      "SELECT id, name, status_id FROM category WHERE id = ?",
      [id],
    );

    // Category?
    if (!categoryFound) {
      return { success: false, error: AUTH_CODES.CATEGORY_NOT_FOUND };
    }

    // Status?
    if (categoryFound.status_id === 0) {
      return { success: false, error: AUTH_CODES.INACTIVE_CATEGORY };
    }

    // Search Categories
    const categoriesFound = await queryAll(
      "SELECT name FROM user WHERE (name = ?) AND deleted_at IS NULL AND id != ?",
      [name, id],
    );

    if (categoriesFound.length > 0) {
      for (const category of categoriesFound) {
        if (category.name === name) {
          return { success: false, error: AUTH_CODES.CATEGORY_NAME_USED };
        }
      }
    }

    runQuery(
      "UPDATE category SET name = ?, description = ?, color = ? WHERE id = ?",
      [name, description, color, id],
    );

    return { success: true, result: AUTH_CODES.EDIT_CATEGORY };
  } catch (error) {
    console.error("❌ Error editing category:", error);
    return { success: false, error: error.message };
  }
}

//* DELETE ----------

// Delete Category
async function deteleCategory(id) {
  const db = await getDB();
  try {
    // Search Category
    const query = db.exec("SELECT id, status_id FROM category WHERE id = ?", [
      id,
    ]);

    const category = mapResultToObjects(query);
    const categoryFound = category[0];

    // Category?
    if (!categoryFound) {
      return { success: false, error: AUTH_CODES.CATEGORY_NOT_FOUND };
    }

    // Status?
    if (categoryFound.status_id === 0) {
      return { success: false, error: AUTH_CODES.INACTIVE_CATEGORY };
    }

    // Search Products by Category (all, including soft-deleted)
    const queryProducts = db.exec(
      `SELECT
          COUNT(id) AS num
      FROM product
      WHERE category_id = ?;`,
      [id],
    );

    const num = mapResultToObjects(queryProducts);
    const productsFound = num[0];

    // No products at all → hard delete
    if (productsFound.num === 0) {
      db.run("DELETE FROM category WHERE id = ?", [id]);
      saveDB(db);
      return { success: true, result: AUTH_CODES.DELETE_CATEGORY };
    }

    // Has products → check if all are soft-deleted
    const queryActiveProducts = db.exec(
      `SELECT COUNT(id) AS num FROM product WHERE category_id = ? AND deleted_at IS NULL;`,
      [id],
    );

    const activeProducts = mapResultToObjects(queryActiveProducts);
    const activeCount = activeProducts[0].num;

    // Has active products → cannot delete
    if (activeCount > 0) {
      return { success: false, error: AUTH_CODES.CATEGORY_HAVE_PRODUCTS };
    }

    // All products are soft-deleted → check if any had sales
    const querySalesExist = db.exec(
      `SELECT COUNT(sd.id) AS num
      FROM sale_detail sd
      INNER JOIN product p ON sd.product_id = p.id
      WHERE p.category_id = ?;`,
      [id],
    );

    const salesResult = mapResultToObjects(querySalesExist);
    const salesCount = salesResult[0].num;

    // Has sales history → soft delete
    if (salesCount > 0) {
      db.run(
        "UPDATE category SET deleted_at = CURRENT_TIMESTAMP, status_id = 0 WHERE id = ?",
        [id],
      );
      saveDB(db);
      return { success: true, result: AUTH_CODES.DELETE_CATEGORY };
    }

    // All deleted, no sales → hard delete
    db.run("DELETE FROM category WHERE id = ?", [id]);
    saveDB(db);
    return { success: true, result: AUTH_CODES.DELETE_CATEGORY };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, error: error.message };
  }
}

// Restore Category
async function restoreCategory(id) {
  try {
    // Search Category
    const categoryFound = await queryAll(
      "SELECT id, status_id FROM category WHERE id = ?",
      [id],
    );

    // Category?
    if (!categoryFound || categoryFound.length === 0) {
      return { success: false, error: AUTH_CODES.CATEGORY_NOT_FOUND };
    }

    // Status?
    if (categoryFound[0].status_id === 1) {
      return { success: false, error: AUTH_CODES.CATEGORY_USED };
    }

    runQuery(
      "UPDATE category SET deleted_at = NULL, status_id = 1 WHERE id = ?",
      [id],
    );

    return { success: true, result: AUTH_CODES.RESTORE_CATEGORY };
  } catch (error) {
    console.error("Error restoring category:", error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  addCategory,
  getCategoriesSelect,
  getCategories,
  editCategory,
  deteleCategory,
  getFilterSearchCategories,
  restoreCategory,
};
