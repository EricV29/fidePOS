const { initDatabase, saveDB } = require("./database.cjs");
const bcrypt = require("bcrypt");
const AUTH_CODES = require("../../constants/authCodes.json");

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
      saveDB(db);
      return { success: true };
    } else {
      return { success: false, error: "Database could not be updated" };
    }
  } catch (error) {
    console.error("Error recovery password:", error);
    return true;
  }
}

// Add User
async function addUser(data) {
  try {
    const db = await getDB();
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Search Users
    const query = db.exec(
      "SELECT email, phone FROM user WHERE (email = ? OR phone = ?) AND deleted_at IS NULL",
      [data.email, data.phone],
    );

    const usersFound = mapResultToObjects(query);

    if (usersFound.length > 0) {
      for (const user of usersFound) {
        if (user.email === data.email) {
          return { success: false, error: AUTH_CODES.EMAIL_USED };
        }
        if (user.phone === data.phone) {
          return { success: false, error: AUTH_CODES.PHONE_USED };
        }
      }
    }

    db.run(
      "INSERT INTO user(name, last_name, email, phone, password, img, role_id, status_id) VALUES(?, ?, ?, ?, ?, ?, ?, ?)",
      [
        data.name,
        data.last_name,
        data.email,
        data.phone,
        hashedPassword,
        null,
        2,
        1,
      ],
    );

    saveDB(db);
    return { success: true, result: AUTH_CODES.ADD_USER };
  } catch (error) {
    console.error("Error inserting user:", error);
    return { success: false, error: error.message };
  }
}

// Get Users
async function getUsers() {
  try {
    const db = await getDB();
    const query = db.exec(
      "SELECT u.id, u.name, u.last_name, u.email, u.phone, u.img, r.description AS role, s.description AS status, u.created_at, u.deleted_at FROM user AS u INNER JOIN role AS r ON u.role_id = r.id INNER JOIN status AS s ON u.status_id = s.id;",
    );

    if (query.length === 0) {
      return { success: true, result: [] };
    }

    const users = mapResultToObjects(query);

    return { success: true, result: users };
  } catch (error) {
    console.error("Error getting users:", error);
    return { success: false, error: error.message };
  }
}

// Delete User
async function deleteUser(data) {
  try {
    const db = await getDB();

    // Search User
    const query = db.exec(
      "SELECT id, role_id, status_id FROM user WHERE id = ?",
      [data],
    );

    const users = mapResultToObjects(query);
    const userFound = users[0];

    // User?
    if (!userFound) {
      return { success: false, error: AUTH_CODES.USER_NOT_FOUND };
    }

    // Role?
    if (userFound.role_id === 1) {
      return { success: false, error: AUTH_CODES.UNAUTHORIZED };
    }

    // Status?
    if (userFound.status_id === 0) {
      return { success: false, error: AUTH_CODES.INACTIVE_USER };
    }

    db.run(
      "UPDATE user SET deleted_at = CURRENT_TIMESTAMP, status_id = 0 WHERE id = ?",
      [data],
    );

    saveDB(db);
    return { success: true, result: AUTH_CODES.DELETE_USER };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error: error.message };
  }
}

// Edit User
async function editUser(data) {
  try {
    const db = await getDB();

    // Search User
    const query = db.exec(
      "SELECT id, email, role_id, status_id FROM user WHERE id = ?",
      [data.id],
    );

    const user = mapResultToObjects(query);
    const userFound = user[0];

    // User?
    if (!userFound) {
      return { success: false, error: AUTH_CODES.USER_NOT_FOUND };
    }

    // Status?
    if (userFound.status_id === 0) {
      return { success: false, error: AUTH_CODES.INACTIVE_USER };
    }

    // Search Users
    const users = db.exec(
      "SELECT email, phone FROM user WHERE (email = ? OR phone = ?) AND deleted_at IS NULL AND id != ?",
      [data.email, data.phone, data.id],
    );

    const usersFound = mapResultToObjects(users);

    if (usersFound.length > 0) {
      for (const user of usersFound) {
        if (user.email === data.email) {
          return { success: false, error: AUTH_CODES.EMAIL_USED };
        }
        if (user.phone === data.phone) {
          return { success: false, error: AUTH_CODES.PHONE_USED };
        }
      }
    }

    db.run(
      "UPDATE user SET name = ?, last_name = ?, email = ?, phone = ? WHERE id = ?",
      [data.name, data.last_name, data.email, data.phone, data.id],
    );

    saveDB(db);
    return { success: true, result: AUTH_CODES.EDIT_USER };
  } catch (error) {
    console.error("Error editing user:", error);
    return { success: false, error: error.message };
  }
}

// Change Password
async function changePassword(data) {
  try {
    const db = await getDB();
    const hashedPassword = await bcrypt.hash(data.newPass, 10);

    // Search User
    const query = db.exec(
      "SELECT id, password, role_id, status_id FROM user WHERE id = ?",
      [data.id],
    );

    const user = mapResultToObjects(query);
    const userFound = user[0];

    // User?
    if (!userFound) {
      return { success: false, error: AUTH_CODES.USER_NOT_FOUND };
    }

    // Status?
    if (userFound.status_id === 0) {
      return { success: false, error: AUTH_CODES.INACTIVE_USER };
    }

    // Password Valid
    const isValid = await bcrypt.compare(data.currentPass, userFound.password);

    if (!isValid) {
      return { success: false, error: AUTH_CODES.INCORRECT_PASSWORD };
    }

    // Update Password
    db.run("UPDATE user SET password = ? WHERE id = ?", [
      hashedPassword,
      data.id,
    ]);

    saveDB(db);
    return { success: true, result: AUTH_CODES.CHANGE_PASS };
  } catch (error) {
    console.error("Error change password user:", error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  firstRun,
  addAdmin,
  loginUser,
  insertNewPassword,
  addUser,
  getUsers,
  deleteUser,
  editUser,
  changePassword,
};
