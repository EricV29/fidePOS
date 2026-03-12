const { getDB, saveDB, mapResultToObjects } = require("../database.cjs");
const bcrypt = require("bcrypt");
const AUTH_CODES = require("../../../constants/authCodes.json");

// Add Category
async function addCategory(data) {
  try {
    const db = await getDB();
    const { name, description, color } = data;

    // Search Category
    const queryCategory = db.exec(
      "SELECT name FROM category WHERE LOWER(name) = LOWER(?) AND status_id = 1;",
      [name],
    );

    const categoryFound = mapResultToObjects(queryCategory);
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

    saveDB(db);
    return { success: true, result: AUTH_CODES.ADD_CATEGORY };
  } catch (error) {
    console.error("Error inserting category:", error);
    return { success: false, error: error.message };
  }
}

// Get Categories for select
async function getCategoriesSelect() {
  try {
    const db = await getDB();

    const query = db.exec("SELECT * FROM v_categories_active_select;");

    if (query.length === 0) {
      return { success: true, result: [] };
    }

    const categories = mapResultToObjects(query);
    return { success: true, result: categories };
  } catch (error) {
    console.error("Error getting categories:", error);
    return { success: false, error: error.message };
  }
}

// Get Users
async function getCategories(limit, offset) {
  const db = await getDB();

  try {
    const params = [limit, offset];
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
      ORDER BY c.created_at DESC
      LIMIT ? OFFSET ?;
    `;

    const sqlCount = `SELECT COUNT(*) as total FROM category;`;

    const query = db.exec(sql, params);
    const queryCount = db.exec(sqlCount);

    const totalCount = queryCount.length > 0 ? queryCount[0].values[0][0] : 0;

    if (query.length === 0) {
      return { success: true, result: [] };
    }

    const data = mapResultToObjects(query);
    return { success: true, result: data, totalCount: totalCount };
  } catch (error) {
    console.error("Error getting categories:", error);
    return { success: false, error: error.message };
  }
}

// Edit Category
async function editCategory(data) {
  const db = await getDB();

  try {
    const { id, name, description, color } = data;

    // Search Category
    const query = db.exec(
      "SELECT id, name, status_id FROM category WHERE id = ?",
      [id],
    );

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

    // Search Categories
    const categories = db.exec(
      "SELECT name FROM user WHERE (name = ?) AND deleted_at IS NULL AND id != ?",
      [name, id],
    );

    const categoriesFound = mapResultToObjects(categories);

    if (categoriesFound.length > 0) {
      for (const category of categoriesFound) {
        if (category.name === name) {
          return { success: false, error: AUTH_CODES.CATEGORY_NAME_USED };
        }
      }
    }

    db.run(
      "UPDATE category SET name = ?, description = ?, color = ? WHERE id = ?",
      [name, description, color, id],
    );

    await saveDB(db);
    return { success: true, result: AUTH_CODES.EDIT_CATEGORY };
  } catch (error) {
    console.error("Error editing category:", error);
    return { success: false, error: error.message };
  }
}

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

    // Search Products by Category
    const queryProducts = db.exec(
      `SELECT
          COUNT(id) AS num
      FROM product
      WHERE category_id = ?;`,
      [id],
    );

    const num = mapResultToObjects(queryProducts);
    const productsFound = num[0];

    // Products?
    if (productsFound.num > 0) {
      return { success: false, error: AUTH_CODES.CATEGORY_HAVE_PRODUCTS };
    }

    db.run(
      "UPDATE category SET deleted_at = CURRENT_TIMESTAMP, status_id = 0 WHERE id = ?",
      [id],
    );

    saveDB(db);
    return { success: true, result: AUTH_CODES.DELETE_CATEGORY };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  addCategory,
  getCategoriesSelect,
  getCategories,
  editCategory,
  deteleCategory,
};
