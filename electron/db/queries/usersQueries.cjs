const { queryAll, queryOne, runQuery } = require("../database.cjs");
const bcrypt = require("bcrypt");
const AUTH_CODES = require("../../../constants/authCodes.json");

//* CREATE ----------

// Add User
async function addUser(data) {
  try {
    const { name, last_name, email, password, phone } = data;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Search Users (Validate)
    const usersFound = await queryAll(
      "SELECT email, phone FROM user WHERE (email = ? OR phone = ?) AND deleted_at IS NULL",
      [email, phone],
    );

    if (usersFound.length > 0) {
      for (const user of usersFound) {
        if (user.email === email) {
          return { success: false, error: AUTH_CODES.EMAIL_USED };
        }
        if (user.phone === phone) {
          return { success: false, error: AUTH_CODES.PHONE_USED };
        }
      }
    }

    await runQuery(
      "INSERT INTO user(name, last_name, email, phone, password, img, role_id, status_id) VALUES(?, ?, ?, ?, ?, ?, ?, ?)",
      [name, last_name, email, phone, hashedPassword, null, 2, 1],
    );

    return { success: true, result: AUTH_CODES.ADD_USER };
  } catch (error) {
    console.error("❌ Error inserting user:", error);
    return { success: false, error: error.message };
  }
}

//* READ ----------

// Get Admin
async function getAdmin() {
  try {
    const admin = await queryOne(`SELECT id FROM user WHERE role_id = 1;`);

    if (!admin) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("❌ Error getting admin:", error);
    return { success: false, error: error.message };
  }
}

// Get Users
async function getUsers(limit, offset) {
  try {
    const users = await queryAll(
      `
      SELECT 
        u.id, 
        u.name, 
        u.last_name,
        u.email, 
        u.phone, 
        u.img, 
        r.description AS role,
        s.description AS status, 
        u.created_at, 
        u.deleted_at
      FROM user u
      INNER JOIN role AS r ON u.role_id = r.id 
      INNER JOIN status AS s ON u.status_id = s.id
      ORDER BY u.created_at ASC
      LIMIT ? OFFSET ?;
    `,
      [limit, offset],
    );

    const totalRows = await queryOne(`SELECT COUNT(*) as total FROM user;`);

    if (users.length === 0) {
      return { success: true, result: [] };
    }

    return { success: true, result: users, totalCount: totalRows };
  } catch (error) {
    console.error("❌ Error getting users:", error);
    return { success: false, error: error.message };
  }
}

// Get Filter Search Table Users
async function getFilterSearchUsers(data) {
  try {
    const { column, text } = data;
    const allowedColumns = [
      "name",
      "last_name",
      "email",
      "phone",
      "role",
      "status",
      "created_at",
      "deleted_at",
    ];

    let targetColumn = allowedColumns.includes(column) ? column : "name";

    if (targetColumn === "status") targetColumn = "s.description";
    else if (targetColumn === "role") targetColumn = "r.description";
    else targetColumn = `u.${targetColumn}`;

    const sql = `
      SELECT 
        u.id, 
        u.name, 
        u.last_name,
        u.email, 
        u.phone, 
        u.img, 
        r.description AS role,
        s.description AS status, 
        u.created_at, 
        u.deleted_at
      FROM user u
      INNER JOIN role AS r ON u.role_id = r.id 
      INNER JOIN status AS s ON u.status_id = s.id
      WHERE ${targetColumn} LIKE ? 
      ORDER BY u.created_at ASC
    `;

    const searchTerm = `%${text}%`;

    const rows = await queryAll(sql, [searchTerm]);

    return { success: true, result: rows };
  } catch (error) {
    console.error("❌ Error getting filter search table users:", error);
    return { success: false, error: error.message };
  }
}

// Get Emails
async function getEmails() {
  try {
    const emails = await queryAll(
      `
      SELECT 
        u.email
      FROM user u
      WHERE u.status_id = 1
      ORDER BY u.created_at ASC;
    `,
    );

    if (emails.length === 0) {
      return { success: true, result: [] };
    }

    return { success: true, result: emails };
  } catch (error) {
    console.error("❌ Error getting emails:", error);
    return { success: false, error: error.message };
  }
}

//* UPDATE ----------

// Edit User
async function editUser(data) {
  try {
    const { id, name, last_name, email, phone } = data;

    // Search User
    const user = await queryOne(
      "SELECT id, email, role_id, status_id FROM user WHERE id = ?",
      [id],
    );

    // User?
    if (!user) {
      return { success: false, error: AUTH_CODES.USER_NOT_FOUND };
    }

    // Status?
    if (user.status_id === 0) {
      return { success: false, error: AUTH_CODES.INACTIVE_USER };
    }

    // Search Users
    const users = await queryAll(
      "SELECT email, phone FROM user WHERE (LOWER(email) = LOWER(?) OR phone = ?) AND deleted_at IS NULL AND id != ?",
      [email, phone, id],
    );

    if (users.length > 0) {
      for (const user of users) {
        if (user.email === email) {
          return { success: false, error: AUTH_CODES.EMAIL_USED };
        }
        if (user.phone === phone) {
          return { success: false, error: AUTH_CODES.PHONE_USED };
        }
      }
    }

    await runQuery(
      "UPDATE user SET name = ?, last_name = ?, email = ?, phone = ? WHERE id = ?",
      [name, last_name, email, phone, id],
    );

    return { success: true, result: AUTH_CODES.EDIT_USER };
  } catch (error) {
    console.error("❌ Error editing user:", error);
    return { success: false, error: error.message };
  }
}

// Change Password
async function changePassword(data) {
  try {
    const { id, currentPass, newPass } = data;
    const hashedPassword = await bcrypt.hash(newPass, 10);

    // Search User
    const user = await queryOne(
      "SELECT id, password, role_id, status_id FROM user WHERE id = ?",
      [id],
    );

    // User?
    if (!user) {
      return { success: false, error: AUTH_CODES.USER_NOT_FOUND };
    }

    // Status?
    if (user.status_id === 0) {
      return { success: false, error: AUTH_CODES.INACTIVE_USER };
    }

    // Password Valid
    const isValid = await bcrypt.compare(currentPass, user.password);

    if (!isValid) {
      return { success: false, error: AUTH_CODES.INCORRECT_PASSWORD };
    }

    // Update Password
    await runQuery("UPDATE user SET password = ? WHERE id = ?", [
      hashedPassword,
      id,
    ]);

    return { success: true, result: AUTH_CODES.CHANGE_PASS };
  } catch (error) {
    console.error("❌ Error change password user:", error);
    return { success: false, error: error.message };
  }
}

//* DELETE ----------

// Delete User
async function deleteUser(id) {
  try {
    // Search User
    const users = await queryOne(
      "SELECT id, role_id, status_id FROM user WHERE id = ?",
      [id],
    );

    // User?
    if (!users) {
      return { success: false, error: AUTH_CODES.USER_NOT_FOUND };
    }

    // Role?
    if (users.role_id === 1) {
      return { success: false, error: AUTH_CODES.UNAUTHORIZED };
    }

    // Status?
    if (users.status_id === 0) {
      return { success: false, error: AUTH_CODES.INACTIVE_USER };
    }

    await runQuery(
      "UPDATE user SET deleted_at = CURRENT_TIMESTAMP, status_id = 0 WHERE id = ?",
      [id],
    );

    return { success: true, result: AUTH_CODES.DELETE_USER };
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  addUser,
  getAdmin,
  getUsers,
  deleteUser,
  editUser,
  changePassword,
  getFilterSearchUsers,
  getEmails,
};
