const { getDB, saveDB, mapResultToObjects } = require("../database.cjs");
const bcrypt = require("bcrypt");
const AUTH_CODES = require("../../../constants/authCodes.json");

// Get Accounts Receivable
async function getAccountsReceivable() {
  try {
    const db = await getDB();
    const sql = `SELECT * FROM v_accounts_receivable`;

    const query = db.exec(sql);

    if (query.length === 0) {
      return { success: true, result: [] };
    }

    const data = mapResultToObjects(query);
    return { success: true, result: data };
  } catch (error) {
    console.error("Error getting accounts receivable:", error);
    return { success: false, error: error.message };
  }
}

// Get Indebted Customers
async function getIndebtedCustomers() {
  try {
    const db = await getDB();
    const sql = `SELECT id, name, last_name FROM customer WHERE status_id = 3;`;

    const query = db.exec(sql);

    if (query.length === 0) {
      return { success: true, result: [] };
    }

    const data = mapResultToObjects(query);
    return { success: true, result: data };
  } catch (error) {
    console.error("Error getting indebted customers:", error);
    return { success: false, error: error.message };
  }
}

// Get Customer Debts
async function getCustomerDebts(idCustomer) {
  try {
    const db = await getDB();
    const params = [idCustomer];
    const sql = `
      SELECT 
        s.id,
        GROUP_CONCAT('(' || sd.quantity || ') ' || p.name, ' | ') || ' = $' || (s.total_amount - s.paid_amount) AS customer_debt
      FROM sale_detail sd
      INNER JOIN sale s ON sd.sale_id = s.id 
      INNER JOIN product p ON sd.product_id = p.id 
      WHERE s.customer_id = ? AND sd.status_id = 5
      GROUP BY s.id;
    ;`;

    const query = db.exec(sql, params);

    if (query.length === 0) {
      return { success: true, result: [] };
    }

    const data = mapResultToObjects(query);
    return { success: true, result: data };
  } catch (error) {
    console.error("Error getting customer debts:", error);
    return { success: false, error: error.message };
  }
}

// Get Customers
async function getCustomersList() {
  try {
    const db = await getDB();
    const query = db.exec(
      "SELECT id, name, last_name, phone, status_id, created_at FROM customer WHERE status_id IN (1, 3);",
    );

    if (query.length === 0) {
      return { success: true, result: [] };
    }

    const data = mapResultToObjects(query);

    return { success: true, result: data };
  } catch (error) {
    console.error("Error getting customers:", error);
    return { success: false, error: error.message };
  }
}

// Add Customer
async function addCustomer(data) {
  try {
    const db = await getDB();
    const { name, last_name, phone } = data;

    // Search Customer
    const query = db.exec(
      "SELECT phone FROM customer WHERE phone = ? AND deleted_at IS NULL;",
      [phone],
    );

    const customersFound = mapResultToObjects(query);

    if (customersFound.length > 0) {
      for (const customer of customersFound) {
        if (customer.phone === phone) {
          return { success: false, error: AUTH_CODES.PHONE_USED };
        }
      }
    }

    db.run(
      "INSERT INTO customer(name, last_name, phone, status_id) VALUES(?, ?, ?, 1)",
      [name, last_name, phone],
    );

    saveDB(db);
    return { success: true, result: AUTH_CODES.ADD_CUSTOMER };
  } catch (error) {
    console.error("Error inserting customer:", error);
    return { success: false, error: error.message };
  }
}

// Get Customers Number
async function getCustomersNumber() {
  try {
    const db = await getDB();
    const sql = `SELECT * FROM v_customers_number;`;

    const query = db.exec(sql);

    if (query.length === 0) {
      return { success: true, result: [] };
    }

    const data = mapResultToObjects(query);
    return { success: true, result: data };
  } catch (error) {
    console.error("Error getting customers number:", error);
    return { success: false, error: error.message };
  }
}

// Get Customers In Debt Number
async function getCustomersInDebtNumber() {
  try {
    const db = await getDB();
    const sql = `SELECT * FROM v_customers_in_debt_number;`;

    const query = db.exec(sql);

    if (query.length === 0) {
      return { success: true, result: [] };
    }

    const data = mapResultToObjects(query);
    return { success: true, result: data };
  } catch (error) {
    console.error("Error getting customers in debt number:", error);
    return { success: false, error: error.message };
  }
}

// Get Last Customer Name Paid
async function getLastCustomerNamePaid() {
  try {
    const db = await getDB();
    const sql = `SELECT * FROM v_last_customer_name_paid;`;

    const query = db.exec(sql);

    if (query.length === 0) {
      return { success: true, result: [] };
    }

    const data = mapResultToObjects(query);
    return { success: true, result: data };
  } catch (error) {
    console.error("Error getting last customer name paid:", error);
    return { success: false, error: error.message };
  }
}

// Get Customers Table
async function getCustomersTable(limit, offset) {
  try {
    const db = await getDB();
    const params = [limit, offset];
    const sql = `
      SELECT 
        c.id,
        c.name,
        c.last_name,
        c.phone,
        s.description AS status,
        COUNT(CASE WHEN sl.status_id = 5 THEN 1 END) AS debts_number,
        SUM(CASE WHEN sl.status_id = 5 THEN total_amount ELSE 0 END) AS debts_amount,
	      SUM(CASE WHEN sl.status_id = 5 THEN paid_amount ELSE 0 END) AS debts_paid,
        c.created_at,
        c.deleted_at
      FROM customer c
      INNER JOIN status s ON c.status_id = s.id
      LEFT JOIN sale sl ON c.id = sl.customer_id
      GROUP BY c.id
      ORDER BY c.created_at DESC
      LIMIT ? OFFSET ?;
      `;

    const sqlCount = `SELECT COUNT(*) as total FROM customer;`;

    const query = db.exec(sql, params);
    const queryCount = db.exec(sqlCount);

    const totalCount = queryCount.length > 0 ? queryCount[0].values[0][0] : 0;

    if (query.length === 0) {
      return { success: true, result: [] };
    }

    const data = mapResultToObjects(query);
    return { success: true, result: data, totalCount: totalCount };
  } catch (error) {
    console.error("Error getting customers table:", error);
    return { success: false, error: error.message };
  }
}

// Get Filter Search Table Customers
async function getFilterSearchCustomers(data) {
  try {
    const db = await getDB();
    const { column, text } = data;
    const allowedColumns = [
      "customer",
      "phone",
      "status",
      "debts_number",
      "debts_amount",
      "debts_paid",
      "created_at",
      "deleted_at",
    ];

    let whereClause = "";
    let havingClause = "";
    let targetColumn = allowedColumns.includes(column) ? column : "name";

    if (targetColumn === "customer") {
      targetColumn = "c.name";
      whereClause = `WHERE ${targetColumn} LIKE ?`;
    } else if (targetColumn === "status") {
      targetColumn = "status";
      whereClause = `WHERE ${targetColumn} LIKE ?`;
    } else if (
      ["debts_number", "debts_amount", "debts_paid"].includes(targetColumn)
    ) {
      havingClause = `HAVING ${targetColumn} LIKE ?`;
    } else {
      whereClause = `WHERE c.${targetColumn} LIKE ?`;
    }

    const sql = `
      SELECT 
        c.id,
        c.name,
        c.last_name,
        c.phone,
        s.description AS status,
        COUNT(CASE WHEN sl.status_id = 5 THEN 1 END) AS debts_number,
        SUM(CASE WHEN sl.status_id = 5 THEN total_amount ELSE 0 END) AS debts_amount,
	      SUM(CASE WHEN sl.status_id = 5 THEN paid_amount ELSE 0 END) AS debts_paid,
        c.created_at,
        c.deleted_at
      FROM customer c
      INNER JOIN status s ON c.status_id = s.id
      LEFT JOIN sale sl ON c.id = sl.customer_id
      ${whereClause}
      GROUP BY c.id
      ${havingClause}
      ORDER BY c.created_at DESC
      LIMIT 10 OFFSET 0;
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
    console.error("Error getting filter search table customers:", error);
    return { success: false, error: error.message };
  }
}

// Edit Customer
async function editCustomer(data) {
  const db = await getDB();
  const { id, name, last_name, phone } = data;

  try {
    // Search Customer
    const query = db.exec(
      "SELECT id, phone, status_id FROM customer WHERE id = ?;",
      [id],
    );

    const result = mapResultToObjects(query);
    const customerFound = result[0];

    // Customer?
    if (!customerFound) {
      return { success: false, error: AUTH_CODES.CUSTOMER_NOT_FOUND };
    }

    // Status?
    if (customerFound.status_id === 0) {
      return { success: false, error: AUTH_CODES.INACTIVE_CUSTOMER };
    }

    // Search Phone
    const queryPhone = db.exec("SELECT id FROM customer WHERE phone = ?;", [
      phone,
    ]);

    const resultPhone = mapResultToObjects(queryPhone);
    const phoneFound = resultPhone[0];

    // Phone?
    if (phoneFound) {
      return { success: false, error: AUTH_CODES.PHONE_USED };
    }

    db.exec("BEGIN TRANSACTION;");

    db.run(
      "UPDATE customer SET name = ?, last_name = ?, phone = ? WHERE id = ?;",
      [name, last_name, phone, id],
    );

    db.exec("COMMIT;");
    await saveDB(db);
    return { success: true, result: AUTH_CODES.EDIT_CUSTOMER };
  } catch (error) {
    if (db) db.exec("ROLLBACK;");
    console.error("Error editing customer:", error);
    return { success: false, error: error.message };
  }
}

// Delete Customer
async function deleteCustomer(data) {
  const db = await getDB();
  try {
    // Search Customer
    const query = db.exec("SELECT id, status_id FROM customer WHERE id = ?", [
      data,
    ]);

    const customers = mapResultToObjects(query);
    const customerFound = customers[0];

    // Customer?
    if (!customerFound) {
      return { success: false, error: AUTH_CODES.CUSTOMER_NOT_FOUND };
    }

    // Status?
    if (customerFound.status_id === 0 || customerFound.status_id === 3) {
      return { success: false, error: AUTH_CODES.INACTIVE_CUSTOMER };
    }

    db.run(
      "UPDATE customer SET deleted_at = CURRENT_TIMESTAMP, status_id = 0 WHERE id = ?",
      [data],
    );

    saveDB(db);
    return { success: true, result: AUTH_CODES.DELETE_CUSTOMER };
  } catch (error) {
    console.error("Error deleting customer:", error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  getAccountsReceivable,
  getIndebtedCustomers,
  getCustomerDebts,
  getCustomersList,
  addCustomer,
  getCustomersNumber,
  getCustomersInDebtNumber,
  getLastCustomerNamePaid,
  getCustomersTable,
  getFilterSearchCustomers,
  editCustomer,
  deleteCustomer,
};
