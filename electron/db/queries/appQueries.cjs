const { saveDB, runQuery, queryAll, queryOne } = require("../database.cjs");
const bcrypt = require("bcrypt");
const AUTH_CODES = require("../../../constants/authCodes.json");

// Get Install Date
async function getInstallDate() {
  try {
    const installDate = await queryOne(
      "SELECT install_date FROM app WHERE id = 1;",
    );

    return { success: true, result: installDate };
  } catch (error) {
    console.error("❌ Error inserting admin:", error);
    return { success: false, error: error.message };
  }
}

// Add Admin
async function addAdmin(data) {
  try {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    runQuery(
      "INSERT INTO user(name, last_name, email, phone, password, img, role_id, status_id) VALUES(?, ?, ?, ?, ?, ?, ?, ?)",
      [
        data.name,
        data.last_name,
        data.email,
        data.phone,
        hashedPassword,
        null,
        1,
        1,
      ],
    );

    return { success: true };
  } catch (error) {
    console.error("❌ Error inserting admin:", error);
    return { success: false, error: error.message };
  }
}

// Login
async function loginUser(data) {
  try {
    // Search User
    const user = await queryOne(
      "SELECT id, password, name, last_name, img, role_id, status_id FROM user WHERE email = ?",
      [data.email],
    );

    // User?
    if (!user) {
      return { success: false, error: AUTH_CODES.USER_NOT_FOUND };
    }

    // Status Valid
    if (user.status_id === 0) {
      return { success: false, error: AUTH_CODES.INACTIVE_USER };
    }

    // Password Valid
    const isValid = await bcrypt.compare(data.password, user.password);

    if (!isValid) {
      return { success: false, error: AUTH_CODES.INCORRECT_PASSWORD };
    }

    return {
      success: true,
      result: {
        id: user.id,
        name: user.name,
        last_name: user.last_name,
        img: user.img,
        role_id: user.role_id,
        status_id: user.status_id,
      },
    };
  } catch (error) {
    console.error("❌ Error login:", error);
    return { success: false, error: error.message };
  }
}

// Recovery Password
async function insertNewPassword(email, newPass) {
  try {
    const hashedPassword = await bcrypt.hash(newPass, 10);

    // Search User
    const user = await queryAll(
      "SELECT id, password, name, last_name, role_id, status_id FROM user WHERE email = ?",
      [email],
    );

    // User?
    if (!user) {
      return { success: false, error: AUTH_CODES.USER_NOT_FOUND };
    }

    // Status Valid
    if (user.status_id === 0) {
      return { success: false, error: AUTH_CODES.INACTIVE_USER };
    }

    // Password Update
    runQuery("UPDATE user SET password = ? WHERE email = ?", [
      hashedPassword,
      email,
    ]);

    const rowsModified = db.getRowsModified();

    if (rowsModified > 0) {
      await saveDB(db);
      return { success: true };
    } else {
      return { success: false, error: "❌ Database could not be updated" };
    }
  } catch (error) {
    console.error("❌ Error recovery password:", error);
    return true;
  }
}

module.exports = { getInstallDate, addAdmin, loginUser, insertNewPassword };
