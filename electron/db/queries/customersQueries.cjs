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
      "SELECT phone FROM customer WHERE phone = ? AND deleted_at IS NULL",
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

module.exports = {
  getAccountsReceivable,
  getIndebtedCustomers,
  getCustomerDebts,
  getCustomersList,
  addCustomer,
  getCustomersNumber,
};
