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

module.exports = {
  addCategory,
  getCategoriesSelect,
};
