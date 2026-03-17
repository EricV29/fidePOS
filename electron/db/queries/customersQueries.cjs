const {
  getDB,
  saveDB,
  queryAll,
  runQuery,
  queryOne,
} = require("../database.cjs");
const AUTH_CODES = require("../../../constants/authCodes.json");

//* CREATE ----------

// Add Customer
async function addCustomer(data) {
  try {
    const { name, last_name, phone } = data;

    // Search Customer
    const customersFound = await queryAll(
      "SELECT phone FROM customer WHERE phone = ? AND deleted_at IS NULL;",
      [phone],
    );

    if (customersFound.length > 0) {
      for (const customer of customersFound) {
        if (customer.phone === phone) {
          return { success: false, error: AUTH_CODES.PHONE_USED };
        }
      }
    }

    runQuery(
      "INSERT INTO customer(name, last_name, phone, status_id) VALUES(?, ?, ?, 1)",
      [name, last_name, phone],
    );

    return { success: true, result: AUTH_CODES.ADD_CUSTOMER };
  } catch (error) {
    console.error("❌ Error inserting customer:", error);
    return { success: false, error: error.message };
  }
}

//* READ ----------

// Get Accounts Receivable
async function getAccountsReceivable(filters) {
  try {
    const start = filters?.startDate || "";
    const end = filters?.endDate || "";
    let accountsReceivable = "";
    let whereClause = "";

    if (filters) {
      whereClause = `AND s.created_at BETWEEN '${start} 00:00:00' AND '${end} 23:59:59'`;

      accountsReceivable = await queryAll(`
        SELECT 
          s.id AS idSale,
          cu.id AS idCustomer,
          cu.name,
          cu.last_name,
          GROUP_CONCAT(p.code_sku, ', ') AS code_sku, 
          s.total_amount AS debt_amount, 
          IFNULL((
              SELECT SUM(py.amount) 
              FROM payment py 
              WHERE py.sale_id = s.id 
                AND py.created_at <= ${end}
          ), 0) AS debt_paid,
          (s.total_amount - IFNULL((
              SELECT SUM(py.amount) 
              FROM payment py 
              WHERE py.sale_id = s.id 
                AND py.created_at <= ${end}
          ), 0)) AS debt_pending, 
          s.created_at 
        FROM sale_detail sd 
        INNER JOIN sale s ON sd.sale_id = s.id
        INNER JOIN product p ON sd.product_id = p.id
        INNER JOIN customer cu ON s.customer_id = cu.id
        WHERE sd.status_id = 5 ${whereClause}
          AND s.deleted_at IS NULL
        GROUP BY s.id
        HAVING debt_pending > 0
        ORDER BY s.created_at DESC;
      `);
    } else {
      accountsReceivable = await queryAll(
        `SELECT * FROM v_accounts_receivable`,
      );
    }

    if (accountsReceivable.length === 0) {
      return { success: true, result: [] };
    }

    return { success: true, result: accountsReceivable };
  } catch (error) {
    console.error("❌ Error getting accounts receivable:", error);
    return { success: false, error: error.message };
  }
}

// Get Indebted Customers
async function getIndebtedCustomers() {
  try {
    const indebtedCustomers = await queryAll(
      `SELECT id, name, last_name FROM customer WHERE status_id = 3;`,
    );

    if (indebtedCustomers.length === 0) {
      return { success: true, result: [] };
    }

    return { success: true, result: indebtedCustomers };
  } catch (error) {
    console.error("❌ Error getting indebted customers:", error);
    return { success: false, error: error.message };
  }
}

// Get Customer Debts
async function getCustomerDebts(idCustomer) {
  try {
    const customerDebts = await queryAll(
      `
      SELECT 
        s.id,
        GROUP_CONCAT('(' || sd.quantity || ') ' || p.name, ' | ') || ' = $' || (s.total_amount - s.paid_amount) AS customer_debt
      FROM sale_detail sd
      INNER JOIN sale s ON sd.sale_id = s.id 
      INNER JOIN product p ON sd.product_id = p.id 
      WHERE s.customer_id = ? AND sd.status_id = 5
      GROUP BY s.id;
    ;`,
      [idCustomer],
    );

    if (customerDebts.length === 0) {
      return { success: true, result: [] };
    }

    return { success: true, result: customerDebts };
  } catch (error) {
    console.error("❌ Error getting customer debts:", error);
    return { success: false, error: error.message };
  }
}

// Get Customers
async function getCustomersList() {
  try {
    const customers = await queryAll(
      "SELECT id, name, last_name, phone, status_id, created_at FROM customer WHERE status_id IN (1, 3);",
    );

    if (customers.length === 0) {
      return { success: true, result: [] };
    }

    return { success: true, result: customers };
  } catch (error) {
    console.error("❌ Error getting customers:", error);
    return { success: false, error: error.message };
  }
}

// Get Customers Number
async function getCustomersNumber() {
  try {
    const customersNumber = await queryAll(`SELECT * FROM v_customers_number;`);

    if (customersNumber.length === 0) {
      return { success: true, result: [] };
    }

    return { success: true, result: customersNumber };
  } catch (error) {
    console.error("❌ Error getting customers number:", error);
    return { success: false, error: error.message };
  }
}

// Get Customers In Debt Number
async function getCustomersInDebtNumber() {
  try {
    const customersInDebtNumber = await queryAll(
      `SELECT * FROM v_customers_in_debt_number;`,
    );

    if (customersInDebtNumber.length === 0) {
      return { success: true, result: [] };
    }

    return { success: true, result: customersInDebtNumber };
  } catch (error) {
    console.error("❌ Error getting customers in debt number:", error);
    return { success: false, error: error.message };
  }
}

// Get Last Customer Name Paid
async function getLastCustomerNamePaid() {
  try {
    const lastCustomerPaid = await queryAll(
      `SELECT * FROM v_last_customer_name_paid;`,
    );

    if (lastCustomerPaid.length === 0) {
      return { success: true, result: [] };
    }

    return { success: true, result: lastCustomerPaid };
  } catch (error) {
    console.error("❌ Error getting last customer name paid:", error);
    return { success: false, error: error.message };
  }
}

// Get Customers Table
async function getCustomersTable(limit, offset) {
  try {
    const customers = await queryAll(
      `
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
      `,
      [limit, offset],
    );

    const totalCount = await queryOne(
      `SELECT COUNT(*) as total FROM customer;`,
    );

    if (customers.length === 0) {
      return { success: true, result: [] };
    }

    return { success: true, result: customers, totalCount: totalCount };
  } catch (error) {
    console.error("❌ Error getting customers table:", error);
    return { success: false, error: error.message };
  }
}

// Get Filter Search Table Customers
async function getFilterSearchCustomers(data) {
  try {
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

    const rows = await queryAll(sql, [searchTerm]);

    return { success: true, result: rows };
  } catch (error) {
    console.error("❌ Error getting filter search table customers:", error);
    return { success: false, error: error.message };
  }
}

// Get Customers Select
async function getCustomersSelect(filters) {
  try {
    const start = filters?.startDate || "";
    const end = filters?.endDate || "";
    let customers = "";
    let whereClause = "";

    if (filters) {
      whereClause = `WHERE created_at BETWEEN '${start} 00:00:00' AND '${end} 23:59:59'`;

      customers = await queryAll(`
        SELECT id, name, last_name
          FROM customer
          ${whereClause};
      `);
    } else {
      customers = await queryAll(`SELECT * FROM v_customers_select`);
    }

    if (customers.length === 0) {
      return { success: true, result: [] };
    }

    return { success: true, result: customers };
  } catch (error) {
    console.error("❌ Error getting customers select:", error);
    return { success: false, error: error.message };
  }
}

// Get Customer Debts Number
async function getCustomerDebtsNumber(id) {
  try {
    const customerDebtsNumber = await queryOne(
      `
        SELECT
          COUNT(id) AS customerDebtsNumber
        FROM sale
        WHERE status_id = 5 AND customer_id = ?;
      `,
      [id],
    );

    if (customerDebtsNumber.length === 0) {
      return { success: true, result: [] };
    }

    return { success: true, result: customerDebtsNumber };
  } catch (error) {
    console.error("❌ Error getting customer debts number:", error);
    return { success: false, error: error.message };
  }
}

// Get Customer Payments Number
async function getCustomerPaymentsNumber(id) {
  try {
    const customerPaymentsNumber = await queryOne(
      `
      SELECT 
        COUNT(p.id) AS customerPaymentsNumber
      FROM payment p
      INNER JOIN sale s ON p.sale_id = s.id
      WHERE s.customer_id = ?;
      `,
      [id],
    );

    if (customerPaymentsNumber.length === 0) {
      return { success: true, result: [] };
    }

    return { success: true, result: customerPaymentsNumber };
  } catch (error) {
    console.error("❌ Error getting customer payments number:", error);
    return { success: false, error: error.message };
  }
}

// Get Customer Total Debt Amount
async function getCustomerTotalDebtAmount(id) {
  try {
    const customerTotalDebtAmount = await queryOne(
      `
      SELECT SUM(customerDebtsAmountSale) AS customerTotalDebtAmount
      FROM (
          SELECT (s.total_amount - s.paid_amount) AS customerDebtsAmountSale
          FROM sale s
          INNER JOIN payment p ON s.id = p.sale_id
          WHERE s.status_id = 5 AND s.customer_id = ?
          GROUP BY s.id
      ) AS customerDebtsAmountSale;
      `,
      [id],
    );

    if (customerTotalDebtAmount.length === 0) {
      return { success: true, result: [] };
    }

    return { success: true, result: customerTotalDebtAmount };
  } catch (error) {
    console.error("❌ Error getting customer total debt amount:", error);
    return { success: false, error: error.message };
  }
}

// Get Customer Total Payment Amount
async function getCustomerTotalPaymentAmount(id) {
  try {
    const customerTotalPaymentAmount = await queryOne(
      `
      SELECT 
        SUM(p.amount) AS customerTotalPaymentAmount
      FROM payment p
      INNER JOIN sale s ON p.sale_id  = s.id
      WHERE s.status_id = 5 AND s.customer_id = ?;
      `,
      [id],
    );

    if (customerTotalPaymentAmount.length === 0) {
      return { success: true, result: [] };
    }

    return { success: true, result: customerTotalPaymentAmount };
  } catch (error) {
    console.error("❌ Error getting customer total payment amount:", error);
    return { success: false, error: error.message };
  }
}

// Get Customer Debts Table
async function getCustomerDebtsTable(id, limit, offset, filters) {
  try {
    const start = filters?.startDate || "";
    const end = filters?.endDate || "";

    if (!filters) {
      const customerDebts = await queryAll(
        `
      SELECT
        s.id, 
        s.sale_num,
        GROUP_CONCAT(p.code_sku,'|') AS codes_sku, 
        GROUP_CONCAT(p.name,'|') AS products, 
        GROUP_CONCAT(p.description,'|') AS descriptions, 
        (s.total_amount - s.paid_amount) AS debt_amount, 
        s.total_amount AS sale_total, 
        s.paid_amount AS debt_paid, 
        s.created_at 
      FROM sale_detail sd
      INNER JOIN sale s ON sd.sale_id = s.id
      INNER JOIN product p ON sd.product_id = p.id 
      WHERE sd.status_id = 5 AND s.customer_id = ?
      GROUP BY s.id
      ORDER BY s.created_at DESC
      LIMIT ? OFFSET ?;
      `,
        [id, limit, offset],
      );

      const totalCount = await queryOne(
        `
      SELECT 
        COUNT(*) as total 
          FROM (
            SELECT s.id
          FROM sale_detail sd
          INNER JOIN sale s ON sd.sale_id = s.id
          WHERE sd.status_id = 5 AND s.customer_id = ?
          GROUP BY s.id);
    `,
        [id],
      );

      if (customerDebts.length === 0) {
        return { success: true, result: [] };
      }

      return { success: true, result: customerDebts, totalCount: totalCount };
    } else {
      whereClause = `WHERE sd.status_id = 5 AND s.customer_id = ${id} AND s.created_at BETWEEN '${start} 00:00:00' AND '${end} 23:59:59'`;

      const customerDebts = await queryAll(
        `
        SELECT
          s.id, 
          s.sale_num,
          GROUP_CONCAT(p.code_sku,'|') AS codes_sku, 
          GROUP_CONCAT(p.name,'|') AS products, 
          GROUP_CONCAT(p.description,'|') AS descriptions, 
          (s.total_amount - s.paid_amount) AS debt_amount, 
          s.total_amount AS sale_total, 
          s.paid_amount AS debt_paid, 
          s.created_at 
        FROM sale_detail sd
        INNER JOIN sale s ON sd.sale_id = s.id
        INNER JOIN product p ON sd.product_id = p.id 
        ${whereClause}
        GROUP BY s.id
        ORDER BY s.created_at DESC;
      `,
      );

      if (customerDebts.length === 0) {
        return { success: true, result: [] };
      }

      return { success: true, result: customerDebts };
    }
  } catch (error) {
    console.error("❌ Error getting customer debts table:", error);
    return { success: false, error: error.message };
  }
}

// Get Filter Search Table Customers Debts (Customers -> Payments)
async function getFilterSearchCustomersDebts(data) {
  try {
    const { column, text } = data;
    const allowedColumns = [
      "sale_num",
      "codes_sku",
      "products",
      "descriptions",
      "debt_amount",
      "sale_total",
      "debt_paid",
      "created_at",
    ];

    let whereClause = "";
    let targetColumn = allowedColumns.includes(column) ? column : "sale_num";

    if (targetColumn === "codes_sku") {
      targetColumn = "codes_sku";
      whereClause = `${targetColumn} LIKE ?`;
    } else if (targetColumn === "products") {
      targetColumn = "products";
      whereClause = `${targetColumn} LIKE ?`;
    } else if (targetColumn === "descriptions") {
      targetColumn = "descriptions";
      whereClause = `${targetColumn} LIKE ?`;
    } else if (targetColumn === "debt_amount") {
      targetColumn = "(s.total_amount - s.paid_amount)";
      whereClause = `${targetColumn} LIKE ?`;
    } else if (targetColumn === "sale_total") {
      targetColumn = "s.total_amount";
      whereClause = `${targetColumn} LIKE ?`;
    } else if (targetColumn === "debt_paid") {
      targetColumn = "s.paid_amount";
      whereClause = `${targetColumn} LIKE ?`;
    } else {
      whereClause = `s.${targetColumn} LIKE ?`;
    }

    const sql = `
      SELECT
        s.id, 
        s.sale_num,
        GROUP_CONCAT(p.code_sku,'|') AS codes_sku, 
        GROUP_CONCAT(p.name,'|') AS products, 
        GROUP_CONCAT(p.description,'|') AS descriptions, 
        (s.total_amount - s.paid_amount) AS debt_amount, 
        s.total_amount AS sale_total, 
        s.paid_amount AS debt_paid, 
        s.created_at 
      FROM sale_detail sd
      INNER JOIN sale s ON sd.sale_id = s.id
      INNER JOIN product p ON sd.product_id = p.id 
      WHERE sd.status_id = 5 AND s.customer_id = 1
      GROUP BY s.id
      HAVING ${whereClause}
      ORDER BY s.created_at DESC;
      `;

    const searchTerm = `%${text}%`;

    const rows = await queryAll(sql, [searchTerm]);

    return { success: true, result: rows };
  } catch (error) {
    console.error(
      "❌ Error getting filter search table customers debts:",
      error,
    );
    return { success: false, error: error.message };
  }
}

// Get Customer Payments Table
async function getCustomerPaymentsTable(id, limit, offset, filters) {
  try {
    const start = filters?.startDate || "";
    const end = filters?.endDate || "";

    if (!filters) {
      const customerPayments = await queryAll(
        `
      SELECT 
	      p.id, 
        p.created_at, 
        s.sale_num, 
        p.amount, 
        p.note
      FROM payment p
      INNER JOIN sale s ON p.sale_id = s.id
      WHERE s.customer_id = ?
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?;
      `,
        [id, limit, offset],
      );

      const totalCount = await queryOne(
        `
      SELECT 
	      COUNT(*) as total 
	        FROM (
            SELECT 
            p.id, 
            p.created_at, 
            s.sale_num, 
            p.amount, 
            p.note
          FROM payment p
          INNER JOIN sale s ON p.sale_id = s.id
          WHERE s.customer_id = ?);
    `,
        [id],
      );

      if (customerPayments.length === 0) {
        return { success: true, result: [] };
      }

      return {
        success: true,
        result: customerPayments,
        totalCount: totalCount,
      };
    } else {
      whereClause = `WHERE s.customer_id = ${id} AND s.created_at BETWEEN '${start} 00:00:00' AND '${end} 23:59:59'`;

      const customerPayments = await queryAll(`
      SELECT 
	      p.id, 
        p.created_at, 
        s.sale_num, 
        p.amount, 
        p.note
      FROM payment p
      INNER JOIN sale s ON p.sale_id = s.id
      ${whereClause}
      ORDER BY p.created_at DESC;
      `);

      if (customerPayments.length === 0) {
        return { success: true, result: [] };
      }

      return { success: true, result: customerPayments };
    }
  } catch (error) {
    console.error("❌ Error getting customer payments table:", error);
    return { success: false, error: error.message };
  }
}

// Get Filter Search Table Customers Payments (Customers -> Payments)
async function getFilterSearchCustomersPayments(data) {
  try {
    const { column, text } = data;
    const allowedColumns = ["created_at", "sale_num", "amount", "note"];

    let whereClause = "";
    let targetColumn = allowedColumns.includes(column) ? column : "created_at";

    if (targetColumn === "sale_num") {
      whereClause = `s.${targetColumn} LIKE ?`;
    } else {
      whereClause = `p.${targetColumn} LIKE ?`;
    }

    const sql = `
     SELECT 
        p.id, 
        p.created_at, 
        s.sale_num, 
        p.amount, 
        p.note
      FROM payment p
      INNER JOIN sale s ON p.sale_id = s.id
      WHERE ${whereClause}
      ORDER BY p.created_at DESC;
      `;

    const searchTerm = `%${text}%`;

    const rows = await queryAll(sql, [searchTerm]);

    return { success: true, result: rows };
  } catch (error) {
    console.error(
      "❌ Error getting filter search table customers payments:",
      error,
    );
    return { success: false, error: error.message };
  }
}

// Get All Customers
async function getAllCustomers(filters) {
  try {
    const start = filters?.startDate || "";
    const end = filters?.endDate || "";
    let customers = "";
    let whereClause = "";

    if (filters) {
      whereClause = `WHERE c.created_at BETWEEN '${start} 00:00:00' AND '${end} 23:59:59'`;

      customers = await queryAll(`
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
        ORDER BY c.created_at DESC;
      `);
    } else {
      customers = await queryAll(`SELECT * FROM v_all_customers`);
    }

    if (customers.length === 0) {
      return { success: true, result: [] };
    }

    return { success: true, result: customers };
  } catch (error) {
    console.error("❌ Error getting all customers:", error);
    return { success: false, error: error.message };
  }
}

// Get All Debts by Customer
async function getAllDebtsCustomer(id) {
  try {
    const allDebtsCustomer = await queryAll(
      `
      SELECT
        s.id, 
        s.sale_num,
        GROUP_CONCAT(p.code_sku,'|') AS codes_sku, 
        GROUP_CONCAT(p.name,'|') AS products, 
        GROUP_CONCAT(p.description,'|') AS descriptions, 
        (s.total_amount - s.paid_amount) AS debt_amount, 
        s.total_amount AS sale_total, 
        s.paid_amount AS debt_paid, 
        s.created_at 
      FROM sale_detail sd
      INNER JOIN sale s ON sd.sale_id = s.id
      INNER JOIN product p ON sd.product_id = p.id 
      WHERE sd.status_id = 5 AND s.customer_id = ?
      GROUP BY s.id
      ORDER BY s.created_at DESC;
      `,
      [id],
    );

    if (allDebtsCustomer.length === 0) {
      return { success: true, result: [] };
    }

    return { success: true, result: allDebtsCustomer };
  } catch (error) {
    console.error("❌ Error getting all debts by customer:", error);
    return { success: false, error: error.message };
  }
}

// Get All Payments by Customer
async function getAllPaymentsCustomer(id) {
  try {
    const allPaymentsCustomer = await queryAll(
      `
      SELECT 
	      p.id, 
        p.created_at, 
        s.sale_num, 
        p.amount, 
        p.note
      FROM payment p
      INNER JOIN sale s ON p.sale_id = s.id
      WHERE s.customer_id = ?
      ORDER BY p.created_at DESC;
      `,
      [id],
    );

    if (allPaymentsCustomer.length === 0) {
      return { success: true, result: [] };
    }

    return { success: true, result: allPaymentsCustomer };
  } catch (error) {
    console.error("❌ Error getting all pauyments by customer:", error);
    return { success: false, error: error.message };
  }
}

// Get Customers Status
async function getCustomersStatus(filters) {
  try {
    const end = filters?.endDate || "";
    const customersStatus = await queryAll(
      `
      SELECT 
        SUM(CASE WHEN (IFNULL(total_deuda, 0) <= IFNULL(total_pagado, 0)) THEN 1 ELSE 0 END) AS Active,
        SUM(CASE WHEN (total_deuda > total_pagado) THEN 1 ELSE 0 END) AS 'In Debt'
      FROM customer c
        LEFT JOIN (
          SELECT 
              s.customer_id,
              SUM(s.total_amount - s.discount) AS total_deuda,
              (SELECT IFNULL(SUM(p.amount), 0) 
              FROM payment p 
              JOIN sale s2 ON p.sale_id = s2.id 
              WHERE s2.customer_id = s.customer_id 
                AND p.created_at <= ?) AS total_pagado
          FROM sale s
          WHERE s.created_at <= ? 
            AND s.deleted_at IS NULL
          GROUP BY s.customer_id
        ) finanzas ON c.id = finanzas.customer_id
      WHERE c.created_at <= ?
      AND (c.deleted_at IS NULL OR c.deleted_at > ?);
      `,
      [end, end, end, end],
    );

    if (customersStatus.length === 0) {
      return { success: true, result: [] };
    }

    return { success: true, result: customersStatus };
  } catch (error) {
    console.error("❌ Error getting customers status:", error);
    return { success: false, error: error.message };
  }
}

// Get Debts by Customer
async function getDebtsByCustomers(filters) {
  try {
    const start = filters?.startDate || "";
    const end = filters?.endDate || "";
    let whereClause = "";

    whereClause = `WHERE s.created_at BETWEEN '${start} 00:00:00' AND '${end} 23:59:59'`;

    const debtsCustomers = await queryAll(`
      SELECT 
        c.name AS customer,
        COUNT(CASE WHEN s.status_id = 5 THEN 1 END) AS debts
      FROM customer c
      LEFT JOIN sale s ON c.id = s.customer_id 
     ${whereClause}
      GROUP BY c.name
      ORDER BY debts DESC;
    `);

    if (debtsCustomers.length === 0) {
      return { success: true, result: [] };
    }

    return { success: true, result: debtsCustomers };
  } catch (error) {
    console.error("❌ Error getting debts by customer:", error);
    return { success: false, error: error.message };
  }
}

//* UPDATE ----------

// Edit Customer
async function editCustomer(data) {
  try {
    const db = await getDB();
    const { id, name, last_name, phone } = data;

    // Search Customer
    const customerFound = await queryAll(
      "SELECT id, phone, status_id FROM customer WHERE id = ?;",
      [id],
    );

    // Customer?
    if (!customerFound) {
      return { success: false, error: AUTH_CODES.CUSTOMER_NOT_FOUND };
    }

    // Status?
    if (customerFound.status_id === 0) {
      return { success: false, error: AUTH_CODES.INACTIVE_CUSTOMER };
    }

    // Search Phone
    const phoneFound = await queryAll(
      "SELECT id FROM customer WHERE phone = ? AND id != ?;",
      [phone, id],
    );

    // Phone?
    if (phoneFound.length > 0) {
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
    console.error("❌ Error editing customer:", error);
    return { success: false, error: error.message };
  }
}

// Active Customer
async function activeCustomer(id) {
  try {
    // Search Customer
    const customerFound = await queryAll(
      "SELECT id, status_id FROM customer WHERE id = ?",
      [id],
    );

    // Customer?
    if (!customerFound) {
      return { success: false, error: AUTH_CODES.CUSTOMER_NOT_FOUND };
    }

    // Status?
    if (!customerFound.status_id === 0) {
      return { success: false, error: AUTH_CODES.ACTIVE_CUSTOMER };
    }

    runQuery(
      "UPDATE customer SET deleted_at = null, status_id = 1 WHERE id = ?",
      [id],
    );

    return { success: true, result: AUTH_CODES.RESTORE_CUSTOMER };
  } catch (error) {
    console.error("❌ Error active customer:", error);
    return { success: false, error: error.message };
  }
}

//* DELETE ----------

// Delete Customer
async function deleteCustomer(id) {
  try {
    // Search Customer
    const customerFound = await queryAll(
      "SELECT id, status_id FROM customer WHERE id = ?",
      [id],
    );

    // Customer?
    if (!customerFound) {
      return { success: false, error: AUTH_CODES.CUSTOMER_NOT_FOUND };
    }

    // Status?
    if (customerFound.status_id === 0 || customerFound.status_id === 3) {
      return { success: false, error: AUTH_CODES.INACTIVE_CUSTOMER };
    }

    runQuery(
      "UPDATE customer SET deleted_at = CURRENT_TIMESTAMP, status_id = 0 WHERE id = ?",
      [id],
    );

    return { success: true, result: AUTH_CODES.DELETE_CUSTOMER };
  } catch (error) {
    console.error("❌ Error deleting customer:", error);
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
  getCustomersSelect,
  getCustomerDebtsNumber,
  getCustomerPaymentsNumber,
  getCustomerTotalDebtAmount,
  getCustomerTotalPaymentAmount,
  getCustomerDebtsTable,
  getCustomerPaymentsTable,
  getFilterSearchCustomersDebts,
  getFilterSearchCustomersPayments,
  getAllCustomers,
  getAllDebtsCustomer,
  getAllPaymentsCustomer,
  activeCustomer,
  getCustomersStatus,
  getDebtsByCustomers,
};
