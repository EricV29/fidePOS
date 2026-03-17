const { getDB, saveDB } = require("../database.cjs");
const bcrypt = require("bcrypt");
const AUTH_CODES = require("../../../constants/authCodes.json");

//* Mapping results
function mapResultToObjects(result) {
  if (!result[0]) return [];

  const columns = result[0].columns;
  const values = result[0].values;

  return values.map((row) => {
    const obj = {};
    row.forEach((val, i) => {
      obj[columns[i]] = val;
    });
    return obj;
  });
}

// First Run
async function firstRun() {
  try {
    const db = await getDB();
    const result = db.exec("SELECT COUNT(*) as total FROM user");
    const rows = mapResultToObjects(result);

    return rows[0]?.total === 0;
  } catch (error) {
    console.error("Error checking first run:", error);
    return true;
  }
}

// Add Admin
async function addAdmin(data) {
  try {
    const db = await getDB();
    const hashedPassword = await bcrypt.hash(data.password, 10);
    db.run(
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

    await saveDB(db);
    return { success: true };
  } catch (error) {
    console.error("Error inserting admin:", error);
    return { success: false, error: error.message };
  }
}

// Login
async function loginUser(data) {
  try {
    const db = await getDB();

    // Search User
    const query = db.exec(
      "SELECT id, password, name, last_name, img, role_id, status_id FROM user WHERE email = ?",
      [data.email],
    );

    const users = mapResultToObjects(query);
    const user = users[0];

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
    console.error("Error login:", error);
    return { success: false, error: error.message };
  }
}

// Recovery Password
async function insertNewPassword(email, newPass) {
  try {
    const db = await getDB();
    const hashedPassword = await bcrypt.hash(newPass, 10);

    // Search User
    const query = db.exec(
      "SELECT id, password, name, last_name, role_id, status_id FROM user WHERE email = ?",
      [email],
    );

    const users = mapResultToObjects(query);
    const user = users[0];

    // User?
    if (!user) {
      return { success: false, error: AUTH_CODES.USER_NOT_FOUND };
    }

    // Status Valid
    if (user.status_id === 0) {
      return { success: false, error: AUTH_CODES.INACTIVE_USER };
    }

    // Password Update
    db.run("UPDATE user SET password = ? WHERE email = ?", [
      hashedPassword,
      email,
    ]);

    const rowsModified = db.getRowsModified();

    if (rowsModified > 0) {
      await saveDB(db);
      return { success: true };
    } else {
      return { success: false, error: "Database could not be updated" };
    }
  } catch (error) {
    console.error("Error recovery password:", error);
    return true;
  }
}

module.exports = {
  firstRun,
  addAdmin,
  loginUser,
  insertNewPassword,
};
