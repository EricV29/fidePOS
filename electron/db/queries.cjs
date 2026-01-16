const { log } = require("console");
const { initDatabase, saveDB } = require("./database.cjs");
const bcrypt = require("bcrypt");
const { success } = require("zod");

let dbInstance = null;

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

// Inicializa o reutiliza la DB
async function getDB() {
  if (!dbInstance) {
    dbInstance = await initDatabase();
  }
  return dbInstance;
}

// First Run
async function firstRun() {
  try {
    const db = await getDB();
    const result = db.exec("SELECT COUNT(*) as total FROM user");
    const rows = mapResultToObjects(result);
    console.log(rows);

    return rows[0]?.total === 0;
  } catch (error) {
    console.error("Error checking first run:", error);
    return true;
  }
}

// Get Roles
async function getRoles() {
  const db = await getDB();
  const result = db.exec("SELECT id, code, description, created_at FROM rol;");
  return mapResultToObjects(result);
}

// Add Admin
async function addAdmin(data) {
  try {
    const db = await getDB();
    const hashedPassword = await bcrypt.hash(data.password, 10);
    db.run(
      "INSERT INTO user(name, lastname, email, phone, password, rol_id, status_id) VALUES(?, ?, ?, ?, ?, ?, ?)",
      [data.name, data.lastname, data.email, data.phone, hashedPassword, 1, 1]
    );

    saveDB(db);
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
      "SELECT id, password, name, lastname, rol_id, status_id FROM user WHERE email = ?",
      [data.email]
    );

    const users = mapResultToObjects(query);
    const user = users[0];

    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Status Valid
    if (user.status_id === 0 || user.status_id === "0") {
      return { success: false, error: "Inactive user" };
    }

    // Password Valid
    const isValid = await bcrypt.compare(data.password, user.password);

    if (!isValid) {
      return { success: false, error: "Incorrect Password" };
    }

    return {
      success: true,
      data: {
        id: user.id,
        name: user.name,
        lastname: user.lastname,
        rol_id: user.rol_id,
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
      "SELECT id, password, name, lastname, rol_id, status_id FROM user WHERE email = ?",
      [email]
    );

    const users = mapResultToObjects(query);
    const user = users[0];

    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Status Valid
    if (user.status_id === 0 || user.status_id === "0") {
      return { success: false, error: "Inactive user" };
    }

    // Password Update
    db.run("UPDATE user SET password = ? WHERE email = ?", [
      hashedPassword,
      email,
    ]);

    const rowsModified = db.getRowsModified();

    if (rowsModified > 0) {
      saveDB(db);
      return { success: true, message: "Password updated successfully" };
    } else {
      return { success: false, error: "Database could not be updated" };
    }
  } catch (error) {
    console.error("Error recovery password:", error);
    return true;
  }
}

module.exports = {
  getRoles,
  firstRun,
  addAdmin,
  loginUser,
  insertNewPassword,
};
